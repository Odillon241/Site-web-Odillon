"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { BackgroundSlideshow } from "@/components/ui/background-slideshow"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/shadcn-io/marquee"
import { CtaBanner } from "@/components/sections/cta-banner"
import { VideoSection } from "@/components/sections/video-section"
import { VideosSection } from "@/components/sections/videos-section"
import type { VideoItem } from "@/components/sections/videos-section"
import { Video } from "@/types/admin"
import { DEFAULT_PHOTOS } from "@/lib/photo-themes"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
  ArrowRightLeft,
  Minimize2,
  ShieldCheck,
  ClipboardList,
  Ban,
  Quote,
  ChevronLeft,
  PenLine,
  Landmark,
  GraduationCap,
  Megaphone
} from "lucide-react"

// Mapping des noms d'icônes vers les composants
const iconMap: Record<string, React.ComponentType<any>> = {
  Award,
  Lightbulb,
  Rocket,
  Search,
  ArrowRightLeft,
  Minimize2,
  ShieldCheck,
  ClipboardList,
  Ban,
  Shield,
  Scale,
  TrendingUp,
  Users,
  Users2,
  Target,
  FileText,
  BarChart3,
  Landmark,
  GraduationCap,
  Megaphone
}

// Transformer les données pour utiliser les composants icons
const servicesData = rawServicesData.map(service => ({
  ...service,
  icon: iconMap[service.icon] || Shield,
  keyBenefits: service.keyBenefits.map(b => ({
    ...b,
    icon: iconMap[b.icon] || Target
  })),
  workflow: service.workflow.map(w => ({
    ...w,
    icon: iconMap[w.icon] || FileText
  })),
  services: service.services.map(s => ({
    ...s,
    icon: iconMap[s.icon] || Target
  }))
}))

export function ServicesDetailed() {
  const [activeTab, setActiveTab] = useState("gouvernance")
  const activeService = servicesData.find(s => s.id === activeTab)
  const tabsContentRef = useRef<HTMLDivElement>(null)

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
    // Scroll vers le contenu de l'onglet après un court délai pour laisser le rendu se faire
    setTimeout(() => {
      tabsContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [])
  const [video, setVideo] = useState<Video | null>(null)
  const [testimonialVideos, setTestimonialVideos] = useState<VideoItem[]>([])
  const [testimonials, setTestimonials] = useState<Array<{
    quote: string
    name: string
    position: string
    avatar: string
  }>>([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [heroImages, setHeroImages] = useState<Array<{ src: string; alt: string }>>(
    DEFAULT_PHOTOS.slice(0, 4).map(p => ({ src: p.src, alt: p.alt }))
  )

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        // Try fetching active photos from the API
        const res = await fetch('/api/photos?active=true')
        if (res.ok) {
          const data = await res.json()
          const photos = data.photos || data
          if (Array.isArray(photos)) {
            // Filter out photos with empty or missing src
            const validPhotos = photos
              .filter((p: any) => p.src && typeof p.src === 'string' && p.src.trim() !== '')
              .map((p: any) => ({ src: p.src, alt: p.alt || 'Odillon' }))
            if (validPhotos.length > 0) {
              setHeroImages(validPhotos)
              return
            }
          }
        }
      } catch (e) {
        // Fallback: try settings for a single hero image
        try {
          const settingsRes = await fetch('/api/settings')
          if (settingsRes.ok) {
            const data = await settingsRes.json()
            const settings = data.settings || data
            if (settings?.services_hero_image_url && settings.services_hero_image_url.trim() !== '') {
              setHeroImages([{ src: settings.services_hero_image_url, alt: 'Activités du cabinet Odillon' }])
              return
            }
          }
        } catch (_) {
          // Keep default photos
        }
      }
    }
    fetchHeroImages()
  }, [])

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
        // Charger les vidéos de témoignages
        const testimonialRes = await fetch('/api/videos?category=testimonial&active=true')
        if (testimonialRes.ok) {
          const testimonialData = await testimonialRes.json()
          setTestimonialVideos(
            (testimonialData.videos || []).map((v: any) => {
              // Détecter automatiquement le type si l'URL ne correspond pas au type enregistré
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
        // Fallback vers les témoignages par défaut si la base de données n'est pas disponible
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
      <div className="relative pt-6 pb-12 md:pt-10 md:pb-16 lg:pt-12 lg:pb-20 overflow-hidden" role="banner" aria-label="Section héro des services">
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
                Des services qui transforment{" "}
                <span className="bg-gradient-to-r from-odillon-teal to-odillon-lime bg-clip-text text-transparent">
                  votre entreprise
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Solutions complètes en ingénierie d'entreprises pour structurer,
                développer et pérenniser votre organisation.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      <VideoSection video={video} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-8 md:pt-12">

        {/* Tabs Navigation */}
        <BlurFade delay={0.4}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {/* Desktop: horizontal bar / Mobile: 2x2 grid */}
            <TabsList className="flex flex-wrap justify-center lg:inline-flex lg:flex-nowrap w-full bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-lg h-auto p-1.5 mb-8 md:mb-12 shadow-sm gap-1">
              {servicesData.map((service) => {
                const Icon = service.icon
                const isActive = activeTab === service.id
                return (
                  <TabsTrigger
                    key={service.id}
                    value={service.id}
                    className="relative group flex-1 min-w-[calc(50%-4px)] lg:min-w-0 rounded-lg px-3 py-2.5 md:px-5 md:py-3 h-auto transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md border border-transparent data-[state=active]:border-gray-200/60 hover:bg-gray-50/80"
                  >
                    <div className="flex items-center justify-center gap-2 md:gap-2.5">
                      <div
                        className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0"
                        style={{
                          backgroundColor: isActive ? `${service.color}18` : 'transparent',
                          color: isActive ? service.color : '#6b7280'
                        }}
                      >
                        <Icon className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                      </div>
                      <span
                        className="font-semibold text-xs md:text-sm leading-tight transition-colors duration-300"
                        style={{ color: isActive ? service.color : '#374151' }}
                      >
                        {service.title}
                      </span>
                    </div>

                    {/* Active indicator - gradient underline */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full transition-all duration-400 ease-out"
                      style={{
                        width: isActive ? '60%' : '0%',
                        background: isActive
                          ? `linear-gradient(90deg, ${service.color}00, ${service.color}, ${service.color}00)`
                          : 'transparent'
                      }}
                    />

                    {/* Subtle glow on active */}
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-lg opacity-[0.04] pointer-events-none"
                        style={{ backgroundColor: service.color }}
                      />
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <div ref={tabsContentRef} className="scroll-mt-[120px]" />
            {servicesData.map((service) => (
              <TabsContent key={service.id} value={service.id} className="space-y-10 md:space-y-14 mt-0 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
                {/* Service Header - Redesigned */}
                <FadeIn>
                  <div className="rounded-lg bg-white border border-gray-100 shadow-sm">
                    <div className="px-5 md:px-8 py-6 md:py-8">
                      {/* Title row */}
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-11 h-11 md:w-14 md:h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${service.color}12`, color: service.color }}
                        >
                          {(() => { const SIcon = service.icon; return <SIcon className="w-5 h-5 md:w-7 md:h-7" /> })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-baskvill text-2xl md:text-3xl text-gray-900 mb-1">{service.title}</h2>
                          <p className="text-sm md:text-base font-medium" style={{ color: service.color }}>
                            {service.tagline}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 max-w-3xl">
                        {service.description}
                      </p>

                      {/* Key Benefits - refined pills */}
                      <div className="flex flex-wrap gap-3">
                        {service.keyBenefits.map((benefit, idx) => {
                          const BenefitIcon = benefit.icon
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition-colors duration-200"
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${service.color}12`, color: service.color }}
                              >
                                <BenefitIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-xs md:text-sm text-gray-900 leading-tight">{benefit.text}</div>
                                <div className="text-[10px] md:text-xs text-gray-500">{benefit.detail}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {/* Workflow - Cleaner Marquee */}
                <FadeIn delay={0.1}>
                  <div>
                    <div className="text-center mb-6 md:mb-8">
                      <h3 className="font-baskvill text-xl md:text-2xl text-gray-900 mb-2">
                        Notre méthode d'accompagnement
                      </h3>
                      <p className="text-sm md:text-base text-gray-500">Un processus éprouvé pour sécuriser votre activité</p>
                    </div>

                    <Marquee className="py-4">
                      <MarqueeFade side="left" />
                      <MarqueeFade side="right" />
                      <MarqueeContent speed={35} pauseOnHover={true}>
                        {service.workflow.map((step, idx) => {
                          const StepIcon = step.icon
                          return (
                            <MarqueeItem key={idx} className="w-72 md:w-80">
                              <div className="bg-white rounded-lg border border-gray-100 p-5 md:p-6 hover:shadow-md hover:border-gray-200 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{
                                      backgroundColor: `${service.color}12`,
                                      color: service.color
                                    }}
                                  >
                                    <StepIcon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <span
                                      className="text-[10px] font-bold uppercase tracking-widest"
                                      style={{ color: service.color }}
                                    >
                                      Étape {step.step}
                                    </span>
                                    <h4 className="font-bold text-sm md:text-base text-gray-900 leading-tight">{step.title}</h4>
                                  </div>
                                </div>
                                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{step.description}</p>
                              </div>
                            </MarqueeItem>
                          )
                        })}
                      </MarqueeContent>
                    </Marquee>
                  </div>
                </FadeIn>

                {/* Services Details - Refined cards */}
                <FadeIn delay={0.2}>
                  <div>
                    <div className="text-center mb-6 md:mb-8">
                      <h3 className="font-baskvill text-xl md:text-2xl text-gray-900 mb-2">
                        Nos prestations en détail
                      </h3>
                      <p className="text-sm md:text-base text-gray-500">Explorez chaque service pour comprendre comment nous pouvons vous aider</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 md:gap-5">
                      {service.services.map((subService, idx) => {
                        const SubIcon = subService.icon
                        return (
                          <div key={idx} className="bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 group overflow-hidden">
                            {/* Card header */}
                            <div className="px-5 md:px-6 pt-5 md:pt-6 pb-3">
                              <div className="flex items-start gap-3 mb-2.5">
                                <div
                                  className="w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                                  style={{ backgroundColor: `${service.color}12`, color: service.color }}
                                >
                                  <SubIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-sm md:text-base text-gray-900 leading-tight">{subService.name}</h4>
                                  <p className="text-xs font-medium mt-0.5" style={{ color: service.color }}>
                                    {subService.tagline}
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                                {subService.description}
                              </p>
                            </div>

                            {/* Accordion details */}
                            <div className="px-5 md:px-6 pb-4 md:pb-5">
                              <Separator className="mb-3" />
                              <Accordion type="multiple" className="w-full">
                                {subService.details.map((detail, detailIdx) => (
                                  <AccordionItem
                                    key={detailIdx}
                                    value={`item-${detailIdx}`}
                                    className="border-b border-gray-100 last:border-0"
                                  >
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-left">
                                      <span className="text-xs md:text-sm font-medium text-gray-800">{detail.title}</span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-2.5 pt-1 pb-2">
                                        <div
                                          className="bg-gray-50/80 p-3 rounded-lg border-l-2"
                                          style={{ borderColor: service.color }}
                                        >
                                          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                            {detail.content}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-50/60 to-transparent rounded-lg">
                                          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Impact</span>
                                          <p className="text-xs md:text-sm font-medium text-gray-800">{detail.impact}</p>
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </FadeIn>

                {/* CTA Section - full width breakout */}
                <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
                  <CtaBanner
                    title={`Prêt à transformer votre ${service.title.toLowerCase()} ?`}
                    description="Discutons de vos enjeux et découvrez comment nos solutions peuvent propulser votre organisation vers l'excellence."
                    buttonText="Discutons de votre projet"
                    buttonHref="/contact"
                    badgeText="Excellence"
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

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

              {/* Testimonials Carousel - Refined */}
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

                    {/* Navigation - Cleaner */}
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
        </BlurFade>
      </div>
    </section>
  )
}
