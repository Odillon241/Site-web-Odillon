"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Save, X, Video as VideoIcon, GripVertical, ExternalLink, Pencil, UploadCloud, FileVideo, Loader2 } from "lucide-react"
import { Video } from "@/types/admin"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
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
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableVideoCardProps {
    video: Video;
    onEdit: (video: Video) => void;
    onDelete: (id: string) => void;
}

function SortableVideoCard({ video, onEdit, onDelete }: SortableVideoCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: video.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card ref={setNodeRef} style={style} className={`group relative overflow-hidden transition-all hover:shadow-md border-purple-100/50 bg-white/50 backdrop-blur-sm ${isDragging ? 'shadow-xl ring-2 ring-purple-500/20' : ''}`}>
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-purple-50"
            >
                <GripVertical className="h-4 w-4 text-purple-300" />
            </div>

            <CardContent className="p-4 pl-10">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Thumbnail / Preview */}
                    <div className="md:w-48 aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative group/thumb">
                        {video.thumbnail ? (
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <VideoIcon className="w-8 h-8 mb-2" />
                                <span className="text-xs">Aucun aperçu</span>
                            </div>
                        )}
                        <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="text-white w-6 h-6" />
                        </a>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                    <h3 className="font-semibold text-purple-900 line-clamp-1">{video.title}</h3>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <Badge variant="outline" className="text-xs border-purple-200 text-purple-700 bg-purple-50">
                                            {video.category === 'presentation' ? 'Présentation' : 'Témoignage'}
                                        </Badge>
                                        {video.page && (
                                            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border border-blue-100">
                                                Page: {video.page}
                                            </Badge>
                                        )}
                                        {video.section && (
                                            <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                Section: {video.section}
                                            </Badge>
                                        )}
                                        <Badge variant={video.is_active ? "default" : "secondary"} className={video.is_active ? "bg-green-500 hover:bg-green-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}>
                                            {video.is_active ? "Actif" : "Inactif"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            {video.description && (
                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                    {video.description}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 mt-auto" onPointerDown={(e) => e.stopPropagation()}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(video)}
                                className="h-8 text-purple-700 hover:text-purple-900 border-purple-200 hover:bg-purple-50"
                            >
                                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                Modifier
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(video.id)}
                                className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                Supprimer
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function VideosTab() {
    const [videos, setVideos] = useState<Video[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [videoToDelete, setVideoToDelete] = useState<string | null>(null)
    const [editingVideo, setEditingVideo] = useState<Video | null>(null)

    // Form states
    const [isUploading, setIsUploading] = useState(false)
    const [formData, setFormData] = useState<{
        title: string
        url: string
        description: string
        category: "presentation" | "testimonial"
        type: "youtube" | "vimeo" | "direct"
        is_active: boolean
        page: string
        section: string
        source: "url" | "file"
    }>({
        title: "",
        url: "",
        description: "",
        category: "presentation",
        type: "youtube",
        is_active: true,
        page: "",
        section: "",
        source: "url"
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadVideos()
    }, [])

    useEffect(() => {
        if (!isAddDialogOpen) {
            resetForm();
        }
    }, [isAddDialogOpen]);

    const loadVideos = async () => {
        try {
            const response = await fetch('/api/videos')
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            setVideos(data.videos || [])
        } catch (error) {
            console.error('Erreur chargement vidéos:', error)
            toast.error("Impossible de charger les vidéos")
        } finally {
            setIsLoading(false)
        }
    }

    const detectVideoType = (url: string): 'youtube' | 'vimeo' | 'direct' => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
        if (url.includes('vimeo.com')) return 'vimeo';
        return 'direct';
    }

    // Helper to extract YouTube thumbnail
    const getYouTubeThumbnail = (url: string) => {
        let videoId = null;
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1];
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
                videoId = videoId.substring(0, ampersandPosition);
            }
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
        }

        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }
        return null;
    }


    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validation client-side
        const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
        if (!allowedTypes.includes(file.type)) {
            toast.error("Format non supporté. Utilisez MP4, WebM ou MOV")
            return
        }

        if (file.size > 50 * 1024 * 1024) {
            toast.error("Fichier trop volumineux. Max 50MB")
            return
        }

        setIsUploading(true)
        const supabase = createClient()

        try {
            const timestamp = Date.now()
            const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

            const { data, error } = await supabase.storage
                .from('videos')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(data.path)

            setFormData(prev => ({
                ...prev,
                url: publicUrl,
                type: 'direct',
                title: prev.title || file.name.replace(/\.[^/.]+$/, "")
            }))
            toast.success("Vidéo uploadée avec succès")
        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error instanceof Error ? error.message : "Erreur lors de l'upload")
        } finally {
            setIsUploading(false)
        }
    }

    // Reset form helper
    const resetForm = () => {
        setFormData({
            title: "",
            url: "",
            description: "",
            category: "presentation",
            type: "youtube",
            is_active: true,
            page: "",
            section: "",
            source: "url"
        });
        setEditingVideo(null);
    }

    const handleSaveVideo = async () => {
        try {
            const type = detectVideoType(formData.url);
            let thumbnail = null;

            if (type === 'youtube') {
                thumbnail = getYouTubeThumbnail(formData.url);
            }

            // Exclude 'source' from payload as it's UI state only
            const { source, ...videoData } = formData;

            const payload = {
                ...videoData,
                type,
                thumbnail,
                // Convert empty strings to null for optional fields
                page: formData.page || null,
                section: formData.section || null
            };

            const isEditing = !!editingVideo;
            const url = isEditing ? `/api/videos/${editingVideo.id}` : '/api/videos';
            const method = isEditing ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (data.error) throw new Error(data.error)

            toast.success(isEditing ? "Vidéo mise à jour" : "Vidéo ajoutée avec succès")
            setIsAddDialogOpen(false)
            loadVideos()
        } catch (error) {
            console.error('Erreur sauvegarde:', error)
            toast.error(error instanceof Error ? error.message : "Erreur lors de la sauvegarde")
        }
    }

    const handleDeleteVideo = async () => {
        if (!videoToDelete) return

        try {
            const response = await fetch(`/api/videos/${videoToDelete}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Erreur suppression')

            setVideos(videos.filter(v => v.id !== videoToDelete))
            toast.success("Vidéo supprimée")
        } catch (error) {
            console.error('Erreur suppression:', error)
            toast.error("Impossible de supprimer la vidéo")
        } finally {
            setVideoToDelete(null)
        }
    }

    const handleEdit = (video: Video) => {
        setEditingVideo(video);
        setFormData({
            title: video.title,
            url: video.url,
            description: video.description || "",
            category: video.category,
            type: video.type,
            is_active: video.is_active,
            page: video.page || "",
            section: video.section || "",
            source: video.type === 'direct' ? 'file' : 'url'
        });
        setIsAddDialogOpen(true);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setVideos((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update order in backend
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    display_order: index
                }));

                fetch('/api/videos/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: updates })
                }).catch(err => {
                    console.error("Failed to reorder:", err);
                    toast.error("Erreur lors de la réorganisation");
                    // Optionally revert state here
                });

                return newItems;
            });
        }
    };

    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Card className="shadow-lg border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-purple-900">
                            <VideoIcon className="w-5 h-5" />
                            Gestion des Vidéos
                            <Badge variant="secondary" className="ml-2 bg-white/50">
                                {videos.length} vidéos
                            </Badge>
                        </CardTitle>
                        <CardDescription className="text-purple-600 mt-1">
                            Gérez les vidéos de présentation et témoignages
                        </CardDescription>
                    </div>
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all hover:scale-105"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une vidéo
                    </Button>
                </div>

                <div className="mt-4 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                    <Input
                        placeholder="Rechercher une vidéo..."
                        className="pl-9 border-purple-200 bg-white/50 focus:bg-white transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="pt-6 bg-slate-50/50 min-h-[400px]">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={filteredVideos.map(v => v.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-1 gap-4">
                            {filteredVideos.map((video) => (
                                <SortableVideoCard
                                    key={video.id}
                                    video={video}
                                    onEdit={handleEdit}
                                    onDelete={setVideoToDelete}
                                />
                            ))}

                            {!isLoading && filteredVideos.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-purple-200">
                                    <VideoIcon className="w-12 h-12 text-purple-200 mx-auto mb-3" />
                                    <h3 className="text-purple-900 font-medium">Aucune vidéo trouvée</h3>
                                    <p className="text-purple-500 text-sm mt-1">
                                        Commencez par ajouter une nouvelle vidéo
                                    </p>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </CardContent>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingVideo ? 'Modifier la vidéo' : 'Ajouter une vidéo'}</DialogTitle>
                        <DialogDescription>
                            {editingVideo ? 'Modifiez les informations de la vidéo.' : 'Ajoutez une nouvelle vidéo à votre collection.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Titre *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Titre de la vidéo"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Source de la vidéo</Label>
                            <Tabs value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v as "url" | "file" })}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="url">Lien Externe (YouTube/Vimeo)</TabsTrigger>
                                    <TabsTrigger value="file">Fichier (Upload)</TabsTrigger>
                                </TabsList>
                                <TabsContent value="url" className="mt-4">
                                    <Label htmlFor="url">URL de la vidéo *</Label>
                                    <Input
                                        id="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value, type: detectVideoType(e.target.value) })}
                                        placeholder="https://youtube.com/..."
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Collez un lien YouTube ou Vimeo.</p>
                                </TabsContent>
                                <TabsContent value="file" className="mt-4">
                                    <div className="flex flex-col gap-3">
                                        <Label>Fichier Vidéo (MP4, WebM)</Label>

                                        {formData.url && formData.type === 'direct' ? (
                                            <div className="flex items-center gap-3 p-3 border rounded-md bg-purple-50 border-purple-100">
                                                <div className="h-10 w-10 bg-purple-100 rounded flex items-center justify-center text-purple-600">
                                                    <FileVideo size={20} />
                                                </div>
                                                <div className="flex-1 overflow-hidden min-w-0">
                                                    <p className="text-sm font-medium truncate text-purple-900">Vidéo uploadée</p>
                                                    <p className="text-xs text-purple-500 truncate" title={formData.url}>
                                                        {formData.url.split('/').pop()}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setFormData({ ...formData, url: '', type: 'youtube' })}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer group text-center">
                                                <input
                                                    type="file"
                                                    accept="video/mp4,video/webm,video/quicktime"
                                                    onChange={handleFileUpload}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    disabled={isUploading}
                                                />
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    {isUploading ? (
                                                        <>
                                                            <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
                                                            <p className="text-sm text-purple-600 font-medium">Upload en cours...</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                                                <UploadCloud className="h-5 w-5 text-gray-500 group-hover:text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">Cliquez ou glissez une vidéo ici</p>
                                                                <p className="text-xs text-gray-500">MP4, WebM jusqu'à 50MB</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Page (Optionnel)</Label>
                                <Select
                                    value={formData.page}
                                    onValueChange={(value) => setFormData({ ...formData, page: value })}
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
                            <div className="grid gap-2">
                                <Label>Section (Optionnel)</Label>
                                <Select
                                    value={formData.section}
                                    onValueChange={(value) => setFormData({ ...formData, section: value })}
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

                        <div className="grid gap-2">
                            <Label>Catégorie</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value as "presentation" | "testimonial" })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="presentation">Présentation</SelectItem>
                                    <SelectItem value="testimonial">Témoignage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optionnel)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brève description..."
                            />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                            />
                            <Label htmlFor="is_active">Activer la vidéo (Visible sur le site)</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleSaveVideo} className="bg-purple-600 hover:bg-purple-700 text-white">
                            {editingVideo ? 'Enregistrer' : 'Ajouter'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. La vidéo sera définitivement supprimée.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteVideo} className="bg-red-600 hover:bg-red-700">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}
