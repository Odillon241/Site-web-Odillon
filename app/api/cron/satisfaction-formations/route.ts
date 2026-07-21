import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { emailDemandeSatisfaction } from "@/lib/email-templates/formation-satisfaction"

/** Resend limite à ~2 requêtes/seconde : on envoie par petits lots espacés. */
const TAILLE_LOT = 8
const PAUSE_ENTRE_LOTS_MS = 1100

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://odillon.fr"

function attendre(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * GET — envoi des questionnaires de satisfaction après la session. Déclenché
 * par le cron Vercel.
 *
 * Idempotence : `satisfaction_email_envoye_at IS NULL` EST la clé. L'horodatage
 * n'est posé qu'après un envoi réussi, ligne par ligne — un échec Resend est
 * donc simplement retenté le lendemain.
 *
 * La fenêtre de sélection tolère un run manqué : une session dont la fin +
 * `satisfaction_jours_apres` est déjà passée reçoit son questionnaire au
 * prochain run, plutôt que d'être perdue.
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
        const aujourdHuiISO = new Date().toISOString().split("T")[0]

        const { data: candidats, error } = await service
            .from("formation_inscriptions")
            .select("*, formation:formations!inner(*)")
            .is("satisfaction_email_envoye_at", null)
            .in("statut", ["en_attente", "confirmee"])
            .not("formation.satisfaction_jours_apres", "is", null)
            // Coarse : la session doit avoir commencé. Le délai précis après la
            // FIN de session (multi-jours) est recalculé ci-dessous.
            .lte("formation.date_debut", aujourdHuiISO)

        if (error) {
            console.error("Erreur sélection satisfaction:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const aujourdHui = new Date(new Date().toDateString())

        // La comparaison « fin de session + délai <= aujourd'hui » porte sur des
        // colonnes de deux tables : PostgREST ne sait pas l'exprimer, on la
        // calcule donc ici.
        const aEnvoyer = (candidats || []).filter((i) => {
            const fin = new Date((i.formation.date_fin || i.formation.date_debut) + "T00:00:00")
            const joursDepuisFin = Math.round((aujourdHui.getTime() - fin.getTime()) / 86_400_000)
            return joursDepuisFin >= (i.formation.satisfaction_jours_apres ?? 0)
        })

        if (aEnvoyer.length === 0) {
            return NextResponse.json({ success: true, envoyes: 0, echecs: 0, message: "Aucun questionnaire à envoyer" })
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
                    const url = `${SITE_URL}/formations/${inscription.formation_id}/satisfaction?token=${inscription.satisfaction_token}`
                    const contenu = emailDemandeSatisfaction(inscription.formation, inscription, url)

                    const { error: erreurEnvoi } = await resend.emails.send({
                        from,
                        to: inscription.email,
                        subject: contenu.subject,
                        html: contenu.html,
                    })

                    if (erreurEnvoi) throw erreurEnvoi

                    // Horodatage seulement après succès : sinon un échec serait
                    // marqué comme traité et le questionnaire jamais renvoyé.
                    await service
                        .from("formation_inscriptions")
                        .update({ satisfaction_email_envoye_at: new Date().toISOString() })
                        .eq("id", inscription.id)

                    return inscription.id
                })
            )

            for (const r of resultats) {
                if (r.status === "fulfilled") envoyes++
                else {
                    echecs++
                    console.error("Échec satisfaction:", r.reason)
                }
            }

            if (i + TAILLE_LOT < aEnvoyer.length) {
                await attendre(PAUSE_ENTRE_LOTS_MS)
            }
        }

        return NextResponse.json({ success: true, envoyes, echecs, candidats: aEnvoyer.length })
    } catch (error) {
        console.error("Erreur cron satisfaction:", error)
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}
