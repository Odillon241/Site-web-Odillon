"use client"

import { useState, useEffect } from "react"
import { m } from "framer-motion"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { AnimatedSlogan } from "@/components/magicui/animated-slogan"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CtaBanner } from "@/components/sections/cta-banner"
import { VideoSection } from "@/components/sections/video-section"
import { VideosSection } from "@/components/sections/videos-section"
import type { VideoItem } from "@/components/sections/videos-section"
import { Video } from "@/types/admin"
import Link from "next/link"
import { servicesData as rawServicesData } from "@/lib/services-data"
import {
  Shield,
  Scale,
  TrendingUp,
  Users,
  Target,
  FileText,
  Users2,
  BarChart3,
  Award,
  Lightbulb,
  Rocket,
  ChevronRight,
  Search,
  Landmark,
  GraduationCap,
  Megaphone,
  Banknote
} from "lucide-react"

// Mapping des noms d'icônes vers les composants
const iconMap: Record<string, React.ComponentType<any>> = {
  Award, Lightbulb, Rocket, Search, Shield, Scale, TrendingUp,
  Users, Users2, Target, FileText, BarChart3, Landmark,
  GraduationCap, Megaphone, Banknote
}

// Transformer les données pour utiliser les composants icons
const servicesData = rawServicesData.map(service => ({
  ...service,
  iconComponent: iconMap[service.icon] || Shield,
}))

// Mapping des configurations Bento Grid pour chaque service
const bentoConfig: Record<string, string> = {
  "gouvernance": "lg:col-span-2",
  "juridique": "lg:col-span-2",
  "ressources-humaines": "lg:col-span-2",
  "formations": "lg:col-span-2",
}

export function ServicesDetailed() {
  const [video, setVideo] = useState<Video | null>(null)
  const [testimonialVideos, setTestimonialVideos] = useState<VideoItem[]>([])
  const [testimonials, setTestimonials] = useState<Array<{
    quote: string
    name: string
    position: string
    avatar: string
  }>>([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch('/api/videos?active=true')
        if (res.ok) {
          const data = await res.json()
          const found = (data.videos || []).find((v: Video) => v.page === 'Services' && v.section === 'Contenu')
          if (found) setVideo(found)
        }
      } catch (e) {
        console.error("Failed to fetch video", e)
      }
    }
    fetchVideo()

    const loadVideos = async () => {
      try {
        const testimonialRes = await fetch('/api/videos?category=testimonial&active=true')
        if (testimonialRes.ok) {
          const testimonialData = await testimonialRes.json()
          setTestimonialVideos(
            (testimonialData.videos || []).map((v: any) => {
              let videoType = v.type as 'youtube' | 'vimeo' | 'direct'
              if (v.url.includes("youtube.com") || v.url.includes("youtu.be")) {
                videoType = "youtube"
              } else if (v.url.includes("vimeo.com")) {
                videoType = "vimeo"
              }
              return {
                id: v.id,
                title: v.title,
                description: v.description || undefined,
                url: v.url,
                type: videoType,
                thumbnail: v.thumbnail || undefined
              }
            })
          )
        }
      } catch (error) {
        console.error("Erreur lors du chargement des vidéos:", error)
      }
    }

    const loadTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials?active=true')
        if (res.ok) {
          const data = await res.json()
          setTestimonials(
            (data.testimonials || []).map((t: any) => ({
              quote: t.quote,
              name: t.name,
              position: t.position,
              avatar: t.avatar_url
            }))
          )
        }
      } catch (error) {
        console.error("Erreur lors du chargement des témoignages:", error)
        setTestimonials([
          {
            quote: "Compréhension approfondie de vos enjeux, contraintes et objectifs avant toute intervention",
            name: "Écoute Active",
            position: "Notre Approche - Étape 1",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&w=100&q=80"
          },
          {
            quote: "Conception de stratégies personnalisées adaptées à votre contexte organisationnel unique",
            name: "Solutions Sur-Mesure",
            position: "Notre Approche - Étape 2",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&w=100&q=80"
          },
          {
            quote: "Travail main dans la main avec vos équipes pour garantir appropriation et pérennité",
            name: "Collaboration",
            position: "Notre Approche - Étape 3",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&w=100&q=80"
          },
          {
            quote: "Engagement sur des livrables concrets avec indicateurs de performance clairs et transparents",
            name: "Résultats Mesurables",
            position: "Notre Approche - Étape 4",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&w=100&q=80"
          }
        ])
      }
    }

    loadVideos()
    loadTestimonials()
  }, [])

  return (
    <section className="od-page relative overflow-x-clip">
      {/* Hero Section */}
      <div className="od-section relative overflow-hidden py-16 md:py-20 lg:py-24" role="banner" aria-label="Section héro des offres">
        {/* Background enrichi */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(57,131,122,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(57,131,122,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-odillon-teal/25 to-transparent" />
        </div>

        {/* Content */}
        <div className="od-container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <FadeIn delay={0.1} className="flex justify-center">
              <AnimatedSlogan
                text="Together we the future"
                iconPosition={2}
                className="mb-6 md:mb-8 text-odillon-teal"
              />
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="od-heading-display mb-6 text-4xl sm:text-5xl lg:text-6xl">
                Des offres qui transforment{" "}
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
                Solutions d&apos;accompagnement stratégique pour structurer,
                développer et pérenniser votre organisation dans un monde en mutation.
              </p>
            </FadeIn>

            <FadeIn delay={0.6} className="mt-10 md:mt-12">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <Link href="/contact">Démarrer un projet</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base group" asChild>
                  <a href="#expertises">
                    Explorer nos pôles
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <div id="expertises" className="scroll-mt-20">
        <VideoSection video={video} />
      </div>

      <div className="od-container relative z-10 pt-8 md:pt-12">

        {/* Section titre */}
        <BlurFade delay={0.4}>
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="odillon" className="mb-3">
              Nos domaines d'expertise
            </Badge>
            <h2 className="font-baskvill italic text-2xl md:text-3xl text-gray-900 mb-3">
              4 pôles d'accompagnement
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Chaque offre est conçue pour répondre aux enjeux spécifiques des entreprises gabonaises, avec un ancrage fort dans la législation locale et le droit OHADA.
            </p>
          </div>
        </BlurFade>

        {/* Grille des 4 offres */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-24">
          {servicesData.map((service, idx) => {
            const Icon = service.iconComponent
            const subCount = service.services.length
            const spanClass = bentoConfig[service.id] || "lg:col-span-1"
            const isLarge = spanClass.includes("col-span-2")

            return (
              <BlurFade key={service.id} delay={0.1 + idx * 0.05} className={spanClass}>
                <article
                  id={service.id}
                  className="h-full scroll-mt-28 group/card"
                  aria-labelledby={`offre-${service.id}`}
                >
                  <div className="od-surface relative flex h-full min-h-[360px] flex-col overflow-hidden transition-all duration-500 hover:border-odillon-teal/20 hover:shadow-md hover:shadow-[#0A1F2C]/[0.05]">
                    {/* Background Hover Glow */}
                    <div 
                      className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover/card:opacity-20 transition-opacity duration-500"
                      style={{ backgroundColor: service.color }}
                      aria-hidden="true"
                    />
                    
                    {/* Color accent bar */}
                    <div
                      className="h-1.5 w-full"
                      style={{ backgroundColor: service.color }}
                      aria-hidden="true"
                    />

                    <div className={isLarge ? "p-8 md:p-10 flex flex-col flex-1" : "p-5 md:p-6 flex flex-col flex-1"}>
                      {/* Icon + Title */}
                      <div className={isLarge ? "flex items-start gap-4 mb-4" : "flex items-start gap-3 mb-3"}>
                        <div
                          className={isLarge 
                            ? "w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/card:scale-105 transition-all duration-500 shadow-sm"
                            : "w-11 h-11 rounded-md flex items-center justify-center flex-shrink-0 group-hover/card:scale-105 transition-all duration-500 shadow-sm"
                          }
                          style={{ backgroundColor: `${service.color}15`, color: service.color }}
                        >
                          <Icon className={isLarge ? "w-7 h-7" : "w-5 h-5"} aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h3 className={isLarge 
                            ? "font-baskvill italic text-xl md:text-2xl text-gray-900 leading-tight group-hover/card:text-gray-800 transition-colors"
                            : "font-baskvill italic text-lg md:text-xl text-gray-900 leading-tight group-hover/card:text-gray-800 transition-colors"
                          } id={`offre-${service.id}`}>
                            {service.title}
                          </h3>
                          <p className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color: service.color }}>
                            {service.tagline}
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-2.5 mb-5 relative z-10">
                        {service.services.map((item) => (
                          <li key={item.slug} className="flex gap-2.5 text-sm text-gray-700 leading-relaxed">
                            <span
                              className="mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: service.color }}
                              aria-hidden="true"
                            />
                            <span>{item.name}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Footer CTA */}
                      <div className="mt-auto pt-4 border-t border-gray-50 relative z-10">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="mb-3 w-full group/cta border transition-all hover:brightness-95"
                          style={{
                            backgroundColor: `${service.color}15`,
                            borderColor: `${service.color}80`,
                            color: service.color,
                          }}
                        >
                          <Link href="/contact">
                            Discutons de votre projet
                            <ChevronRight className="ml-2 w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform" aria-hidden="true" />
                          </Link>
                        </Button>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                          {subCount} prestation{subCount > 1 ? "s" : ""} listée{subCount > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Numéro décoratif — sous le contenu et le CTA */}
                    <div
                      className={`flex items-end justify-end shrink-0 pointer-events-none select-none ${
                        isLarge ? "h-14 md:h-16 px-6 md:px-8 pb-3 md:pb-4" : "h-12 md:h-14 px-5 md:px-6 pb-2 md:pb-3"
                      }`}
                      aria-hidden="true"
                    >
                      <span
                        className={`font-black text-gray-900/[0.03] group-hover/card:text-gray-900/[0.05] transition-colors duration-500 font-sans leading-none ${
                          isLarge ? "text-6xl md:text-7xl" : "text-5xl md:text-6xl"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </article>
              </BlurFade>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <CtaBanner
            title="Prêt à transformer votre entreprise ?"
            description="Discutons de vos enjeux et découvrez comment nos solutions peuvent propulser votre organisation vers l'excellence."
            buttonText="Discutons de votre projet"
            buttonHref="/contact"
            badgeText="Excellence"
          />
        </div>

        {/* Section Vidéos de Témoignages */}
        <VideosSection
          title="Témoignages Clients"
          badge="Témoignages"
          videos={testimonialVideos}
        />
      </div>
    </section>
  )
}
