"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Loader2, ExternalLink, Database, Code, AlertCircle } from "lucide-react"

interface HeroImage {
  src: string
  alt: string
  source?: 'database' | 'default'
}

export function HeroImagesDebugger() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkImages = async () => {
      try {
        setLoading(true)
        const currentMonth = new Date().getMonth() + 1

        // Récupérer les photos depuis l'API
        const res = await fetch(`/api/photos?active=true`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })

        const loadedImages: HeroImage[] = []

        if (res.ok) {
          const data = await res.json()
          if (data.photos && Array.isArray(data.photos)) {
            // Filtrer : photos du mois en cours OU photos sans mois spécifique
            const activePhotos = data.photos.filter((p: any) => 
              p.month === currentMonth || p.month === null || p.month === undefined
            )

            // Transformer en format HeroImage
            activePhotos.forEach((photo: any) => {
              const photoUrl = photo.url || photo.src
              if (photoUrl && typeof photoUrl === 'string' && photoUrl.length > 0) {
                loadedImages.push({
                  src: photoUrl,
                  alt: photo.description || photo.alt || 'Photo Odillon',
                  source: 'database'
                })
              }
            })
          }
        }

        // Plus d'images par défaut - seules les images téléversées s'affichent

        setImages(loadedImages)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    checkImages()
    // Recharger toutes les 10 secondes
    const interval = setInterval(checkImages, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-odillon-teal mr-2" />
        <span className="text-sm text-gray-600">Chargement des images...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <span className="text-sm text-red-700">Erreur : {error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <strong className="text-gray-900">{images.length}</strong> image{images.length > 1 ? 's' : ''} actuellement chargée{images.length > 1 ? 's' : ''}
        </p>
        <Badge variant="default">
          <Database className="w-3 h-3 mr-1" />
          Depuis Supabase
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-odillon-teal transition-colors"
          >
            <div className="aspect-video bg-gray-100 relative">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="default" className="text-xs">
                  <Database className="w-3 h-3 mr-1" />
                  Supabase
                </Badge>
              </div>
            </div>
            <div className="p-2 bg-white">
              <p className="text-xs text-gray-600 line-clamp-2 mb-1">{image.alt}</p>
              <a
                href={image.src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-odillon-teal hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Voir l'URL
              </a>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-600" />
          <p className="text-sm font-medium text-amber-900 mb-1">Aucune image téléversée</p>
          <p className="text-xs text-amber-700">
            Le Hero n'affichera qu'un fond sombre jusqu'à ce que vous téléversiez des photos.
            <br />
            Les images Unsplash ne sont plus utilisées.
          </p>
        </div>
      )}
    </div>
  )
}
