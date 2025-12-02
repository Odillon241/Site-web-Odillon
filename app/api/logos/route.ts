import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Récupérer tous les logos
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const active = searchParams.get('active')

  const supabase = await createClient()
  
  let query = supabase
    .from('company_logos')
    .select('*')
    .order('display_order', { ascending: true })

  // Filtrer par statut actif
  if (active === 'true') {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ logos: data })
}

// POST - Créer un nouveau logo
export async function POST(request: Request) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json()
  
  // Récupérer le nombre maximum d'ordre pour définir le nouvel ordre
  const { data: maxOrderData } = await supabase
    .from('company_logos')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const newOrder = maxOrderData?.display_order ? maxOrderData.display_order + 1 : 1
  
  const { data, error } = await supabase
    .from('company_logos')
    .insert([{
      ...body,
      display_order: body.display_order || newOrder,
      created_by: user.id
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ logo: data }, { status: 201 })
}
