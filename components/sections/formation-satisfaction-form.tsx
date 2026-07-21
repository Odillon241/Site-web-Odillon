"use client"

import { useState } from "react"
import Link from "next/link"
// `m` et non `motion` : l'application est enveloppée dans un LazyMotion.
import { m } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CalendarDays, Star, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import {
    type Formation,
    type CritereSatisfactionKey,
    CRITERES_SATISFACTION,
    NPS_MAX,
    MODALITE_LABELS,
} from "@/types/formation"

function formatDate(iso?: string | null) {
    if (!iso) return ""
    return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

function formatPeriode(f: Formation) {
    if (!f.date_fin || f.date_fin === f.date_debut) return formatDate(f.date_debut)
    return `${formatDate(f.date_debut)} → ${formatDate(f.date_fin)}`
}

/** Sélecteur de note en étoiles (1 à 5). Cliquer l'étoile courante réinitialise. */
function NoteEtoiles({
    value,
    onChange,
    size = "w-8 h-8",
    idPrefix,
}: {
    value: number
    onChange: (n: number) => void
    size?: string
    idPrefix: string
}) {
    const [hover, setHover] = useState(0)
    const actif = hover || value

    return (
        <div role="radiogroup" aria-label="Note sur 5" className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={`${idPrefix}-${n}`}
                    type="button"
                    onClick={() => onChange(n === value ? 0 : n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                    aria-pressed={value === n}
                    className="rounded-md p-0.5 transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-odillon-teal/50"
                >
                    <Star
                        className={cn(
                            size,
                            "transition-colors",
                            actif >= n ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        )}
                    />
                </button>
            ))}
        </div>
    )
}

/** Échelle de recommandation 0–10 (NPS). */
function EchelleNps({ value, onChange }: { value: number | null; onChange: (n: number | null) => void }) {
    return (
        <div>
            <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: NPS_MAX + 1 }, (_, n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onChange(n === value ? null : n)}
                        aria-label={`${n} sur ${NPS_MAX}`}
                        aria-pressed={value === n}
                        className={cn(
                            "h-9 w-9 rounded-lg text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-odillon-teal/50",
                            value === n
                                ? "bg-odillon-teal text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-odillon-teal/10 hover:text-odillon-teal"
                        )}
                    >
                        {n}
                    </button>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 px-0.5">
                <span>Pas du tout</span>
                <span>Absolument</span>
            </div>
        </div>
    )
}

export function FormationSatisfactionForm({ formation, token }: { formation: Formation; token: string }) {
    const [noteGlobale, setNoteGlobale] = useState(0)
    const [criteres, setCriteres] = useState<Partial<Record<CritereSatisfactionKey, number>>>({})
    const [nps, setNps] = useState<number | null>(null)
    const [pointsForts, setPointsForts] = useState("")
    const [axes, setAxes] = useState("")
    const [commentaire, setCommentaire] = useState("")

    const [envoi, setEnvoi] = useState(false)
    const [erreur, setErreur] = useState<string | null>(null)
    const [succes, setSucces] = useState(false)

    const setCritere = (key: CritereSatisfactionKey, n: number) =>
        setCriteres((c) => ({ ...c, [key]: n }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErreur(null)

        if (noteGlobale < 1) {
            setErreur("Merci d'attribuer une note globale à la formation.")
            return
        }

        setEnvoi(true)
        try {
            const res = await fetch(`/api/formations/${formation.id}/satisfaction`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    note_globale: noteGlobale,
                    note_contenu: criteres.note_contenu ?? null,
                    note_formateur: criteres.note_formateur ?? null,
                    note_organisation: criteres.note_organisation ?? null,
                    note_objectifs: criteres.note_objectifs ?? null,
                    recommandation: nps,
                    points_forts: pointsForts.trim() || null,
                    axes_amelioration: axes.trim() || null,
                    commentaire: commentaire.trim() || null,
                }),
            })

            const data = await res.json().catch(() => ({}))

            if (!res.ok) {
                // Déjà répondu : on bascule quand même sur l'écran de remerciement.
                if (data.code === "DEJA_REPONDU") {
                    setSucces(true)
                    return
                }
                setErreur(data.error || "Votre réponse n'a pas pu être enregistrée.")
                return
            }

            setSucces(true)
        } catch {
            setErreur("Une erreur réseau est survenue. Vérifiez votre connexion et réessayez.")
        } finally {
            setEnvoi(false)
        }
    }

    if (succes) {
        return (
            <section className="od-section py-16 md:py-24">
                <div className="od-container max-w-2xl">
                    <m.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="od-surface p-8 md:p-10 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="od-heading-display text-3xl mb-3 text-balance">Merci pour votre retour</h1>
                        <p className="text-gray-600 mb-6 text-pretty">
                            Votre avis a bien été enregistré. Il nous aide à améliorer la qualité de nos formations.
                        </p>
                        <Button asChild variant="outline" className="gap-2 active:scale-[0.96] transition-transform">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4" />
                                Retour à l'accueil
                            </Link>
                        </Button>
                    </m.div>
                </div>
            </section>
        )
    }

    return (
        <section className="od-section py-16 md:py-24">
            <div className="od-container max-w-2xl">
                <m.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge className="bg-odillon-teal/10 text-odillon-teal hover:bg-odillon-teal/20 border-none">
                            <CalendarDays className="w-3.5 h-3.5 mr-1" />
                            {formatPeriode(formation)}
                        </Badge>
                        {formation.modalite && (
                            <Badge variant="outline" className="border-odillon-lime/40 text-odillon-dark bg-odillon-lime/10">
                                {MODALITE_LABELS[formation.modalite] || formation.modalite}
                            </Badge>
                        )}
                    </div>
                    <h1 className="od-heading-display text-3xl md:text-4xl mb-3 text-balance">Votre avis compte</h1>
                    <p className="text-base text-gray-600 text-pretty">
                        Vous avez participé à <strong className="text-odillon-dark">{formation.titre}</strong>.
                        Aidez-nous à progresser en partageant votre ressenti — cela ne prend que deux minutes.
                    </p>
                </m.div>

                <m.form
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="od-surface p-6 md:p-8 space-y-8"
                >
                    {/* Note globale */}
                    <div className="space-y-3">
                        <div>
                            <h2 className="text-lg font-semibold text-odillon-dark">
                                Note globale <span className="text-red-500">*</span>
                            </h2>
                            <p className="text-sm text-gray-500">Votre satisfaction générale sur cette formation.</p>
                        </div>
                        <NoteEtoiles value={noteGlobale} onChange={setNoteGlobale} idPrefix="globale" size="w-9 h-9" />
                    </div>

                    {/* Critères détaillés */}
                    <div className="space-y-4 border-t border-gray-100 pt-6">
                        <div>
                            <h2 className="text-lg font-semibold text-odillon-dark">En détail</h2>
                            <p className="text-sm text-gray-500">Facultatif — notez ce qui vous a marqué.</p>
                        </div>
                        <div className="space-y-3">
                            {CRITERES_SATISFACTION.map((critere) => (
                                <div
                                    key={critere.key}
                                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50/60 px-4 py-3"
                                >
                                    <span className="text-sm font-medium text-gray-700">{critere.label}</span>
                                    <NoteEtoiles
                                        value={criteres[critere.key] ?? 0}
                                        onChange={(n) => setCritere(critere.key, n)}
                                        idPrefix={critere.key}
                                        size="w-6 h-6"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommandation (NPS) */}
                    <div className="space-y-3 border-t border-gray-100 pt-6">
                        <div>
                            <h2 className="text-lg font-semibold text-odillon-dark">Recommandation</h2>
                            <p className="text-sm text-gray-500">
                                Recommanderiez-vous cette formation à un collègue ou une relation ?
                            </p>
                        </div>
                        <EchelleNps value={nps} onChange={setNps} />
                    </div>

                    {/* Commentaires */}
                    <div className="space-y-5 border-t border-gray-100 pt-6">
                        <div className="space-y-2">
                            <label htmlFor="points_forts" className="text-sm font-medium text-gray-700">
                                Points forts
                            </label>
                            <Textarea
                                id="points_forts"
                                value={pointsForts}
                                onChange={(e) => setPointsForts(e.target.value)}
                                rows={3}
                                maxLength={2000}
                                placeholder="Ce que vous avez le plus apprécié..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="axes" className="text-sm font-medium text-gray-700">
                                Axes d'amélioration
                            </label>
                            <Textarea
                                id="axes"
                                value={axes}
                                onChange={(e) => setAxes(e.target.value)}
                                rows={3}
                                maxLength={2000}
                                placeholder="Ce qui pourrait être amélioré..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="commentaire" className="text-sm font-medium text-gray-700">
                                Commentaire libre
                            </label>
                            <Textarea
                                id="commentaire"
                                value={commentaire}
                                onChange={(e) => setCommentaire(e.target.value)}
                                rows={3}
                                maxLength={2000}
                                placeholder="Toute autre remarque..."
                            />
                        </div>
                    </div>

                    {erreur && (
                        <m.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                            role="alert"
                        >
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800 text-pretty">{erreur}</p>
                        </m.div>
                    )}

                    <Button
                        type="submit"
                        disabled={envoi}
                        className="w-full bg-odillon-teal hover:bg-odillon-teal/90 text-white h-11 gap-2 active:scale-[0.96] transition-transform"
                    >
                        {envoi ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            "Envoyer mon avis"
                        )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center text-pretty">
                        Vos réponses sont utilisées uniquement pour améliorer nos formations.
                    </p>
                </m.form>
            </div>
        </section>
    )
}
