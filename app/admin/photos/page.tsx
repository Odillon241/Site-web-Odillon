"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Upload, Trash2, Eye, EyeOff, Plus, Calendar, Loader2, LogOut, CalendarDays, Search, Filter, X } from "lucide-react"
import { MONTHLY_THEMES } from "@/lib/photo-themes"
import { createClient } from "@/lib/supabase/client"
import { getEventForDate, hasEvent, getUpcomingEvents, getEventsForMonth, type GabonEvent } from "@/lib/gabon-events"

interface Photo {
  id: string
  url: string
  description: string
  month: number | null
  theme_id: string | null
  is_active: boolean
  display_order: number
}

export default function AdminPhotosPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  
  // Calendrier
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<GabonEvent | undefined>()
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMonth, setFilterMonth] = useState<number | null>(null)
  const [filterTheme, setFilterTheme] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all") // "all" | "active" | "inactive"
  
  // Noms des mois
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ]

  // Récupérer les événements du mois en cours
  const currentMonthEvents = getEventsForMonth(new Date().getMonth(), new Date().getFullYear())
  
  // Formulaire d'ajout
  const [newPhoto, setNewPhoto] = useState({
    file: null as File | null,
    description: "",
    month: null as number | null,
    theme_id: null as string | null
  })

  // Vérifier l'authentification au montage
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/admin/login')
      } else {
        setCheckingAuth(false)
      }
    }
    
    checkAuth()
  }, [router])

  // Charger les photos au montage
  useEffect(() => {
    if (!checkingAuth) {
      loadPhotos()
    }
  }, [selectedMonth, checkingAuth])

  // Gérer la sélection de date dans le calendrier
  useEffect(() => {
    if (selectedDate) {
      const event = getEventForDate(selectedDate)
      setSelectedEvent(event)
    }
  }, [selectedDate])

  // Navigation du calendrier
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newDate = new Date(prevMonth)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newDate = new Date(prevMonth)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  // Filtrer les photos
  const filteredPhotos = photos.filter(photo => {
    // Filtre par recherche (description)
    if (searchTerm && !photo.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Filtre par mois
    if (filterMonth && photo.month !== filterMonth) {
      return false
    }

    // Filtre par thématique
    if (filterTheme && photo.theme_id !== filterTheme) {
      return false
    }

    // Filtre par statut
    if (filterStatus === "active" && !photo.is_active) {
      return false
    }
    if (filterStatus === "inactive" && photo.is_active) {
      return false
    }

    return true
  })

  const loadPhotos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedMonth) params.append("month", selectedMonth.toString())
      
      const res = await fetch(`/api/photos?${params}`)
      if (!res.ok) throw new Error("Erreur lors du chargement")
      
      const data = await res.json()
      setPhotos(data.photos || [])
    } catch (error) {
      console.error("Erreur:", error)
      alert("Impossible de charger les photos")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto({ ...newPhoto, file: e.target.files[0] })
    }
  }

  const handleUpload = async () => {
    if (!newPhoto.file) {
      alert("Veuillez sélectionner un fichier")
      return
    }
    
    if (!newPhoto.description.trim()) {
      alert("Veuillez ajouter une description")
      return
    }

    try {
      setUploading(true)

      // 1. Upload du fichier
      const formData = new FormData()
      formData.append("file", newPhoto.file)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (!uploadRes.ok) throw new Error("Erreur lors de l'upload")
      
      const { url } = await uploadRes.json()

      // 2. Créer l'entrée dans la base de données
      const photoRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          description: newPhoto.description,
          month: newPhoto.month,
          theme_id: newPhoto.theme_id,
          is_active: true,
          display_order: photos.length + 1
        })
      })

      if (!photoRes.ok) throw new Error("Erreur lors de la création")

      // Message personnalisé selon le mois
      const monthName = newPhoto.month ? months[newPhoto.month - 1] : "toute l'année"
      const message = newPhoto.month === 11 
        ? `✅ Photo ajoutée avec succès pour Novembre !\n\nLa photo apparaîtra dans le Hero de la page d'accueil dans les 30 secondes.\n\nVous pouvez aussi recharger la page d'accueil pour la voir immédiatement.`
        : `✅ Photo ajoutée avec succès pour ${monthName} !\n\n⚠️ Cette photo ne s'affichera PAS actuellement dans le Hero car nous sommes en Novembre.\n\nElle s'affichera automatiquement en ${monthName}.`
      
      alert(message)
      
      // Réinitialiser le formulaire
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
      setNewPhoto({
        file: null,
        description: "",
        month: null,
        theme_id: null
      })
      
      // Recharger les photos
      loadPhotos()
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de l'ajout de la photo")
    } finally {
      setUploading(false)
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

      // Mettre à jour localement
      setPhotos(photos.map(p => 
        p.id === photoId ? { ...p, is_active: !p.is_active } : p
      ))
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de la mise à jour")
    }
  }

  const deletePhoto = async (photoId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) return

    try {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE"
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression")
      }

      alert(data.message || "Photo supprimée avec succès")
      loadPhotos()
    } catch (error: any) {
      console.error("Erreur:", error)
      alert(error.message || "Erreur lors de la suppression")
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      alert("Erreur lors de la déconnexion")
    }
  }

  const currentTheme = MONTHLY_THEMES.find(t => t.month === new Date().getMonth() + 1)

  // Afficher un loader pendant la vérification de l'authentification
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[88px] md:pt-[104px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-odillon-teal mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[88px] md:pt-[104px]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Gestion des Photos du Hero
              </h1>
              <p className="text-gray-600">
                Gérez les photos d'arrière-plan par mois et thématique
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
          
          {currentTheme && (
            <div className="mt-4">
              <Badge 
                className="text-base px-4 py-2"
                style={{ backgroundColor: currentTheme.color }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Thème actuel : {currentTheme.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Calendrier Gabonais */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Calendrier Gabonais - Événements & Thématiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Calendrier */}
              <div className="lg:col-span-2">
                {/* Navigation du calendrier */}
                <div className="flex items-center justify-between mb-4 gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousMonth}
                      className="gap-2"
                    >
                      ← Mois précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextMonth}
                      className="gap-2"
                    >
                      Mois suivant →
                    </Button>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={goToToday}
                  >
                    Aujourd'hui
                  </Button>
                </div>

                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border w-full"
                  modifiers={{
                    hasEvent: (date) => hasEvent(date)
                  }}
                  modifiersClassNames={{
                    hasEvent: 'bg-blue-100 font-bold text-blue-900 hover:bg-blue-200'
                  }}
                />
                
                {/* Légende */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-3">Légende :</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
                      <span>Jour avec événement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-white border border-gray-300"></div>
                      <span>Jour normal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Événement sélectionné & À venir */}
              <div className="space-y-4">
                {/* Événement du jour sélectionné */}
                {selectedEvent ? (
                  <Card className="border-2" style={{ borderColor: selectedEvent.color }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-2">
                        <Badge 
                          className="text-xs"
                          style={{ backgroundColor: selectedEvent.color }}
                        >
                          {selectedEvent.type === 'holiday' ? '🎉 Férié' :
                           selectedEvent.type === 'national' ? '🇬🇦 National' :
                           selectedEvent.type === 'awareness' ? '💙 Sensibilisation' :
                           '🎭 Culturel'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-2">
                        {selectedEvent.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedEvent.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        📅 {selectedDate.toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500 text-center">
                        Aucun événement pour cette date
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Événements à venir */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Prochains Événements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getUpcomingEvents(5).map((event) => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedDate(new Date(event.date))}
                          className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                        >
                          <div className="flex items-start gap-2">
                            <div 
                              className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                              style={{ backgroundColor: event.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {event.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(event.date).toLocaleDateString('fr-FR', {
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Filtres rapides par thématique */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Filtres Thématiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {MONTHLY_THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedMonth(theme.month || null)}
                          className={`p-2 rounded-lg border-2 transition-all text-xs ${
                            selectedMonth === theme.month
                              ? 'border-odillon-teal shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full mb-1 mx-auto"
                            style={{ backgroundColor: theme.color }}
                          />
                          <div className="font-semibold text-gray-900 truncate">
                            {theme.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ajouter une nouvelle photo */}
        <Card className="mb-8 border-2 border-dashed border-odillon-teal">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Ajouter une Nouvelle Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photo
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                    disabled={uploading}
                  />
                  <Button 
                    onClick={handleUpload}
                    disabled={uploading || !newPhoto.file}
                    className="bg-odillon-teal hover:bg-odillon-teal/90"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Formats acceptés : JPG, PNG, WebP (Max 10MB, recommandé 1920x1080)
                </p>
                {newPhoto.file && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Fichier sélectionné : {newPhoto.file.name}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Input
                    placeholder="Ex: Équipe lors de Novembre Bleu"
                    value={newPhoto.description}
                    onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mois associé
                    {currentTheme && (
                      <span className="ml-2 text-xs text-blue-600 font-normal">
                        (Actuellement : {currentTheme.name})
                      </span>
                    )}
                  </label>
                  <select 
                    className={`w-full px-3 py-2 border rounded-md ${
                      newPhoto.month === 11 ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}
                    value={newPhoto.month || ""}
                    onChange={(e) => setNewPhoto({ ...newPhoto, month: e.target.value ? parseInt(e.target.value) : null })}
                    disabled={uploading}
                  >
                    <option value="">Toute l'année</option>
                    {months.map((month, index) => {
                      const monthEvents = getEventsForMonth(index, new Date().getFullYear())
                      const isCurrentMonth = index + 1 === (new Date().getMonth() + 1)
                      const hasAwarenessEvent = monthEvents.some(e => e.type === 'awareness')
                      const hasHolidayEvent = monthEvents.some(e => e.type === 'holiday' || e.type === 'national')
                      
                      return (
                        <option key={index} value={index + 1}>
                          {month}
                          {isCurrentMonth ? ' (Affichage immédiat ✓)' : ''}
                          {hasAwarenessEvent ? ' 💙' : ''}
                          {hasHolidayEvent ? ' 🎉' : ''}
                        </option>
                      )
                    })}
                  </select>
                  {newPhoto.month !== (new Date().getMonth() + 1) && newPhoto.month !== null && (
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ Cette photo ne s'affichera pas immédiatement dans le Hero (nous sommes en {months[new Date().getMonth()]})
                    </p>
                  )}
                  {newPhoto.month === (new Date().getMonth() + 1) && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Cette photo s'affichera dans le Hero sous 30 secondes
                    </p>
                  )}
                </div>
              </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Thématique (optionnel)
                          {currentMonthEvents.length > 0 && (
                            <span className="ml-2 text-xs text-blue-600 font-normal">
                              ({currentMonthEvents.length} événement{currentMonthEvents.length > 1 ? 's' : ''} ce mois)
                            </span>
                          )}
                        </label>
                        <select
                          className={`w-full px-3 py-2 border rounded-md ${
                            currentMonthEvents.some(e => e.type === 'awareness') ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                          }`}
                          value={newPhoto.theme_id || ""}
                          onChange={(e) => setNewPhoto({ ...newPhoto, theme_id: e.target.value || null })}
                          disabled={uploading}
                        >
                          <option value="">Aucune thématique</option>
                          {MONTHLY_THEMES.map((theme) => {
                            const isCurrentMonth = theme.month === (new Date().getMonth() + 1)
                            return (
                              <option key={theme.id} value={theme.id}>
                                {theme.name} {isCurrentMonth ? '(Mois en cours ✓)' : ''}
                              </option>
                            )
                          })}
                        </select>
                        {currentMonthEvents.filter(e => e.type === 'awareness').map((event) => (
                          <p key={event.id} className="text-xs text-blue-600 mt-1">
                            ✓ {event.title} en cours
                          </p>
                        ))}
                      </div>
            </div>
          </CardContent>
        </Card>

        {/* Recherche et Filtres */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Recherche & Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher par description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filtre par mois */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Filtrer par mois</label>
                <ToggleGroup type="single" value={filterMonth?.toString() || ""} onValueChange={(value) => setFilterMonth(value ? parseInt(value) : null)}>
                  <ToggleGroupItem value="" aria-label="Tous les mois" className="text-xs">
                    Tous
                  </ToggleGroupItem>
                  {months.map((month, index) => (
                    <ToggleGroupItem key={index} value={(index + 1).toString()} aria-label={month} className="text-xs">
                      {month.substring(0, 3)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* Filtre par thématique */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Filtrer par thématique</label>
                <ToggleGroup type="single" value={filterTheme || ""} onValueChange={(value) => setFilterTheme(value || null)}>
                  <ToggleGroupItem value="" aria-label="Toutes les thématiques">
                    Toutes
                  </ToggleGroupItem>
                  {MONTHLY_THEMES.map((theme) => (
                    <ToggleGroupItem key={theme.id} value={theme.id} aria-label={theme.name}>
                      {theme.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* Filtre par statut */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Filtrer par statut</label>
                <ToggleGroup type="single" value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
                  <ToggleGroupItem value="all" aria-label="Toutes les photos">
                    Toutes
                  </ToggleGroupItem>
                  <ToggleGroupItem value="active" aria-label="Actives uniquement">
                    Actives
                  </ToggleGroupItem>
                  <ToggleGroupItem value="inactive" aria-label="Inactives uniquement">
                    Inactives
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Indicateur de filtres actifs */}
            {(searchTerm || filterMonth || filterTheme || filterStatus !== "all") && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Filtres actifs :</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Recherche: {searchTerm}
                    <button onClick={() => setSearchTerm("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filterMonth && (
                  <Badge variant="secondary" className="gap-1">
                    Mois: {months[filterMonth - 1]}
                    <button onClick={() => setFilterMonth(null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filterTheme && (
                  <Badge variant="secondary" className="gap-1">
                    Thème: {MONTHLY_THEMES.find(t => t.id === filterTheme)?.name}
                    <button onClick={() => setFilterTheme(null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filterStatus !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {filterStatus === "active" ? "Actives" : "Inactives"}
                    <button onClick={() => setFilterStatus("all")}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterMonth(null)
                    setFilterTheme(null)
                    setFilterStatus("all")
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Réinitialiser tous les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Liste des photos */}
        <Card>
          <CardHeader>
            <CardTitle>
              Photos Actuelles ({filteredPhotos.length} / {photos.length})
              {loading && <Loader2 className="inline w-5 h-5 ml-2 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
                <span className="ml-3 text-gray-600">Chargement des photos...</span>
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {photos.length === 0 ? (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Aucune photo pour le moment</p>
                    <p className="text-sm mt-2">Ajoutez votre première photo ci-dessus !</p>
                  </>
                ) : (
                  <>
                    <Filter className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Aucune photo ne correspond aux filtres</p>
                    <p className="text-sm mt-2">Essayez de modifier les critères de recherche</p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`relative group rounded-lg overflow-hidden border-2 ${
                      photo.is_active ? 'border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-video bg-gray-200">
                      <img
                        src={photo.url}
                        alt={photo.description}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => togglePhotoActive(photo.id)}
                          title={photo.is_active ? "Désactiver" : "Activer"}
                        >
                          {photo.is_active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deletePhoto(photo.id)}
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 bg-white">
                      <p className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                        {photo.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {photo.month && (
                          <Badge variant="outline" className="text-xs">
                            {months[photo.month - 1]}
                          </Badge>
                        )}
                        {photo.theme_id && (
                          <Badge 
                            className="text-xs"
                            style={{ 
                              backgroundColor: MONTHLY_THEMES.find(t => t.id === photo.theme_id)?.color 
                            }}
                          >
                            {MONTHLY_THEMES.find(t => t.id === photo.theme_id)?.name}
                          </Badge>
                        )}
                        <Badge 
                          variant={photo.is_active ? "default" : "secondary"}
                          className="text-xs ml-auto"
                        >
                          {photo.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informations */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              💡 Comment ça marche ?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Les photos s'affichent automatiquement selon le mois en cours</li>
              <li>• Vous pouvez associer des photos à des thématiques (ex: Novembre Bleu)</li>
              <li>• Les photos inactives ne s'affichent pas sur le site</li>
              <li>• L'ordre d'affichage est déterminé par le numéro d'ordre</li>
              <li>• Format recommandé : 1920x1080px, JPG ou WebP optimisé</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

