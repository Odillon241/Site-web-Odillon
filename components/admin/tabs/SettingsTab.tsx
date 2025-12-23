"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, Settings as SettingsIcon, Image as ImageIcon } from "lucide-react"
import { SiteSettings } from "@/types/admin"
import { toast } from "sonner"

export function SettingsTab() {
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
    const [loadingSettings, setLoadingSettings] = useState(false)
    const [uploadingExpertiseImage, setUploadingExpertiseImage] = useState(false)

    useEffect(() => {
        loadSiteSettings()
    }, [])

    const loadSiteSettings = async () => {
        try {
            setLoadingSettings(true)
            const response = await fetch('/api/settings')
            if (!response.ok) throw new Error('Erreur chargement paramètres')
            const data = await response.json()
            setSiteSettings(data)
        } catch (error: unknown) {
            console.error('Erreur chargement paramètres:', error)
            toast.error("Impossible de charger les paramètres")
        } finally {
            setLoadingSettings(false)
        }
    }

    const handleUpdateSettingImage = async (settingKey: 'services_cta_image_url' | 'expertise_image_url', file: File) => {
        try {
            if (settingKey === 'expertise_image_url') setUploadingExpertiseImage(true)
            // else setUploadingCtaImage(true) // For future use

            // 1. Upload du fichier
            const formData = new FormData()
            formData.append("file", file)

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData
            })

            if (!uploadRes.ok) throw new Error("Erreur lors de l'upload de l'image")

            const { url } = await uploadRes.json()

            // 2. Mise à jour du paramètre
            const updateRes = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    [settingKey]: url
                })
            })

            if (!updateRes.ok) throw new Error("Erreur lors de la mise à jour des paramètres")

            // 3. Mise à jour locale
            setSiteSettings(prev => prev ? ({
                ...prev,
                [settingKey]: url
            }) : null)

            toast.success("Image mise à jour avec succès !")

            // Reset input
            const inputId = settingKey === 'expertise_image_url' ? 'expertise-image-input' : 'services-cta-image-input'
            const input = document.getElementById(inputId) as HTMLInputElement
            if (input) input.value = ''

        } catch (error: unknown) {
            console.error("Erreur lors de la mise à jour:", error)
            toast.error("Erreur lors de la mise à jour")
        } finally {
            if (settingKey === 'expertise_image_url') setUploadingExpertiseImage(false)
            // else setUploadingCtaImage(false)
        }
    }

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                    <SettingsIcon className="w-5 h-5 text-gray-500" />
                    Paramètres du Site - Gestion des Images
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8 bg-gray-50/30 min-h-[400px]">
                {loadingSettings ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
                    </div>
                ) : (
                    <>
                        {/* Section Image À Propos */}
                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-odillon-teal" />
                                    Section À Propos (Accueil)
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Cette image apparaît dans la section "À Propos" de la page d'accueil, à côté du texte de présentation.
                                    <br />Format recommandé : Carré (ex: 800x800px) ou Portrait.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Changer l'image</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                id="expertise-image-input" // Unique ID
                                                className="bg-white cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => {
                                            const input = document.getElementById('expertise-image-input') as HTMLInputElement;
                                            if (input.files && input.files[0]) {
                                                handleUpdateSettingImage('expertise_image_url', input.files[0]);
                                            } else {
                                                toast.error("Veuillez sélectionner une image.");
                                            }
                                        }}
                                        disabled={uploadingExpertiseImage}
                                        className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white"
                                    >
                                        {uploadingExpertiseImage ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Mise à jour...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                Mettre à jour l'image
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Preview Image À Propos */}
                            <div className="relative aspect-square md:aspect-video lg:aspect-square w-full max-w-sm mx-auto bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                {siteSettings?.expertise_image_url ? (
                                    <div className="relative w-full h-full group">
                                        <img
                                            src={siteSettings.expertise_image_url}
                                            alt="Aperçu À Propos"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">Image Actuelle</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                        <span className="text-sm">Aucune image définie<br />(Image par défaut affichée sur le site)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 my-6"></div>

                        {/* Section Image CTA Services (Optionnel - Exemple) */}
                        <div className="grid md:grid-cols-2 gap-8 items-start opacity-75">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-gray-500" />
                                        Section CTA Services (Optionnel)
                                    </h3>
                                    <Badge variant="outline" className="text-xs">Bientôt</Badge>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Image d'arrière-plan ou d'illustration pour le bloc d'appel à l'action des services.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
