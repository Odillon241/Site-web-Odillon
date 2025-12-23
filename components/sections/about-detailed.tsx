"use client"

import { m } from "framer-motion"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { AboutHeroBackground } from "@/components/ui/about-hero-background"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCardClean } from "@/components/ui/stat-card-clean"
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
  Clock,
  Star,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { TeamGrid } from "@/components/sections/team-grid"
import { VideoPlayer } from "@/components/ui/video-player"
import { Video } from "@/types/admin"

const stats = [
  {
    icon: Clock,
    value: 48,
    suffix: "h",
    label: "Temps de réponse",
    description: "Réactivité garantie",
    color: "#39837a"
  },
  {
    icon: Star,
    value: 98,
    suffix: "%",
    label: "Satisfaction",
    description: "Clients satisfaits",
    color: "#C4D82E"
  },
  {
    icon: CheckCircle2,
    value: 50,
    suffix: "+",
    label: "Projets réalisés",
    description: "Missions réussies",
    color: "#39837a"
  },
  {
    icon: Users,
    value: 10,
    suffix: "+",
    label: "Clients accompagnés",
    description: "Partenaires de confiance",
    color: "#C4D82E"
  }
]

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
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section Simplified */}
      <div className="relative pt-8 pb-16 md:pt-16 md:pb-24 lg:pt-24 lg:pb-32">
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
              </div>
            </FadeIn>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-24 md:space-y-32 pb-24">

        {/* Stats Section - New Design */}
        <BlurFade delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatCardClean
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                description={stat.description}
                color={stat.color}
                delay={idx * 0.1}
              />
            ))}
          </div>
        </BlurFade>

        {/* Mission / Vision - Clean Typography */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn delay={0.2} className="relative order-2 lg:order-1">
            {/* Decorative image placeholder or gradient blob */}
            <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="w-32 h-32 text-odillon-teal/20" />
              </div>
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-xl border border-white/40 shadow-lg">
                <p className="font-medium text-gray-800 italic">
                  "Notre obsession est la réussite tangible de nos clients. Pas de jargon, que des résultats."
                </p>
              </div>
            </div>
          </FadeIn>
          <div className="order-1 lg:order-2">
            <FadeIn delay={0.3}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{missionTitle}</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                {missionDescription}
              </div>
              <div className="mt-8">
                <ul className="space-y-3">
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
              <FadeIn delay={0.4} className="mt-12 md:mt-16 mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <VideoPlayer
                  url={video.url}
                  type={video.type}
                  thumbnail={video.thumbnail || undefined}
                  title={video.title}
                  className="w-full aspect-video"
                />
              </FadeIn>
            )}
          </div>
        </div>


        {/* Values Section - Cleaner Cards */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Les principes directeurs qui guident chacune de nos interventions.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((valeur, idx) => {
              const colors = idx % 2 === 0
                ? { bg: "bg-odillon-teal/5", border: "border-odillon-teal/10", icon: "text-odillon-teal", hover: "group-hover:border-odillon-teal/30" }
                : { bg: "bg-odillon-lime/10", border: "border-odillon-lime/20", icon: "text-[#8a9920]", hover: "group-hover:border-odillon-lime/40" } // Darker lime for text

              const ValeurIcon = valeur.icon

              return (
                <FadeIn key={valeur.title} delay={0.1 * (idx + 1)}>
                  <Card className={`h-full border transition-all duration-300 ${colors.hover} hover:shadow-md bg-white`}>
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${colors.bg}`}>
                          <ValeurIcon className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{valeur.title}</h3>
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{valeur.value}</p>
                          <p className="text-gray-600 leading-relaxed">
                            {valeur.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              )
            })}
          </div>
        </div>

        {/* Team Section (Trombinoscope) */}
        <div className="py-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Notre Équipe de Direction</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Des experts passionnés dédiés à votre réussite.</p>
          </div>

          <TeamGrid />
        </div>

        {/* Timeline - Elegant Vertical Line */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Notre Histoire</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Une croissance constante au service de nos clients.</p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Central Line */}
            <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 md:-translate-x-1/2"></div>

            <div className="space-y-12">
              {timeline.map((event, idx) => (
                <div key={event.year} className={`relative flex items-center md:justify-between ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 w-10 h-10 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center z-10 md:-translate-x-1/2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: event.color }}></div>
                  </div>

                  {/* Content */}
                  <div className="pl-16 md:pl-0 w-full md:w-[calc(50%-40px)]">
                    <FadeIn delay={idx * 0.1}>
                      <div className={`p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ backgroundColor: `${event.color}15`, color: event.color }}>
                          {event.year}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                      </div>
                    </FadeIn>
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
