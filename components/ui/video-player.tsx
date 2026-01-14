"use client"

import { useState, useEffect } from "react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export type VideoType = "youtube" | "vimeo" | "direct"

export interface VideoPlayerProps {
  url: string
  type?: VideoType
  thumbnail?: string
  title?: string
  className?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  presenterName?: string
  presenterPosition?: string
}

// Fonction pour détecter automatiquement le type de vidéo
function detectVideoType(url: string): VideoType {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube"
  }
  if (url.includes("vimeo.com")) {
    return "vimeo"
  }
  return "direct"
}

// Fonction pour extraire l'ID YouTube
function getYouTubeId(url: string): string | null {
  // Gérer les URLs youtu.be/ID
  const youtuBeMatch = url.match(/(?:youtu\.be\/)([^#&?\s]+)/)
  if (youtuBeMatch && youtuBeMatch[1]) {
    return youtuBeMatch[1]
  }

  // Gérer les URLs youtube.com/watch?v=ID
  const watchMatch = url.match(/(?:watch\?v=)([^#&?\s]+)/)
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1]
  }

  // Gérer les URLs youtube.com/embed/ID
  const embedMatch = url.match(/(?:embed\/)([^#&?\s]+)/)
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1]
  }

  // Gérer les URLs youtube.com/v/ID
  const vMatch = url.match(/(?:youtube\.com\/v\/)([^#&?\s]+)/)
  if (vMatch && vMatch[1]) {
    return vMatch[1]
  }

  return null
}

// Fonction pour extraire l'ID Vimeo
function getVimeoId(url: string): string | null {
  const regExp = /(?:vimeo\.com\/)(?:channels\/|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|)(\d+)(?:$|\/|\?)/
  const match = url.match(regExp)
  return match ? match[1] : null
}

// Fonction pour obtenir l'URL du thumbnail YouTube
function getYouTubeThumbnail(videoId: string): string {
  // Utilise l'image de qualité maximale disponible
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
}

export function VideoPlayer({
  url,
  type,
  thumbnail,
  title,
  className,
  autoplay = false,
  muted = false,
  loop = false,
  presenterName,
  presenterPosition,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isLoaded, setIsLoaded] = useState(autoplay)

  // Détecter automatiquement le type même si un type est fourni (pour corriger les erreurs)
  const detectedType = detectVideoType(url)
  const videoType = type && type !== "direct" ? type : detectedType
  const youtubeId = videoType === "youtube" ? getYouTubeId(url) : null
  const vimeoId = videoType === "vimeo" ? getVimeoId(url) : null

  // Générer automatiquement le thumbnail si manquant ou invalide
  // Si le thumbnail est une URL vidéo au lieu d'une image, l'ignorer
  const isValidThumbnail = thumbnail && !thumbnail.includes("youtu.be") && !thumbnail.includes("youtube.com") && !thumbnail.includes("vimeo.com")
  const effectiveThumbnail = isValidThumbnail
    ? thumbnail
    : (youtubeId ? getYouTubeThumbnail(youtubeId) : undefined)

  const handlePlay = () => {
    setIsPlaying(true)
    setIsLoaded(true)
  }

  // URL d'embed YouTube
  const youtubeEmbedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1${muted ? "&mute=1" : ""}${loop ? "&loop=1&playlist=" + youtubeId : ""}`
    : null

  // URL d'embed Vimeo
  const vimeoEmbedUrl = vimeoId
    ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0${muted ? "&muted=1" : ""}${loop ? "&loop=1" : ""}`
    : null

  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl bg-gray-900", className)}>
      {/* Thumbnail avec bouton play (avant la lecture) */}
      {!isPlaying && (
        <div
          className="relative aspect-video w-full cursor-pointer group"
          onClick={handlePlay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handlePlay()
            }
          }}
          aria-label={title || "Lire la vidéo"}
        >
          {effectiveThumbnail ? (
            <Image
              src={effectiveThumbnail}
              alt={title || "Miniature vidéo"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#39837a] to-[#0A1F2C]" />
          )}

          {/* Overlay sombre */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

          {/* Bouton play centré */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-colors" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6 md:w-8 md:h-8 text-[#39837a] ml-1" fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Titre optionnel en bas */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-medium text-sm md:text-base">{title}</p>
            </div>
          )}
        </div>
      )}


      {/* Iframe vidéo (après clic) */}
      {isPlaying && (
        <div className="relative aspect-video w-full">
          {videoType === "youtube" && youtubeEmbedUrl && (
            <iframe
              src={youtubeEmbedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title || "Vidéo YouTube"}
              loading="lazy"
            />
          )}

          {videoType === "vimeo" && vimeoEmbedUrl && (
            <iframe
              src={vimeoEmbedUrl}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={title || "Vidéo Vimeo"}
              loading="lazy"
            />
          )}

          {videoType === "direct" && (
            <video
              src={url}
              className="absolute inset-0 w-full h-full object-contain"
              controls
              autoPlay={autoplay}
              muted={muted}
              loop={loop}
              title={title || "Vidéo"}
            />
          )}
        </div>
      )}
    </div>
  )
}
