"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { m } from "framer-motion"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GridPattern } from "@/components/ui/grid-pattern"
import { CtaBanner } from "@/components/sections/cta-banner"
import { VideoSection } from "@/components/sections/video-section"
import { VideosSection } from "@/components/sections/videos-section"
import type { VideoItem } from "@/components/sections/videos-section"
import { Video } from "@/types/admin"
import { polesProduits, nombreProduits, type IconePole } from "@/lib/produits-data"
import { Landmark, Users, Scale, Rocket, ChevronRight } from "lucide-react"

const icones: Record<IconePole, React.ComponentType<{ className?: string }>> = {
  Landmark,
  Users,
  Scale,
  Rocket,
}

function detecterTypeVideo(url: string, type: string): "youtube" | "vimeo" | "direct" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("vimeo.com")) return "vimeo"
  return type as "youtube" | "vimeo" | "direct"
}

export function ProduitsPage() {
  const [video, setVideo] = useState<Video | null>(null)
  const [videosTemoignages, setVideosTemoignages] = useState<VideoItem[]>([])

  useEffect(() => {
    const chargerVideos = async () => {
      try {
        const res = await fetch("/api/videos?active=true")
        if (!res.ok) return
        const data = await res.json()
        const videos: Video[] = data.videos || []

        const videoPage = videos.find((v) => v.page === "Services" && v.section === "Contenu")
        if (videoPage) setVideo(videoPage)

        setVideosTemoignages(
          videos
            .filter((v) => v.category === "testimonial")
            .map((v) => ({
              id: v.id,
              title: v.title,
              description: v.description || undefined,
              url: v.url,
              type: detecterTypeVideo(v.url, v.type),
              thumbnail: v.thumbnail || undefined,
            }))
        )
      } catch (error) {
        console.error("Erreur lors du chargement des vidéos:", error)
      }
    }

    chargerVideos()
  }, [])

  return (
    <section className="od-page relative overflow-x-clip">
      {/* Hero */}
      <div className="od-section relative overflow-hidden bg-[#f7fafc] py-16 md:py-20 lg:py-24" role="banner" aria-label="Section héro des produits">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GridPattern
            width={64}
            height={64}
            x={-20}
            y={-20}
            className="absolute inset-0 fill-[#00a795]/[0.025] stroke-[#00a795]/[0.11] [mask-image:linear-gradient(to_bottom,black_5%,black_78%,transparent_100%)]"
          />
          <div className="absolute -right-36 -top-24 h-[32rem] w-[32rem] rounded-full border border-odillon-teal/10 bg-[radial-gradient(circle_at_center,rgba(0,167,149,0.10),rgba(0,167,149,0.025)_42%,transparent_68%)]" />
          <div className="absolute -right-4 top-10 h-[21rem] w-[21rem] rounded-full border border-odillon-lime/15" />
          <div className="absolute -left-28 -bottom-40 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(196,216,46,0.13),transparent_68%)] blur-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.34)_52%,transparent_78%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-odillon-teal/25 to-transparent" />
        </div>

        <div className="od-container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <h1 className="od-heading-display mb-6 text-4xl sm:text-5xl lg:text-6xl">
                Des produits qui transforment{" "}
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 bg-gradient-to-r from-odillon-teal to-odillon-lime bg-clip-text text-transparent">
                    votre entreprise
                  </span>
                  <m.span
                    className="absolute -bottom-2 left-0 w-full h-1.5 bg-odillon-lime/20 rounded-full -z-0"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-light">
                Gouvernance, Ressources Humaines, Juridique et Business Plan :
                des produits concrets pour structurer, développer et pérenniser votre organisation.
              </p>
            </FadeIn>

            <FadeIn delay={0.6} className="mt-10 md:mt-12">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <Link href="/contact">Démarrer un projet</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base group" asChild>
                  <a href="#catalogue">
                    Explorer nos produits
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <VideoSection video={video} />

      <div id="catalogue" className="od-container relative z-10 scroll-mt-28 pt-8 md:pt-12">
        <BlurFade delay={0.2}>
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="odillon" className="mb-3">
              Nos pôles d&apos;expertise
            </Badge>
            <h2 className="font-baskvill italic text-2xl md:text-3xl text-gray-900 mb-3">
              Nos produits
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Gouvernance • Ressources Humaines • Juridique • Business Plan
            </p>
          </div>
        </BlurFade>

        {/* Une card par catégorie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24">
          {polesProduits.map((pole, idx) => {
            const Icone = icones[pole.icone]
            const total = nombreProduits(pole)

            return (
              <BlurFade key={pole.id} delay={0.1 + idx * 0.05}>
                <article
                  id={pole.id}
                  className="h-full scroll-mt-28 group/card"
                  aria-labelledby={`pole-${pole.id}`}
                >
                  <div className="od-surface relative flex h-full flex-col overflow-hidden transition-all duration-500 hover:border-odillon-teal/20 hover:shadow-md hover:shadow-[#0A1F2C]/[0.05]">
                    <div
                      className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover/card:opacity-20 transition-opacity duration-500"
                      style={{ backgroundColor: pole.couleur }}
                      aria-hidden="true"
                    />

                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex items-start gap-4 mb-6">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover/card:scale-105 transition-transform duration-500"
                          style={{ backgroundColor: `${pole.couleur}15`, color: pole.couleur }}
                        >
                          <Icone className="w-6 h-6" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h3
                            id={`pole-${pole.id}`}
                            className="font-baskvill italic text-xl md:text-2xl text-gray-900 leading-tight"
                          >
                            {pole.titre}
                          </h3>
                          <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: pole.couleur }}>
                            {pole.accroche}
                          </p>
                        </div>
                      </div>

                      <div className="relative z-10 flex flex-col gap-5 mb-6">
                        {pole.groupes.map((groupe, gIdx) => (
                          <div key={groupe.titre ?? gIdx}>
                            {groupe.titre && (
                              <p className="text-[11px] font-bold uppercase tracking-widest text-odillon-dark/70 mb-2.5">
                                {groupe.titre}
                              </p>
                            )}
                            <ul className="flex flex-col gap-2.5">
                              {groupe.produits.map((produit) => (
                                <li key={produit} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700">
                                  <span
                                    className="mt-2 size-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: pole.couleur }}
                                    aria-hidden="true"
                                  />
                                  <span>{produit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-50 relative z-10">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="mb-3 w-full group/cta border transition-all hover:brightness-95"
                          style={{
                            backgroundColor: `${pole.couleur}15`,
                            borderColor: `${pole.couleur}80`,
                            color: pole.couleur,
                          }}
                        >
                          <Link href="/contact">
                            Discutons de votre projet
                            <ChevronRight className="ml-2 w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform" aria-hidden="true" />
                          </Link>
                        </Button>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                          {total} produit{total > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </BlurFade>
            )
          })}
        </div>

        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <CtaBanner
            title="Prêt à transformer votre entreprise ?"
            description="Discutons de vos enjeux et découvrez comment nos produits peuvent propulser votre organisation vers l'excellence."
            buttonText="Discutons de votre projet"
            buttonHref="/contact"
            badgeText="Excellence"
          />
        </div>

        <VideosSection title="Témoignages Clients" badge="Témoignages" videos={videosTemoignages} />
      </div>
    </section>
  )
}
