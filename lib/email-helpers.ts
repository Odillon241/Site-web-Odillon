/**
 * Utilitaires pour la gestion des emails et conversations
 */

import { createClient } from '@supabase/supabase-js'

/**
 * Types pour les messages et réponses
 */
export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  updated_at: string
}

export interface ContactReply {
  id: string
  contact_message_id: string
  from_email: string
  from_name?: string
  to_email: string
  subject: string
  body_text?: string
  body_html?: string
  attachments: any[]
  resend_email_id?: string
  message_id?: string
  in_reply_to?: string
  direction: 'inbound' | 'outbound'
  created_at: string
  updated_at: string
}

export interface ConversationThread {
  message: ContactMessage
  replies: ContactReply[]
}

/**
 * Extrait le nom et l'email d'une chaîne "Name <email@domain.com>"
 */
export function parseEmailAddress(emailString: string): {
  name: string | null
  email: string
} {
  const match = emailString.match(/^(.+?)\s*<(.+?)>$/)
  if (match) {
    return {
      name: match[1].trim(),
      email: match[2].trim().toLowerCase(),
    }
  }
  return {
    name: null,
    email: emailString.trim().toLowerCase(),
  }
}

/**
 * Nettoie un sujet d'email en enlevant les préfixes Re:, Fwd:, etc.
 */
export function cleanEmailSubject(subject: string): string {
  return subject.replace(/^(Re|RE|Fwd|FWD|Rép|RÉP):\s*/gi, '').trim()
}

/**
 * Récupère un fil de conversation complet (message + réponses)
 */
export async function getConversationThread(
  messageId: string
): Promise<ConversationThread | null> {
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

  // Récupérer le message
  const { data: message, error: messageError } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('id', messageId)
    .single()

  if (messageError || !message) {
    return null
  }

  // Récupérer toutes les réponses
  const { data: replies, error: repliesError } = await supabase
    .from('contact_replies')
    .select('*')
    .eq('contact_message_id', messageId)
    .order('created_at', { ascending: true })

  if (repliesError) {
    return null
  }

  return {
    message,
    replies: replies || [],
  }
}

/**
 * Récupère tous les fils de conversation avec leurs dernières réponses
 */
export async function getAllConversations(): Promise<
  Array<ConversationThread>
> {
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

  // Récupérer tous les messages
  const { data: messages, error: messagesError } = await supabase
    .from('contact_messages')
    .select('*')
    .order('updated_at', { ascending: false })

  if (messagesError || !messages) {
    return []
  }

  // Récupérer toutes les réponses
  const { data: allReplies } = await supabase
    .from('contact_replies')
    .select('*')
    .order('created_at', { ascending: true })

  const repliesMap = new Map<string, ContactReply[]>()

  if (allReplies) {
    allReplies.forEach((reply) => {
      const messageReplies = repliesMap.get(reply.contact_message_id) || []
      messageReplies.push(reply)
      repliesMap.set(reply.contact_message_id, messageReplies)
    })
  }

  return messages.map((message) => ({
    message,
    replies: repliesMap.get(message.id) || [],
  }))
}

/**
 * Enregistre un email sortant dans la table contact_replies
 */
export async function recordOutboundEmail(
  messageId: string,
  emailData: {
    from: string
    to: string
    subject: string
    bodyText?: string
    bodyHtml?: string
    resendEmailId?: string
  }
): Promise<ContactReply | null> {
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

  const fromParsed = parseEmailAddress(emailData.from)

  const { data, error } = await supabase
    .from('contact_replies')
    .insert({
      contact_message_id: messageId,
      from_email: fromParsed.email,
      from_name: fromParsed.name,
      to_email: emailData.to.toLowerCase(),
      subject: emailData.subject,
      body_text: emailData.bodyText || null,
      body_html: emailData.bodyHtml || null,
      resend_email_id: emailData.resendEmailId || null,
      direction: 'outbound',
    })
    .select()
    .single()

  if (error) {
    console.error('Erreur lors de l\'enregistrement de l\'email sortant:', error)
    return null
  }

  return data
}

/**
 * Met à jour le statut d'un message de contact
 */
export async function updateMessageStatus(
  messageId: string,
  status: 'new' | 'read' | 'replied' | 'archived'
): Promise<boolean> {
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

  const { error } = await supabase
    .from('contact_messages')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', messageId)

  return !error
}

/**
 * Recherche un message de contact par email et sujet
 */
export async function findMessageByEmailAndSubject(
  email: string,
  subject: string
): Promise<ContactMessage | null> {
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

  const cleanSubject = cleanEmailSubject(subject)

  // Recherche par email avec sujet similaire
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('email', email.toLowerCase())
    .order('created_at', { ascending: false })
    .limit(10)

  if (messages && messages.length > 0) {
    // Chercher une correspondance exacte du sujet
    const exactMatch = messages.find(
      (msg) =>
        cleanEmailSubject(msg.subject).toLowerCase() ===
        cleanSubject.toLowerCase()
    )
    if (exactMatch) return exactMatch

    // Sinon, prendre le plus récent
    return messages[0]
  }

  return null
}

/**
 * Statistiques sur les conversations
 */
export async function getConversationStats(): Promise<{
  total: number
  new: number
  replied: number
  archived: number
}> {
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

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('status')

  if (!messages) {
    return { total: 0, new: 0, replied: 0, archived: 0 }
  }

  return {
    total: messages.length,
    new: messages.filter((m) => m.status === 'new').length,
    replied: messages.filter((m) => m.status === 'replied').length,
    archived: messages.filter((m) => m.status === 'archived').length,
  }
}
