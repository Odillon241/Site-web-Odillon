"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { BlurFade } from "@/components/magicui/blur-fade"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import {
    Loader2, Plus, Search, Trash2, Eye, EyeOff, Newspaper,
    Filter, RefreshCw, Edit, Save, Calendar, Clock, FileText, Upload, Image as ImageIcon
} from "lucide-react"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { BatchImportDialog } from "@/components/admin/batch-import-dialog"

interface Article {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    cover_image: string | null
    category: string
    author: string
    read_time: string
    is_published: boolean
    display_order: number
    published_at: string | null
    created_at: string
    updated_at: string
}

const CATEGORIES = [
    { value: "Gouvernance", label: "Gouvernance" },
    { value: "Juridique", label: "Juridique" },
    { value: "Finances", label: "Finances" },
    { value: "RH", label: "Ressources Humaines" },
    { value: "Risques", label: "Management des Risques" },
    { value: "Actualités", label: "Actualités" }
]

interface SiteSettings {
    show_blog_banner: boolean
    blog_banner_image_url: string | null
    blog_banner_link: string | null
}

export function ArticlesTab() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingArticle, setEditingArticle] = useState<Article | null>(null)
    const [settings, setSettings] = useState<SiteSettings | null>(null)
    const [uploadingBanner, setUploadingBanner] = useState(false)
    const [updatingSettings, setUpdatingSettings] = useState(false)

    // Filters
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState<string>("all")
    const [filterStatus, setFilterStatus] = useState<string>("all")

    // New Article Form
    const [newArticle, setNewArticle] = useState({
        title: "",
        excerpt: "",
        content: "",
        cover_image: "",
        category: "Actualités",
        author: "Odillon",
        read_time: "5 min",
        is_published: false,
        scheduled_at: "" as string
    })

    // Image upload
    const [uploadingImage, setUploadingImage] = useState(false)
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadArticles()
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/settings')
            if (!res.ok) throw new Error("Erreur settings")
            const data = await res.json()
            setSettings(data.settings)
        } catch (error) {
            console.error("Erreur chargement settings:", error)
        }
    }

    const loadArticles = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/articles')
            if (!res.ok) throw new Error("Erreur lors du chargement")
            const data = await res.json()
            setArticles(data.articles || [])
        } catch (error) {
            console.error("Erreur:", error)
            toast.error("Impossible de charger les articles")
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        if (!newArticle.title.trim() || !newArticle.excerpt.trim()) {
            toast.error("Veuillez remplir le titre et l'extrait")
            return
        }

        try {
            setSaving(true)

            let coverImageUrl = newArticle.cover_image

            // Upload image if selected
            if (selectedImageFile) {
                setUploadingImage(true)
                const formData = new FormData()
                formData.append("file", selectedImageFile)

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                })

                if (!uploadRes.ok) {
                    throw new Error("Erreur lors de l'upload de l'image")
                }

                const { url } = await uploadRes.json()
                coverImageUrl = url
                setUploadingImage(false)
            }

            // Build article data with scheduled publication
            const articleData = {
                ...newArticle,
                cover_image: coverImageUrl || null,
                published_at: newArticle.scheduled_at || (newArticle.is_published ? new Date().toISOString() : null)
            }

            const res = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleData)
            })

            if (!res.ok) throw new Error("Erreur lors de la création")

            toast.success("Article créé avec succès")
            setNewArticle({
                title: "",
                excerpt: "",
                content: "",
                cover_image: "",
                category: "Actualités",
                author: "Odillon",
                read_time: "5 min",
                is_published: false,
                scheduled_at: ""
            })
            setSelectedImageFile(null)
            setIsSheetOpen(false)
            loadArticles()
        } catch (error) {
            console.error("Erreur:", error)
            toast.error("Impossible de créer l'article")
        } finally {
            setSaving(false)
            setUploadingImage(false)
        }
    }

    const handleUpdate = async () => {
        if (!editingArticle) return

        try {
            setSaving(true)
            let coverImageUrl = editingArticle.cover_image

            // Upload image if selected
            if (selectedImageFile) {
                setUploadingImage(true)
                const formData = new FormData()
                formData.append("file", selectedImageFile)

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                })

                if (!uploadRes.ok) {
                    throw new Error("Erreur lors de l'upload de l'image")
                }

                const { url } = await uploadRes.json()
                coverImageUrl = url
                setUploadingImage(false)
            }

            const res = await fetch(`/api/articles/${editingArticle.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editingArticle, cover_image: coverImageUrl })
            })

            if (!res.ok) throw new Error("Erreur lors de la mise à jour")

            toast.success("Article mis à jour")
            setEditingArticle(null)
            setSelectedImageFile(null) // Reset file
            loadArticles()
        } catch (error) {
            console.error("Erreur:", error)
            toast.error("Impossible de mettre à jour")
        } finally {
            setSaving(false)
            setUploadingImage(false)
        }
    }

    const togglePublished = async (article: Article) => {
        try {
            const res = await fetch(`/api/articles/${article.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_published: !article.is_published })
            })

            if (!res.ok) throw new Error("Erreur")

            setArticles(articles.map(a =>
                a.id === article.id ? { ...a, is_published: !a.is_published } : a
            ))
            toast.success(article.is_published ? "Article dépublié" : "Article publié")
        } catch (error) {
            toast.error("Erreur lors de la mise à jour")
        }
    }

    const deleteArticle = async (id: string) => {
        try {
            const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error("Erreur")
            toast.success("Article supprimé")
            loadArticles()
        } catch (error) {
            toast.error("Erreur lors de la suppression")
        }
    }

    const handleUpdateSettings = async (updates: Partial<SiteSettings>) => {
        try {
            setUpdatingSettings(true)
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates)
            })

            if (!res.ok) throw new Error("Erreur update")

            setSettings(prev => prev ? ({ ...prev, ...updates }) : null)
            toast.success("Paramètres mis à jour")
        } catch (error) {
            toast.error("Erreur lors de la mise à jour")
        } finally {
            setUpdatingSettings(false)
        }
    }

    const handleBannerUpload = async (file: File) => {
        try {
            setUploadingBanner(true)
            const formData = new FormData()
            formData.append("file", file)

            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
            if (!uploadRes.ok) throw new Error("Erreur upload")

            const { url } = await uploadRes.json()
            await handleUpdateSettings({ blog_banner_image_url: url })
        } catch (error) {
            toast.error("Erreur lors de l'upload")
        } finally {
            setUploadingBanner(false)
        }
    }

    const filteredArticles = articles.filter(article => {
        if (searchTerm && !article.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false
        }
        if (filterCategory !== "all" && article.category !== filterCategory) {
            return false
        }
        if (filterStatus === "published" && !article.is_published) {
            return false
        }
        if (filterStatus === "draft" && article.is_published) {
            return false
        }
        return true
    })

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-odillon-teal" />
                        Gestion des Articles
                    </h2>
                    <p className="text-sm text-gray-500">Créez et gérez les articles du blog</p>
                </div>
            </div>

            {/* BANNER CONFIGURATION */}
            <Card className="border-none shadow-md overflow-hidden bg-white">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium text-gray-700 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-odillon-teal" />
                            Bannière Promotionnelle
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Activer</span>
                            <Switch
                                checked={settings?.show_blog_banner || false}
                                onCheckedChange={(checked) => handleUpdateSettings({ show_blog_banner: checked })}
                            />
                        </div>
                    </div>
                </CardHeader>
                {settings?.show_blog_banner && (
                    <CardContent className="p-6 grid md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Lien de redirection</Label>
                                <Input
                                    placeholder="https://..."
                                    value={settings?.blog_banner_link || ''}
                                    onChange={(e) => setSettings(prev => prev ? ({ ...prev, blog_banner_link: e.target.value }) : null)}
                                    onBlur={(e) => handleUpdateSettings({ blog_banner_link: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Image de bannière</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        id="blog-banner-upload"
                                        className="bg-white cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) handleBannerUpload(e.target.files[0])
                                        }}
                                    />
                                </div>
                                {uploadingBanner && <p className="text-xs text-odillon-teal animate-pulse">Upload en cours...</p>}
                            </div>
                        </div>
                        <div className="relative aspect-[3/1] w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            {settings?.blog_banner_image_url ? (
                                <img
                                    src={settings.blog_banner_image_url}
                                    alt="Aperçu Bannière"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-sm">Aperçu</div>
                            )}
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* MAIN CONTENT */}
            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-medium text-gray-700">
                            Articles
                        </CardTitle>
                        <Badge variant="secondary" className="bg-white border shadow-sm text-xs font-normal">
                            {filteredArticles.length}
                        </Badge>
                    </div>

                    {/* ADD ARTICLE BUTTON */}
                    <div className="flex gap-2">
                        <BatchImportDialog onArticlesCreated={loadArticles} />
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button className="bg-odillon-teal hover:bg-odillon-teal/90 text-white shadow-sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nouvel article
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto w-full sm:max-w-lg bg-white">
                                <SheetHeader>
                                    <SheetTitle>Créer un article</SheetTitle>
                                    <SheetDescription>
                                        Ajoutez un nouvel article au blog.
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="grid gap-6 py-6">
                                    <div className="space-y-2">
                                        <Label>Titre *</Label>
                                        <Input
                                            placeholder="Titre de l'article"
                                            value={newArticle.title}
                                            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Extrait *</Label>
                                        <Textarea
                                            placeholder="Résumé court de l'article (visible dans les listes)"
                                            value={newArticle.excerpt}
                                            onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Contenu</Label>
                                        <RichTextEditor
                                            value={newArticle.content}
                                            onChange={(val) => setNewArticle({ ...newArticle, content: val })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Catégorie</Label>
                                            <Select
                                                value={newArticle.category}
                                                onValueChange={(val) => setNewArticle({ ...newArticle, category: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {CATEGORIES.map((cat) => (
                                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Temps de lecture</Label>
                                            <Input
                                                placeholder="5 min"
                                                value={newArticle.read_time}
                                                onChange={(e) => setNewArticle({ ...newArticle, read_time: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload Zone */}
                                    <div className="space-y-3">
                                        <Label>Image de couverture</Label>

                                        {/* Hidden file input */}
                                        <input
                                            ref={imageInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    setSelectedImageFile(file)
                                                    setNewArticle({ ...newArticle, cover_image: "" })
                                                }
                                            }}
                                        />

                                        {/* Preview or Upload Zone */}
                                        {selectedImageFile || newArticle.cover_image ? (
                                            <div className="relative">
                                                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={selectedImageFile ? URL.createObjectURL(selectedImageFile) : newArticle.cover_image}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => {
                                                        setSelectedImageFile(null)
                                                        setNewArticle({ ...newArticle, cover_image: "" })
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => imageInputRef.current?.click()}
                                                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-odillon-teal hover:bg-odillon-teal/5 transition-all"
                                            >
                                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-600">Cliquez pour uploader une image</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP jusqu'à 5MB</p>
                                            </div>
                                        )}

                                        {/* URL fallback */}
                                        <div className="relative">
                                            <Input
                                                placeholder="Ou entrez une URL d'image..."
                                                value={newArticle.cover_image}
                                                onChange={(e) => {
                                                    setNewArticle({ ...newArticle, cover_image: e.target.value })
                                                    setSelectedImageFile(null)
                                                }}
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Publication Options */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <Label>Publier immédiatement</Label>
                                            <Switch
                                                checked={newArticle.is_published}
                                                onCheckedChange={(checked) => setNewArticle({
                                                    ...newArticle,
                                                    is_published: checked,
                                                    scheduled_at: checked ? "" : newArticle.scheduled_at
                                                })}
                                            />
                                        </div>

                                        {!newArticle.is_published && (
                                            <div className="space-y-2">
                                                <Label className="text-sm text-gray-600">Programmer la publication</Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={newArticle.scheduled_at}
                                                    onChange={(e) => setNewArticle({ ...newArticle, scheduled_at: e.target.value })}
                                                    className="w-full"
                                                />
                                                <p className="text-xs text-gray-400">
                                                    Laissez vide pour enregistrer comme brouillon
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button variant="outline">Annuler</Button>
                                    </SheetClose>
                                    <Button
                                        onClick={handleCreate}
                                        disabled={saving}
                                        className="bg-odillon-teal hover:bg-odillon-teal/90"
                                    >
                                        {saving ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Création...</>
                                        ) : (
                                            "Créer l'article"
                                        )}
                                    </Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
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
                                className="pl-9 bg-gray-50 border-gray-200"
                            />
                        </div>

                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes</SelectItem>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value="published">Publiés</SelectItem>
                                <SelectItem value="draft">Brouillons</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="ghost" size="icon" onClick={loadArticles}>
                            <RefreshCw className="w-4 h-4 text-gray-500" />
                        </Button>
                    </div>

                    {/* ARTICLES LIST */}
                    <div className="p-6 bg-gray-50/30 min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-odillon-teal mb-4" />
                                <p className="text-gray-500">Chargement des articles...</p>
                            </div>
                        ) : filteredArticles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Aucun article</h3>
                                <p className="text-gray-500">Créez votre premier article pour commencer.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredArticles.map((article, idx) => (
                                    <BlurFade key={article.id} delay={0.05 * idx}>
                                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge
                                                            variant={article.is_published ? "default" : "secondary"}
                                                            className={article.is_published ? "bg-green-100 text-green-700" : ""}
                                                        >
                                                            {article.is_published ? "Publié" : "Brouillon"}
                                                        </Badge>
                                                        <Badge variant="outline">{article.category}</Badge>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{article.title}</h3>
                                                    <p className="text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(article.published_at || article.created_at)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {article.read_time}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => togglePublished(article)}
                                                        title={article.is_published ? "Dépublier" : "Publier"}
                                                    >
                                                        {article.is_published ? (
                                                            <EyeOff className="w-4 h-4 text-gray-400" />
                                                        ) : (
                                                            <Eye className="w-4 h-4 text-gray-400" />
                                                        )}
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setEditingArticle(article)}
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-400" />
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <Trash2 className="w-4 h-4 text-red-400" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Supprimer l'article ?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Cette action est irréversible.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => deleteArticle(article.id)}
                                                                    className="bg-red-500 hover:bg-red-600"
                                                                >
                                                                    Supprimer
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </div>
                                    </BlurFade>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* EDIT DIALOG */}
            {editingArticle && (
                <Sheet open={!!editingArticle} onOpenChange={(open) => !open && setEditingArticle(null)}>
                    <SheetContent className="overflow-y-auto w-full sm:max-w-lg bg-white">
                        <SheetHeader>
                            <SheetTitle>Modifier l'article</SheetTitle>
                        </SheetHeader>

                        <div className="grid gap-6 py-6">
                            <div className="space-y-2">
                                <Label>Titre</Label>
                                <Input
                                    value={editingArticle.title}
                                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Extrait</Label>
                                <Textarea
                                    value={editingArticle.excerpt}
                                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Contenu</Label>
                                <RichTextEditor
                                    value={editingArticle.content}
                                    onChange={(val) => setEditingArticle({ ...editingArticle, content: val })}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Image de couverture</Label>

                                {/* Hidden file input for Edit */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="edit-image-upload"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setSelectedImageFile(file)
                                            // Show preview immediately requires object URL or handling in render
                                            // We use selectedImageFile for preview if present
                                        }
                                    }}
                                />

                                {/* Preview or Upload Zone */}
                                {selectedImageFile || editingArticle.cover_image ? (
                                    <div className="relative">
                                        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={selectedImageFile ? URL.createObjectURL(selectedImageFile) : (editingArticle.cover_image || "")}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => document.getElementById('edit-image-upload')?.click()}
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedImageFile(null)
                                                    setEditingArticle({ ...editingArticle, cover_image: "" })
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => document.getElementById('edit-image-upload')?.click()}
                                        className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-odillon-teal hover:bg-odillon-teal/5 transition-all"
                                    >
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">Cliquez pour modifier l'image</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Catégorie</Label>
                                    <Select
                                        value={editingArticle.category}
                                        onValueChange={(val) => setEditingArticle({ ...editingArticle, category: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Temps de lecture</Label>
                                    <Input
                                        value={editingArticle.read_time}
                                        onChange={(e) => setEditingArticle({ ...editingArticle, read_time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>Publié</Label>
                                <Switch
                                    checked={editingArticle.is_published}
                                    onCheckedChange={(checked) => setEditingArticle({ ...editingArticle, is_published: checked })}
                                />
                            </div>
                        </div>

                        <SheetFooter>
                            <Button variant="outline" onClick={() => setEditingArticle(null)}>
                                Annuler
                            </Button>
                            <Button
                                onClick={handleUpdate}
                                disabled={saving}
                                className="bg-odillon-teal hover:bg-odillon-teal/90"
                            >
                                {saving ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement...</>
                                ) : (
                                    <><Save className="w-4 h-4 mr-2" />Enregistrer</>
                                )}
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    )
}
