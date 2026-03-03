"use client"

import { useState, useEffect } from "react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoPlayer, VideoType } from "@/components/ui/video-player"
import { getSiteSettings } from "@/lib/site-settings-client"

export interface VideoItem {
  id: string
  title: string
  description?: string
  url: string
  type?: VideoType
  thumbnail?: string
}

interface VideosSectionProps {
  title: string
  badge?: string
  videos: VideoItem[]
  className?: string
  forceShow?: boolean // Permet de forcer l'affichage même si les paramètres le désactivent
}

export function VideosSection({ 
  title, 
  badge = "Vidéos",
  videos,
  className = "",
  forceShow = false
}: VideosSectionProps) {
  const [showSection, setShowSection] = useState(true)
  const hasVideos = videos && videos.length > 0

  // Vérifier les paramètres de visibilité au montage
  useEffect(() => {
    if (forceShow) {
      setShowSection(true)
      return
    }

    const checkVisibility = async () => {
      const settings = await getSiteSettings()
      setShowSection(settings.show_videos_section)
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

      {/* Grille de vidéos ou message vide */}
      {hasVideos ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {videos.map((video, idx) => (
            <BlurFade key={video.id} delay={0.1 * (idx + 1)}>
              <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-xl group overflow-hidden h-full flex flex-col">
                <div className="relative overflow-hidden">
                  <VideoPlayer
                    url={video.url}
                    type={video.type}
                    thumbnail={video.thumbnail}
                    title={video.title}
                    className="w-full"
                  />
                </div>
                
                <CardHeader className="px-4 md:px-6 py-4 md:py-5 flex-grow">
                  <CardTitle className="text-lg md:text-xl mb-2 group-hover:text-[#39837a] transition-colors">
                    {video.title}
                  </CardTitle>
                  {video.description && (
                    <CardDescription className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {video.description}
                    </CardDescription>
                  )}
                </CardHeader>
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
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm md:text-base">
                Les vidéos seront bientôt disponibles
              </p>
            </div>
          </div>
        </BlurFade>
      )}
    </div>
  )
}
