import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { placesRestantes, estComplet } from "@/types/formation"

/**
 * GET — état des places d'une session. Route publique.
 *
 * Lit uniquement `formations` (dont la lecture publique est autorisée pour les
 * sessions actives), jamais `formation_inscriptions` : la liste des inscrits
 * ne doit pas être exposée. C'est précisément la raison d'être du compteur
 * dénormalisé `places_reservees`.
 *
 * Sert au rafraîchissement côté client après un refus « COMPLET ».
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const supabase = await createClient()

        const { data: formation, error } = await supabase
            .from("formations")
            .select("prix, devise, places_totales, places_reservees, inscriptions_ouvertes, date_debut")
            .eq("id", id)
            .eq("is_active", true)
            .maybeSingle()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!formation) {
            return NextResponse.json({ error: "Formation introuvable" }, { status: 404 })
        }

        const complet = estComplet(formation)
        const passee = new Date(formation.date_debut + "T00:00:00") < new Date(new Date().toDateString())

        return NextResponse.json({
            places_totales: formation.places_totales,
            places_restantes: placesRestantes(formation),
            inscriptions_ouvertes: formation.inscriptions_ouvertes && !passee,
            complet,
            prix: formation.prix,
            devise: formation.devise,
        })
    } catch (error) {
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}
