import { z } from "zod"
import { NOTE_MAX, NPS_MAX } from "@/types/formation"

// ---------------------------------------------------------------------------
// Limites
// ---------------------------------------------------------------------------

export const SATISFACTION_LIMITS = {
    commentaire: { max: 2000 },
} as const

// ---------------------------------------------------------------------------
// Payload soumis par le participant
// ---------------------------------------------------------------------------
//
// Les notes arrivent en nombre ; on les valide bornées et entières. Les
// commentaires sont de la saisie libre : on ne les passe PAS dans un détecteur
// d'injection SQL (les points-virgules et apostrophes y sont légitimes) — les
// requêtes sont paramétrées, et l'échappement se fait au rendu (e-mails/HTML).

const noteEtoile = z
    .number({ message: "Note invalide" })
    .int("La note doit être un entier")
    .min(1, "La note doit être comprise entre 1 et " + NOTE_MAX)
    .max(NOTE_MAX, "La note doit être comprise entre 1 et " + NOTE_MAX)

const noteEtoileOptionnelle = noteEtoile.nullable().optional()

const commentaireOptionnel = z
    .string()
    .max(SATISFACTION_LIMITS.commentaire.max, `Un commentaire ne doit pas dépasser ${SATISFACTION_LIMITS.commentaire.max} caractères`)
    .nullable()
    .optional()

export const satisfactionPayloadSchema = z.object({
    token: z.string().uuid("Lien de satisfaction invalide"),
    note_globale: noteEtoile,
    note_contenu: noteEtoileOptionnelle,
    note_formateur: noteEtoileOptionnelle,
    note_organisation: noteEtoileOptionnelle,
    note_objectifs: noteEtoileOptionnelle,
    recommandation: z
        .number({ message: "Recommandation invalide" })
        .int("La recommandation doit être un entier")
        .min(0, `La recommandation doit être comprise entre 0 et ${NPS_MAX}`)
        .max(NPS_MAX, `La recommandation doit être comprise entre 0 et ${NPS_MAX}`)
        .nullable()
        .optional(),
    points_forts: commentaireOptionnel,
    axes_amelioration: commentaireOptionnel,
    commentaire: commentaireOptionnel,
})

export type SatisfactionPayload = z.infer<typeof satisfactionPayloadSchema>

export interface SatisfactionValide {
    note_globale: number
    note_contenu: number | null
    note_formateur: number | null
    note_organisation: number | null
    note_objectifs: number | null
    recommandation: number | null
    points_forts: string | null
    axes_amelioration: string | null
    commentaire: string | null
}

export interface ValidationSatisfactionResult {
    isValid: boolean
    errors: string[]
    token?: string
    data?: SatisfactionValide
}

/** Normalise un commentaire : trim, et vide -> null (pas de chaîne vide en base). */
function nettoyerCommentaire(valeur: string | null | undefined): string | null {
    if (valeur == null) return null
    const trimmed = valeur.trim()
    return trimmed.length === 0 ? null : trimmed
}

/**
 * Valide le payload de satisfaction. Renvoie le jeton et les données prêtes à
 * transmettre à la RPC `soumettre_satisfaction`.
 */
export function validerSatisfaction(payload: unknown): ValidationSatisfactionResult {
    const parsed = satisfactionPayloadSchema.safeParse(payload)

    if (!parsed.success) {
        return { isValid: false, errors: parsed.error.issues.map((i) => i.message) }
    }

    const p = parsed.data

    return {
        isValid: true,
        errors: [],
        token: p.token,
        data: {
            note_globale: p.note_globale,
            note_contenu: p.note_contenu ?? null,
            note_formateur: p.note_formateur ?? null,
            note_organisation: p.note_organisation ?? null,
            note_objectifs: p.note_objectifs ?? null,
            recommandation: p.recommandation ?? null,
            points_forts: nettoyerCommentaire(p.points_forts),
            axes_amelioration: nettoyerCommentaire(p.axes_amelioration),
            commentaire: nettoyerCommentaire(p.commentaire),
        },
    }
}
