import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Récupérer les sections photos avec leurs photos associées
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const active = searchParams.get('active')
  const page = searchParams.get('page')

  const supabase = await createClient()
  
  // Récupérer les sections
  let sectionsQuery = supabase
    .from('photo_sections')
    .select('*')
    .order('display_order', { ascending: true })

  if (active === 'true') {
    sectionsQuery = sectionsQuery.eq('is_active', true)
  }

  // Filtrer par page si spécifié
  if (page) {
    sectionsQuery = sectionsQuery.eq('page', page)
  }

  const { data: sections, error: sectionsError } = await sectionsQuery

  if (sectionsError) {
    return NextResponse.json({ error: sectionsError.message }, { status: 500 })
  }

  if (!sections || sections.length === 0) {
    return NextResponse.json({ sections: [] })
  }

  // Pour chaque section, récupérer les photos associées
  const sectionsWithPhotos = await Promise.all(
    sections.map(async (section) => {
      const { data: photos } = await supabase
        .from('photos')
        .select('*')
        .eq('section_id', section.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      return {
        ...section,
        photos: photos || []
      }
    })
  )

  // Les sections sont déjà triées par display_order dans la requête SQL
  // Le positionnement relatif est géré par le display_order calculé lors de la création
  return NextResponse.json({ sections: sectionsWithPhotos })
}
