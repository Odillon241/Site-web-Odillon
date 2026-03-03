"use client"

import { useState, useEffect } from "react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { getSiteSettings } from "@/lib/site-settings-client"

export interface PhotoItem {
  id: string
  url: string
  description: string
  alt?: string
}

interface PhotosSectionProps {
  title: string
  badge?: string
  photos: PhotoItem[]
  className?: string
  forceShow?: boolean // Permet de forcer l'affichage même si les paramètres le désactivent
}

export function PhotosSection({ 
  title, 
  badge = "Photos",
  photos,
  className = "",
  forceShow = false
}: PhotosSectionProps) {
  const [showSection, setShowSection] = useState(true)
  const hasPhotos = photos && photos.length > 0

  // Vérifier les paramètres de visibilité au montage
  useEffect(() => {
    if (forceShow) {
      setShowSection(true)
      return
    }

    const checkVisibility = async () => {
      const settings = await getSiteSettings()
      setShowSection(settings.show_photos_section)
    }

    checkVisibility()
  }, [forceShow])

  // Ne rien afficher si la section est masquée
  if (!showSection && !forceShow) {
    return null
  }

  return (
    <div className={`mb-12 md:mb-16 lg:mb-20 ${className}`}>
      {/* Header */}
      <BlurFade delay={0.1}>
        <div className="text-center mb-8 md:mb-12 px-4">
          {badge && (
            <Badge variant="odillon" className="mb-3 md:mb-4">
              {badge}
            </Badge>
          )}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
            {title}
          </h2>
        </div>
      </BlurFade>

      {/* Grille de photos ou message vide */}
      {hasPhotos ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {photos.map((photo, idx) => (
            <BlurFade key={photo.id} delay={0.1 * (idx + 1)}>
              <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-xl group overflow-hidden h-full">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.alt || photo.description}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <CardContent className="p-4 md:p-6">
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {photo.description}
                  </p>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      ) : (
        <BlurFade delay={0.2}>
          <div className="text-center py-12 md:py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm md:text-base">
                Les photos seront bientôt disponibles
              </p>
            </div>
          </div>
        </BlurFade>
      )}
    </div>
  )
}
