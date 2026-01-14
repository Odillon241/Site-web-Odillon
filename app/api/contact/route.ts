import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Types pour les données du formulaire de contact
 */
interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
}

/**
 * Fonction pour échapper les caractères HTML (sécurité XSS)
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Génère le template HTML pour l'email de notification à l'équipe
 */
function generateNotificationEmailHTML(data: ContactFormData, messageId: string): string {
  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safeSubject = escapeHtml(data.subject)
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>')
  const safePhone = data.phone ? escapeHtml(data.phone) : ''
  const safeCompany = data.company ? escapeHtml(data.company) : ''
  const safeDate = new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau message de contact</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #0A1F2C; background-color: #F9FAFB; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E5E7EB; max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #E5E7EB;">
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; color: #0A1F2C; margin: 0; letter-spacing: -0.02em;">Cabinet Odillon</h1>
              <p style="font-size: 13px; color: #6B7280; margin: 8px 0 0;">Nouveau message de contact</p>
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #0A1F2C; margin: 0 0 24px; letter-spacing: -0.02em;">Nouvelle demande de contact</h2>

              <p style="font-size: 15px; color: #374151; margin: 0 0 24px; line-height: 1.6;">
                Vous avez reçu un nouveau message depuis le formulaire de contact du site web.
              </p>

              <!-- Informations du contact -->
              <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 4px; padding: 24px; margin: 0 0 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Nom :</strong>
                      <p style="font-size: 15px; color: #0A1F2C; margin: 4px 0 0; font-weight: 500;">${safeName}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Email :</strong>
                      <p style="font-size: 15px; color: #0A1F2C; margin: 4px 0 0; font-weight: 500;">
                        <a href="mailto:${safeEmail}" style="color: #1A9B8E; text-decoration: none;">${safeEmail}</a>
                      </p>
                    </td>
                  </tr>
                  ${safePhone ? `
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Téléphone :</strong>
                      <p style="font-size: 15px; color: #0A1F2C; margin: 4px 0 0; font-weight: 500;">
                        <a href="tel:${safePhone}" style="color: #1A9B8E; text-decoration: none;">${safePhone}</a>
                      </p>
                    </td>
                  </tr>
                  ` : ''}
                  ${safeCompany ? `
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Entreprise :</strong>
                      <p style="font-size: 15px; color: #0A1F2C; margin: 4px 0 0; font-weight: 500;">${safeCompany}</p>
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Sujet :</strong>
                      <p style="font-size: 15px; color: #0A1F2C; margin: 4px 0 0; font-weight: 500;">${safeSubject}</p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Message -->
              <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 4px; padding: 24px; margin: 0 0 24px;">
                <strong style="font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 12px;">Message :</strong>
                <p style="font-size: 15px; color: #374151; margin: 0; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
              </div>

              <!-- Bouton de réponse -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(data.subject)}"
                       style="display: inline-block; background-color: #1A9B8E; color: #FFFFFF; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-size: 15px; font-weight: 500; letter-spacing: -0.01em;">
                      Répondre à ${safeName}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info sur le dashboard -->
              <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 4px; padding: 16px; margin: 24px 0 0;">
                <p style="font-size: 13px; color: #1E40AF; margin: 0; line-height: 1.5;">
                  <strong>Info :</strong> Vous pouvez également consulter et gérer ce message depuis votre
                  <a href="https://odillon.fr/admin/settings" style="color: #1A9B8E; text-decoration: none; font-weight: 500;">panneau d'administration</a>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
              <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 8px; text-align: center;">
                Cabinet Odillon - Ingénierie d'entreprise, Gouvernance, Juridique, Financier et RH
              </p>
              <p style="font-size: 12px; color: #9CA3AF; margin: 0; text-align: center;">
                Date de réception : ${safeDate} • ID : ${messageId.substring(0, 8)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * Génère le template HTML pour l'email de confirmation au visiteur
 */
function generateConfirmationEmailHTML(data: ContactFormData): string {
  const safeName = escapeHtml(data.name)
  const safeSubject = escapeHtml(data.subject)
  const safeCompany = data.company ? escapeHtml(data.company) : ''
  const safePhone = data.phone ? escapeHtml(data.phone) : ''
  const safeDate = new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de votre message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #0A1F2C; background-color: #F9FAFB; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E5E7EB; max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #E5E7EB;">
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; color: #0A1F2C; margin: 0; letter-spacing: -0.02em;">Cabinet Odillon</h1>
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #0A1F2C; margin: 0 0 24px; letter-spacing: -0.02em;">Message bien reçu</h2>

              <p style="font-size: 15px; color: #374151; margin: 0 0 16px; line-height: 1.6;">Bonjour <strong>${safeName}</strong>,</p>

              <p style="font-size: 15px; color: #374151; margin: 0 0 24px; line-height: 1.6;">
                Nous avons bien reçu votre message concernant "<strong>${safeSubject}</strong>". Notre équipe en a été informée et vous répondra dans les plus brefs délais.
              </p>

              <!-- Message de confirmation -->
              <div style="background-color: #D1FAE5; border: 1px solid #6EE7B7; border-radius: 4px; padding: 16px; margin: 0 0 32px;">
                <p style="font-size: 13px; color: #065F46; margin: 0; line-height: 1.5;">
                  <strong>✓ Confirmation :</strong> Votre demande a été enregistrée avec succès. Nous nous engageons à vous répondre sous 48 heures ouvrées.
                </p>
              </div>

              <!-- Récapitulatif du message -->
              <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 4px; padding: 24px; margin: 0 0 32px;">
                <p style="font-size: 13px; color: #6B7280; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;">Récapitulatif de votre message :</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 6px 0;">
                      <span style="font-size: 13px; color: #6B7280;">Sujet :</span>
                      <span style="font-size: 14px; color: #0A1F2C; font-weight: 500; margin-left: 8px;">${safeSubject}</span>
                    </td>
                  </tr>
                  ${safeCompany ? `
                  <tr>
                    <td style="padding: 6px 0;">
                      <span style="font-size: 13px; color: #6B7280;">Entreprise :</span>
                      <span style="font-size: 14px; color: #0A1F2C; font-weight: 500; margin-left: 8px;">${safeCompany}</span>
                    </td>
                  </tr>
                  ` : ''}
                  ${safePhone ? `
                  <tr>
                    <td style="padding: 6px 0;">
                      <span style="font-size: 13px; color: #6B7280;">Téléphone :</span>
                      <span style="font-size: 14px; color: #0A1F2C; font-weight: 500; margin-left: 8px;">${safePhone}</span>
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 6px 0;">
                      <span style="font-size: 13px; color: #6B7280;">Date d'envoi :</span>
                      <span style="font-size: 14px; color: #0A1F2C; font-weight: 500; margin-left: 8px;">${safeDate}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Coordonnées de contact -->
              <div style="border-top: 1px solid #E5E7EB; padding-top: 24px; margin-top: 24px;">
                <p style="font-size: 14px; color: #374151; margin: 0 0 16px; line-height: 1.5;">
                  <strong>Besoin d'une réponse urgente ?</strong>
                </p>
                <p style="font-size: 14px; color: #6B7280; margin: 0 0 8px;">
                  Téléphone : <a href="tel:+24111747574" style="color: #1A9B8E; text-decoration: none;">+241 11 74 75 74</a>
                </p>
                <p style="font-size: 14px; color: #6B7280; margin: 0 0 8px;">
                  Email : <a href="mailto:contact@odillon.fr" style="color: #1A9B8E; text-decoration: none;">contact@odillon.fr</a>
                </p>
                <p style="font-size: 14px; color: #6B7280; margin: 0;">
                  Horaires : Lundi - Vendredi, 8h00 - 16h30
                </p>
              </div>

              <!-- Signature -->
              <p style="font-size: 15px; color: #374151; margin: 32px 0 0; line-height: 1.6;">
                Cordialement,<br>
                <strong style="color: #0A1F2C;">L'équipe du Cabinet Odillon</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
              <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 8px; text-align: center;">
                Cabinet Odillon - Ingénierie d'entreprise, Gouvernance, Juridique, Financier et RH
              </p>
              <p style="font-size: 12px; color: #9CA3AF; margin: 0; text-align: center;">
                <a href="https://odillon.fr" style="color: #1A9B8E; text-decoration: none;">odillon.fr</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * POST /api/contact
 * Traite les soumissions du formulaire de contact
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parser les données du formulaire
    const body = await request.json()

    // 2. Validation des champs requis
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Les champs nom, email, sujet et message sont obligatoires' },
        { status: 400 }
      )
    }

    // 3. Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // 4. Créer le client Supabase avec service role pour l'insertion publique
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )

    // 5. Insérer le message dans la base de données
    const { data, error: dbError } = await serviceClient
      .from('contact_messages')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: body.phone?.trim() || null,
          company: body.company?.trim() || null,
          subject: subject.trim(),
          message: message.trim(),
          status: 'new'
        }
      ])
      .select()
      .single()

    if (dbError) {
      console.error('Erreur lors de l\'insertion du message:', dbError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement du message. Veuillez réessayer.' },
        { status: 500 }
      )
    }

    // 6. Envoyer les emails (notification à l'équipe + confirmation au visiteur)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        const contactData: ContactFormData = {
          name: name.trim(),
          email: email.trim(),
          phone: body.phone?.trim(),
          company: body.company?.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }

        // Envoyer 3 emails en parallèle
        const [notificationResult, webhookCopyResult, confirmationResult] = await Promise.allSettled([
          // 1. Email de notification à l'équipe (Infomaniak)
          resend.emails.send({
            from: process.env.FROM_EMAIL || 'Odillon <noreply@support.odillon.fr>',
            to: process.env.CONTACT_EMAIL || 'contact@odillon.fr',
            replyTo: email,
            subject: `[Contact Site Web] ${subject.trim()}`,
            html: generateNotificationEmailHTML(contactData, data.id),
          }),
          // 2. Copie à support@odillon.fr (Resend - pour déclencher le webhook)
          process.env.SUPPORT_EMAIL ? resend.emails.send({
            from: process.env.FROM_EMAIL || 'Odillon <noreply@support.odillon.fr>',
            to: process.env.SUPPORT_EMAIL,
            replyTo: email,
            subject: `[Contact Site Web] ${subject.trim()}`,
            html: generateNotificationEmailHTML(contactData, data.id),
          }) : Promise.resolve({ data: null }),
          // 3. Email de confirmation au visiteur
          resend.emails.send({
            from: process.env.FROM_EMAIL || 'Odillon <noreply@support.odillon.fr>',
            to: email.trim(),
            subject: `Confirmation de réception - ${subject.trim()}`,
            html: generateConfirmationEmailHTML(contactData),
          }),
        ])

        // Log les résultats des emails (pour debug)
        if (notificationResult.status === 'rejected') {
          console.error('Erreur email notification (Infomaniak):', notificationResult.reason)
        }
        if (webhookCopyResult.status === 'rejected') {
          console.error('Erreur copie webhook (support@):', webhookCopyResult.reason)
        }
        if (confirmationResult.status === 'rejected') {
          console.error('Erreur email confirmation:', confirmationResult.reason)
        }

        // Enregistrer les emails sortants dans contact_replies
        if (notificationResult.status === 'fulfilled' || confirmationResult.status === 'fulfilled') {
          try {
            const repliesData = []

            // Email de confirmation au visiteur
            if (confirmationResult.status === 'fulfilled') {
              repliesData.push({
                contact_message_id: data.id,
                from_email: (process.env.FROM_EMAIL || 'noreply@odillon.fr').match(/<(.+)>/)?.[1] || 'noreply@odillon.fr',
                from_name: 'Cabinet Odillon',
                to_email: email.trim().toLowerCase(),
                subject: `Confirmation de réception - ${subject.trim()}`,
                body_html: generateConfirmationEmailHTML(contactData),
                resend_email_id: confirmationResult.value.data?.id || null,
                direction: 'outbound'
              })
            }

            if (repliesData.length > 0) {
              await serviceClient
                .from('contact_replies')
                .insert(repliesData)
            }
          } catch (replyError) {
            console.error('Erreur lors de l\'enregistrement des emails sortants:', replyError)
          }
        }

      } catch (emailError) {
        // Log l'erreur mais ne bloque pas la réponse
        // Le message est déjà sauvegardé en base de données
        console.error('Erreur lors de l\'envoi des emails:', emailError)
      }
    }

    // 7. Retourner la réponse de succès
    return NextResponse.json(
      {
        success: true,
        message: 'Votre message a été envoyé avec succès. Nous vous recontacterons rapidement.',
        id: data.id
      },
      { status: 201 }
    )

  } catch (error: unknown) {
    console.error('Erreur serveur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer plus tard.' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/contact
 * Récupérer les messages de contact (pour l'admin, nécessite authentification)
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = searchParams.get('limit')

  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  if (limit) {
    query = query.limit(parseInt(limit))
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ messages: data })
}
