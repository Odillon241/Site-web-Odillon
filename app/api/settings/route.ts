import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Récupérer les paramètres du site
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "main")
      .single()

    const defaultSettings = {
      id: "main",
      show_videos_section: true,
      show_photos_section: true,
      services_cta_image_url: null,
      expertise_image_url: null,
      expertise_cta_title: 'Découvrez notre expertise approfondie et nos méthodologies éprouvées',
      expertise_cta_description: '',
      expertise_cta_button_text: 'En savoir plus sur notre expertise',
      expertise_cta_button_link: '/expertise',
      expertise_cta_badge_text: 'Expertise',
      // About Section Defaults
      about_mission_title: 'Notre Mission',
      about_mission_description: "Fondée sur la conviction que chaque entreprise possède un potentiel inexploité, Odillon s'est donné pour mission de révéler cette valeur cachée.",
      about_values_json: [
        { title: "Excellence", value: "Standards élevés", description: "Une rigueur absolue dans chaque mission pour dépasser vos attentes.", icon: "Award", color: "#39837a" },
        { title: "Intégrité", value: "Éthique totale", description: "Transparence et confidentialité sont les piliers de notre relation client.", icon: "Shield", color: "#C4D82E" },
        { title: "Innovation", value: "Créativité utile", description: "Des solutions modernes et adaptées à votre contexte spécifique.", icon: "Lightbulb", color: "#39837a" },
        { title: "Partenariat", value: "Confiance durable", description: "Nous ne sommes pas juste des consultants, mais vos partenaires de croissance.", icon: "Heart", color: "#C4D82E" }
      ]
    }

    if (error) {
      console.error("Erreur lors de la récupération des paramètres:", error)
      return NextResponse.json({ settings: defaultSettings })
    }

    return NextResponse.json({
      settings: { ...defaultSettings, ...data }
    })
  } catch (error) {
    console.error("Erreur serveur:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des paramètres" },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour les paramètres du site
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const {
      show_videos_section,
      show_photos_section,
      services_cta_image_url,
      expertise_image_url,
      expertise_cta_title,
      expertise_cta_description,
      expertise_cta_button_text,
      expertise_cta_button_link,
      expertise_cta_badge_text,
      about_mission_title,
      about_mission_description,
      about_values_json
    } = body

    // Valider les données de base
    if (typeof show_videos_section !== "boolean" && show_videos_section !== undefined) return NextResponse.json({ error: "show_videos_section doit être un booléen" }, { status: 400 })
    if (typeof show_photos_section !== "boolean" && show_photos_section !== undefined) return NextResponse.json({ error: "show_photos_section doit être un booléen" }, { status: 400 })
    if (services_cta_image_url && typeof services_cta_image_url !== "string") return NextResponse.json({ error: "services_cta_image_url doit être une chaîne" }, { status: 400 })
    if (expertise_image_url && typeof expertise_image_url !== "string") return NextResponse.json({ error: "expertise_image_url doit être une chaîne" }, { status: 400 })

    // Construire l'objet de mise à jour
    const updateData: Record<string, any> = {}

    // Toggle Sections & Images
    if (show_videos_section !== undefined) updateData.show_videos_section = show_videos_section
    if (show_photos_section !== undefined) updateData.show_photos_section = show_photos_section
    if (services_cta_image_url !== undefined) updateData.services_cta_image_url = services_cta_image_url
    if (expertise_image_url !== undefined) updateData.expertise_image_url = expertise_image_url

    // Expertise CTA
    if (expertise_cta_title !== undefined) updateData.expertise_cta_title = expertise_cta_title
    if (expertise_cta_description !== undefined) updateData.expertise_cta_description = expertise_cta_description
    if (expertise_cta_button_text !== undefined) updateData.expertise_cta_button_text = expertise_cta_button_text
    if (expertise_cta_button_link !== undefined) updateData.expertise_cta_button_link = expertise_cta_button_link
    if (expertise_cta_badge_text !== undefined) updateData.expertise_cta_badge_text = expertise_cta_badge_text

    // About Section
    if (about_mission_title !== undefined) updateData.about_mission_title = about_mission_title
    if (about_mission_description !== undefined) updateData.about_mission_description = about_mission_description
    if (about_values_json !== undefined) updateData.about_values_json = about_values_json

    // Mettre à jour les paramètres
    const { data, error } = await supabase
      .from("site_settings")
      .update(updateData)
      .eq("id", "main")
      .select()
      .single()

    if (error) {
      console.error("Erreur lors de la mise à jour:", error)
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour des paramètres" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Paramètres mis à jour avec succès",
      settings: data
    })
  } catch (error) {
    console.error("Erreur serveur:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des paramètres" },
      { status: 500 }
    )
  }
}
