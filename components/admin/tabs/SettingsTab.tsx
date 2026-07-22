"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Upload, Settings as SettingsIcon, Image as ImageIcon, Trash2 } from "lucide-react"
import { AdminPanel } from "@/components/admin/ui/admin-panel"
import { SiteSettings } from "@/types/admin"
import { toast } from "sonner"

export function SettingsTab() {
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
    const [loadingSettings, setLoadingSettings] = useState(false)
    const [uploadingExpertiseImage, setUploadingExpertiseImage] = useState(false)
    const [uploadingServicesHeroImage, setUploadingServicesHeroImage] = useState(false)
    const [deletingServicesHeroImage, setDeletingServicesHeroImage] = useState(false)

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

    const handleUpdateSettingImage = async (settingKey: 'services_cta_image_url' | 'expertise_image_url' | 'services_hero_image_url', file: File) => {
        try {
            if (settingKey === 'expertise_image_url') setUploadingExpertiseImage(true)
            if (settingKey === 'services_hero_image_url') setUploadingServicesHeroImage(true)

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
            const inputId = settingKey === 'services_cta_image_url'
                ? 'services-cta-image-input'
                : settingKey === 'services_hero_image_url'
                    ? 'services-hero-image-input'
                    : 'expertise-image-input'

            const input = document.getElementById(inputId) as HTMLInputElement
            if (input) input.value = ''

        } catch (error: unknown) {
            console.error("Erreur lors de la mise à jour:", error)
            toast.error("Erreur lors de la mise à jour")
        } finally {
            if (settingKey === 'expertise_image_url') setUploadingExpertiseImage(false)
            if (settingKey === 'services_hero_image_url') setUploadingServicesHeroImage(false)
        }
    }

    const handleDeleteServicesHeroImage = async () => {
        try {
            setDeletingServicesHeroImage(true)

            const updateRes = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ services_hero_image_url: null })
            })

            if (!updateRes.ok) throw new Error("Erreur lors de la suppression")

            setSiteSettings(prev => prev ? ({ ...prev, services_hero_image_url: null }) : null)
            toast.success("Image supprimée avec succès")
        } catch (error: unknown) {
            console.error("Erreur suppression image:", error)
            toast.error("Erreur lors de la suppression")
        } finally {
            setDeletingServicesHeroImage(false)
        }
    }




    return (
        <AdminPanel
            icon={SettingsIcon}
            title="Paramètres du site"
            description="Images globales affichées sur les pages publiques."
            contentClassName="min-h-[400px] space-y-6"
        >
                {loadingSettings ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
                    </div>
                ) : (
                    <>
                        {/* Section Image de Fond - Page Services */}
                        <div className="grid items-start gap-8 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                    <ImageIcon className="h-5 w-5 text-odillon-teal" />
                                    Image de Fond - Page Services
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-600">
                                    Cette image apparaît en arrière-plan du héros de la page Services.
                                    Choisissez une image qui reflète l'ensemble des activités du cabinet.
                                    <br />Format recommandé : Paysage large (ex: 1920x1080px).
                                </p>

                                <div className="flex flex-col gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            {siteSettings?.services_hero_image_url ? "Changer l'image" : "Ajouter une image"}
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                id="services-hero-image-input"
                                                className="cursor-pointer border-slate-200 bg-slate-50/80"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => {
                                                const input = document.getElementById('services-hero-image-input') as HTMLInputElement;
                                                if (input.files && input.files[0]) {
                                                    handleUpdateSettingImage('services_hero_image_url', input.files[0]);
                                                } else {
                                                    toast.error("Veuillez sélectionner une image.");
                                                }
                                            }}
                                            disabled={uploadingServicesHeroImage}
                                            className="bg-odillon-teal text-white shadow-sm hover:bg-odillon-teal/90"
                                        >
                                            {uploadingServicesHeroImage ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Mise à jour...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    {siteSettings?.services_hero_image_url ? "Remplacer l'image" : "Ajouter l'image"}
                                                </>
                                            )}
                                        </Button>

                                        {siteSettings?.services_hero_image_url && (
                                            <Button
                                                variant="destructive"
                                                onClick={handleDeleteServicesHeroImage}
                                                disabled={deletingServicesHeroImage}
                                            >
                                                {deletingServicesHeroImage ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                )}
                                                Supprimer
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Image Services Hero */}
                            <div className="relative mx-auto aspect-video w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                {siteSettings?.services_hero_image_url ? (
                                    <div className="relative w-full h-full group">
                                        <img
                                            src={siteSettings.services_hero_image_url}
                                            alt="Aperçu Image Services"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">Image Actuelle</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-slate-400">
                                        <ImageIcon className="mb-2 h-12 w-12 opacity-50" />
                                        <span className="text-sm">Aucune image définie<br />(Fond décoratif par défaut)</span>
                                    </div>
                                )}
                            </div>
                        </div>

{/* Section Image À Propos */}
                        <div className="grid items-start gap-8 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                    <ImageIcon className="h-5 w-5 text-odillon-teal" />
                                    Section À Propos (Accueil)
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-600">
                                    Cette image apparaît dans la section "À Propos" de la page d'accueil, à côté du texte de présentation.
                                    <br />Format recommandé : Carré (ex: 800x800px) ou Portrait.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Changer l'image</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                id="expertise-image-input" // Unique ID
                                                className="cursor-pointer border-slate-200 bg-slate-50/80"
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
                                        className="w-full bg-odillon-teal text-white shadow-sm hover:bg-odillon-teal/90 sm:w-auto"
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
                            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:aspect-video lg:aspect-square">
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
                                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-slate-400">
                                        <ImageIcon className="mb-2 h-12 w-12 opacity-50" />
                                        <span className="text-sm">Aucune image définie<br />(Image par défaut affichée sur le site)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </>
                )}
        </AdminPanel>
    )
}
