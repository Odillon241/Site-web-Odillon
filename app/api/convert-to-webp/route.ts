import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

// Route API pour convertir les images en WebP
export async function POST(request: Request) {
  try {
    const { imageUrl, fileName } = await request.json()

    if (!imageUrl || !fileName) {
      return NextResponse.json(
        { error: 'imageUrl et fileName requis' },
        { status: 400 }
      )
    }

    // Télécharger l'image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Impossible de télécharger l\'image' },
        { status: 400 }
      )
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer())

    // Convertir en WebP
    const webpBuffer = await sharp(imageBuffer)
      .webp({ quality: 85 })
      .toBuffer()

    // Uploader vers Supabase Storage
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const webpFileName = fileName.replace(/\.(png|jpg|jpeg)$/i, '.webp')

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('hero-photos')
      .upload(webpFileName, webpBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      return NextResponse.json(
        { error: `Erreur upload: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('hero-photos')
      .getPublicUrl(webpFileName)

    // Mettre à jour la base de données
    const { data: photos } = await supabase
      .from('photos')
      .select('id')
      .ilike('url', `%${fileName}%`)

    if (photos && photos.length > 0) {
      for (const photo of photos) {
        await supabase
          .from('photos')
          .update({ url: publicUrl })
          .eq('id', photo.id)
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: webpFileName
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erreur: ${error.message}` },
      { status: 500 }
    )
  }
}
