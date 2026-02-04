"use client"

import { m } from "framer-motion"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { AboutHeroBackground } from "@/components/ui/about-hero-background"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { TeamCard } from "@/components/ui/team-card"
import { Separator } from "@/components/ui/separator"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/shadcn-io/marquee"
import {
  Users,
  Target,
  Heart,
  Lightbulb,
  Award,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react"
import Link from "next/link"
import { TeamGrid } from "@/components/sections/team-grid"
import { VideoPlayer } from "@/components/ui/video-player"
import { Video } from "@/types/admin"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const timeline = [
  {
    year: "2017",
    title: "Fondation",
    description: "Création d'Odillon avec une vision claire : transformer le paysage entrepreneurial local.",
    color: "#39837a",
    icon: Sparkles
  },
  {
    year: "2019",
    title: "Expansion",
    description: "Développement de nos services et constitution d'une équipe d'experts multidisciplinaires.",
    color: "#C4D82E",
    icon: TrendingUp
  },
  {
    year: "2022",
    title: "Reconnaissance",
    description: "Certification internationale et positionnement comme leader régional en conseil.",
    color: "#39837a",
    icon: Award
  },
  {
    year: "2024",
    title: "Innovation",
    description: "Lancement de solutions digitales inédites pour accélérer la croissance de nos clients.",
    color: "#C4D82E",
    icon: Lightbulb
  },
  {
    year: "2025",
    title: "Expansion Régionale",
    description: "Ouverture de nouveaux bureaux et renforcement de notre présence sur le continent.",
    color: "#39837a",
    icon: Target
  },
  {
    year: "2026",
    title: "Excellence & Impact",
    description: "Consolidation de notre position de leader et lancement d'Odillon Academy.",
    color: "#C4D82E",
    icon: Sparkles
  }
]

const initialValues = [
  {
    icon: Award,
    title: "Excellence",
    value: "Standards élevés",
    description: "Une rigueur absolue dans chaque mission pour dépasser vos attentes.",
    gradient: "from-[#39837a]/20 to-[#39837a]/5"
  },
  {
    icon: Shield,
    title: "Intégrité",
    value: "Éthique totale",
    description: "Transparence et confidentialité sont les piliers de notre relation client.",
    gradient: "from-[#C4D82E]/20 to-[#C4D82E]/5"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    value: "Créativité utile",
    description: "Des solutions modernes et adaptées à votre contexte spécifique.",
    gradient: "from-[#39837a]/20 to-[#39837a]/5"
  },
  {
    icon: Heart,
    title: "Partenariat",
    value: "Confiance durable",
    description: "Nous ne sommes pas juste des consultants, mais vos partenaires de croissance.",
    gradient: "from-[#C4D82E]/20 to-[#C4D82E]/5"
  }
]

import { useEffect, useState } from "react"

const ICON_MAP: Record<string, any> = {
  Award, Shield, Lightbulb, Heart, Target, Sparkles
}

export function AboutDetailed() {
  const [missionTitle, setMissionTitle] = useState("Notre Mission")
  const [missionDescription, setMissionDescription] = useState("Fondée sur la conviction que chaque entreprise possède un potentiel inexploité, Odillon s'est donné pour mission de révéler cette valeur cachée.")
  const [values, setValues] = useState<any[]>(initialValues)
  const [video, setVideo] = useState<Video | null>(null)
  const [heroVideo, setHeroVideo] = useState<Video | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Settings
        const settingsRes = await fetch('/api/settings')
        if (settingsRes.ok) {
          const data = await settingsRes.json()
          const s = data.settings || {}
          if (s.about_mission_title) setMissionTitle(s.about_mission_title)
          if (s.about_mission_description) setMissionDescription(s.about_mission_description)
          if (s.about_values_json && Array.isArray(s.about_values_json) && s.about_values_json.length > 0) {
            const mappedValues = s.about_values_json.map((v: any, idx: number) => ({
              ...v,
              icon: ICON_MAP[v.icon] || Award,
              gradient: idx % 2 === 0 ? "from-[#39837a]/20 to-[#39837a]/5" : "from-[#C4D82E]/20 to-[#C4D82E]/5"
            }))
            setValues(mappedValues)
          }
        }

        // Fetch Videos
        const videosRes = await fetch('/api/videos')
        if (videosRes.ok) {
          const data = await videosRes.json()
          const allVideos = data.videos || [] as Video[];

          // Filter for 'A Propos' page videos
          const aboutVideos = allVideos.filter((v: Video) =>
            v.is_active && (v.page === 'A Propos')
          )

          // Content Video
          const contentVid = aboutVideos.find((v: Video) => v.section === 'Contenu' || v.section === 'Main')
          if (contentVid) setVideo(contentVid)

          // Hero Video
          const heroVid = aboutVideos.find((v: Video) => v.section === 'Hero')
          if (heroVid) setHeroVideo(heroVid)
        }

      } catch (err) {
        console.error("Failed to load data", err)
      }
    }
    fetchData()
  }, [])

  return (
    <section className="relative overflow-hidden bg-transparent">
      {/* Hero Section Simplified */}
      <div className="relative pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-12 lg:pb-32">
        {/* Background Pattern - Keeping it subtle */}
        <div className="absolute inset-0 z-0 opacity-80">
          <AboutHeroBackground />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn delay={0.1}>
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-odillon-teal/30 text-odillon-teal bg-odillon-teal/5">
              À Propos de Nous
            </Badge>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
              L'excellence opérationnelle au service de votre{" "}
              <span className="text-odillon-teal relative whitespace-nowrap">
                croissance
                {/* Underline decorative */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-odillon-lime/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Odillon est votre partenaire stratégique pour transformer vos défis en opportunités.
              Une approche humaine, experte et orientée résultats.
            </p>
          </FadeIn>

          {heroVideo && (
            <FadeIn delay={0.4}>
              <div className="mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-2xl border-4 border-white mt-8">
                <VideoPlayer
                  url={heroVideo.url}
                  type={heroVideo.type}
                  thumbnail={heroVideo.thumbnail || undefined}
                  title={heroVideo.title}
                  className="w-full aspect-video"
                  autoplay={true}
                  muted={true}
                  loop={true}
                />
                {(heroVideo.presenter_name || heroVideo.presenter_position) && (
                  <div className="bg-white px-6 py-4 border-t border-gray-100">
                    <p className="font-bold text-gray-900 text-base md:text-lg">{heroVideo.presenter_name}</p>
                    <p className="text-odillon-teal font-medium text-sm uppercase tracking-wide">{heroVideo.presenter_position}</p>
                  </div>
                )}
              </div>
            </FadeIn>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-24 md:space-y-32 pb-24">



        {/* Mission / Vision - Clean Typography */}
        <div className="max-w-4xl mx-auto">
          <FadeIn delay={0.3}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{missionTitle}</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                {missionDescription}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 md:p-10 mb-12">
              <ul className="grid md:grid-cols-3 gap-6">
                {[
                  "Expertise locale, standards internationaux",
                  "Accompagnement sur-mesure",
                  "Engagement de résultats"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-odillon-lime/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-odillon-teal" />
                    </div>
                    <span className="text-base font-medium text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </FadeIn>

          {video && (
            <FadeIn delay={0.4} className="mt-8 md:mt-12 mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <VideoPlayer
                url={video.url}
                type={video.type}
                thumbnail={video.thumbnail || undefined}
                title={video.title}
                className="w-full aspect-video"
              />
              {(video.presenter_name || video.presenter_position) && (
                <div className="bg-white px-6 py-4 border-t border-gray-100">
                  <p className="font-bold text-gray-900 text-base md:text-lg">{video.presenter_name}</p>
                  <p className="text-odillon-teal font-medium text-sm uppercase tracking-wide">{video.presenter_position}</p>
                </div>
              )}
            </FadeIn>
          )}
        </div>


        {/* Values Section - Depth & Flow */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <FadeIn delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-petrov-sans">Nos Valeurs</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                Les piliers fondamentaux qui structurent notre approche et garantissent l'impact de nos actions.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[280px]">
            {values.map((valeur, idx) => {
              const ValeurIcon = valeur.icon
              const isEven = idx % 2 === 0

              // Bento spans logic
              let spanClass = "md:col-span-1 md:row-span-1"
              if (idx === 0) spanClass = "md:col-span-2 md:row-span-1" // Excellence
              if (idx === 3) spanClass = "md:col-span-2 md:row-span-1" // Partenariat

              return (
                <BlurFade key={valeur.title} delay={0.1 * (idx + 1)} className={spanClass}>
                  <SpotlightCard
                    className="h-full w-full bg-white border border-gray-100 shadow-sm rounded-xl p-8 overflow-hidden group"
                    spotlightColor={isEven ? "rgba(57, 131, 122, 0.05)" : "rgba(196, 216, 46, 0.05)"}
                  >
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-3 rounded-lg ${isEven ? 'bg-odillon-teal/10 text-odillon-teal' : 'bg-odillon-lime/10 text-odillon-lime'}`}>
                          <ValeurIcon size={24} strokeWidth={2} />
                        </div>
                        <div
                          className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isEven ? 'bg-odillon-teal/10 text-odillon-teal' : 'bg-odillon-lime/20 text-odillon-lime'}`}
                        >
                          {valeur.value}
                        </div>
                      </div>

                      <div className="mt-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-petrov-sans">
                          {valeur.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed text-sm">
                          {valeur.description}
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                </BlurFade>
              )
            })}
          </div>
        </div>

        {/* Team Section (Organigramme) */}
        <div className="py-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Notre Organigramme</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Une équipe structurée au service de votre réussite.</p>
          </div>

          <TeamGrid />
        </div>

        {/* Timeline - Elegant Vertical Line */}
        <div className="py-24">
          <div className="text-center mb-16">
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-petrov-sans"
            >
              Notre Histoire
            </m.h2>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 max-w-2xl mx-auto text-lg"
            >
              Une croissance constante au service de nos clients.
            </m.p>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
            {/* Central Line with Gradient */}
            <m.div
              initial={{ height: 0, x: "-50%" }}
              whileInView={{ height: "100%", x: "-50%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-[20px] md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-odillon-teal via-odillon-lime/50 to-transparent"
            ></m.div>

            <div className="space-y-16">
              {timeline.map((event, idx) => (
                <div key={event.year} className={`relative flex items-center md:justify-between ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                  {/* Dot with Pulse Effect */}
                  <m.div
                    initial={{ scale: 0, opacity: 0, x: "-50%" }}
                    whileInView={{ scale: 1, opacity: 1, x: "-50%" }}
                    transition={{ delay: idx * 0.1 }}
                    className="absolute left-[20px] md:left-1/2 w-10 h-10 rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center z-20 overflow-visible"
                  >
                    <div className="w-4 h-4 rounded-full relative" style={{ backgroundColor: event.color }}>
                      <m.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: event.color }}
                      ></m.div>
                    </div>
                  </m.div>

                  {/* Content with Hover Interactions */}
                  <div className="pl-16 md:pl-0 w-full md:w-[calc(50%-50px)]">
                    <m.div
                      initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                    >
                      <m.div
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        className={`group relative p-8 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-2xl hover:border-odillon-teal/20 transition-all duration-300 ${idx % 2 === 0 ? 'md:text-right md:items-end' : 'md:text-left md:items-start'} flex flex-col`}
                      >
                        <div className={`mb-4 inline-flex items-center justify-center p-3 rounded-xl bg-white shadow-inner ${idx % 2 === 0 ? 'md:self-end' : 'md:self-start'}`}>
                          <event.icon className="w-6 h-6" style={{ color: event.color }} />
                        </div>
                        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-black mb-4 tracking-tighter" style={{ backgroundColor: `${event.color}15`, color: event.color }}>
                          {event.year}
                        </span>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 font-petrov-sans tracking-tight leading-none group-hover:text-odillon-teal transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm lg:text-base font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                          {event.description}
                        </p>

                        {/* Decorative background element on hover */}
                        <m.div
                          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500"
                          style={{ background: `radial-gradient(circle at center, ${event.color}, transparent)` }}
                        />
                      </m.div>
                    </m.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Final CTA */}
        <div className="relative rounded-xl overflow-hidden bg-odillon-dark text-white p-8 md:p-16 text-center">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-odillon-teal/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-odillon-lime/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à écrire le prochain chapitre ?</h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Rencontrons-nous pour une consultation initiale sans engagement. Discutons de vos ambitions et voyons comment nous pouvons vous aider à les réaliser.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-odillon-teal hover:bg-odillon-teal/90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-odillon-teal/25 flex items-center justify-center gap-2"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/services"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white font-semibold rounded-xl transition-all flex items-center justify-center"
              >
                Découvrir nos services
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section >
  )
}
