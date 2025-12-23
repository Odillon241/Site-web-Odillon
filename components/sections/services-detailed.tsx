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

const servicesData = [
  {
    id: "gouvernance",
    icon: Shield,
    title: "Gouvernance d'Entreprise",
    color: "#39837a",
    gradient: "from-[#39837a]/20 via-[#39837a]/10 to-transparent",
    tagline: "Bâtissez les fondations de votre excellence organisationnelle",
    description: "Structurez votre organisation avec des mécanismes de gouvernance robustes et transparents qui inspirent confiance et performance.",
    keyBenefits: [
      { icon: Target, text: "Alignement stratégique", detail: "Vision claire partagée par tous" },
      { icon: Shield, text: "Conformité assurée", detail: "Standards internationaux respectés" },
      { icon: TrendingUp, text: "Performance optimale", detail: "Décisions basées sur des données" }
    ],
    workflow: [
      { step: "1", title: "Diagnostic", description: "Analyse de votre organisation actuelle", icon: FileText },
      { step: "2", title: "Conception", description: "Définition du cadre de gouvernance", icon: Lightbulb },
      { step: "3", title: "Déploiement", description: "Mise en œuvre des structures", icon: Rocket },
      { step: "4", title: "Suivi", description: "Accompagnement et ajustements", icon: BarChart3 }
    ],
    services: [
      {
        icon: Target,
        name: "Stratégie & Vision",
        tagline: "Définissez votre cap",
        description: "Construisez les fondations stratégiques de votre entreprise avec une vision claire et des valeurs partagées.",
        details: [
          {
            title: "Définition des orientations stratégiques",
            content: "Clarifiez votre mission, vision et valeurs pour guider toutes les décisions organisationnelles",
            impact: "Une direction claire augmente l'engagement des équipes de 40%"
          },
          {
            title: "Plan stratégique à 3-5 ans",
            content: "Élaborez une feuille de route détaillée avec objectifs mesurables et jalons clés",
            impact: "Les entreprises avec plan stratégique croissent 2x plus vite"
          },
          {
            title: "Formalisation organisationnelle",
            content: "Créez organigrammes, fiches de poste et procédures pour une structure claire",
            impact: "Réduit les conflits de rôles de 60%"
          },
          {
            title: "Code d'éthique",
            content: "Établissez les standards de conduite et principes éthiques de votre organisation",
            impact: "Renforce la confiance des parties prenantes"
          }
        ]
      },
      {
        icon: Users2,
        name: "Conseil d'Administration",
        tagline: "Optimisez votre gouvernance",
        description: "Structurez et dynamisez votre conseil pour une gouvernance efficace et performante.",
        details: [
          {
            title: "Structuration du conseil",
            content: "Organisation du conseil d'administration et des comités spécialisés (Audit, Rémunération, Stratégie)",
            impact: "Améliore la qualité des décisions stratégiques"
          },
          {
            title: "Documentation et cadre légal",
            content: "Formalisation des règlements intérieurs, charte du conseil et processus décisionnels",
            impact: "Sécurise juridiquement votre gouvernance"
          },
          {
            title: "Formation des membres",
            content: "Développement des compétences du conseil et du management",
            impact: "Augmente l'efficacité du conseil de 35%"
          },
          {
            title: "Tableaux de bord",
            content: "Mise en place d'indicateurs de performance pour le suivi stratégique",
            impact: "Décisions 3x plus rapides et éclairées"
          }
        ]
      },
      {
        icon: FileText,
        name: "Gestion des Risques",
        tagline: "Anticipez et maîtrisez",
        description: "Identifiez, évaluez et gérez proactivement les risques pour protéger votre organisation.",
        details: [
          {
            title: "Contrôle interne",
            content: "Système de contrôle et audit interne pour sécuriser vos opérations",
            impact: "Réduit les incidents de 70%"
          },
          {
            title: "Cartographie des risques",
            content: "Identification et évaluation systématique de tous les risques organisationnels",
            impact: "Permet une allocation optimale des ressources"
          },
          {
            title: "Audit et évaluation",
            content: "Évaluation régulière de la performance et de la conformité",
            impact: "Amélioration continue garantie"
          }
        ]
      },
      {
        icon: BarChart3,
        name: "Communication d'Entreprise",
        tagline: "Valorisez votre image",
        description: "Développez une communication stratégique cohérente et impactante.",
        details: [
          {
            title: "Management de l'image",
            content: "Stratégie de communication interne et externe pour renforcer votre réputation",
            impact: "Augmente la valeur de marque de 45%"
          },
          {
            title: "Gestion de crise",
            content: "Préparation et gestion des situations de crise avec protocoles adaptés",
            impact: "Minimise l'impact des crises"
          },
          {
            title: "Conduite du changement",
            content: "Accompagnement des transformations organisationnelles",
            impact: "Taux de réussite des changements de 85%"
          }
        ]
      }
    ]
  },
  {
    id: "juridique",
    icon: Scale,
    title: "Services Juridiques",
    color: "#C4D82E",
    gradient: "from-[#C4D82E]/20 via-[#C4D82E]/10 to-transparent",
    tagline: "Sécurisez vos opérations avec une expertise juridique de pointe",
    description: "Bénéficiez d'un accompagnement juridique complet et externalisé pour tous vos besoins contractuels et réglementaires.",
    keyBenefits: [
      { icon: Shield, text: "Protection juridique", detail: "Tous vos contrats sécurisés" },
      { icon: BarChart3, text: "Réduction des coûts", detail: "Expertise sans recrutement interne" },
      { icon: Rocket, text: "Réactivité", detail: "Conseil disponible en temps réel" }
    ],
    workflow: [
      { step: "1", title: "Analyse", description: "Compréhension de vos besoins", icon: FileText },
      { step: "2", title: "Conseil", description: "Recommandations juridiques", icon: Lightbulb },
      { step: "3", title: "Rédaction", description: "Documents et contrats", icon: Award },
      { step: "4", title: "Suivi", description: "Accompagnement continu", icon: Target }
    ],
    services: [
      {
        icon: FileText,
        name: "Service Juridique Externalisé",
        tagline: "Votre équipe juridique dédiée",
        description: "Une expertise juridique complète sans les coûts d'une équipe interne.",
        details: [
          {
            title: "Négociation de contrats",
            content: "Négociation des clauses financières et commerciales pour protéger vos intérêts",
            impact: "Économies moyennes de 25% sur les transactions"
          },
          {
            title: "Rédaction contractuelle",
            content: "Tous types de contrats : commerciaux, travail, partenariat, prestations...",
            impact: "Taux de litige réduit de 80%"
          },
          {
            title: "Analyse juridique",
            content: "Revue approfondie des documents légaux et identification des risques",
            impact: "Sécurisation totale de vos opérations"
          },
          {
            title: "Conseil permanent",
            content: "Assistance juridique en temps réel pour vos questions quotidiennes",
            impact: "Décisions sécurisées instantanément"
          },
          {
            title: "Veille réglementaire",
            content: "Surveillance des évolutions légales impactant votre activité",
            impact: "Toujours en conformité"
          }
        ]
      },
      {
        icon: Shield,
        name: "Conformité & Audit",
        tagline: "Restez conforme",
        description: "Préparez et réussissez vos audits avec un accompagnement expert.",
        details: [
          {
            title: "Préparation aux audits",
            content: "Mise en conformité et préparation complète avant audit externe",
            impact: "Taux de réussite de 95%"
          },
          {
            title: "Accompagnement audit",
            content: "Présence et support durant tout le processus d'audit",
            impact: "Réduction du stress de 70%"
          },
          {
            title: "Mise en conformité",
            content: "Alignement avec les réglementations légales et sectorielles",
            impact: "Zéro risque de sanction"
          },
          {
            title: "Gestion des contentieux",
            content: "Résolution des litiges et gestion des conflits juridiques",
            impact: "Résolution 60% plus rapide"
          }
        ]
      },
      {
        icon: Briefcase,
        name: "Droit des Affaires",
        tagline: "Développez sereinement",
        description: "Expertise complète en droit commercial et droit des sociétés.",
        details: [
          {
            title: "Création de sociétés",
            content: "Structuration juridique optimale de votre entreprise",
            impact: "Structure fiscalement avantageuse"
          },
          {
            title: "Fusions & Acquisitions",
            content: "Accompagnement dans les opérations de croissance externe",
            impact: "Transactions sécurisées"
          },
          {
            title: "Propriété intellectuelle",
            content: "Protection de vos marques, brevets et créations",
            impact: "Valorisation de vos actifs immatériels"
          },
          {
            title: "Optimisation fiscale",
            content: "Conseil en droit fiscal pour minimiser votre charge fiscale légalement",
            impact: "Économies fiscales substantielles"
          }
        ]
      }
    ]
  },
  {
    id: "finances",
    icon: TrendingUp,
    title: "Conseil Financier",
    color: "#39837a",
    gradient: "from-[#39837a]/20 via-[#39837a]/10 to-transparent",
    tagline: "Optimisez votre santé financière et accélérez votre croissance",
    description: "De l'élaboration du business plan à la levée de fonds, structurez votre stratégie financière pour maximiser vos performances.",
    keyBenefits: [
      { icon: TrendingUp, text: "Croissance accélérée", detail: "Stratégie financière optimale" },
      { icon: Target, text: "Financement facilité", detail: "Accès aux meilleures sources" },
      { icon: BarChart3, text: "Performance mesurée", detail: "KPIs et tableaux de bord" }
    ],
    workflow: [
      { step: "1", title: "Diagnostic", description: "Analyse de votre situation financière", icon: BarChart3 },
      { step: "2", title: "Stratégie", description: "Élaboration du plan financier", icon: Target },
      { step: "3", title: "Financement", description: "Recherche et négociation", icon: TrendingUp },
      { step: "4", title: "Pilotage", description: "Suivi et optimisation", icon: BarChart3 }
    ],
    services: [
      {
        icon: FileText,
        name: "Structuration Financière",
        tagline: "Posez les bases solides",
        description: "Mettez en place les processus et outils pour un pilotage financier efficace.",
        details: [
          {
            title: "Procédures financières",
            content: "Rédaction des processus comptables et financiers standardisés",
            impact: "Efficacité opérationnelle +50%"
          },
          {
            title: "Business plan",
            content: "Élaboration de prévisions financières détaillées sur 3-5 ans",
            impact: "Crédibilité auprès des investisseurs"
          },
          {
            title: "Budget annuel",
            content: "Construction du budget avec allocation optimale des ressources",
            impact: "Contrôle des dépenses assuré"
          },
          {
            title: "Tableaux de bord",
            content: "KPIs financiers et indicateurs de performance en temps réel",
            impact: "Décisions 5x plus rapides"
          },
          {
            title: "Gestion de trésorerie",
            content: "Optimisation des flux financiers et prévisions de cash",
            impact: "Zéro rupture de trésorerie"
          }
        ]
      },
      {
        icon: TrendingUp,
        name: "Levée de Fonds",
        tagline: "Financez votre ambition",
        description: "Accompagnement complet dans la recherche et négociation de financements.",
        details: [
          {
            title: "Stratégie de financement",
            content: "Identification des meilleures sources : dette, equity, subventions...",
            impact: "Coût du capital optimisé"
          },
          {
            title: "Montage de dossiers",
            content: "Préparation des documents pour banques et investisseurs",
            impact: "Taux d'acceptation de 75%"
          },
          {
            title: "Lobbying financier",
            content: "Réseau et relations avec institutions financières",
            impact: "Accès privilégié aux financements"
          },
          {
            title: "Négociation",
            content: "Négociation des termes et conditions avec les financeurs",
            impact: "Conditions 20% plus favorables"
          },
          {
            title: "Structure financière",
            content: "Optimisation du mix dette/equity",
            impact: "Dilution minimisée"
          }
        ]
      },
      {
        icon: BarChart3,
        name: "Analyse & Performance",
        tagline: "Pilotez avec précision",
        description: "Évaluez et optimisez votre performance financière en continu.",
        details: [
          {
            title: "Analyse financière",
            content: "Diagnostic approfondi de la santé financière",
            impact: "Identification des leviers de croissance"
          },
          {
            title: "Audit financier",
            content: "Évaluation indépendante de vos états financiers",
            impact: "Crédibilité renforcée"
          },
          {
            title: "Optimisation des coûts",
            content: "Identification et réduction des dépenses non essentielles",
            impact: "Marge améliorée de 15-30%"
          },
          {
            title: "Planification stratégique",
            content: "Vision financière long terme alignée avec la stratégie",
            impact: "Croissance durable assurée"
          }
        ]
      }
    ]
  },
  {
    id: "ressources-humaines",
    icon: Users,
    title: "Ressources Humaines",
    color: "#C4D82E",
    gradient: "from-[#C4D82E]/20 via-[#C4D82E]/10 to-transparent",
    tagline: "Transformez votre capital humain en avantage compétitif",
    description: "De la stratégie RH à la gestion des talents, développez une organisation performante centrée sur l'humain.",
    keyBenefits: [
      { icon: Users2, text: "Talents retenus", detail: "Turnover réduit de 50%" },
      { icon: Award, text: "Performance accrue", detail: "Engagement +60%" },
      { icon: Rocket, text: "Culture d'excellence", detail: "Organisation apprenante" }
    ],
    workflow: [
      { step: "1", title: "Audit RH", description: "État des lieux de votre capital humain", icon: FileText },
      { step: "2", title: "Stratégie", description: "Définition de la politique RH", icon: Target },
      { step: "3", title: "Déploiement", description: "Mise en œuvre des programmes", icon: Rocket },
      { step: "4", title: "Développement", description: "Formation et évolution", icon: TrendingUp }
    ],
    services: [
      {
        icon: Target,
        name: "Stratégie RH",
        tagline: "Alignez votre capital humain",
        description: "Définissez le cadre stratégique et opérationnel de vos ressources humaines.",
        details: [
          {
            title: "Diagnostic RH",
            content: "Identification des forces et faiblesses de votre organisation humaine",
            impact: "Vision claire des enjeux"
          },
          {
            title: "Objectifs et plans d'action",
            content: "Définition de la feuille de route RH alignée avec la stratégie",
            impact: "Cohérence organisationnelle totale"
          },
          {
            title: "Indicateurs de performance",
            content: "Mise en place de KPIs RH pour mesurer l'efficacité",
            impact: "Décisions basées sur la data"
          },
          {
            title: "Systèmes d'information RH",
            content: "Analyse et optimisation des outils SIRH",
            impact: "Processus RH digitalisés"
          }
        ]
      },
      {
        icon: Users2,
        name: "Développement des Talents",
        tagline: "Cultivez l'excellence",
        description: "Développez et optimisez votre capital humain pour une performance maximale.",
        details: [
          {
            title: "Gestion de la performance",
            content: "Management des sous-performances et plans d'amélioration",
            impact: "Performance +40% en 6 mois"
          },
          {
            title: "Transformation qualitative",
            content: "Développement des compétences et montée en puissance des équipes",
            impact: "Qualité du travail améliorée"
          },
          {
            title: "Gestion des talents",
            content: "Identification et développement des hauts potentiels",
            impact: "Pipeline de leaders assuré"
          },
          {
            title: "Plans de carrière",
            content: "Remodelage des parcours et plans de succession",
            impact: "Rétention des talents clés"
          },
          {
            title: "Formation continue",
            content: "Programmes de développement des compétences",
            impact: "Organisation apprenante"
          }
        ]
      },
      {
        icon: Award,
        name: "Évaluation & Performance",
        tagline: "Mesurez et reconnaissez",
        description: "Systèmes d'évaluation objectifs et programmes de reconnaissance.",
        details: [
          {
            title: "Système d'évaluation",
            content: "Mise en place de processus d'appréciation transparents et équitables",
            impact: "Équité perçue de 90%"
          },
          {
            title: "Fiches de poste",
            content: "Description détaillée et pesée des postes",
            impact: "Clarté des attentes"
          },
          {
            title: "Management par objectifs",
            content: "Système MBO avec objectifs SMART et suivi régulier",
            impact: "Atteinte des objectifs +65%"
          },
          {
            title: "Entretiens d'évaluation",
            content: "Formation des managers et processus d'entretien structurés",
            impact: "Feedback de qualité"
          }
        ]
      },
      {
        icon: BarChart3,
        name: "Rémunération & Avantages",
        tagline: "Récompensez justement",
        description: "Politique de rémunération compétitive et attractive.",
        details: [
          {
            title: "Audit de rémunération",
            content: "Analyse de la rémunération globale et benchmarking sectoriel",
            impact: "Compétitivité salariale assurée"
          },
          {
            title: "Enquête salariale",
            content: "Comparaison avec le marché pour rester attractif",
            impact: "Positionnement optimal"
          },
          {
            title: "Grille salariale",
            content: "Élaboration d'une structure salariale équitable",
            impact: "Équité interne garantie"
          },
          {
            title: "Avantages sociaux",
            content: "Design de packages attractifs au-delà du salaire",
            impact: "Attractivité +50%"
          },
          {
            title: "Politique d'augmentation",
            content: "Processus de révision salariale transparent",
            impact: "Motivation maintenue"
          }
        ]
      }
    ]
  }
]

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
    <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-white">
      {/* Hero Section with Background */}
      <div className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Soft gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-odillon-teal/5 via-white to-odillon-lime/5" />

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
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/30 to-white/80" />
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
