import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { champsPersonnalisesSchema } from "@/lib/validations/formation"

/**
 * Colonnes modifiables via l'API.
 *
 * `places_reservees` en est volontairement absente : ce compteur n'est maintenu
 * que par le trigger en base. L'exposer ici permettrait de désynchroniser la
 * capacité et de laisser passer des inscriptions au-delà des places réelles.
 * `id`, `created_by` et `created_at` sont exclus pour les mêmes raisons.
 */
const CHAMPS_MODIFIABLES = [
    "titre",
    "description",
    "date_debut",
    "date_fin",
    "horaires",
    "duree",
    "formateur",
    "lieu",
    "modalite",
    "is_active",
    "prix",
    "devise",
    "places_totales",
    "inscriptions_ouvertes",
    "champs_personnalises",
    "rappel_jours_avant",
    "satisfaction_jours_apres",
    "instructions_paiement",
] as const

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        let body: Record<string, unknown>
        try {
            body = await request.json()
        } catch {
            return NextResponse.json({ error: "Format JSON invalide" }, { status: 400 })
        }

        const updateData: Record<string, unknown> = {}
        for (const champ of CHAMPS_MODIFIABLES) {
            if (champ in body) updateData[champ] = body[champ]
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "Aucun champ modifiable fourni" }, { status: 400 })
        }

        if ("champs_personnalises" in updateData) {
            const parsed = champsPersonnalisesSchema.safeParse(updateData.champs_personnalises)
            if (!parsed.success) {
                return NextResponse.json(
                    { error: "Champs personnalisés invalides", details: parsed.error.issues.map(i => i.message) },
                    { status: 400 }
                )
            }
            updateData.champs_personnalises = parsed.data
        }

        const { data, error } = await supabase
            .from("formations")
            .update(updateData)
            .eq("id", id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!data) {
            return NextResponse.json({ error: "Formation introuvable" }, { status: 404 })
        }

        return NextResponse.json({ formation: data })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { error } = await supabase
            .from("formations")
            .delete()
            .eq("id", id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
