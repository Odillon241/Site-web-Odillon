"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
} from "@/components/ui/alert-dialog"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Loader2,
    Plus,
    Search,
    Trash2,
    RefreshCw,
    Edit,
    Save,
    ExternalLink,
    Rss,
    Scale,
    TrendingUp,
    Users,
    Building2,
    Globe,
    Clock,
    Settings2
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

// Types
interface NewsItem {
    id: string
    title: string
    source: string
    category: 'juridique' | 'finance' | 'rh' | 'gouvernance' | 'economie' | 'afrique'
    url: string | null
    published_at: string
    summary: string | null
    cached_at: string
    is_manual?: boolean
    is_active?: boolean
}

interface NewsSettings {
    show_news_ticker: boolean
    news_ticker_speed: number
    news_auto_refresh: boolean
    news_refresh_interval: number
}

// Category configuration
const CATEGORIES = [
    { value: 'juridique', label: 'Juridique', icon: Scale, color: 'bg-amber-500' },
    { value: 'finance', label: 'Finance', icon: TrendingUp, color: 'bg-emerald-500' },
    { value: 'rh', label: 'RH', icon: Users, color: 'bg-blue-500' },
    { value: 'gouvernance', label: 'Gouvernance', icon: Building2, color: 'bg-purple-500' },
    { value: 'economie', label: 'Économie', icon: TrendingUp, color: 'bg-teal-500' },
    { value: 'afrique', label: 'Afrique', icon: Globe, color: 'bg-lime-500' },
]

// Format relative time
function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function NewsTab() {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null)

    // Filters
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState<string>("all")

    // Settings
    const [settings, setSettings] = useState<NewsSettings>({
        show_news_ticker: true,
        news_ticker_speed: 50,
        news_auto_refresh: true,
        news_refresh_interval: 15
    })
    const [savingSettings, setSavingSettings] = useState(false)

    // New News Form
    const [newNews, setNewNews] = useState({
        title: "",
        source: "",
        category: "economie" as NewsItem['category'],
        url: "",
        summary: ""
    })

    // Fetch news from cache
    const fetchNews = async () => {
        try {
            setLoading(true)
            const supabase = createClient()
            const { data, error } = await supabase
                .from('news_cache')
                .select('*')
                .order('published_at', { ascending: false })

            if (error) throw error
            setNews(data || [])
        } catch (error) {
            console.error('Error fetching news:', error)
            toast.error("Erreur lors du chargement des actualités")
        } finally {
            setLoading(false)
        }
    }

    // Fetch settings
    const fetchSettings = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('site_settings')
                .select('show_news_ticker, news_ticker_speed, news_auto_refresh, news_refresh_interval')
                .single()

            if (data) {
                setSettings({
                    show_news_ticker: data.show_news_ticker ?? true,
                    news_ticker_speed: data.news_ticker_speed ?? 50,
                    news_auto_refresh: data.news_auto_refresh ?? true,
                    news_refresh_interval: data.news_refresh_interval ?? 15
                })
            }
        } catch (error) {
            // Settings might not exist yet, use defaults
            console.log('Using default settings')
        }
    }

    // Refresh news from RSS feeds
    const refreshNews = async () => {
        try {
            setRefreshing(true)
            const response = await fetch('/api/news?refresh=true')
            if (!response.ok) throw new Error('Erreur de rafraîchissement')

            const data = await response.json()
            toast.success(`${data.news?.length || 0} actualités récupérées`)
            await fetchNews()
        } catch (error) {
            toast.error("Erreur lors du rafraîchissement des actualités")
        } finally {
            setRefreshing(false)
        }
    }

    // Save settings
    const saveSettings = async () => {
        try {
            setSavingSettings(true)
            const supabase = createClient()

            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    id: '1',
                    show_news_ticker: settings.show_news_ticker,
                    news_ticker_speed: settings.news_ticker_speed,
                    news_auto_refresh: settings.news_auto_refresh,
                    news_refresh_interval: settings.news_refresh_interval
                })

            if (error) throw error
            toast.success("Paramètres enregistrés")
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error("Erreur lors de l'enregistrement")
        } finally {
            setSavingSettings(false)
        }
    }

    // Add manual news
    const addNews = async () => {
        if (!newNews.title || !newNews.source) {
            toast.error("Le titre et la source sont requis")
            return
        }

        try {
            setSaving(true)
            const supabase = createClient()

            const newsItem = {
                id: `manual-${Date.now()}`,
                title: newNews.title,
                source: newNews.source,
                category: newNews.category,
                url: newNews.url || null,
                summary: newNews.summary || null,
                published_at: new Date().toISOString(),
                cached_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from('news_cache')
                .insert(newsItem)

            if (error) throw error

            toast.success("Actualité ajoutée")
            setIsSheetOpen(false)
            setNewNews({
                title: "",
                source: "",
                category: "economie",
                url: "",
                summary: ""
            })
            await fetchNews()
        } catch (error) {
            console.error('Error adding news:', error)
            toast.error("Erreur lors de l'ajout")
        } finally {
            setSaving(false)
        }
    }

    // Update news
    const updateNews = async () => {
        if (!editingNews) return

        try {
            setSaving(true)
            const supabase = createClient()

            const { error } = await supabase
                .from('news_cache')
                .update({
                    title: editingNews.title,
                    source: editingNews.source,
                    category: editingNews.category,
                    url: editingNews.url,
                    summary: editingNews.summary
                })
                .eq('id', editingNews.id)

            if (error) throw error

            toast.success("Actualité modifiée")
            setEditingNews(null)
            await fetchNews()
        } catch (error) {
            console.error('Error updating news:', error)
            toast.error("Erreur lors de la modification")
        } finally {
            setSaving(false)
        }
    }

    // Delete news
    const deleteNews = async () => {
        if (!newsToDelete) return

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('news_cache')
                .delete()
                .eq('id', newsToDelete.id)

            if (error) throw error

            toast.success("Actualité supprimée")
            setDeleteDialogOpen(false)
            setNewsToDelete(null)
            await fetchNews()
        } catch (error) {
            console.error('Error deleting news:', error)
            toast.error("Erreur lors de la suppression")
        }
    }

    // Clear all cache
    const clearCache = async () => {
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('news_cache')
                .delete()
                .neq('id', 'placeholder')

            if (error) throw error

            toast.success("Cache vidé")
            setNews([])
        } catch (error) {
            console.error('Error clearing cache:', error)
            toast.error("Erreur lors du vidage du cache")
        }
    }

    useEffect(() => {
        fetchNews()
        fetchSettings()
    }, [])

    // Filter news
    const filteredNews = news.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.source.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory
        return matchesSearch && matchesCategory
    })

    const getCategoryConfig = (category: string) => {
        return CATEGORIES.find(c => c.value === category) || CATEGORIES[0]
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">News Ticker</h2>
                    <p className="text-gray-500">Gérez le bandeau d'actualités de la page d'accueil</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={refreshNews}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Rafraîchir RSS
                    </Button>
                    <Button onClick={() => setIsSheetOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter manuellement
                    </Button>
                </div>
            </div>

            {/* Settings Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings2 className="w-5 h-5" />
                        Paramètres du Ticker
                    </CardTitle>
                    <CardDescription>
                        Configurez l'affichage et le comportement du bandeau d'actualités
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base font-medium">Afficher le ticker</Label>
                                <p className="text-sm text-gray-500">
                                    Active/désactive le bandeau d'actualités sur la page d'accueil
                                </p>
                            </div>
                            <Switch
                                checked={settings.show_news_ticker}
                                onCheckedChange={(checked) =>
                                    setSettings(prev => ({ ...prev, show_news_ticker: checked }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base font-medium">Rafraîchissement auto</Label>
                                <p className="text-sm text-gray-500">
                                    Met à jour automatiquement les actualités
                                </p>
                            </div>
                            <Switch
                                checked={settings.news_auto_refresh}
                                onCheckedChange={(checked) =>
                                    setSettings(prev => ({ ...prev, news_auto_refresh: checked }))
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Vitesse de défilement</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="range"
                                    min="20"
                                    max="100"
                                    value={settings.news_ticker_speed}
                                    onChange={(e) =>
                                        setSettings(prev => ({ ...prev, news_ticker_speed: parseInt(e.target.value) }))
                                    }
                                    className="flex-1"
                                />
                                <span className="text-sm font-medium w-16">{settings.news_ticker_speed} px/s</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Intervalle de rafraîchissement (minutes)</Label>
                            <Select
                                value={String(settings.news_refresh_interval)}
                                onValueChange={(value) =>
                                    setSettings(prev => ({ ...prev, news_refresh_interval: parseInt(value) }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 minutes</SelectItem>
                                    <SelectItem value="10">10 minutes</SelectItem>
                                    <SelectItem value="15">15 minutes</SelectItem>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="60">1 heure</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button onClick={saveSettings} disabled={savingSettings}>
                            {savingSettings ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Enregistrer les paramètres
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Rechercher une actualité..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {CATEGORIES.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={clearCache} className="text-red-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Vider le cache
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {CATEGORIES.map(cat => {
                    const count = news.filter(n => n.category === cat.value).length
                    const Icon = cat.icon
                    return (
                        <Card key={cat.value} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setFilterCategory(cat.value)}>
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{count}</p>
                                    <p className="text-xs text-gray-500">{cat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* News List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Rss className="w-5 h-5" />
                            Actualités ({filteredNews.length})
                        </span>
                        <Badge variant="outline" className="font-normal">
                            Dernier rafraîchissement: {news[0]?.cached_at ? formatRelativeTime(news[0].cached_at) : 'Jamais'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : filteredNews.length === 0 ? (
                        <div className="text-center py-12">
                            <Rss className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune actualité</h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm || filterCategory !== 'all'
                                    ? "Aucune actualité ne correspond à vos critères"
                                    : "Cliquez sur 'Rafraîchir RSS' pour récupérer les dernières actualités"}
                            </p>
                            {!searchTerm && filterCategory === 'all' && (
                                <Button onClick={refreshNews} disabled={refreshing}>
                                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                    Rafraîchir RSS
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredNews.map((item, index) => {
                                const catConfig = getCategoryConfig(item.category)
                                const Icon = catConfig.icon
                                return (
                                    <BlurFade key={item.id} delay={index * 0.05}>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                                            <div className={`w-10 h-10 rounded-lg ${catConfig.color} flex items-center justify-center flex-shrink-0`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span>{item.source}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatRelativeTime(item.published_at)}
                                                    </span>
                                                    {item.id.startsWith('manual-') && (
                                                        <>
                                                            <span>•</span>
                                                            <Badge variant="secondary" className="text-xs">Manuel</Badge>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {item.url && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => window.open(item.url!, '_blank')}
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingNews(item)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => {
                                                        setNewsToDelete(item)
                                                        setDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </BlurFade>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add News Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle>Ajouter une actualité</SheetTitle>
                        <SheetDescription>
                            Ajoutez manuellement une actualité au ticker
                        </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 py-6">
                        <div className="space-y-2">
                            <Label>Titre *</Label>
                            <Input
                                placeholder="Titre de l'actualité"
                                value={newNews.title}
                                onChange={(e) => setNewNews(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Source *</Label>
                            <Input
                                placeholder="Ex: Jeune Afrique, Gabon Review..."
                                value={newNews.source}
                                onChange={(e) => setNewNews(prev => ({ ...prev, source: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Catégorie</Label>
                            <Select
                                value={newNews.category}
                                onValueChange={(value) =>
                                    setNewNews(prev => ({ ...prev, category: value as NewsItem['category'] }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>URL (optionnel)</Label>
                            <Input
                                placeholder="https://..."
                                value={newNews.url}
                                onChange={(e) => setNewNews(prev => ({ ...prev, url: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Résumé (optionnel)</Label>
                            <Textarea
                                placeholder="Court résumé de l'actualité..."
                                value={newNews.summary}
                                onChange={(e) => setNewNews(prev => ({ ...prev, summary: e.target.value }))}
                                rows={3}
                            />
                        </div>
                    </div>

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </SheetClose>
                        <Button onClick={addNews} disabled={saving}>
                            {saving ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4 mr-2" />
                            )}
                            Ajouter
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Edit News Sheet */}
            <Sheet open={!!editingNews} onOpenChange={(open) => !open && setEditingNews(null)}>
                <SheetContent className="sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle>Modifier l'actualité</SheetTitle>
                        <SheetDescription>
                            Modifiez les informations de cette actualité
                        </SheetDescription>
                    </SheetHeader>

                    {editingNews && (
                        <div className="space-y-4 py-6">
                            <div className="space-y-2">
                                <Label>Titre</Label>
                                <Input
                                    value={editingNews.title}
                                    onChange={(e) =>
                                        setEditingNews(prev => prev ? { ...prev, title: e.target.value } : null)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Source</Label>
                                <Input
                                    value={editingNews.source}
                                    onChange={(e) =>
                                        setEditingNews(prev => prev ? { ...prev, source: e.target.value } : null)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Catégorie</Label>
                                <Select
                                    value={editingNews.category}
                                    onValueChange={(value) =>
                                        setEditingNews(prev =>
                                            prev ? { ...prev, category: value as NewsItem['category'] } : null
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>URL</Label>
                                <Input
                                    value={editingNews.url || ''}
                                    onChange={(e) =>
                                        setEditingNews(prev =>
                                            prev ? { ...prev, url: e.target.value || null } : null
                                        )
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Résumé</Label>
                                <Textarea
                                    value={editingNews.summary || ''}
                                    onChange={(e) =>
                                        setEditingNews(prev =>
                                            prev ? { ...prev, summary: e.target.value || null } : null
                                        )
                                    }
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    <SheetFooter>
                        <Button variant="outline" onClick={() => setEditingNews(null)}>
                            Annuler
                        </Button>
                        <Button onClick={updateNews} disabled={saving}>
                            {saving ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Enregistrer
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette actualité ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. L'actualité sera définitivement supprimée du cache.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={deleteNews}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
