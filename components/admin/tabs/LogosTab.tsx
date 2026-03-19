"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Loader2, Plus, Trash2, Eye, EyeOff, Building2, Upload, Pencil, ImageIcon, X } from "lucide-react"
import { CompanyLogo } from "@/types/admin"
import { toast } from "sonner"

// Extraction de la couleur dominante d'une image via Canvas
function extractDominantColor(imageUrl: string): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
            const canvas = document.createElement("canvas")
            const size = 50
            canvas.width = size
            canvas.height = size
            const ctx = canvas.getContext("2d")
            if (!ctx) { resolve("#39837a"); return }

            ctx.drawImage(img, 0, 0, size, size)
            const data = ctx.getImageData(0, 0, size, size).data

            // Compter les couleurs en les regroupant par buckets (tolérance de 24)
            const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {}

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
                // Ignorer les pixels transparents
                if (a < 128) continue
                // Ignorer les blancs, quasi-blancs, noirs, quasi-noirs et gris
                const max = Math.max(r, g, b)
                const min = Math.min(r, g, b)
                const saturation = max === 0 ? 0 : (max - min) / max
                const brightness = max / 255
                // Garder seulement les couleurs avec un minimum de saturation et pas trop sombres/claires
                if (saturation < 0.15 || brightness < 0.1 || brightness > 0.95) continue

                const kr = Math.round(r / 24) * 24
                const kg = Math.round(g / 24) * 24
                const kb = Math.round(b / 24) * 24
                const key = `${kr},${kg},${kb}`

                if (!buckets[key]) {
                    buckets[key] = { r: 0, g: 0, b: 0, count: 0 }
                }
                buckets[key].r += r
                buckets[key].g += g
                buckets[key].b += b
                buckets[key].count++
            }

            // Trouver le bucket le plus fréquent
            let best = { r: 57, g: 131, b: 122, count: 0 } // fallback odillon-teal
            for (const bucket of Object.values(buckets)) {
                if (bucket.count > best.count) {
                    best = bucket
                }
            }

            if (best.count > 0) {
                const r = Math.round(best.r / best.count)
                const g = Math.round(best.g / best.count)
                const b = Math.round(best.b / best.count)
                resolve(`#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`)
            } else {
                resolve("#39837a")
            }
        }
        img.onerror = () => resolve("#39837a")
        img.src = imageUrl
    })
}

// Composant zone d'upload avec aperçu
function LogoUploadZone({
    currentUrl,
    onUploaded,
    onColorExtracted,
    uploading,
    setUploading
}: {
    currentUrl: string
    onUploaded: (url: string) => void
    onColorExtracted?: (color: string) => void
    uploading: boolean
    setUploading: (v: boolean) => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (file: File) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
        if (!allowedTypes.includes(file.type)) {
            toast.error("Format non supporté. Utilisez PNG, JPG, WEBP ou SVG")
            return
        }

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', 'logos')

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Erreur upload")
            }

            const data = await res.json()
            onUploaded(data.url)
            // Extraire la couleur dominante
            if (onColorExtracted) {
                extractDominantColor(data.url).then(onColorExtracted)
            }
            toast.success("Logo téléversé")
        } catch (error) {
            console.error("Upload error:", error)
            toast.error(error instanceof Error ? error.message : "Erreur lors du téléversement")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Logo</label>

            {/* Aperçu */}
            {currentUrl && (
                <div className="relative w-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md p-4">
                    <img
                        src={currentUrl}
                        alt="Aperçu du logo"
                        className="max-h-24 max-w-full object-contain"
                    />
                    <button
                        type="button"
                        onClick={() => onUploaded("")}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Zone d'upload cliquable */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const file = e.dataTransfer.files?.[0]
                    if (file) handleFileSelect(file)
                }}
                className="border-2 border-dashed border-gray-300 hover:border-green-400 rounded-md p-6 text-center cursor-pointer transition-colors hover:bg-green-50/30"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileSelect(file)
                        e.target.value = ""
                    }}
                />
                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                        <p className="text-sm text-gray-500">Téléversement en cours...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        {currentUrl ? (
                            <Upload className="w-6 h-6 text-gray-400" />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                        )}
                        <p className="text-sm text-gray-600">
                            {currentUrl ? "Changer le logo" : "Cliquez ou glissez un fichier ici"}
                        </p>
                        <p className="text-[10px] text-gray-400">
                            PNG, JPG, WEBP, SVG
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export function LogosTab() {
    const [logos, setLogos] = useState<CompanyLogo[]>([])
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [editingLogo, setEditingLogo] = useState<{
        id: string
        name: string
        full_name: string
        logo_path: string
        fallback: string
        color: string
    } | null>(null)

    const [newLogo, setNewLogo] = useState({
        name: "",
        full_name: "",
        logo_path: "",
        fallback: "",
        color: "#39837a"
    })

    useEffect(() => {
        loadLogos()
    }, [])

    const loadLogos = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/logos')
            if (!res.ok) throw new Error("Erreur lors du chargement")

            const data = await res.json()
            setLogos((data.logos || []).sort((a: CompanyLogo, b: CompanyLogo) => a.display_order - b.display_order))
        } catch (error: unknown) {
            console.error("Erreur logos:", error)
            toast.error("Impossible de charger les logos")
        } finally {
            setLoading(false)
        }
    }

    const resetNewLogo = () => {
        setNewLogo({ name: "", full_name: "", logo_path: "", fallback: "", color: "#39837a" })
    }

    const handleAddLogo = async () => {
        if (!newLogo.name.trim() || !newLogo.full_name.trim() || !newLogo.logo_path.trim()) {
            toast.error("Veuillez remplir le nom, le nom complet et téléverser un logo")
            return
        }

        try {
            const res = await fetch('/api/logos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLogo)
            })

            if (!res.ok) throw new Error("Erreur lors de l'ajout")

            toast.success("Logo ajouté avec succès")
            resetNewLogo()
            setIsDialogOpen(false)
            loadLogos()
        } catch (error: unknown) {
            console.error("Erreur ajout logo:", error)
            toast.error("Erreur lors de l'ajout du logo")
        }
    }

    const toggleLogoActive = async (logoId: string) => {
        try {
            const logo = logos.find(l => l.id === logoId)
            if (!logo) return

            const res = await fetch(`/api/logos/${logoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !logo.is_active })
            })

            if (!res.ok) throw new Error("Erreur")

            setLogos(logos.map(l =>
                l.id === logoId ? { ...l, is_active: !l.is_active } : l
            ))
            toast.success(logo.is_active ? "Logo désactivé" : "Logo activé")
        } catch (error: unknown) {
            console.error("Erreur maj logo:", error)
            toast.error("Impossible de modifier le statut")
        }
    }

    const openEditDialog = (logo: CompanyLogo) => {
        setEditingLogo({
            id: logo.id,
            name: logo.name,
            full_name: logo.full_name,
            logo_path: logo.logo_path,
            fallback: logo.fallback,
            color: logo.color
        })
        setIsEditDialogOpen(true)
    }

    const handleEditLogo = async () => {
        if (!editingLogo) return
        if (!editingLogo.name.trim() || !editingLogo.full_name.trim() || !editingLogo.logo_path.trim()) {
            toast.error("Veuillez remplir le nom, le nom complet et téléverser un logo")
            return
        }

        try {
            const { id, ...updates } = editingLogo
            const res = await fetch(`/api/logos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })

            if (!res.ok) throw new Error("Erreur lors de la modification")

            toast.success("Logo modifié avec succès")
            setIsEditDialogOpen(false)
            setEditingLogo(null)
            loadLogos()
        } catch (error: unknown) {
            console.error("Erreur modification logo:", error)
            toast.error("Erreur lors de la modification du logo")
        }
    }

    const deleteLogo = async (logoId: string) => {
        try {
            const res = await fetch(`/api/logos/${logoId}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error("Erreur lors de la suppression")

            toast.success("Logo supprimé")
            loadLogos()
        } catch (error: unknown) {
            console.error("Erreur suppression:", error)
            toast.error("Impossible de supprimer le logo")
        }
    }

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-medium text-gray-700">Partenaires & Clients</CardTitle>
                    <Badge variant="secondary" className="bg-white border shadow-sm text-xs font-normal">
                        {logos.length} logos
                    </Badge>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { resetNewLogo(); setUploading(false) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter un logo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Nouveau Partenaire</DialogTitle>
                            <DialogDescription>
                                Ajoutez les logos des entreprises partenaires qui défileront sur la page d&apos;accueil.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {/* Zone d'upload avec aperçu */}
                            <LogoUploadZone
                                currentUrl={newLogo.logo_path}
                                onUploaded={(url) => setNewLogo(prev => ({ ...prev, logo_path: url }))}
                                onColorExtracted={(color) => setNewLogo(prev => ({ ...prev, color }))}
                                uploading={uploading}
                                setUploading={setUploading}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom Complet *</label>
                                <Input
                                    placeholder="ex: Société ACME International"
                                    value={newLogo.full_name}
                                    onChange={(e) => setNewLogo({ ...newLogo, full_name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Abréviation *</label>
                                <Input
                                    placeholder="ex: ACME"
                                    value={newLogo.name}
                                    onChange={(e) => setNewLogo({ ...newLogo, name: e.target.value, fallback: e.target.value.slice(0, 3).toUpperCase() })}
                                />
                                <p className="text-[10px] text-gray-400">Sigle ou acronyme affiché sous le nom complet</p>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button
                                onClick={handleAddLogo}
                                disabled={uploading}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Enregistrer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent className="p-6 bg-gray-50/30 min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    </div>
                ) : logos.length === 0 ? (
                    <div className="text-center py-12">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Aucun logo partenaire</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {logos.map((logo) => (
                            <Card key={logo.id} className="group hover:shadow-md transition-shadow border-gray-100">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm overflow-hidden bg-white border border-gray-100"
                                            style={{ backgroundColor: logo.logo_path ? 'white' : logo.color }}
                                        >
                                            {logo.logo_path ? (
                                                <img
                                                    src={logo.logo_path}
                                                    alt={logo.full_name}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            ) : (
                                                logo.fallback
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{logo.full_name}</p>
                                            <p className="text-xs text-gray-500">{logo.name}</p>
                                            <div className="mt-1">
                                                {logo.is_active ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-none text-[10px] px-2">Actif</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-[10px] px-2">Inactif</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2 border-t border-gray-50">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => toggleLogoActive(logo.id)}
                                            className="flex-1 h-8 text-xs"
                                        >
                                            {logo.is_active ? (
                                                <><EyeOff className="w-3 h-3 mr-2" /> Masquer</>
                                            ) : (
                                                <><Eye className="w-3 h-3 mr-2" /> Afficher</>
                                            )}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => openEditDialog(logo)}
                                            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Supprimer ce partenaire ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Le logo de <strong>{logo.full_name}</strong> sera retiré définitivement.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteLogo(logo.id)} className="bg-red-600 hover:bg-red-700">
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

            {/* Dialog d'édition */}
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
                setIsEditDialogOpen(open)
                if (!open) { setEditingLogo(null); setUploading(false) }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Modifier le partenaire</DialogTitle>
                        <DialogDescription>
                            Modifiez les informations du logo partenaire.
                        </DialogDescription>
                    </DialogHeader>

                    {editingLogo && (
                        <div className="grid gap-4 py-4">
                            {/* Zone d'upload avec aperçu */}
                            <LogoUploadZone
                                currentUrl={editingLogo.logo_path}
                                onUploaded={(url) => setEditingLogo(prev => prev ? { ...prev, logo_path: url } : prev)}
                                onColorExtracted={(color) => setEditingLogo(prev => prev ? { ...prev, color } : prev)}
                                uploading={uploading}
                                setUploading={setUploading}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom Complet *</label>
                                <Input
                                    value={editingLogo.full_name}
                                    onChange={(e) => setEditingLogo({ ...editingLogo, full_name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Abréviation *</label>
                                <Input
                                    placeholder="ex: ACME"
                                    value={editingLogo.name}
                                    onChange={(e) => setEditingLogo({ ...editingLogo, name: e.target.value, fallback: e.target.value.slice(0, 3).toUpperCase() })}
                                />
                                <p className="text-[10px] text-gray-400">Sigle ou acronyme affiché sous le nom complet</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button
                            onClick={handleEditLogo}
                            disabled={uploading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
