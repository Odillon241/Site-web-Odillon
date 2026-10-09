"use client"

import { useState, useEffect } from "react"
import { Calendar, Sparkles } from "lucide-react"

import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { VideoPlayer } from "@/components/ui/video-player"
import { Video } from "@/types/admin"

/**
 * Date affichée pour une vidéo : `video_date` (date de la semaine, renseignée
 * par l'admin) en priorité, sinon la date d'upload en repli pour les vidéos
 * plus anciennes qui n'ont pas encore cette information.
 */
function getEffectiveDate(video: Video): Date | null {
  if (video.video_date) return new Date(video.video_date + "T00:00:00")
  if (video.created_at) return new Date(video.created_at)
  return null
}

function formatDate(video: Video): string | null {
  const date = getEffectiveDate(video)
  if (!date) return null
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

export default function MondayMotivationPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/videos?active=true&t=${Date.now()}`)
        const data = await response.json()
        const all = (data.videos || []) as Video[]

        const filtered = all.filter(
          (v) => v.page === "Accueil" && v.section === "MondayMotivation"
        )

        filtered.sort((a, b) => {
          const dateA = getEffectiveDate(a)?.getTime() ?? 0
          const dateB = getEffectiveDate(b)?.getTime() ?? 0
          return dateB - dateA
        })

        setVideos(filtered)
      } catch (error) {
        console.error(
          "Erreur lors du chargement des vidéos Monday Motivation:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  /**
   * Regroupement par année, du plus récent au plus ancien — même logique
   * de classement que la photothèque.
   */
  const groupedByYear = videos.reduce(
    (acc, video) => {
      const year = getEffectiveDate(video)?.getFullYear() ?? null

      let group = acc.find((g) => g.year === year)

      if (!group) {
        group = { year, videos: [] }
        acc.push(group)
      }

      group.videos.push(video)

      return acc
    },
    [] as { year: number | null; videos: Video[] }[]
  )

  groupedByYear.sort((a, b) => {
    if (a.year === null) return 1
    if (b.year === null) return -1
    return b.year - a.year
  })

  return (
    <>
      <HeaderPro />

      <main className="od-page pt-[88px] md:pt-[104px]">
        <section className="od-section scroll-mt-24 border-t-0 py-12 md:py-16">
          <div className="od-container">
            <div className="max-w-2xl mb-10 md:mb-12">
              <div className="od-eyebrow mb-3">
                <Sparkles className="w-4 h-4" />
                Monday Motivation
              </div>

              <h1 className="od-heading-display text-4xl md:text-5xl">
                Toutes les vidéos
              </h1>

              <p className="mt-3 text-sm md:text-base text-gray-600">
                Retrouvez l&apos;ensemble de nos vidéos Monday Motivation,
                classées de la plus récente à la plus ancienne.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-video bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : groupedByYear.length > 0 ? (
              <div className="space-y-14 md:space-y-16">
                {groupedByYear.map((group) => (
                  <div
                    key={group.year ?? "autres"}
                    className="space-y-8 md:space-y-10"
                  >
                    <h2 className="od-heading-display text-3xl md:text-4xl border-b border-odillon-teal/10 pb-3">
                      {group.year ?? "Autres"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                      {group.videos.map((video, idx) => (
                        <BlurFade key={video.id} delay={idx * 0.05}>
                          <div className="space-y-4">
                            <VideoPlayer
                              url={video.url}
                              type={video.type}
                              thumbnail={video.thumbnail || undefined}
                              title={video.title}
                              aspectRatio="auto"
                              className="shadow-lg border border-gray-200/80"
                            />

                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="w-4 h-4" aria-hidden="true" />
                              <span className="text-sm">
                                {formatDate(video)
                                  ? `Semaine du ${formatDate(video)}`
                                  : "Date inconnue"}
                              </span>
                            </div>

                            {video.title && (
                              <h3 className="text-lg font-semibold text-gray-900">
                                {video.title}
                              </h3>
                            )}

                            {video.description && (
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {video.description}
                              </p>
                            )}

                            {video.presenter_name && (
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">
                                  {video.presenter_name}
                                </span>
                                {video.presenter_position && (
                                  <span className="text-gray-400">
                                    {" "}
                                    — {video.presenter_position}
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        </BlurFade>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <FadeIn>
                <div className="od-surface-muted text-center py-20 md:py-24">
                  <h3 className="od-heading-display text-2xl mb-2">
                    Aucune vidéo
                  </h3>

                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Aucune vidéo Monday Motivation n&apos;est disponible pour
                    le moment.
                  </p>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
