/**
 * Types partagés du domaine formations / inscriptions.
 *
 * Volontairement hors de `types/admin.ts` : ces types sont consommés aussi bien
 * par l'admin que par les pages publiques (calendrier, formulaire d'inscription).
 */

// ---------------------------------------------------------------------------
// Champs personnalisés
// ---------------------------------------------------------------------------

export type ChampType = "texte" | "texte_long" | "liste" | "case"

export interface ChampPersonnalise {
    id: string
    label: string
    type: ChampType
    obligatoire: boolean
    /** Uniquement pour `type === "liste"`. */
    options?: string[]
}

/**
 * Réponse à un champ personnalisé. Le label et le type sont recopiés au moment
 * de la soumission : les exports et l'affichage des inscriptions passées ne
 * doivent pas changer si l'admin renomme le champ par la suite.
 */
export interface ReponseChamp {
    label: string
    type: ChampType
    valeur: string | boolean
}

export type ReponsesChamps = Record<string, ReponseChamp>

// ---------------------------------------------------------------------------
// Formation
// ---------------------------------------------------------------------------

export type Modalite = "presentiel" | "distanciel" | "hybride"

export interface Formation {
    id: string
    titre: string
    description: string
    date_debut: string
    date_fin?: string | null
    horaires?: string | null
    duree?: string | null
    formateur?: string | null
    lieu?: string | null
    modalite?: string | null
    is_active: boolean
    /** NULL = tarif sur demande, 0 = gratuit. */
    prix?: number | null
    devise?: string | null
    /** NULL = places illimitées. */
    places_totales?: number | null
    /** Maintenu exclusivement par le trigger en base. Jamais modifiable via l'API. */
    places_reservees?: number
    inscriptions_ouvertes?: boolean
    champs_personnalises?: ChampPersonnalise[]
    /** NULL = pas de rappel automatique. */
    rappel_jours_avant?: number | null
    /** NULL = pas d'envoi automatique du questionnaire de satisfaction. */
    satisfaction_jours_apres?: number | null
    instructions_paiement?: string | null
    created_at?: string
}

export const MODALITE_OPTIONS: { value: Modalite; label: string }[] = [
    { value: "presentiel", label: "Présentiel" },
    { value: "distanciel", label: "Distanciel" },
    { value: "hybride", label: "Hybride" },
]

export const MODALITE_LABELS: Record<string, string> = {
    presentiel: "Présentiel",
    distanciel: "Distanciel",
    hybride: "Hybride",
}

// ---------------------------------------------------------------------------
// Inscription
// ---------------------------------------------------------------------------

export type InscriptionStatut = "en_attente" | "confirmee" | "annulee" | "liste_attente"
export type PaiementStatut = "en_attente" | "paye" | "partiel" | "rembourse" | "gratuit"
export type ModePaiement = "virement" | "especes" | "mobile_money" | "cheque" | "autre"

export interface FormationInscription {
    id: string
    formation_id: string
    nom: string
    email: string
    telephone?: string | null
    societe?: string | null
    fonction?: string | null
    reponses: ReponsesChamps
    statut: InscriptionStatut
    paiement_statut: PaiementStatut
    mode_paiement?: ModePaiement | null
    /** Snapshot du prix au moment de l'inscription : le tarif peut évoluer ensuite. */
    montant_du?: number | null
    montant_regle: number
    devise?: string | null
    reference_paiement?: string | null
    notes_admin?: string | null
    confirmation_email_envoyee_at?: string | null
    validation_email_envoyee_at?: string | null
    rappel_email_envoye_at?: string | null
    created_at: string
    updated_at: string
}

/** Inscription jointe à sa formation (retour des routes admin). */
export interface InscriptionAvecFormation extends FormationInscription {
    formation?: Pick<Formation, "id" | "titre" | "date_debut" | "lieu" | "modalite"> | null
}

export const STATUT_LABELS: Record<InscriptionStatut, string> = {
    en_attente: "En attente",
    confirmee: "Confirmée",
    annulee: "Annulée",
    liste_attente: "Liste d'attente",
}

export const STATUT_OPTIONS: { value: InscriptionStatut; label: string }[] = [
    { value: "en_attente", label: "En attente" },
    { value: "confirmee", label: "Confirmée" },
    { value: "liste_attente", label: "Liste d'attente" },
    { value: "annulee", label: "Annulée" },
]

export const PAIEMENT_STATUT_LABELS: Record<PaiementStatut, string> = {
    en_attente: "En attente",
    paye: "Payé",
    partiel: "Partiel",
    rembourse: "Remboursé",
    gratuit: "Gratuit",
}

export const PAIEMENT_STATUT_OPTIONS: { value: PaiementStatut; label: string }[] = [
    { value: "en_attente", label: "En attente" },
    { value: "paye", label: "Payé" },
    { value: "partiel", label: "Partiel" },
    { value: "rembourse", label: "Remboursé" },
    { value: "gratuit", label: "Gratuit" },
]

export const MODE_PAIEMENT_LABELS: Record<ModePaiement, string> = {
    virement: "Virement bancaire",
    especes: "Espèces",
    mobile_money: "Mobile Money",
    cheque: "Chèque",
    autre: "Autre",
}

export const MODE_PAIEMENT_OPTIONS: { value: ModePaiement; label: string }[] = [
    { value: "virement", label: "Virement bancaire" },
    { value: "especes", label: "Espèces" },
    { value: "mobile_money", label: "Mobile Money" },
    { value: "cheque", label: "Chèque" },
    { value: "autre", label: "Autre" },
]

// ---------------------------------------------------------------------------
// Disponibilité (route publique)
// ---------------------------------------------------------------------------

export interface Disponibilite {
    places_totales: number | null
    places_restantes: number | null
    inscriptions_ouvertes: boolean
    complet: boolean
    prix: number | null
    devise: string | null
}

/** Codes d'erreur métier renvoyés par la route publique d'inscription. */
export type InscriptionErrorCode =
    | "COMPLET"
    | "DEJA_INSCRIT"
    | "INSCRIPTIONS_FERMEES"
    | "SESSION_PASSEE"

/** Référence courte affichée à l'inscrit et reprise dans les e-mails. */
export function referenceInscription(id: string): string {
    return id.substring(0, 8).toUpperCase()
}

/** Places restantes, ou `null` si la formation n'a pas de capacité définie. */
export function placesRestantes(f: Pick<Formation, "places_totales" | "places_reservees">): number | null {
    if (f.places_totales == null) return null
    return Math.max(0, f.places_totales - (f.places_reservees ?? 0))
}

/** Une formation est complète dès qu'elle a une capacité et qu'elle est atteinte. */
export function estComplet(f: Pick<Formation, "places_totales" | "places_reservees">): boolean {
    const restantes = placesRestantes(f)
    return restantes !== null && restantes <= 0
}

export interface FormatMontantOptions {
    /**
     * Sens de la valeur zéro.
     *
     * - `"gratuit"` (défaut) pour un TARIF : une session à 0 est gratuite.
     * - `"montant"` pour une SOMME ENCAISSÉE : 0 veut dire « rien réglé », et
     *   surtout pas « gratuit » — afficher « Réglé : Gratuit » sur un impayé
     *   ferait croire à l'admin que la personne est exemptée.
     */
    zero?: "gratuit" | "montant"
}

/** Formate un montant en devise locale (XAF par défaut, sans décimales). */
export function formatMontant(
    montant: number | null | undefined,
    devise: string | null = "XAF",
    options: FormatMontantOptions = {}
): string {
    if (montant == null) return "Sur demande"
    if (montant === 0 && (options.zero ?? "gratuit") === "gratuit") return "Gratuit"
    const code = devise || "XAF"
    // Le franc CFA n'a pas de subdivision en usage courant.
    const decimales = code === "XAF" || code === "XOF" ? 0 : 2
    return `${montant.toLocaleString("fr-FR", {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales,
    })} ${code}`
}

// ---------------------------------------------------------------------------
// Satisfaction
// ---------------------------------------------------------------------------

export interface FormationSatisfaction {
    id: string
    formation_id: string
    inscription_id?: string | null
    /** Note globale, 1 à 5. Seule note obligatoire. */
    note_globale: number
    note_contenu?: number | null
    note_formateur?: number | null
    note_organisation?: number | null
    note_objectifs?: number | null
    /** Recommandation NPS, 0 à 10. */
    recommandation?: number | null
    points_forts?: string | null
    axes_amelioration?: string | null
    commentaire?: string | null
    /** Snapshot de l'inscrit au moment de la réponse. */
    nom?: string | null
    email?: string | null
    created_at: string
}

/** Réponse jointe à sa formation (retour des routes admin). */
export interface SatisfactionAvecFormation extends FormationSatisfaction {
    formation?: Pick<Formation, "id" | "titre" | "date_debut"> | null
}

/** Critères détaillés notés de 1 à 5, en complément de la note globale. */
export const CRITERES_SATISFACTION = [
    { key: "note_contenu", label: "Contenu de la formation" },
    { key: "note_formateur", label: "Qualité de l'intervenant" },
    { key: "note_organisation", label: "Organisation & logistique" },
    { key: "note_objectifs", label: "Atteinte des objectifs" },
] as const

export type CritereSatisfactionKey = (typeof CRITERES_SATISFACTION)[number]["key"]

/** Note maximale d'une note en étoiles. */
export const NOTE_MAX = 5
/** Borne haute de l'échelle de recommandation (NPS). */
export const NPS_MAX = 10

export type NpsCategorie = "promoteur" | "passif" | "detracteur"

/** Catégorie NPS d'un score 0–10 (détracteur 0–6, passif 7–8, promoteur 9–10). */
export function npsCategorie(score: number): NpsCategorie {
    if (score >= 9) return "promoteur"
    if (score >= 7) return "passif"
    return "detracteur"
}

/**
 * Score NPS d'un ensemble de recommandations : % promoteurs − % détracteurs,
 * arrondi. `null` si aucune recommandation exploitable (échelle vide).
 */
export function calculerNps(scores: Array<number | null | undefined>): number | null {
    const valides = scores.filter((s): s is number => typeof s === "number")
    if (valides.length === 0) return null
    let promoteurs = 0
    let detracteurs = 0
    for (const s of valides) {
        const cat = npsCategorie(s)
        if (cat === "promoteur") promoteurs++
        else if (cat === "detracteur") detracteurs++
    }
    return Math.round(((promoteurs - detracteurs) / valides.length) * 100)
}

/** Moyenne d'une série de notes, en ignorant les valeurs absentes. */
export function moyenneNotes(notes: Array<number | null | undefined>): number | null {
    const valides = notes.filter((n): n is number => typeof n === "number")
    if (valides.length === 0) return null
    return valides.reduce((total, n) => total + n, 0) / valides.length
}
