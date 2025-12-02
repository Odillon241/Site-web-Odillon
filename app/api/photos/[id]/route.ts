import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// PATCH - Mettre à jour une photo
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json()
  const { id } = await params

  const { data, error } = await supabase
    .from('photos')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ photo: data })
}

// DELETE - Supprimer une photo
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params

  try {
    // 1. Récupérer les informations de la photo
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('url')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    // 2. Supprimer le fichier du Storage (si c'est une URL Supabase)
    if (photo?.url && photo.url.includes('supabase.co/storage')) {
      const urlParts = photo.url.split('/storage/v1/object/public/hero-photos/')
      if (urlParts.length > 1) {
        const fileName = urlParts[1]
        await supabase.storage
          .from('hero-photos')
          .remove([fileName])
        // Ne pas échouer si la suppression du fichier échoue
      }
    }

    // 3. Supprimer l'entrée de la base de données
    const { error: deleteError } = await supabase
      .from('photos')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Photo supprimée avec succès' }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur interne'
    console.error('Erreur lors de la suppression:', error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

