import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
    emailConfirmationInscrit,
    emailValidationInscrit,
} from "@/lib/email-templates/formation-inscription"

const TYPES = ["confirmation", "validation"] as const
type TypeEmail = (typeof TYPES)[number]

const COLONNE_TRACE: Record<TypeEmail, string> = {
    confirmation: "confirmation_email_envoyee_at",
    validation: "validation_email_envoyee_at",
}

/**
 * POST — envoi manuel d'un e-mail à un inscrit. Réservé à l'admin.
 *
 * Body : { type: 'confirmation' | 'validation' }
 *
 * L'envoi est délibérément réautorisé même si l'e-mail a déjà été envoyé :
 * l'admin doit pouvoir renvoyer une confirmation perdue. C'est l'interface qui
 * signale qu'un envoi a déjà eu lieu, en s'appuyant sur l'horodatage renvoyé.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

        const type = body.type as TypeEmail
        if (!TYPES.includes(type)) {
            return NextResponse.json({ error: "Type d'e-mail invalide" }, { status: 400 })
        }

        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json(
                { error: "L'envoi d'e-mails n'est pas configuré (RESEND_API_KEY manquante)." },
                { status: 503 }
            )
        }

        const { data: inscription, error: erreurLecture } = await supabase
            .from("formation_inscriptions")
            .select("*, formation:formations(*)")
            .eq("id", id)
            .maybeSingle()

        if (erreurLecture) {
            return NextResponse.json({ error: erreurLecture.message }, { status: 500 })
        }

        if (!inscription || !inscription.formation) {
            return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 })
        }

        const contenu =
            type === "validation"
                ? emailValidationInscrit(inscription.formation, inscription)
                : emailConfirmationInscrit(inscription.formation, inscription)

        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)

        const { error: erreurEnvoi } = await resend.emails.send({
            from: process.env.FROM_EMAIL || "Odillon <noreply@support.odillon.fr>",
            to: inscription.email,
            subject: contenu.subject,
            html: contenu.html,
        })

        if (erreurEnvoi) {
            console.error("Échec envoi e-mail inscription:", erreurEnvoi)
            return NextResponse.json({ error: "L'e-mail n'a pas pu être envoyé." }, { status: 502 })
        }

        // Horodatage seulement après un envoi réussi.
        const envoyeLe = new Date().toISOString()
        const { data: maj } = await supabase
            .from("formation_inscriptions")
            .update({ [COLONNE_TRACE[type]]: envoyeLe })
            .eq("id", id)
            .select("*, formation:formations(id, titre, date_debut, lieu, modalite)")
            .maybeSingle()

        return NextResponse.json({ success: true, envoye_le: envoyeLe, inscription: maj })
    } catch (error) {
        console.error("Erreur renvoi e-mail:", error)
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}
