import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/conversations
 * Récupère toutes les conversations (messages + réponses)
 * Nécessite une authentification admin
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const messageId = searchParams.get('messageId')

    // Si un messageId est fourni, retourner une conversation spécifique
    if (messageId) {
      // Récupérer le message
      const { data: message, error: messageError } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', messageId)
        .single()

      if (messageError || !message) {
        return NextResponse.json(
          { error: 'Message non trouvé' },
          { status: 404 }
        )
      }

      // Récupérer les réponses
      const { data: replies, error: repliesError } = await supabase
        .from('contact_replies')
        .select('*')
        .eq('contact_message_id', messageId)
        .order('created_at', { ascending: true })

      if (repliesError) {
        return NextResponse.json(
          { error: 'Erreur lors de la récupération des réponses' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        conversation: {
          message,
          replies: replies || [],
        },
      })
    }

    // Sinon, retourner toutes les conversations
    let messagesQuery = supabase
      .from('contact_messages')
      .select('*')
      .order('updated_at', { ascending: false })

    if (status) {
      messagesQuery = messagesQuery.eq('status', status)
    }

    if (limit) {
      messagesQuery = messagesQuery.limit(parseInt(limit))
    }

    const { data: messages, error: messagesError } = await messagesQuery

    if (messagesError) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des messages' },
        { status: 500 }
      )
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ conversations: [] })
    }

    // Récupérer toutes les réponses pour ces messages
    const messageIds = messages.map((m) => m.id)
    const { data: allReplies } = await supabase
      .from('contact_replies')
      .select('*')
      .in('contact_message_id', messageIds)
      .order('created_at', { ascending: true })

    // Grouper les réponses par message
    const repliesMap = new Map<string, any[]>()
    if (allReplies) {
      allReplies.forEach((reply) => {
        const messageReplies = repliesMap.get(reply.contact_message_id) || []
        messageReplies.push(reply)
        repliesMap.set(reply.contact_message_id, messageReplies)
      })
    }

    // Construire les conversations
    const conversations = messages.map((message) => ({
      message,
      replies: repliesMap.get(message.id) || [],
      replyCount: (repliesMap.get(message.id) || []).length,
      lastReplyAt:
        (repliesMap.get(message.id) || []).length > 0
          ? repliesMap.get(message.id)![
              repliesMap.get(message.id)!.length - 1
            ].created_at
          : null,
    }))

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
