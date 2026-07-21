"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Loader2,
    Trash2,
    Search,
    Download,
    ClipboardList,
    Mail,
    Pencil,
    Building2,
    Phone,
    CalendarDays,
} from "lucide-react"
import { toast } from "sonner"
import { toCsv, telechargerCsv } from "@/lib/csv"
import { formatReponse } from "@/lib/validations/formation"
import {
    type InscriptionAvecFormation,
    type Formation,
    type InscriptionStatut,
    type PaiementStatut,
    STATUT_LABELS,
    STATUT_OPTIONS,
    PAIEMENT_STATUT_LABELS,
    PAIEMENT_STATUT_OPTIONS,
    MODE_PAIEMENT_LABELS,
    MODE_PAIEMENT_OPTIONS,
    formatMontant,
    referenceInscription,
} from "@/types/formation"

const STATUT_STYLES: Record<InscriptionStatut, string> = {
    confirmee: "bg-green-100 text-green-700 hover:bg-green-200 border-none",
    en_attente: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-none",
    liste_attente: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-none",
    annulee: "bg-gray-100 text-gray-600 hover:bg-gray-200 border-none",
}

const PAIEMENT_STYLES: Record<PaiementStatut, string> = {
    paye: "bg-green-100 text-green-700 hover:bg-green-200 border-none",
    gratuit: "bg-teal-100 text-teal-700 hover:bg-teal-200 border-none",
    partiel: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-none",
    en_attente: "bg-gray-100 text-gray-600 hover:bg-gray-200 border-none",
    rembourse: "bg-purple-100 text-purple-700 hover:bg-purple-200 border-none",
}

function formatDate(iso?: string | null) {
    if (!iso) return ""
    return new Date(iso.includes("T") ? iso : iso + "T00:00:00").toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

function formatDateHeure(iso?: string | null) {
    if (!iso) return ""
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })
}

export function InscriptionsTab() {
    const [inscriptions, setInscriptions] = useState<InscriptionAvecFormation[]>([])
    const [formations, setFormations] = useState<Formation[]>([])
    const [loading, setLoading] = useState(false)
    const [recherche, setRecherche] = useState("")
    const [filtreFormation, setFiltreFormation] = useState("all")
    const [filtreStatut, setFiltreStatut] = useState("all")
    const [filtrePaiement, setFiltrePaiement] = useState("all")
    const [editing, setEditing] = useState<InscriptionAvecFormation | null>(null)
    const [formEdit, setFormEdit] = useState({
        paiement_statut: "en_attente",
        mode_paiement: "",
        montant_regle: "",
        reference_paiement: "",
        notes_admin: "",
    })
    const [envoiEmail, setEnvoiEmail] = useState<string | null>(null)

    useEffect(() => {
        loadFormations()
    }, [])

    useEffect(() => {
        loadInscriptions()
    }, [filtreFormation, filtreStatut, filtrePaiement])

    const loadFormations = async () => {
        try {
            const res = await fetch("/api/formations")
            if (!res.ok) throw new Error()
            const data = await res.json()
            setFormations(data.formations || [])
        } catch {
            // Non bloquant : le filtre par formation restera simplement vide.
            console.error("Impossible de charger la liste des formations")
        }
    }

    const loadInscriptions = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filtreFormation !== "all") params.set("formation_id", filtreFormation)
            if (filtreStatut !== "all") params.set("statut", filtreStatut)
            if (filtrePaiement !== "all") params.set("paiement_statut", filtrePaiement)

            const res = await fetch(`/api/inscriptions?${params}`)
            if (!res.ok) throw new Error("Erreur lors du chargement")
            const data = await res.json()
            setInscriptions(data.inscriptions || [])
        } catch (error) {
            console.error("Erreur inscriptions:", error)
            toast.error("Impossible de charger les inscriptions")
        } finally {
            setLoading(false)
        }
    }

    // Recherche côté client : la liste est déjà filtrée et plafonnée par l'API,
    // inutile d'aller-retour sur chaque frappe.
    const visibles = useMemo(() => {
        const terme = recherche.trim().toLowerCase()
        if (!terme) return inscriptions
        return inscriptions.filter(
            (i) =>
                i.nom.toLowerCase().includes(terme) ||
                i.email.toLowerCase().includes(terme) ||
                (i.societe || "").toLowerCase().includes(terme)
        )
    }, [inscriptions, recherche])

    const stats = useMemo(() => {
        const confirmees = inscriptions.filter((i) => i.statut === "confirmee").length
        const enAttente = inscriptions.filter((i) => i.statut === "en_attente").length
        const encaisse = inscriptions.reduce((total, i) => total + Number(i.montant_regle || 0), 0)
        return { confirmees, enAttente, encaisse }
    }, [inscriptions])

    const changerStatut = async (id: string, statut: InscriptionStatut) => {
        const avant = inscriptions
        // Mise à jour optimiste : le trigger en base ajuste le compteur de places.
        setInscriptions(inscriptions.map((i) => (i.id === id ? { ...i, statut } : i)))
        try {
            const res = await fetch(`/api/inscriptions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ statut }),
            })
            if (!res.ok) throw new Error()
            toast.success(`Inscription ${STATUT_LABELS[statut].toLowerCase()}`)
        } catch {
            setInscriptions(avant)
            toast.error("Impossible de modifier le statut")
        }
    }

    const ouvrirEdition = (i: InscriptionAvecFormation) => {
        setEditing(i)
        setFormEdit({
            paiement_statut: i.paiement_statut,
            mode_paiement: i.mode_paiement || "",
            montant_regle: String(i.montant_regle ?? 0),
            reference_paiement: i.reference_paiement || "",
            notes_admin: i.notes_admin || "",
        })
    }

    const enregistrerPaiement = async () => {
        if (!editing) return
        try {
            const res = await fetch(`/api/inscriptions/${editing.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    paiement_statut: formEdit.paiement_statut,
                    mode_paiement: formEdit.mode_paiement || null,
                    montant_regle: Number(formEdit.montant_regle || 0),
                    reference_paiement: formEdit.reference_paiement || null,
                    notes_admin: formEdit.notes_admin || null,
                }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error)
            }
            toast.success("Paiement mis à jour")
            setEditing(null)
            loadInscriptions()
        } catch (error) {
            toast.error(error instanceof Error && error.message ? error.message : "Erreur lors de l'enregistrement")
        }
    }

    const envoyerEmail = async (id: string, type: "confirmation" | "validation") => {
        try {
            setEnvoiEmail(id)
            const res = await fetch(`/api/inscriptions/${id}/renvoyer-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            toast.success(type === "validation" ? "E-mail de validation envoyé" : "E-mail de confirmation renvoyé")
            loadInscriptions()
        } catch (error) {
            toast.error(error instanceof Error && error.message ? error.message : "L'e-mail n'a pas pu être envoyé")
        } finally {
            setEnvoiEmail(null)
        }
    }

    const supprimer = async (id: string) => {
        try {
            const res = await fetch(`/api/inscriptions/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error()
            toast.success("Inscription supprimée")
            loadInscriptions()
        } catch {
            toast.error("Impossible de supprimer l'inscription")
        }
    }

    const exporterCsv = () => {
        if (visibles.length === 0) {
            toast.error("Aucune inscription à exporter")
            return
        }

        // Une colonne par champ personnalisé rencontré : l'union des libellés,
        // car deux sessions peuvent avoir des champs différents.
        const labelsCustom = Array.from(
            new Set(visibles.flatMap((i) => Object.values(i.reponses || {}).map((r) => r.label)))
        )

        const entetes = [
            "Référence", "Formation", "Date session", "Nom", "E-mail", "Téléphone",
            "Société", "Fonction", "Statut", "Paiement", "Mode", "Montant dû",
            "Montant réglé", "Devise", "Référence paiement", "Inscrit le", "Notes",
            ...labelsCustom,
        ]

        const lignes = visibles.map((i) => {
            const ligne: Record<string, unknown> = {
                "Référence": referenceInscription(i.id),
                Formation: i.formation?.titre || "",
                "Date session": formatDate(i.formation?.date_debut),
                Nom: i.nom,
                "E-mail": i.email,
                "Téléphone": i.telephone || "",
                "Société": i.societe || "",
                Fonction: i.fonction || "",
                Statut: STATUT_LABELS[i.statut],
                Paiement: PAIEMENT_STATUT_LABELS[i.paiement_statut],
                Mode: i.mode_paiement ? MODE_PAIEMENT_LABELS[i.mode_paiement] : "",
                "Montant dû": i.montant_du ?? "",
                "Montant réglé": i.montant_regle ?? 0,
                Devise: i.devise || "",
                "Référence paiement": i.reference_paiement || "",
                "Inscrit le": formatDate(i.created_at),
                Notes: i.notes_admin || "",
            }
            for (const label of labelsCustom) {
                const reponse = Object.values(i.reponses || {}).find((r) => r.label === label)
                ligne[label] = reponse ? formatReponse(reponse) : ""
            }
            return ligne
        })

        telechargerCsv(`inscriptions-${new Date().toISOString().split("T")[0]}.csv`, toCsv(entetes, lignes))
        toast.success(`${visibles.length} inscription${visibles.length > 1 ? "s" : ""} exportée${visibles.length > 1 ? "s" : ""}`)
    }

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-medium text-gray-700">Inscriptions</CardTitle>
                        <Badge variant="secondary" className="bg-white border shadow-sm text-xs font-normal tabular-nums">
                            {visibles.length}
                        </Badge>
                        {stats.enAttente > 0 && (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none text-xs tabular-nums">
                                {stats.enAttente} en attente
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 tabular-nums hidden md:inline">
                            Encaissé :{" "}
                            <strong className="text-gray-700">
                                {formatMontant(stats.encaisse, "XAF", { zero: "montant" })}
                            </strong>
                        </span>
                        <Button variant="outline" size="sm" onClick={exporterCsv} className="gap-2">
                            <Download className="w-4 h-4" />
                            Exporter
                        </Button>
                    </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mt-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            placeholder="Nom, e-mail, société..."
                            className="pl-9 bg-white"
                        />
                    </div>

                    <Select value={filtreFormation} onValueChange={setFiltreFormation}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Toutes les formations" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les formations</SelectItem>
                            {formations.map((f) => (
                                <SelectItem key={f.id} value={f.id}>
                                    {f.titre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            {STATUT_OPTIONS.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filtrePaiement} onValueChange={setFiltrePaiement}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Tous les paiements" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les paiements</SelectItem>
                            {PAIEMENT_STATUT_OPTIONS.map((p) => (
                                <SelectItem key={p.value} value={p.value}>
                                    {p.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="p-6 bg-gray-50/30 min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
                    </div>
                ) : visibles.length === 0 ? (
                    <div className="text-center py-12">
                        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">
                            {inscriptions.length === 0 ? "Aucune inscription pour le moment" : "Aucun résultat pour cette recherche"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {visibles.map((i) => (
                            <Card key={i.id} className="border-gray-100 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <h3 className="font-bold text-gray-900 truncate">{i.nom}</h3>
                                                <Badge className={STATUT_STYLES[i.statut] + " text-xs"}>
                                                    {STATUT_LABELS[i.statut]}
                                                </Badge>
                                                <Badge className={PAIEMENT_STYLES[i.paiement_statut] + " text-xs"}>
                                                    {PAIEMENT_STATUT_LABELS[i.paiement_statut]}
                                                </Badge>
                                                <span className="text-xs text-gray-400 tabular-nums">
                                                    {referenceInscription(i.id)}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                                                <a href={`mailto:${i.email}`} className="flex items-center gap-1 hover:text-odillon-teal transition-colors">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {i.email}
                                                </a>
                                                {i.telephone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        {i.telephone}
                                                    </span>
                                                )}
                                                {i.societe && (
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="w-3.5 h-3.5" />
                                                        {i.societe}
                                                        {i.fonction ? ` — ${i.fonction}` : ""}
                                                    </span>
                                                )}
                                            </div>

                                            {i.formation && (
                                                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                                                    <CalendarDays className="w-3.5 h-3.5 text-odillon-teal" />
                                                    <span className="font-medium">{i.formation.titre}</span>
                                                    <span className="text-gray-400">· {formatDate(i.formation.date_debut)}</span>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 tabular-nums">
                                                <span>
                                                    Dû : <strong className="text-gray-700">{formatMontant(i.montant_du, i.devise)}</strong>
                                                </span>
                                                <span>
                                                    Réglé :{" "}
                                                    <strong className="text-gray-700">
                                                        {formatMontant(Number(i.montant_regle || 0), i.devise, { zero: "montant" })}
                                                    </strong>
                                                </span>
                                                {i.mode_paiement && <span>{MODE_PAIEMENT_LABELS[i.mode_paiement]}</span>}
                                                <span>Inscrit le {formatDate(i.created_at)}</span>
                                            </div>

                                            {Object.keys(i.reponses || {}).length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                                    {Object.entries(i.reponses).map(([id, r]) => (
                                                        <span key={id}>
                                                            {r.label} : <strong className="text-gray-700">{formatReponse(r)}</strong>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {i.notes_admin && (
                                                <p className="mt-2 text-xs text-gray-500 italic">{i.notes_admin}</p>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                                            <Select value={i.statut} onValueChange={(v) => changerStatut(i.id, v as InscriptionStatut)}>
                                                <SelectTrigger className="h-9 w-[150px] text-xs bg-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {STATUT_OPTIONS.map((s) => (
                                                        <SelectItem key={s.value} value={s.value}>
                                                            {s.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => ouvrirEdition(i)}
                                                className="h-9 w-9 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                aria-label="Gérer le paiement"
                                                title="Gérer le paiement"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        disabled={envoiEmail === i.id}
                                                        className="h-9 gap-1.5 text-xs text-odillon-teal hover:text-odillon-teal/80 hover:bg-teal-50"
                                                        title={
                                                            i.validation_email_envoyee_at
                                                                ? `Déjà envoyé le ${formatDateHeure(i.validation_email_envoyee_at)}`
                                                                : "Envoyer l'e-mail de validation"
                                                        }
                                                    >
                                                        {envoiEmail === i.id ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Mail className="w-3.5 h-3.5" />
                                                        )}
                                                        {i.validation_email_envoyee_at ? "Renvoyer" : "Valider"}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Envoyer l'e-mail de validation ?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            <strong>{i.nom}</strong> ({i.email}) recevra la confirmation
                                                            définitive de sa participation.
                                                            {i.validation_email_envoyee_at && (
                                                                <>
                                                                    <br />
                                                                    <br />
                                                                    Un e-mail de validation lui a déjà été envoyé le{" "}
                                                                    {formatDateHeure(i.validation_email_envoyee_at)}.
                                                                </>
                                                            )}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => envoyerEmail(i.id, "validation")}
                                                            className="bg-odillon-teal hover:bg-odillon-teal/90"
                                                        >
                                                            Envoyer
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        aria-label="Supprimer l'inscription"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Supprimer cette inscription ?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            L'inscription de <strong>{i.nom}</strong> sera définitivement
                                                            effacée et la place libérée. Pour conserver une trace,
                                                            préférez le statut « Annulée ».
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => supprimer(i.id)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Supprimer
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Gestion du paiement */}
            <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Suivi du paiement</DialogTitle>
                        <DialogDescription>
                            {editing?.nom} — {editing?.formation?.titre}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 text-sm flex justify-between tabular-nums">
                            <span className="text-gray-500">Montant dû</span>
                            <strong>{formatMontant(editing?.montant_du, editing?.devise)}</strong>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Statut du paiement</label>
                            <Select
                                value={formEdit.paiement_statut}
                                onValueChange={(v) => setFormEdit({ ...formEdit, paiement_statut: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAIEMENT_STATUT_OPTIONS.map((p) => (
                                        <SelectItem key={p.value} value={p.value}>
                                            {p.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Montant réglé</label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={formEdit.montant_regle}
                                    onChange={(e) => setFormEdit({ ...formEdit, montant_regle: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mode</label>
                                <Select
                                    value={formEdit.mode_paiement || "none"}
                                    onValueChange={(v) => setFormEdit({ ...formEdit, mode_paiement: v === "none" ? "" : v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Non précisé" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Non précisé</SelectItem>
                                        {MODE_PAIEMENT_OPTIONS.map((m) => (
                                            <SelectItem key={m.value} value={m.value}>
                                                {m.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Référence du règlement</label>
                            <Input
                                value={formEdit.reference_paiement}
                                onChange={(e) => setFormEdit({ ...formEdit, reference_paiement: e.target.value })}
                                placeholder="N° de virement, reçu..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notes internes</label>
                            <Textarea
                                value={formEdit.notes_admin}
                                onChange={(e) => setFormEdit({ ...formEdit, notes_admin: e.target.value })}
                                placeholder="Visible uniquement par l'équipe"
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button onClick={enregistrerPaiement} className="bg-odillon-teal hover:bg-odillon-teal/90 text-white">
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
