"use client"

import { useState, useEffect } from "react"
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
      <div className="relative pt-6 pb-12 md:pt-10 md:pb-16 lg:pt-12 lg:pb-20 overflow-hidden" role="banner" aria-label="Section héro des offres">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-odillon-teal/5 via-transparent to-odillon-lime/5" />
          <div className="absolute -top-24 -right-24 w-96 h-96 border border-odillon-teal/10 rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] border border-odillon-lime/10 rounded-full" />
          <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-transparent via-odillon-teal/10 to-transparent hidden lg:block" />
          <div className="absolute top-0 right-[15%] w-px h-full bg-gradient-to-b from-transparent via-odillon-lime/10 to-transparent hidden lg:block" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <Badge variant="odillon" className="mb-4 md:mb-6 inline-flex items-center gap-1.5">
                Together we draw <PenLine className="w-3.5 h-3.5 inline" aria-hidden="true" /> the future
              </Badge>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="font-baskvill text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 md:mb-6 leading-tight">
                Des offres qui transforment{" "}
                <span className="bg-gradient-to-r from-odillon-teal to-odillon-lime bg-clip-text text-transparent">
                  votre entreprise
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Solutions adaptées en accompagnement pour structurer,
                développer et pérenniser votre organisation.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      <VideoSection video={video} />

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 mb-12 md:mb-16">
          {servicesData.map((service, idx) => {
            const Icon = service.iconComponent
            const subCount = service.services.length
            const detailCount = service.services.reduce((acc, s) => acc + s.details.length, 0)
            return (
              <BlurFade key={service.id} delay={0.1 + idx * 0.05}>
                <Link href={`/offres/${service.id}`} className="block h-full">
                  <div className="group relative bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Color accent bar */}
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: service.color }}
                    />

                    <div className="p-5 md:p-6 flex flex-col flex-1">
                      {/* Icon + Title */}
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                          style={{ backgroundColor: `${service.color}12`, color: service.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm md:text-base text-gray-900 leading-tight group-hover:text-gray-700 transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-[11px] md:text-xs font-medium mt-0.5" style={{ color: service.color }}>
                            {service.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {service.description && (
                        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3 flex-1">
                          {service.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] md:text-xs text-gray-400">
                            {subCount} prestation{subCount > 1 ? "s" : ""} · {detailCount} points
                          </span>
                          <span
                            className="inline-flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all duration-300"
                            style={{ color: service.color }}
                          >
                            Explorer
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
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

        <Separator className="my-12 md:my-16 lg:my-20" />

        {/* Section Nos Valeurs */}
        <BlurFade delay={0.7}>
          <div className="mb-12 md:mb-16 lg:mb-20">
            <div className="text-center mb-8 md:mb-12">
              <Badge variant="odillon" className="mb-4">
                Nos Valeurs
              </Badge>
              <h2 className="font-baskvill text-2xl md:text-3xl text-gray-900 mb-3">
                Les principes qui nous guident
              </h2>
              <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Des valeurs fondamentales qui inspirent notre action quotidienne et façonnent notre engagement envers l'excellence.
              </p>
            </div>

            {/* Testimonials Carousel */}
            {testimonials.length > 0 && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden" role="region" aria-label="Carousel de témoignages" aria-roledescription="carousel">
                  <div className="px-6 md:px-10 py-8 md:py-10" aria-live="polite" aria-atomic="true">
                    {/* Quote icon */}
                    <div className="flex justify-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-odillon-teal/8 flex items-center justify-center">
                        <Quote className="h-5 w-5 text-odillon-teal/40" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Quote text */}
                    <blockquote className="text-center text-base md:text-lg font-medium text-gray-700 leading-relaxed mb-8 italic">
                      &laquo; {testimonials[currentTestimonial].quote} &raquo;
                    </blockquote>

                    {/* Author */}
                    <div className="flex flex-col items-center">
                      <Avatar className="mb-3 h-12 w-12 ring-2 ring-gray-100">
                        <AvatarImage
                          src={testimonials[currentTestimonial].avatar}
                          alt={testimonials[currentTestimonial].name}
                        />
                        <AvatarFallback className="bg-odillon-teal/10 text-odillon-teal font-semibold text-sm">
                          {testimonials[currentTestimonial].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-semibold text-sm text-gray-900">{testimonials[currentTestimonial].name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{testimonials[currentTestimonial].position}</p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-center gap-3 pb-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                      className="h-11 w-11 md:h-8 md:w-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                      aria-label="Témoignage précédent"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <div className="flex items-center gap-1.5" role="tablist" aria-label="Navigation des témoignages">
                      {testimonials.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentTestimonial(idx)}
                          role="tab"
                          aria-selected={idx === currentTestimonial}
                          className={`relative rounded-full transition-all duration-300 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center`}
                          aria-label={`Aller au témoignage ${idx + 1} sur ${testimonials.length}`}
                        >
                          <span className={`block rounded-full transition-all duration-300 ${idx === currentTestimonial
                            ? "w-5 h-1.5 bg-odillon-teal"
                            : "w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300"
                            }`} />
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                      className="h-11 w-11 md:h-8 md:w-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                      aria-label="Témoignage suivant"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
