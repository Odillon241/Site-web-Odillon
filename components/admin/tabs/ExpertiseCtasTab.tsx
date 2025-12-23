"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, Settings as SettingsIcon, Image as ImageIcon, Sparkles, Save } from "lucide-react"
import { SiteSettings } from "@/types/admin"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ExpertiseCtasTab() {
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
    const [loadingSettings, setLoadingSettings] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [saving, setSaving] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        expertise_cta_title: "",
        expertise_cta_description: "",
        expertise_cta_button_text: "",
        expertise_cta_button_link: "",
        expertise_cta_badge_text: ""
    })

    useEffect(() => {
        loadSiteSettings()
    }, [])

    useEffect(() => {
        if (siteSettings) {
            setFormData({
                expertise_cta_title: siteSettings.expertise_cta_title || "Découvrez notre expertise approfondie et nos méthodologies éprouvées",
                expertise_cta_description: siteSettings.expertise_cta_description || "",
                expertise_cta_button_text: siteSettings.expertise_cta_button_text || "En savoir plus sur notre expertise",
                expertise_cta_button_link: siteSettings.expertise_cta_button_link || "/expertise",
                expertise_cta_badge_text: siteSettings.expertise_cta_badge_text || "Expertise"
            })
        }
    }, [siteSettings])

    const loadSiteSettings = async () => {
        try {
            setLoadingSettings(true)
            const response = await fetch('/api/settings')
            if (!response.ok) throw new Error('Erreur chargement paramètres')
            const data = await response.json()
            setSiteSettings(data.settings)
        } catch (error: unknown) {
            console.error('Erreur chargement paramètres:', error)
            toast.error("Impossible de charger les paramètres")
        } finally {
            setLoadingSettings(false)
        }
    }

    const handleUpdateImage = async (file: File) => {
        try {
            setUploadingImage(true)

            // 1. Upload du fichier
            const formDataUpload = new FormData()
            formDataUpload.append("file", file)

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formDataUpload
            })

            if (!uploadRes.ok) throw new Error("Erreur lors de l'upload de l'image")

            const { url } = await uploadRes.json()

            // 2. Mise à jour du paramètre
            const updateRes = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    services_cta_image_url: url // We are reusing this field for now as per discussions, or should we use a specific one? 
                    // Wait, the plan says 'expertise_cta' management. The existing code had 'services_cta_image_url' mapped to "Section CTA Services".
                    // Let's use 'services_cta_image_url' for this section as originally intended or check if we need a new image field?
                    // The plan didn't specify a NEW image field, but the 'site_settings' table already has 'services_cta_image_url'.
                    // Let's use 'services_cta_image_url' for the Expertise CTA background as it seems to be the one.
                    // Actually, let's verify which image url is used in `page.tsx` for the component.
                    // In `page.tsx`, `CtaBanner` is used.
                    // In `cta-banner.tsx`, it fetches `/api/settings` and uses `services_cta_image_url`.
                    // So yes, we should update `services_cta_image_url`.
                })
            })

            if (!updateRes.ok) throw new Error("Erreur lors de la mise à jour des paramètres")

            setSiteSettings(prev => prev ? ({ ...prev, services_cta_image_url: url }) : null)
            toast.success("Image d'arrière-plan mise à jour !")

            const input = document.getElementById('cta-image-input') as HTMLInputElement
            if (input) input.value = ''

        } catch (error: unknown) {
            console.error("Erreur lors de la mise à jour:", error)
            toast.error("Erreur lors de la mise à jour de l'image")
        } finally {
            setUploadingImage(false)
        }
    }

    const handleSaveContent = async () => {
        try {
            setSaving(true)
            const updateRes = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (!updateRes.ok) throw new Error("Erreur lors de la sauvegarde")

            setSiteSettings(prev => prev ? ({ ...prev, ...formData }) : null)
            toast.success("Contenu mis à jour avec succès !")
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors de la sauvegarde du contenu")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Sparkles className="w-5 h-5 text-odillon-teal" />
                    Bannière d'Expertise (CTA)
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8 bg-gray-50/30 min-h-[400px]">
                {loadingSettings ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8 items-start">

                        {/* LEFT COLUMN: TEXT FIELDS */}
                        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                <SettingsIcon className="w-4 h-4 text-gray-500" />
                                Contenu Textuel
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Titre Principal</Label>
                                    <Textarea
                                        value={formData.expertise_cta_title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, expertise_cta_title: e.target.value }))}
                                        className="font-bold text-lg min-h-[80px]"
                                        placeholder="Titre de la section..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Description (Optionnel)</Label>
                                    <Textarea
                                        value={formData.expertise_cta_description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, expertise_cta_description: e.target.value }))}
                                        className="min-h-[100px]"
                                        placeholder="Une courte description pour inciter au clic..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Texte du Badge</Label>
                                        <Input
                                            value={formData.expertise_cta_badge_text}
                                            onChange={(e) => setFormData(prev => ({ ...prev, expertise_cta_badge_text: e.target.value }))}
                                            placeholder="Ex: Expertise"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Texte du Bouton</Label>
                                        <Input
                                            value={formData.expertise_cta_button_text}
                                            onChange={(e) => setFormData(prev => ({ ...prev, expertise_cta_button_text: e.target.value }))}
                                            placeholder="Ex: En savoir plus"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Lien du Bouton</Label>
                                    <Input
                                        value={formData.expertise_cta_button_link}
                                        onChange={(e) => setFormData(prev => ({ ...prev, expertise_cta_button_link: e.target.value }))}
                                        placeholder="Ex: /expertise"
                                    />
                                </div>

                                <Button
                                    onClick={handleSaveContent}
                                    disabled={saving}
                                    className="w-full bg-odillon-teal hover:bg-odillon-teal/90 mt-4"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sauvegarde...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Sauvegarder le contenu
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: IMAGE & PREVIEW */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-gray-500" />
                                    Image d'Arrière-plan
                                </h3>

                                <div className="relative aspect-[21/9] w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                    {siteSettings?.services_cta_image_url ? (
                                        <>
                                            <img
                                                src={siteSettings.services_cta_image_url}
                                                alt="Background CTA"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-sm font-medium">Aperçu de l'image</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-xs">Image par défaut (Unsplash)</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        id="cta-image-input"
                                        className="bg-gray-50"
                                    />
                                    <Button
                                        onClick={() => {
                                            const input = document.getElementById('cta-image-input') as HTMLInputElement;
                                            if (input.files && input.files[0]) {
                                                handleUpdateImage(input.files[0]);
                                            } else {
                                                toast.error("Veuillez sélectionner une image.");
                                            }
                                        }}
                                        disabled={uploadingImage}
                                        className="bg-gray-900 hover:bg-black text-white"
                                    >
                                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Format recommandé : 1920x800px ou plus large. L'image sera assombrie pour garantir la lisibilité du texte.
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </CardContent>
        </Card>
    )
}
