import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// PATCH - Mettre à jour une section photo
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

  const { id } = await params
  const body = await request.json()
  
  const { data, error } = await supabase
    .from('photo_sections')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ section: data })
}

// DELETE - Supprimer une section photo
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

  const { error } = await supabase
    .from('photo_sections')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Section supprimée avec succès' })
}
