import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import {
    checkRateLimit,
    verifyOrigin,
    getClientIP,
    logSecurityEvent,
} from "@/lib/security"
import { validerSocle, validerReponses } from "@/lib/validations/formation"
import {
    emailConfirmationInscrit,
    emailNotificationEquipe,
} from "@/lib/email-templates/formation-inscription"
import type { ChampPersonnalise } from "@/types/formation"

const MAX_PAYLOAD = 100 * 1024 // 100 Ko

/**
 * Correspondance entre les codes d'erreur levés par `inscrire_formation()`
 * et les réponses HTTP. Voir la migration 20260715165240.
 */
const ERREURS_RPC: Record<string, { status: number; code: string; message: string }> = {
    P0001: { status: 409, code: "COMPLET", message: "Cette session est complète." },
    P0002: { status: 404, code: "FORMATION_INTROUVABLE", message: "Cette formation n'existe pas ou n'est plus disponible." },
    P0003: { status: 400, code: "INSCRIPTIONS_FERMEES", message: "Les inscriptions à cette session sont fermées." },
    P0004: { status: 400, code: "SESSION_PASSEE", message: "Cette session a déjà eu lieu." },
}

/**
 * POST — inscription publique.
 *
 * Enchaînement de contrôles repris de `app/api/contact/route.ts`, qui est le
 * modèle de route publique durcie du projet.
 *
 * Le rate-limiting est en mémoire (`lib/security.ts`) et n'est donc pas
 * partagé entre instances serverless : il ne vaut qu'en atténuation. Les
 * garanties réelles sont l'index unique (anti-doublon) et le verrou
 * `FOR UPDATE` de la RPC (anti-surbooking).
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: formationId } = await params
        const clientIP = getClientIP(request)

        // 1. Origine (CSRF basique)
        if (!verifyOrigin(request)) {
            logSecurityEvent("origin_blocked", clientIP, `Origine refusée sur inscription ${formationId}`)
            return NextResponse.json({ error: "Requête non autorisée" }, { status: 403 })
        }

        // 2. Rate limit par IP.
        //    5/minute comme le formulaire de contact : les tentatives rejetées
        //    par la validation consomment aussi le quota, et un visiteur qui
        //    corrige deux fois une erreur de saisie ne doit pas être verrouillé.
        const limite = checkRateLimit(`inscription:${clientIP}`, 5, 60 * 1000)
        if (!limite.allowed) {
            return NextResponse.json(
                { error: "Trop de tentatives. Veuillez réessayer dans quelques minutes.", retryAfter: limite.resetIn },
                {
                    status: 429,
                    headers: {
                        "Retry-After": limite.resetIn.toString(),
                        "X-RateLimit-Remaining": "0",
                    },
                }
            )
        }

        // 3. Taille
        const contentLength = request.headers.get("content-length")
        if (contentLength && parseInt(contentLength) > MAX_PAYLOAD) {
            return NextResponse.json({ error: "La taille de la requête dépasse la limite autorisée" }, { status: 413 })
        }

        // 4. Content-Type
        if (!request.headers.get("content-type")?.includes("application/json")) {
            return NextResponse.json({ error: "Content-Type invalide. Attendu: application/json" }, { status: 415 })
        }

        // 5. Parsing
        let body: Record<string, unknown>
        try {
            body = await request.json()
        } catch {
            return NextResponse.json({ error: "Format JSON invalide" }, { status: 400 })
        }

        // 6. Validation du socle
        const socle = validerSocle({
            nom: body.nom as string,
            email: body.email as string,
            telephone: body.telephone as string | null,
            societe: body.societe as string | null,
            fonction: body.fonction as string | null,
        })

        if (!socle.isValid) {
            const messages = socle.errors.join(", ")
            if (messages.includes("caractères non autorisés")) {
                logSecurityEvent("sql_injection", clientIP, `Inscription refusée: ${messages}`)
            }
            return NextResponse.json({ error: socle.errors[0], errors: socle.errors }, { status: 400 })
        }

        const modePaiement = body.mode_paiement as string | null | undefined
        const MODES = ["virement", "especes", "mobile_money", "cheque", "autre"]
        if (modePaiement && !MODES.includes(modePaiement)) {
            return NextResponse.json({ error: "Mode de paiement invalide" }, { status: 400 })
        }

        const service = await createServiceClient()

        // 7. Charger la formation pour valider les réponses aux champs
        //    personnalisés (leur définition vit sur la session).
        const { data: formation, error: erreurFormation } = await service
            .from("formations")
            .select("*")
            .eq("id", formationId)
            .maybeSingle()

        if (erreurFormation) {
            console.error("Erreur chargement formation:", erreurFormation)
            return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
        }

        if (!formation || !formation.is_active) {
            return NextResponse.json(
                { error: ERREURS_RPC.P0002.message, code: "FORMATION_INTROUVABLE" },
                { status: 404 }
            )
        }

        const reponses = validerReponses(
            (formation.champs_personnalises || []) as ChampPersonnalise[],
            (body.reponses || {}) as Record<string, unknown>
        )

        if (!reponses.isValid) {
            return NextResponse.json({ error: reponses.errors[0], errors: reponses.errors }, { status: 400 })
        }

        // 8. Garde-fou par e-mail, au-delà de la limite par IP (contournable
        //    derrière un NAT ou un proxy partagé).
        //
        //    Volontairement placé APRÈS toute la validation : le compter plus
        //    tôt ferait consommer le quota par de simples fautes de frappe, et
        //    un visiteur qui corrige trois fois son formulaire se retrouverait
        //    bloqué une heure. Seules les tentatives complètes comptent ici.
        const limiteEmail = checkRateLimit(`inscription-email:${socle.data!.email.toLowerCase()}`, 5, 60 * 60 * 1000)
        if (!limiteEmail.allowed) {
            return NextResponse.json(
                { error: "Trop de tentatives pour cette adresse e-mail. Réessayez plus tard." },
                { status: 429 }
            )
        }

        // 9. Inscription atomique : la RPC verrouille la session, revérifie la
        //    capacité et insère dans la même transaction.
        const { data: inscription, error: erreurRpc } = await service.rpc("inscrire_formation", {
            p_formation_id: formationId,
            p_nom: socle.data!.nom,
            p_email: socle.data!.email,
            p_telephone: socle.data!.telephone,
            p_societe: socle.data!.societe,
            p_fonction: socle.data!.fonction,
            p_mode_paiement: modePaiement || null,
            p_reponses: reponses.data,
            p_ip_address: clientIP,
            p_user_agent: request.headers.get("user-agent")?.substring(0, 300) || null,
        })

        if (erreurRpc) {
            const mappee = ERREURS_RPC[erreurRpc.code as string]
            if (mappee) {
                return NextResponse.json({ error: mappee.message, code: mappee.code }, { status: mappee.status })
            }
            if (erreurRpc.code === "23505") {
                return NextResponse.json(
                    { error: "Vous êtes déjà inscrit(e) à cette session avec cette adresse e-mail.", code: "DEJA_INSCRIT" },
                    { status: 409 }
                )
            }
            console.error("Erreur inscrire_formation:", erreurRpc)
            return NextResponse.json({ error: "Erreur lors de l'enregistrement de l'inscription." }, { status: 500 })
        }

        // 10. E-mails — non bloquants : une panne Resend ne doit pas annuler
        //     une inscription déjà enregistrée.
        if (process.env.RESEND_API_KEY) {
            try {
                const { Resend } = await import("resend")
                const resend = new Resend(process.env.RESEND_API_KEY)
                const from = process.env.FROM_EMAIL || "Odillon <noreply@support.odillon.fr>"

                // resend.emails.send() NE LÈVE PAS d'exception sur erreur API :
                // il résout avec `{ error }`. Sans ce wrapper, allSettled voit
                // « fulfilled » même sur un échec, et l'on horodaterait un
                // e-mail jamais parti — l'inscrit passerait alors pour notifié.
                const envoyer = async (options: Parameters<typeof resend.emails.send>[0]) => {
                    const { data, error } = await resend.emails.send(options)
                    if (error) throw error
                    return data
                }

                const confirmation = emailConfirmationInscrit(formation, inscription)
                const notification = emailNotificationEquipe(formation, inscription)

                const envois = await Promise.allSettled([
                    envoyer({
                        from,
                        to: inscription.email,
                        subject: confirmation.subject,
                        html: confirmation.html,
                    }),
                    process.env.CONTACT_EMAIL
                        ? envoyer({
                              from,
                              to: process.env.CONTACT_EMAIL,
                              replyTo: inscription.email,
                              subject: notification.subject,
                              html: notification.html,
                          })
                        : Promise.resolve(null),
                ])

                if (envois[0].status === "fulfilled") {
                    await service
                        .from("formation_inscriptions")
                        .update({ confirmation_email_envoyee_at: new Date().toISOString() })
                        .eq("id", inscription.id)
                } else {
                    console.error("Échec e-mail de confirmation:", envois[0].reason)
                }

                if (envois[1].status === "rejected") {
                    console.error("Échec notification équipe:", envois[1].reason)
                }
            } catch (erreurEmail) {
                console.error("Erreur envoi e-mails inscription:", erreurEmail)
            }
        }

        return NextResponse.json(
            {
                inscription: {
                    id: inscription.id,
                    nom: inscription.nom,
                    email: inscription.email,
                    montant_du: inscription.montant_du,
                    devise: inscription.devise,
                    paiement_statut: inscription.paiement_statut,
                },
            },
            { status: 201, headers: { "X-RateLimit-Remaining": limite.remaining.toString() } }
        )
    } catch (error) {
        console.error("Erreur POST inscription:", error)
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}

/** GET — inscrits d'une session. Réservé à l'admin. */
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

        const { data: inscriptions, error } = await supabase
            .from("formation_inscriptions")
            .select("*")
            .eq("formation_id", formationId)
            .order("created_at", { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ inscriptions })
    } catch (error) {
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}
