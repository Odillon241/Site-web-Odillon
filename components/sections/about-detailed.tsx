"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { AnimatedSlogan } from "@/components/magicui/animated-slogan"
import { Badge } from "@/components/ui/badge"
import {
  Gem,
  Flame,
  HeartHandshake,
  ArrowRight,
  CheckCircle,
  Target,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { TeamGrid } from "@/components/sections/team-grid"
import { VideoPlayer } from "@/components/ui/video-player"
import { Video } from "@/types/admin"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { JourneyTimeline, type JourneyItem } from "@/components/sections/about-home"

const aboutJourney: JourneyItem[] = [
  { year: "2017", title: "FONDATION", description: "Création de la Société ODILLON, spécialisée en Ingénierie d'Entreprises." }
]

const initialValues = [
  {
    icon: Gem,
    title: "Talent",
    value: "Compétences",
    description: "Notre équipe se définit par l'expression de ses compétences transversales matérialisées par le professionnalisme, la rigueur et la discipline.",
    gradient: "from-[#00a795]/20 to-[#00a795]/5"
  },
  {
    icon: Flame,
    title: "Challenge",
    value: "Détermination",
    description: "Notre détermination et notre motivation à toujours proposer des solutions innovantes mieux adaptées aux besoins de nos clients.",
    gradient: "from-[#C4D82E]/20 to-[#C4D82E]/5"
  },
  {
    icon: HeartHandshake,
    title: "Proximité",
    value: "Qualité",
    description: "Notre implication à fournir des services de qualité exceptionnelle aux clients.",
    gradient: "from-[#00a795]/20 to-[#00a795]/5"
  }
]

import { useEffect, useState } from "react"

const ICON_MAP: Record<string, any> = {
  Gem, Flame, HeartHandshake, Target, Sparkles,
  Award: Gem, Shield: Flame, Lightbulb: HeartHandshake, Heart: HeartHandshake
}

export function AboutDetailed() {
  const [missionTitle, setMissionTitle] = useState("Notre Mission")
  const [missionDescription, setMissionDescription] = useState("Notre mission est d'aider les entreprises à renforcer leur efficacité opérationnelle, améliorer leur gouvernance et atteindre leurs objectifs stratégiques.")
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
              icon: ICON_MAP[v.icon] || Gem,
              gradient: idx % 2 === 0 ? "from-[#00a795]/20 to-[#00a795]/5" : "from-[#C4D82E]/20 to-[#C4D82E]/5"
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
      {/* Hero Section */}
      <div className="relative pt-6 pb-12 md:pt-10 md:pb-16 lg:pt-12 lg:pb-20 overflow-hidden bg-transparent">
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
            <FadeIn delay={0.1} className="flex justify-center">
              <AnimatedSlogan
                text="Together we the future"
                iconPosition={2}
                className="mb-4 md:mb-6 text-odillon-teal"
              />
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="font-baskvill not-italic font-bold text-lg sm:text-xl md:text-2xl text-gray-900 mb-2 leading-tight">
                À propos d&apos;{" "}
                <span className="bg-gradient-to-r from-odillon-teal to-odillon-lime bg-clip-text text-transparent">
                  ODILLON
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl font-semibold text-odillon-teal mb-6">
                Votre partenaire stratégique de confiance
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="space-y-6 text-left max-w-3xl mx-auto mb-10">
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Fondée en mai 2017, ODILLON accompagne les entreprises dans leurs projets de conseil, d’ingénierie organisationnelle et d’optimisation de la performance.
                </p>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Nous concevons et déployons des solutions fiables, innovantes et durables, adaptées aux réalités, aux enjeux et aux ambitions de chaque organisation. Notre mission est d&apos;aider les entreprises à renforcer leur efficacité opérationnelle, améliorer leur gouvernance et atteindre leurs objectifs stratégiques.
                </p>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Grâce à l’expertise multidisciplinaire de nos consultants, nous accompagnons nos clients dans l’identification de leurs défis, la mise en œuvre de solutions performantes et le développement de pratiques de gestion responsables.
                </p>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Notre approche repose sur des valeurs fortes : l’éthique professionnelle, le partage d’expérience, l’excellence opérationnelle et l’amélioration continue. Nous favorisons l’intégration de pratiques durables, la valorisation de la diversité, le respect des normes environnementales ainsi que la protection de la vie privée et du bien-être des collaborateurs.
                </p>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Afin de soutenir la prise de décision et la croissance des entreprises, nous mettons également en place des outils de pilotage, de mesure et d’analyse permettant d’optimiser les performances et de renforcer la compétitivité des organisations.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 mb-10 max-w-3xl mx-auto p-6 rounded-lg bg-gray-50/50 border border-gray-100 backdrop-blur-sm">
                <span className="uppercase tracking-widest text-xs font-bold text-odillon-teal">Notre vision</span>
                <span className="font-baskvill italic text-base md:text-lg text-gray-700 text-center leading-relaxed">
                  « Construire des entreprises compétitives, responsables et performantes, capables de relever durablement les défis de leur environnement. »
                </span>
              </div>
            </FadeIn>

            {/* CTA buttons */}
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-odillon-teal hover:bg-odillon-teal/90 text-white font-semibold rounded-lg transition-all shadow-lg shadow-odillon-teal/20 hover:shadow-odillon-teal/30"
                >
                  Nous contacter
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/offres"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-gray-300 hover:border-odillon-teal/50 hover:bg-odillon-teal/5 text-gray-700 hover:text-odillon-teal font-medium rounded-lg transition-all"
                >
                  Découvrir nos services
                </Link>
              </div>
            </FadeIn>

            {/* Hero Video */}
            {heroVideo && (
              <FadeIn delay={0.5}>
                <div className="mx-auto max-w-4xl rounded-lg overflow-hidden shadow-xl border border-gray-200 mt-10">
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
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                      <p className="font-bold text-gray-900 text-base md:text-lg">{heroVideo.presenter_name}</p>
                      <p className="text-odillon-teal font-medium text-sm uppercase tracking-wide">{heroVideo.presenter_position}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            )}
          </div>
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

            <div className="bg-gray-50 rounded-lg p-8 md:p-10 mb-12">
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
            <FadeIn delay={0.4} className="mt-8 md:mt-12 mx-auto max-w-5xl rounded-lg overflow-hidden shadow-2xl border-4 border-white">
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-baskvill italic">Nos Valeurs</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                Les piliers fondamentaux qui structurent notre approche et garantissent l'impact de nos actions.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-[220px] sm:auto-rows-[250px] md:auto-rows-[280px]">
            {values.map((valeur, idx) => {
              const ValeurIcon = valeur.icon
              const isEven = idx % 2 === 0

              const spanClass = "md:col-span-1 md:row-span-1"

              return (
                <BlurFade key={valeur.title} delay={0.1 * (idx + 1)} className={spanClass}>
                  <SpotlightCard
                    className="h-full w-full bg-white border border-gray-100 shadow-sm rounded-lg p-8 overflow-hidden group"
                    spotlightColor={isEven ? "rgba(0, 167, 149, 0.05)" : "rgba(196, 216, 46, 0.05)"}
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-baskvill italic">
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

        {/* Timeline - Same component as homepage */}
        <div className="py-24">
          <div className="text-center mb-16">
            <BlurFade delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-baskvill italic">
                Notre Histoire
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Une croissance constante au service de nos clients.
              </p>
            </BlurFade>
          </div>

          <JourneyTimeline journey={aboutJourney} />
        </div>


        {/* Final CTA */}
        <div className="relative rounded-lg overflow-hidden bg-odillon-dark text-white p-8 md:p-16 text-center">
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
                className="w-full sm:w-auto px-8 py-4 bg-odillon-teal hover:bg-odillon-teal/90 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-odillon-teal/25 flex items-center justify-center gap-2"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/offres"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white font-semibold rounded-lg transition-all flex items-center justify-center"
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
