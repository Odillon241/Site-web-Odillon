import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { emailRappelInscrit } from "@/lib/email-templates/formation-inscription"

/** Resend limite à ~2 requêtes/seconde : on envoie par petits lots espacés. */
const TAILLE_LOT = 8
const PAUSE_ENTRE_LOTS_MS = 1100

function attendre(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * GET — envoi des rappels avant session. Déclenché par le cron Vercel.
 *
 * Idempotence : `rappel_email_envoye_at IS NULL` EST la clé. L'horodatage
 * n'est posé qu'après un envoi réussi, ligne par ligne — un échec Resend est
 * donc simplement retenté le lendemain.
 *
 * Risque résiduel assumé : envoi réussi + horodatage en échec ⇒ un rappel en
 * double le lendemain. C'est bénin ; un mécanisme de réservation préalable
 * serait disproportionné ici.
 *
 * La fenêtre de sélection (`date_debut - rappel_jours_avant <= today`) tolère
 * un run manqué : un rappel non parti hier part aujourd'hui, plutôt que d'être
 * perdu comme avec une égalité stricte.
 */
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization")
        if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: "RESEND_API_KEY manquante" }, { status: 503 })
        }

        const service = await createServiceClient()

        const { data: candidats, error } = await service
            .from("formation_inscriptions")
            .select("*, formation:formations!inner(*)")
            .is("rappel_email_envoye_at", null)
            .in("statut", ["en_attente", "confirmee"])
            .not("formation.rappel_jours_avant", "is", null)
            .gte("formation.date_debut", new Date().toISOString().split("T")[0])

        if (error) {
            console.error("Erreur sélection rappels:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const aujourdHui = new Date(new Date().toDateString())

        // Le filtre « la session entre dans sa fenêtre de rappel » compare deux
        // colonnes de tables différentes : PostgREST ne sait pas l'exprimer,
        // on le calcule donc ici.
        const aEnvoyer = (candidats || []).filter((i) => {
            const debut = new Date(i.formation.date_debut + "T00:00:00")
            const joursRestants = Math.round((debut.getTime() - aujourdHui.getTime()) / 86_400_000)
            return joursRestants <= (i.formation.rappel_jours_avant ?? 0)
        })

        if (aEnvoyer.length === 0) {
            return NextResponse.json({ success: true, envoyes: 0, echecs: 0, message: "Aucun rappel à envoyer" })
        }

        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)
        const from = process.env.FROM_EMAIL || "Odillon <noreply@support.odillon.fr>"

        let envoyes = 0
        let echecs = 0

        for (let i = 0; i < aEnvoyer.length; i += TAILLE_LOT) {
            const lot = aEnvoyer.slice(i, i + TAILLE_LOT)

            const resultats = await Promise.allSettled(
                lot.map(async (inscription) => {
                    const debut = new Date(inscription.formation.date_debut + "T00:00:00")
                    const joursRestants = Math.round((debut.getTime() - aujourdHui.getTime()) / 86_400_000)

                    const contenu = emailRappelInscrit(inscription.formation, inscription, joursRestants)

                    const { error: erreurEnvoi } = await resend.emails.send({
                        from,
                        to: inscription.email,
                        subject: contenu.subject,
                        html: contenu.html,
                    })

                    if (erreurEnvoi) throw erreurEnvoi

                    // Horodatage seulement après succès : sinon un échec serait
                    // marqué comme traité et le rappel jamais renvoyé.
                    await service
                        .from("formation_inscriptions")
                        .update({ rappel_email_envoye_at: new Date().toISOString() })
                        .eq("id", inscription.id)

                    return inscription.id
                })
            )

            for (const r of resultats) {
                if (r.status === "fulfilled") envoyes++
                else {
                    echecs++
                    console.error("Échec rappel:", r.reason)
                }
            }

            if (i + TAILLE_LOT < aEnvoyer.length) {
                await attendre(PAUSE_ENTRE_LOTS_MS)
            }
        }

        return NextResponse.json({ success: true, envoyes, echecs, candidats: aEnvoyer.length })
    } catch (error) {
        console.error("Erreur cron rappels:", error)
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}
