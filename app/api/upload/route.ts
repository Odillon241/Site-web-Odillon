import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format non supporté. Utilisez JPG, PNG ou WebP' },
        { status: 400 }
      )
    }

    // Taille max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Maximum 5MB' },
        { status: 400 }
      )
    }

    // Générer nom unique
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('hero-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('hero-photos')
      .getPublicUrl(data.path)

    return NextResponse.json({
      path: data.path,
      url: publicUrl
    }, { status: 201 })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'upload'
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

