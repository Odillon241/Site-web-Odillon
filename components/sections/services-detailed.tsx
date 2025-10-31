"use client"

import { useState } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
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
    color: "#1A9B8E",
    gradient: "from-[#1A9B8E]/20 via-[#1A9B8E]/10 to-transparent",
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
    color: "#1A9B8E",
    gradient: "from-[#1A9B8E]/20 via-[#1A9B8E]/10 to-transparent",
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

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(to_bottom,white,transparent,white)] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <BlurFade delay={0.1} inView>
            <Badge className="mb-4 bg-gradient-to-r from-[#1A9B8E] to-[#C4D82E] text-white hover:opacity-90 border-0">
              Excellence · Expertise · Innovation
            </Badge>
          </BlurFade>
          
          <BlurFade delay={0.2} inView>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Des services qui transforment{" "}
              <span className="bg-gradient-to-r from-[#1A9B8E] to-[#C4D82E] bg-clip-text text-transparent">
                votre entreprise
              </span>
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.3} inView>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Solutions complètes en ingénierie d'entreprises pour structurer, développer et pérenniser votre organisation.
              <br />
              <span className="text-base text-gray-500 mt-2 inline-block">
                Chaque service est conçu pour répondre à vos enjeux avec finesse et expertise.
              </span>
            </p>
          </BlurFade>
        </div>

        {/* Tabs Navigation */}
        <BlurFade delay={0.4} inView>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 bg-transparent h-auto p-0 mb-12">
              {servicesData.map((service, index) => {
                const Icon = service.icon
                return (
                  <TabsTrigger
                    key={service.id}
                    value={service.id}
                    className="relative group data-[state=active]:bg-white data-[state=active]:shadow-lg border border-gray-200 data-[state=active]:border-gray-300 rounded-xl p-4 h-auto transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-data-[state=active]:scale-110"
                        style={{ 
                          backgroundColor: `${service.color}15`,
                          color: service.color 
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="font-semibold text-sm">{service.title}</div>
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
              <TabsContent key={service.id} value={service.id} className="space-y-12 mt-0">
                {/* Service Header */}
                <FadeIn>
                  <Card className="border-2 relative overflow-hidden" style={{ borderColor: `${service.color}30` }}>
                    <div 
                      className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${service.gradient} pointer-events-none`}
                    />
                    <CardHeader className="relative">
                      <CardTitle className="text-3xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-lg font-medium" style={{ color: service.color }}>
                        {service.tagline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <p className="text-base text-gray-700 leading-relaxed mb-6">
                        {service.description}
                      </p>
                      
                      {/* Key Benefits */}
                      <div className="grid sm:grid-cols-3 gap-4">
                        {service.keyBenefits.map((benefit, idx) => {
                          const BenefitIcon = benefit.icon
                          return (
                            <div 
                              key={idx}
                              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm"
                            >
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${service.color}15`, color: service.color }}
                              >
                                <BenefitIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-semibold text-sm text-gray-900">{benefit.text}</div>
                                <div className="text-xs text-gray-600 mt-0.5">{benefit.detail}</div>
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
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Notre méthode d'accompagnement
                      </h3>
                      <p className="text-gray-600">Un processus éprouvé en 4 étapes</p>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 relative">
                      {/* Connection lines */}
                      <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                      
                      {service.workflow.map((step, idx) => {
                        const StepIcon = step.icon
                        return (
                          <div key={idx} className="relative">
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
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </FadeIn>

                {/* Services Details */}
                <FadeIn delay={0.2}>
                  <div>
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Nos prestations en détail
                      </h3>
                      <p className="text-gray-600">Explorez chaque service pour comprendre comment nous pouvons vous aider</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                      {service.services.map((subService, idx) => {
                        const SubIcon = subService.icon
                        return (
                          <Card key={idx} className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 group">
                            <CardHeader>
                              <div className="flex items-start gap-3 mb-2">
                                <div 
                                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                                  style={{ backgroundColor: `${service.color}15`, color: service.color }}
                                >
                                  <SubIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-xl">{subService.name}</CardTitle>
                                  <CardDescription className="text-sm font-medium mt-1" style={{ color: service.color }}>
                                    {subService.tagline}
                                  </CardDescription>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {subService.description}
                              </p>
                            </CardHeader>
                            <CardContent>
                              <Accordion type="multiple" className="w-full">
                                {subService.details.map((detail, detailIdx) => (
                                  <AccordionItem 
                                    key={detailIdx} 
                                    value={`item-${detailIdx}`}
                                    className="border-b border-gray-200 last:border-0"
                                  >
                                    <AccordionTrigger className="hover:no-underline py-3 text-left">
                                      <span className="text-sm font-medium text-gray-900">{detail.title}</span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-3 pt-2 pb-3">
                                        <div className="bg-gray-50 p-3 border-l-2" style={{ borderColor: service.color }}>
                                          <p className="text-sm text-gray-700 leading-relaxed">
                                            {detail.content}
                                          </p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-3 border-l-2 border-gray-300">
                                          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Impact mesurable</div>
                                          <p className="text-sm font-medium text-gray-900">{detail.impact}</p>
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
                <FadeIn delay={0.3}>
                  <Card className="border-2 bg-gradient-to-br from-gray-50 to-white" style={{ borderColor: `${service.color}30` }}>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Prêt à transformer votre {service.title.toLowerCase()} ?
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Discutons de vos enjeux et découvrez comment nos solutions peuvent propulser votre organisation vers l'excellence.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link 
                          href="/contact"
                          className="relative inline-flex items-center justify-center gap-2 h-11 px-8 rounded-md text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                          style={{ 
                            backgroundColor: service.color,
                            color: '#ffffff'
                          }}
                        >
                          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300"></span>
                          <span 
                            className="relative" 
                            style={{ color: '#ffffff' }}
                          >
                            Discutons de votre projet
                          </span>
                          <ArrowRight 
                            className="w-5 h-5 relative" 
                            style={{ color: '#ffffff' }}
                          />
                        </Link>
                        <Link 
                          href="/#apropos"
                          className="relative inline-flex items-center justify-center gap-2 h-11 px-8 rounded-md text-sm font-medium border-2 transition-all duration-300 overflow-hidden group"
                          style={{ 
                            borderColor: service.color,
                            color: service.color
                          }}
                        >
                          <span 
                            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                            style={{ backgroundColor: service.color }}
                          ></span>
                          <span className="relative" style={{ color: service.color }}>En savoir plus sur nous</span>
                          <ChevronRight className="w-5 h-5 relative" style={{ color: service.color }} />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              </TabsContent>
            ))}
          </Tabs>
        </BlurFade>
      </div>
    </section>
  )
}
