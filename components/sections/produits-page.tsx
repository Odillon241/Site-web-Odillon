"use client"

import { useState, useEffect } from "react"
import { m } from "framer-motion"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Button } from "@/components/ui/button"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { GridPattern } from "@/components/ui/grid-pattern"
import { CtaBanner } from "@/components/sections/cta-banner"
import { VideoSection } from "@/components/sections/video-section"
import { VideosSection } from "@/components/sections/videos-section"
import type { VideoItem } from "@/components/sections/videos-section"
import { Video } from "@/types/admin"
import { polesProduits, nombreProduits, type IconePole } from "@/lib/produits-data"
import { Landmark, Users, Scale, Rocket, GraduationCap, ChevronRight, Download } from "lucide-react"

const icones: Record<IconePole, React.ComponentType<{ className?: string }>> = {
  Landmark,
  Users,
  Scale,
  Rocket,
  GraduationCap,
}

function detecterTypeVideo(url: string, type: string): "youtube" | "vimeo" | "direct" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("vimeo.com")) return "vimeo"
  return type as "youtube" | "vimeo" | "direct"
}

function ListeProduits({
  produits,
  couleur,
  className,
}: {
  produits: string[]
  couleur: string
  className?: string
}) {
  return (
    <ul className={cn("grid gap-x-10 gap-y-3", className)}>
      {produits.map((produit) => (
        <li key={produit} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-gray-700">
          <span
            className="mt-[0.6rem] size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: couleur }}
            aria-hidden="true"
          />
          <span>{produit}</span>
        </li>
      ))}
    </ul>
  )
}

const idsPoles = polesProduits.map((p) => p.id)

export function ProduitsPage() {
  const [video, setVideo] = useState<Video | null>(null)
  const [videosTemoignages, setVideosTemoignages] = useState<VideoItem[]>([])
  const [ouverts, setOuverts] = useState<string[]>([])

  // Un lien /produits#gouvernance (menu, pied de page, accueil) ouvre la catégorie visée.
  useEffect(() => {
    const ouvrirDepuisHash = () => {
      const id = window.location.hash.slice(1)
      if (!idsPoles.includes(id)) return
      setOuverts((prev) => (prev.includes(id) ? prev : [...prev, id]))
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
      )
    }
    ouvrirDepuisHash()
    window.addEventListener("hashchange", ouvrirDepuisHash)
    return () => window.removeEventListener("hashchange", ouvrirDepuisHash)
  }, [])

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
                Pour structurer, développer et pérenniser votre organisation.
              </p>
            </FadeIn>

            <FadeIn delay={0.6} className="mt-10 md:mt-12">
              <Button size="lg" className="h-12 px-8 text-base group" asChild>
                <a href="#catalogue">
                  Voir le catalogue
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </FadeIn>
          </div>
        </div>
      </div>

      <VideoSection video={video} />

      <div id="catalogue" className="od-container relative z-10 scroll-mt-28 pt-8 md:pt-12">
        {/* Une ligne par catégorie : un clic déplie la liste de ses produits */}
        <Accordion
          type="multiple"
          value={ouverts}
          onValueChange={setOuverts}
          className="mx-auto flex max-w-5xl flex-col gap-4 mb-16 md:mb-24"
        >
          {polesProduits.map((pole, idx) => {
            const Icone = icones[pole.icone]
            const total = nombreProduits(pole)
            const avecGroupes = pole.groupes.some((g) => g.titre)

            return (
              <BlurFade key={pole.id} delay={0.1 + idx * 0.05}>
                <AccordionItem
                  value={pole.id}
                  id={pole.id}
                  className="od-surface scroll-mt-28 overflow-hidden transition-shadow duration-300 hover:border-odillon-teal/25 data-[state=open]:border-odillon-teal/25 data-[state=open]:shadow-md data-[state=open]:shadow-[#0A1F2C]/[0.05]"
                >
                  <AccordionTrigger className="gap-4 px-5 py-5 text-left hover:no-underline md:px-7 md:py-6 [&>svg]:size-5 [&>svg]:text-gray-400">
                    <span className="flex min-w-0 flex-1 items-center gap-4">
                      <span
                        className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${pole.couleur}18`, color: pole.couleur }}
                      >
                        <Icone className="size-6" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-baskvill text-xl italic leading-tight text-gray-900 md:text-2xl">
                          {pole.titre}
                        </span>
                        <span className="mt-1 block text-sm font-normal text-gray-500">{pole.accroche}</span>
                      </span>
                    </span>
                    <span className="hidden shrink-0 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium tabular-nums text-gray-500 sm:inline-flex">
                      {total} {pole.unite ?? "produits"}
                    </span>
                  </AccordionTrigger>

                  {/* forceMount : les produits restent dans le HTML (référencement), masqués en CSS une fois fermés */}
                  <AccordionPrimitive.Content
                    forceMount
                    className="overflow-hidden data-[state=closed]:hidden data-[state=open]:animate-accordion-down"
                  >
                    <div className="mx-5 border-t border-gray-100 pb-6 pt-6 md:mx-7 md:pb-8">
                      {avecGroupes ? (
                        <div className="grid gap-8 md:grid-cols-3">
                          {pole.groupes.map((groupe) => (
                            <div key={groupe.titre}>
                              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-odillon-dark/70">
                                {groupe.titre}
                              </p>
                              <ListeProduits produits={groupe.produits} couleur={pole.couleur} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ListeProduits
                          produits={pole.groupes.flatMap((g) => g.produits)}
                          couleur={pole.couleur}
                          className="sm:grid-cols-2"
                        />
                      )}

                      {pole.liens && (
                        <div className="mt-8 flex flex-wrap gap-3">
                          {pole.liens.map((lien, i) => (
                            <Button key={lien.href} asChild variant={i === 0 ? "default" : "outline"} size="sm" className="h-10 px-5">
                              <a href={lien.href} download={lien.telechargement ? "" : undefined}>
                                {lien.telechargement ? (
                                  <Download className="mr-2 size-4" aria-hidden="true" />
                                ) : null}
                                {lien.libelle}
                                {!lien.telechargement ? (
                                  <ChevronRight className="ml-1.5 size-4" aria-hidden="true" />
                                ) : null}
                              </a>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionItem>
              </BlurFade>
            )
          })}
        </Accordion>

        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <CtaBanner
            title="Un projet en tête ?"
            description="Dites-nous où vous en êtes : nous vous orientons vers les produits adaptés à votre situation."
            buttonText="Discutons de votre projet"
            buttonHref="/contact"
            badgeText="Contact"
          />
        </div>

        <VideosSection title="Témoignages Clients" badge="Témoignages" videos={videosTemoignages} />
      </div>
    </section>
  )
}
