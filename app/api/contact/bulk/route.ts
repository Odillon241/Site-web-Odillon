import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const validStatuses = ['new', 'read', 'replied', 'archived']
const MAX_IDS = 200

/**
 * Valide et normalise le tableau d'identifiants reçu dans le corps de la requête.
 */
function parseIds(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const ids = value.filter((id): id is string => typeof id === 'string' && id.trim() !== '')
  if (ids.length === 0 || ids.length > MAX_IDS) return null
  return ids
}

/**
 * PATCH /api/contact/bulk
 * Met à jour le statut de plusieurs messages en une seule opération.
 * Corps attendu : { ids: string[], status: 'new' | 'read' | 'replied' | 'archived' }
 */
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const ids = parseIds(body.ids)
    const { status } = body

    if (!ids) {
      return NextResponse.json(
        { error: `Liste d'identifiants invalide (1 à ${MAX_IDS} éléments attendus)` },
        { status: 400 }
      )
    }

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide. Valeurs acceptées: new, read, replied, archived' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .in('id', ids)
      .select('id')

    if (error) {
      console.error('Erreur lors de la mise à jour groupée:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour des messages' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, updated: data?.length ?? 0 })

  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * DELETE /api/contact/bulk
 * Supprime plusieurs messages en une seule opération.
 * Corps attendu : { ids: string[] }
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const ids = parseIds(body.ids)

    if (!ids) {
      return NextResponse.json(
        { error: `Liste d'identifiants invalide (1 à ${MAX_IDS} éléments attendus)` },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .delete()
      .in('id', ids)
      .select('id')

    if (error) {
      console.error('Erreur lors de la suppression groupée:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression des messages' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, deleted: data?.length ?? 0 })

  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
