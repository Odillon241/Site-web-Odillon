"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet"
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
import { StackedCardsInteraction } from "@/components/ui/stacked-cards-interaction"
import { BlurFade } from "@/components/magicui/blur-fade"

import { Loader2, Plus, Search, Trash2, Eye, EyeOff, Camera, Filter, ImageIcon, CalendarDays, RefreshCw, UploadCloud, X, ArrowLeft, Edit, FolderEdit, Save, Crop } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Photo } from "@/types/admin"
import { MONTHLY_THEMES } from "@/lib/photo-themes"
import { toast } from "sonner"
import { ImageCropper } from "../ImageCropper"
import getCroppedImg from "@/lib/image"

export function PhotosTab() {
    // ─────────────────────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────────────────────

    const [photos, setPhotos] = useState<Photo[]>([])
    const [activeSection, setActiveSection] = useState<'hero' | 'phototheque'>('hero')
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    // Edit States
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isRenameAlbumDialogOpen, setIsRenameAlbumDialogOpen] = useState(false)
    const [newAlbumName, setNewAlbumName] = useState("")
    const [newAlbumDetails, setNewAlbumDetails] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Filters
    const [searchTerm, setSearchTerm] = useState("")
    const [filterMonth, setFilterMonth] = useState<number | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>("all")

    // New Photo Form
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
    const [croppingFileIndex, setCroppingFileIndex] = useState<number | null>(null)
    const [newPhoto, setNewPhoto] = useState({
        description: "",
        details: "" as string,
        location: "" as string,
        month: null as number | null,
        theme_id: null as string | null,
        section_id: null as string | null,
        activity_type: null as string | null
    })

    // File Input Ref
    const fileInputRef = useRef<HTMLInputElement>(null)

    const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ]

    // ─────────────────────────────────────────────────────────────────────────
    // EFFECTS
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        loadPhotos()
    }, [activeSection])

    // ─────────────────────────────────────────────────────────────────────────
    // DATA LOADING
    // ─────────────────────────────────────────────────────────────────────────

    const loadPhotos = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filterMonth) params.append("month", filterMonth.toString())
            params.append("section", activeSection)

            const res = await fetch(`/api/photos?${params}`)
            if (!res.ok) throw new Error("Erreur lors du chargement")

            const data = await res.json()
            setPhotos(data.photos || [])
        } catch (error: unknown) {
            console.error("Erreur lors du chargement des photos:", error)
            toast.error(error instanceof Error ? error.message : "Impossible de charger les photos")
        } finally {
            setLoading(false)
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DRAG & DROP & FILE HANDLING
    // ─────────────────────────────────────────────────────────────────────────

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])])
        }
        // Reset input value to allow selecting the same file again if needed
        if (e.target) e.target.value = ''
    }

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files).filter(file =>
                file.type.startsWith('image/')
            )

            if (files.length !== e.dataTransfer.files.length) {
                toast.warning("Certains fichiers ont été ignorés car ce ne sont pas des images.")
            }

            setSelectedFiles(prev => [...prev, ...files])
        }
    }, [])

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const startCropping = (file: File, index: number) => {
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            setCropImageSrc(reader.result?.toString() || null)
            setCroppingFileIndex(index)
        })
        reader.readAsDataURL(file)
    }

    const onCropComplete = (croppedImageBlob: Blob) => {
        if (croppingFileIndex !== null) {
            const originalFile = selectedFiles[croppingFileIndex]
            const croppedFile = new File([croppedImageBlob], originalFile.name, {
                type: "image/jpeg",
            })

            setSelectedFiles(prev => {
                const newFiles = [...prev]
                newFiles[croppingFileIndex] = croppedFile
                return newFiles
            })
            onCropClose()
            toast.success("Image recadrée avec succès")
        }
    }

    const onCropClose = () => {
        setCropImageSrc(null)
        setCroppingFileIndex(null)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ACTIONS
    // ─────────────────────────────────────────────────────────────────────────

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Veuillez sélectionner au moins un fichier")
            return
        }

        if (!newPhoto.description.trim()) {
            toast.error("Veuillez ajouter une description (commune à toutes les photos)")
            return
        }

        try {
            setUploading(true)
            setUploadProgress({ current: 0, total: selectedFiles.length })
            let successCount = 0

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i]

                try {
                    // 1. Upload File
                    const formData = new FormData()
                    formData.append("file", file)

                    const uploadRes = await fetch("/api/upload", {
                        method: "POST",
                        body: formData
                    })

                    if (!uploadRes.ok) {
                        const errorData = await uploadRes.json()
                        throw new Error(`Erreur upload ${file.name}: ${errorData.error || uploadRes.statusText}`)
                    }

                    const { url } = await uploadRes.json()

                    // 2. Create DB Entry
                    const photoRes = await fetch("/api/photos", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            url,
                            description: newPhoto.description,
                            details: newPhoto.details || null,
                            location: newPhoto.location || null,
                            month: newPhoto.month,
                            category: null, // Legacy field if needed, but we use activity_type now
                            activity_type: newPhoto.activity_type,
                            section_id: activeSection,
                            is_active: true,
                            display_order: photos.length + successCount + 1
                        })
                    })

                    if (!photoRes.ok) throw new Error(`Erreur création ${file.name}`)

                    successCount++
                } catch (err) {
                    console.error(err)
                    toast.error(`Echec pour ${file.name}`)
                }

                setUploadProgress(prev => ({ ...prev, current: i + 1 }))
            }

            if (successCount > 0) {
                toast.success(`${successCount} photo(s) ajoutée(s) avec succès !`)
                // Reset Form & Close Sheet only if at least one success
                setSelectedFiles([])
                setNewPhoto({
                    description: "",
                    details: "",
                    location: "",
                    month: null,
                    theme_id: null,
                    section_id: null,
                    activity_type: null
                })
                setIsSheetOpen(false)
                loadPhotos()
            }

        } catch (error: unknown) {
            console.error("Erreur ajout photo:", error)
            toast.error("Erreur critique lors de l'upload")
        } finally {
            setUploading(false)
            setUploadProgress({ current: 0, total: 0 })
        }
    }

    const togglePhotoActive = async (photoId: string) => {
        try {
            const photo = photos.find(p => p.id === photoId)
            if (!photo) return

            const res = await fetch(`/api/photos/${photoId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !photo.is_active })
            })

            if (!res.ok) throw new Error("Erreur")

            setPhotos(photos.map(p =>
                p.id === photoId ? { ...p, is_active: !p.is_active } : p
            ))

            toast.success(photo.is_active ? "Photo masquée" : "Photo activée")
        } catch (error: unknown) {
            console.error("Erreur maj photo:", error)
            toast.error("Erreur lors de la mise à jour")
        }
    }

    const deletePhoto = async (photoId: string) => {
        try {
            const res = await fetch(`/api/photos/${photoId}`, {
                method: "DELETE"
            })

            if (!res.ok) throw new Error("Erreur lors de la suppression")

            toast.success("Photo supprimée avec succès")
            loadPhotos()
        } catch (error: unknown) {
            console.error("Erreur suppression:", error)
            toast.error("Erreur lors de la suppression")
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // EDIT & RENAME LOGIC
    // ─────────────────────────────────────────────────────────────────────────

    const openEditDialog = (photo: Photo) => {
        setEditingPhoto({ ...photo })
        setIsEditDialogOpen(true)
    }

    const handleSavePhoto = async () => {
        if (!editingPhoto) return

        setIsSaving(true)
        try {
            const response = await fetch(`/api/photos/${editingPhoto.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: editingPhoto.description,
                    details: editingPhoto.details,
                    month: editingPhoto.month,
                    theme_id: editingPhoto.theme_id,
                    location: editingPhoto.location,
                    activity_type: editingPhoto.activity_type
                }),
            })

            if (!response.ok) throw new Error("Erreur lors de la mise à jour")

            const { photo: updatedPhoto } = await response.json()

            // Update local state
            setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p))
            toast.success("Photo mise à jour avec succès")
            setIsEditDialogOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("Impossible de mettre à jour la photo")
        } finally {
            setIsSaving(false)
        }
    }

    const openRenameAlbumDialog = () => {
        if (selectedAlbum) {
            setNewAlbumName(selectedAlbum)
            // Pre-fill details from the first photo in the album if available
            const firstPhoto = photos.find(p => p.description === selectedAlbum)
            setNewAlbumDetails(firstPhoto?.details || "")
            setIsRenameAlbumDialogOpen(true)
        }
    }

    const handleRenameAlbum = async () => {
        if (!selectedAlbum || !newAlbumName.trim()) return

        setIsSaving(true)

        // Find all photos in this album
        const albumPhotos = photos.filter(p => p.description === selectedAlbum)
        let successCount = 0

        try {
            // We have to update them one by one as we don't have a bulk update endpoint yet
            // Could be optimized by adding a bulk endpoint later
            await Promise.all(albumPhotos.map(async (photo) => {
                const response = await fetch(`/api/photos/${photo.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        description: newAlbumName,
                        details: newAlbumDetails
                    }),
                })
                if (response.ok) successCount++
            }))

            if (successCount > 0) {
                // Update local state
                setPhotos(prev => prev.map(p => p.description === selectedAlbum ? { ...p, description: newAlbumName, details: newAlbumDetails } : p))
                setSelectedAlbum(newAlbumName) // Switch view to new name
                toast.success(`Album renommé (${successCount} photos mises à jour)`)
                setIsRenameAlbumDialogOpen(false)
            } else {
                toast.error("Aucune photo n'a pu être mise à jour")
            }

        } catch (error) {
            console.error("Error renaming album:", error)
            toast.error("Erreur lors du renommage de l'album")
        } finally {
            setIsSaving(false)
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FILTERING
    // ─────────────────────────────────────────────────────────────────────────

    const filteredPhotos = photos.filter(photo => {
        if (selectedAlbum && photo.description !== selectedAlbum) {
            return false
        }
        if (searchTerm && !photo.description.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false
        }
        if (filterMonth && photo.month !== filterMonth) {
            return false
        }
        if (filterStatus === "active" && !photo.is_active) {
            return false
        }
        if (filterStatus === "inactive" && photo.is_active) {
            return false
        }
        return true
    })

    // Get unique album names (descriptions) for the stacked view
    // Only strictly needed when NOT filtering by album (to show the list of albums)
    const uniqueAlbums = Array.from(new Set(
        photos
            .filter(p => !searchTerm && !filterMonth && filterStatus === 'all') // Optional: show all albums regardless of filters? Or filter albums? Let's show all available albums unless filtered.
            .map(p => p.description)
    )).filter(Boolean)

    return (
        <div className="space-y-6">
            {/* HEADER & SECTION TABS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-odillon-teal" />
                        Médiathèque
                    </h2>
                    <p className="text-sm text-gray-500">Gérez les images du carrousel et de la photothèque</p>
                </div>

                <div className="flex bg-gray-100/50 p-1 rounded-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-md transition-all ${activeSection === 'hero' ? 'bg-white shadow-sm text-odillon-teal' : 'text-gray-500 hover:text-gray-900'}`}
                        onClick={() => setActiveSection('hero')}
                    >
                        <Camera className="w-4 h-4 mr-2" />
                        Carrousel
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-md transition-all ${activeSection === 'phototheque' ? 'bg-white shadow-sm text-odillon-teal' : 'text-gray-500 hover:text-gray-900'}`}
                        onClick={() => setActiveSection('phototheque')}
                    >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Photothèque
                    </Button>
                </div>
            </div>

            {/* MAIN CONTENT CARD */}
            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                        {activeSection === 'phototheque' && selectedAlbum && (
                            <Button variant="ghost" size="icon" onClick={() => setSelectedAlbum(null)} className="mr-2">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        )}
                        <CardTitle className="text-lg font-medium text-gray-700">
                            {activeSection === 'hero'
                                ? "Photos du Carrousel"
                                : selectedAlbum
                                    ? (
                                        <div className="flex items-center gap-2">
                                            <span>Album : {selectedAlbum}</span>
                                            <Button variant="ghost" size="icon" onClick={openRenameAlbumDialog} className="h-6 w-6 ml-1 text-gray-400 hover:text-odillon-teal">
                                                <FolderEdit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )
                                    : "Albums de la Photothèque"}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-white border shadow-sm text-xs font-normal">
                            {activeSection === 'hero' || selectedAlbum ? filteredPhotos.length : uniqueAlbums.length}
                        </Badge>
                    </div>

                    {/* ADD PHOTO BUTTON (SHEET TRIGGER) */}
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button className="bg-odillon-teal hover:bg-odillon-teal/90 text-white shadow-sm transition-all hover:scale-105 active:scale-95">
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter des photos
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto w-full sm:max-w-md">
                            <SheetHeader>
                                <SheetTitle>Ajouter des photos</SheetTitle>
                                <SheetDescription>
                                    Ajoutez une ou plusieurs images à la section {activeSection === 'hero' ? "Carrousel" : "Photothèque"}.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="grid gap-6 py-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Fichiers Images *
                                    </label>

                                    {/* DRAG & DROP ZONE */}
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer relative transition-colors ${isDragging
                                            ? "border-odillon-teal bg-odillon-teal/5"
                                            : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}
                                    >
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            ref={fileInputRef}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                                            <div className="bg-blue-50 p-3 rounded-full">
                                                <UploadCloud className={`w-6 h-6 ${isDragging ? 'text-odillon-teal' : 'text-blue-500'}`} />
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium">
                                                {isDragging ? "Déposez les fichiers ici" : "Cliquez ou glissez vos images"}
                                            </span>
                                            <span className="text-xs text-gray-400">PNG, JPG, WEBP jusqu'à 5MB</span>
                                        </div>
                                    </div>

                                    {/* SELECTED FILES LIST */}
                                    {selectedFiles.length > 0 && (
                                        <div className="space-y-2 mt-4 max-h-[200px] overflow-y-auto pr-2">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                {selectedFiles.length} fichier(s) sélectionné(s)
                                            </p>
                                            {selectedFiles.map((file, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-100 text-sm">
                                                    <span className="truncate max-w-[200px] text-gray-700">{file.name}</span>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-6 w-6 p-0 text-gray-400 hover:text-odillon-teal"
                                                            onClick={() => startCropping(file, idx)}
                                                            title="Recadrer"
                                                        >
                                                            <Crop className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                                            onClick={() => removeFile(idx)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {activeSection === 'phototheque' ? "Nom de l'événement *" : "Titre / Description *"}
                                    </label>
                                    <Input
                                        placeholder={activeSection === 'phototheque' ? "Ex: Séminaire annuel 2024" : "Ex: Vue aérienne..."}
                                        value={newPhoto.description}
                                        onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                                    />
                                    {activeSection === 'phototheque' && (
                                        <p className="text-[10px] text-gray-500">
                                            Ce nom sera appliqué à toutes les photos sélectionnées pour les regrouper.
                                        </p>
                                    )}
                                </div>

                                {activeSection === 'phototheque' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Lieu (Optionnel)</label>
                                        <Input
                                            placeholder="Ex: Libreville, Hôtel Nomad"
                                            value={newPhoto.location}
                                            onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Mois (Optionnel)</label>
                                        <Select
                                            value={newPhoto.month?.toString()}
                                            onValueChange={(val) => setNewPhoto({ ...newPhoto, month: parseInt(val) })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months.map((m, i) => (
                                                    <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Thème (Optionnel)</label>
                                        <Select
                                            value={newPhoto.theme_id || "none"}
                                            onValueChange={(val) => setNewPhoto({ ...newPhoto, theme_id: val === "none" ? null : val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Aucun</SelectItem>
                                                {MONTHLY_THEMES.map((t) => (
                                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type d'activité (Optionnel)</label>
                                    <Select
                                        value={newPhoto.activity_type || "none"}
                                        onValueChange={(val) => setNewPhoto({ ...newPhoto, activity_type: val === "none" ? null : val })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choisir une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucun</SelectItem>
                                            <SelectItem value="Formations">Formations</SelectItem>
                                            <SelectItem value="Séminaires">Séminaires</SelectItem>
                                            <SelectItem value="Team Building">Team Building</SelectItem>
                                            <SelectItem value="Ateliers">Ateliers</SelectItem>
                                            <SelectItem value="Événements">Événements</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button variant="outline">Annuler</Button>
                                </SheetClose>
                                <Button
                                    onClick={handleUpload}
                                    disabled={uploading || selectedFiles.length === 0}
                                    className="bg-odillon-teal hover:bg-odillon-teal/90"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {uploadProgress.total > 0
                                                ? `Envoi ${uploadProgress.current}/${uploadProgress.total}`
                                                : "Envoi..."}
                                        </>
                                    ) : (
                                        `Ajouter ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`
                                    )}
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </CardHeader>

                <CardContent className="p-0">
                    {/* FILTERS BAR */}
                    <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 bg-white">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-odillon-teal"
                            />
                        </div>

                        <Select value={filterMonth?.toString() || "all"} onValueChange={(val) => setFilterMonth(val === "all" ? null : parseInt(val))}>
                            <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Mois" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les mois</SelectItem>
                                {months.map((m, i) => (
                                    <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value="active">Actives</SelectItem>
                                <SelectItem value="inactive">Masquées</SelectItem>
                            </SelectContent>
                        </Select>

                        {(searchTerm || filterMonth || filterStatus !== 'all') && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setSearchTerm("")
                                    setFilterMonth(null)
                                    setFilterStatus("all")
                                }}
                                title="Réinitialiser"
                            >
                                <RefreshCw className="w-4 h-4 text-gray-500" />
                            </Button>
                        )}
                    </div>

                    {/* PHOTOS GRID */}
                    <div className="p-6 bg-gray-50/30 min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-odillon-teal mb-4" />
                                <p className="text-gray-500">Chargement de la galerie...</p>
                            </div>
                        ) : activeSection === 'phototheque' && !selectedAlbum && !searchTerm && !filterMonth && filterStatus === 'all' ? (
                            // ALBUM VIEW (STACKED CARDS) - Only when no specific filters active (or discuss if filters should apply to albums)
                            // Let's apply filters to the grid view of albums if wanted, but simpler to just show albums.
                            // For now, let's assume if I filter, I might want to see individual photos, or I filter albums.
                            // Let's stick to the plan: Group photos by description. 
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {uniqueAlbums.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <ImageIcon className="w-10 h-10 text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">Aucun album</h3>
                                        <p className="text-gray-500">Ajoutez des photos pour créer des albums.</p>
                                    </div>
                                ) : (
                                    uniqueAlbums.map((albumName) => {
                                        const albumPhotos = photos.filter(p => p.description === albumName);
                                        const coverPhoto = albumPhotos[0];
                                        if (!coverPhoto) return null;

                                        // Prepare cards data for stack
                                        const cardsData = albumPhotos.slice(0, 3).map((photo, i) => ({
                                            image: photo.url,
                                            title: i === 0 ? albumName : undefined,
                                            description: i === 0 ? `${albumPhotos.length} photos` : undefined
                                        }));

                                        return (
                                            <BlurFade key={albumName} delay={0.05}>
                                                <div
                                                    className="relative w-full aspect-[7/8] max-w-[300px] mx-auto group perspective-1000 cursor-pointer"
                                                    onClick={() => setSelectedAlbum(albumName)}
                                                >
                                                    <StackedCardsInteraction
                                                        cards={cardsData}
                                                        spreadDistance={15}
                                                        rotationAngle={4}
                                                    />
                                                </div>
                                            </BlurFade>
                                        );
                                    })
                                )}
                            </div>
                        ) : (
                            // STANDARD GRID VIEW (Detail view or Hero or Filtered)
                            filteredPhotos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <ImageIcon className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">Aucune photo</h3>
                                    <p className="text-gray-500 max-w-sm mt-1">
                                        {searchTerm || filterMonth
                                            ? "Aucun résultat pour vos filtres. Essayez de réinitialiser la recherche."
                                            : "Cette section est vide pour le moment. Ajoutez votre première photo !"}
                                    </p>
                                    {(searchTerm || filterMonth) && (
                                        <Button variant="link" onClick={() => { setSearchTerm(""); setFilterMonth(null); }} className="mt-2 text-odillon-teal">
                                            Effacer les filtres
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {filteredPhotos.map((photo) => (
                                        <div
                                            key={photo.id}
                                            className={`group relative bg-white rounded-xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!photo.is_active ? 'opacity-75 grayscale-[0.5]' : ''
                                                }`}
                                        >
                                            {/* Image Container */}
                                            <div className="aspect-[4/3] relative overflow-hidden bg-gray-200">
                                                <img
                                                    src={photo.url}
                                                    alt={photo.description}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                {/* Status Badge */}
                                                <div className="absolute top-3 left-3 z-10">
                                                    {photo.is_active ? (
                                                        <Badge className="bg-green-500/90 hover:bg-green-600 backdrop-blur-sm border-none shadow-sm text-[10px] px-2">Active</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-gray-800/80 text-white backdrop-blur-sm border-none shadow-sm text-[10px] px-2">Masquée</Badge>
                                                    )}
                                                </div>

                                                {/* Actions Overlay */}
                                                <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm"
                                                        onClick={() => openEditDialog(photo)}
                                                        title="Modifier"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>

                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm"
                                                        onClick={() => togglePhotoActive(photo.id)}
                                                        title={photo.is_active ? "Masquer" : "Afficher"}
                                                    >
                                                        {photo.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                size="icon"
                                                                variant="destructive"
                                                                className="h-8 w-8 rounded-full shadow-sm"
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Supprimer cette photo ?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Cette action est irréversible. La photo sera supprimée définitivement de la base de données.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => deletePhoto(photo.id)} className="bg-red-600 hover:bg-red-700">
                                                                    Supprimer
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>

                                            {/* Info Content */}
                                            <div className="p-3">
                                                <p className="text-sm font-medium text-gray-900 truncate mb-1" title={photo.description}>
                                                    {photo.description}
                                                </p>

                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {photo.month && (
                                                        <Badge variant="outline" className="text-[10px] py-0 h-5 font-normal bg-gray-50 text-gray-600 border-gray-200">
                                                            <CalendarDays className="w-3 h-3 mr-1 text-odillon-teal" />
                                                            {months[photo.month - 1]}
                                                        </Badge>
                                                    )}
                                                    {photo.theme_id && (
                                                        <Badge variant="outline" className="text-[10px] py-0 h-5 font-normal bg-gray-50 text-gray-600 border-gray-200">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-odillon-lime mr-1"></span>
                                                            {MONTHLY_THEMES.find(t => t.id === photo.theme_id)?.name || "Thème"}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </CardContent>
            </Card>
            {/* EDIT PHOTO DIALOG */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier la photo</DialogTitle>
                        <DialogDescription>
                            Modifiez les détails de cette photo.
                        </DialogDescription>
                    </DialogHeader>

                    {editingPhoto && (
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-desc">Description / Album</Label>
                                <Input
                                    id="edit-desc"
                                    value={editingPhoto.description}
                                    onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                                />
                                <p className="text-[10px] text-gray-500">Changer ceci déplacera la photo dans un autre album si le nom est différent.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-location">Lieu</Label>
                                <Input
                                    id="edit-location"
                                    value={editingPhoto.location || ""}
                                    onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-details">Légende / Détails (Optionnel)</Label>
                                <textarea
                                    id="edit-details"
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    value={editingPhoto.details || ""}
                                    onChange={(e) => setEditingPhoto({ ...editingPhoto, details: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Mois</Label>
                                    <Select
                                        value={editingPhoto.month?.toString()}
                                        onValueChange={(val) => setEditingPhoto({ ...editingPhoto, month: parseInt(val) })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Mois" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((m, i) => (
                                                <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Type d'activité</Label>
                                    <Select
                                        value={editingPhoto.activity_type || "none"}
                                        onValueChange={(v) => setEditingPhoto({ ...editingPhoto, activity_type: v === "none" ? null : v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucun</SelectItem>
                                            <SelectItem value="Formations">Formations</SelectItem>
                                            <SelectItem value="Séminaires">Séminaires</SelectItem>
                                            <SelectItem value="Team Building">Team Building</SelectItem>
                                            <SelectItem value="Ateliers">Ateliers</SelectItem>
                                            <SelectItem value="Événements">Événements</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Thème</Label>
                                <Select
                                    value={editingPhoto.theme_id || "none"}
                                    onValueChange={(val) => setEditingPhoto({ ...editingPhoto, theme_id: val === "none" ? null : val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Thème" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Aucun</SelectItem>
                                        {MONTHLY_THEMES.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleSavePhoto} disabled={isSaving} className="bg-odillon-teal">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* IMAGE CROPPER DIALOG */}
            {cropImageSrc && (
                <Dialog open={!!cropImageSrc} onOpenChange={(open) => !open && onCropClose()}>
                    <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-black border-zinc-800">
                        <div className="relative w-full h-[80vh]">
                            <ImageCropper
                                imageSrc={cropImageSrc}
                                onCropComplete={onCropComplete}
                                onClose={onCropClose}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* RENAME ALBUM DIALOG */}
            <Dialog open={isRenameAlbumDialogOpen} onOpenChange={setIsRenameAlbumDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Renommer l'album</DialogTitle>
                        <DialogDescription>
                            Ceci mettra à jour la description de <strong>toutes les photos</strong> de cet album.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="album-name">Nom de l'album</Label>
                            <Input
                                id="album-name"
                                value={newAlbumName}
                                onChange={(e) => setNewAlbumName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="album-details">Description de l'événement (pour toutes les photos)</Label>
                            <textarea
                                id="album-details"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={newAlbumDetails}
                                onChange={(e) => setNewAlbumDetails(e.target.value)}
                                placeholder="Ajoutez une description commune..."
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRenameAlbumDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleRenameAlbum} disabled={isSaving} className="bg-odillon-teal">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Renommer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div >
    )
}
