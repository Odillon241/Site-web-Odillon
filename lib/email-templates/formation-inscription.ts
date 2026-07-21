import { escapeHtml, sanitizeEmailHeader } from "@/lib/security"
import { formatReponse } from "@/lib/validations/formation"
import {
    formatMontant,
    referenceInscription,
    type Formation,
    type FormationInscription,
    MODALITE_LABELS,
    MODE_PAIEMENT_LABELS,
} from "@/types/formation"
import {
    emailLayout,
    emailParagraph,
    emailButton,
    emailInfoTable,
    emailCallout,
} from "./base"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://odillon.fr"

type FormationEmail = Pick<
    Formation,
    "id" | "titre" | "date_debut" | "date_fin" | "horaires" | "duree" | "lieu" | "modalite" | "formateur" | "instructions_paiement"
>

type InscriptionEmail = Pick<
    FormationInscription,
    "id" | "nom" | "email" | "telephone" | "societe" | "fonction" | "reponses" | "mode_paiement" | "montant_du" | "montant_regle" | "devise"
>

function formatDate(iso?: string | null): string {
    if (!iso) return ""
    return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", {
        weekday: "long",
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

/** Récapitulatif de la session, commun à plusieurs e-mails. */
function blocSession(f: FormationEmail): string {
    return emailInfoTable([
        ["Formation", escapeHtml(f.titre)],
        ["Dates", escapeHtml(formatPeriode(f))],
        ["Horaires", f.horaires ? escapeHtml(f.horaires) : null],
        ["Durée", f.duree ? escapeHtml(f.duree) : null],
        ["Lieu", f.lieu ? escapeHtml(f.lieu) : null],
        ["Modalité", f.modalite ? escapeHtml(MODALITE_LABELS[f.modalite] || f.modalite) : null],
        ["Intervenant", f.formateur ? escapeHtml(f.formateur) : null],
    ])
}

/**
 * Réponses aux champs personnalisés.
 *
 * Le label ET la valeur viennent du visiteur (le label a été défini par
 * l'admin, la valeur est saisie librement) : les deux sont échappés. Sans
 * cela, une réponse contenant du HTML s'exécuterait dans la boîte mail de
 * l'équipe.
 */
function blocReponses(inscription: InscriptionEmail): string {
    const entries = Object.values(inscription.reponses || {})
    if (entries.length === 0) return ""
    return emailInfoTable(
        entries.map((r) => [escapeHtml(r.label), escapeHtml(formatReponse(r))] as [string, string])
    )
}

// ---------------------------------------------------------------------------
// (a) Confirmation à l'inscrit
// ---------------------------------------------------------------------------

export function emailConfirmationInscrit(f: FormationEmail, inscription: InscriptionEmail) {
    const ref = referenceInscription(inscription.id)
    const gratuit = inscription.montant_du === 0
    const surDemande = inscription.montant_du == null

    let paiement = ""
    if (!gratuit) {
        const montant = surDemande
            ? "Le tarif vous sera communiqué par notre équipe."
            : `<strong>${escapeHtml(formatMontant(inscription.montant_du, inscription.devise))}</strong>`

        const mode = inscription.mode_paiement
            ? `<br>Mode de règlement choisi : ${escapeHtml(MODE_PAIEMENT_LABELS[inscription.mode_paiement] || inscription.mode_paiement)}.`
            : ""

        const instructions = f.instructions_paiement
            ? `<br><br>${escapeHtml(f.instructions_paiement).replace(/\n/g, "<br>")}`
            : ""

        paiement = emailCallout(
            `<strong>Règlement :</strong> ${montant}${mode}${instructions}`,
            "attention"
        )
    }

    const bodyHtml = [
        emailParagraph(`Bonjour ${escapeHtml(inscription.nom)},`),
        emailParagraph(
            `Nous avons bien enregistré votre inscription. Votre référence est <strong>${ref}</strong> — merci de la rappeler dans vos échanges avec nous.`
        ),
        blocSession(f),
        blocReponses(inscription),
        paiement,
        emailCallout(
            `Votre inscription sera <strong>définitivement confirmée</strong> après validation par notre équipe. Vous recevrez alors un second e-mail.`,
            "info"
        ),
    ]
        .filter(Boolean)
        .join("\n")

    return {
        subject: sanitizeEmailHeader(`Votre inscription : ${f.titre} (réf. ${ref})`),
        html: emailLayout({
            eyebrow: "Confirmation d'inscription",
            title: "Votre inscription est enregistrée",
            bodyHtml,
            footerNote: `Référence : ${ref}`,
        }),
    }
}

// ---------------------------------------------------------------------------
// (b) Notification à l'équipe
// ---------------------------------------------------------------------------

export function emailNotificationEquipe(f: FormationEmail, inscription: InscriptionEmail) {
    const ref = referenceInscription(inscription.id)
    const safeEmail = escapeHtml(inscription.email)

    const bodyHtml = [
        emailParagraph(`Une nouvelle inscription vient d'être enregistrée sur le site.`),
        emailInfoTable([
            ["Nom", escapeHtml(inscription.nom)],
            ["E-mail", `<a href="mailto:${safeEmail}" style="color: #00a795; text-decoration: none;">${safeEmail}</a>`],
            ["Téléphone", inscription.telephone ? escapeHtml(inscription.telephone) : null],
            ["Société", inscription.societe ? escapeHtml(inscription.societe) : null],
            ["Fonction", inscription.fonction ? escapeHtml(inscription.fonction) : null],
            [
                "Règlement",
                inscription.mode_paiement
                    ? escapeHtml(MODE_PAIEMENT_LABELS[inscription.mode_paiement] || inscription.mode_paiement)
                    : null,
            ],
            ["Montant dû", escapeHtml(formatMontant(inscription.montant_du, inscription.devise))],
        ]),
        blocSession(f),
        blocReponses(inscription),
        emailButton(`${SITE_URL}/admin/settings`, "Gérer les inscriptions"),
    ]
        .filter(Boolean)
        .join("\n")

    return {
        subject: sanitizeEmailHeader(`Nouvelle inscription : ${f.titre} — ${inscription.nom}`),
        html: emailLayout({
            eyebrow: "Nouvelle inscription",
            title: `Inscription à « ${escapeHtml(f.titre)} »`,
            bodyHtml,
            footerNote: `Référence : ${ref}`,
        }),
    }
}

// ---------------------------------------------------------------------------
// (c) Validation / paiement confirmé (déclenché manuellement par l'admin)
// ---------------------------------------------------------------------------

export function emailValidationInscrit(f: FormationEmail, inscription: InscriptionEmail) {
    const ref = referenceInscription(inscription.id)
    const resteAPayer =
        inscription.montant_du != null && Number(inscription.montant_du) > Number(inscription.montant_regle || 0)
            ? Number(inscription.montant_du) - Number(inscription.montant_regle || 0)
            : 0

    const bodyHtml = [
        emailParagraph(`Bonjour ${escapeHtml(inscription.nom)},`),
        emailParagraph(
            `Votre inscription à <strong>${escapeHtml(f.titre)}</strong> est <strong>confirmée</strong>. Nous avons le plaisir de vous compter parmi les participants.`
        ),
        blocSession(f),
        resteAPayer > 0
            ? emailCallout(
                  `<strong>Solde restant :</strong> ${escapeHtml(formatMontant(resteAPayer, inscription.devise))}. ${
                      f.instructions_paiement ? escapeHtml(f.instructions_paiement).replace(/\n/g, "<br>") : ""
                  }`,
                  "attention"
              )
            : emailCallout(`<strong>Votre règlement a bien été reçu.</strong> Aucune action de votre part n'est requise.`, "succes"),
        emailParagraph(`Pour toute question, il vous suffit de répondre à cet e-mail.`),
    ]
        .filter(Boolean)
        .join("\n")

    return {
        subject: sanitizeEmailHeader(`Inscription confirmée : ${f.titre} (réf. ${ref})`),
        html: emailLayout({
            eyebrow: "Inscription confirmée",
            title: "Votre participation est confirmée",
            bodyHtml,
            footerNote: `Référence : ${ref}`,
        }),
    }
}

// ---------------------------------------------------------------------------
// (d) Rappel avant la session (cron)
// ---------------------------------------------------------------------------

export function emailRappelInscrit(f: FormationEmail, inscription: InscriptionEmail, joursAvant: number) {
    const ref = referenceInscription(inscription.id)
    const quand =
        joursAvant <= 0
            ? "a lieu aujourd'hui"
            : joursAvant === 1
              ? "a lieu demain"
              : `débute dans ${joursAvant} jours`

    const resteAPayer =
        inscription.montant_du != null && Number(inscription.montant_du) > Number(inscription.montant_regle || 0)
            ? Number(inscription.montant_du) - Number(inscription.montant_regle || 0)
            : 0

    const bodyHtml = [
        emailParagraph(`Bonjour ${escapeHtml(inscription.nom)},`),
        emailParagraph(`Petit rappel : la formation à laquelle vous êtes inscrit(e) ${quand}.`),
        blocSession(f),
        resteAPayer > 0
            ? emailCallout(
                  `<strong>Règlement en attente :</strong> ${escapeHtml(formatMontant(resteAPayer, inscription.devise))}. Merci de régulariser avant le début de la session.`,
                  "attention"
              )
            : "",
        emailParagraph(`Nous nous réjouissons de vous accueillir.`),
    ]
        .filter(Boolean)
        .join("\n")

    return {
        subject: sanitizeEmailHeader(`Rappel : ${f.titre} — ${formatDate(f.date_debut)}`),
        html: emailLayout({
            eyebrow: "Rappel de session",
            title: `Votre formation ${quand}`,
            bodyHtml,
            footerNote: `Référence : ${ref}`,
        }),
    }
}
