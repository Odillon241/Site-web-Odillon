"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Upload, Trash2, Eye, EyeOff, Plus, Calendar, Loader2, LogOut, CalendarDays, Search, Filter, X, Building2, ArrowUp, ArrowDown } from "lucide-react"
import { HeroImagesDebugger } from "@/components/admin/hero-images-debugger"
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

interface CompanyLogo {
  id: string
  name: string
  full_name: string
  logo_path: string
  fallback: string
  color: string
  display_order: number
  is_active: boolean
}

export default function AdminPhotosPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [logos, setLogos] = useState<CompanyLogo[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingLogos, setLoadingLogos] = useState(false)
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
  
  // État pour la recherche command
  const [commandSearch, setCommandSearch] = useState("")
  const [commandOpen, setCommandOpen] = useState(false)
  
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

  // Formulaire d'ajout de logo
  const [newLogo, setNewLogo] = useState({
    name: "",
    full_name: "",
    logo_path: "",
    fallback: "",
    color: "#1A9B8E"
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
      loadLogos()
    }
  }, [selectedMonth, checkingAuth])

  // Gérer la sélection de date dans le calendrier
  useEffect(() => {
    if (selectedDate) {
      const event = getEventForDate(selectedDate)
      setSelectedEvent(event)
    }
  }, [selectedDate])

  // Raccourcis clavier pour la command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd+K ou Ctrl+K pour ouvrir/fermer la command palette
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
        if (!commandOpen) {
          // Focus sur l'input après un court délai
          setTimeout(() => {
            const input = document.querySelector('[cmdk-input]') as HTMLInputElement
            if (input) input.focus()
          }, 100)
        }
      }
      // Échap pour fermer
      if (e.key === "Escape" && commandOpen) {
        setCommandOpen(false)
        setCommandSearch("")
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [commandOpen])

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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de charger les photos"
      console.error("Erreur lors du chargement des photos:", error)
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const loadLogos = async () => {
    try {
      setLoadingLogos(true)
      const res = await fetch('/api/logos')
      if (!res.ok) throw new Error("Erreur lors du chargement")
      
      const data = await res.json()
      setLogos(data.logos || [])
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de charger les logos"
      console.error("Erreur lors du chargement des logos:", error)
      alert(errorMessage)
    } finally {
      setLoadingLogos(false)
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'ajout de la photo"
      console.error("Erreur lors de l'ajout de la photo:", error)
      alert(errorMessage)
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      console.error("Erreur lors de la mise à jour:", error)
      alert(errorMessage)
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression"
      console.error("Erreur lors de la suppression:", error)
      alert(errorMessage)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la déconnexion"
      console.error("Erreur lors de la déconnexion:", error)
      alert(errorMessage)
    }
  }

  // Gestion des logos
  const handleAddLogo = async () => {
    if (!newLogo.name.trim() || !newLogo.full_name.trim() || !newLogo.logo_path.trim()) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const res = await fetch('/api/logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLogo)
      })

      if (!res.ok) throw new Error("Erreur lors de l'ajout")

      alert("Logo ajouté avec succès")
      setNewLogo({
        name: "",
        full_name: "",
        logo_path: "",
        fallback: "",
        color: "#1A9B8E"
      })
      loadLogos()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'ajout du logo"
      console.error("Erreur lors de l'ajout du logo:", error)
      alert(errorMessage)
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      console.error("Erreur lors de la mise à jour:", error)
      alert(errorMessage)
    }
  }

  const deleteLogo = async (logoId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce logo ?")) return

    try {
      const res = await fetch(`/api/logos/${logoId}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error("Erreur lors de la suppression")

      alert("Logo supprimé avec succès")
      loadLogos()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression"
      console.error("Erreur lors de la suppression:", error)
      alert(errorMessage)
    }
  }

  const moveLogoOrder = async (logoId: string, direction: 'up' | 'down') => {
    const logo = logos.find(l => l.id === logoId)
    if (!logo) return

    const currentIndex = logos.findIndex(l => l.id === logoId)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= logos.length) return

    const otherLogo = logos[newIndex]
    const newOrder = otherLogo.display_order
    const otherNewOrder = logo.display_order

    try {
      // Mettre à jour les deux logos
      await Promise.all([
        fetch(`/api/logos/${logoId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: newOrder })
        }),
        fetch(`/api/logos/${otherLogo.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: otherNewOrder })
        })
      ])

      loadLogos()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors du déplacement"
      console.error("Erreur lors du déplacement:", error)
      alert(errorMessage)
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
        {/* Command Component - Recherche Intelligente */}
        <div className="mb-8">
          <div className="relative">
            <Command 
              className="rounded-lg border shadow-md" 
            filter={(value, search) => {
              // Recherche intelligente : recherche dans tous les champs
              const searchLower = search.toLowerCase()
              const valueLower = value.toLowerCase()
              
              // Recherche exacte
              if (valueLower.includes(searchLower)) return 1
              
              // Recherche par mots-clés (recherche partielle)
              const searchWords = searchLower.split(' ').filter(w => w.length > 0)
              const matchCount = searchWords.filter(word => valueLower.includes(word)).length
              
              // Score basé sur le nombre de mots correspondants
              return matchCount > 0 ? matchCount / searchWords.length : 0
            }}
          >
            <CommandInput 
              placeholder="Recherchez des photos, logos, thèmes, mois, événements..." 
              value={commandSearch}
              onValueChange={setCommandSearch}
            />
            <CommandList>
              <CommandEmpty>
                {commandSearch ? (
                  <div className="py-6 text-center text-sm">
                    <p className="text-gray-500 mb-2">Aucun résultat pour "{commandSearch}"</p>
                    <p className="text-xs text-gray-400">Essayez : nom de photo, mois, thème, ou nom de logo</p>
                  </div>
                ) : (
                  "Commencez à taper pour rechercher..."
                )}
              </CommandEmpty>
              
              {/* Photos correspondantes */}
              {photos.filter(photo => {
                if (!commandSearch) return false
                const search = commandSearch.toLowerCase()
                return (
                  photo.description.toLowerCase().includes(search) ||
                  (photo.month && months[photo.month - 1]?.toLowerCase().includes(search)) ||
                  (photo.theme_id && MONTHLY_THEMES.find(t => t.id === photo.theme_id)?.name.toLowerCase().includes(search))
                )
              }).length > 0 && (
                <CommandGroup heading="Photos">
                  {photos
                    .filter(photo => {
                      if (!commandSearch) return false
                      const search = commandSearch.toLowerCase()
                      return (
                        photo.description.toLowerCase().includes(search) ||
                        (photo.month && months[photo.month - 1]?.toLowerCase().includes(search)) ||
                        (photo.theme_id && MONTHLY_THEMES.find(t => t.id === photo.theme_id)?.name.toLowerCase().includes(search))
                      )
                    })
                    .slice(0, 5)
                    .map((photo) => (
                      <CommandItem
                        key={photo.id}
                        value={`photo-${photo.id}-${photo.description}-${photo.month ? months[photo.month - 1] : ''}-${photo.theme_id || ''}`}
                        onSelect={() => {
                          // Scroll vers la photo dans la liste
                          const element = document.getElementById(`photo-${photo.id}`)
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                            element.classList.add('ring-2', 'ring-odillon-teal')
                            setTimeout(() => {
                              element.classList.remove('ring-2', 'ring-odillon-teal')
                            }, 2000)
                          }
                          setCommandSearch("")
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        <div className="flex-1">
                          <span className="font-medium">{photo.description}</span>
                          <div className="flex items-center gap-2 mt-1">
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
                            <Badge variant={photo.is_active ? "default" : "secondary"} className="text-xs">
                              {photo.is_active ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {/* Logos correspondants */}
              {logos.filter(logo => {
                if (!commandSearch) return false
                const search = commandSearch.toLowerCase()
                return (
                  logo.name.toLowerCase().includes(search) ||
                  logo.full_name.toLowerCase().includes(search)
                )
              }).length > 0 && (
                <CommandGroup heading="Logos">
                  {logos
                    .filter(logo => {
                      if (!commandSearch) return false
                      const search = commandSearch.toLowerCase()
                      return (
                        logo.name.toLowerCase().includes(search) ||
                        logo.full_name.toLowerCase().includes(search)
                      )
                    })
                    .slice(0, 5)
                    .map((logo) => (
                      <CommandItem
                        key={logo.id}
                        value={`logo-${logo.id}-${logo.name}-${logo.full_name}`}
                        onSelect={() => {
                          const element = document.getElementById(`logo-${logo.id}`)
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                            element.classList.add('ring-2', 'ring-blue-500')
                            setTimeout(() => {
                              element.classList.remove('ring-2', 'ring-blue-500')
                            }, 2000)
                          }
                          setCommandSearch("")
                        }}
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        <div className="flex-1">
                          <span className="font-medium">{logo.name}</span>
                          <p className="text-xs text-gray-500">{logo.full_name}</p>
                        </div>
                        <Badge variant={logo.is_active ? "default" : "secondary"} className="text-xs">
                          {logo.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {/* Thèmes correspondants */}
              {MONTHLY_THEMES.filter(theme => {
                if (!commandSearch) return false
                const search = commandSearch.toLowerCase()
                return (
                  theme.name.toLowerCase().includes(search) ||
                  theme.description.toLowerCase().includes(search) ||
                  (theme.month && months[theme.month - 1]?.toLowerCase().includes(search))
                )
              }).length > 0 && (
                <CommandGroup heading="Thèmes">
                  {MONTHLY_THEMES
                    .filter(theme => {
                      if (!commandSearch) return false
                      const search = commandSearch.toLowerCase()
                      return (
                        theme.name.toLowerCase().includes(search) ||
                        theme.description.toLowerCase().includes(search) ||
                        (theme.month && months[theme.month - 1]?.toLowerCase().includes(search))
                      )
                    })
                    .map((theme) => (
                      <CommandItem
                        key={theme.id}
                        value={`theme-${theme.id}-${theme.name}-${theme.description}`}
                        onSelect={() => {
                          setFilterTheme(theme.id)
                          setSelectedMonth(theme.month || null)
                          setCommandSearch("")
                          // Scroll vers la section des filtres
                          const element = document.querySelector('[data-section="filters"]')
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        }}
                      >
                        <div 
                          className="w-4 h-4 mr-2 rounded-full"
                          style={{ backgroundColor: theme.color }}
                        />
                        <div className="flex-1">
                          <span className="font-medium">{theme.name}</span>
                          {theme.month && (
                            <p className="text-xs text-gray-500">{months[theme.month - 1]}</p>
                          )}
                        </div>
                        <CommandShortcut>Filtrer</CommandShortcut>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {/* Mois correspondants */}
              {months.filter((month, index) => {
                if (!commandSearch) return false
                const search = commandSearch.toLowerCase()
                return month.toLowerCase().includes(search) || 
                       (index + 1).toString().includes(search)
              }).length > 0 && (
                <CommandGroup heading="Mois">
                  {months
                    .map((month, index) => {
                      const search = commandSearch.toLowerCase()
                      if (search && !month.toLowerCase().includes(search) && 
                          !(index + 1).toString().includes(search)) {
                        return null
                      }
                      return (
                        <CommandItem
                          key={index}
                          value={`month-${index + 1}-${month}`}
                          onSelect={() => {
                            setFilterMonth(index + 1)
                            setSelectedMonth(index + 1)
                            setCommandSearch("")
                            const element = document.querySelector('[data-section="filters"]')
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{month}</span>
                          {index + 1 === new Date().getMonth() + 1 && (
                            <Badge variant="default" className="text-xs ml-2">Mois actuel</Badge>
                          )}
                          <CommandShortcut>Filtrer</CommandShortcut>
                        </CommandItem>
                      )
                    })
                    .filter(Boolean)}
                </CommandGroup>
              )}

              {/* Événements correspondants */}
              {getUpcomingEvents(20).filter(event => {
                if (!commandSearch) return false
                const search = commandSearch.toLowerCase()
                return (
                  event.title.toLowerCase().includes(search) ||
                  event.description.toLowerCase().includes(search)
                )
              }).length > 0 && (
                <CommandGroup heading="Événements">
                  {getUpcomingEvents(20)
                    .filter(event => {
                      if (!commandSearch) return false
                      const search = commandSearch.toLowerCase()
                      return (
                        event.title.toLowerCase().includes(search) ||
                        event.description.toLowerCase().includes(search)
                      )
                    })
                    .slice(0, 5)
                    .map((event) => (
                      <CommandItem
                        key={event.id}
                        value={`event-${event.id}-${event.title}`}
                        onSelect={() => {
                          setSelectedDate(new Date(event.date))
                          setCurrentMonth(new Date(event.date))
                          setCommandSearch("")
                          const element = document.querySelector('[data-section="calendar"]')
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        }}
                      >
                        <CalendarDays className="w-4 h-4 mr-2" />
                        <div className="flex-1">
                          <span className="font-medium">{event.title}</span>
                          <p className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {/* Actions rapides */}
              {!commandSearch && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Actions Rapides">
                    <CommandItem
                      value="add-photo"
                      onSelect={() => {
                        const element = document.querySelector('[data-section="add-photo"]')
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                        setCommandSearch("")
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Ajouter une photo</span>
                      <CommandShortcut>⌘N</CommandShortcut>
                    </CommandItem>
                    <CommandItem
                      value="add-logo"
                      onSelect={() => {
                        const element = document.querySelector('[data-section="add-logo"]')
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                        setCommandSearch("")
                      }}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>Ajouter un logo</span>
                    </CommandItem>
                    <CommandItem
                      value="calendar"
                      onSelect={() => {
                        const element = document.querySelector('[data-section="calendar"]')
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                        setCommandSearch("")
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Voir le calendrier</span>
                      <CommandShortcut>⌘K</CommandShortcut>
                    </CommandItem>
                    <CommandItem
                      value="filters"
                      onSelect={() => {
                        const element = document.querySelector('[data-section="filters"]')
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                        setCommandSearch("")
                      }}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      <span>Ouvrir les filtres</span>
                      <CommandShortcut>⌘F</CommandShortcut>
                    </CommandItem>
                    <CommandItem
                      value="logout"
                      onSelect={() => {
                        handleLogout()
                        setCommandSearch("")
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Déconnexion</span>
                      <CommandShortcut>⌘⇧Q</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
          {/* Indicateur de raccourci clavier */}
          {!commandSearch && (
            <div className="absolute right-3 top-3 flex items-center gap-1 text-xs text-gray-400 pointer-events-none">
              <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono">
                ⌘
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono">
                K
              </kbd>
            </div>
          )}
          </div>
        </div>
        
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
        <Card className="mb-8" data-section="calendar">
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
        <Card className="mb-8 border-2 border-dashed border-odillon-teal" data-section="add-photo">
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
        <Card className="mb-6" data-section="filters">
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
                    id={`photo-${photo.id}`}
                    key={photo.id}
                    className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
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

        {/* Gestion des Logos du Marquee */}
        <Card className="mt-8 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Gestion des Logos du Marquee
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Formulaire d'ajout */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300" data-section="add-logo">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Ajouter un nouveau logo
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom court *
                  </label>
                  <Input
                    placeholder="Ex: CDC"
                    value={newLogo.name}
                    onChange={(e) => setNewLogo({ ...newLogo, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <Input
                    placeholder="Ex: Caisse des Dépôts et Consignations"
                    value={newLogo.full_name}
                    onChange={(e) => setNewLogo({ ...newLogo, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chemin du logo *
                  </label>
                  <Input
                    placeholder="/images/logos/nom-du-logo.webp"
                    value={newLogo.logo_path}
                    onChange={(e) => setNewLogo({ ...newLogo, logo_path: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format recommandé : WebP. Ex: /images/logos/cdc.webp
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texte de fallback *
                  </label>
                  <Input
                    placeholder="Ex: CDC"
                    value={newLogo.fallback}
                    onChange={(e) => setNewLogo({ ...newLogo, fallback: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur (hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={newLogo.color}
                      onChange={(e) => setNewLogo({ ...newLogo, color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      placeholder="#1A9B8E"
                      value={newLogo.color}
                      onChange={(e) => setNewLogo({ ...newLogo, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Button
                    onClick={handleAddLogo}
                    className="bg-odillon-teal hover:bg-odillon-teal/90 w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter le logo
                  </Button>
                </div>
              </div>
            </div>

            {/* Liste des logos */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Logos actuels ({logos.filter(l => l.is_active).length} actifs / {logos.length} total)
                {loadingLogos && <Loader2 className="inline w-4 h-4 ml-2 animate-spin" />}
              </h3>
              {loadingLogos ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-odillon-teal" />
                  <span className="ml-3 text-gray-600">Chargement des logos...</span>
                </div>
              ) : logos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Aucun logo pour le moment</p>
                  <p className="text-sm mt-2">Ajoutez votre premier logo ci-dessus !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logos.map((logo, index) => (
                    <div
                      id={`logo-${logo.id}`}
                      key={logo.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        logo.is_active ? 'border-green-500 bg-green-50/50' : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      {/* Ordre */}
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveLogoOrder(logo.id, 'up')}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <span className="text-xs text-center font-medium text-gray-600">
                          {logo.display_order}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveLogoOrder(logo.id, 'down')}
                          disabled={index === logos.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Aperçu du logo */}
                      <div className="flex-shrink-0 w-24 h-16 bg-white border border-gray-200 rounded flex items-center justify-center overflow-hidden">
                        <img
                          src={logo.logo_path}
                          alt={logo.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            // Afficher le fallback si l'image ne charge pas
                            const target = e.currentTarget
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              const fallback = parent.querySelector('.logo-fallback') as HTMLElement
                              if (fallback) fallback.style.display = 'flex'
                            }
                          }}
                        />
                        <div
                          className="logo-fallback hidden flex-col items-center justify-center w-full h-full"
                          style={{ color: logo.color }}
                        >
                          <span className="text-lg font-bold">{logo.fallback}</span>
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">{logo.name}</h4>
                          <Badge
                            variant={logo.is_active ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {logo.is_active ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{logo.full_name}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {logo.logo_path}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => toggleLogoActive(logo.id)}
                          title={logo.is_active ? "Désactiver" : "Activer"}
                        >
                          {logo.is_active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteLogo(logo.id)}
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images actuellement affichées dans le Hero */}
        <Card className="mt-8 bg-gradient-to-br from-odillon-teal/10 to-odillon-lime/10 border-odillon-teal">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Images Actuellement Affichées dans le Hero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white/80 rounded-lg p-4 border border-odillon-teal/20">
                <h4 className="font-semibold text-gray-900 mb-3">📍 Où sont stockées les images ?</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-odillon-teal mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">1. Images téléversées (prioritaires)</p>
                      <p className="text-gray-600 mt-1">
                        Stockées dans <strong>Supabase Storage</strong> (bucket: <code className="bg-gray-100 px-1 rounded">hero-photos</code>)
                        <br />
                        Référencées dans la table <code className="bg-gray-100 px-1 rounded">photos</code> de la base de données
                        <br />
                        <span className="text-odillon-teal font-medium">✓ Ces images remplacent les images par défaut si elles existent</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-odillon-lime mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">2. Images par défaut (fallback)</p>
                      <p className="text-gray-600 mt-1">
                        Stockées dans le <strong>code source</strong> du composant Hero
                        <br />
                        URLs Unsplash : <code className="bg-gray-100 px-1 rounded text-xs">images.unsplash.com</code>
                        <br />
                        <span className="text-amber-600 font-medium">⚠️ Utilisées uniquement si aucune photo téléversée n'est active</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-lg p-4 border border-odillon-teal/20">
                <h4 className="font-semibold text-gray-900 mb-3">🔍 Images actuellement chargées</h4>
                <HeroImagesDebugger />
              </div>
            </div>
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

