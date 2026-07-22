"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Trash2, Save, Award, Shield, Lightbulb, Heart, Target, Sparkles, Gem, Flame, HeartHandshake } from "lucide-react"
import { toast } from "sonner"
import { AdminPanel, AdminEmptyState } from "@/components/admin/ui/admin-panel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ValueItem {
    title: string
    value: string
    description: string
    icon: string
    color: string
}

const AVAILABLE_ICONS = [
    { value: "Gem", label: "Gem (Talent)", icon: Gem },
    { value: "Flame", label: "Flame (Challenge)", icon: Flame },
    { value: "HeartHandshake", label: "HeartHandshake (Proximité)", icon: HeartHandshake },
    { value: "Award", label: "Award (Récompense)", icon: Award },
    { value: "Shield", label: "Shield (Sécurité)", icon: Shield },
    { value: "Lightbulb", label: "Lightbulb (Innovation)", icon: Lightbulb },
    { value: "Heart", label: "Heart (Passion)", icon: Heart },
    { value: "Target", label: "Target (Cible)", icon: Target },
    { value: "Sparkles", label: "Sparkles (Magie)", icon: Sparkles },
]

const DEFAULT_COLORS = [
    { value: "#00a795", label: "Odillon Teal" },
    { value: "#C4D82E", label: "Odillon Lime" },
    { value: "#0A1F2C", label: "Odillon Dark" },
]

export function AboutTab() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Mission Fields
    const [missionTitle, setMissionTitle] = useState("")
    const [missionDescription, setMissionDescription] = useState("")

    // Values Fields
    const [values, setValues] = useState<ValueItem[]>([])

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/settings')
            if (!response.ok) throw new Error('Erreur chargement')

            const data = await response.json()
            const s = data.settings || {}

            setMissionTitle(s.about_mission_title || "Notre Mission")
            setMissionDescription(s.about_mission_description || "")
            setValues(s.about_values_json || [])

        } catch (error) {
            console.error(error)
            toast.error("Erreur", {
                description: "Impossible de charger les paramètres",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const response = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    about_mission_title: missionTitle,
                    about_mission_description: missionDescription,
                    about_values_json: values
                })
            })

            if (!response.ok) throw new Error('Erreur sauvegarde')

            toast.success("Succès", {
                description: "Contenu de la page À Propos mis à jour",
            })
        } catch (error) {
            console.error(error)
            toast.error("Erreur", {
                description: "Impossible de sauvegarder",
            })
        } finally {
            setSaving(false)
        }
    }

    const addValue = () => {
        setValues([...values, {
            title: "Nouvelle Valeur",
            value: "Slogan court",
            description: "Description de la valeur...",
            icon: "Award",
            color: "#00a795"
        }])
    }

    const removeValue = (index: number) => {
        const newValues = [...values]
        newValues.splice(index, 1)
        setValues(newValues)
    }

    const updateValue = (index: number, field: keyof ValueItem, val: string) => {
        const newValues = [...values]
        newValues[index] = { ...newValues[index], [field]: val }
        setValues(newValues)
    }

    return (
        <AdminPanel
            icon={Target}
            title="Page À Propos"
            description="Modifiez les textes de la mission et les valeurs de l'entreprise."
            contentClassName="min-h-[400px] space-y-6"
            actions={
                <Button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="bg-odillon-teal text-white shadow-sm hover:bg-odillon-teal/90"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Enregistrer
                </Button>
            }
        >
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
                </div>
            ) : (
                <>
                    {/* MISSION SECTION */}
                    <div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                <Target className="h-5 w-5 text-odillon-teal" />
                                Notre Mission
                            </h3>
                            <p className="text-sm text-slate-600">Définissez le texte principal de la section mission.</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700">Titre de la Mission</Label>
                            <Input
                                value={missionTitle}
                                onChange={(e) => setMissionTitle(e.target.value)}
                                placeholder="Ex: Notre Mission"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700">Description de la Mission</Label>
                            <Textarea
                                value={missionDescription}
                                onChange={(e) => setMissionDescription(e.target.value)}
                                placeholder="Ex: Fondée sur la conviction..."
                                className="min-h-[120px]"
                            />
                        </div>
                    </div>

                    {/* VALUES SECTION */}
                    <div className="space-y-6 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                    <Sparkles className="h-5 w-5 text-odillon-teal" />
                                    Nos Valeurs
                                </h3>
                                <p className="text-sm text-slate-600">Gérez les cartes de valeurs affichées.</p>
                            </div>
                            <Button
                                onClick={addValue}
                                variant="outline"
                                size="sm"
                                className="border-slate-200 text-slate-700 hover:border-odillon-teal/30 hover:text-odillon-teal"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter une valeur
                            </Button>
                        </div>

                        {values.map((item, index) => (
                            <div key={index} className="group relative flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 md:flex-row">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2 text-slate-400 transition-opacity hover:text-red-500 md:opacity-0 md:group-hover:opacity-100"
                                    onClick={() => removeValue(index)}
                                    aria-label="Supprimer la valeur"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>

                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-slate-700">Titre</Label>
                                            <Input
                                                value={item.title}
                                                onChange={(e) => updateValue(index, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700">Sous-titre (Valeur)</Label>
                                            <Input
                                                value={item.value}
                                                onChange={(e) => updateValue(index, 'value', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Description</Label>
                                        <Textarea
                                            value={item.description}
                                            onChange={(e) => updateValue(index, 'description', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-slate-700">Icône Lucide</Label>
                                            <Select
                                                value={item.icon}
                                                onValueChange={(val) => updateValue(index, 'icon', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choisir une icône" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {AVAILABLE_ICONS.map(icon => (
                                                        <SelectItem key={icon.value} value={icon.value}>
                                                            <div className="flex items-center gap-2">
                                                                <icon.icon className="w-4 h-4" />
                                                                {icon.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700">Couleur</Label>
                                            <div className="flex gap-2">
                                                {DEFAULT_COLORS.map(color => (
                                                    <button
                                                        key={color.value}
                                                        type="button"
                                                        className={`h-8 w-8 rounded-full border-2 transition-transform ${item.color === color.value ? 'scale-110 border-slate-900' : 'border-transparent hover:scale-105'}`}
                                                        style={{ backgroundColor: color.value }}
                                                        onClick={() => updateValue(index, 'color', color.value)}
                                                        title={color.label}
                                                        aria-label={color.label}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {values.length === 0 && (
                            <AdminEmptyState
                                icon={Sparkles}
                                title="Aucune valeur définie"
                                hint={'Cliquez sur "Ajouter une valeur" pour commencer.'}
                            />
                        )}
                    </div>
                </>
            )}
        </AdminPanel>
    )
}
