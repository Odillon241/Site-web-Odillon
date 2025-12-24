"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { Loader2, Plus, Trash2, Eye, EyeOff, Upload, Quote, X, Pencil } from "lucide-react"
import { toast } from "sonner"
import { ImageCropper } from "../ImageCropper"
import { Testimonial } from "@/types/admin"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
function SortableTestimonialCard({ testimonial, handleEdit, toggleActive, deleteTestimonial }: {
    testimonial: Testimonial,
    handleEdit: (t: Testimonial) => void,
    toggleActive: (id: string) => void,
    deleteTestimonial: (id: string) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: testimonial.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="group hover:shadow-md transition-shadow border-gray-100 h-full cursor-grab active:cursor-grabbing flex flex-col">
                <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100">
                            {testimonial.avatar_url ? (
                                <img
                                    src={testimonial.avatar_url}
                                    alt={testimonial.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-bold text-lg">
                                    {testimonial.name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 truncate">{testimonial.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{testimonial.position}</p>

                            <div className="flex flex-wrap gap-1 mt-1">
                                {testimonial.is_active ? (
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-sm text-[10px] px-1.5 py-0.5">Actif</Badge>
                                ) : (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Inactif</Badge>
                                )}
                                {testimonial.page && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-100">
                                        {testimonial.page}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative pl-6 flex-1">
                        <Quote className="absolute left-0 top-0 w-4 h-4 text-orange-200" />
                        <p className="text-sm text-gray-600 line-clamp-4 italic">
                            "{testimonial.quote}"
                        </p>
                    </div>

                    <div className="flex gap-2 pt-4 mt-4 border-t border-gray-50" onPointerDown={(e) => e.stopPropagation()}>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(testimonial)}
                            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleActive(testimonial.id)}
                            className="flex-1 h-8 text-xs"
                        >
                            {testimonial.is_active ? (
                                <><EyeOff className="w-3 h-3 mr-2" /> Masquer</>
                            ) : (
                                <><Eye className="w-3 h-3 mr-2" /> Afficher</>
                            )}
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Supprimer ce témoignage ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Cette action est irréversible.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteTestimonial(testimonial.id)} className="bg-red-600 hover:bg-red-700">
                                        Supprimer
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function TestimonialsTab() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const [newItem, setNewItem] = useState<{
        name: string
        position: string
        quote: string
        avatar_url: string
        page: string
        section: string
    }>({
        name: "",
        position: "",
        quote: "",
        avatar_url: "",
        page: "",
        section: ""
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadTestimonials()
    }, [])

    const loadTestimonials = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/testimonials')
            if (!res.ok) throw new Error("Erreur lors du chargement")

            const data = await res.json()
            setTestimonials((data.testimonials || []).sort((a: Testimonial, b: Testimonial) => a.display_order - b.display_order))
        } catch (error: unknown) {
            console.error("Erreur témoignages:", error)
            toast.error("Impossible de charger les témoignages")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setNewItem({
            name: "",
            position: "",
            quote: "",
            avatar_url: "",
            page: "",
            section: ""
        })
        setEditingItem(null)
        setCropImageSrc(null)
    }

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.addEventListener("load", () => {
                setCropImageSrc(reader.result?.toString() || null)
            })
            reader.readAsDataURL(file)
            e.target.value = ''
        }
    }

    const onCropComplete = async (croppedBlob: Blob) => {
        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('file', croppedBlob, 'avatar.jpg')

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error("Upload failed")

            const data = await res.json()
            setNewItem(prev => ({ ...prev, avatar_url: data.url }))
            setCropImageSrc(null)
            toast.success("Photo téléchargée avec succès")
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Erreur lors de l'upload de la photo")
        } finally {
            setIsUploading(false)
        }
    }

    const handleSave = async () => {
        if (!newItem.name.trim() || !newItem.quote.trim()) {
            toast.error("Le nom et le témoignage sont obligatoires")
            return
        }

        try {
            const isEditing = !!editingItem
            const url = isEditing ? `/api/testimonials/${editingItem.id}` : '/api/testimonials'
            const method = isEditing ? 'PATCH' : 'POST'

            const body = {
                ...newItem,
                page: newItem.page || null,
                section: newItem.section || null,
                display_order: isEditing ? editingItem.display_order : testimonials.length,
                is_active: isEditing ? editingItem.is_active : true
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!res.ok) throw new Error("Erreur lors de l'enregistrement")

            toast.success(isEditing ? "Témoignage modifié" : "Témoignage ajouté")
            resetForm()
            setIsDialogOpen(false)
            loadTestimonials()
        } catch (error: unknown) {
            console.error("Erreur save:", error)
            toast.error("Erreur lors de l'enregistrement")
        }
    }

    const handleEdit = (item: Testimonial) => {
        setEditingItem(item)
        setNewItem({
            name: item.name,
            position: item.position,
            quote: item.quote,
            avatar_url: item.avatar_url || "",
            page: item.page || "",
            section: item.section || ""
        })
        setIsDialogOpen(true)
    }

    const toggleActive = async (id: string) => {
        try {
            const item = testimonials.find(t => t.id === id)
            if (!item) return

            const res = await fetch(`/api/testimonials/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !item.is_active })
            })

            if (!res.ok) throw new Error("Erreur")

            setTestimonials(testimonials.map(t =>
                t.id === id ? { ...t, is_active: !t.is_active } : t
            ))
            toast.success(item.is_active ? "Témoignage masqué" : "Témoignage visible")
        } catch (error: unknown) {
            console.error("Erreur update status:", error)
            toast.error("Impossible de modifier le statut")
        }
    }

    const deleteTestimonial = async (id: string) => {
        try {
            const res = await fetch(`/api/testimonials/${id}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error("Erreur lors de la suppression")

            toast.success("Témoignage supprimé")
            loadTestimonials()
        } catch (error: unknown) {
            console.error("Erreur suppression:", error)
            toast.error("Impossible de supprimer")
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setTestimonials((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over?.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    display_order: index
                }));

                fetch('/api/testimonials/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: updates })
                }).catch(err => {
                    console.error("Failed to save order", err);
                    toast.error("Erreur lors de la sauvegarde de l'ordre");
                    loadTestimonials();
                });

                return newItems;
            });
        }
    }

    return (
        <Card className="shadow-lg border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-orange-900">
                        <Quote className="w-5 h-5" />
                        Gestion des Témoignages
                    </CardTitle>
                    <Badge variant="secondary" className="bg-white border text-orange-700 shadow-sm">
                        {testimonials.length}
                    </Badge>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    if (!open) resetForm()
                    setIsDialogOpen(open)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter un témoignage
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Modifier le témoignage" : "Nouveau Témoignage"}</DialogTitle>
                            <DialogDescription>
                                Ajoutez un témoignage client qui apparaîtra sur le site.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nom du client *</label>
                                    <Input
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        placeholder="ex: Sophie Martin"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Poste / Entreprise</label>
                                    <Input
                                        value={newItem.position}
                                        onChange={(e) => setNewItem({ ...newItem, position: e.target.value })}
                                        placeholder="ex: CEO, TechSolutions"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Page (Optionnel)</label>
                                    <Select
                                        value={newItem.page}
                                        onValueChange={(value) => setNewItem({ ...newItem, page: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucune</SelectItem>
                                            <SelectItem value="Accueil">Accueil</SelectItem>
                                            <SelectItem value="A Propos">À Propos</SelectItem>
                                            <SelectItem value="Expertise">Expertise</SelectItem>
                                            <SelectItem value="Services">Services</SelectItem>
                                            <SelectItem value="Photothèque">Photothèque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Section (Optionnel)</label>
                                    <Select
                                        value={newItem.section}
                                        onValueChange={(value) => setNewItem({ ...newItem, section: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucune</SelectItem>
                                            <SelectItem value="Hero">Hero (Haut de page)</SelectItem>
                                            <SelectItem value="Contenu">Contenu Principal</SelectItem>
                                            <SelectItem value="Sidebar">Barre Latérale</SelectItem>
                                            <SelectItem value="Footer">Pied de page</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Témoignage *</label>
                                <Textarea
                                    value={newItem.quote}
                                    onChange={(e) => setNewItem({ ...newItem, quote: e.target.value })}
                                    placeholder="Ce client est formidable..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Photo / Avatar</label>
                                <div className="space-y-3">
                                    {newItem.avatar_url && (
                                        <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 group mx-auto">
                                            <img
                                                src={newItem.avatar_url}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => setNewItem(prev => ({ ...prev, avatar_url: "" }))}
                                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-6 h-6 text-white" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="URL de la photo..."
                                            value={newItem.avatar_url}
                                            onChange={(e) => setNewItem({ ...newItem, avatar_url: e.target.value })}
                                            className="flex-1"
                                        />
                                        <div className="relative">
                                            <Input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={onFileSelect}
                                                accept="image/png,image/jpeg,image/webp"
                                                disabled={isUploading}
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="shrink-0 pointer-events-none"
                                                disabled={isUploading}
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Upload className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white">
                                {editingItem ? "Enregistrer" : "Créer"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            {cropImageSrc && (
                <ImageCropper
                    imageSrc={cropImageSrc}
                    aspect={1}
                    onCropComplete={onCropComplete}
                    onClose={() => setCropImageSrc(null)}
                />
            )}

            <CardContent className="pt-6 min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center py-12 bg-orange-50/50 rounded-lg border border-dashed border-orange-200">
                        <Quote className="w-12 h-12 text-orange-200 mx-auto mb-2" />
                        <p className="text-orange-800 font-medium">Aucun témoignage</p>
                        <p className="text-sm text-orange-600/70">Commencez par ajouter votre premier client satisfait.</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={testimonials.map(t => t.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {testimonials.map((testimonial) => (
                                    <SortableTestimonialCard
                                        key={testimonial.id}
                                        testimonial={testimonial}
                                        handleEdit={handleEdit}
                                        toggleActive={toggleActive}
                                        deleteTestimonial={deleteTestimonial}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </CardContent>
        </Card>
    )
}
