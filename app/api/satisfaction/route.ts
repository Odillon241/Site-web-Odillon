import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const LIMITE_DEFAUT = 200
const LIMITE_MAX = 1000

/**
 * GET — liste des réponses de satisfaction, filtrable. Réservé à l'admin.
 *
 * Filtres : ?formation_id= &limit=
 */
export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const formationId = searchParams.get("formation_id")
        const limiteBrute = parseInt(searchParams.get("limit") || String(LIMITE_DEFAUT), 10)
        const limite = Number.isNaN(limiteBrute) ? LIMITE_DEFAUT : Math.min(Math.max(limiteBrute, 1), LIMITE_MAX)

        let query = supabase
            .from("formation_satisfactions")
            .select("*, formation:formations(id, titre, date_debut)")
            .order("created_at", { ascending: false })
            .limit(limite)

        if (formationId) query = query.eq("formation_id", formationId)

        const { data: satisfactions, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ satisfactions })
    } catch (error) {
        console.error("Erreur GET satisfactions:", error)
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}
