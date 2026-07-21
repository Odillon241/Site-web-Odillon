/**
 * Coquille HTML commune aux e-mails transactionnels.
 *
 * Extraite des templates inline de `app/api/contact/route.ts` (tables 600px,
 * Georgia pour les titres, #0A1F2C, accent #00a795) afin que les nouveaux
 * e-mails partagent l'identité visuelle sans la dupliquer.
 *
 * Les e-mails du formulaire de contact n'ont volontairement PAS été migrés ici
 * dans le même lot : ce sont les plus visibles du site, leur refonte mérite
 * d'être vérifiable isolément.
 *
 * Contrainte de rendu : les clients mail (Outlook en particulier) ignorent le
 * CSS externe et une bonne partie de flexbox/grid — d'où les tables imbriquées
 * et les styles en attribut `style` plutôt que des classes.
 */

const ACCENT = "#00a795"
const DARK = "#0A1F2C"
const BORDER = "#E5E7EB"
const MUTED = "#6B7280"
const BG = "#F9FAFB"

export interface EmailLayoutOptions {
    /** Titre affiché dans le bandeau, sous « Cabinet Odillon ». */
    eyebrow: string
    /** Titre principal du corps. */
    title: string
    /** Corps HTML déjà échappé. */
    bodyHtml: string
    /** Ligne de pied de page optionnelle (référence, date...). */
    footerNote?: string
}

export function emailLayout({ eyebrow, title, bodyHtml, footerNote }: EmailLayoutOptions): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: ${DARK}; background-color: ${BG}; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BG}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid ${BORDER}; max-width: 600px; width: 100%;">
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid ${BORDER};">
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; color: ${DARK}; margin: 0; letter-spacing: -0.02em;">Cabinet Odillon</h1>
              <p style="font-size: 13px; color: ${MUTED}; margin: 8px 0 0;">${eyebrow}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: ${DARK}; margin: 0 0 24px; letter-spacing: -0.02em;">${title}</h2>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: ${BG}; border-top: 1px solid ${BORDER};">
              <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 8px; text-align: center;">
                Cabinet Odillon - Ingénierie d'entreprise, Gouvernance, Juridique, Financier et RH
              </p>
              ${footerNote ? `<p style="font-size: 12px; color: #9CA3AF; margin: 0; text-align: center;">${footerNote}</p>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()
}

/** Paragraphe standard. */
export function emailParagraph(html: string): string {
    return `<p style="font-size: 15px; color: #374151; margin: 0 0 16px; line-height: 1.6;">${html}</p>`
}

/** Bouton d'action (rendu en table pour survivre à Outlook). */
export function emailButton(href: string, label: string): string {
    return `
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding: 16px 0;">
      <a href="${href}" style="display: inline-block; background-color: ${ACCENT}; color: #FFFFFF; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-size: 15px; font-weight: 500; letter-spacing: -0.01em;">${label}</a>
    </td>
  </tr>
</table>`.trim()
}

/**
 * Encadré d'informations en paires libellé / valeur.
 * Les lignes dont la valeur est vide sont ignorées, ce qui évite d'afficher
 * des champs optionnels non renseignés.
 */
export function emailInfoTable(rows: Array<[string, string | null | undefined]>): string {
    const visibles = rows.filter(([, valeur]) => valeur != null && String(valeur).trim() !== "")
    if (visibles.length === 0) return ""

    const lignes = visibles
        .map(
            ([libelle, valeur]) => `
      <tr>
        <td style="padding: 8px 0;">
          <strong style="font-size: 13px; color: ${MUTED}; text-transform: uppercase; letter-spacing: 0.5px;">${libelle} :</strong>
          <p style="font-size: 15px; color: ${DARK}; margin: 4px 0 0; font-weight: 500;">${valeur}</p>
        </td>
      </tr>`
        )
        .join("")

    return `
<div style="background-color: ${BG}; border: 1px solid ${BORDER}; border-radius: 4px; padding: 24px; margin: 0 0 24px;">
  <table width="100%" cellpadding="0" cellspacing="0">${lignes}
  </table>
</div>`.trim()
}

/** Encadré d'alerte (instructions de paiement, rappel...). */
export function emailCallout(html: string, ton: "info" | "succes" | "attention" = "info"): string {
    const couleurs = {
        info: { bg: "#EFF6FF", border: "#BFDBFE", texte: "#1E40AF" },
        succes: { bg: "#F0FDF4", border: "#BBF7D0", texte: "#166534" },
        attention: { bg: "#FFFBEB", border: "#FDE68A", texte: "#92400E" },
    }[ton]

    return `
<div style="background-color: ${couleurs.bg}; border: 1px solid ${couleurs.border}; border-radius: 4px; padding: 16px; margin: 24px 0 0;">
  <p style="font-size: 13px; color: ${couleurs.texte}; margin: 0; line-height: 1.5;">${html}</p>
</div>`.trim()
}

export const EMAIL_COLORS = { ACCENT, DARK, BORDER, MUTED, BG } as const
