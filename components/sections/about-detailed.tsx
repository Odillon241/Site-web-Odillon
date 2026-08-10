"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { m, AnimatePresence } from "framer-motion"
import {
  Gem,
  Flame,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Target,
  Sparkles,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { TeamGrid } from "@/components/sections/team-grid"
import { VideoPlayer } from "@/components/ui/video-player"
import { Video } from "@/types/admin"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { JourneyTimeline, type JourneyItem } from "@/components/sections/about-home"
import {
  valeurs,
  chapeauValeurs,
  presentation,
  chiffresCles,
  domainesIntervention
} from "@/lib/identite"

const aboutJourney: JourneyItem[] = [
  { year: "2017", title: "FONDATION", description: "Création de la Société ODILLON, spécialisée en Ingénierie d'Entreprises." }
]

import { useEffect, useState } from "react"

const ICON_MAP: Record<string, any> = {
  Gem, Flame, HeartHandshake, ShieldCheck, Target, Sparkles,
  Award: Gem, Shield: ShieldCheck, Lightbulb: HeartHandshake, Heart: HeartHandshake
}

/* Valeurs du livret d'accueil : l'animal totem sert de badge, comme dans le
   document imprimé. Une surcharge Supabase (`about_values_json`) reste possible
   depuis l'administration ; elle prime alors sur ces valeurs de référence. */
const initialValues = valeurs.map((v) => ({
  icon: ICON_MAP[v.icon] ?? Gem,
  image: v.image,
  title: v.title,
  value: v.totem,
  description: v.description,
  keywords: v.keywords
}))

export function AboutDetailed() {
  const [missionTitle, setMissionTitle] = useState("Notre Mission")
  const [missionDescription, setMissionDescription] = useState("Notre mission est d'aider les entreprises à renforcer leur efficacité opérationnelle, améliorer leur gouvernance et atteindre leurs objectifs stratégiques.")
  const [values, setValues] = useState<any[]>(initialValues)
  const [video, setVideo] = useState<Video | null>(null)
  const [heroVideo, setHeroVideo] = useState<Video | null>(null)
  const [showMore, setShowMore] = useState(false)

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
              // Une valeur enregistrée avant l'ajout des aquarelles n'a pas de
              // champ `image` : on la retrouve par son libellé dans le livret.
              image: v.image ?? valeurs.find((ref) => ref.title === v.title)?.image,
              keywords: v.keywords ?? valeurs.find((ref) => ref.title === v.title)?.keywords,
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
      <div className="relative pt-6 pb-12 md:pt-8 md:pb-16 lg:pt-10 lg:pb-20 overflow-hidden bg-transparent">
        {/* Background décoratif (surtout visible en fallback) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-odillon-teal/5 via-transparent to-odillon-lime/5" />
          <div className="absolute -top-24 -right-24 w-96 h-96 border border-odillon-teal/10 rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] border border-odillon-lime/10 rounded-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {heroVideo ? (
            /* ----- Vidéo plein cadre immersive ----- */
            <FadeIn delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
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
                {/* Overlay dégradé + titre */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-6 sm:p-10 lg:p-14">
                  <h1 className="font-baskvill italic font-bold text-2xl sm:text-4xl lg:text-5xl text-white mb-2 leading-tight drop-shadow">
                    À propos d&apos;{" "}
                    <span className="bg-gradient-to-r from-odillon-teal to-odillon-lime bg-clip-text text-transparent">
                      ODILLON
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl font-semibold text-white/90">
                    Votre partenaire stratégique de confiance
                  </p>
                  {(heroVideo.presenter_name || heroVideo.presenter_position) && (
                    <p className="text-sm text-white/70 mt-2">
                      <span className="font-semibold text-white">{heroVideo.presenter_name}</span>
                      {heroVideo.presenter_name && heroVideo.presenter_position && " · "}
                      {heroVideo.presenter_position}
                    </p>
                  )}
                </div>
              </div>
            </FadeIn>
          ) : (
            /* ----- Fallback : hero dégradé sans vidéo ----- */
            <FadeIn delay={0.1}>
              <div className="text-center max-w-4xl mx-auto py-10 md:py-16">
                <h1 className="font-baskvill italic font-bold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-3 leading-tight">
                  À propos d&apos;{" "}
                  <span className="bg-gradient-to-r from-odillon-teal to-odillon-lime bg-clip-text text-transparent">
                    ODILLON
                  </span>
                </h1>
                <p className="text-lg sm:text-xl font-semibold text-odillon-teal">
                  Votre partenaire stratégique de confiance
                </p>
              </div>
            </FadeIn>
          )}

          {/* ----- Présentation épurée et repliable ----- */}
          <FadeIn delay={0.25}>
            <div className="mt-12 md:mt-16 max-w-3xl mx-auto">
              {/* Kicker de section, repris du livret d'accueil */}
              <p className="text-center uppercase tracking-[0.22em] text-xs font-semibold text-odillon-teal mb-4">
                Qui sommes-nous ?
              </p>

              {/* Accroche */}
              <p className="text-lg md:text-2xl text-gray-800 leading-relaxed text-center font-medium mb-8">
                {presentation.accroche}
              </p>

              {/* Repères chiffrés */}
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200/70 border border-gray-200/70 rounded-lg overflow-hidden mb-10">
                {chiffresCles.map((repere) => (
                  <div key={repere.valeur} className="bg-white/80 px-5 py-6 text-center sm:text-left">
                    <dt className="font-baskvill not-italic text-2xl md:text-3xl text-odillon-teal mb-1">
                      {repere.valeur}
                    </dt>
                    <dd className="text-sm text-gray-600 leading-snug">{repere.legende}</dd>
                  </div>
                ))}
              </dl>

              {/* Paragraphe clé visible */}
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {presentation.mission}
              </p>

              {/* Domaines d'intervention */}
              <div className="mt-10">
                <h2 className="font-baskvill not-italic text-xl md:text-2xl text-gray-900 mb-1">
                  Nos domaines d&apos;intervention
                </h2>
                <span className="block w-12 h-[2px] bg-odillon-lime rounded-full mb-6" />
                <ul className="space-y-3">
                  {domainesIntervention.map((domaine) => (
                    <li key={domaine.accent} className="flex gap-3 text-base md:text-lg text-gray-600 leading-relaxed">
                      <span className="mt-[0.6em] w-1.5 h-1.5 rounded-full bg-odillon-teal flex-shrink-0" />
                      <span>
                        <strong className="font-semibold text-gray-900">{domaine.accent}</strong>
                        {domaine.suite}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formule de synthèse du livret d'accueil */}
              <blockquote className="mt-10 border-l-2 border-odillon-lime pl-5 py-1 font-baskvill italic text-base md:text-lg text-gray-700 leading-relaxed">
                {presentation.citation}
              </blockquote>

              {/* Contenu repliable */}
              <AnimatePresence initial={false}>
                {showMore && (
                  <m.div
                    key="more"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-6 pt-6">
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
                  </m.div>
                )}
              </AnimatePresence>

              {/* Bouton Lire la suite */}
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={() => setShowMore((v) => !v)}
                  aria-expanded={showMore}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-odillon-teal border border-odillon-teal/30 hover:bg-odillon-teal/5 rounded-full transition-all"
                >
                  {showMore ? "Réduire" : "Lire la suite"}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Encart Vision */}
              <div className="flex flex-col items-center gap-3 mt-12 p-6 rounded-lg bg-gray-50/70 border border-gray-100 backdrop-blur-sm">
                <span className="uppercase tracking-widest text-xs font-bold text-odillon-teal">Notre vision</span>
                <span className="font-baskvill italic text-base md:text-lg text-gray-700 text-center leading-relaxed">
                  « Construire des entreprises compétitives, responsables et performantes, capables de relever durablement les défis de leur environnement. »
                </span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
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
            </div>
          </FadeIn>
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
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                {chapeauValeurs}
              </p>
            </FadeIn>
          </div>

          {/* auto-rows-fr : les cartes s'égalisent sur la plus haute de la ligne.
              Une hauteur fixe ne tient pas ici — les descriptions du livret sont
              longues et les colonnes étroites à partir de quatre valeurs. */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr">
            {values.map((valeur, idx) => {
              const ValeurIcon = valeur.icon
              const isEven = idx % 2 === 0

              const spanClass = "md:col-span-1 md:row-span-1"

              return (
                /* Révélation en CSS pur : BlurFade laissait ces cartes bloquées
                   à opacity 0, donc invisibles (et leurs images jamais chargées,
                   le lazy-loading n'étant jamais déclenché). */
                <div
                  key={valeur.title}
                  className={`${spanClass} od-rise`}
                  style={{ "--od-rise-delay": `${0.1 * (idx + 1)}s` } as React.CSSProperties}
                >
                  <SpotlightCard
                    className="h-full w-full bg-white border border-gray-100 shadow-sm rounded-lg p-6 sm:p-7 overflow-hidden group"
                    spotlightColor={isEven ? "rgba(0, 167, 149, 0.05)" : "rgba(196, 216, 46, 0.05)"}
                  >
                    {/* Composition en flux depuis le haut : la vignette ayant une
                        hauteur fixe, les titres s'alignent d'une carte à l'autre.
                        Seuls les mots-clés sont calés en pied (mt-auto), ce qui
                        donne une ligne de base commune malgré des descriptions
                        de longueurs inégales. */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Aquarelle du totem (livret) ; l'icône reste le repli
                          si une valeur est surchargée depuis l'administration. */}
                      {valeur.image ? (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100">
                          <Image
                            src={valeur.image}
                            alt={`${valeur.title} — ${valeur.value}`}
                            width={144}
                            height={144}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`w-20 h-20 rounded-lg flex items-center justify-center ${isEven ? 'bg-odillon-teal/10 text-odillon-teal' : 'bg-odillon-lime/10 text-odillon-lime'}`}>
                          <ValeurIcon size={28} strokeWidth={2} />
                        </div>
                      )}

                      {/* Groupement serré : le titre et son totem forment un bloc */}
                      <h3 className="mt-5 text-xl font-bold text-gray-900 font-baskvill italic leading-tight">
                        {valeur.title}
                      </h3>
                      {/* Teal et lime de marque assombris : à 11px, les teintes
                          d'origine tombaient à ~3:1 et ~1,7:1 sur blanc. Ces
                          variantes tiennent 5,2:1 et 4,9:1. */}
                      <p className={`mt-1 text-xs font-semibold uppercase tracking-[0.18em] ${isEven ? 'text-[#0f7a6e]' : 'text-[#6b7818]'}`}>
                        {valeur.value}
                      </p>

                      {/* Séparation généreuse avant le corps de texte */}
                      <p className="mt-4 text-gray-600 leading-relaxed text-sm">
                        {valeur.description}
                      </p>

                      {valeur.keywords && (
                        /* min-h = padding haut (1.25rem) + deux interlignes
                           (2 × 1rem pour text-xs), box-sizing compris : les
                           mots-clés les plus longs passent à la ligne, et sans
                           cette réserve le filet de cette carte remonterait
                           seul de 16px. */
                        <p className="mt-auto pt-5 min-h-[3.25rem] text-xs italic text-gray-500 border-t border-gray-100">
                          {valeur.keywords}
                        </p>
                      )}
                    </div>
                  </SpotlightCard>
                </div>
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
