import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const STATUTS = ["en_attente", "confirmee", "annulee", "liste_attente"]
const PAIEMENT_STATUTS = ["en_attente", "paye", "partiel", "rembourse", "gratuit"]
const LIMITE_DEFAUT = 100
const LIMITE_MAX = 500

/**
 * GET — liste des inscriptions, filtrable. Réservé à l'admin.
 *
 * Filtres : ?formation_id= &statut= &paiement_statut= &q= &limit=
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
        const statut = searchParams.get("statut")
        const paiementStatut = searchParams.get("paiement_statut")
        const recherche = searchParams.get("q")?.trim()
        const limiteBrute = parseInt(searchParams.get("limit") || String(LIMITE_DEFAUT), 10)
        const limite = Number.isNaN(limiteBrute) ? LIMITE_DEFAUT : Math.min(Math.max(limiteBrute, 1), LIMITE_MAX)

        if (statut && !STATUTS.includes(statut)) {
            return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
        }
        if (paiementStatut && !PAIEMENT_STATUTS.includes(paiementStatut)) {
            return NextResponse.json({ error: "Statut de paiement invalide" }, { status: 400 })
        }

        let query = supabase
            .from("formation_inscriptions")
            .select("*, formation:formations(id, titre, date_debut, lieu, modalite)")
            .order("created_at", { ascending: false })
            .limit(limite)

        if (formationId) query = query.eq("formation_id", formationId)
        if (statut) query = query.eq("statut", statut)
        if (paiementStatut) query = query.eq("paiement_statut", paiementStatut)

        if (recherche) {
            // Échappe les caractères spéciaux de PostgREST : une virgule non
            // échappée dans `or()` casserait la syntaxe du filtre.
            const terme = recherche.replace(/[,()]/g, " ").trim()
            if (terme) {
                query = query.or(`nom.ilike.%${terme}%,email.ilike.%${terme}%,societe.ilike.%${terme}%`)
            }
        }

        const { data: inscriptions, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ inscriptions })
    } catch (error) {
        console.error("Erreur GET inscriptions:", error)
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}
