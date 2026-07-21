import { z } from "zod"
import {
    validateEmail,
    validatePhone,
    validateTextField,
    sanitizeEmailHeader,
} from "@/lib/security"
import type {
    ChampPersonnalise,
    ReponsesChamps,
    ReponseChamp,
} from "@/types/formation"

// ---------------------------------------------------------------------------
// Limites
// ---------------------------------------------------------------------------

export const CHAMP_LIMITS = {
    label: { min: 1, max: 120 },
    option: { min: 1, max: 100 },
    maxOptions: 30,
    maxChamps: 20,
    reponseTexte: { max: 200 },
    reponseTexteLong: { max: 2000 },
} as const

// ---------------------------------------------------------------------------
// Définition des champs personnalisés (écrite par l'admin)
// ---------------------------------------------------------------------------

export const champPersonnaliseSchema = z
    .object({
        id: z.string().min(1, "Identifiant de champ manquant").max(64),
        label: z
            .string()
            .trim()
            .min(CHAMP_LIMITS.label.min, "Le libellé du champ est obligatoire")
            .max(CHAMP_LIMITS.label.max, `Le libellé ne doit pas dépasser ${CHAMP_LIMITS.label.max} caractères`),
        type: z.enum(["texte", "texte_long", "liste", "case"]),
        obligatoire: z.boolean(),
        options: z
            .array(z.string().trim().min(CHAMP_LIMITS.option.min).max(CHAMP_LIMITS.option.max))
            .max(CHAMP_LIMITS.maxOptions, `Un champ ne peut pas avoir plus de ${CHAMP_LIMITS.maxOptions} options`)
            .optional(),
    })
    .refine(
        (c) => c.type !== "liste" || (c.options != null && c.options.length > 0),
        { message: "Une liste déroulante doit avoir au moins une option", path: ["options"] }
    )
    .refine(
        (c) => c.type !== "liste" || new Set(c.options).size === c.options!.length,
        { message: "Les options d'une liste doivent être distinctes", path: ["options"] }
    )

export const champsPersonnalisesSchema = z
    .array(champPersonnaliseSchema)
    .max(CHAMP_LIMITS.maxChamps, `Pas plus de ${CHAMP_LIMITS.maxChamps} champs personnalisés par formation`)
    .refine((champs) => new Set(champs.map((c) => c.id)).size === champs.length, {
        message: "Deux champs personnalisés ne peuvent pas avoir le même identifiant",
    })

// ---------------------------------------------------------------------------
// Socle du formulaire d'inscription (soumis par le visiteur)
// ---------------------------------------------------------------------------

export const inscriptionPayloadSchema = z.object({
    nom: z.string(),
    email: z.string(),
    telephone: z.string().optional().nullable(),
    societe: z.string().optional().nullable(),
    fonction: z.string().optional().nullable(),
    mode_paiement: z.enum(["virement", "especes", "mobile_money", "cheque", "autre"]).optional().nullable(),
    reponses: z.record(z.string(), z.unknown()).optional().default({}),
})

export type InscriptionPayload = z.infer<typeof inscriptionPayloadSchema>

export interface SocleValide {
    nom: string
    email: string
    telephone: string | null
    societe: string | null
    fonction: string | null
}

export interface ValidationSocleResult {
    isValid: boolean
    errors: string[]
    data?: SocleValide
}

/**
 * Valide le socle fixe en réutilisant les validateurs de `lib/security.ts`.
 * `fonction` réutilise les limites de `company` (même ordre de grandeur).
 */
export function validerSocle(payload: {
    nom?: string
    email?: string
    telephone?: string | null
    societe?: string | null
    fonction?: string | null
}): ValidationSocleResult {
    const errors: string[] = []

    const nom = validateTextField(payload.nom || "", "name", true)
    const email = validateEmail(payload.email || "")
    const telephone = validatePhone(payload.telephone)
    const societe = validateTextField(payload.societe || "", "company", false)
    const fonction = validateTextField(payload.fonction || "", "company", false)

    if (!nom.isValid) errors.push(nom.error || "Nom invalide")
    if (!email.isValid) errors.push(email.error || "E-mail invalide")
    if (!telephone.isValid) errors.push(telephone.error || "Téléphone invalide")
    if (!societe.isValid) errors.push(societe.error || "Société invalide")
    if (!fonction.isValid) errors.push(fonction.error || "Fonction invalide")

    if (errors.length > 0) return { isValid: false, errors }

    return {
        isValid: true,
        errors: [],
        data: {
            nom: nom.sanitized,
            email: email.sanitized,
            telephone: telephone.sanitized || null,
            societe: societe.sanitized || null,
            fonction: fonction.sanitized || null,
        },
    }
}

// ---------------------------------------------------------------------------
// Réponses aux champs personnalisés
// ---------------------------------------------------------------------------

export interface ValidationReponsesResult {
    isValid: boolean
    errors: string[]
    data?: ReponsesChamps
}

/**
 * Valide les réponses soumises contre la définition des champs de la formation.
 *
 * Les champs inconnus sont ignorés silencieusement : seuls les champs définis
 * par l'admin sont conservés, ce qui empêche de gonfler la ligne avec des
 * données arbitraires.
 *
 * Le label et le type sont recopiés dans la réponse (snapshot) pour que
 * l'historique reste lisible même si l'admin renomme le champ ensuite.
 *
 * Note : on ne passe pas les réponses dans `containsSqlInjection` — le pattern
 * rejette les points-virgules, ce qui casserait des réponses légitimes. Les
 * requêtes sont paramétrées, et l'échappement se fait au rendu (e-mails/HTML).
 */
export function validerReponses(
    champs: ChampPersonnalise[] | null | undefined,
    reponses: Record<string, unknown> | null | undefined
): ValidationReponsesResult {
    const definitions = champs || []
    const brutes = reponses || {}
    const errors: string[] = []
    const data: ReponsesChamps = {}

    for (const champ of definitions) {
        const brute = brutes[champ.id]

        if (champ.type === "case") {
            const valeur = brute === true || brute === "true"
            if (champ.obligatoire && !valeur) {
                errors.push(`Vous devez cocher « ${champ.label} »`)
                continue
            }
            data[champ.id] = { label: champ.label, type: champ.type, valeur }
            continue
        }

        const valeur = typeof brute === "string" ? brute.trim() : brute == null ? "" : String(brute).trim()

        if (valeur.length === 0) {
            if (champ.obligatoire) errors.push(`Le champ « ${champ.label} » est obligatoire`)
            continue
        }

        if (champ.type === "liste") {
            if (!champ.options?.includes(valeur)) {
                errors.push(`La valeur choisie pour « ${champ.label} » n'est pas proposée`)
                continue
            }
        }

        const max =
            champ.type === "texte_long"
                ? CHAMP_LIMITS.reponseTexteLong.max
                : CHAMP_LIMITS.reponseTexte.max

        if (valeur.length > max) {
            errors.push(`Le champ « ${champ.label} » ne doit pas dépasser ${max} caractères`)
            continue
        }

        data[champ.id] = {
            label: champ.label,
            type: champ.type,
            // Neutralise les CRLF : ces valeurs sont réinjectées dans des e-mails.
            valeur: sanitizeEmailHeader(valeur),
        }
    }

    if (errors.length > 0) return { isValid: false, errors }
    return { isValid: true, errors: [], data }
}

/** Rend une réponse sous forme de texte lisible (e-mails, export CSV). */
export function formatReponse(reponse: ReponseChamp): string {
    if (reponse.type === "case") return reponse.valeur ? "Oui" : "Non"
    return String(reponse.valeur ?? "")
}
