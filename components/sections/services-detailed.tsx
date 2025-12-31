"use client"

import { useState, useEffect } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/shadcn-io/marquee"
import { CtaBanner } from "@/components/sections/cta-banner"
import { VideoSection } from "@/components/sections/video-section"
import { Video } from "@/types/admin"
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
  Briefcase,
  Award,
  Lightbulb,
  Rocket,
  ChevronRight
} from "lucide-react"
import Link from "next/link"

// Mapping des noms d'icônes vers les composants
const iconMap: Record<string, React.ComponentType<any>> = {
  Shield,
  Scale,
  TrendingUp,
  Users,
  Target,
  FileText,
  Users2,
  BarChart3,
  Briefcase,
  Award,
  Lightbulb,
  Rocket,
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
  const [video, setVideo] = useState<Video | null>(null)

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
  }, [])

  return (
    <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-transparent">
      {/* Hero Section with Background */}
      <div className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-transparent">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Soft gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-odillon-teal/5 via-transparent to-odillon-lime/5" />

          {/* Large circle patterns */}
          <div className="absolute -top-24 -right-24 w-96 h-96 border border-odillon-teal/10 rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] border border-odillon-lime/10 rounded-full" />

          {/* Smaller decorative circles */}
          <div className="absolute top-1/4 right-1/3 w-32 h-32 border border-odillon-teal/20 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 border border-odillon-lime/20 rounded-full animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

          {/* Simple grid overlay */}
          <div className="absolute inset-0 opacity-[0.15]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="services-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-odillon-teal"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#services-grid)" />
            </svg>
          </div>

          {/* Subtle dots pattern */}
          <div className="absolute inset-0 opacity-[0.08]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="services-dots" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-odillon-lime" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#services-dots)" />
            </svg>
          </div>

          {/* Floating squares */}
          <div className="absolute top-1/3 left-1/4 w-20 h-20 border-2 border-odillon-teal/15 transform rotate-12 animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border-2 border-odillon-lime/15 transform -rotate-12 animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />

          {/* Subtle light beams effect */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-odillon-teal/10 to-transparent" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-odillon-lime/10 to-transparent" />

          {/* Radial fade overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <FadeIn delay={0.1}>
              <Badge variant="odillon" className="mb-4 md:mb-6">
                Excellence · Expertise · Innovation
              </Badge>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                Des services qui transforment{" "}
                <span className="bg-gradient-to-r from-odillon-teal to-odillon-lime bg-clip-text text-transparent">
                  votre entreprise
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                Solutions complètes en ingénierie d'entreprises pour structurer, développer et pérenniser votre organisation.
                <br className="hidden sm:block" />
                <span className="text-sm md:text-base text-gray-500 mt-2 inline-block">
                  Chaque service est conçu pour répondre à vos enjeux avec finesse et expertise.
                </span>
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      <VideoSection video={video} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Tabs Navigation */}
        <BlurFade delay={0.4}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 bg-transparent h-auto p-0 mb-8 md:mb-12">
              {servicesData.map((service, index) => {
                const Icon = service.icon
                return (
                  <TabsTrigger
                    key={service.id}
                    value={service.id}
                    className="relative group data-[state=active]:bg-white data-[state=active]:shadow-lg border border-gray-200 data-[state=active]:border-gray-300 rounded-lg md:rounded-xl p-3 md:p-4 h-auto transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex flex-col items-center gap-1.5 md:gap-2 text-center">
                      <div
                        className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 group-data-[state=active]:scale-110"
                        style={{
                          backgroundColor: `${service.color}15`,
                          color: service.color
                        }}
                      >
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="font-semibold text-xs md:text-sm leading-tight">{service.title}</div>
                    </div>

                    {/* Active indicator */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 rounded-full transition-all duration-300 group-data-[state=active]:w-3/4"
                      style={{ backgroundColor: service.color }}
                    />
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {servicesData.map((service) => (
              <TabsContent key={service.id} value={service.id} className="space-y-8 md:space-y-12 mt-0">
                {/* Service Header */}
                <FadeIn>
                  <Card className="border-2 relative overflow-hidden" style={{ borderColor: `${service.color}30` }}>
                    <div
                      className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${service.gradient} pointer-events-none`}
                    />
                    <CardHeader className="relative px-4 md:px-6 py-4 md:py-6">
                      <CardTitle className="text-2xl md:text-3xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base md:text-lg font-medium" style={{ color: service.color }}>
                        {service.tagline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative px-4 md:px-6 pb-4 md:pb-6">
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 md:mb-6">
                        {service.description}
                      </p>

                      {/* Key Benefits */}
                      <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
                        {service.keyBenefits.map((benefit, idx) => {
                          const BenefitIcon = benefit.icon
                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm"
                            >
                              <div
                                className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${service.color}15`, color: service.color }}
                              >
                                <BenefitIcon className="w-4 h-4 md:w-5 md:h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-xs md:text-sm text-gray-900">{benefit.text}</div>
                                <div className="text-[10px] md:text-xs text-gray-600 mt-0.5">{benefit.detail}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Workflow */}
                <FadeIn delay={0.1}>
                  <div>
                    <div className="text-center mb-6 md:mb-8 px-4">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        Notre méthode d'accompagnement
                      </h3>
                      <p className="text-sm md:text-base text-gray-600">Un processus éprouvé en 4 étapes</p>
                    </div>

                    <Marquee className="py-4">
                      <MarqueeFade side="left" />
                      <MarqueeFade side="right" />
                      <MarqueeContent speed={40} pauseOnHover={true}>
                        {service.workflow.map((step, idx) => {
                          const StepIcon = step.icon
                          return (
                            <MarqueeItem key={idx} className="w-80">
                              <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                                <CardContent className="p-6 text-center">
                                  <div
                                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold relative z-10 bg-white shadow-lg"
                                    style={{
                                      color: service.color,
                                      border: `3px solid ${service.color}30`
                                    }}
                                  >
                                    <StepIcon className="w-8 h-8" />
                                  </div>
                                  <div className="text-xs font-semibold text-gray-500 mb-2">ÉTAPE {step.step}</div>
                                  <h4 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h4>
                                  <p className="text-sm text-gray-600">{step.description}</p>
                                </CardContent>
                              </Card>
                            </MarqueeItem>
                          )
                        })}
                      </MarqueeContent>
                    </Marquee>
                  </div>
                </FadeIn>

                {/* Services Details */}
                <FadeIn delay={0.2}>
                  <div>
                    <div className="text-center mb-6 md:mb-8 px-4">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        Nos prestations en détail
                      </h3>
                      <p className="text-sm md:text-base text-gray-600">Explorez chaque service pour comprendre comment nous pouvons vous aider</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
                      {service.services.map((subService, idx) => {
                        const SubIcon = subService.icon
                        return (
                          <Card key={idx} className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 group">
                            <CardHeader className="px-4 md:px-6 py-4 md:py-6">
                              <div className="flex items-start gap-2 md:gap-3 mb-2">
                                <div
                                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                                  style={{ backgroundColor: `${service.color}15`, color: service.color }}
                                >
                                  <SubIcon className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base md:text-xl">{subService.name}</CardTitle>
                                  <CardDescription className="text-xs md:text-sm font-medium mt-1" style={{ color: service.color }}>
                                    {subService.tagline}
                                  </CardDescription>
                                </div>
                              </div>
                              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                {subService.description}
                              </p>
                            </CardHeader>
                            <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
                              <Accordion type="multiple" className="w-full">
                                {subService.details.map((detail, detailIdx) => (
                                  <AccordionItem
                                    key={detailIdx}
                                    value={`item-${detailIdx}`}
                                    className="border-b border-gray-200 last:border-0"
                                  >
                                    <AccordionTrigger className="hover:no-underline py-2.5 md:py-3 text-left">
                                      <span className="text-xs md:text-sm font-medium text-gray-900">{detail.title}</span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-2 md:space-y-3 pt-2 pb-3">
                                        <div className="bg-gray-50 p-2.5 md:p-3 border-l-2" style={{ borderColor: service.color }}>
                                          <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                            {detail.content}
                                          </p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-2.5 md:p-3 border-l-2 border-gray-300">
                                          <div className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase mb-1">Impact mesurable</div>
                                          <p className="text-xs md:text-sm font-medium text-gray-900">{detail.impact}</p>
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </FadeIn>

                {/* CTA Section */}
                <CtaBanner
                  title={`Prêt à transformer votre ${service.title.toLowerCase()} ?`}
                  description="Discutons de vos enjeux et découvrez comment nos solutions peuvent propulser votre organisation vers l'excellence."
                  buttonText="Discutons de votre projet"
                  buttonHref="/contact"
                  badgeText="Excellence"
                />
              </TabsContent>
            ))}
          </Tabs>
        </BlurFade>
      </div>
    </section>
  )
}
