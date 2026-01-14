"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
} from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Upload, Trash2, Eye, EyeOff, Plus, Calendar, Loader2, LogOut, CalendarDays, Search, Filter, X, Building2, ArrowUp, ArrowDown, Video, Settings, Image as ImageIcon, Edit, Quote } from "lucide-react"
import { HeroImagesDebugger } from "@/components/admin/hero-images-debugger"
import { MONTHLY_THEMES } from "@/lib/photo-themes"
import { createClient } from "@/lib/supabase/client"
import { getEventForDate, hasEvent, getUpcomingEvents, getEventsForMonth, type GabonEvent } from "@/lib/gabon-events"

interface Photo {
  id: string
  url: string
  description: string
  location: string | null // Lieu ou point particulier pour le badge
  month: number | null
  theme_id: string | null
  section_id: string | null
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

interface Video {
  id: string
  title: string
  description: string | null
  url: string
  type: 'youtube' | 'vimeo' | 'direct'
  thumbnail: string | null
  category: 'presentation' | 'testimonial'
  is_active: boolean
  display_order: number
}

interface PhotoSection {
  id: string
  title: string
  description: string | null
  badge: string | null
  page: string
  position_after: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Testimonial {
  id: string
  quote: string
  name: string
  position: string
  avatar_url: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminPhotosPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [logos, setLogos] = useState<CompanyLogo[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [photoSections, setPhotoSections] = useState<PhotoSection[]>([])
  const [loadingSections, setLoadingSections] = useState(false)
  const [loadingTestimonials, setLoadingTestimonials] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingLogos, setLoadingLogos] = useState(false)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Paramètres de visibilité
  const [siteSettings, setSiteSettings] = useState({
    show_videos_section: true,
    show_photos_section: true,
    services_cta_image_url: null as string | null,
    expertise_image_url: null as string | null
  })
  const [loadingSettings, setLoadingSettings] = useState(false)
  const [uploadingCtaImage, setUploadingCtaImage] = useState(false)
  const [uploadingExpertiseImage, setUploadingExpertiseImage] = useState(false)

  // Calendrier
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<GabonEvent | undefined>()
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMonth, setFilterMonth] = useState<number | null>(null)
  const [filterTheme, setFilterTheme] = useState<string | null>(null)
  const [filterSection, setFilterSection] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all") // "all" | "active" | "inactive"

  // État pour la recherche command
  const [commandSearch, setCommandSearch] = useState("")
  const [commandOpen, setCommandOpen] = useState(false)

  // État pour l'édition de photo
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [editPhotoForm, setEditPhotoForm] = useState({
    description: "",
    location: "",
    month: null as number | null,
    theme_id: null as string | null,
    section_id: null as string | null
  })

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
    location: "" as string,
    month: null as number | null,
    theme_id: null as string | null,
    section_id: null as string | null
  })

  // Formulaire d'ajout de logo
  const [newLogo, setNewLogo] = useState({
    name: "",
    full_name: "",
    logo_path: "",
    fallback: "",
    color: "#39837a"
  })

  // Formulaire d'ajout de vidéo
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    url: "",
    type: "youtube" as 'youtube' | 'vimeo' | 'direct',
    thumbnail: "",
    category: "presentation" as 'presentation' | 'testimonial'
  })

  // Formulaire d'ajout de témoignage
  const [newTestimonial, setNewTestimonial] = useState({
    quote: "",
    name: "",
    position: "",
    avatar_url: ""
  })

  // Formulaire d'ajout de section photo
  const [newPhotoSection, setNewPhotoSection] = useState<{
    title: string
    description: string
    badge: string
    page: 'home' | 'services' | 'expertise' | 'about' | 'contact'
    position_reference: string | null
    position_type: "before" | "after" | "end"
  }>({
    title: "",
    description: "",
    badge: "",
    page: "home",
    position_reference: null,
    position_type: "end" // "before", "after", ou "end" (à la fin)
  })

  // Pages disponibles
  const availablePages = [
    { value: 'home', label: 'Page d\'accueil', path: '/' },
    { value: 'services', label: 'Services', path: '/services' },
    { value: 'about', label: 'À propos', path: '/a-propos' },
    { value: 'contact', label: 'Contact', path: '/contact' }
  ]

  // Type de contenu à ajouter (vidéo ou photo)
  const [contentType, setContentType] = useState<'video' | 'photo'>('video')

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
      loadVideos()
      loadTestimonials()
      loadSiteSettings()
      loadPhotoSections()
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

    // Filtre par section
    if (filterSection) {
      if (filterSection === "none" && photo.section_id !== null) {
        return false
      }
      if (filterSection !== "none" && photo.section_id !== filterSection) {
        return false
      }
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
          location: newPhoto.location || null,
          month: newPhoto.month,
          theme_id: newPhoto.theme_id,
          section_id: newPhoto.section_id,
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
        location: "",
        month: null,
        theme_id: null,
        section_id: null
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

  const openEditDialog = (photo: Photo) => {
    setEditingPhoto(photo)
    setEditPhotoForm({
      description: photo.description,
      location: photo.location || "",
      month: photo.month,
      theme_id: photo.theme_id,
      section_id: photo.section_id
    })
  }

  const updatePhoto = async () => {
    if (!editingPhoto) return

    try {
      const res = await fetch(`/api/photos/${editingPhoto.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editPhotoForm.description,
          location: editPhotoForm.location || null,
          month: editPhotoForm.month,
          theme_id: editPhotoForm.theme_id,
          section_id: editPhotoForm.section_id
        })
      })

      if (!res.ok) throw new Error("Erreur lors de la mise à jour")

      // Mettre à jour localement
      setPhotos(photos.map(p =>
        p.id === editingPhoto.id
          ? { ...p, ...editPhotoForm, location: editPhotoForm.location || null }
          : p
      ))

      setEditingPhoto(null)
      alert("Photo mise à jour avec succès !")
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
        color: "#39837a"
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

  const loadVideos = async () => {
    try {
      setLoadingVideos(true)
      const res = await fetch('/api/videos')
      if (!res.ok) throw new Error("Erreur lors du chargement")

      const data = await res.json()
      setVideos(data.videos || [])
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de charger les vidéos"
      console.error("Erreur lors du chargement des vidéos:", error)
      alert(errorMessage)
    } finally {
      setLoadingVideos(false)
    }
  }

  const handleAddVideo = async () => {
    if (!newVideo.title.trim() || !newVideo.url.trim()) {
      alert("Veuillez remplir le titre et l'URL de la vidéo")
      return
    }

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newVideo,
          is_active: true,
          display_order: videos.filter(v => v.category === newVideo.category).length + 1
        })
      })

      if (!res.ok) throw new Error("Erreur lors de la création")

      alert("✅ Vidéo ajoutée avec succès !")

      setNewVideo({
        title: "",
        description: "",
        url: "",
        type: "youtube",
        thumbnail: "",
        category: "presentation"
      })

      loadVideos()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'ajout de la vidéo"
      console.error("Erreur lors de l'ajout de la vidéo:", error)
      alert(errorMessage)
    }
  }

  const toggleVideoActive = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId)
    if (!video) return

    try {
      const res = await fetch(`/api/videos/${videoId}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !video.is_active })
      })

      if (!res.ok) throw new Error("Erreur")

      setVideos(videos.map(v =>
        v.id === videoId ? { ...v, is_active: !v.is_active } : v
      ))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      console.error("Erreur lors de la mise à jour:", error)
      alert(errorMessage)
    }
  }

  const deleteVideo = async (videoId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) return

    try {
      const res = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error("Erreur lors de la suppression")

      alert("Vidéo supprimée avec succès")
      loadVideos()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression"
      console.error("Erreur lors de la suppression:", error)
      alert(errorMessage)
    }
  }

  // Gestion des témoignages
  const loadTestimonials = async () => {
    try {
      setLoadingTestimonials(true)
      const res = await fetch('/api/testimonials')
      if (!res.ok) throw new Error("Erreur lors du chargement")

      const data = await res.json()
      setTestimonials(data.testimonials || [])
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de charger les témoignages"
      console.error("Erreur lors du chargement des témoignages:", error)
      alert(errorMessage)
    } finally {
      setLoadingTestimonials(false)
    }
  }

  const handleAddTestimonial = async () => {
    if (!newTestimonial.quote.trim() || !newTestimonial.name.trim() || !newTestimonial.position.trim() || !newTestimonial.avatar_url.trim()) {
      alert("Veuillez remplir tous les champs du témoignage")
      return
    }

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTestimonial,
          is_active: true,
          display_order: testimonials.length + 1
        })
      })

      if (!res.ok) throw new Error("Erreur lors de la création")

      alert("✅ Témoignage ajouté avec succès !")

      setNewTestimonial({
        quote: "",
        name: "",
        position: "",
        avatar_url: ""
      })

      loadTestimonials()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'ajout du témoignage"
      console.error("Erreur lors de l'ajout du témoignage:", error)
      alert(errorMessage)
    }
  }

  const toggleTestimonialActive = async (testimonialId: string) => {
    const testimonial = testimonials.find(t => t.id === testimonialId)
    if (!testimonial) return

    try {
      const res = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !testimonial.is_active })
      })

      if (!res.ok) throw new Error("Erreur")

      setTestimonials(testimonials.map(t =>
        t.id === testimonialId ? { ...t, is_active: !t.is_active } : t
      ))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      console.error("Erreur lors de la mise à jour:", error)
      alert(errorMessage)
    }
  }

  const deleteTestimonial = async (testimonialId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) return

    try {
      const res = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error("Erreur lors de la suppression")

      alert("Témoignage supprimé avec succès")
      loadTestimonials()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression"
      console.error("Erreur lors de la suppression:", error)
      alert(errorMessage)
    }
  }

  // Gestion des sections photos
  const loadPhotoSections = async () => {
    try {
      setLoadingSections(true)
      const res = await fetch('/api/photo-sections')
      if (!res.ok) throw new Error("Erreur lors du chargement")

      const data = await res.json()
      setPhotoSections(data.sections || [])
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de charger les sections"
      console.error("Erreur lors du chargement des sections:", error)
      alert(errorMessage)
    } finally {
      setLoadingSections(false)
    }
  }

  const handleAddPhotoSection = async () => {
    if (!newPhotoSection.title.trim()) {
      alert("Veuillez remplir le titre de la section")
      return
    }

    // Validation : si "Au-dessus" ou "En dessous" est sélectionné, une section doit être choisie
    if ((newPhotoSection.position_type === "before" || newPhotoSection.position_type === "after") && !newPhotoSection.position_reference) {
      alert("Veuillez sélectionner une section de référence pour positionner la nouvelle section")
      return
    }

    try {
      // Calculer le display_order en fonction de la position
      // Utiliser TOUTES les sections (actives et inactives) pour le calcul
      let displayOrder = 0
      const sectionsOnPage = photoSections
        .filter(s => s.page === newPhotoSection.page)
        .sort((a, b) => a.display_order - b.display_order)

      if (newPhotoSection.position_type === "end" || !newPhotoSection.position_reference) {
        // Placer à la fin
        displayOrder = sectionsOnPage.length > 0
          ? Math.max(...sectionsOnPage.map(s => s.display_order)) + 1
          : 0
      } else {
        // Placer avant ou après la section de référence (peut être active ou inactive)
        const referenceSection = sectionsOnPage.find(s => s.id === newPhotoSection.position_reference)
        if (referenceSection) {
          if (newPhotoSection.position_type === "before") {
            // Placer avant : prendre le display_order de la section de référence
            displayOrder = referenceSection.display_order
            // Décaler la section de référence et toutes les suivantes (actives et inactives)
            const sectionsToUpdate = sectionsOnPage
              .filter(s => s.display_order >= displayOrder)
              .sort((a, b) => a.display_order - b.display_order)

            const updateResponses = await Promise.all(
              sectionsToUpdate.map(section =>
                fetch(`/api/photo-sections/${section.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ display_order: section.display_order + 1 })
                })
              )
            )

            // Vérifier que toutes les réponses sont réussies
            const failedUpdates = updateResponses.filter(res => !res.ok)
            if (failedUpdates.length > 0) {
              const errorData = await failedUpdates[0].json().catch(() => ({ error: "Erreur lors de la mise à jour" }))
              throw new Error(errorData.error || "Erreur lors de la mise à jour de l'ordre des sections")
            }
          } else if (newPhotoSection.position_type === "after") {
            // Placer après : prendre le display_order + 1
            displayOrder = referenceSection.display_order + 1
            // Décaler toutes les sections suivantes (actives et inactives)
            const sectionsToUpdate = sectionsOnPage
              .filter(s => s.display_order >= displayOrder)
              .sort((a, b) => a.display_order - b.display_order)

            const updateResponses = await Promise.all(
              sectionsToUpdate.map(section =>
                fetch(`/api/photo-sections/${section.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ display_order: section.display_order + 1 })
                })
              )
            )

            // Vérifier que toutes les réponses sont réussies
            const failedUpdates = updateResponses.filter(res => !res.ok)
            if (failedUpdates.length > 0) {
              const errorData = await failedUpdates[0].json().catch(() => ({ error: "Erreur lors de la mise à jour" }))
              throw new Error(errorData.error || "Erreur lors de la mise à jour de l'ordre des sections")
            }
          }
        } else {
          // Si la section référencée n'existe plus, placer à la fin
          displayOrder = sectionsOnPage.length > 0
            ? Math.max(...sectionsOnPage.map(s => s.display_order)) + 1
            : 0
        }
      }

      const res = await fetch("/api/photo-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPhotoSection.title,
          description: newPhotoSection.description || null,
          badge: newPhotoSection.badge || null,
          page: newPhotoSection.page,
          position_after: newPhotoSection.position_type === "after" && newPhotoSection.position_reference
            ? newPhotoSection.position_reference
            : null,
          is_active: true,
          display_order: displayOrder
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Erreur lors de la création" }))
        throw new Error(errorData.error || "Erreur lors de la création")
      }

      alert("✅ Section photo ajoutée avec succès !")

      setNewPhotoSection({
        title: "",
        description: "",
        badge: "",
        page: "home",
        position_reference: null,
        position_type: "end"
      })

      loadPhotoSections()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'ajout de la section"
      console.error("Erreur lors de l'ajout de la section:", error)
      alert(errorMessage)
    }
  }

  const toggleSectionActive = async (sectionId: string) => {
    const section = photoSections.find(s => s.id === sectionId)
    if (!section) return

    try {
      const res = await fetch(`/api/photo-sections/${sectionId}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !section.is_active })
      })

      if (!res.ok) throw new Error("Erreur")

      setPhotoSections(photoSections.map(s =>
        s.id === sectionId ? { ...s, is_active: !s.is_active } : s
      ))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      console.error("Erreur lors de la mise à jour:", error)
      alert(errorMessage)
    }
  }

  const deletePhotoSection = async (sectionId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette section ? Les photos associées ne seront pas supprimées mais ne seront plus associées à une section.")) return

    try {
      const res = await fetch(`/api/photo-sections/${sectionId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Erreur lors de la suppression" }))
        throw new Error(errorData.error || "Erreur lors de la suppression")
      }

      const data = await res.json()
      alert(data.message || "Section supprimée avec succès")
      loadPhotoSections()
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
      const [logoResponse, otherLogoResponse] = await Promise.all([
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

      // Vérifier que toutes les réponses sont réussies
      if (!logoResponse.ok || !otherLogoResponse.ok) {
        const failedResponse = !logoResponse.ok ? logoResponse : otherLogoResponse
        const errorData = await failedResponse.json().catch(() => ({ error: "Erreur lors de la mise à jour" }))
        throw new Error(errorData.error || "Erreur lors de la mise à jour de l'ordre des logos")
      }

      loadLogos()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors du déplacement"
      console.error("Erreur lors du déplacement:", error)
      alert(errorMessage)
    }
  }

  const currentTheme = MONTHLY_THEMES.find(t => t.month === new Date().getMonth() + 1)

  // Charger les paramètres du site
  const loadSiteSettings = async () => {
    try {
      setLoadingSettings(true)
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error("Erreur lors du chargement")

      const data = await res.json()
      if (data.settings) {
        setSiteSettings({
          show_videos_section: data.settings.show_videos_section ?? true,
          show_photos_section: data.settings.show_photos_section ?? true,
          services_cta_image_url: data.settings.services_cta_image_url ?? null,
          expertise_image_url: data.settings.expertise_image_url ?? null
        })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de charger les paramètres"
      console.error("Erreur lors du chargement des paramètres:", error)
      // Ne pas afficher d'alerte, utiliser les valeurs par défaut
    } finally {
      setLoadingSettings(false)
    }
  }

  // Mettre à jour les paramètres de visibilité
  const updateSiteSettings = async (key: 'show_videos_section' | 'show_photos_section', value: boolean) => {
    try {
      setLoadingSettings(true)
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      })

      if (!res.ok) throw new Error("Erreur lors de la mise à jour")

      const data = await res.json()
      if (data.settings) {
        setSiteSettings({
          show_videos_section: data.settings.show_videos_section ?? true,
          show_photos_section: data.settings.show_photos_section ?? true,
          services_cta_image_url: data.settings.services_cta_image_url ?? siteSettings.services_cta_image_url,
          expertise_image_url: data.settings.expertise_image_url ?? siteSettings.expertise_image_url
        })
        alert(`✅ Paramètre mis à jour : ${key === 'show_videos_section' ? 'Section vidéos' : 'Section photos'} ${value ? 'affichée' : 'masquée'}`)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      console.error("Erreur lors de la mise à jour des paramètres:", error)
      alert(errorMessage)
    } finally {
      setLoadingSettings(false)
    }
  }

  // Mettre à jour la photo CTA des services
  const updateServicesCtaImage = async (file: File | null, url: string | null) => {
    try {
      setUploadingCtaImage(true)
      let imageUrl = url

      // Si un fichier est fourni, l'uploader
      if (file) {
        const formData = new FormData()
        formData.append("file", file)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        })

        if (!uploadRes.ok) throw new Error("Erreur lors de l'upload")

        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }

      // Mettre à jour les paramètres
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services_cta_image_url: imageUrl })
      })

      if (!res.ok) throw new Error("Erreur lors de la mise à jour")

      const data = await res.json()
      if (data.settings) {
        setSiteSettings({
          ...siteSettings,
          services_cta_image_url: data.settings.services_cta_image_url ?? null
        })
        alert('✅ Photo CTA des services mise à jour avec succès !')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      console.error("Erreur lors de la mise à jour de la photo CTA:", error)
      alert(errorMessage)
    } finally {
      setUploadingCtaImage(false)
    }
  }

  // Mettre à jour la photo de la section Expertise
  const updateExpertiseImage = async (file: File | null, url: string | null) => {
    try {
      setUploadingExpertiseImage(true)
      let imageUrl = url

      // Si un fichier est fourni, l'uploader
      if (file) {
        const formData = new FormData()
        formData.append("file", file)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        })

        if (!uploadRes.ok) throw new Error("Erreur lors de l'upload")

        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }

      // Mettre à jour les paramètres
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertise_image_url: imageUrl })
      })

      if (!res.ok) throw new Error("Erreur lors de la mise à jour")

      const data = await res.json()
      if (data.settings) {
        setSiteSettings({
          ...siteSettings,
          expertise_image_url: data.settings.expertise_image_url ?? null
        })
        alert('✅ Photo de la section Expertise mise à jour avec succès !')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      console.error("Erreur lors de la mise à jour de la photo Expertise:", error)
      alert(errorMessage)
    } finally {
      setUploadingExpertiseImage(false)
    }
  }

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
              shouldFilter={false}
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
                        value="add-photo ajouter une photo"
                        keywords={["ajouter", "photo", "add", "photo"]}
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
                        value="add-logo ajouter un logo"
                        keywords={["ajouter", "logo", "add", "logo"]}
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
                        value="calendar voir le calendrier"
                        keywords={["calendrier", "calendar", "voir", "view"]}
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
                        <CommandShortcut>⌘C</CommandShortcut>
                      </CommandItem>
                      <CommandItem
                        value="filters ouvrir les filtres"
                        keywords={["filtres", "filters", "ouvrir", "open"]}
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
                        value="logout déconnexion"
                        keywords={["déconnexion", "logout", "disconnect"]}
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
                          className={`p-2 rounded-lg border-2 transition-all text-xs ${selectedMonth === theme.month
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
                    className={`w-full px-3 py-2 border rounded-md ${newPhoto.month === 11 ? 'border-green-500 bg-green-50' : 'border-gray-300'
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
                  className={`w-full px-3 py-2 border rounded-md ${currentMonthEvents.some(e => e.type === 'awareness') ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section photo (optionnel)
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    Pour afficher sur une page spécifique
                  </span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newPhoto.section_id || ""}
                  onChange={(e) => setNewPhoto({ ...newPhoto, section_id: e.target.value || null })}
                  disabled={uploading}
                >
                  <option value="">Aucune section (photo générale)</option>
                  {photoSections
                    .filter(s => s.is_active)
                    .sort((a, b) => {
                      const pageOrder = ['home', 'services', 'expertise', 'about', 'contact']
                      const pageDiff = pageOrder.indexOf(a.page) - pageOrder.indexOf(b.page)
                      if (pageDiff !== 0) return pageDiff
                      return a.display_order - b.display_order
                    })
                    .map((section) => {
                      const pageLabel = availablePages.find(p => p.value === section.page)?.label || section.page
                      return (
                        <option key={section.id} value={section.id}>
                          {pageLabel} - {section.title}
                          {section.badge ? ` (${section.badge})` : ''}
                        </option>
                      )
                    })}
                </select>
                {newPhoto.section_id && (
                  <p className="text-xs text-blue-600 mt-1">
                    ✓ Cette photo sera associée à la section sélectionnée
                  </p>
                )}
                {!newPhoto.section_id && photoSections.filter(s => s.is_active).length === 0 && (
                  <div className="text-xs text-amber-600 mt-2 p-3 bg-amber-50 border border-amber-200 rounded">
                    <p className="font-medium mb-2">⚠️ Aucune section photo disponible</p>
                    <p className="mb-2">Pour ajouter des photos de fond à la page Contact :</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2 mb-2">
                      <li>Descendez jusqu'à la section <strong>"Gestion des Sections Photos"</strong> (en bas de la page)</li>
                      <li>Créez une nouvelle section avec :</li>
                      <li className="ml-4">- Titre : <strong>"Hero Contact"</strong></li>
                      <li className="ml-4">- Page : <strong>"Contact"</strong></li>
                      <li className="ml-4">- Badge (optionnel) : <strong>"Hero"</strong></li>
                      <li>Revenez ici et sélectionnez cette section dans le menu déroulant</li>
                    </ol>
                    <button
                      type="button"
                      onClick={() => {
                        const section = document.querySelector('[data-section="photo-sections"]')
                        if (section) {
                          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }}
                      className="text-xs text-amber-700 hover:text-amber-900 underline font-medium"
                    >
                      ↓ Aller à la section "Gestion des Sections Photos"
                    </button>
                  </div>
                )}
                {!newPhoto.section_id && photoSections.filter(s => s.is_active).length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Pour les photos de fond de la page Contact, sélectionnez une section "Contact" dans le menu ci-dessus
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recherche et Filtres - Version Compacte */}
        <Card className="mb-6" data-section="filters">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Barre de recherche et filtres horizontale */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Barre de recherche */}
                <div className="relative flex-1">
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Effacer la recherche"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filtres compacts */}
                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  {/* Filtre par mois */}
                  <Select
                    value={filterMonth?.toString() || "all"}
                    onValueChange={(value) => setFilterMonth(value === "all" ? null : parseInt(value))}
                  >
                    <SelectTrigger className="w-[140px] sm:w-[160px]">
                      <SelectValue placeholder="Mois" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les mois</SelectItem>
                      {months.map((month, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Filtre par thématique */}
                  <Select
                    value={filterTheme || "all"}
                    onValueChange={(value) => setFilterTheme(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[160px] sm:w-[180px]">
                      <SelectValue placeholder="Thématique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les thématiques</SelectItem>
                      {MONTHLY_THEMES.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Filtre par section */}
                  <Select
                    value={filterSection || "all"}
                    onValueChange={(value) => setFilterSection(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[180px] sm:w-[200px]">
                      <SelectValue placeholder="Section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les sections</SelectItem>
                      <SelectItem value="none">Aucune section</SelectItem>
                      {photoSections
                        .filter(s => s.is_active)
                        .sort((a, b) => {
                          const pageOrder = ['home', 'services', 'expertise', 'about', 'contact']
                          const pageDiff = pageOrder.indexOf(a.page) - pageOrder.indexOf(b.page)
                          if (pageDiff !== 0) return pageDiff
                          return a.display_order - b.display_order
                        })
                        .map((section) => {
                          const pageLabel = availablePages.find(p => p.value === section.page)?.label || section.page
                          return (
                            <SelectItem key={section.id} value={section.id}>
                              {pageLabel} - {section.title}
                            </SelectItem>
                          )
                        })}
                    </SelectContent>
                  </Select>

                  {/* Filtre par statut */}
                  <Select
                    value={filterStatus}
                    onValueChange={(value) => setFilterStatus(value)}
                  >
                    <SelectTrigger className="w-[130px] sm:w-[140px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="active">Actives</SelectItem>
                      <SelectItem value="inactive">Inactives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Indicateur de filtres actifs - Version compacte */}
              {(searchTerm || filterMonth || filterTheme || filterSection || filterStatus !== "all") && (
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
                  <span className="text-xs text-gray-500 font-medium">Filtres actifs :</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {searchTerm && (
                      <Badge variant="secondary" className="gap-1.5 text-xs">
                        <span>Recherche: "{searchTerm}"</span>
                        <button
                          onClick={() => setSearchTerm("")}
                          className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                          aria-label="Supprimer le filtre de recherche"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filterMonth && (
                      <Badge variant="secondary" className="gap-1.5 text-xs">
                        <span>Mois: {months[filterMonth - 1]}</span>
                        <button
                          onClick={() => setFilterMonth(null)}
                          className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                          aria-label="Supprimer le filtre de mois"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filterTheme && (
                      <Badge
                        variant="secondary"
                        className="gap-1.5 text-xs"
                        style={{
                          backgroundColor: `${MONTHLY_THEMES.find(t => t.id === filterTheme)?.color}20`,
                          borderColor: MONTHLY_THEMES.find(t => t.id === filterTheme)?.color,
                          color: MONTHLY_THEMES.find(t => t.id === filterTheme)?.color,
                        }}
                      >
                        <span>Thème: {MONTHLY_THEMES.find(t => t.id === filterTheme)?.name}</span>
                        <button
                          onClick={() => setFilterTheme(null)}
                          className="hover:opacity-70 rounded-full p-0.5 transition-opacity"
                          aria-label="Supprimer le filtre de thème"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filterSection && (
                      <Badge variant="secondary" className="gap-1.5 text-xs">
                        <span>
                          Section: {
                            filterSection === "none"
                              ? "Aucune"
                              : photoSections.find(s => s.id === filterSection)
                                ? `${availablePages.find(p => p.value === photoSections.find(s => s.id === filterSection)?.page)?.label || ''} - ${photoSections.find(s => s.id === filterSection)?.title}`
                                : filterSection
                          }
                        </span>
                        <button
                          onClick={() => setFilterSection(null)}
                          className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                          aria-label="Supprimer le filtre de section"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filterStatus !== "all" && (
                      <Badge variant="secondary" className="gap-1.5 text-xs">
                        <span>Statut: {filterStatus === "active" ? "Actives" : "Inactives"}</span>
                        <button
                          onClick={() => setFilterStatus("all")}
                          className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                          aria-label="Supprimer le filtre de statut"
                        >
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
                        setFilterSection(null)
                        setFilterStatus("all")
                      }}
                      className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Tout réinitialiser
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
                    className={`relative group rounded-lg overflow-hidden border-2 transition-all ${photo.is_active ? 'border-green-500' : 'border-gray-300'
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
                          onClick={() => openEditDialog(photo)}
                          title="Éditer"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
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
                        {photo.location && (
                          <Badge variant="outline" className="text-xs border-odillon-teal text-odillon-teal">
                            📍 {photo.location}
                          </Badge>
                        )}
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
                        {photo.section_id && (
                          <Badge
                            variant="outline"
                            className="text-xs border-blue-500 text-blue-700"
                            title={photoSections.find(s => s.id === photo.section_id)?.title || ''}
                          >
                            📍 {availablePages.find(p => p.value === photoSections.find(s => s.id === photo.section_id)?.page)?.label || 'Section'}
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
                      placeholder="#39837a"
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
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${logo.is_active ? 'border-green-500 bg-green-50/50' : 'border-gray-300 bg-gray-50'
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

        {/* Section Gestion des Sections Photos */}
        <Card className="mt-8 border-2 border-odillon-teal bg-gradient-to-br from-odillon-teal/5 to-odillon-lime/5" data-section="photo-sections">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Gestion des Sections Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Formulaire d'ajout de section */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-dashed border-odillon-teal">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Créer une nouvelle section photo
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de la section *
                  </label>
                  <Input
                    value={newPhotoSection.title}
                    onChange={(e) => setNewPhotoSection({ ...newPhotoSection, title: e.target.value })}
                    placeholder="Ex: Galerie Événements 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optionnel)
                  </label>
                  <Input
                    value={newPhotoSection.description}
                    onChange={(e) => setNewPhotoSection({ ...newPhotoSection, description: e.target.value })}
                    placeholder="Description de la section"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge (optionnel)
                  </label>
                  <Input
                    value={newPhotoSection.badge}
                    onChange={(e) => setNewPhotoSection({ ...newPhotoSection, badge: e.target.value })}
                    placeholder="Ex: Galerie"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page d'affichage *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newPhotoSection.page}
                      onChange={(e) => setNewPhotoSection({
                        ...newPhotoSection,
                        page: e.target.value as 'home' | 'services' | 'expertise' | 'about' | 'contact',
                        position_reference: null, // Réinitialiser la position quand on change de page
                        position_type: "end"
                      })}
                    >
                      {availablePages.map((page) => (
                        <option key={page.value} value={page.value}>
                          {page.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position (optionnel)
                    </label>
                    <div className="space-y-3">
                      {/* Choix du type de position */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setNewPhotoSection({
                            ...newPhotoSection,
                            position_type: "end",
                            position_reference: null
                          })}
                          className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${newPhotoSection.position_type === "end"
                            ? "bg-odillon-teal text-white border-odillon-teal"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          À la fin
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewPhotoSection({
                            ...newPhotoSection,
                            position_type: "before",
                            position_reference: null
                          })}
                          className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${newPhotoSection.position_type === "before"
                            ? "bg-odillon-teal text-white border-odillon-teal"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          Au-dessus
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewPhotoSection({
                            ...newPhotoSection,
                            position_type: "after",
                            position_reference: null
                          })}
                          className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${newPhotoSection.position_type === "after"
                            ? "bg-odillon-teal text-white border-odillon-teal"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          En dessous
                        </button>
                      </div>

                      {/* Sélecteur de section de référence (si avant ou après) */}
                      {(newPhotoSection.position_type === "before" || newPhotoSection.position_type === "after") && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {newPhotoSection.position_type === "before" ? "Au-dessus de :" : "En dessous de :"}
                          </label>
                          {(() => {
                            // Récupérer TOUTES les sections de la page (actives ET inactives) pour le positionnement
                            const allSectionsOnPage = photoSections
                              .filter(s => s.page === newPhotoSection.page)
                              .sort((a, b) => a.display_order - b.display_order)

                            if (allSectionsOnPage.length === 0) {
                              return (
                                <p className="text-xs text-gray-500 italic">
                                  Aucune section existante sur cette page. La section sera placée en première position.
                                </p>
                              )
                            }

                            return (
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                value={newPhotoSection.position_reference || ""}
                                onChange={(e) => setNewPhotoSection({
                                  ...newPhotoSection,
                                  position_reference: e.target.value || null
                                })}
                                required={newPhotoSection.position_type === "before" || newPhotoSection.position_type === "after"}
                              >
                                <option value="">Sélectionner une section</option>
                                {allSectionsOnPage.map((section, index) => {
                                  const sectionPhotos = photos.filter(p => p.section_id === section.id)
                                  return (
                                    <option key={section.id} value={section.id}>
                                      Position {index + 1} - {section.title}
                                      {section.badge ? ` (${section.badge})` : ''}
                                      {!section.is_active ? ' [Inactif]' : ''}
                                      {sectionPhotos.length > 0 ? ` - ${sectionPhotos.length} photo(s)` : ''}
                                    </option>
                                  )
                                })}
                              </select>
                            )
                          })()}
                        </div>
                      )}

                      {/* Liste des sections existantes sur la page (toujours visible pour référence) */}
                      {photoSections.filter(s => s.page === newPhotoSection.page).length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                          <p className="text-xs font-semibold text-blue-900 mb-2">
                            Sections existantes sur cette page :
                          </p>
                          <div className="space-y-1">
                            {photoSections
                              .filter(s => s.page === newPhotoSection.page)
                              .sort((a, b) => a.display_order - b.display_order)
                              .map((section, index) => {
                                const sectionPhotos = photos.filter(p => p.section_id === section.id)
                                return (
                                  <div
                                    key={section.id}
                                    className={`text-xs p-2 rounded border ${section.is_active
                                      ? 'bg-white border-gray-300'
                                      : 'bg-gray-100 border-gray-200 opacity-60'
                                      }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-700">
                                          {index + 1}.
                                        </span>
                                        <span className={section.is_active ? 'text-gray-900' : 'text-gray-500'}>
                                          {section.title}
                                        </span>
                                        {section.badge && (
                                          <Badge variant="outline" className="text-xs">
                                            {section.badge}
                                          </Badge>
                                        )}
                                        {!section.is_active && (
                                          <Badge variant="secondary" className="text-xs">
                                            Inactif
                                          </Badge>
                                        )}
                                      </div>
                                      <span className="text-gray-500">
                                        {sectionPhotos.length} photo(s)
                                      </span>
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                          <p className="text-xs text-blue-700 mt-2 italic">
                            💡 Toutes les sections (actives et inactives) peuvent être utilisées comme référence de position.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Aperçu visuel de la position */}
                {(newPhotoSection.title.trim() || photoSections.filter(s => s.page === newPhotoSection.page).length > 0) && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Aperçu de l'ordre des sections sur "{availablePages.find(p => p.value === newPhotoSection.page)?.label || newPhotoSection.page}"
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                      Les sections <strong>actives</strong> sont affichées en blanc, les sections <strong>inactives</strong> en gris clair.
                    </p>
                    <div className="space-y-2">
                      {(() => {
                        // Récupérer toutes les sections de la page (actives et inactives) pour l'aperçu
                        const allSectionsOnPage = photoSections
                          .filter(s => s.page === newPhotoSection.page)
                          .sort((a, b) => a.display_order - b.display_order)

                        // Pour le calcul de position, on utilise TOUTES les sections (actives et inactives)
                        // car on peut positionner par rapport à n'importe quelle section
                        const sectionsOnPage = allSectionsOnPage

                        // Calculer où la nouvelle section sera placée
                        let newSectionOrder = -1
                        let insertPosition = -1

                        if (newPhotoSection.position_type === "end" || !newPhotoSection.position_reference) {
                          newSectionOrder = sectionsOnPage.length > 0
                            ? Math.max(...sectionsOnPage.map(s => s.display_order)) + 1
                            : 0
                          insertPosition = sectionsOnPage.length
                        } else {
                          const referenceSection = sectionsOnPage.find(s => s.id === newPhotoSection.position_reference)
                          if (referenceSection) {
                            const refIndex = sectionsOnPage.findIndex(s => s.id === referenceSection.id)
                            if (newPhotoSection.position_type === "before") {
                              newSectionOrder = referenceSection.display_order
                              insertPosition = refIndex
                            } else if (newPhotoSection.position_type === "after") {
                              newSectionOrder = referenceSection.display_order + 1
                              insertPosition = refIndex + 1
                            }
                          } else {
                            // Si la section de référence n'est pas trouvée, placer à la fin
                            newSectionOrder = sectionsOnPage.length > 0
                              ? Math.max(...sectionsOnPage.map(s => s.display_order)) + 1
                              : 0
                            insertPosition = sectionsOnPage.length
                          }
                        }

                        // Créer la liste avec la nouvelle section insérée
                        // On utilise allSectionsOnPage pour montrer toutes les sections, mais on insère la nouvelle selon les sections actives
                        const previewSections = [...allSectionsOnPage]
                        if (newPhotoSection.title.trim()) {
                          // Trouver l'index dans allSectionsOnPage où insérer
                          let insertIndexInAll = insertPosition

                          if (newPhotoSection.position_type !== "end" && newPhotoSection.position_reference) {
                            // Si on insère avant ou après une section active, trouver son index dans allSectionsOnPage
                            const refSection = sectionsOnPage.find(s => s.id === newPhotoSection.position_reference)
                            if (refSection) {
                              insertIndexInAll = allSectionsOnPage.findIndex(s => s.id === refSection.id)
                              if (newPhotoSection.position_type === "after") {
                                insertIndexInAll += 1
                              }
                              // Si la section de référence n'est pas active, on doit trouver la bonne position
                              // parmi toutes les sections
                            }
                          } else {
                            // Insérer à la fin (après toutes les sections)
                            insertIndexInAll = allSectionsOnPage.length
                          }

                          previewSections.splice(insertIndexInAll, 0, {
                            id: 'preview-new',
                            title: newPhotoSection.title || '(Nouvelle section)',
                            description: newPhotoSection.description,
                            badge: newPhotoSection.badge,
                            page: newPhotoSection.page,
                            position_after: null,
                            display_order: newSectionOrder,
                            is_active: true,
                            created_at: '',
                            updated_at: ''
                          } as PhotoSection)
                        }

                        return previewSections.map((section, index) => {
                          const isNew = section.id === 'preview-new'
                          const sectionPhotos = photos.filter(p => p.section_id === section.id)
                          const isActive = section.is_active && !isNew

                          return (
                            <div key={section.id || `preview-${index}`}>
                              <div
                                className={`flex items-center gap-3 p-3 rounded-md border-2 transition-all ${isNew
                                  ? 'bg-odillon-teal/10 border-odillon-teal border-dashed shadow-md'
                                  : isActive
                                    ? 'bg-white border-gray-200'
                                    : 'bg-gray-100 border-gray-300 opacity-60'
                                  }`}
                              >
                                {/* Numéro d'ordre */}
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isNew
                                  ? 'bg-odillon-teal text-white'
                                  : isActive
                                    ? 'bg-gray-200 text-gray-700'
                                    : 'bg-gray-300 text-gray-500'
                                  }`}>
                                  {index + 1}
                                </div>

                                {/* Informations de la section */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className={`font-semibold ${isNew
                                      ? 'text-odillon-teal'
                                      : isActive
                                        ? 'text-gray-900'
                                        : 'text-gray-500'
                                      }`}>
                                      {section.title}
                                    </span>
                                    {isNew && (
                                      <Badge className="bg-odillon-teal text-white text-xs">
                                        Nouvelle
                                      </Badge>
                                    )}
                                    {!isNew && !isActive && (
                                      <Badge variant="secondary" className="text-xs">
                                        Inactif
                                      </Badge>
                                    )}
                                    {section.badge && (
                                      <Badge variant="outline" className="text-xs">
                                        {section.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  {section.description && (
                                    <p className={`text-xs truncate ${isActive || isNew ? 'text-gray-600' : 'text-gray-400'}`}>
                                      {section.description}
                                    </p>
                                  )}
                                  {!isNew && (
                                    <p className={`text-xs mt-1 ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {sectionPhotos.length} photo(s) • Ordre: {section.display_order}
                                    </p>
                                  )}
                                </div>

                                {/* Indicateur visuel */}
                                {isNew && (
                                  <div className="flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-odillon-teal animate-pulse" />
                                  </div>
                                )}
                              </div>
                              {/* Flèche entre les sections */}
                              {index < previewSections.length - 1 && (
                                <div className="flex justify-center py-1">
                                  <ArrowDown className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                          )
                        })
                      })()}

                      {(() => {
                        const sectionsOnPage = photoSections.filter(s => s.page === newPhotoSection.page && s.is_active)
                        return sectionsOnPage.length === 0 && !newPhotoSection.title.trim() && (
                          <p className="text-sm text-gray-500 italic text-center py-4">
                            Aucune section sur cette page. Créez votre première section ci-dessus !
                          </p>
                        )
                      })()}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleAddPhotoSection}
                  className="w-full md:w-auto bg-odillon-teal hover:bg-odillon-teal/90 mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer la section
                </Button>
              </div>
            </div>

            {/* Liste des sections */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Sections existantes ({photoSections.filter(s => s.is_active).length} actives / {photoSections.length} total)
                {loadingSections && <Loader2 className="inline w-4 h-4 ml-2 animate-spin" />}
              </h3>
              {loadingSections ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-odillon-teal" />
                  <span className="ml-3 text-gray-600">Chargement des sections...</span>
                </div>
              ) : photoSections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Aucune section photo pour le moment</p>
                  <p className="text-sm mt-2">Créez votre première section ci-dessus !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {photoSections
                    .sort((a, b) => {
                      // Trier d'abord par page, puis par display_order
                      if (a.page !== b.page) {
                        const pageOrder = ['home', 'services', 'expertise', 'about', 'contact']
                        return pageOrder.indexOf(a.page) - pageOrder.indexOf(b.page)
                      }
                      return a.display_order - b.display_order
                    })
                    .map((section) => {
                      const sectionPhotos = photos.filter(p => p.section_id === section.id)
                      return (
                        <div
                          key={section.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${section.is_active ? 'border-green-500 bg-green-50/50' : 'border-gray-300 bg-gray-50'
                            }`}
                        >
                          {/* Informations */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">{section.title}</h4>
                              <Badge
                                variant={section.is_active ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {section.is_active ? "Actif" : "Inactif"}
                              </Badge>
                              {section.badge && (
                                <Badge variant="outline" className="text-xs">
                                  {section.badge}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {availablePages.find(p => p.value === section.page)?.label || section.page}
                              </Badge>
                            </div>
                            {section.description && (
                              <p className="text-sm text-gray-600 truncate mb-1">{section.description}</p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{sectionPhotos.length} photo(s) associée(s)</span>
                              <span>•</span>
                              <span>Ordre: {section.display_order}</span>
                              {section.position_after && (
                                <>
                                  <span>•</span>
                                  <span>Après: {photoSections.find(s => s.id === section.position_after)?.title || 'Section supprimée'}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => toggleSectionActive(section.id)}
                              title={section.is_active ? "Désactiver" : "Activer"}
                            >
                              {section.is_active ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deletePhotoSection(section.id)}
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section Paramètres de Visibilité */}
        <Card className="mt-8 border-2 border-odillon-teal bg-gradient-to-br from-odillon-teal/5 to-odillon-lime/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Paramètres de Visibilité des Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Gérez la visibilité des sections vidéos et photos sur le site public.
              </p>

              {/* Toggle Section Vidéos */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Section Vidéos</h4>
                    <p className="text-sm text-gray-600">
                      Afficher ou masquer les sections vidéos sur les pages du site
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={siteSettings.show_videos_section ? "default" : "secondary"}>
                    {siteSettings.show_videos_section ? "Affichée" : "Masquée"}
                  </Badge>
                  <Button
                    onClick={() => updateSiteSettings('show_videos_section', !siteSettings.show_videos_section)}
                    disabled={loadingSettings}
                    variant={siteSettings.show_videos_section ? "outline" : "default"}
                    className={siteSettings.show_videos_section ? "" : "bg-odillon-teal hover:bg-odillon-teal/90"}
                  >
                    {siteSettings.show_videos_section ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Masquer
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Afficher
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Toggle Section Photos */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-odillon-teal" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Section Photos</h4>
                    <p className="text-sm text-gray-600">
                      Afficher ou masquer les sections photos sur les pages du site
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={siteSettings.show_photos_section ? "default" : "secondary"}>
                    {siteSettings.show_photos_section ? "Affichée" : "Masquée"}
                  </Badge>
                  <Button
                    onClick={() => updateSiteSettings('show_photos_section', !siteSettings.show_photos_section)}
                    disabled={loadingSettings}
                    variant={siteSettings.show_photos_section ? "outline" : "default"}
                    className={siteSettings.show_photos_section ? "" : "bg-odillon-teal hover:bg-odillon-teal/90"}
                  >
                    {siteSettings.show_photos_section ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Masquer
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Afficher
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {loadingSettings && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-odillon-teal mr-2" />
                  <span className="text-sm text-gray-600">Mise à jour en cours...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section Photo CTA Services */}
        <Card className="mt-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              Photo CTA Section Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Gérez l'image de fond affichée dans la section CTA (Call-to-Action) de la page Services.
              </p>

              {/* Aperçu de l'image actuelle */}
              {siteSettings.services_cta_image_url && (
                <div className="mb-4 p-4 bg-white rounded-lg border-2 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Image actuelle :</h4>
                  <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={siteSettings.services_cta_image_url}
                      alt="Photo CTA Services actuelle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 break-all">
                    {siteSettings.services_cta_image_url}
                  </p>
                </div>
              )}

              {/* Formulaire d'upload */}
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {siteSettings.services_cta_image_url ? "Remplacer l'image" : "Ajouter une image"}
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fichier image
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          updateServicesCtaImage(file, null)
                        }
                      }}
                      disabled={uploadingCtaImage}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formats acceptés : JPG, PNG, WebP. Ratio recommandé : 21:9
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-xs text-gray-500">OU</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de l'image (externe)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={siteSettings.services_cta_image_url || ""}
                        onChange={(e) => {
                          // Ne pas mettre à jour immédiatement, attendre la validation
                        }}
                        onBlur={(e) => {
                          const url = e.target.value.trim() || null
                          if (url !== siteSettings.services_cta_image_url) {
                            updateServicesCtaImage(null, url)
                          }
                        }}
                        disabled={uploadingCtaImage}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Entrez une URL d'image valide (Unsplash, Supabase, etc.)
                    </p>
                  </div>

                  {siteSettings.services_cta_image_url && (
                    <Button
                      onClick={() => updateServicesCtaImage(null, null)}
                      disabled={uploadingCtaImage}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer l'image
                    </Button>
                  )}

                  {uploadingCtaImage && (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">Mise à jour en cours...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Photo Section Expertise */}
        <Card className="mt-8 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-green-600" />
              Photo Section Expertise (À Propos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Gérez l'image de fond affichée dans la section "Notre Expertise" de la page À Propos.
              </p>

              {/* Aperçu de l'image actuelle */}
              {siteSettings.expertise_image_url && (
                <div className="mb-4 p-4 bg-white rounded-lg border-2 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Image actuelle :</h4>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={siteSettings.expertise_image_url}
                      alt="Photo Section Expertise actuelle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 break-all">
                    {siteSettings.expertise_image_url}
                  </p>
                </div>
              )}

              {/* Formulaire d'upload */}
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {siteSettings.expertise_image_url ? "Remplacer l'image" : "Ajouter une image"}
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fichier image
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          updateExpertiseImage(file, null)
                        }
                      }}
                      disabled={uploadingExpertiseImage}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formats acceptés : JPG, PNG, WebP. Image recommandée avec personnes noires dans un contexte professionnel.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-xs text-gray-500">OU</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de l'image (externe)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={siteSettings.expertise_image_url || ""}
                        onChange={(e) => {
                          // Ne pas mettre à jour immédiatement, attendre la validation
                        }}
                        onBlur={(e) => {
                          const url = e.target.value.trim() || null
                          if (url !== siteSettings.expertise_image_url) {
                            updateExpertiseImage(null, url)
                          }
                        }}
                        disabled={uploadingExpertiseImage}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Entrez une URL d'image valide (Unsplash, Supabase, Pexels, etc.)
                    </p>
                  </div>

                  {siteSettings.expertise_image_url && (
                    <Button
                      onClick={() => updateExpertiseImage(null, null)}
                      disabled={uploadingExpertiseImage}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer l'image
                    </Button>
                  )}

                  {uploadingExpertiseImage && (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">Mise à jour en cours...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Gestion des Vidéos et Photos */}
        <Card className="mt-8 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Gestion des Vidéos et Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Sélecteur de type de contenu */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4">Ajouter un contenu</h3>
              <div className="flex gap-4 mb-4">
                <Button
                  onClick={() => setContentType('video')}
                  variant={contentType === 'video' ? 'default' : 'outline'}
                  className={contentType === 'video' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Vidéo
                </Button>
                <Button
                  onClick={() => setContentType('photo')}
                  variant={contentType === 'photo' ? 'default' : 'outline'}
                  className={contentType === 'photo' ? 'bg-odillon-teal hover:bg-odillon-teal/90' : ''}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Photo
                </Button>
              </div>

              {/* Formulaire d'ajout de vidéo */}
              {contentType === 'video' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre *
                      </label>
                      <Input
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        placeholder="Ex: Présentation Odillon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie *
                      </label>
                      <select
                        value={newVideo.category}
                        onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value as 'presentation' | 'testimonial' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="presentation">Présentation</option>
                        <option value="testimonial">Témoignage</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                      placeholder="Description de la vidéo (optionnel)"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL de la vidéo *
                      </label>
                      <Input
                        value={newVideo.url}
                        onChange={(e) => {
                          const url = e.target.value
                          // Détecter automatiquement le type de vidéo
                          let detectedType: 'youtube' | 'vimeo' | 'direct' = 'direct'
                          if (url.includes("youtube.com") || url.includes("youtu.be")) {
                            detectedType = "youtube"
                          } else if (url.includes("vimeo.com")) {
                            detectedType = "vimeo"
                          }
                          setNewVideo({ ...newVideo, url, type: detectedType })
                        }}
                        placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={newVideo.type}
                        onChange={(e) => setNewVideo({ ...newVideo, type: e.target.value as 'youtube' | 'vimeo' | 'direct' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="direct">Vidéo directe</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de la miniature (optionnel)
                    </label>
                    <Input
                      value={newVideo.thumbnail}
                      onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <Button
                    onClick={handleAddVideo}
                    className="w-full md:w-auto bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter la vidéo
                  </Button>
                </div>
              )}

              {/* Formulaire d'ajout de photo */}
              {contentType === 'photo' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre *
                      </label>
                      <Input
                        value={newPhoto.description}
                        onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                        placeholder="Ex: Équipe lors de Novembre Bleu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lieu / Point particulier (optionnel)
                      </label>
                      <Input
                        value={newPhoto.location}
                        onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })}
                        placeholder="Ex: Libreville, Gabon"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ce texte apparaîtra comme badge sur la photo
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mois associé
                        {currentTheme && (
                          <span className="ml-2 text-xs text-blue-600 font-normal">
                            (Actuellement : {currentTheme.name})
                          </span>
                        )}
                      </label>
                      <select
                        className={`w-full px-3 py-2 border rounded-md ${newPhoto.month === 11 ? 'border-green-500 bg-green-50' : 'border-gray-300'
                          }`}
                        value={newPhoto.month || ""}
                        onChange={(e) => setNewPhoto({ ...newPhoto, month: e.target.value ? parseInt(e.target.value) : null })}
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
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thématique (optionnel)
                      {currentMonthEvents.length > 0 && (
                        <span className="ml-2 text-xs text-blue-600 font-normal">
                          ({currentMonthEvents.length} événement{currentMonthEvents.length > 1 ? 's' : ''} ce mois)
                        </span>
                      )}
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-md ${currentMonthEvents.some(e => e.type === 'awareness') ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      value={newPhoto.theme_id || ""}
                      onChange={(e) => setNewPhoto({ ...newPhoto, theme_id: e.target.value || null })}
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section photo (optionnel)
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newPhoto.section_id || ""}
                      onChange={(e) => setNewPhoto({ ...newPhoto, section_id: e.target.value || null })}
                    >
                      <option value="">Aucune section</option>
                      {photoSections.filter(s => s.is_active).map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.title}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Associez cette photo à une section pour l'afficher dans une galerie
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Photo *
                    </label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="flex-1"
                        disabled={uploading}
                      />
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
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !newPhoto.file || !newPhoto.description.trim()}
                    className="w-full md:w-auto bg-odillon-teal hover:bg-odillon-teal/90"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Ajouter la photo
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Liste des vidéos */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Vidéos ({videos.filter(v => v.is_active).length} actives / {videos.length} total)
                {loadingVideos && <Loader2 className="inline w-4 h-4 ml-2 animate-spin" />}
              </h3>
              {loadingVideos ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Chargement des vidéos...</span>
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p>Aucune vidéo pour le moment</p>
                  <p className="text-sm mt-2">Ajoutez votre première vidéo ci-dessus !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${video.is_active ? 'border-green-500 bg-green-50/50' : 'border-gray-300 bg-gray-50'
                        }`}
                    >
                      {/* Informations */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">{video.title}</h4>
                          <Badge
                            variant={video.is_active ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {video.is_active ? "Actif" : "Inactif"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {video.category === 'presentation' ? 'Présentation' : 'Témoignage'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {video.type}
                          </Badge>
                        </div>
                        {video.description && (
                          <p className="text-sm text-gray-600 truncate mb-1">{video.description}</p>
                        )}
                        <p className="text-xs text-gray-500 truncate">{video.url}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => toggleVideoActive(video.id)}
                          title={video.is_active ? "Désactiver" : "Activer"}
                        >
                          {video.is_active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteVideo(video.id)}
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

            {/* Section Témoignages */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Témoignages ({testimonials.filter(t => t.is_active).length} actifs / {testimonials.length} total)
                {loadingTestimonials && <Loader2 className="inline w-4 h-4 ml-2 animate-spin" />}
              </h3>

              {/* Formulaire d'ajout de témoignage */}
              <Card className="mb-6 border-2 border-dashed border-gray-300">
                <CardHeader>
                  <CardTitle className="text-lg">Ajouter un témoignage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Citation *
                      </label>
                      <Input
                        value={newTestimonial.quote}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                        placeholder="Ex: Compréhension approfondie de vos enjeux..."
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom *
                        </label>
                        <Input
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                          placeholder="Ex: Écoute Active"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Poste / Position *
                        </label>
                        <Input
                          value={newTestimonial.position}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, position: e.target.value })}
                          placeholder="Ex: Notre Approche - Étape 1"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL de l'avatar *
                      </label>
                      <Input
                        value={newTestimonial.avatar_url}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, avatar_url: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        URL complète de l'image (Unsplash, Supabase Storage, etc.)
                      </p>
                    </div>
                    <Button
                      onClick={handleAddTestimonial}
                      disabled={!newTestimonial.quote.trim() || !newTestimonial.name.trim() || !newTestimonial.position.trim() || !newTestimonial.avatar_url.trim()}
                      className="w-full md:w-auto bg-odillon-teal hover:bg-odillon-teal/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter le témoignage
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des témoignages */}
              {loadingTestimonials ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-odillon-teal" />
                  <span className="ml-3 text-gray-600">Chargement des témoignages...</span>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Quote className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Aucun témoignage pour le moment</p>
                  <p className="text-sm mt-2">Ajoutez votre premier témoignage ci-dessus !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${testimonial.is_active ? 'border-green-500 bg-green-50/50' : 'border-gray-300 bg-gray-50'
                        }`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <img
                          src={testimonial.avatar_url}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                      {/* Informations */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <Badge
                            variant={testimonial.is_active ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {testimonial.is_active ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{testimonial.position}</p>
                        <p className="text-sm text-gray-500 line-clamp-2 italic">"{testimonial.quote}"</p>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => toggleTestimonialActive(testimonial.id)}
                          title={testimonial.is_active ? "Désactiver" : "Activer"}
                        >
                          {testimonial.is_active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteTestimonial(testimonial.id)}
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

            {/* Liste des photos (simplifiée - redirige vers la section principale) */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Photos ({photos.filter(p => p.is_active).length} actives / {photos.length} total)
                {loading && <Loader2 className="inline w-4 h-4 ml-2 animate-spin" />}
              </h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-odillon-teal" />
                  <span className="ml-3 text-gray-600">Chargement des photos...</span>
                </div>
              ) : photos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Aucune photo pour le moment</p>
                  <p className="text-sm mt-2">Ajoutez votre première photo ci-dessus !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {photos.slice(0, 5).map((photo) => (
                    <div
                      key={photo.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${photo.is_active ? 'border-green-500 bg-green-50/50' : 'border-gray-300 bg-gray-50'
                        }`}
                    >
                      {/* Aperçu */}
                      <div className="flex-shrink-0 w-24 h-16 bg-white border border-gray-200 rounded overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.description}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Informations */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">{photo.description}</h4>
                          <Badge
                            variant={photo.is_active ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {photo.is_active ? "Actif" : "Inactif"}
                          </Badge>
                          {photo.month && (
                            <Badge variant="outline" className="text-xs">
                              {months[photo.month - 1]}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{photo.url}</p>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-2">
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
                  ))}
                  {photos.length > 5 && (
                    <div className="text-center pt-4">
                      <p className="text-sm text-gray-600">
                        {photos.length - 5} autre(s) photo(s). Voir la section "Photos Actuelles" ci-dessus pour la liste complète.
                      </p>
                    </div>
                  )}
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

        {/* Dialog d'édition de photo */}
        <Dialog open={!!editingPhoto} onOpenChange={(open) => !open && setEditingPhoto(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Éditer la photo</DialogTitle>
              <DialogDescription>
                Modifiez les informations de la photo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre *
                  </label>
                  <Input
                    value={editPhotoForm.description}
                    onChange={(e) => setEditPhotoForm({ ...editPhotoForm, description: e.target.value })}
                    placeholder="Ex: Équipe lors de Novembre Bleu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lieu / Point particulier (optionnel)
                  </label>
                  <Input
                    value={editPhotoForm.location}
                    onChange={(e) => setEditPhotoForm({ ...editPhotoForm, location: e.target.value })}
                    placeholder="Ex: Libreville, Gabon"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ce texte apparaîtra comme badge sur la photo
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mois associé
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editPhotoForm.month || ""}
                    onChange={(e) => setEditPhotoForm({ ...editPhotoForm, month: e.target.value ? parseInt(e.target.value) : null })}
                  >
                    <option value="">Toute l'année</option>
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thématique (optionnel)
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editPhotoForm.theme_id || ""}
                    onChange={(e) => setEditPhotoForm({ ...editPhotoForm, theme_id: e.target.value || null })}
                  >
                    <option value="">Aucune thématique</option>
                    {MONTHLY_THEMES.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section photo (optionnel)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editPhotoForm.section_id || ""}
                  onChange={(e) => setEditPhotoForm({ ...editPhotoForm, section_id: e.target.value || null })}
                >
                  <option value="">Aucune section</option>
                  {photoSections.filter(s => s.is_active).map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPhoto(null)}>
                Annuler
              </Button>
              <Button onClick={updatePhoto}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

