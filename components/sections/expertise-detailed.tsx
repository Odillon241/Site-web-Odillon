"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { 
  Target, 
  Lightbulb, 
  Users2, 
  TrendingUp,
  CheckCircle,
  Award,
  Briefcase,
  Globe2,
  Shield,
  BarChart3,
  FileText,
  Zap
} from "lucide-react"

const expertiseData = {
  domains: [
    {
      icon: Target,
      title: "Structuration & Restructuration",
      description: "Optimisation de votre organisation pour une efficacité maximale",
      fullDescription: "Nous analysons en profondeur votre structure organisationnelle actuelle pour identifier les opportunités d'amélioration et mettre en place une organisation optimale alignée avec vos objectifs stratégiques.",
      services: [
        "Diagnostic organisationnel complet",
        "Redesign de la structure organisationnelle",
        "Optimisation des processus métiers",
        "Accompagnement au changement",
        "Mise en place de nouvelles structures",
        "Fusion et intégration d'entités"
      ],
      impact: "Amélioration de 30-40% de l'efficacité opérationnelle"
    },
    {
      icon: Briefcase,
      title: "Gestion Administrative, Juridique et Financière",
      description: "Accompagnement complet dans toutes vos opérations administratives",
      fullDescription: "Un service intégré qui couvre l'ensemble de vos besoins en gestion administrative, juridique et financière. Nous assurons la conformité, l'efficacité et l'optimisation de tous vos processus de gestion.",
      services: [
        "Mise en place de systèmes de gestion intégrés",
        "Conformité juridique et réglementaire",
        "Optimisation des processus administratifs",
        "Gestion financière et comptable",
        "Conseil juridique permanent",
        "Automatisation des processus administratifs"
      ],
      impact: "Réduction de 25% des coûts administratifs"
    },
    {
      icon: Globe2,
      title: "Relations Publiques",
      description: "Développement et gestion de votre image et réputation",
      fullDescription: "Nous vous aidons à construire et maintenir une image de marque forte, à gérer vos relations avec les parties prenantes et à développer une stratégie de communication efficace.",
      services: [
        "Stratégie de communication institutionnelle",
        "Gestion des relations avec les médias",
        "Communication de crise et gestion de réputation",
        "Relations avec les parties prenantes",
        "Événementiel d'entreprise",
        "Lobbying et influence"
      ],
      impact: "Amélioration significative de la perception de marque"
    },
    {
      icon: TrendingUp,
      title: "Management des Risques",
      description: "Identification et gestion proactive des risques organisationnels",
      fullDescription: "Une approche systématique pour identifier, évaluer et gérer tous les types de risques auxquels votre entreprise fait face. Nous mettons en place des systèmes de prévention et de gestion des risques adaptés à votre secteur.",
      services: [
        "Cartographie des risques complète",
        "Mise en place de systèmes de contrôle interne",
        "Audit et évaluation des risques",
        "Plans de continuité d'activité (PCA)",
        "Gestion des risques opérationnels",
        "Formation et sensibilisation aux risques"
      ],
      impact: "Réduction de 50% des incidents majeurs"
    }
  ],
  values: [
    {
      icon: Award,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque projet",
      details: "Notre engagement envers l'excellence se traduit par une approche rigoureuse, des méthodologies éprouvées et une attention constante à la qualité de nos livrables. Chaque mission est traitée avec le plus haut niveau de professionnalisme."
    },
    {
      icon: CheckCircle,
      title: "Intégrité",
      description: "Transparence et éthique dans toutes nos actions",
      details: "L'intégrité est au cœur de notre pratique. Nous maintenons les plus hauts standards éthiques, assurons une transparence totale dans nos recommandations et agissons toujours dans le meilleur intérêt de nos clients."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Solutions innovantes adaptées à vos besoins",
      details: "Nous combinons les meilleures pratiques internationales avec des approches innovantes pour créer des solutions sur mesure. Notre veille constante nous permet d'apporter les dernières innovations à nos clients."
    },
    {
      icon: Users2,
      title: "Partenariat",
      description: "Collaboration étroite avec nos clients",
      details: "Nous croyons en une relation de partenariat durable. Notre approche collaborative garantit que nos solutions sont parfaitement alignées avec vos objectifs et que le transfert de compétences est effectif."
    }
  ],
  methodology: [
    {
      step: "1",
      title: "Diagnostic",
      description: "Analyse approfondie de votre situation actuelle",
      icon: BarChart3
    },
    {
      step: "2",
      title: "Stratégie",
      description: "Élaboration d'une stratégie sur mesure",
      icon: Target
    },
    {
      step: "3",
      title: "Mise en œuvre",
      description: "Déploiement des solutions avec accompagnement",
      icon: Zap
    },
    {
      step: "4",
      title: "Suivi",
      description: "Évaluation continue et ajustements",
      icon: FileText
    }
  ]
}

export function ExpertiseDetailed() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <FadeIn delay={0.1}>
            <Badge className="mb-4 bg-odillon-teal/10 text-odillon-teal hover:bg-odillon-teal/20">
              Notre Expertise
            </Badge>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Une expertise reconnue au service de votre{" "}
              <span className="text-odillon-teal">croissance</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-base text-gray-600">
              Depuis notre création, nous accompagnons les entreprises dans leur transformation 
              et leur développement avec des solutions sur mesure et une approche méthodologique éprouvée.
            </p>
          </FadeIn>
        </div>

        {/* Expertise Areas with Hover Cards */}
        <FadeIn delay={0.4}>
          <Tabs defaultValue={expertiseData.domains[0].title} className="w-full mb-16">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              {expertiseData.domains.map((domain) => (
                <TabsTrigger key={domain.title} value={domain.title} className="text-xs sm:text-sm">
                  {domain.title.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {expertiseData.domains.map((domain) => {
              const Icon = domain.icon
              return (
                <TabsContent key={domain.title} value={domain.title} className="space-y-6">
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-2xl mb-2">{domain.title}</CardTitle>
                      <CardDescription className="text-base">{domain.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-gray-600 leading-relaxed">{domain.fullDescription}</p>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Nos Services</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {domain.services.map((service, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-odillon-teal mt-1">•</span>
                              <span className="text-sm text-gray-700">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-odillon-teal/5 rounded p-4 border-l-4 border-odillon-teal">
                        <span className="font-semibold text-gray-900 block mb-1">Impact Mesuré</span>
                        <p className="text-sm text-gray-700">{domain.impact}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )
            })}
          </Tabs>
        </FadeIn>

        {/* Notre Méthodologie */}
        <FadeIn delay={0.5}>
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Notre Méthodologie</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {expertiseData.methodology.map((item) => {
                return (
                  <Card key={item.step} className="border border-gray-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 text-6xl font-bold text-odillon-teal/5 p-4">
                      {item.step}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </FadeIn>

        {/* Values Section */}
        <FadeIn delay={0.6}>
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Nos Valeurs</CardTitle>
              <CardDescription className="text-center">
                Des principes fondamentaux qui guident notre action quotidienne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {expertiseData.values.map((value) => {
                  return (
                    <HoverCard key={value.title}>
                      <HoverCardTrigger asChild>
                        <div className="text-center cursor-pointer group">
                          <h4 className="text-base font-semibold text-gray-900 mb-2">
                            {value.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {value.description}
                          </p>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{value.title}</h4>
                          <p className="text-sm text-gray-600">{value.details}</p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  )
}

