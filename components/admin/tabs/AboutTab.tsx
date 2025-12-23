"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Trash2, Save, RefreshCw, Award, Shield, Lightbulb, Heart, Target, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ValueItem {
    title: string
    value: string
    description: string
    icon: string
    color: string
}

const AVAILABLE_ICONS = [
    { value: "Award", label: "Award (Récompense)", icon: Award },
    { value: "Shield", label: "Shield (Sécurité)", icon: Shield },
    { value: "Lightbulb", label: "Lightbulb (Innovation)", icon: Lightbulb },
    { value: "Heart", label: "Heart (Passion)", icon: Heart },
    { value: "Target", label: "Target (Cible)", icon: Target },
    { value: "Sparkles", label: "Sparkles (Magie)", icon: Sparkles },
]

const DEFAULT_COLORS = [
    { value: "#39837a", label: "Odillon Teal" },
    { value: "#C4D82E", label: "Odillon Lime" },
    { value: "#0A1F2C", label: "Odillon Dark" },
]

export function AboutTab() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    // const { toast } = useToast() - removed

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
            color: "#39837a"
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

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestion de la Page À Propos</h2>
                    <p className="text-gray-500">Modifiez les textes de la mission et les valeurs de l'entreprise.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-odillon-teal hover:bg-odillon-teal/90">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Enregistrer
                </Button>
            </div>

            {/* MISSION SECTION */}
            <Card>
                <CardHeader>
                    <CardTitle>Notre Mission</CardTitle>
                    <CardDescription>Définissez le texte principal de la section mission.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Titre de la Mission</Label>
                        <Input
                            value={missionTitle}
                            onChange={(e) => setMissionTitle(e.target.value)}
                            placeholder="Ex: Notre Mission"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description de la Mission</Label>
                        <Textarea
                            value={missionDescription}
                            onChange={(e) => setMissionDescription(e.target.value)}
                            placeholder="Ex: Fondée sur la conviction..."
                            className="min-h-[120px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* VALUES SECTION */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Nos Valeurs</CardTitle>
                        <CardDescription>Gérez les cartes de valeurs affichées.</CardDescription>
                    </div>
                    <Button onClick={addValue} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une valeur
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {values.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-xl bg-gray-50/50 relative group">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                onClick={() => removeValue(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>

                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Titre</Label>
                                        <Input
                                            value={item.title}
                                            onChange={(e) => updateValue(index, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sous-titre (Valeur)</Label>
                                        <Input
                                            value={item.value}
                                            onChange={(e) => updateValue(index, 'value', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={item.description}
                                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Icône Lucide</Label>
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
                                        <Label>Couleur</Label>
                                        <div className="flex gap-2">
                                            {DEFAULT_COLORS.map(color => (
                                                <div
                                                    key={color.value}
                                                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${item.color === color.value ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                                                    style={{ backgroundColor: color.value }}
                                                    onClick={() => updateValue(index, 'color', color.value)}
                                                    title={color.label}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {values.length === 0 && (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
                            Aucune valeur définie. Cliquez sur "Ajouter une valeur" pour commencer.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
