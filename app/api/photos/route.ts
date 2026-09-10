import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

// GET - Récupérer toutes les photos
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const month = searchParams.get('month')
  const year = searchParams.get('year')
  const theme = searchParams.get('theme')
  const active = searchParams.get('active')
  const section = searchParams.get('section')
  const activity_type = searchParams.get('activity_type')

  const supabase = await createClient()

  let query = supabase
    .from('photos')
    .select('*')
    .order('display_order', { ascending: true })

  // Filtrer par statut actif
  if (active === 'true') {
    query = query.eq('is_active', true)
  }

  // Filtrer par année
  if (year) {
    query = query.eq('year', parseInt(year))
  }

  // Filtrer par mois
  if (month) {
    query = query.eq('month', parseInt(month))
  }

  // Filtrer par thématique
  if (theme) {
    query = query.eq('theme_id', theme)
  }

  // Filtrer par type d'activité
  if (activity_type) {
    query = query.eq('activity_type', activity_type)
  }

  // Filtrer par section
  if (section) {
    if (section === 'hero') {
      query = query.eq(
        'section_id',
        'a2aca9ff-af21-4e5c-8f5a-89d00c5a671b'
      )
    } else if (section === 'phototheque') {
      query = query.eq(
        'section_id',
        'e6032db2-f94e-4a09-9de4-aab229687219'
      )
    } else {
      query = query.eq('section_id', section)
    }
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ photos: data })
}

// POST - Créer une nouvelle photo
export async function POST(request: Request) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    )
  }

  const body = await request.json()

  // Vérifier que l'année est présente
  if (body.year === null || body.year === undefined || body.year === '') {
    return NextResponse.json(
      { error: "L'année de l'événement est obligatoire." },
      { status: 400 }
    )
  }

  // Conversion propre des valeurs numériques
  body.year = Number(body.year)

  if (body.month !== null && body.month !== undefined && body.month !== '') {
    body.month = Number(body.month)
  } else {
    body.month = null
  }

  // La colonne 'day' n'existe pas dans la table 'photos' :
  // on ignore toute valeur envoyée pour éviter une erreur Postgrest.
  delete body.day

  // Map section slugs to UUIDs
  if (body.section_id === 'hero') {
    body.section_id = 'a2aca9ff-af21-4e5c-8f5a-89d00c5a671b'
  }

  if (body.section_id === 'phototheque') {
    body.section_id = 'e6032db2-f94e-4a09-9de4-aab229687219'
  }

  const { data, error } = await supabase
    .from('photos')
    .insert([body])
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  revalidateTag('photos', 'max')
  revalidateTag('active-photos', 'max')

  return NextResponse.json(
    { photo: data },
    { status: 201 }
  )
}