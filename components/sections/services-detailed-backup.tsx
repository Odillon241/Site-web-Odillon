"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Scale, 
  TrendingUp, 
  Users,
  CheckCircle2,
  ArrowRight,
  Target,
  FileText,
  Users2,
  BarChart3,
  Briefcase,
  Award,
  Info
} from "lucide-react"
import Link from "next/link"

// Type pour les détails enrichis
type DetailItem = {
  title: string
  description: string
  example?: string
}

const servicesDetailed = [
  {
    id: "gouvernance",
    icon: Shield,
    title: "Gouvernance d'Entreprise",
    color: "odillon-teal",
    shortDescription: "Structuration et mise en place des règles de bonne gouvernance pour optimiser la performance organisationnelle",
    longDescription: "La gouvernance d'entreprise est le socle fondamental de toute organisation performante. Nous vous accompagnons dans la définition et la mise en œuvre de structures de gouvernance adaptées à vos enjeux stratégiques, en conformité avec les meilleures pratiques internationales.",
    services: [
      {
        icon: Target,
        name: "Promotion des Règles de Bonne Gouvernance",
        description: "Nous établissons un cadre de gouvernance solide et transparent pour votre organisation.",
        details: [
          "Définition des orientations stratégiques, de la vision et des valeurs de l'entreprise",
          "Rédaction du plan stratégique à moyen et long terme (3-5 ans)",
          "Formalisation de l'organisation : organigrammes, fiches de poste, procédures",
          "Élaboration du code d'éthique et des standards de conduite",
          "Mise en place des mécanismes et outils de bonne gouvernance",
          "Mise en place des politiques et procédures de l'entreprise"
        ]
      },
      {
        icon: Users2,
        name: "Conseil d'Administration",
        description: "Structuration et optimisation du fonctionnement de votre conseil d'administration.",
        details: [
          "Structuration du conseil d'Administration et des Comités spécialisés",
          "Documentation et formalisation des clés du conseil d'Administration",
          "Formation et développement des membres du Management et du Conseil",
          "Mise en place de tableaux de bord pour le suivi de la performance",
          "Accompagnement dans la définition des rôles et responsabilités"
        ]
      },
      {
        icon: FileText,
        name: "Couverture des Risques Opérationnels",
        description: "Identification et gestion proactive des risques organisationnels.",
        details: [
          "Mise en place du contrôle interne et audit interne",
          "Définition de la cartographie des risques",
          "Audit interne et évaluation de la performance globale",
          "Préparation et accompagnement de l'Audit Externe",
          "Gestion de l'information et de la documentation de l'entreprise"
        ]
      },
      {
        icon: BarChart3,
        name: "Communication d'Entreprise",
        description: "Stratégie de communication interne et externe pour renforcer votre image.",
        details: [
          "Management de l'image de l'entreprise",
          "Gestion de la communication de crise",
          "Gestion du changement organisationnel",
          "Communication interne et externe",
          "Assistance dans la prise des rendez-vous avec les Administrations",
          "Coordination et suivi des projets avec les Administrations"
        ]
      }
    ],
    benefits: [
      "Amélioration de la transparence et de la responsabilité",
      "Réduction des risques organisationnels et opérationnels",
      "Optimisation de la prise de décision stratégique",
      "Renforcement de la confiance des parties prenantes",
      "Conformité aux standards internationaux de gouvernance"
    ]
  },
  {
    id: "juridique",
    icon: Scale,
    title: "Services Juridiques",
    color: "odillon-lime",
    shortDescription: "Accompagnement juridique complet et externalisé pour sécuriser vos opérations et optimiser vos contrats",
    longDescription: "Notre service juridique externalisé vous offre une expertise complète pour tous vos besoins en matière juridique et contractuelle. De la rédaction à la négociation de contrats, nous sécurisons vos opérations commerciales et vous accompagnons dans la gestion de vos relations juridiques.",
    services: [
      {
        icon: FileText,
        name: "Service Juridique Externalisé",
        description: "Une équipe juridique dédiée sans les coûts d'un service interne.",
        details: [
          "Négociation des clauses financières et commerciales des contrats",
          "Rédaction de tous types de contrats (commerciaux, de travail, partenariat)",
          "Analyse juridique approfondie des contrats et documents légaux",
          "Conseil juridique permanent et assistance en temps réel",
          "Veille juridique et réglementaire sectorielle"
        ]
      },
      {
        icon: Shield,
        name: "Accompagnement Audit et Conformité",
        description: "Préparation et suivi des audits externes pour garantir votre conformité.",
        details: [
          "Préparation de l'entreprise aux audits externes",
          "Accompagnement durant le processus d'audit",
          "Mise en conformité réglementaire et légale",
          "Gestion des contentieux et litiges",
          "Conseil en droit des sociétés et restructuration"
        ]
      },
      {
        icon: Briefcase,
        name: "Droit des Affaires",
        description: "Expertise en droit commercial et droit des sociétés.",
        details: [
          "Création et structuration de sociétés",
          "Fusions, acquisitions et restructurations",
          "Droit commercial et contrats d'affaires",
          "Protection de la propriété intellectuelle",
          "Droit fiscal et optimisation fiscale"
        ]
      }
    ],
    benefits: [
      "Sécurisation juridique de toutes vos opérations",
      "Réduction des risques juridiques et contentieux",
      "Économie sur les coûts d'un service juridique interne",
      "Expertise pointue et mise à jour permanente",
      "Réactivité et disponibilité immédiate"
    ]
  },
  {
    id: "finances",
    icon: TrendingUp,
    title: "Conseil Financier",
    color: "odillon-teal",
    shortDescription: "Conseil financier stratégique pour optimiser votre gestion et développer votre entreprise",
    longDescription: "Nos experts financiers vous accompagnent dans toutes les étapes de développement de votre entreprise. De l'élaboration du business plan à la levée de fonds, nous vous aidons à structurer votre stratégie financière et à optimiser vos performances économiques.",
    services: [
      {
        icon: FileText,
        name: "Structuration Financière",
        description: "Mise en place des processus financiers et outils de pilotage.",
        details: [
          "Rédaction des procédures financières et comptables",
          "Élaboration du Business plan et prévisionnel financier",
          "Accompagnement dans l'élaboration du budget annuel",
          "Mise en place des tableaux de bord financiers",
          "Optimisation de la trésorerie et des flux financiers"
        ]
      },
      {
        icon: TrendingUp,
        name: "Levée de Fonds et Lobbying Financier",
        description: "Accompagnement dans la recherche et la négociation de financements.",
        details: [
          "Stratégie de levée de fonds (Dette, Actions, Investisseurs)",
          "Conseil en investissement et financement",
          "Lobbying financier auprès des institutions",
          "Montage de dossiers de financement",
          "Négociation avec les banques et investisseurs",
          "Optimisation de la structure financière"
        ]
      },
      {
        icon: BarChart3,
        name: "Analyse et Performance Financière",
        description: "Évaluation et optimisation de la performance financière.",
        details: [
          "Analyse financière approfondie",
          "Audit financier et diagnostic",
          "Optimisation des coûts et rentabilité",
          "Conseil en gestion de trésorerie",
          "Planification financière stratégique"
        ]
      }
    ],
    benefits: [
      "Optimisation de la structure financière de l'entreprise",
      "Accès facilité aux sources de financement",
      "Amélioration de la rentabilité et de la performance",
      "Prise de décision éclairée basée sur des données fiables",
      "Anticipation et gestion des risques financiers"
    ]
  },
  {
    id: "ressources-humaines",
    icon: Users,
    title: "Administration et Ressources Humaines",
    color: "odillon-lime",
    shortDescription: "Gestion complète des ressources humaines pour développer le capital humain de votre organisation",
    longDescription: "Les ressources humaines sont le cœur de votre entreprise. Nous vous accompagnons dans la mise en place de politiques RH efficaces, du recrutement à la gestion des carrières, en passant par la formation et l'évaluation des performances. Notre approche vise à transformer vos ressources humaines en véritable avantage compétitif.",
    services: [
      {
        icon: Target,
        name: "Projet et Chartes d'Entreprise",
        description: "Définition du cadre stratégique et opérationnel des ressources humaines.",
        details: [
          "Identification des atouts et des handicaps de l'Entreprise",
          "Définition des objectifs et des plans d'action RH",
          "Mise en place des indicateurs de performance RH",
          "Analyse des systèmes d'information des Ressources Humaines",
          "Conception de la stratégie RH alignée avec la stratégie d'entreprise"
        ]
      },
      {
        icon: Users2,
        name: "Politiques de Développement des Ressources Humaines",
        description: "Développement et optimisation du capital humain.",
        details: [
          "Management de la mauvaise performance et plans d'amélioration",
          "Transformation qualitative des ressources humaines",
          "Gestion des talents et identification des hauts potentiels",
          "Remodelage des carrières et plans de succession",
          "Mise en place et suivi du plan individuel de développement",
          "Formation continue et développement des compétences"
        ]
      },
      {
        icon: Award,
        name: "Politique d'Évaluation de la Performance",
        description: "Systèmes d'évaluation et de reconnaissance des performances.",
        details: [
          "Mise en place du système d'appréciation et d'évaluation",
          "Inventaire des positions/fonctions à développer",
          "Évaluation des emplois (fiches de poste et pesée des postes)",
          "Management par objectifs (MBO)",
          "Entretiens d'évaluation et feedback constructif"
        ]
      },
      {
        icon: BarChart3,
        name: "Politique des Rémunérations et Avantages",
        description: "Optimisation de la politique de rémunération et avantages sociaux.",
        details: [
          "Analyse des avantages et de la rémunération globale",
          "Analyse de l'enquête salariale et benchmarking",
          "Gestion des augmentations des salaires et révisions",
          "Assistance dans l'élaboration de la grille salariale",
          "Audit des avantages sociaux et autres avantages",
          "Design de packages de rémunération attractifs"
        ]
      }
    ],
    benefits: [
      "Optimisation de la gestion du capital humain",
      "Amélioration de la performance individuelle et collective",
      "Réduction du turnover et augmentation de la rétention",
      "Développement d'une culture d'excellence",
      "Attractivité accrue pour les talents"
    ]
  }
]

export function ServicesDetailed() {
  return (
    <section className="py-16 bg-white">
      {/* Floating Navigation - Top Right */}
      <nav className="fixed right-8 top-32 z-40 hidden xl:block">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200/60 overflow-hidden">
          <div className="flex flex-col">
            <a
              href="#gouvernance"
              className="group relative px-4 py-3 text-sm font-medium text-gray-700 hover:text-white transition-all border-b border-gray-100 last:border-b-0"
            >
              <div className="absolute inset-0 bg-odillon-teal transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="relative flex items-center gap-3">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Gouvernance</span>
              </div>
            </a>
            <a
              href="#juridique"
              className="group relative px-4 py-3 text-sm font-medium text-gray-700 hover:text-white transition-all border-b border-gray-100 last:border-b-0"
            >
              <div className="absolute inset-0 bg-odillon-teal transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="relative flex items-center gap-3">
                <Scale className="w-4 h-4 flex-shrink-0" />
                <span>Juridique</span>
              </div>
            </a>
            <a
              href="#finances"
              className="group relative px-4 py-3 text-sm font-medium text-gray-700 hover:text-white transition-all border-b border-gray-100 last:border-b-0"
            >
              <div className="absolute inset-0 bg-odillon-teal transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="relative flex items-center gap-3">
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                <span>Finances</span>
              </div>
            </a>
            <a
              href="#ressources-humaines"
              className="group relative px-4 py-3 text-sm font-medium text-gray-700 hover:text-white transition-all"
            >
              <div className="absolute inset-0 bg-odillon-teal transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="relative flex items-center gap-3">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>Ressources Humaines</span>
              </div>
            </a>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <FadeIn delay={0.1}>
            <Badge className="mb-4 bg-odillon-teal/10 text-odillon-teal hover:bg-odillon-teal/20">
              Nos Domaines d'Expertise
            </Badge>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Des services complets pour votre{" "}
              <span className="text-odillon-teal">réussite</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-base text-gray-600">
              Découvrez notre gamme complète de services en ingénierie d'entreprises. 
              Chaque domaine d'expertise est conçu pour répondre à vos enjeux stratégiques 
              et opérationnels avec des solutions sur mesure.
            </p>
          </FadeIn>
        </div>

        {/* Services Sections */}
        <FadeIn delay={0.4}>
          <div className="space-y-20">
            {servicesDetailed.map((service, serviceIndex) => {
              const MainIcon = service.icon
              return (
                <div key={service.id} id={service.id} className="scroll-mt-32">
                  {/* Service Overview */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base">{service.shortDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{service.longDescription}</p>
                    </CardContent>
                  </Card>

                  {/* Detailed Services */}
                  <div className="space-y-6 mt-8">
                    <h3 className="text-xl font-semibold text-gray-900">Nos Prestations Détaillées</h3>
                    <div className="grid gap-6">
                      {service.services.map((subService, index) => {
                        return (
                          <Card key={index} className="border border-gray-200 hover:border-odillon-teal/30 transition-colors">
                            <CardHeader>
                              <CardTitle className="text-lg text-gray-900">{subService.name}</CardTitle>
                              <CardDescription>{subService.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2.5">
                                {subService.details.map((detail, idx) => (
                                  <div key={idx} className="flex items-start gap-3 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-odillon-teal mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                                    <p className="text-sm text-gray-700 leading-relaxed">{detail}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>

                  {/* Benefits */}
                  <Card className="border border-gray-200 bg-gray-50 mt-8">
                    <CardHeader>
                      <CardTitle className="text-lg">Bénéfices Clés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-odillon-teal mt-1">•</span>
                            <span className="text-sm text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Separator between services (except last) */}
                  {serviceIndex < servicesDetailed.length - 1 && (
                    <div className="mt-20 border-t border-gray-200" />
                  )}
                </div>
              )
            })}

            {/* CTA */}
            <div className="flex justify-center pt-8">
              <Button asChild className="bg-odillon-teal hover:bg-odillon-teal/90 text-white">
                <Link href="/contact">
                  Discutons de votre projet
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

