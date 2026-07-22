"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"
import { AdminEmptyState } from "@/components/admin/ui/admin-panel"
import { Loader2, Trash2, Download, Star, SmilePlus, Mail, CalendarDays, ThumbsUp } from "lucide-react"
import { toast } from "sonner"
import { toCsv, telechargerCsv } from "@/lib/csv"
import {
    type SatisfactionAvecFormation,
    type Formation,
    type NpsCategorie,
    CRITERES_SATISFACTION,
    NOTE_MAX,
    npsCategorie,
    calculerNps,
    moyenneNotes,
} from "@/types/formation"

const NPS_STYLES: Record<NpsCategorie, string> = {
    promoteur: "bg-green-100 text-green-700 border-none",
    passif: "bg-amber-100 text-amber-700 border-none",
    detracteur: "bg-red-100 text-red-700 border-none",
}

const NPS_LABELS: Record<NpsCategorie, string> = {
    promoteur: "Promoteur",
    passif: "Passif",
    detracteur: "Détracteur",
}

function formatDate(iso?: string | null) {
    if (!iso) return ""
    return new Date(iso.includes("T") ? iso : iso + "T00:00:00").toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

function formatMoyenne(n: number | null): string {
    if (n == null) return "—"
    return n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

/** Affichage en lecture seule d'une note en étoiles. */
function AfficheEtoiles({ note, size = "w-4 h-4" }: { note: number | null | undefined; size?: string }) {
    if (note == null) return <span className="text-xs text-slate-400">Non noté</span>
    return (
        <span className="inline-flex items-center gap-0.5" aria-label={`${note} sur ${NOTE_MAX}`}>
            {Array.from({ length: NOTE_MAX }, (_, i) => (
                <Star
                    key={i}
                    className={cn(size, i < note ? "fill-amber-400 text-amber-400" : "text-slate-200")}
                />
            ))}
        </span>
    )
}

export function SatisfactionTab() {
    const [satisfactions, setSatisfactions] = useState<SatisfactionAvecFormation[]>([])
    const [formations, setFormations] = useState<Formation[]>([])
    const [loading, setLoading] = useState(false)
    const [filtreFormation, setFiltreFormation] = useState("all")

    useEffect(() => {
        loadFormations()
    }, [])

    useEffect(() => {
        loadSatisfactions()
    }, [filtreFormation])

    const loadFormations = async () => {
        try {
            const res = await fetch("/api/formations")
            if (!res.ok) throw new Error()
            const data = await res.json()
            setFormations(data.formations || [])
        } catch {
            console.error("Impossible de charger la liste des formations")
        }
    }

    const loadSatisfactions = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filtreFormation !== "all") params.set("formation_id", filtreFormation)

            const res = await fetch(`/api/satisfaction?${params}`)
            if (!res.ok) throw new Error("Erreur lors du chargement")
            const data = await res.json()
            setSatisfactions(data.satisfactions || [])
        } catch (error) {
            console.error("Erreur satisfactions:", error)
            toast.error("Impossible de charger les réponses")
        } finally {
            setLoading(false)
        }
    }

    const stats = useMemo(() => {
        const moyenneGlobale = moyenneNotes(satisfactions.map((s) => s.note_globale))
        const nps = calculerNps(satisfactions.map((s) => s.recommandation))
        return { total: satisfactions.length, moyenneGlobale, nps }
    }, [satisfactions])

    const supprimer = async (id: string) => {
        try {
            const res = await fetch(`/api/satisfaction/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error()
            toast.success("Réponse supprimée")
            loadSatisfactions()
        } catch {
            toast.error("Impossible de supprimer la réponse")
        }
    }

    const exporterCsv = () => {
        if (satisfactions.length === 0) {
            toast.error("Aucune réponse à exporter")
            return
        }

        const entetes = [
            "Formation", "Date session", "Nom", "E-mail", "Note globale",
            ...CRITERES_SATISFACTION.map((c) => c.label),
            "Recommandation (0-10)", "Catégorie NPS",
            "Points forts", "Axes d'amélioration", "Commentaire", "Répondu le",
        ]

        const lignes = satisfactions.map((s) => {
            const ligne: Record<string, unknown> = {
                Formation: s.formation?.titre || "",
                "Date session": formatDate(s.formation?.date_debut),
                Nom: s.nom || "",
                "E-mail": s.email || "",
                "Note globale": s.note_globale,
                "Recommandation (0-10)": s.recommandation ?? "",
                "Catégorie NPS": s.recommandation != null ? NPS_LABELS[npsCategorie(s.recommandation)] : "",
                "Points forts": s.points_forts || "",
                "Axes d'amélioration": s.axes_amelioration || "",
                Commentaire: s.commentaire || "",
                "Répondu le": formatDate(s.created_at),
            }
            for (const critere of CRITERES_SATISFACTION) {
                ligne[critere.label] = s[critere.key] ?? ""
            }
            return ligne
        })

        telechargerCsv(`satisfaction-${new Date().toISOString().split("T")[0]}.csv`, toCsv(entetes, lignes))
        toast.success(`${satisfactions.length} réponse${satisfactions.length > 1 ? "s" : ""} exportée${satisfactions.length > 1 ? "s" : ""}`)
    }

    return (
        <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-200/80 bg-white py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight text-slate-950">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
                                <SmilePlus className="h-4 w-4" />
                            </span>
                            Satisfaction
                        </CardTitle>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 tabular-nums">
                            {stats.total} réponse{stats.total > 1 ? "s" : ""}
                        </Badge>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exporterCsv}
                        className="gap-2 border-slate-200 text-slate-700 hover:border-odillon-teal/30 hover:text-odillon-teal"
                    >
                        <Download className="w-4 h-4" />
                        Exporter
                    </Button>
                </div>

                {/* Indicateurs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                            Note globale moyenne
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-semibold text-slate-950 tabular-nums">
                                {formatMoyenne(stats.moyenneGlobale)}
                            </span>
                            <span className="text-sm text-slate-400">/ {NOTE_MAX}</span>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <ThumbsUp className="w-3.5 h-3.5 text-odillon-teal" />
                            Score NPS
                        </div>
                        <div className="text-2xl font-semibold text-slate-950 tabular-nums">
                            {stats.nps == null ? "—" : stats.nps}
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                        <div className="text-xs text-slate-500 mb-1">Filtrer</div>
                        <Select value={filtreFormation} onValueChange={setFiltreFormation}>
                            <SelectTrigger className="bg-white h-9 border-slate-200">
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
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 bg-[#f7f9f8] min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
                    </div>
                ) : satisfactions.length === 0 ? (
                    <AdminEmptyState
                        icon={SmilePlus}
                        title="Aucune réponse de satisfaction"
                        hint="Les réponses aux questionnaires envoyés après vos formations apparaîtront ici."
                    />
                ) : (
                    <div className="space-y-3">
                        {satisfactions.map((s) => (
                            <Card key={s.id} className="border-slate-200/80 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <h3 className="font-bold text-slate-900 truncate">
                                                    {s.nom || "Réponse anonyme"}
                                                </h3>
                                                <AfficheEtoiles note={s.note_globale} />
                                                {s.recommandation != null && (
                                                    <Badge className={NPS_STYLES[npsCategorie(s.recommandation)] + " text-xs"}>
                                                        {NPS_LABELS[npsCategorie(s.recommandation)]} · {s.recommandation}/10
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-2">
                                                {s.email && (
                                                    <a href={`mailto:${s.email}`} className="flex items-center gap-1 hover:text-odillon-teal transition-colors">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        {s.email}
                                                    </a>
                                                )}
                                                {s.formation && (
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDays className="w-3.5 h-3.5 text-odillon-teal" />
                                                        <span className="font-medium">{s.formation.titre}</span>
                                                        <span className="text-slate-400">· {formatDate(s.formation.date_debut)}</span>
                                                    </span>
                                                )}
                                                <span className="text-slate-400">Répondu le {formatDate(s.created_at)}</span>
                                            </div>

                                            {/* Critères détaillés notés */}
                                            {CRITERES_SATISFACTION.some((c) => s[c.key] != null) && (
                                                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2 pt-2 border-t border-slate-100">
                                                    {CRITERES_SATISFACTION.map((c) =>
                                                        s[c.key] != null ? (
                                                            <span key={c.key} className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                {c.label}
                                                                <AfficheEtoiles note={s[c.key]} size="w-3.5 h-3.5" />
                                                            </span>
                                                        ) : null
                                                    )}
                                                </div>
                                            )}

                                            {/* Commentaires */}
                                            {(s.points_forts || s.axes_amelioration || s.commentaire) && (
                                                <div className="mt-3 space-y-2 text-sm">
                                                    {s.points_forts && (
                                                        <p className="text-slate-600">
                                                            <span className="font-medium text-green-700">Points forts : </span>
                                                            {s.points_forts}
                                                        </p>
                                                    )}
                                                    {s.axes_amelioration && (
                                                        <p className="text-slate-600">
                                                            <span className="font-medium text-amber-700">À améliorer : </span>
                                                            {s.axes_amelioration}
                                                        </p>
                                                    )}
                                                    {s.commentaire && (
                                                        <p className="text-slate-600 italic">{s.commentaire}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="shrink-0">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        aria-label="Supprimer la réponse"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Supprimer cette réponse ?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            La réponse de <strong>{s.nom || "ce participant"}</strong> sera
                                                            définitivement effacée. À réserver aux réponses de test ou aux spams.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => supprimer(s.id)}
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
        </Card>
    )
}
