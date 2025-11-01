import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Récupérer toutes les photos
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  const theme = searchParams.get('theme')
  const active = searchParams.get('active')

  const supabase = await createClient()
  
  let query = supabase
    .from('photos')
    .select('*')
    .order('display_order', { ascending: true })

  // Filtrer par statut actif
  if (active === 'true') {
    query = query.eq('is_active', true)
  }

  // Filtrer par mois
  if (month) {
    query = query.eq('month', parseInt(month))
  }

  // Filtrer par thématique
  if (theme) {
    query = query.eq('theme_id', theme)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ photos: data })
}

// POST - Créer une nouvelle photo
export async function POST(request: Request) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json()
  
  const { data, error } = await supabase
    .from('photos')
    .insert([body])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ photo: data }, { status: 201 })
}

