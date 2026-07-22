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
    Settings2,
    CalendarDays,
    PartyPopper
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { AdminEmptyState } from "@/components/admin/ui/admin-panel"

// Types
interface NewsItem {
    id: string
    title: string
    source: string
    category: 'juridique' | 'finance' | 'rh' | 'gouvernance' | 'economie' | 'afrique' | 'evenement' | 'jour-ferie'
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
// Code couleur des catégories du ticker, en teintes (fond clair + icône colorée)
const CATEGORIES = [
    { value: 'juridique', label: 'Juridique', icon: Scale, color: 'bg-amber-100 text-amber-700' },
    { value: 'finance', label: 'Finance', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-700' },
    { value: 'rh', label: 'RH', icon: Users, color: 'bg-blue-100 text-blue-700' },
    { value: 'gouvernance', label: 'Gouvernance', icon: Building2, color: 'bg-purple-100 text-purple-700' },
    { value: 'economie', label: 'Économie', icon: TrendingUp, color: 'bg-teal-100 text-teal-700' },
    { value: 'afrique', label: 'Afrique', icon: Globe, color: 'bg-lime-100 text-lime-800' },
    { value: 'evenement', label: 'Événement', icon: CalendarDays, color: 'bg-rose-100 text-rose-700' },
    { value: 'jour-ferie', label: 'Jour férié', icon: PartyPopper, color: 'bg-orange-100 text-orange-700' },
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

    // Auth check helper - verifies session before mutations
    const checkAuth = async (supabase: ReturnType<typeof createClient>): Promise<boolean> => {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
            console.error('Auth check failed:', error?.message || 'No user')
            toast.error("Session expirée. Veuillez vous reconnecter.")
            return false
        }
        return true
    }

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
            const { data } = await supabase
                .from('site_settings')
                .select('show_news_ticker, news_ticker_speed, news_auto_refresh, news_refresh_interval')
                .eq('id', 'main')
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

    // Save a single setting immediately (for toggles)
    const saveSetting = async (key: keyof NewsSettings, value: boolean | number) => {
        try {
            const supabase = createClient()
            if (!await checkAuth(supabase)) return

            const { error } = await supabase
                .from('site_settings')
                .update({ [key]: value })
                .eq('id', 'main')

            if (error) {
                console.error('Supabase update error:', error.message, error.code, error.details)
                throw error
            }
            toast.success("Paramètre enregistré")
        } catch (error: any) {
            console.error('Error saving setting:', error)
            // Revert local state on failure
            setSettings(prev => ({ ...prev, [key]: !value }))
            toast.error("Erreur lors de l'enregistrement")
        }
    }

    // Save all settings
    const saveSettings = async () => {
        try {
            setSavingSettings(true)
            const supabase = createClient()

            if (!await checkAuth(supabase)) return

            const { data, error } = await supabase
                .from('site_settings')
                .update({
                    show_news_ticker: settings.show_news_ticker,
                    news_ticker_speed: settings.news_ticker_speed,
                    news_auto_refresh: settings.news_auto_refresh,
                    news_refresh_interval: settings.news_refresh_interval
                })
                .eq('id', 'main')
                .select('show_news_ticker, news_ticker_speed, news_auto_refresh, news_refresh_interval')
                .single()

            if (error) {
                console.error('Supabase update error:', error.message, error.code, error.details)
                throw error
            }
            if (!data) throw new Error('Aucune ligne mise à jour')
            console.log('Settings saved:', data)
            toast.success("Paramètres enregistrés")
        } catch (error: any) {
            console.error('Error saving settings:', error)
            toast.error(error?.message === "Session expirée. Veuillez vous reconnecter."
                ? error.message
                : "Erreur lors de l'enregistrement des paramètres")
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

            if (!await checkAuth(supabase)) return

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

            const { data, error } = await supabase
                .from('news_cache')
                .insert(newsItem)
                .select()
                .single()

            if (error) {
                console.error('Supabase insert error:', error.message, error.code, error.details)
                throw error
            }

            console.log('News added:', data)
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
        } catch (error: any) {
            console.error('Error adding news:', error)
            toast.error(error?.code === '42501'
                ? "Permission refusée. Vérifiez vos droits d'accès."
                : "Erreur lors de l'ajout de l'actualité")
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

            if (!await checkAuth(supabase)) return

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

            if (error) {
                console.error('Supabase update error:', error.message, error.code, error.details)
                throw error
            }

            toast.success("Actualité modifiée")
            setEditingNews(null)
            await fetchNews()
        } catch (error: any) {
            console.error('Error updating news:', error)
            toast.error(error?.code === '42501'
                ? "Permission refusée. Vérifiez vos droits d'accès."
                : "Erreur lors de la modification")
        } finally {
            setSaving(false)
        }
    }

    // Delete news
    const deleteNews = async () => {
        if (!newsToDelete) return

        try {
            const supabase = createClient()

            if (!await checkAuth(supabase)) return

            const { error } = await supabase
                .from('news_cache')
                .delete()
                .eq('id', newsToDelete.id)

            if (error) {
                console.error('Supabase delete error:', error.message, error.code, error.details)
                throw error
            }

            toast.success("Actualité supprimée")
            setDeleteDialogOpen(false)
            setNewsToDelete(null)
            await fetchNews()
        } catch (error: any) {
            console.error('Error deleting news:', error)
            toast.error(error?.code === '42501'
                ? "Permission refusée. Vérifiez vos droits d'accès."
                : "Erreur lors de la suppression")
        }
    }

    // Clear all cache
    const clearCache = async () => {
        try {
            const supabase = createClient()

            if (!await checkAuth(supabase)) return

            const { error } = await supabase
                .from('news_cache')
                .delete()
                .neq('id', 'placeholder')

            if (error) {
                console.error('Supabase delete error:', error.message, error.code, error.details)
                throw error
            }

            toast.success("Cache vidé")
            setNews([])
        } catch (error: any) {
            console.error('Error clearing cache:', error)
            toast.error(error?.code === '42501'
                ? "Permission refusée. Vérifiez vos droits d'accès."
                : "Erreur lors du vidage du cache")
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
                        <Rss className="h-5 w-5" />
                    </span>
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-950">News Ticker</h2>
                        <p className="text-sm text-slate-500">Gérez le bandeau d'actualités de la page d'accueil</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={refreshNews}
                        disabled={refreshing}
                        className="border-slate-200 text-slate-700 hover:border-odillon-teal/30 hover:text-odillon-teal"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Rafraîchir RSS
                    </Button>
                    <Button
                        onClick={() => setIsSheetOpen(true)}
                        className="bg-odillon-teal text-white shadow-sm hover:bg-odillon-teal/90"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter manuellement
                    </Button>
                </div>
            </div>

            {/* Settings Card */}
            <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-200/80 bg-white py-4">
                    <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight text-slate-950">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
                            <Settings2 className="h-4 w-4" />
                        </span>
                        Paramètres du Ticker
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        Configurez l'affichage et le comportement du bandeau d'actualités
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-slate-50 p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base font-medium text-slate-900">Afficher le ticker</Label>
                                <p className="text-sm text-slate-500">
                                    Active/désactive le bandeau d'actualités sur la page d'accueil
                                </p>
                            </div>
                            <Switch
                                checked={settings.show_news_ticker}
                                onCheckedChange={(checked) => {
                                    setSettings(prev => ({ ...prev, show_news_ticker: checked }))
                                    saveSetting('show_news_ticker', checked)
                                }}
                                className="data-[state=checked]:bg-odillon-teal"
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-slate-50 p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base font-medium text-slate-900">Rafraîchissement auto</Label>
                                <p className="text-sm text-slate-500">
                                    Met à jour automatiquement les actualités
                                </p>
                            </div>
                            <Switch
                                checked={settings.news_auto_refresh}
                                onCheckedChange={(checked) => {
                                    setSettings(prev => ({ ...prev, news_auto_refresh: checked }))
                                    saveSetting('news_auto_refresh', checked)
                                }}
                                className="data-[state=checked]:bg-odillon-teal"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Vitesse de défilement</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="range"
                                    min="20"
                                    max="100"
                                    value={settings.news_ticker_speed}
                                    onChange={(e) =>
                                        setSettings(prev => ({ ...prev, news_ticker_speed: parseInt(e.target.value) }))
                                    }
                                    onMouseUp={(e) => saveSetting('news_ticker_speed', parseInt((e.target as HTMLInputElement).value))}
                                    onTouchEnd={(e) => saveSetting('news_ticker_speed', parseInt((e.target as HTMLInputElement).value))}
                                    className="flex-1"
                                />
                                <span className="w-16 text-sm font-medium tabular-nums text-slate-700">{settings.news_ticker_speed} px/s</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Intervalle de rafraîchissement (minutes)</Label>
                            <Select
                                value={String(settings.news_refresh_interval)}
                                onValueChange={(value) => {
                                    setSettings(prev => ({ ...prev, news_refresh_interval: parseInt(value) }))
                                    saveSetting('news_refresh_interval', parseInt(value))
                                }}
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

                </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher une actualité..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-200 bg-white"
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
                        <Card
                            key={cat.value}
                            className="cursor-pointer rounded-xl border border-slate-200/80 bg-white shadow-sm transition-colors hover:border-odillon-teal/30"
                            onClick={() => setFilterCategory(cat.value)}
                        >
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold tabular-nums tracking-tight text-slate-950">{count}</p>
                                    <p className="text-xs text-slate-500">{cat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* News List */}
            <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-200/80 bg-white py-4">
                    <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-3 text-base font-semibold tracking-tight text-slate-950">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
                                <Rss className="h-4 w-4" />
                            </span>
                            Actualités ({filteredNews.length})
                        </span>
                        <Badge variant="outline" className="border-slate-200 font-normal text-slate-500">
                            Dernier rafraîchissement : {news[0]?.cached_at ? formatRelativeTime(news[0].cached_at) : 'Jamais'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="min-h-[300px] bg-[#f7f9f8] p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
                        </div>
                    ) : filteredNews.length === 0 ? (
                        <AdminEmptyState
                            icon={Rss}
                            title="Aucune actualité"
                            hint={searchTerm || filterCategory !== 'all'
                                ? "Aucune actualité ne correspond à vos critères."
                                : "Cliquez sur « Rafraîchir RSS » pour récupérer les dernières actualités."}
                            action={!searchTerm && filterCategory === 'all' ? (
                                <Button
                                    onClick={refreshNews}
                                    disabled={refreshing}
                                    className="bg-odillon-teal text-white shadow-sm hover:bg-odillon-teal/90"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                    Rafraîchir RSS
                                </Button>
                            ) : undefined}
                        />
                    ) : (
                        <div className="space-y-3">
                            {filteredNews.map((item) => {
                                const catConfig = getCategoryConfig(item.category)
                                const Icon = catConfig.icon
                                return (
                                        <div key={item.id} className="group flex items-center gap-4 rounded-lg border border-slate-200/80 bg-white p-4 transition-shadow hover:shadow-md">
                                            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${catConfig.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-slate-900 truncate">{item.title}</h4>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <span>{item.source}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatRelativeTime(item.published_at)}
                                                    </span>
                                                    {item.id.startsWith('manual-') && (
                                                        <>
                                                            <span>•</span>
                                                            <Badge variant="secondary" className="bg-slate-100 text-xs text-slate-600">Manuel</Badge>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                                                {item.url && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => window.open(item.url!, '_blank')}
                                                        aria-label="Ouvrir le lien"
                                                        className="text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingNews(item)}
                                                    aria-label="Modifier"
                                                    className="text-odillon-teal transition-[color,background-color,transform] hover:bg-odillon-teal/[0.08] hover:text-odillon-teal active:scale-[0.96]"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 transition-[color,background-color,transform] hover:bg-red-50 hover:text-red-600 active:scale-[0.96]"
                                                    aria-label="Supprimer"
                                                    onClick={() => {
                                                        setNewsToDelete(item)
                                                        setDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
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
