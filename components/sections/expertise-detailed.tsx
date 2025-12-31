"use client"

import { useState, useEffect } from "react"
import { m } from "framer-motion"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { TextShimmer } from "@/components/ui/text-shimmer"
import { CountingNumber } from "@/components/ui/counting-number"

import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/shadcn-io/marquee"

import { VideosSection } from "@/components/sections/videos-section"
import { VideoSection } from "@/components/sections/video-section"
import type { VideoItem } from "@/components/sections/videos-section"
import { Video } from "@/types/admin"
import {
  Target,
  Briefcase,
  Globe2,
  TrendingUp,
  CheckCircle,
  Award,
  Lightbulb,
  Users2,
  Quote,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  Zap,
  ArrowRight,
  ShieldCheck,
  Rocket,
  TrendingDown,
  Users,
  Search
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const expertiseDomains = [
  {
    id: "structuration",
    icon: Target,
    title: "Structuration & Restructuration",
    color: "#39837a",
    shortDesc: "Optimisez votre organisation",
    description: "Transformez votre structure organisationnelle en un modèle d'efficacité aligné sur vos objectifs stratégiques.",
    stats: { value: 35, suffix: "%", label: "d'efficacité en plus" },
    highlights: [
      "Diagnostic organisationnel complet",
      "Redesign de la structure",
      "Optimisation des processus",
      "Accompagnement au changement"
    ],
    details: {
      challenge: "Les organisations inefficaces perdent jusqu'à 30% de leur potentiel de performance à cause de structures inadaptées, de processus redondants et de silos organisationnels.",
      solution: "Nous analysons votre organisation actuelle, identifions les leviers d'amélioration et concevons une structure optimale qui libère le potentiel de vos équipes.",
      results: [
        { metric: "30-40%", description: "d'amélioration de l'efficacité opérationnelle" },
        { metric: "3-6 mois", description: "pour une restructuration complète" },
        { metric: "85%", description: "de taux d'adhésion des équipes" }
      ]
    }
  },
  {
    id: "gestion",
    icon: Briefcase,
    title: "Gestion Administrative, Juridique & Financière",
    color: "#C4D82E",
    shortDesc: "Externalisez pour mieux performer",
    description: "Service intégré couvrant tous vos besoins administratifs, juridiques et financiers avec efficacité et conformité totale.",
    stats: { value: 25, suffix: "%", label: "de réduction des coûts" },
    highlights: [
      "Systèmes de gestion intégrés",
      "Conformité réglementaire",
      "Automatisation administrative",
      "Pilotage financier complet"
    ],
    details: {
      challenge: "La gestion administrative, juridique et financière mobilise des ressources importantes et détourne les dirigeants de leur cœur de métier.",
      solution: "Notre service externalisé prend en charge l'ensemble de votre gestion avec des processus digitalisés, une conformité garantie et une expertise pointue.",
      results: [
        { metric: "25%", description: "de réduction des coûts administratifs" },
        { metric: "40%", description: "de gain de temps sur les tâches admin" },
        { metric: "100%", description: "de conformité réglementaire" }
      ]
    }
  },
  {
    id: "relations-publiques",
    icon: Globe2,
    title: "Relations Publiques",
    color: "#39837a",
    shortDesc: "Construisez votre influence",
    description: "Développement stratégique de votre réputation et relations avec les parties prenantes clés pour maximiser votre impact.",
    stats: { value: 60, suffix: "%", label: "de visibilité en plus" },
    highlights: [
      "Communication institutionnelle",
      "Relations médias",
      "Gestion de crise",
      "Lobbying et influence"
    ],
    details: {
      challenge: "Une image de marque faible ou une mauvaise gestion de crise peut coûter des millions et détruire la confiance des parties prenantes.",
      solution: "Nous développons votre stratégie de communication, gérons vos relations publiques et protégeons votre réputation avec professionnalisme.",
      results: [
        { metric: "60%", description: "d'amélioration de la visibilité médiatique" },
        { metric: "90%", description: "de perception positive de la marque" },
        { metric: "48h", description: "de délai de réponse en cas de crise" }
      ]
    }
  },
  {
    id: "risques",
    icon: TrendingUp,
    title: "Management des Risques",
    color: "#C4D82E",
    shortDesc: "Maîtrisez tous vos risques",
    description: "Approche systématique pour identifier, évaluer et gérer l'ensemble de vos risques organisationnels avec méthode.",
    stats: { value: 50, suffix: "%", label: "d'incidents en moins" },
    highlights: [
      "Cartographie des risques",
      "Contrôle interne robuste",
      "Plans de continuité (PCA/PRA)",
      "Audit et surveillance"
    ],
    details: {
      challenge: "Les risques non maîtrisés peuvent entraîner des pertes financières massives, des arrêts d'activité et des dommages réputationnels irréversibles.",
      solution: "Nous identifions tous vos risques, les évaluons et mettons en place des systèmes de prévention et de gestion pour assurer la continuité de votre activité.",
      results: [
        { metric: "50%", description: "de réduction des incidents majeurs" },
        { metric: "99%", description: "de disponibilité des systèmes critiques" },
        { metric: "24h", description: "de délai de reprise d'activité maximum" }
      ]
    }
  }
]

const methodology = {
  title: "Notre Méthodologie",
  subtitle: "Le cycle du Management des Risques en 6 étapes",
  steps: [
    {
      number: "01",
      title: "Analiser",
      description: "Identification et évaluation approfondie des risques potentiels",
      icon: BarChart3,
      deliverables: ["Cartographie des risques", "Analyse d'impact", "Priorisation"]
    },
    {
      number: "02",
      title: "Transférer",
      description: "Transfert des risques vers des tiers spécialisés (assurance, sous-traitance)",
      icon: Users,
      deliverables: ["Contrats d'assurance", "Partenariats", "Clauses contractuelles"]
    },
    {
      number: "03",
      title: "Réduire",
      description: "Mise en place de mesures pour diminuer la probabilité ou l'impact des risques",
      icon: TrendingDown,
      deliverables: ["Plans d'action", "Mesures correctives", "Formations"]
    },
    {
      number: "04",
      title: "Contrôler",
      description: "Surveillance continue et vérification de l'efficacité des mesures",
      icon: ShieldCheck,
      deliverables: ["Audits internes", "Indicateurs clés", "Reporting"]
    },
    {
      number: "05",
      title: "Préparer",
      description: "Élaboration des plans de continuité et de reprise d'activité",
      icon: Rocket,
      deliverables: ["PCA/PRA", "Procédures d'urgence", "Tests réguliers"]
    },
    {
      number: "06",
      title: "Éviter",
      description: "Stratégies d'évitement pour les risques inacceptables",
      icon: Zap,
      deliverables: ["Décisions stratégiques", "Réorientation", "Abandon de projets risqués"]
    }
  ]
}

const coreValues = [
  {
    icon: Award,
    title: "Excellence",
    value: "Standards élevés",
    description: "Engagement envers l'excellence dans chaque mission avec rigueur, méthodologie et professionnalisme constant."
  },
  {
    icon: CheckCircle,
    title: "Intégrité",
    value: "Éthique totale",
    description: "Principes éthiques stricts, transparence absolue dans nos recommandations et confidentialité garantie."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    value: "Approches créatives",
    description: "Solutions innovantes combinant meilleures pratiques internationales et adaptation au contexte local."
  },
  {
    icon: Users2,
    title: "Partenariat",
    value: "Collaboration étroite",
    description: "Relation de partenariat durable avec transfert de compétences effectif et accompagnement sur le long terme."
  }
]

export function ExpertiseDetailed() {
  const [presentationVideos, setPresentationVideos] = useState<VideoItem[]>([])
  const [testimonialVideos, setTestimonialVideos] = useState<VideoItem[]>([])
  const [video, setVideo] = useState<Video | null>(null)
  const [testimonials, setTestimonials] = useState<Array<{
    quote: string
    name: string
    position: string
    avatar: string
  }>>([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Charger les vidéos et témoignages depuis Supabase
  useEffect(() => {
    const loadVideos = async () => {
      try {
        // Fetch Main Video for Expertise Page
        const videosRes = await fetch('/api/videos?active=true')
        if (videosRes.ok) {
          const allVideosData = await videosRes.json()
          const mainVideo = (allVideosData.videos || []).find((v: Video) => v.page === 'Expertise' && v.section === 'Contenu')
          if (mainVideo) setVideo(mainVideo)
        }

        // Charger les vidéos de présentation
        const presentationRes = await fetch('/api/videos?category=presentation&active=true')
        if (presentationRes.ok) {
          const presentationData = await presentationRes.json()
          setPresentationVideos(
            (presentationData.videos || []).map((v: any) => {
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

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [mobileDetailDomain, setMobileDetailDomain] = useState<typeof expertiseDomains[0] | null>(null)

  // Filtrer les domaines d'expertise basés sur la recherche et le filtre
  const filteredDomains = expertiseDomains.filter((domain) => {
    // Filtre par domaine sélectionné
    if (selectedDomain && domain.id !== selectedDomain) {
      return false
    }

    // Filtre par recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      return (
        domain.title.toLowerCase().includes(query) ||
        domain.shortDesc.toLowerCase().includes(query) ||
        domain.description.toLowerCase().includes(query) ||
        domain.highlights.some(h => h.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Fonction pour scroller vers la section des domaines
  const scrollToDomains = () => {
    const domainsSection = document.getElementById('expertise-domains-section')
    if (domainsSection) {
      domainsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Gérer la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() || selectedDomain) {
      // Scroll seulement lors de la soumission du formulaire
      setTimeout(() => scrollToDomains(), 100)
    }
  }

  // Gérer le changement de filtre
  const handleFilterChange = (domainId: string | null) => {
    setSelectedDomain(domainId)
    if (domainId) {
      setTimeout(() => scrollToDomains(), 100)
    }
  }

  // Effet pour scroller automatiquement seulement lors du changement de filtre (pas pendant la saisie)
  useEffect(() => {
    if (selectedDomain && filteredDomains.length > 0) {
      const timer = setTimeout(() => {
        scrollToDomains()
      }, 300)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDomain])

  return (
    <div className="relative overflow-hidden bg-transparent">
      {/* Hero Section with Background */}
      <div className="relative py-8 md:py-12 lg:py-16 overflow-hidden bg-transparent">
        {/* Background Pattern */}
        {/* Background Pattern - Simplified for Professional Look */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-50/30" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80 p-0" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <BlurFade delay={0.1}>
              <Badge variant="odillon" className="mb-6">
                Domaines d'Expertise
              </Badge>
            </BlurFade>

            <BlurFade delay={0.2}>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gray-900">
                Expertise reconnue pour{" "}
                <span className="bg-gradient-to-r from-odillon-teal to-odillon-lime bg-clip-text text-transparent">
                  transformer votre organisation
                </span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.3}>
              <p className="mx-auto mb-10 max-w-xl text-lg text-gray-600">
                Depuis notre création, nous accompagnons les entreprises dans leur transformation
                avec des solutions sur mesure, une méthodologie éprouvée et des résultats mesurables.
              </p>
            </BlurFade>

            {/* Barre de recherche */}
            <BlurFade delay={0.4}>
              <form
                className="mx-auto mb-6 max-w-2xl"
                onSubmit={handleSearch}
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher un domaine d'expertise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 rounded-full pl-12 pr-32 text-lg shadow-lg border-gray-200 focus:border-odillon-teal focus:ring-odillon-teal bg-white"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full bg-odillon-teal hover:bg-odillon-teal/90 text-white px-4"
                  >
                    Rechercher
                  </Button>
                </div>
              </form>
            </BlurFade>

            {/* Filtres par domaine */}
            <BlurFade delay={0.5}>
              <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant={selectedDomain === null ? "default" : "outline"}
                  onClick={() => handleFilterChange(null)}
                  className={`h-8 rounded-full ${selectedDomain === null
                    ? "bg-odillon-teal text-white hover:bg-odillon-teal/90"
                    : "border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  Tous
                </Button>
                {expertiseDomains.map((domain) => {
                  const DomainIcon = domain.icon
                  return (
                    <Button
                      key={domain.id}
                      variant={selectedDomain === domain.id ? "default" : "outline"}
                      onClick={() => handleFilterChange(domain.id)}
                      className={`h-8 rounded-full gap-1.5 ${selectedDomain === domain.id
                        ? "bg-odillon-teal text-white hover:bg-odillon-teal/90"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <DomainIcon className="h-3 w-3" style={{ color: selectedDomain === domain.id ? "white" : domain.color }} />
                      {domain.title.split(" ")[0]}
                    </Button>
                  )
                })}
              </div>
            </BlurFade>

            {/* Recherches populaires */}
            <BlurFade delay={0.6}>
              <div className="border-t pt-8">
                <p className="mb-4 text-sm text-gray-500">Recherches populaires</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    { label: "Structuration organisationnelle", domainId: "structuration" },
                    { label: "Gestion administrative", domainId: "gestion" },
                    { label: "Relations publiques", domainId: "relations-publiques" },
                    { label: "Management des risques", domainId: "risques" },
                  ].map((item) => (
                    <Button
                      key={item.domainId}
                      variant="ghost"
                      onClick={() => {
                        setSelectedDomain(item.domainId)
                        setSearchQuery("")
                        setTimeout(() => scrollToDomains(), 100)
                      }}
                      className="h-8 rounded-md px-3 gap-1 text-gray-600 hover:text-odillon-teal hover:bg-odillon-teal/10"
                    >
                      {item.label}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </div>
            </BlurFade>
          </div>


        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Vidéo Principale */}
        <VideoSection video={video} className="mb-12" />

        {/* Section Vidéos de Présentation */}
        <VideosSection
          title="Nos Vidéos de Présentation"
          badge="Vidéos"
          videos={presentationVideos}
        />

        {/* Expertise Domains - Bento Grid Layout */}
        <div id="expertise-domains-section" className="mb-12 md:mb-16 lg:mb-20 scroll-mt-20">
          <BlurFade delay={0.5}>
            <div className="text-center mb-8 md:mb-12 px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
                Nos Domaines d'Expertise
                {(searchQuery || selectedDomain) && (
                  <span className="text-base md:text-lg font-normal text-gray-500 ml-2">
                    ({filteredDomains.length} résultat{filteredDomains.length > 1 ? 's' : ''})
                  </span>
                )}
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                {searchQuery || selectedDomain
                  ? "Résultats de votre recherche"
                  : "Passez votre souris sur chaque domaine pour en savoir plus"}
              </p>
            </div>
          </BlurFade>

          {filteredDomains.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {filteredDomains.map((domain, idx) => {
                  const DomainIcon = domain.icon
                  return (
                    <BlurFade key={domain.id} delay={0.1 * (idx + 1)}>
                      {/* Desktop: HoverCard */}
                      <div className="hidden md:block">
                        <HoverCard openDelay={200}>
                          <HoverCardTrigger asChild>
                            <Card
                              className="border-2 hover:border-gray-400 transition-all duration-500 cursor-pointer group h-full"
                              style={{ borderColor: `${domain.color}30` }}
                            >
                              <CardHeader className="px-4 md:px-6 py-4 md:py-6">
                                <div className="flex items-start justify-between mb-2 md:mb-3">
                                  <div
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                    style={{ backgroundColor: `${domain.color}20`, color: domain.color }}
                                  >
                                    <DomainIcon className="w-6 h-6 md:w-7 md:h-7" />
                                  </div>
                                  <Badge
                                    className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1"
                                    style={{ backgroundColor: `${domain.color}15`, color: domain.color, border: `1px solid ${domain.color}30` }}
                                  >
                                    Expertise clé
                                  </Badge>
                                </div>
                                <CardTitle className="text-lg md:text-2xl mb-1 md:mb-2 group-hover:text-[#39837a] transition-colors">
                                  {domain.title}
                                </CardTitle>
                                <CardDescription className="text-xs md:text-sm font-medium" style={{ color: domain.color }}>
                                  {domain.shortDesc}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 pb-4 md:pb-6">
                                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                  {domain.description}
                                </p>

                                {/* Stats Badge */}
                                <div
                                  className="inline-flex items-baseline gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg"
                                  style={{ backgroundColor: `${domain.color}10` }}
                                >
                                  <span className="text-2xl md:text-3xl font-bold" style={{ color: domain.color }}>
                                    {domain.stats.value}{domain.stats.suffix}
                                  </span>
                                  <span className="text-[10px] md:text-xs text-gray-600">{domain.stats.label}</span>
                                </div>

                                {/* Highlights */}
                                <div className="grid grid-cols-2 gap-1.5 md:gap-2 pt-2">
                                  {domain.highlights.map((highlight, i) => (
                                    <div key={i} className="flex items-start gap-1.5 md:gap-2">
                                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mt-0.5 flex-shrink-0" style={{ color: domain.color }} />
                                      <span className="text-[10px] md:text-xs text-gray-700 leading-tight">{highlight}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium pt-2" style={{ color: domain.color }}>
                                  <span className="hidden sm:inline">Survolez pour en savoir plus</span>
                                  <span className="sm:hidden">Touchez pour plus</span>
                                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </CardContent>
                            </Card>
                          </HoverCardTrigger>

                          <HoverCardContent className="w-[500px] p-6" align="center">
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <DomainIcon className="w-5 h-5" style={{ color: domain.color }} />
                                  <h4 className="font-bold text-lg">{domain.title}</h4>
                                </div>
                                <Separator className="mb-4" />
                              </div>

                              <div>
                                <div className="flex items-start gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">Défi</Badge>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                  {domain.details.challenge}
                                </p>
                              </div>

                              <div>
                                <div className="flex items-start gap-2 mb-2">
                                  <Badge className="text-xs" style={{ backgroundColor: `${domain.color}20`, color: domain.color }}>
                                    Notre Solution
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                  {domain.details.solution}
                                </p>
                              </div>

                              <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Résultats Mesurables</div>
                                <div className="grid gap-2">
                                  {domain.details.results.map((result, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 border-l-2" style={{ borderColor: domain.color }}>
                                      <div className="font-bold text-lg" style={{ color: domain.color }}>{result.metric}</div>
                                      <div className="text-xs text-gray-700">{result.description}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Link
                                href="/contact"
                                className="relative inline-flex items-center justify-center gap-2 w-full h-10 px-6 rounded-md text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group mt-4"
                                style={{
                                  backgroundColor: domain.color,
                                  color: '#ffffff'
                                }}
                              >
                                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300"></span>
                                <span className="relative" style={{ color: '#ffffff' }}>Discutons de votre projet</span>
                                <ArrowRight className="w-4 h-4 relative" style={{ color: '#ffffff' }} />
                              </Link>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>

                      {/* Mobile: Clickable Card that opens Dialog */}
                      <Card
                        className="md:hidden border-2 hover:border-gray-400 transition-all duration-500 cursor-pointer group h-full active:scale-[0.98]"
                        style={{ borderColor: `${domain.color}30` }}
                        onClick={() => setMobileDetailDomain(domain)}
                      >
                        <CardHeader className="px-4 py-4">
                          <div className="flex items-start justify-between mb-2">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${domain.color}20`, color: domain.color }}
                            >
                              <DomainIcon className="w-6 h-6" />
                            </div>
                            <Badge
                              className="text-[10px] px-1.5 py-0.5"
                              style={{ backgroundColor: `${domain.color}15`, color: domain.color, border: `1px solid ${domain.color}30` }}
                            >
                              Expertise clé
                            </Badge>
                          </div>
                          <CardTitle className="text-lg mb-1">
                            {domain.title}
                          </CardTitle>
                          <CardDescription className="text-xs font-medium" style={{ color: domain.color }}>
                            {domain.shortDesc}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 px-4 pb-4">
                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                            {domain.description}
                          </p>

                          {/* Stats Badge */}
                          <div
                            className="inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg"
                            style={{ backgroundColor: `${domain.color}10` }}
                          >
                            <span className="text-2xl font-bold" style={{ color: domain.color }}>
                              {domain.stats.value}{domain.stats.suffix}
                            </span>
                            <span className="text-[10px] text-gray-600">{domain.stats.label}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-medium pt-2" style={{ color: domain.color }}>
                            <span>Touchez pour les détails</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </CardContent>
                      </Card>
                    </BlurFade>
                  )
                })}
              </div>

              {/* Mobile Detail Dialog */}
              <Dialog open={!!mobileDetailDomain} onOpenChange={(open) => !open && setMobileDetailDomain(null)}>
                <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-xl">
                  {mobileDetailDomain && (() => {
                    const domain = mobileDetailDomain
                    const DomainIcon = domain.icon
                    return (
                      <div className="space-y-4">
                        <DialogHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${domain.color}20`, color: domain.color }}
                            >
                              <DomainIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <DialogTitle className="text-lg font-bold">{domain.title}</DialogTitle>
                              <p className="text-xs font-medium" style={{ color: domain.color }}>{domain.shortDesc}</p>
                            </div>
                          </div>
                        </DialogHeader>

                        <Separator />

                        <div>
                          <Badge variant="outline" className="text-xs mb-2">Défi</Badge>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {domain.details.challenge}
                          </p>
                        </div>

                        <div>
                          <Badge className="text-xs mb-2" style={{ backgroundColor: `${domain.color}20`, color: domain.color }}>
                            Notre Solution
                          </Badge>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {domain.details.solution}
                          </p>
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Résultats Mesurables</div>
                          <div className="grid gap-2">
                            {domain.details.results.map((result, i) => (
                              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 border-l-2" style={{ borderColor: domain.color }}>
                                <div className="font-bold text-lg" style={{ color: domain.color }}>{result.metric}</div>
                                <div className="text-xs text-gray-700">{result.description}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Link
                          href="/contact"
                          className="relative inline-flex items-center justify-center gap-2 w-full h-11 px-6 rounded-md text-sm font-medium shadow-md transition-all duration-300 overflow-hidden group mt-2"
                          style={{ backgroundColor: domain.color, color: '#ffffff' }}
                          onClick={() => setMobileDetailDomain(null)}
                        >
                          <span>Discutons de votre projet</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )
                  })()}
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="text-center py-12 md:py-16">
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? `Aucun domaine ne correspond à "${searchQuery}"`
                    : "Aucun domaine ne correspond à votre filtre"}
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedDomain(null)
                  }}
                  variant="outline"
                  className="border-odillon-teal text-odillon-teal hover:bg-odillon-teal/10"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Methodology Section - Circular Cycle Layout */}
        <BlurFade delay={0.6}>
          <div className="mb-12 md:mb-16 lg:mb-20">
            <div className="text-center mb-8 md:mb-12 px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">{methodology.title}</h2>
              <p className="text-sm md:text-base text-gray-600">{methodology.subtitle}</p>
            </div>

            {/* Desktop: Hexagonal/Circular Layout */}
            <div className="hidden lg:block relative max-w-5xl mx-auto">
              {/* Central Element */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#39837a] to-[#2a6b63] flex items-center justify-center shadow-2xl border-4 border-white">
                  <div className="text-center text-white px-4">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-2" />
                    <div className="text-sm font-bold leading-tight">Management<br />des Risques</div>
                  </div>
                </div>
              </div>

              {/* Circular Arrows SVG Background */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 600 500">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#39837a" opacity="0.4" />
                  </marker>
                </defs>
                {/* Circular path with arrows */}
                <path
                  d="M 300 60 
                     Q 480 60, 520 200 
                     Q 540 340, 400 420 
                     Q 300 480, 200 420 
                     Q 60 340, 80 200 
                     Q 120 60, 300 60"
                  fill="none"
                  stroke="#39837a"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  opacity="0.3"
                  markerMid="url(#arrowhead)"
                />
              </svg>

              {/* Steps positioned in hexagonal pattern */}
              <div className="relative h-[500px]">
                {methodology.steps.map((step, idx) => {
                  const StepIcon = step.icon
                  // Position each step in a hexagonal pattern around the center
                  const positions = [
                    { top: '0%', left: '50%', transform: 'translateX(-50%)' }, // Top center - Analiser (sur le cercle)
                    { top: '15%', right: '5%', transform: 'none' }, // Top right - Transférer
                    { top: '55%', right: '0%', transform: 'none' }, // Bottom right - Réduire
                    { top: '85%', left: '50%', transform: 'translateX(-50%)' }, // Bottom center - Contrôler (sur le cercle)
                    { top: '55%', left: '0%', transform: 'none' }, // Bottom left - Préparer
                    { top: '15%', left: '5%', transform: 'none' }, // Top left - Éviter
                  ]
                  const pos = positions[idx] || positions[0]
                  const colors = idx % 2 === 0 ? { border: '#39837a', bg: '#39837a' } : { border: '#C4D82E', bg: '#8a9920' }

                  return (
                    <FadeIn key={idx} delay={0.1 * (idx + 1)}>
                      <div
                        className="absolute w-44 group cursor-pointer"
                        style={pos}
                      >
                        <div className="flex flex-col items-center text-center">
                          {/* Step Circle */}
                          <div
                            className="w-20 h-20 rounded-full bg-white border-[3px] flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300"
                            style={{ borderColor: colors.border }}
                          >
                            <div className="text-center">
                              <StepIcon className="w-7 h-7 mx-auto" style={{ color: colors.border }} />
                              <div className="text-[10px] font-bold text-gray-400 mt-0.5">{step.number}</div>
                            </div>
                          </div>

                          {/* Step Title */}
                          <h3 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h3>

                          {/* Description - shown on hover */}
                          <p className="text-xs text-gray-500 leading-tight opacity-70 group-hover:opacity-100 transition-opacity">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </FadeIn>
                  )
                })}
              </div>
            </div>

            {/* Mobile/Tablet: Horizontal scrollable cards */}
            <div className="lg:hidden">
              {/* Mobile Center Badge */}
              <div className="flex justify-center mb-8">
                <div className="px-6 py-3 rounded-full bg-gradient-to-r from-[#39837a] to-[#2a6b63] text-white shadow-lg">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-bold text-sm">Management des Risques</span>
                  </div>
                </div>
              </div>

              {/* Steps Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-4">
                {methodology.steps.map((step, idx) => {
                  const StepIcon = step.icon
                  const colors = idx % 2 === 0 ? { border: '#39837a', bg: '#39837a' } : { border: '#C4D82E', bg: '#8a9920' }

                  return (
                    <FadeIn key={idx} delay={0.1 * (idx + 1)}>
                      <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        {/* Step Circle */}
                        <div
                          className="w-14 h-14 rounded-full bg-white border-[3px] flex items-center justify-center shadow mb-2"
                          style={{ borderColor: colors.border }}
                        >
                          <StepIcon className="w-5 h-5" style={{ color: colors.border }} />
                        </div>

                        {/* Step Number & Title */}
                        <div className="text-[10px] font-bold text-gray-400 mb-0.5">{step.number}</div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h3>

                        {/* Description */}
                        <p className="text-[11px] text-gray-500 leading-tight line-clamp-2">
                          {step.description}
                        </p>
                      </div>
                    </FadeIn>
                  )
                })}
              </div>
            </div>
          </div>
        </BlurFade>

        {/* Section Vidéos de Témoignages */}
        <VideosSection
          title="Témoignages Clients"
          badge="Témoignages"
          videos={testimonialVideos}
        />

        <Separator className="my-20" />

        {/* Core Values - Cards Layout */}
        <BlurFade delay={0.7}>
          <div className="mb-12 md:mb-16 lg:mb-20">
            <div className="text-center mb-8 md:mb-12 px-4">
              <Badge variant="odillon" className="mb-3 md:mb-4">
                Nos Valeurs
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                Les principes qui nous guident
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                Des valeurs fondamentales qui inspirent notre action quotidienne et façonnent notre engagement envers l'excellence.
              </p>
            </div>

            {/* Testimonials Carousel */}
            {testimonials.length > 0 && (
              <section className="container mx-auto px-4 py-6">
                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-bold tracking-tight">Ce que les gens disent</h1>
                </div>
                <div className="mx-auto w-[700px] max-w-full">
                  <Card className="flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                    <CardContent className="p-8">
                      <div className="mb-6 flex justify-center">
                        <Quote className="h-10 w-10 text-muted-foreground/30" aria-hidden="true" />
                      </div>
                      <blockquote className="mb-8 text-center text-xl font-medium leading-relaxed">
                        "{testimonials[currentTestimonial].quote}"
                      </blockquote>
                      <div className="flex flex-col items-center">
                        <Avatar className="mb-3 h-14 w-14">
                          <AvatarImage
                            src={testimonials[currentTestimonial].avatar}
                            alt={testimonials[currentTestimonial].name}
                          />
                          <AvatarFallback>{testimonials[currentTestimonial].name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                          <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                          <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].position}</p>
                        </div>
                      </div>
                      <div className="mt-8 flex items-center justify-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                          className="h-9 w-9"
                        >
                          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <div className="flex items-center gap-2">
                          {testimonials.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentTestimonial(idx)}
                              className={`h-2 w-2 rounded-full border transition-colors ${idx === currentTestimonial
                                ? "bg-primary border-primary"
                                : "bg-background border-border"
                                }`}
                              aria-label={`Aller au témoignage ${idx + 1}`}
                            />
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                          className="h-9 w-9"
                        >
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}
          </div>
        </BlurFade>

        {/* CTA Final */}
        <BlurFade delay={0.8}>
          <Card className="border-2 border-gray-300 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden mb-8 md:mb-12 lg:mb-16">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#39837a]/10 to-transparent pointer-events-none" />
            <CardContent className="p-6 md:p-10 lg:p-12 text-center relative">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
                  Prêt à faire passer votre organisation au niveau supérieur ?
                </h2>
                <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed px-4">
                  Rencontrons-nous pour discuter de vos enjeux et découvrir comment notre expertise
                  peut accélérer votre transformation et maximiser votre performance.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 md:gap-4">
                  <Link
                    href="/contact"
                    className="relative inline-flex items-center justify-center gap-2 h-10 md:h-12 px-6 md:px-8 rounded-md text-sm md:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group w-full sm:w-auto"
                    style={{
                      backgroundColor: '#39837a',
                      color: '#ffffff'
                    }}
                  >
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300"></span>
                    <span className="relative" style={{ color: '#ffffff' }}>Contactez nos experts</span>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative" style={{ color: '#ffffff' }} />
                  </Link>
                  <Link
                    href="/services"
                    className="relative inline-flex items-center justify-center gap-2 h-10 md:h-12 px-6 md:px-8 rounded-md text-sm md:text-base font-medium border-2 transition-all duration-300 overflow-hidden group w-full sm:w-auto"
                    style={{
                      borderColor: '#39837a',
                      color: '#39837a'
                    }}
                  >
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ backgroundColor: '#39837a' }}
                    ></span>
                    <span className="relative" style={{ color: '#39837a' }}>Découvrir nos services</span>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative" style={{ color: '#39837a' }} />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      </div >
    </div >
  )
}
