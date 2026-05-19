"use client"

import { useState, useEffect } from "react"
import { m } from "framer-motion"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CtaBanner } from "@/components/sections/cta-banner"
import { VideoSection } from "@/components/sections/video-section"
import { VideosSection } from "@/components/sections/videos-section"
import type { VideoItem } from "@/components/sections/videos-section"
import { Video } from "@/types/admin"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern"
import { DottedMap } from "@/components/ui/dotted-map"
import Link from "next/link"
import { servicesData as rawServicesData } from "@/lib/services-data"
import {
  Shield,
  Scale,
  TrendingUp,
  Users,
  ArrowRight,
  Target,
  FileText,
  Users2,
  BarChart3,
  Award,
  Lightbulb,
  Rocket,
  ChevronRight,
  Search,
  Quote,
  ChevronLeft,
  PenLine,
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

// Petit composant pour les icônes flottantes décoratives
function FloatingIcon({ icon: Icon, delay, x, y, size = 24, color }: { icon: any, delay: number, x: string, y: string, size?: number, color: string }) {
  return (
    <m.div
      className="absolute pointer-events-none z-0"
      style={{ left: x, top: y }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        y: [0, -30, 0],
        rotate: [0, 10, -10, 0],
        opacity: [0.03, 0.1, 0.03]
      }}
      transition={{
        duration: 15,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Icon size={size} style={{ color }} strokeWidth={1} />
    </m.div>
  )
}

// Mapping des configurations Bento Grid pour chaque service
const bentoConfig: Record<string, string> = {
  "gouvernance": "lg:col-span-2 lg:row-span-2",
  "juridique": "lg:col-span-2",
  "finances": "lg:col-span-1",
  "ressources-humaines": "lg:col-span-1",
  "formations": "lg:col-span-1",
  "communication": "lg:col-span-1",
  "entreprenariat": "lg:col-span-2",
  "paie": "lg:col-span-2",
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
    <section className="relative overflow-x-clip bg-transparent">
      {/* Hero Section */}
      <div className="relative pt-12 pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 overflow-hidden" role="banner" aria-label="Section héro des offres">
        {/* Background enrichi */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Base Grid */}
          <InteractiveGridPattern
            width={60}
            height={60}
            squares={[20, 20]}
            className="opacity-[0.12] stroke-gray-300"
          />

          {/* Dotted Map of Gabon (Rooting) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.05] rotate-6 scale-110 pointer-events-none">
            <DottedMap dotColor="#1A9B8E" dotRadius={0.4} stagger={true} />
          </div>

          {/* Decorative Glowing Orbs */}
          <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-odillon-teal/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-odillon-lime/10 rounded-full blur-[100px] animate-pulse" />

          {/* Floating Icons for Engineering feel */}
          <FloatingIcon icon={Rocket} delay={0} x="10%" y="20%" color="#1A9B8E" size={32} />
          <FloatingIcon icon={Target} delay={2} x="85%" y="15%" color="#C4D82E" size={40} />
          <FloatingIcon icon={Lightbulb} delay={4} x="15%" y="70%" color="#C4D82E" size={36} />
          <FloatingIcon icon={TrendingUp} delay={6} x="80%" y="75%" color="#1A9B8E" size={44} />

          {/* Decorative SVG Lines (Simulating drawing/sketching) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.1] pointer-events-none">
            <m.path
              d="M-50,300 Q200,50 600,400 T1200,200"
              fill="none"
              stroke="#1A9B8E"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4, delay: 0.5, ease: "easeInOut" }}
            />
            <m.path
              d="M1400,100 Q1000,500 500,200 S-100,600"
              fill="none"
              stroke="#C4D82E"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 5, delay: 1, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <Badge 
                variant="odillon" 
                className="mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm bg-white/50 border-odillon-teal/20"
              >
                Together we draw <PenLine className="w-4 h-4 text-odillon-teal animate-bounce" aria-hidden="true" /> the future
              </Badge>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="font-baskvill text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-6 md:mb-8 leading-[1.1] tracking-tight">
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
                <Button size="lg" className="rounded-full bg-odillon-teal hover:bg-odillon-teal/90 text-white px-8 h-12 text-base" asChild>
                  <Link href="/contact">Démarrer un projet</Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full border-gray-200 hover:bg-gray-50 px-8 h-12 text-base group" asChild>
                  <a href="#expertises">
                    Explorer nos pôles
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Decorative Scroll Indicator */}
        <div className="absolute bottom-8 left-0 w-full hidden md:flex justify-center pointer-events-none z-20">
          <m.div 
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold mr-[-0.2em]">Découvrir</span>
            <div className="w-px h-12 bg-gradient-to-b from-odillon-teal/50 to-transparent shadow-[0_0_8px_rgba(26,155,142,0.1)]" />
          </m.div>
        </div>
      </div>

      <div id="expertises" className="scroll-mt-20">
        <VideoSection video={video} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-8 md:pt-12">

        {/* Section titre */}
        <BlurFade delay={0.4}>
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="odillon" className="mb-3">
              Nos domaines d'expertise
            </Badge>
            <h2 className="font-baskvill text-2xl md:text-3xl text-gray-900 mb-3">
              8 pôles d'accompagnement
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Chaque offre est conçue pour répondre aux enjeux spécifiques des entreprises gabonaises, avec un ancrage fort dans la législation locale et le droit OHADA.
            </p>
          </div>
        </BlurFade>

        {/* Grille des 8 offres */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-24">
          {servicesData.map((service, idx) => {
            const Icon = service.iconComponent
            const subCount = service.services.length
            const detailCount = service.services.reduce((acc, s) => acc + s.details.length, 0)
            return (
              <BlurFade key={service.id} delay={0.1 + idx * 0.05}>
                <Link href={`/offres/${service.id}`} className="block h-full group/card">
                  <div className="relative bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 overflow-hidden h-full flex flex-col rounded-xl hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                    {/* Background Hover Glow */}
                    <div 
                      className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover/card:opacity-20 transition-opacity duration-500"
                      style={{ backgroundColor: service.color }}
                    />
                    
                    {/* Color accent bar */}
                    <div
                      className="h-1.5 w-full"
                      style={{ backgroundColor: service.color }}
                    />

                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      {/* Icon + Title */}
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-500 shadow-sm"
                          style={{ backgroundColor: `${service.color}15`, color: service.color }}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="font-bold text-base md:text-lg text-gray-900 leading-tight group-hover/card:text-gray-800 transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: service.color }}>
                            {service.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {service.description && (
                        <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3 flex-1 group-hover/card:text-gray-600 transition-colors">
                          {service.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="mt-auto pt-4 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                              {subCount} prestation{subCount > 1 ? "s" : ""}
                            </span>
                            <span className="text-[10px] text-gray-300">
                               {detailCount} points d&apos;expertise
                            </span>
                          </div>
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover/card:bg-gray-900 group-hover/card:text-white"
                            style={{ color: service.color, backgroundColor: `${service.color}10` }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
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
