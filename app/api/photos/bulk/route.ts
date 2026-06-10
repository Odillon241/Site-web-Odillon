import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// POST - Actions groupées sur plusieurs photos
// Body: { action: 'move' | 'setActive' | 'delete', ids: string[], payload?: {...} }
export async function POST(request: Request) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const { action, ids, payload } = await request.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Aucune photo sélectionnée' }, { status: 400 })
    }

    if (action === 'move') {
      // Déplacer / renommer : met à jour la description (= album) et éventuellement les détails
      const update: { description?: string; details?: string | null } = {}
      if (typeof payload?.description === 'string') {
        if (!payload.description.trim()) {
          return NextResponse.json({ error: "Le nom de l'album est requis" }, { status: 400 })
        }
        update.description = payload.description.trim()
      }
      if (payload?.details !== undefined) {
        update.details = payload.details || null
      }

      if (Object.keys(update).length === 0) {
        return NextResponse.json({ error: 'Aucune modification fournie' }, { status: 400 })
      }

      const { error } = await supabase
        .from('photos')
        .update(update)
        .in('id', ids)

      if (error) throw error

    } else if (action === 'setActive') {
      const { error } = await supabase
        .from('photos')
        .update({ is_active: !!payload?.is_active })
        .in('id', ids)

      if (error) throw error

    } else if (action === 'delete') {
      // 1. Récupérer les URLs pour nettoyer le Storage
      const { data: rows, error: fetchError } = await supabase
        .from('photos')
        .select('url')
        .in('id', ids)

      if (fetchError) throw fetchError

      // 2. Supprimer les fichiers du Storage (best-effort)
      const filesToRemove = (rows || [])
        .map((row) => row.url as string)
        .filter((url) => url && url.includes('supabase.co/storage'))
        .map((url) => url.split('/storage/v1/object/public/hero-photos/')[1])
        .filter(Boolean) as string[]

      if (filesToRemove.length > 0) {
        await supabase.storage.from('hero-photos').remove(filesToRemove)
        // Ne pas échouer si la suppression d'un fichier échoue
      }

      // 3. Supprimer les entrées en base
      const { error: deleteError } = await supabase
        .from('photos')
        .delete()
        .in('id', ids)

      if (deleteError) throw deleteError

    } else {
      return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
    }

    revalidateTag('photos', 'max')
    revalidateTag('active-photos', 'max')

    return NextResponse.json({ success: true, count: ids.length })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne'
    console.error('Erreur action groupée:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
