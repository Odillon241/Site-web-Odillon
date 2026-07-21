import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Colonnes modifiables par l'admin.
 *
 * Le socle (nom, e-mail...) et les réponses en sont volontairement absents :
 * ce sont les déclarations de l'inscrit, elles ne doivent pas être réécrites
 * après coup. `montant_du` non plus — c'est un snapshot du tarif au moment de
 * l'inscription. Un correctif éventuel passe par `notes_admin`.
 */
const CHAMPS_MODIFIABLES = [
    "statut",
    "paiement_statut",
    "mode_paiement",
    "montant_regle",
    "reference_paiement",
    "notes_admin",
] as const

const STATUTS = ["en_attente", "confirmee", "annulee", "liste_attente"]
const PAIEMENT_STATUTS = ["en_attente", "paye", "partiel", "rembourse", "gratuit"]
const MODES = ["virement", "especes", "mobile_money", "cheque", "autre"]

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
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

        if (updateData.statut && !STATUTS.includes(updateData.statut as string)) {
            return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
        }
        if (updateData.paiement_statut && !PAIEMENT_STATUTS.includes(updateData.paiement_statut as string)) {
            return NextResponse.json({ error: "Statut de paiement invalide" }, { status: 400 })
        }
        if (updateData.mode_paiement && !MODES.includes(updateData.mode_paiement as string)) {
            return NextResponse.json({ error: "Mode de paiement invalide" }, { status: 400 })
        }
        if (updateData.montant_regle != null) {
            const montant = Number(updateData.montant_regle)
            if (Number.isNaN(montant) || montant < 0) {
                return NextResponse.json({ error: "Le montant réglé doit être un nombre positif" }, { status: 400 })
            }
            updateData.montant_regle = montant
        }

        // Le trigger en base ajuste `places_reservees` si le statut change.
        const { data, error } = await supabase
            .from("formation_inscriptions")
            .update(updateData)
            .eq("id", id)
            .select("*, formation:formations(id, titre, date_debut, lieu, modalite)")
            .maybeSingle()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!data) {
            return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 })
        }

        return NextResponse.json({ inscription: data })
    } catch (error) {
        console.error("Erreur PATCH inscription:", error)
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
        }

        const { error } = await supabase.from("formation_inscriptions").delete().eq("id", id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}
