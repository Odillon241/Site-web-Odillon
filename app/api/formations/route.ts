import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { champsPersonnalisesSchema } from "@/lib/validations/formation"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const activeOnly = searchParams.get("active") === "true"

        const supabase = await createClient()
        let query = supabase
            .from("formations")
            .select("*")
            .order("date_debut", { ascending: true })

        if (activeOnly) {
            query = query.eq("is_active", true)
        }

        const { data: formations, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ formations })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const {
            titre, description, date_debut, date_fin, horaires, duree, formateur, lieu, modalite, is_active,
            prix, devise, places_totales, inscriptions_ouvertes, champs_personnalises,
            rappel_jours_avant, satisfaction_jours_apres, instructions_paiement
        } = body

        if (!titre || !description || !date_debut) {
            return NextResponse.json({ error: "Le titre, la description et la date de début sont obligatoires" }, { status: 400 })
        }

        const champs = champsPersonnalisesSchema.safeParse(champs_personnalises ?? [])
        if (!champs.success) {
            return NextResponse.json(
                { error: "Champs personnalisés invalides", details: champs.error.issues.map(i => i.message) },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from("formations")
            .insert({
                titre,
                description,
                date_debut,
                date_fin: date_fin || null,
                horaires: horaires || null,
                duree: duree || null,
                formateur: formateur || null,
                lieu: lieu || null,
                modalite: modalite || null,
                is_active: is_active ?? true,
                prix: prix ?? null,
                devise: devise || "XAF",
                places_totales: places_totales ?? null,
                inscriptions_ouvertes: inscriptions_ouvertes ?? true,
                champs_personnalises: champs.data,
                rappel_jours_avant: rappel_jours_avant ?? null,
                satisfaction_jours_apres: satisfaction_jours_apres ?? null,
                instructions_paiement: instructions_paiement || null,
                created_by: user.id
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ formation: data })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
