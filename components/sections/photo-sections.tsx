"use client"

import { useState, useEffect } from "react"
import { PhotosSection } from "@/components/sections/photos-section"
import type { PhotoItem } from "@/components/sections/photos-section"
import { getSiteSettings } from "@/lib/site-settings-client"

interface PhotoSectionWithPhotos {
  id: string
  title: string
  description: string | null
  badge: string | null
  photos: Array<{
    id: string
    url: string
    description: string
  }>
}

interface PhotoSectionsProps {
  page?: 'home' | 'services' | 'expertise' | 'about' | 'contact'
}

export function PhotoSections({ page }: PhotoSectionsProps = {}) {
  const [sections, setSections] = useState<PhotoSectionWithPhotos[]>([])
  const [showSections, setShowSections] = useState(true)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<'home' | 'services' | 'expertise' | 'about' | 'contact'>('home')

  // Détecter la page automatiquement si non fournie
  useEffect(() => {
    if (page) {
      setCurrentPage(page)
      return
    }

    const detectPage = () => {
      const path = window.location.pathname
      if (path === '/') {
        setCurrentPage('home')
      } else if (path.startsWith('/services') || path.startsWith('/expertise')) {
        setCurrentPage('services')
      } else if (path.startsWith('/a-propos')) {
        setCurrentPage('about')
      } else if (path.startsWith('/contact')) {
        setCurrentPage('contact')
      } else {
        setCurrentPage('home')
      }
    }

    detectPage()
  }, [page])

  // Vérifier les paramètres de visibilité
  useEffect(() => {
    const checkVisibility = async () => {
      const settings = await getSiteSettings()
      setShowSections(settings.show_photos_section)
    }

    checkVisibility()
  }, [])

  // Charger les sections avec leurs photos
  useEffect(() => {
    if (!showSections) {
      setSections([])
      setLoading(false)
      return
    }

    const loadSections = async () => {
      try {
        setLoading(true)
        const url = `/api/photo-sections/with-photos?active=true&page=${currentPage}`

        const res = await fetch(url)

        if (!res.ok) {
          console.error('Erreur lors du chargement des sections')
          return
        }

        const data = await res.json()
        setSections(data.sections || [])
      } catch (error) {
        console.error('Erreur lors du chargement des sections:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSections()
  }, [showSections, currentPage])

  // Ne rien afficher si les sections sont masquées
  if (!showSections) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-odillon-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des sections photos...</p>
        </div>
      </div>
    )
  }

  if (sections.length === 0) {
    return null
  }

  return (
    <>
      {sections.map((section) => {
        const photos: PhotoItem[] = section.photos.map(photo => ({
          id: photo.id,
          url: photo.url,
          description: photo.description,
          alt: photo.description
        }))

        if (photos.length === 0) {
          return null
        }

        return (
          <PhotosSection
            key={section.id}
            title={section.title}
            badge={section.badge || "Photos"}
            photos={photos}
            forceShow={true} // Forcer l'affichage car on a déjà vérifié show_photos_section
          />
        )
      })}
    </>
  )
}
