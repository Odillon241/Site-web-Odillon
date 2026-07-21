import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { checkRateLimit, verifyOrigin, getClientIP, logSecurityEvent } from "@/lib/security"
import { validerSatisfaction } from "@/lib/validations/satisfaction"

const MAX_PAYLOAD = 100 * 1024 // 100 Ko

/**
 * Correspondance entre les codes d'erreur de `soumettre_satisfaction()` et les
 * réponses HTTP. Voir la migration create_satisfaction_submit_logic.
 */
const ERREURS_RPC: Record<string, { status: number; code: string; message: string }> = {
    P0001: { status: 409, code: "DEJA_REPONDU", message: "Vous avez déjà répondu à ce questionnaire. Merci !" },
    P0002: { status: 404, code: "TOKEN_INVALIDE", message: "Ce lien de satisfaction n'est plus valide." },
}

/**
 * POST — soumission publique d'une réponse de satisfaction.
 *
 * L'accès est autorisé par le jeton nominatif (présent dans le corps), pas par
 * une session : c'est le lien reçu par e-mail après la formation. La route
 * reprend le durcissement de la route d'inscription publique.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: formationId } = await params
        const clientIP = getClientIP(request)

        if (!verifyOrigin(request)) {
            logSecurityEvent("origin_blocked", clientIP, `Origine refusée sur satisfaction ${formationId}`)
            return NextResponse.json({ error: "Requête non autorisée" }, { status: 403 })
        }

        const limite = checkRateLimit(`satisfaction:${clientIP}`, 5, 60 * 1000)
        if (!limite.allowed) {
            return NextResponse.json(
                { error: "Trop de tentatives. Veuillez réessayer dans quelques minutes.", retryAfter: limite.resetIn },
                { status: 429, headers: { "Retry-After": limite.resetIn.toString() } }
            )
        }

        const contentLength = request.headers.get("content-length")
        if (contentLength && parseInt(contentLength) > MAX_PAYLOAD) {
            return NextResponse.json({ error: "La taille de la requête dépasse la limite autorisée" }, { status: 413 })
        }

        if (!request.headers.get("content-type")?.includes("application/json")) {
            return NextResponse.json({ error: "Content-Type invalide. Attendu: application/json" }, { status: 415 })
        }

        let body: unknown
        try {
            body = await request.json()
        } catch {
            return NextResponse.json({ error: "Format JSON invalide" }, { status: 400 })
        }

        const validation = validerSatisfaction(body)
        if (!validation.isValid || !validation.data || !validation.token) {
            return NextResponse.json({ error: validation.errors[0], errors: validation.errors }, { status: 400 })
        }

        const service = await createServiceClient()
        const d = validation.data

        const { data: satisfaction, error: erreurRpc } = await service.rpc("soumettre_satisfaction", {
            p_token: validation.token,
            p_note_globale: d.note_globale,
            p_note_contenu: d.note_contenu,
            p_note_formateur: d.note_formateur,
            p_note_organisation: d.note_organisation,
            p_note_objectifs: d.note_objectifs,
            p_recommandation: d.recommandation,
            p_points_forts: d.points_forts,
            p_axes_amelioration: d.axes_amelioration,
            p_commentaire: d.commentaire,
            p_ip_address: clientIP,
            p_user_agent: request.headers.get("user-agent")?.substring(0, 300) || null,
        })

        if (erreurRpc) {
            const mappee = ERREURS_RPC[erreurRpc.code as string]
            if (mappee) {
                return NextResponse.json({ error: mappee.message, code: mappee.code }, { status: mappee.status })
            }
            console.error("Erreur soumettre_satisfaction:", erreurRpc)
            return NextResponse.json({ error: "Votre réponse n'a pas pu être enregistrée." }, { status: 500 })
        }

        return NextResponse.json({ satisfaction: { id: satisfaction.id } }, { status: 201 })
    } catch (error) {
        console.error("Erreur POST satisfaction:", error)
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}

/** GET — réponses de satisfaction d'une session. Réservé à l'admin. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: formationId } = await params
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
        }

        const { data: satisfactions, error } = await supabase
            .from("formation_satisfactions")
            .select("*")
            .eq("formation_id", formationId)
            .order("created_at", { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ satisfactions })
    } catch (error) {
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}
