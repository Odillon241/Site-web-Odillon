"use client"

import { useState } from "react"
import Link from "next/link"
// `m` et non `motion` : l'application est enveloppée dans un LazyMotion
// (voir lib/motion-features.ts), qui rejette les composants `motion` au runtime.
import { m } from "framer-motion"
import { typoFr } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    CalendarDays,
    Clock,
    MapPin,
    User,
    Wallet,
    Users,
    GraduationCap,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react"
import {
    type Formation,
    type ChampPersonnalise,
    MODALITE_LABELS,
    MODE_PAIEMENT_OPTIONS,
    formatMontant,
    placesRestantes,
    estComplet,
    referenceInscription,
} from "@/types/formation"

interface Succes {
    id: string
    montant_du: number | null
    devise: string | null
}

const emptyForm = {
    nom: "",
    email: "",
    telephone: "",
    societe: "",
    fonction: "",
    mode_paiement: "",
}

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

/** Période en toutes lettres, sans répéter le mois ni l'année quand ils sont
    communs aux deux bornes : « du 14 au 15 septembre 2026 ». */
function periodeEnPhrase(f: Formation) {
    if (!f.date_fin || f.date_fin === f.date_debut) return `le ${formatDate(f.date_debut)}`

    const debut = new Date(f.date_debut + "T00:00:00")
    const fin = new Date(f.date_fin + "T00:00:00")
    const memeAnnee = debut.getFullYear() === fin.getFullYear()
    const memeMois = memeAnnee && debut.getMonth() === fin.getMonth()

    const bornDebut = memeMois
        ? debut.toLocaleDateString("fr-FR", { day: "numeric" })
        : debut.toLocaleDateString("fr-FR", memeAnnee
            ? { day: "numeric", month: "long" }
            : { day: "numeric", month: "long", year: "numeric" })

    return `du ${bornDebut} au ${formatDate(f.date_fin)}`
}

/** Récapitulatif de la session, affiché en permanence à côté du formulaire. */
function RecapSession({ formation }: { formation: Formation }) {
    const restantes = placesRestantes(formation)

    return (
        <div className="od-surface p-5 md:p-6 lg:sticky lg:top-28">
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

            <h2 className="text-xl font-semibold text-odillon-dark mb-2 text-balance">{typoFr(formation.titre)}</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-5 text-pretty">{formation.description}</p>

            <div className="space-y-2.5 text-sm text-gray-600 border-t border-gray-100 pt-4">
                {(formation.horaires || formation.duree) && (
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-odillon-teal shrink-0" />
                        {[formation.horaires, formation.duree].filter(Boolean).join(" · ")}
                    </div>
                )}
                {formation.lieu && (
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-odillon-teal shrink-0" />
                        {formation.lieu}
                    </div>
                )}
                {formation.formateur && (
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-odillon-teal shrink-0" />
                        {formation.formateur}
                    </div>
                )}
                <div className="flex items-center gap-2 font-medium text-odillon-dark">
                    <Wallet className="w-4 h-4 text-odillon-teal shrink-0" />
                    {formatMontant(formation.prix, formation.devise)}
                </div>
                {restantes !== null && (
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-odillon-teal shrink-0" />
                        <span className="tabular-nums">
                            {restantes > 0
                                ? `${restantes} place${restantes > 1 ? "s" : ""} restante${restantes > 1 ? "s" : ""} sur ${formation.places_totales}`
                                : "Session complète"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

/** Rendu d'un champ personnalisé selon son type. */
function ChampDynamique({
    champ,
    valeur,
    onChange,
}: {
    champ: ChampPersonnalise
    valeur: string | boolean | undefined
    onChange: (v: string | boolean) => void
}) {
    if (champ.type === "case") {
        return (
            <div className="flex items-start gap-3">
                <Checkbox
                    id={champ.id}
                    checked={valeur === true}
                    onCheckedChange={(c) => onChange(c === true)}
                    className="mt-0.5"
                />
                <label htmlFor={champ.id} className="text-sm text-gray-700 leading-snug cursor-pointer">
                    {champ.label}
                    {champ.obligatoire && <span className="text-red-500 ml-1">*</span>}
                </label>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <label htmlFor={champ.id} className="text-sm font-medium text-gray-700">
                {champ.label}
                {champ.obligatoire && <span className="text-red-500 ml-1">*</span>}
            </label>

            {champ.type === "texte_long" ? (
                <Textarea
                    id={champ.id}
                    value={(valeur as string) || ""}
                    onChange={(e) => onChange(e.target.value)}
                    rows={3}
                />
            ) : champ.type === "liste" ? (
                <Select value={(valeur as string) || ""} onValueChange={onChange}>
                    <SelectTrigger id={champ.id}>
                        <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                        {(champ.options || []).map((opt) => (
                            <SelectItem key={opt} value={opt}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <Input id={champ.id} value={(valeur as string) || ""} onChange={(e) => onChange(e.target.value)} />
            )}
        </div>
    )
}

export function FormationInscriptionForm({ formation }: { formation: Formation }) {
    const [form, setForm] = useState({ ...emptyForm })
    const [reponses, setReponses] = useState<Record<string, string | boolean>>({})
    const [envoi, setEnvoi] = useState(false)
    const [erreur, setErreur] = useState<string | null>(null)
    const [succes, setSucces] = useState<Succes | null>(null)
    const [ferme, setFerme] = useState(false)

    const champs = formation.champs_personnalises || []
    const complet = estComplet(formation)
    const ouvert = (formation.inscriptions_ouvertes ?? true) && !complet && !ferme
    const restantes = placesRestantes(formation)

    // Les faits de la session en une phrase : le récapitulatif latéral porte
    // déjà le détail tabulé, le hero n'a pas à le répéter en ligne d'icônes.
    const phraseSession = [
        `Session ${periodeEnPhrase(formation)}${formation.lieu ? `, à ${formation.lieu}` : ""}.`,
        complet
            ? "Toutes les places ont été réservées."
            : restantes !== null && restantes > 0
                ? `Il reste ${restantes} place${restantes > 1 ? "s" : ""}.`
                : null,
        ouvert ? "Remplissez le formulaire ci-dessous pour réserver la vôtre." : null,
    ]
        .filter(Boolean)
        .join(" ")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErreur(null)

        if (!form.nom.trim() || !form.email.trim()) {
            setErreur("Votre nom et votre adresse e-mail sont obligatoires.")
            return
        }

        setEnvoi(true)
        try {
            const res = await fetch(`/api/formations/${formation.id}/inscriptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    telephone: form.telephone || null,
                    societe: form.societe || null,
                    fonction: form.fonction || null,
                    mode_paiement: form.mode_paiement || null,
                    reponses,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                // Une session devenue complète pendant la saisie doit fermer le
                // formulaire, pas seulement afficher un message.
                if (data.code === "COMPLET" || data.code === "INSCRIPTIONS_FERMEES" || data.code === "SESSION_PASSEE") {
                    setFerme(true)
                }
                setErreur(data.error || "L'inscription n'a pas pu être enregistrée.")
                return
            }

            setSucces({
                id: data.inscription.id,
                montant_du: data.inscription.montant_du,
                devise: data.inscription.devise,
            })
        } catch {
            setErreur("Une erreur réseau est survenue. Vérifiez votre connexion et réessayez.")
        } finally {
            setEnvoi(false)
        }
    }

    // --- Succès : on remplace le formulaire plutôt que de rediriger, pour
    // éviter toute resoumission et conserver le récapitulatif à l'écran.
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

                        <h1 className="od-heading-display text-3xl mb-3 text-balance">Votre inscription est enregistrée</h1>

                        <p className="text-gray-600 mb-6 text-pretty">
                            Un e-mail de confirmation vient d'être envoyé à <strong>{form.email}</strong>. Votre
                            inscription sera définitivement confirmée après validation par notre équipe.
                        </p>

                        <div className="od-surface-muted rounded-xl p-5 text-left space-y-3 mb-6">
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-gray-500">Référence</span>
                                <span className="font-semibold text-odillon-dark tabular-nums">
                                    {referenceInscription(succes.id)}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-gray-500">Formation</span>
                                <span className="font-medium text-odillon-dark text-right">{formation.titre}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-gray-500">Dates</span>
                                <span className="font-medium text-odillon-dark text-right">{formatPeriode(formation)}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-sm border-t border-gray-100 pt-3">
                                <span className="text-gray-500">Montant</span>
                                <span className="font-semibold text-odillon-dark tabular-nums">
                                    {formatMontant(succes.montant_du, succes.devise)}
                                </span>
                            </div>
                        </div>

                        {formation.instructions_paiement && succes.montant_du !== 0 && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-left mb-6">
                                <p className="text-sm text-amber-900 whitespace-pre-wrap text-pretty">
                                    {formation.instructions_paiement}
                                </p>
                            </div>
                        )}

                        <Button asChild variant="outline" className="gap-2 active:scale-[0.96] transition-transform">
                            <Link href="/calendrier-formations">
                                <ArrowLeft className="w-4 h-4" />
                                Retour au calendrier
                            </Link>
                        </Button>
                    </m.div>
                </div>
            </section>
        )
    }

    return (
        <>
            {/* ===== HERO =====
                Le titre nomme la session : sur une page d'inscription, savoir à
                quoi l'on s'inscrit prime sur le nom de l'action elle-même. */}
            <header className="relative overflow-hidden">
                <div aria-hidden="true" className="od-hero-grid absolute inset-0" />

                <div className="relative od-container py-10 md:py-14 lg:py-16">
                    <div className="od-rise max-w-3xl">
                        <Link
                            href="/calendrier-formations"
                            className="od-eyebrow inline-flex transition-colors hover:text-odillon-teal/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odillon-teal"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Calendrier des formations
                        </Link>
                        <h1 className="font-air not-italic mt-4 text-3xl md:text-4xl font-semibold leading-[1.15] tracking-[-0.01em] text-odillon-dark text-balance">
                            {typoFr(formation.titre)}
                        </h1>
                        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-[#4A5C64] text-pretty">
                            {phraseSession}
                        </p>
                    </div>
                </div>
            </header>

            <section className="od-section py-12 md:py-16">
                <div className="od-container">
                    <div className="grid lg:grid-cols-[1fr_minmax(0,380px)] gap-8 lg:gap-12 items-start">
                        <m.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="order-2 lg:order-1"
                        >
                            {!ouvert ? (
                                <div className="od-surface-muted text-center py-16 px-6 border-dashed">
                                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h2 className="text-lg font-semibold text-odillon-dark mb-2">
                                        {complet || ferme ? "Session complète" : "Inscriptions fermées"}
                                    </h2>
                                    <p className="text-gray-500 mb-6 text-pretty max-w-md mx-auto">
                                        {complet || ferme
                                            ? "Toutes les places de cette session ont été réservées. Contactez-nous pour être informé de la prochaine date."
                                            : "Les inscriptions à cette session ne sont pas ouvertes pour le moment."}
                                    </p>
                                    <Button asChild className="bg-odillon-teal hover:bg-odillon-teal/90 text-white active:scale-[0.96] transition-transform">
                                        <Link href={`/contact?formation=${encodeURIComponent(formation.titre)}`}>
                                            Nous contacter
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="od-surface p-6 md:p-8 space-y-6">
                                    <div className="space-y-5">
                                        <h2 className="text-lg font-semibold text-odillon-dark">Vos coordonnées</h2>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="nom" className="text-sm font-medium text-gray-700">
                                                    Nom complet <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    id="nom"
                                                    value={form.nom}
                                                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                                                    required
                                                    autoComplete="name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                    Adresse e-mail <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    required
                                                    autoComplete="email"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="telephone" className="text-sm font-medium text-gray-700">
                                                    Téléphone
                                                </label>
                                                <Input
                                                    id="telephone"
                                                    type="tel"
                                                    value={form.telephone}
                                                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                                                    autoComplete="tel"
                                                    placeholder="+241 ..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="societe" className="text-sm font-medium text-gray-700">
                                                    Société
                                                </label>
                                                <Input
                                                    id="societe"
                                                    value={form.societe}
                                                    onChange={(e) => setForm({ ...form, societe: e.target.value })}
                                                    autoComplete="organization"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="fonction" className="text-sm font-medium text-gray-700">
                                                Fonction
                                            </label>
                                            <Input
                                                id="fonction"
                                                value={form.fonction}
                                                onChange={(e) => setForm({ ...form, fonction: e.target.value })}
                                                autoComplete="organization-title"
                                            />
                                        </div>
                                    </div>

                                    {champs.length > 0 && (
                                        <div className="space-y-5 border-t border-gray-100 pt-6">
                                            <h2 className="text-lg font-semibold text-odillon-dark">
                                                Informations complémentaires
                                            </h2>
                                            {champs.map((champ) => (
                                                <ChampDynamique
                                                    key={champ.id}
                                                    champ={champ}
                                                    valeur={reponses[champ.id]}
                                                    onChange={(v) => setReponses({ ...reponses, [champ.id]: v })}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {formation.prix !== 0 && (
                                        <div className="space-y-5 border-t border-gray-100 pt-6">
                                            <h2 className="text-lg font-semibold text-odillon-dark">Règlement</h2>
                                            <div className="space-y-2">
                                                <label htmlFor="mode_paiement" className="text-sm font-medium text-gray-700">
                                                    Mode de règlement souhaité
                                                </label>
                                                <Select
                                                    value={form.mode_paiement}
                                                    onValueChange={(v) => setForm({ ...form, mode_paiement: v })}
                                                >
                                                    <SelectTrigger id="mode_paiement">
                                                        <SelectValue placeholder="Sélectionner" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {MODE_PAIEMENT_OPTIONS.map((m) => (
                                                            <SelectItem key={m.value} value={m.value}>
                                                                {m.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs text-gray-500">
                                                    Le règlement s'effectue hors ligne. Les instructions vous seront
                                                    transmises par e-mail.
                                                </p>
                                            </div>
                                        </div>
                                    )}

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
                                            "Confirmer mon inscription"
                                        )}
                                    </Button>

                                    <p className="text-xs text-gray-500 text-center text-pretty">
                                        Vos données sont utilisées uniquement pour la gestion de votre inscription et ne sont
                                        jamais transmises à des tiers.
                                    </p>
                                </form>
                            )}
                        </m.div>

                        <m.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="order-1 lg:order-2"
                        >
                            <RecapSession formation={formation} />
                        </m.div>
                    </div>
                </div>
            </section>
        </>
    )
}
