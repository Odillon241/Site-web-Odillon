import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Récupérer toutes les vidéos
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const active = searchParams.get('active')
  const activity_type = searchParams.get('activity_type')

  const supabase = await createClient()

  let query = supabase
    .from('videos')
    .select('*')
    .order('display_order', { ascending: true })

  // Filtrer par statut actif
  if (active === 'true') {
    query = query.eq('is_active', true)
  }

  // Filtrer par catégorie
  if (category) {
    query = query.eq('category', category)
  }

  // Filtrer par type d'activité
  if (activity_type) {
    query = query.eq('activity_type', activity_type)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ videos: data })
}

// POST - Créer une nouvelle vidéo
export async function POST(request: Request) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('videos')
    .insert([{
      ...body,
      created_by: user.id
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ video: data }, { status: 201 })
}
