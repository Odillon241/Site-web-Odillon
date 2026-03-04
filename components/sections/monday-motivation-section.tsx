"use client"

import { useMemo } from "react"
import { Video } from "@/types/admin"
import { VideoPlayer } from "@/components/ui/video-player"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Calendar, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface MondayMotivationSectionProps {
  video: Video | null
  className?: string
}

function getWeekInfo(): string {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)

  return monday.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function MondayMotivationSection({ video, className }: MondayMotivationSectionProps) {
  const weekInfo = useMemo(() => getWeekInfo(), [])

  if (!video) return null

  return (
    <section
      id="monday-motivation"
      aria-labelledby="monday-motivation-title"
      className={cn("relative py-16 md:py-24 overflow-hidden", className)}
    >
      {/* Background gradient subtil */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-odillon-teal/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-odillon-lime/5 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Split layout : texte gauche + video droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Colonne gauche - Texte */}
          <BlurFade delay={0.1}>
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="bg-odillon-lime/10 text-odillon-teal border-odillon-lime/30 px-4 py-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                Actualite de la semaine
              </Badge>

              <h2
                id="monday-motivation-title"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-baskvill leading-tight"
              >
                Monday Motivation
              </h2>

              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm md:text-base">Semaine du {weekInfo}</span>
              </div>

              {/* Video Info */}
              {(video.title || video.description || video.presenter_name) && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  {video.title && (
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                      {video.title}
                    </h3>
                  )}
                  {video.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                  {video.presenter_name && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{video.presenter_name}</span>
                      {video.presenter_position && (
                        <span className="text-gray-400"> — {video.presenter_position}</span>
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>
          </BlurFade>

          {/* Colonne droite - Video avec cadre premium */}
          <FadeIn delay={0.2}>
            <div className="relative">
              {/* Gradient frame derriere */}
              <div
                className="absolute -inset-3 bg-gradient-to-br from-[#1A9B8E]/20 via-[#C4D82E]/10 to-[#1A9B8E]/5 rounded-lg blur-sm"
                aria-hidden="true"
              />

              {/* Container video */}
              <div className="relative rounded-lg overflow-hidden shadow-2xl border border-gray-200/80 ring-1 ring-black/5 bg-white">
                <VideoPlayer
                  url={video.url}
                  type={video.type}
                  thumbnail={video.thumbnail || undefined}
                  title={video.title}
                  className="w-full aspect-video"
                  autoplay={true}
                  muted={true}
                  loop={true}
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
