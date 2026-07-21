"use client"

import { useState, useEffect } from "react"
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
    DialogTrigger,
    DialogClose
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
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Plus, Trash2, Eye, EyeOff, GraduationCap, Pencil, Clock, MapPin, User, Users, Wallet } from "lucide-react"
import { toast } from "sonner"
import { type Formation, type ChampPersonnalise, MODALITE_OPTIONS, MODALITE_LABELS, formatMontant, placesRestantes } from "@/types/formation"
import { ChampsPersonnalisesEditor } from "@/components/admin/formations/champs-personnalises-editor"

const emptyForm = {
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    horaires: "",
    duree: "",
    formateur: "",
    lieu: "",
    modalite: "",
    prix: "",
    devise: "XAF",
    places_totales: "",
    inscriptions_ouvertes: true,
    rappel_jours_avant: "3",
    satisfaction_jours_apres: "2",
    instructions_paiement: "",
}

function formatDate(iso?: string | null) {
    if (!iso) return ""
    return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", {
        day: "numeric", month: "short", year: "numeric"
    })
}

export function FormationsTab() {
    const [formations, setFormations] = useState<Formation[]>([])
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Formation | null>(null)
    const [form, setForm] = useState({ ...emptyForm })
    const [champs, setChamps] = useState<ChampPersonnalise[]>([])

    useEffect(() => {
        loadFormations()
    }, [])

    const loadFormations = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/formations')
            if (!res.ok) throw new Error("Erreur lors du chargement")
            const data = await res.json()
            setFormations(data.formations || [])
        } catch (error) {
            console.error("Erreur formations:", error)
            toast.error("Impossible de charger les formations")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setForm({ ...emptyForm })
        setChamps([])
        setEditing(null)
    }

    const handleEdit = (f: Formation) => {
        setEditing(f)
        setForm({
            titre: f.titre,
            description: f.description,
            date_debut: f.date_debut || "",
            date_fin: f.date_fin || "",
            horaires: f.horaires || "",
            duree: f.duree || "",
            formateur: f.formateur || "",
            lieu: f.lieu || "",
            modalite: f.modalite || "",
            prix: f.prix != null ? String(f.prix) : "",
            devise: f.devise || "XAF",
            places_totales: f.places_totales != null ? String(f.places_totales) : "",
            inscriptions_ouvertes: f.inscriptions_ouvertes ?? true,
            rappel_jours_avant: f.rappel_jours_avant != null ? String(f.rappel_jours_avant) : "",
            satisfaction_jours_apres: f.satisfaction_jours_apres != null ? String(f.satisfaction_jours_apres) : "",
            instructions_paiement: f.instructions_paiement || "",
        })
        setChamps(f.champs_personnalises || [])
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!form.titre.trim() || !form.description.trim() || !form.date_debut) {
            toast.error("Le titre, la description et la date de début sont obligatoires")
            return
        }

        const champsIncomplets = champs.filter(c => !c.label.trim())
        if (champsIncomplets.length > 0) {
            toast.error("Chaque champ personnalisé doit avoir un libellé")
            return
        }

        const listesSansOptions = champs.filter(c => c.type === "liste" && !(c.options || []).length)
        if (listesSansOptions.length > 0) {
            toast.error(`La liste « ${listesSansOptions[0].label} » doit avoir au moins une option`)
            return
        }

        try {
            const isEditing = !!editing
            const url = isEditing ? `/api/formations/${editing.id}` : '/api/formations'
            const method = isEditing ? 'PATCH' : 'POST'

            const body = {
                ...form,
                date_fin: form.date_fin || null,
                horaires: form.horaires || null,
                duree: form.duree || null,
                formateur: form.formateur || null,
                lieu: form.lieu || null,
                modalite: form.modalite || null,
                // Champ vide = « non renseigné », pas 0 : un prix nul signifie
                // « gratuit », alors qu'une absence de prix signifie « sur demande ».
                prix: form.prix === "" ? null : Number(form.prix),
                devise: form.devise || "XAF",
                places_totales: form.places_totales === "" ? null : Number(form.places_totales),
                rappel_jours_avant: form.rappel_jours_avant === "" ? null : Number(form.rappel_jours_avant),
                satisfaction_jours_apres: form.satisfaction_jours_apres === "" ? null : Number(form.satisfaction_jours_apres),
                instructions_paiement: form.instructions_paiement || null,
                champs_personnalises: champs,
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || "Erreur lors de l'enregistrement")
            }

            toast.success(isEditing ? "Formation modifiée" : "Formation ajoutée")
            resetForm()
            setIsDialogOpen(false)
            loadFormations()
        } catch (error) {
            console.error("Erreur save formation:", error)
            toast.error(error instanceof Error ? error.message : "Erreur lors de l'enregistrement")
        }
    }

    const toggleActive = async (id: string) => {
        try {
            const f = formations.find(x => x.id === id)
            if (!f) return
            const res = await fetch(`/api/formations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !f.is_active })
            })
            if (!res.ok) throw new Error("Erreur")
            setFormations(formations.map(x => x.id === id ? { ...x, is_active: !x.is_active } : x))
            toast.success(f.is_active ? "Formation masquée" : "Formation affichée")
        } catch (error) {
            console.error("Erreur maj formation:", error)
            toast.error("Impossible de modifier le statut")
        }
    }

    const deleteFormation = async (id: string) => {
        try {
            const res = await fetch(`/api/formations/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error("Erreur lors de la suppression")
            toast.success("Formation supprimée")
            loadFormations()
        } catch (error) {
            console.error("Erreur suppression:", error)
            toast.error("Impossible de supprimer la formation")
        }
    }

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-medium text-gray-700">Calendrier des formations</CardTitle>
                    <Badge variant="secondary" className="bg-white border shadow-sm text-xs font-normal">
                        {formations.length} formation{formations.length > 1 ? "s" : ""}
                    </Badge>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    if (!open) resetForm()
                    setIsDialogOpen(open)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-odillon-teal hover:bg-odillon-teal/90 text-white shadow-sm gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter une formation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Modifier la formation" : "Nouvelle formation"}</DialogTitle>
                            <DialogDescription>
                                {editing
                                    ? "Modifiez les informations de la session de formation."
                                    : "Ajoutez une session au calendrier des formations affiché sur le site."}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Titre *</label>
                                <Input
                                    value={form.titre}
                                    onChange={(e) => setForm({ ...form, titre: e.target.value })}
                                    placeholder="ex: Gouvernance d'entreprise"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description *</label>
                                <Textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Objectifs et contenu de la formation..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date de début *</label>
                                    <Input
                                        type="date"
                                        value={form.date_debut}
                                        onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date de fin</label>
                                    <Input
                                        type="date"
                                        value={form.date_fin}
                                        onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Horaires</label>
                                    <Input
                                        value={form.horaires}
                                        onChange={(e) => setForm({ ...form, horaires: e.target.value })}
                                        placeholder="ex: 9h00 – 17h00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Durée</label>
                                    <Input
                                        value={form.duree}
                                        onChange={(e) => setForm({ ...form, duree: e.target.value })}
                                        placeholder="ex: 2 jours"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Formateur / intervenant</label>
                                <Input
                                    value={form.formateur}
                                    onChange={(e) => setForm({ ...form, formateur: e.target.value })}
                                    placeholder="ex: Cabinet Odillon"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Lieu</label>
                                    <Input
                                        value={form.lieu}
                                        onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                                        placeholder="ex: Libreville"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Modalité</label>
                                    <Select
                                        value={form.modalite || "none"}
                                        onValueChange={(value) => setForm({ ...form, modalite: value === "none" ? "" : value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Non précisée</SelectItem>
                                            {MODALITE_OPTIONS.map((m) => (
                                                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* --- Inscriptions --- */}
                            <div className="border-t border-gray-100 pt-4 space-y-4">
                                <h4 className="text-sm font-semibold text-gray-700">Inscriptions</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Tarif</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="1000"
                                            value={form.prix}
                                            onChange={(e) => setForm({ ...form, prix: e.target.value })}
                                            placeholder="Sur demande"
                                        />
                                        <p className="text-xs text-gray-500">Vide = sur demande · 0 = gratuit</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Devise</label>
                                        <Input
                                            value={form.devise}
                                            onChange={(e) => setForm({ ...form, devise: e.target.value.toUpperCase() })}
                                            placeholder="XAF"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nombre de places</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={form.places_totales}
                                            onChange={(e) => setForm({ ...form, places_totales: e.target.value })}
                                            placeholder="Illimité"
                                        />
                                        <p className="text-xs text-gray-500">Vide = pas de limite</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Rappel (jours avant)</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="60"
                                            value={form.rappel_jours_avant}
                                            onChange={(e) => setForm({ ...form, rappel_jours_avant: e.target.value })}
                                            placeholder="Aucun"
                                        />
                                        <p className="text-xs text-gray-500">Vide = pas d'e-mail de rappel</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Satisfaction (jours après)</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="90"
                                            value={form.satisfaction_jours_apres}
                                            onChange={(e) => setForm({ ...form, satisfaction_jours_apres: e.target.value })}
                                            placeholder="Aucun"
                                        />
                                        <p className="text-xs text-gray-500">Questionnaire envoyé après la session · vide = désactivé</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="inscriptions_ouvertes"
                                        checked={form.inscriptions_ouvertes}
                                        onCheckedChange={(c) => setForm({ ...form, inscriptions_ouvertes: c === true })}
                                    />
                                    <label htmlFor="inscriptions_ouvertes" className="text-sm text-gray-700 cursor-pointer">
                                        Inscriptions ouvertes
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Instructions de paiement</label>
                                    <Textarea
                                        value={form.instructions_paiement}
                                        onChange={(e) => setForm({ ...form, instructions_paiement: e.target.value })}
                                        placeholder="Coordonnées bancaires, modalités de règlement... (repris dans l'e-mail de confirmation)"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* --- Champs personnalisés --- */}
                            <div className="border-t border-gray-100 pt-4">
                                <ChampsPersonnalisesEditor
                                    value={champs}
                                    onChange={setChamps}
                                    aDesInscrits={(editing?.places_reservees ?? 0) > 0}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button onClick={handleSave} className="bg-odillon-teal hover:bg-odillon-teal/90 text-white">
                                {editing ? "Enregistrer" : "Créer"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent className="p-6 bg-gray-50/30 min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
                    </div>
                ) : formations.length === 0 ? (
                    <div className="text-center py-12">
                        <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Aucune formation programmée</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {formations.map((f) => (
                            <Card key={f.id} className="border-gray-100 hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900 truncate">{f.titre}</h3>
                                            {f.is_active ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none text-xs">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-xs">Inactive</Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDate(f.date_debut)}
                                                {f.date_fin ? ` → ${formatDate(f.date_fin)}` : ""}
                                                {f.horaires ? ` · ${f.horaires}` : ""}
                                            </span>
                                            {f.lieu && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {f.lieu}{f.modalite ? ` (${MODALITE_LABELS[f.modalite] || f.modalite})` : ""}
                                                </span>
                                            )}
                                            {f.formateur && (
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3.5 h-3.5" />
                                                    {f.formateur}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Wallet className="w-3.5 h-3.5" />
                                                {formatMontant(f.prix, f.devise)}
                                            </span>
                                            <span className="flex items-center gap-1 tabular-nums">
                                                <Users className="w-3.5 h-3.5" />
                                                {f.places_totales != null
                                                    ? `${f.places_reservees ?? 0}/${f.places_totales} inscrits`
                                                    : `${f.places_reservees ?? 0} inscrit${(f.places_reservees ?? 0) > 1 ? "s" : ""}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        <Button size="sm" variant="ghost" onClick={() => handleEdit(f)}
                                            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => toggleActive(f.id)} className="h-8 text-xs">
                                            {f.is_active ? (<><EyeOff className="w-3 h-3 mr-1" /> Masquer</>) : (<><Eye className="w-3 h-3 mr-1" /> Afficher</>)}
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Supprimer cette formation ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        <strong>{f.titre}</strong> sera retirée définitivement du calendrier.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteFormation(f.id)} className="bg-red-600 hover:bg-red-700">
                                                        Supprimer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
