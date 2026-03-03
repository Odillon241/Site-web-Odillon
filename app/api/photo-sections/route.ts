import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Récupérer toutes les sections photos
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const active = searchParams.get('active')

  const supabase = await createClient()
  
  let query = supabase
    .from('photo_sections')
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

  return NextResponse.json({ sections: data || [] })
}

// POST - Créer une nouvelle section photo
export async function POST(request: Request) {
  const supabase = await createClient()

  // Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json()
  
  const { data, error } = await supabase
    .from('photo_sections')
    .insert([{
      ...body,
      created_by: user.id
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ section: data }, { status: 201 })
}
