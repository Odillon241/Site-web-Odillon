"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, m } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

import { Loader2, Plus, Search, Trash2, Eye, EyeOff, Camera, ImageIcon, CalendarDays, RefreshCw, UploadCloud, X, ArrowLeft, Edit, FolderEdit, Save, Crop, MapPin, FolderInput, ListChecks, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Photo } from "@/types/admin"
import { MONTHLY_THEMES } from "@/lib/photo-themes"
import { toast } from "sonner"
import { ImageCropper } from "../ImageCropper"


import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortablePhotoItem({ id, children }: { id: string, children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none' as React.CSSProperties['touchAction']
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    )
}

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
    const [selectedPhotoForPreview, setSelectedPhotoForPreview] = useState<Photo | null>(null)

    // Edit States
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isRenameAlbumDialogOpen, setIsRenameAlbumDialogOpen] = useState(false)
    const [newAlbumName, setNewAlbumName] = useState("")
    const [newAlbumDetails, setNewAlbumDetails] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [editIsNewAlbum, setEditIsNewAlbum] = useState(false)

    // Album deletion
    const [isDeleteAlbumOpen, setIsDeleteAlbumOpen] = useState(false)
    const [albumToDelete, setAlbumToDelete] = useState<string | null>(null)

    // Bulk selection
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isBulkMoveOpen, setIsBulkMoveOpen] = useState(false)
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
    const [bulkMoveTarget, setBulkMoveTarget] = useState<string>("")
    const [bulkMoveIsNew, setBulkMoveIsNew] = useState(false)
    const [bulkMoveNewName, setBulkMoveNewName] = useState("")
    const [bulkBusy, setBulkBusy] = useState(false)

    // Filters
    const [searchTerm, setSearchTerm] = useState("")
    const [filterYear, setFilterYear] = useState<number | null>(null)
    const [filterMonth, setFilterMonth] = useState<number | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>("all")

    // Album Order Control (Admin maintains this order)
    const [albumOrder, setAlbumOrder] = useState<string[]>([])

    // New Photo Form
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
    const [croppingFileIndex, setCroppingFileIndex] = useState<number | null>(null)
    const [newPhoto, setNewPhoto] = useState({
        description: "",
        details: "" as string,
        location: "" as string,
        month: null as number | null,
        year: new Date().getFullYear() as number | null,
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

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 15 }, (_, i) => currentYear - i)

    // ─────────────────────────────────────────────────────────────────────────
    // EFFECTS
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        loadPhotos()
        // Reset albumOrder when switching sections
        setAlbumOrder([])
        // Reset selection
        setSelectionMode(false)
        setSelectedIds([])
    }, [activeSection])

    // Reset selection when entering/leaving an album
    useEffect(() => {
        setSelectionMode(false)
        setSelectedIds([])
    }, [selectedAlbum])

    // Initialize albumOrder from photos on first load or when changed
    useEffect(() => {
        if (photos.length > 0) {
            const derived = Array.from(new Set(
                photos.map(p => p.description)
            )).filter(Boolean)
            setAlbumOrder(derived)
        }
    }, [photos])

    // ─────────────────────────────────────────────────────────────────────────
    // DATA LOADING
    // ─────────────────────────────────────────────────────────────────────────

    const loadPhotos = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filterYear) params.append("year", filterYear.toString())
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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = albumOrder.indexOf(active.id as string)
            const newIndex = albumOrder.indexOf(over.id as string)

            const newOrder = arrayMove(albumOrder, oldIndex, newIndex)

            // Update local state immediately
            setAlbumOrder(newOrder)

            // Optimistic update
            const albumRank = new Map(newOrder.map((name, index) => [name, index]))

            const sortedPhotos = [...photos].sort((a, b) => {
                const rankA = albumRank.has(a.description) ? albumRank.get(a.description)! : 999999
                const rankB = albumRank.has(b.description) ? albumRank.get(b.description)! : 999999
                // Preserve relative order if same album
                if (rankA === rankB) {
                    // We assume photos are already sorted correctly within album (newest first or strictly by display_order)
                    // If we want to strictly keep 'display_order' ASC which simulates 'created_at' DESC per our initial setup? 
                    // No, initally we had 'created_at' desc. Reverting to 'display_order' ASC means we rely on display_order.
                    // The backend reorder sets display_order sequentially.
                    // Here we just want to group them visually.
                    // Let's rely on current array order stability or index.
                    return 0
                }
                return rankA - rankB
            })

            setPhotos(sortedPhotos)

            // API Call
            try {
                await fetch('/api/photos/reorder', {
                    method: 'POST',
                    body: JSON.stringify({ albumNames: newOrder })
                })
                toast.success("Ordre mis à jour")
            } catch (err) {
                console.error(err)
                toast.error("Erreur mise à jour ordre")
                loadPhotos() // Revert
            }
        }
    }

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
                            year: newPhoto.year,
                            theme_id: newPhoto.theme_id || null,
                            activity_type: newPhoto.activity_type || null,
                            section_id: activeSection,
                            is_active: true,
                            display_order: photos.length + successCount + 1
                        })
                    })

                    if (!photoRes.ok) {
                        const errorData = await photoRes.json().catch(() => ({}))
                        throw new Error(`Erreur création ${file.name}: ${errorData.error || photoRes.statusText}`)
                    }

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
                    year: new Date().getFullYear(),
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
    // BULK ACTIONS & ALBUM DELETION
    // ─────────────────────────────────────────────────────────────────────────

    const toggleSelected = (photoId: string) => {
        setSelectedIds(prev =>
            prev.includes(photoId) ? prev.filter(id => id !== photoId) : [...prev, photoId]
        )
    }

    const exitSelectionMode = () => {
        setSelectionMode(false)
        setSelectedIds([])
    }

    const selectAllVisible = () => {
        const visibleIds = filteredPhotos.map(p => p.id)
        const allSelected = visibleIds.every(id => selectedIds.includes(id))
        setSelectedIds(allSelected ? [] : visibleIds)
    }

    // Generic bulk call against /api/photos/bulk
    const runBulk = async (
        action: "move" | "setActive" | "delete",
        ids: string[],
        payload?: Record<string, unknown>
    ) => {
        const res = await fetch("/api/photos/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, ids, payload }),
        })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data.error || "Erreur lors de l'opération")
        }
        return res.json()
    }

    const handleBulkSetActive = async (isActive: boolean) => {
        if (selectedIds.length === 0) return
        try {
            setBulkBusy(true)
            await runBulk("setActive", selectedIds, { is_active: isActive })
            toast.success(`${selectedIds.length} photo(s) ${isActive ? "affichée(s)" : "masquée(s)"}`)
            exitSelectionMode()
            loadPhotos()
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Erreur")
        } finally {
            setBulkBusy(false)
        }
    }

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return
        try {
            setBulkBusy(true)
            await runBulk("delete", selectedIds)
            toast.success(`${selectedIds.length} photo(s) supprimée(s)`)
            setIsBulkDeleteOpen(false)
            exitSelectionMode()
            loadPhotos()
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Erreur")
        } finally {
            setBulkBusy(false)
        }
    }

    const openBulkMove = () => {
        setBulkMoveTarget("")
        setBulkMoveIsNew(false)
        setBulkMoveNewName("")
        setIsBulkMoveOpen(true)
    }

    const handleBulkMove = async () => {
        if (selectedIds.length === 0) return
        const target = bulkMoveIsNew ? bulkMoveNewName.trim() : bulkMoveTarget
        if (!target) {
            toast.error("Choisissez ou nommez un album de destination")
            return
        }
        try {
            setBulkBusy(true)
            await runBulk("move", selectedIds, { description: target })
            toast.success(`${selectedIds.length} photo(s) déplacée(s) vers « ${target} »`)
            setIsBulkMoveOpen(false)
            exitSelectionMode()
            loadPhotos()
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Erreur")
        } finally {
            setBulkBusy(false)
        }
    }

    const openDeleteAlbum = (albumName: string) => {
        setAlbumToDelete(albumName)
        setIsDeleteAlbumOpen(true)
    }

    const handleDeleteAlbum = async () => {
        if (!albumToDelete) return
        const ids = photos.filter(p => p.description === albumToDelete).map(p => p.id)
        if (ids.length === 0) {
            setIsDeleteAlbumOpen(false)
            return
        }
        try {
            setBulkBusy(true)
            await runBulk("delete", ids)
            toast.success(`Album « ${albumToDelete} » supprimé (${ids.length} photo(s))`)
            setIsDeleteAlbumOpen(false)
            if (selectedAlbum === albumToDelete) setSelectedAlbum(null)
            setAlbumToDelete(null)
            loadPhotos()
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Erreur")
        } finally {
            setBulkBusy(false)
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // EDIT & RENAME LOGIC
    // ─────────────────────────────────────────────────────────────────────────

    const openEditDialog = (photo: Photo) => {
        setEditingPhoto({ ...photo })
        setEditIsNewAlbum(false)
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
                    year: editingPhoto.year,
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
        const ids = albumPhotos.map(p => p.id)

        try {
            await runBulk("move", ids, {
                description: newAlbumName.trim(),
                details: newAlbumDetails,
            })

            // Update local state
            setPhotos(prev => prev.map(p => p.description === selectedAlbum ? { ...p, description: newAlbumName.trim(), details: newAlbumDetails } : p))
            setSelectedAlbum(newAlbumName.trim()) // Switch view to new name
            toast.success(`Album renommé (${ids.length} photo(s) mise(s) à jour)`)
            setIsRenameAlbumDialogOpen(false)
        } catch (error) {
            console.error("Error renaming album:", error)
            toast.error(error instanceof Error ? error.message : "Erreur lors du renommage de l'album")
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
        if (filterYear && photo.year !== filterYear) {
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

    // Use albumOrder as the source of truth for album display order
    // This gives admin control instead of adapting to database order

    // "Album list" view = stacked album cards (no individual-photo selection here)
    const isAlbumListView = activeSection === 'phototheque' && !selectedAlbum && !searchTerm && !filterYear && !filterMonth && filterStatus === 'all'

    return (
        <div className="space-y-6">
            {/* HEADER & SECTION TABS */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm md:flex-row md:items-center">
                <div>
                    <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-950">
                        <Camera className="h-5 w-5 text-odillon-teal" />
                        Médiathèque
                    </h2>
                    <p className="text-sm text-slate-500">Gérez les images du carrousel et de la photothèque</p>
                </div>

                <div className="flex rounded-lg border border-slate-200 bg-slate-100/70 p-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-md transition-all ${activeSection === 'hero' ? 'bg-white text-odillon-teal shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        onClick={() => setActiveSection('hero')}
                    >
                        <Camera className="w-4 h-4 mr-2" />
                        Carrousel
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-md transition-all ${activeSection === 'phototheque' ? 'bg-white text-odillon-teal shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        onClick={() => setActiveSection('phototheque')}
                    >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Photothèque
                    </Button>
                </div>
            </div>

            {/* MAIN CONTENT CARD */}
            <Card className="overflow-hidden border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200/80 bg-white py-4">
                    <div className="flex items-center gap-2">
                        {activeSection === 'phototheque' && selectedAlbum && (
                            <Button variant="ghost" size="icon" onClick={() => setSelectedAlbum(null)} className="mr-2">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        )}
                        <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">
                            {activeSection === 'hero'
                                ? "Photos du Carrousel"
                                : selectedAlbum
                                    ? (
                                        <div className="flex items-center gap-2">
                                            <span>Album : {selectedAlbum}</span>
                                            <Button variant="ghost" size="icon" onClick={openRenameAlbumDialog} className="ml-1 h-6 w-6 text-slate-400 hover:text-odillon-teal" title="Renommer l'album">
                                                <FolderEdit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => openDeleteAlbum(selectedAlbum)} className="h-6 w-6 text-slate-400 hover:text-red-500" title="Supprimer l'album">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )
                                    : "Albums de la Photothèque"}
                        </CardTitle>
                        <Badge variant="secondary" className="border border-slate-200 bg-slate-50 text-xs font-normal text-slate-600 shadow-none">
                            {activeSection === 'hero' || selectedAlbum ? filteredPhotos.length : albumOrder.length}
                        </Badge>
                    </div>

                    {/* ADD PHOTO BUTTON (SHEET TRIGGER) */}
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button className="bg-odillon-teal text-white shadow-sm transition-colors hover:bg-odillon-teal/90">
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter des photos
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto w-full sm:max-w-md bg-white">
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
                                        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${isDragging
                                            ? "border-odillon-teal bg-odillon-teal/[0.06]"
                                            : "border-slate-200 hover:bg-slate-50"
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
                                            <div className="rounded-md bg-odillon-teal/[0.07] p-3">
                                                <UploadCloud className="h-6 w-6 text-odillon-teal" />
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
                                                <div key={idx} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2 text-sm">
                                                    <span className="max-w-[200px] truncate text-slate-700">{file.name}</span>
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

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description détaillée (Optionnel)</label>
                                    <Textarea
                                        placeholder="Ajoutez une description plus détaillée..."
                                        value={newPhoto.details}
                                        onChange={(e) => setNewPhoto({ ...newPhoto, details: e.target.value })}
                                        className="resize-none"
                                        rows={3}
                                    />
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

                                {activeSection === 'phototheque' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Année *</label>
                                            <Select
                                                value={newPhoto.year?.toString() || ""}
                                                onValueChange={(val) => setNewPhoto({ ...newPhoto, year: parseInt(val) })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choisir" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {years.map((y) => (
                                                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Mois (Optionnel)</label>
                                            <Select
                                                value={newPhoto.month?.toString() || "none"}
                                                onValueChange={(val) => setNewPhoto({ ...newPhoto, month: val === "none" ? null : parseInt(val) })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choisir" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Aucun</SelectItem>
                                                    {months.map((m, i) => (
                                                        <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {activeSection === 'hero' && (
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
                                    )}
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
                    <div className="flex flex-wrap gap-3 border-b border-slate-200/80 bg-white p-4">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-slate-200 bg-slate-50/80 pl-9 shadow-none focus-visible:ring-odillon-teal"
                            />
                        </div>

                        {activeSection === 'phototheque' && (
                            <Select value={filterYear?.toString() || "all"} onValueChange={(val) => setFilterYear(val === "all" ? null : parseInt(val))}>
                                <SelectTrigger className="w-[120px] border-slate-200 bg-slate-50/80">
                                    <SelectValue placeholder="Année" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les années</SelectItem>
                                    {years.map((y) => (
                                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        <Select value={filterMonth?.toString() || "all"} onValueChange={(val) => setFilterMonth(val === "all" ? null : parseInt(val))}>
                            <SelectTrigger className="w-[140px] border-slate-200 bg-slate-50/80">
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
                            <SelectTrigger className="w-[140px] border-slate-200 bg-slate-50/80">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value="active">Actives</SelectItem>
                                <SelectItem value="inactive">Masquées</SelectItem>
                            </SelectContent>
                        </Select>

                        {(searchTerm || filterYear || filterMonth || filterStatus !== 'all') && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setSearchTerm("")
                                    setFilterYear(null)
                                    setFilterMonth(null)
                                    setFilterStatus("all")
                                }}
                                title="Réinitialiser"
                            >
                                <RefreshCw className="w-4 h-4 text-gray-500" />
                            </Button>
                        )}

                        {!isAlbumListView && (
                            selectionMode ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={exitSelectionMode}
                                    className="border-slate-200"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Quitter la sélection
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectionMode(true)}
                                    className="border-slate-200"
                                >
                                    <ListChecks className="w-4 h-4 mr-2 text-odillon-teal" />
                                    Sélectionner
                                </Button>
                            )
                        )}
                    </div>

                    {/* BULK ACTION BAR */}
                    {selectionMode && !isAlbumListView && (
                        <div className="flex flex-wrap items-center gap-2 border-b border-odillon-teal/20 bg-odillon-teal/[0.06] px-4 py-3">
                            <button
                                type="button"
                                onClick={selectAllVisible}
                                className="text-sm font-medium text-odillon-teal hover:underline"
                            >
                                {filteredPhotos.length > 0 && filteredPhotos.every(p => selectedIds.includes(p.id))
                                    ? "Tout désélectionner"
                                    : "Tout sélectionner"}
                            </button>
                            <Badge variant="secondary" className="bg-white text-slate-700">
                                {selectedIds.length} sélectionnée(s)
                            </Badge>

                            <div className="ml-auto flex flex-wrap items-center gap-2">
                                <Button size="sm" variant="outline" disabled={selectedIds.length === 0 || bulkBusy} onClick={() => handleBulkSetActive(true)} className="border-slate-200 bg-white">
                                    <Eye className="w-4 h-4 mr-1.5" /> Afficher
                                </Button>
                                <Button size="sm" variant="outline" disabled={selectedIds.length === 0 || bulkBusy} onClick={() => handleBulkSetActive(false)} className="border-slate-200 bg-white">
                                    <EyeOff className="w-4 h-4 mr-1.5" /> Masquer
                                </Button>
                                <Button size="sm" variant="outline" disabled={selectedIds.length === 0 || bulkBusy} onClick={openBulkMove} className="border-slate-200 bg-white">
                                    <FolderInput className="w-4 h-4 mr-1.5" /> Déplacer
                                </Button>
                                <Button size="sm" variant="destructive" disabled={selectedIds.length === 0 || bulkBusy} onClick={() => setIsBulkDeleteOpen(true)}>
                                    <Trash2 className="w-4 h-4 mr-1.5" /> Supprimer
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* PHOTOS GRID */}
                    <div className="min-h-[400px] bg-[#f7f9f8] p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-odillon-teal mb-4" />
                                <p className="text-gray-500">Chargement de la galerie...</p>
                            </div>
                        ) : isAlbumListView ? (
                            // ALBUM VIEW (STACKED CARDS) - Only when no specific filters active (or discuss if filters should apply to albums)
                            // Let's apply filters to the grid view of albums if wanted, but simpler to just show albums.
                            // For now, let's assume if I filter, I might want to see individual photos, or I filter albums.
                            // Let's stick to the plan: Group photos by description. 
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={albumOrder}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                        {albumOrder.length === 0 ? (
                                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-md border border-slate-200 bg-white">
                                                    <ImageIcon className="h-10 w-10 text-slate-300" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900">Aucun album</h3>
                                                <p className="text-gray-500">Ajoutez des photos pour créer des albums.</p>
                                            </div>
                                        ) : (
                                            albumOrder.map((albumName) => {
                                                const albumPhotos = photos.filter(p => p.description === albumName);
                                                const coverPhoto = albumPhotos[0];
                                                if (!coverPhoto) return null;

                                                // Prepare cards data for stack
                                                const cardsData = albumPhotos.slice(0, 3).map((photo, i) => ({
                                                    image: photo.url,
                                                    title: i === 0 ? albumName : undefined,
                                                    description: i === 0 ? (coverPhoto.details ? `${coverPhoto.details} (${albumPhotos.length} photos)` : `${albumPhotos.length} photos`) : undefined
                                                }));

                                                return (
                                                    <SortablePhotoItem key={albumName} id={albumName}>
                                                            <div
                                                                className="relative w-full aspect-[7/8] max-w-[300px] mx-auto group perspective-1000 cursor-pointer"
                                                                onClick={() => setSelectedAlbum(albumName)}
                                                            >
                                                                <Button
                                                                    size="icon"
                                                                    variant="destructive"
                                                                    className="absolute top-2 right-2 z-30 h-8 w-8 rounded-full opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
                                                                    title="Supprimer l'album"
                                                                    onPointerDown={(e) => e.stopPropagation()}
                                                                    onClick={(e) => { e.stopPropagation(); openDeleteAlbum(albumName) }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                                <StackedCardsInteraction
                                                                    cards={cardsData}
                                                                    spreadDistance={15}
                                                                    rotationAngle={4}
                                                                />
                                                            </div>
                                                    </SortablePhotoItem>
                                                );
                                            })
                                        )}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        ) : (
                            // STANDARD GRID VIEW (Detail view or Hero or Filtered)
                            filteredPhotos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-md border border-slate-200 bg-white">
                                        <ImageIcon className="h-10 w-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">Aucune photo</h3>
                                    <p className="text-gray-500 max-w-sm mt-1">
                                        {searchTerm || filterYear || filterMonth
                                            ? "Aucun résultat pour vos filtres. Essayez de réinitialiser la recherche."
                                            : "Cette section est vide pour le moment. Ajoutez votre première photo !"}
                                    </p>
                                    {(searchTerm || filterYear || filterMonth) && (
                                        <Button variant="link" onClick={() => { setSearchTerm(""); setFilterYear(null); setFilterMonth(null); }} className="mt-2 text-odillon-teal">
                                            Effacer les filtres
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {filteredPhotos.map((photo) => {
                                        const isSelected = selectedIds.includes(photo.id)
                                        return (
                                        <div
                                            key={photo.id}
                                            className={`group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${isSelected ? 'border-odillon-teal ring-2 ring-odillon-teal' : 'border-slate-200/80 hover:border-odillon-teal/25'} ${!photo.is_active ? 'opacity-75 grayscale-[0.5]' : ''
                                                }`}
                                        >
                                            {/* Image Container */}
                                            <div
                                                className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-slate-100"
                                                onClick={() => selectionMode ? toggleSelected(photo.id) : setSelectedPhotoForPreview(photo)}
                                            >
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
                                                        <Badge className="border border-odillon-teal/20 bg-odillon-teal/90 px-2 text-[10px] text-white shadow-sm hover:bg-odillon-teal">Active</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="border border-slate-200 bg-slate-900/80 px-2 text-[10px] text-white shadow-sm">Masquée</Badge>
                                                    )}
                                                </div>

                                                {/* Selection Checkbox */}
                                                {selectionMode && (
                                                    <div className="absolute top-3 right-3 z-20">
                                                        <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm transition-colors ${isSelected ? 'border-odillon-teal bg-odillon-teal text-white' : 'border-white bg-white/80 text-transparent'}`}>
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Actions Overlay */}
                                                <div className={`absolute bottom-3 right-3 z-10 ${selectionMode ? 'hidden' : 'opacity-0 group-hover:opacity-100'} transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex gap-2`}>
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="h-8 w-8 rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white hover:text-odillon-teal"
                                                        onClick={(e) => { e.stopPropagation(); openEditDialog(photo) }}
                                                        title="Modifier"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>

                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="h-8 w-8 rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white hover:text-odillon-teal"
                                                        onClick={(e) => { e.stopPropagation(); togglePhotoActive(photo.id) }}
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
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
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
                                                <p className="mb-1 truncate text-sm font-medium text-slate-900" title={photo.description}>
                                                    {photo.description}
                                                </p>

                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {(photo.month || photo.year) && (
                                                        <Badge variant="outline" className="h-5 border-slate-200 bg-slate-50 py-0 text-[10px] font-normal text-slate-600">
                                                            <CalendarDays className="w-3 h-3 mr-1 text-odillon-teal" />
                                                            {photo.month ? `${months[photo.month - 1]} ${photo.year ?? ""}`.trim() : photo.year}
                                                        </Badge>
                                                    )}
                                                    {photo.theme_id && (
                                                        <Badge variant="outline" className="h-5 border-slate-200 bg-slate-50 py-0 text-[10px] font-normal text-slate-600">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-odillon-lime mr-1"></span>
                                                            {MONTHLY_THEMES.find(t => t.id === photo.theme_id)?.name || "Thème"}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    })}
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
                                <Label htmlFor="edit-desc">{activeSection === 'phototheque' ? "Album" : "Titre / Description"}</Label>
                                {activeSection === 'phototheque' ? (
                                    editIsNewAlbum ? (
                                        <div className="flex gap-2">
                                            <Input
                                                id="edit-desc"
                                                autoFocus
                                                placeholder="Nom du nouvel album"
                                                value={editingPhoto.description}
                                                onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                                            />
                                            <Button variant="ghost" size="icon" onClick={() => setEditIsNewAlbum(false)} title="Annuler">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Select
                                            value={editingPhoto.description}
                                            onValueChange={(val) => {
                                                if (val === '__new__') {
                                                    setEditIsNewAlbum(true)
                                                    setEditingPhoto({ ...editingPhoto, description: '' })
                                                } else {
                                                    setEditingPhoto({ ...editingPhoto, description: val })
                                                }
                                            }}
                                        >
                                            <SelectTrigger id="edit-desc">
                                                <SelectValue placeholder="Choisir un album" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {albumOrder.map((name) => (
                                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                                ))}
                                                <SelectItem value="__new__">➕ Nouvel album…</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )
                                ) : (
                                    <Input
                                        id="edit-desc"
                                        value={editingPhoto.description}
                                        onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                                    />
                                )}
                                {activeSection === 'phototheque' && (
                                    <p className="text-[10px] text-gray-500">Choisir un autre album déplacera la photo. « Nouvel album » crée un album.</p>
                                )}
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

                            {activeSection === 'phototheque' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Année</Label>
                                        <Select
                                            value={editingPhoto.year?.toString() || "none"}
                                            onValueChange={(val) => setEditingPhoto({ ...editingPhoto, year: val === "none" ? null : parseInt(val) })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Année" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Aucune</SelectItem>
                                                {years.map((y) => (
                                                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mois</Label>
                                        <Select
                                            value={editingPhoto.month?.toString() || "none"}
                                            onValueChange={(val) => setEditingPhoto({ ...editingPhoto, month: val === "none" ? null : parseInt(val) })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Mois" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Aucun</SelectItem>
                                                {months.map((m, i) => (
                                                    <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'hero' && (
                                <div className="space-y-2">
                                    <Label>Mois</Label>
                                    <Select
                                        value={editingPhoto.month?.toString() || "none"}
                                        onValueChange={(val) => setEditingPhoto({ ...editingPhoto, month: val === "none" ? null : parseInt(val) })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Mois" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucun</SelectItem>
                                            {months.map((m, i) => (
                                                <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

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

            {/* BULK MOVE DIALOG */}
            <Dialog open={isBulkMoveOpen} onOpenChange={setIsBulkMoveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Déplacer vers un album</DialogTitle>
                        <DialogDescription>
                            {selectedIds.length} photo(s) seront déplacée(s) vers l'album choisi.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {bulkMoveIsNew ? (
                            <div className="space-y-2">
                                <Label htmlFor="bulk-new-album">Nom du nouvel album</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="bulk-new-album"
                                        autoFocus
                                        placeholder="Ex: Séminaire annuel 2025"
                                        value={bulkMoveNewName}
                                        onChange={(e) => setBulkMoveNewName(e.target.value)}
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => setBulkMoveIsNew(false)} title="Albums existants">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label>Album de destination</Label>
                                <Select
                                    value={bulkMoveTarget}
                                    onValueChange={(val) => {
                                        if (val === '__new__') {
                                            setBulkMoveIsNew(true)
                                        } else {
                                            setBulkMoveTarget(val)
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir un album" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {albumOrder.map((name) => (
                                            <SelectItem key={name} value={name}>{name}</SelectItem>
                                        ))}
                                        <SelectItem value="__new__">➕ Nouvel album…</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBulkMoveOpen(false)}>Annuler</Button>
                        <Button onClick={handleBulkMove} disabled={bulkBusy} className="bg-odillon-teal">
                            {bulkBusy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FolderInput className="w-4 h-4 mr-2" />}
                            Déplacer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* BULK DELETE CONFIRM */}
            <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer {selectedIds.length} photo(s) ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Les photos sélectionnées seront supprimées définitivement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={bulkBusy}>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => { e.preventDefault(); handleBulkDelete() }} disabled={bulkBusy} className="bg-red-600 hover:bg-red-700">
                            {bulkBusy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* DELETE ALBUM CONFIRM */}
            <AlertDialog open={isDeleteAlbumOpen} onOpenChange={setIsDeleteAlbumOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer l'album « {albumToDelete} » ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {albumToDelete
                                ? `Cette action supprimera définitivement les ${photos.filter(p => p.description === albumToDelete).length} photo(s) de cet album. Action irréversible.`
                                : ""}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={bulkBusy}>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDeleteAlbum() }} disabled={bulkBusy} className="bg-red-600 hover:bg-red-700">
                            {bulkBusy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Supprimer l'album
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* PHOTO PREVIEW LIGHTBOX */}
            <AnimatePresence>
                {selectedPhotoForPreview && (
                    <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-8">
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 z-[100002] text-white/80 hover:text-white hover:bg-white/10 rounded-full w-12 h-12 flex items-center justify-center transition-all"
                            onClick={() => setSelectedPhotoForPreview(null)}
                            type="button"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Centered Content */}
                        <m.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="relative max-w-7xl w-full max-h-full flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Image */}
                            <div className="relative flex-1 flex items-center justify-center mb-6">
                                <img
                                    src={selectedPhotoForPreview.url}
                                    alt={selectedPhotoForPreview.description}
                                    className="max-h-[calc(100vh-250px)] max-w-full object-contain rounded-lg shadow-2xl"
                                    draggable={false}
                                />
                            </div>

                            {/* Info Card */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-lg p-6 border border-white/20">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-white font-bold text-xl">{selectedPhotoForPreview.description}</h3>
                                            <Badge
                                                variant={selectedPhotoForPreview.is_active ? "default" : "secondary"}
                                                className={selectedPhotoForPreview.is_active ? "bg-odillon-teal/90 hover:bg-odillon-teal" : "bg-white/15 text-white hover:bg-white/20"}
                                            >
                                                {selectedPhotoForPreview.is_active ? "Active" : "Masquée"}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                                            {selectedPhotoForPreview.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{selectedPhotoForPreview.location}</span>
                                                </div>
                                            )}
                                            {(selectedPhotoForPreview.month || selectedPhotoForPreview.year) && (
                                                <div className="flex items-center gap-2">
                                                    <CalendarDays className="w-4 h-4" />
                                                    <span>
                                                        {selectedPhotoForPreview.month
                                                            ? `${["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"][selectedPhotoForPreview.month - 1]} ${selectedPhotoForPreview.year ?? ""}`.trim()
                                                            : selectedPhotoForPreview.year}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedPhotoForPreview.activity_type && (
                                                <Badge variant="outline" className="text-white/80 border-white/30">
                                                    {selectedPhotoForPreview.activity_type}
                                                </Badge>
                                            )}
                                        </div>

                                        {selectedPhotoForPreview.details && (
                                            <p className="text-white/80 text-sm leading-relaxed">
                                                {selectedPhotoForPreview.details}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </m.div>

                        {/* Background Overlay Click to Close */}
                        <div
                            className="absolute inset-0 -z-10"
                            onClick={() => setSelectedPhotoForPreview(null)}
                        />
                    </div>
                )}
            </AnimatePresence>

        </div >
    )
}
