import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

/**
 * Structure de l'événement email.received de Resend
 * Documentation: https://resend.com/docs/dashboard/webhooks/event-types
 */
interface ResendEmailReceivedEvent {
  type: 'email.received'
  created_at: string
  data: {
    created_at: string
    email_id: string
    from: string
    subject: string
    to: string[]
    html?: string
    text?: string
    headers?: Record<string, string>
    attachments?: Array<{
      content: string
      content_type: string
      filename: string
    }>
  }
}

/**
 * Extrait le nom et l'email d'une chaîne "Name <email@domain.com>"
 */
function parseEmailAddress(emailString: string): { name: string | null; email: string } {
  const match = emailString.match(/^(.+?)\s*<(.+?)>$/)
  if (match) {
    return {
      name: match[1].trim(),
      email: match[2].trim().toLowerCase()
    }
  }
  return {
    name: null,
    email: emailString.trim().toLowerCase()
  }
}

/**
 * Trouve le message de contact original à partir de l'email
 * Recherche par :
 * 1. Email de l'expéditeur (from)
 * 2. Sujet (en cherchant "Re:" ou le sujet original)
 */
async function findOriginalMessage(
  fromEmail: string,
  subject: string,
  supabase: any
): Promise<string | null> {
  // Nettoyer le sujet pour enlever "Re:", "Fwd:", etc.
  const cleanSubject = subject
    .replace(/^(Re|RE|Fwd|FWD):\s*/i, '')
    .trim()

  // Recherche 1: Par email de l'expéditeur avec sujet similaire
  const { data: messagesByEmail } = await supabase
    .from('contact_messages')
    .select('id, subject, email')
    .eq('email', fromEmail)
    .order('created_at', { ascending: false })
    .limit(10)

  if (messagesByEmail && messagesByEmail.length > 0) {
    // Chercher une correspondance exacte du sujet
    const exactMatch = messagesByEmail.find((msg: any) =>
      msg.subject.toLowerCase() === cleanSubject.toLowerCase()
    )
    if (exactMatch) return exactMatch.id

    // Sinon, prendre le plus récent
    return messagesByEmail[0].id
  }

  // Recherche 2: Par sujet seul (au cas où l'email serait différent)
  const { data: messagesBySubject } = await supabase
    .from('contact_messages')
    .select('id, subject, email')
    .ilike('subject', `%${cleanSubject}%`)
    .order('created_at', { ascending: false })
    .limit(1)

  if (messagesBySubject && messagesBySubject.length > 0) {
    return messagesBySubject[0].id
  }

  return null
}

/**
 * POST /api/webhooks/email-received
 * Webhook pour recevoir les emails entrants via Resend
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parser le body
    const body: ResendEmailReceivedEvent = await request.json()

    // 2. Vérifier que c'est bien un événement email.received
    if (body.type !== 'email.received') {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      )
    }

    const emailData = body.data

    // 3. Vérification de sécurité optionnelle (Resend Webhook Secret)
    // Note: Pour l'instant on fait confiance, mais en production il faudrait vérifier
    // la signature svix dans les headers
    const headersList = await headers()
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET

    if (webhookSecret) {
      const signature = headersList.get('svix-signature')
      // TODO: Vérifier la signature avec svix
      // Pour l'instant, on log juste pour debug
      console.log('Webhook signature présente:', !!signature)
    }

    // 4. Parser l'expéditeur et le destinataire
    const from = parseEmailAddress(emailData.from)
    const toEmail = emailData.to[0] || ''

    console.log('📧 Email reçu:', {
      from: from.email,
      to: toEmail,
      subject: emailData.subject,
      emailId: emailData.email_id
    })

    // 5. Créer le client Supabase avec service role
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )

    // 6. Trouver le message de contact original
    const originalMessageId = await findOriginalMessage(
      from.email,
      emailData.subject,
      supabase
    )

    if (!originalMessageId) {
      // Si on ne trouve pas de message original, on crée un nouveau message de contact
      console.log('⚠️ Aucun message original trouvé, création d\'un nouveau message de contact')

      const { data: newMessage, error: createError } = await supabase
        .from('contact_messages')
        .insert({
          name: from.name || from.email,
          email: from.email,
          subject: emailData.subject.replace(/^(Re|RE|Fwd|FWD):\s*/i, '').trim(),
          message: emailData.text || emailData.html || '',
          status: 'new'
        })
        .select()
        .single()

      if (createError) {
        console.error('Erreur création nouveau message:', createError)
        return NextResponse.json(
          { error: 'Failed to create new message' },
          { status: 500 }
        )
      }

      // Stocker la réponse liée au nouveau message
      await supabase
        .from('contact_replies')
        .insert({
          contact_message_id: newMessage.id,
          from_email: from.email,
          from_name: from.name,
          to_email: toEmail,
          subject: emailData.subject,
          body_text: emailData.text || null,
          body_html: emailData.html || null,
          attachments: emailData.attachments || [],
          resend_email_id: emailData.email_id,
          message_id: emailData.headers?.['message-id'] || null,
          in_reply_to: emailData.headers?.['in-reply-to'] || null,
          direction: 'inbound'
        })

      return NextResponse.json({
        success: true,
        message: 'New contact message created',
        messageId: newMessage.id
      })
    }

    // 7. Stocker la réponse dans contact_replies
    const { data: reply, error: replyError } = await supabase
      .from('contact_replies')
      .insert({
        contact_message_id: originalMessageId,
        from_email: from.email,
        from_name: from.name,
        to_email: toEmail,
        subject: emailData.subject,
        body_text: emailData.text || null,
        body_html: emailData.html || null,
        attachments: emailData.attachments || [],
        resend_email_id: emailData.email_id,
        message_id: emailData.headers?.['message-id'] || null,
        in_reply_to: emailData.headers?.['in-reply-to'] || null,
        direction: 'inbound'
      })
      .select()
      .single()

    if (replyError) {
      console.error('Erreur lors de l\'insertion de la réponse:', replyError)
      return NextResponse.json(
        { error: 'Failed to store reply' },
        { status: 500 }
      )
    }

    // 8. Mettre à jour le statut du message original si nécessaire
    await supabase
      .from('contact_messages')
      .update({
        status: 'replied',
        updated_at: new Date().toISOString()
      })
      .eq('id', originalMessageId)
      .eq('status', 'new') // Seulement si le statut est encore 'new'

    console.log('✅ Réponse stockée avec succès:', reply.id)

    // 9. Optionnel: Envoyer une notification à l'équipe
    // TODO: Implémenter la notification par email si souhaité

    return NextResponse.json({
      success: true,
      replyId: reply.id,
      messageId: originalMessageId
    })

  } catch (error) {
    console.error('❌ Erreur webhook email-received:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/webhooks/email-received
 * Endpoint de vérification pour Resend
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook endpoint is active'
  })
}
