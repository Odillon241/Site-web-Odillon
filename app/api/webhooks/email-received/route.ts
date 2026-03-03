import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import {
    verifyWebhookSignature,
    sanitizeEmailHeader,
    logSecurityEvent,
    getClientIP,
    escapeHtml
} from '@/lib/security'

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
 * Limite de taille maximale pour les champs
 */
const MAX_FIELD_LENGTHS = {
  subject: 500,
  email: 254,
  name: 200,
  bodyText: 100000, // 100KB max
  bodyHtml: 500000, // 500KB max
}

/**
 * Extrait le nom et l'email d'une chaîne "Name <email@domain.com>"
 */
function parseEmailAddress(emailString: string): { name: string | null; email: string } {
  // Sanitiser l'entrée
  const sanitized = sanitizeEmailHeader(emailString)

  const match = sanitized.match(/^(.+?)\s*<(.+?)>$/)
  if (match) {
    return {
      name: match[1].trim().substring(0, MAX_FIELD_LENGTHS.name),
      email: match[2].trim().toLowerCase().substring(0, MAX_FIELD_LENGTHS.email)
    }
  }
  return {
    name: null,
    email: sanitized.trim().toLowerCase().substring(0, MAX_FIELD_LENGTHS.email)
  }
}

/**
 * Échappe les caractères spéciaux pour la recherche LIKE/ILIKE
 * Prévient l'injection de wildcards SQL
 */
function escapeLikePattern(pattern: string): string {
  return pattern
    .replace(/\\/g, '\\\\')  // Échapper les backslashes d'abord
    .replace(/%/g, '\\%')    // Échapper le wildcard %
    .replace(/_/g, '\\_')    // Échapper le wildcard _
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<string | null> {
  // Nettoyer et valider le sujet
  const cleanSubject = subject
    .replace(/^(Re|RE|Fwd|FWD):\s*/gi, '')
    .trim()
    .substring(0, MAX_FIELD_LENGTHS.subject)

  // Valider l'email
  const sanitizedEmail = fromEmail.toLowerCase().trim().substring(0, MAX_FIELD_LENGTHS.email)

  // Recherche 1: Par email de l'expéditeur avec sujet similaire
  const { data: messagesByEmail } = await supabase
    .from('contact_messages')
    .select('id, subject, email')
    .eq('email', sanitizedEmail)
    .order('created_at', { ascending: false })
    .limit(10)

  if (messagesByEmail && messagesByEmail.length > 0) {
    // Chercher une correspondance exacte du sujet (case insensitive)
    const exactMatch = (messagesByEmail as Array<{ id: string; subject: string; email: string }>).find((msg) =>
      msg.subject.toLowerCase() === cleanSubject.toLowerCase()
    )
    if (exactMatch) return exactMatch.id

    // Sinon, prendre le plus récent
    return (messagesByEmail as Array<{ id: string }>)[0].id
  }

  // Recherche 2: Par sujet seul (au cas où l'email serait différent)
  // SÉCURITÉ: Échapper le pattern pour prévenir l'injection de wildcards
  const escapedSubject = escapeLikePattern(cleanSubject)

  const { data: messagesBySubject } = await supabase
    .from('contact_messages')
    .select('id, subject, email')
    .ilike('subject', `%${escapedSubject}%`)
    .order('created_at', { ascending: false })
    .limit(1)

  if (messagesBySubject && messagesBySubject.length > 0) {
    return (messagesBySubject as Array<{ id: string }>)[0].id
  }

  return null
}

/**
 * POST /api/webhooks/email-received
 * Webhook pour recevoir les emails entrants via Resend
 *
 * Protections de sécurité implémentées :
 * - Vérification de la signature Svix
 * - Validation et sanitisation des entrées
 * - Protection contre l'injection SQL via ILIKE
 * - Limites de taille des champs
 */
export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)

  try {
    // 1. Récupérer le body brut pour la vérification de signature
    const rawBody = await request.text()

    // 2. Vérifier la taille du payload
    const maxPayloadSize = 10 * 1024 * 1024 // 10MB max (pour les pièces jointes)
    if (rawBody.length > maxPayloadSize) {
      return NextResponse.json(
        { error: 'Payload too large' },
        { status: 413 }
      )
    }

    // 3. Vérification de sécurité - Signature Svix
    const headersList = await headers()
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET

    if (webhookSecret) {
      const svixId = headersList.get('svix-id')
      const svixTimestamp = headersList.get('svix-timestamp')
      const svixSignature = headersList.get('svix-signature')

      // Construire la signature complète
      const fullSignature = svixTimestamp && svixSignature
        ? `t=${svixTimestamp},${svixSignature}`
        : null

      const isValid = await verifyWebhookSignature(rawBody, fullSignature, webhookSecret)

      if (!isValid) {
        logSecurityEvent('webhook_invalid', clientIP, 'Signature webhook invalide')
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        )
      }
    } else {
      // En production, la signature devrait être obligatoire
      console.warn('[SECURITY] RESEND_WEBHOOK_SECRET non configuré - webhook non vérifié')
    }

    // 4. Parser le body
    let body: ResendEmailReceivedEvent
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    // 5. Vérifier que c'est bien un événement email.received
    if (body.type !== 'email.received') {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      )
    }

    const emailData = body.data

    // 6. Valider les champs requis
    if (!emailData.from || !emailData.subject || !emailData.to?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 7. Parser et sanitiser l'expéditeur et le destinataire
    const from = parseEmailAddress(emailData.from)
    const toEmail = sanitizeEmailHeader(emailData.to[0] || '')
      .substring(0, MAX_FIELD_LENGTHS.email)

    // Sanitiser le sujet
    const sanitizedSubject = sanitizeEmailHeader(emailData.subject)
      .substring(0, MAX_FIELD_LENGTHS.subject)

    console.log('📧 Email reçu:', {
      from: from.email,
      to: toEmail,
      subject: sanitizedSubject.substring(0, 50),
      emailId: emailData.email_id
    })

    // 8. Créer le client Supabase avec service role
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

    // 9. Trouver le message de contact original
    const originalMessageId = await findOriginalMessage(
      from.email,
      sanitizedSubject,
      supabase
    )

    // 10. Tronquer le contenu si nécessaire
    const bodyText = emailData.text?.substring(0, MAX_FIELD_LENGTHS.bodyText) || null
    const bodyHtml = emailData.html?.substring(0, MAX_FIELD_LENGTHS.bodyHtml) || null

    if (!originalMessageId) {
      // Si on ne trouve pas de message original, on crée un nouveau message de contact
      console.log('⚠️ Aucun message original trouvé, création d\'un nouveau message de contact')

      const { data: newMessage, error: createError } = await supabase
        .from('contact_messages')
        .insert({
          name: from.name || from.email,
          email: from.email,
          subject: sanitizedSubject.replace(/^(Re|RE|Fwd|FWD):\s*/gi, '').trim(),
          message: bodyText || bodyHtml || '',
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
          subject: sanitizedSubject,
          body_text: bodyText,
          body_html: bodyHtml,
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

    // 11. Stocker la réponse dans contact_replies
    const { data: reply, error: replyError } = await supabase
      .from('contact_replies')
      .insert({
        contact_message_id: originalMessageId,
        from_email: from.email,
        from_name: from.name,
        to_email: toEmail,
        subject: sanitizedSubject,
        body_text: bodyText,
        body_html: bodyHtml,
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

    // 12. Mettre à jour le statut du message original si nécessaire
    await supabase
      .from('contact_messages')
      .update({
        status: 'replied',
        updated_at: new Date().toISOString()
      })
      .eq('id', originalMessageId)
      .eq('status', 'new') // Seulement si le statut est encore 'new'

    console.log('✅ Réponse stockée avec succès:', reply.id)

    return NextResponse.json({
      success: true,
      replyId: reply.id,
      messageId: originalMessageId
    })

  } catch (error) {
    console.error('❌ Erreur webhook email-received:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
