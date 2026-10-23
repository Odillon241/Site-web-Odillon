import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const TYPES_ACTIVITE = ['Formations', 'Séminaires', 'Team Building', 'Ateliers', 'Événements']

type MiseAJourAlbum = {
  description?: string
  details?: string | null
  location?: string | null
  year?: number | null
  month?: number | null
  activity_type?: string | null
}

/** Texte facultatif : chaîne vide = effacé, longueur bornée. */
function texte(valeur: unknown, max: number): string | null | false {
  if (valeur === null) return null
  if (typeof valeur !== 'string' || valeur.length > max) return false
  return valeur.trim() || null
}

/** Liste blanche des champs d'album modifiables, avec leurs contrôles. */
function validerAlbum(payload: unknown): { update: MiseAJourAlbum } | { error: string } {
  if (!payload || typeof payload !== 'object') return { error: 'Données invalides' }
  const p = payload as Record<string, unknown>
  const update: MiseAJourAlbum = {}

  if (p.description !== undefined) {
    if (typeof p.description !== 'string' || !p.description.trim()) {
      return { error: "Le nom de l'album est requis" }
    }
    if (p.description.length > 200) return { error: "Le nom de l'album est trop long (200 caractères au plus)" }
    update.description = p.description.trim()
  }
  if (p.details !== undefined) {
    const v = texte(p.details, 5000)
    if (v === false) return { error: 'Description trop longue (5 000 caractères au plus)' }
    update.details = v
  }
  if (p.location !== undefined) {
    const v = texte(p.location, 200)
    if (v === false) return { error: 'Lieu trop long (200 caractères au plus)' }
    update.location = v
  }
  if (p.year !== undefined) {
    if (p.year !== null && !(Number.isInteger(p.year) && (p.year as number) >= 2000 && (p.year as number) <= 2100)) {
      return { error: 'Année invalide' }
    }
    update.year = p.year as number | null
  }
  if (p.month !== undefined) {
    if (p.month !== null && !(Number.isInteger(p.month) && (p.month as number) >= 1 && (p.month as number) <= 12)) {
      return { error: 'Mois invalide' }
    }
    update.month = p.month as number | null
  }
  if (p.activity_type !== undefined) {
    if (p.activity_type !== null && !TYPES_ACTIVITE.includes(p.activity_type as string)) {
      return { error: "Type d'activité invalide" }
    }
    update.activity_type = p.activity_type as string | null
  }

  return { update }
}

// POST - Actions groupées sur plusieurs photos
// Body: { action: 'move' | 'updateAlbum' | 'setActive' | 'delete', ids: string[], payload?: {...} }
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

    } else if (action === 'updateAlbum') {
      // Modifier un album : seuls les champs présents dans `payload` sont
      // appliqués à toutes ses photos ; un champ absent reste tel quel.
      const resultat = validerAlbum(payload)
      if ('error' in resultat) {
        return NextResponse.json({ error: resultat.error }, { status: 400 })
      }
      if (Object.keys(resultat.update).length === 0) {
        return NextResponse.json({ error: 'Aucune modification fournie' }, { status: 400 })
      }

      const { error } = await supabase
        .from('photos')
        .update(resultat.update)
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
