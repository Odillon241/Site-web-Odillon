/**
 * Génération de CSV.
 *
 * Existe parce que l'export de `NewsletterTab` concatène les valeurs avec des
 * virgules sans échappement : la première société nommée « Odillon, SARL »
 * décale toutes les colonnes de la ligne. Les inscriptions comportent de la
 * saisie libre (société, fonction, notes, réponses aux champs personnalisés),
 * le problème y serait immédiat.
 */

/**
 * Échappe une valeur selon la RFC 4180 : les guillemets sont doublés, et le
 * champ est encadré s'il contient un séparateur, un guillemet ou un saut de
 * ligne.
 *
 * Le préfixe par une apostrophe des valeurs commençant par =, +, - ou @ évite
 * l'injection de formules : Excel interprète `=1+1` comme un calcul, et
 * `=HYPERLINK(...)` comme un lien — un vecteur d'attaque réel quand le contenu
 * vient d'un formulaire public.
 */
export function csvEscape(valeur: unknown, separateur: string = ","): string {
    if (valeur == null) return ""

    let texte = String(valeur)

    if (/^[=+\-@\t\r]/.test(texte)) {
        texte = "'" + texte
    }

    const doitEtreEncadre =
        texte.includes(separateur) || texte.includes('"') || texte.includes("\n") || texte.includes("\r")

    if (doitEtreEncadre) {
        return `"${texte.replace(/"/g, '""')}"`
    }

    return texte
}

export interface CsvOptions {
    /** Séparateur. Excel en configuration française attend souvent `;`. */
    separateur?: string
    /** Ajoute le BOM UTF-8 (sinon Excel affiche « Ã© » au lieu de « é »). */
    bom?: boolean
}

/**
 * Construit un CSV à partir d'en-têtes et de lignes.
 * Les lignes sont des objets ; l'ordre des colonnes suit celui des en-têtes.
 */
export function toCsv(
    entetes: string[],
    lignes: Array<Record<string, unknown>>,
    options: CsvOptions = {}
): string {
    const { separateur = ",", bom = true } = options

    const contenu = [
        entetes.map((e) => csvEscape(e, separateur)).join(separateur),
        ...lignes.map((ligne) => entetes.map((e) => csvEscape(ligne[e], separateur)).join(separateur)),
    ].join("\r\n") // CRLF : requis par la RFC 4180, et attendu par Excel

    return bom ? "﻿" + contenu : contenu
}

/** Déclenche le téléchargement d'un CSV côté navigateur. */
export function telechargerCsv(nomFichier: string, contenu: string): void {
    const blob = new Blob([contenu], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const lien = document.createElement("a")
    lien.href = url
    lien.download = nomFichier
    document.body.appendChild(lien)
    lien.click()
    document.body.removeChild(lien)
    // Sans révocation, le blob reste en mémoire jusqu'au rechargement de la page.
    URL.revokeObjectURL(url)
}
