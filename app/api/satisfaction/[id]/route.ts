import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * DELETE — suppression d'une réponse de satisfaction. Réservé à l'admin.
 *
 * Sert à retirer une réponse de test ou un spam. Les réponses ne sont jamais
 * modifiables (ce sont les déclarations du participant) : seule la suppression
 * est exposée.
 */
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

        const { error } = await supabase.from("formation_satisfactions").delete().eq("id", id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}
