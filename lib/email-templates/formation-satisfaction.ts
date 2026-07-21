import { escapeHtml, sanitizeEmailHeader } from "@/lib/security"
import {
    referenceInscription,
    type Formation,
    type FormationInscription,
    MODALITE_LABELS,
} from "@/types/formation"
import {
    emailLayout,
    emailParagraph,
    emailButton,
    emailInfoTable,
    emailCallout,
} from "./base"

type FormationEmail = Pick<
    Formation,
    "id" | "titre" | "date_debut" | "date_fin" | "lieu" | "modalite" | "formateur"
>

type InscriptionEmail = Pick<FormationInscription, "id" | "nom">

function formatDate(iso?: string | null): string {
    if (!iso) return ""
    return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

function formatPeriode(f: FormationEmail): string {
    const debut = formatDate(f.date_debut)
    if (!f.date_fin || f.date_fin === f.date_debut) return debut
    return `${debut} → ${formatDate(f.date_fin)}`
}

/**
 * (e) Sollicitation de satisfaction après la session (cron).
 *
 * `url` porte le jeton nominatif : c'est le seul lien qui autorise la réponse.
 * Il n'est jamais réutilisable (une réponse par jeton) et n'expose aucune
 * autre inscription.
 */
export function emailDemandeSatisfaction(f: FormationEmail, inscription: InscriptionEmail, url: string) {
    const ref = referenceInscription(inscription.id)

    const bodyHtml = [
        emailParagraph(`Bonjour ${escapeHtml(inscription.nom)},`),
        emailParagraph(
            `Vous avez participé à <strong>${escapeHtml(f.titre)}</strong>. Votre avis nous est précieux pour améliorer nos formations.`
        ),
        emailInfoTable([
            ["Formation", escapeHtml(f.titre)],
            ["Dates", escapeHtml(formatPeriode(f))],
            ["Lieu", f.lieu ? escapeHtml(f.lieu) : null],
            ["Modalité", f.modalite ? escapeHtml(MODALITE_LABELS[f.modalite] || f.modalite) : null],
            ["Intervenant", f.formateur ? escapeHtml(f.formateur) : null],
        ]),
        emailParagraph(`Le questionnaire ne prend que <strong>deux minutes</strong>.`),
        emailButton(url, "Donner mon avis"),
        emailCallout(
            `Ce lien vous est personnel. Si le bouton ne fonctionne pas, copiez cette adresse dans votre navigateur :<br><span style="word-break: break-all;">${escapeHtml(url)}</span>`,
            "info"
        ),
    ]
        .filter(Boolean)
        .join("\n")

    return {
        subject: sanitizeEmailHeader(`Votre avis sur : ${f.titre}`),
        html: emailLayout({
            eyebrow: "Questionnaire de satisfaction",
            title: "Votre avis compte",
            bodyHtml,
            footerNote: `Référence : ${ref}`,
        }),
    }
}
