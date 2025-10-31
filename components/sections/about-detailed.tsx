"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Building2, Users, Trophy, Globe, Target, Heart, Lightbulb, Handshake, Award, CheckCircle } from "lucide-react"
import Link from "next/link"

const stats = [
  {
    icon: Building2,
    value: "15+",
    label: "Années d'expérience",
    description: "Plus de 15 ans d'expertise en ingénierie d'entreprises"
  },
  {
    icon: Users,
    value: "50+",
    label: "Clients accompagnés",
    description: "Des entreprises de toutes tailles et secteurs"
  },
  {
    icon: Trophy,
    value: "100+",
    label: "Projets réussis",
    description: "Missions menées à bien avec succès"
  },
  {
    icon: Globe,
    value: "3",
    label: "Pays couverts",
    description: "Afrique Centrale et au-delà"
  }
]

const histoire = {
  title: "Notre Histoire",
  content: [
    "Fondé avec la vision de transformer le paysage entrepreneurial en Afrique Centrale, Odillon - Ingénierie d'Entreprises s'est rapidement imposé comme un partenaire de référence pour les organisations en quête d'excellence.",
    "Depuis nos débuts, nous avons accompagné des dizaines d'entreprises dans leur transformation, leur structuration et leur développement. Notre approche combine rigueur méthodologique, expertise sectorielle et compréhension profonde des enjeux locaux.",
    "Aujourd'hui, nous sommes fiers de notre parcours et de la confiance que nos clients nous accordent. Chaque succès client renforce notre engagement à fournir des services d'excellence."
  ]
}

const mission = {
  icon: Target,
  title: "Notre Mission",
  description: "Accompagner les entreprises dans leur transformation et leur croissance",
  details: [
    "Apporter des solutions innovantes et personnalisées adaptées aux réalités locales",
    "Transférer les compétences et renforcer les capacités internes de nos clients",
    "Contribuer au développement économique durable en Afrique Centrale",
    "Maintenir les plus hauts standards d'éthique professionnelle et de qualité"
  ]
}

const vision = {
  icon: Lightbulb,
  title: "Notre Vision",
  description: "Être le partenaire de référence en ingénierie d'entreprises en Afrique Centrale",
  details: [
    "Reconnu pour notre excellence opérationnelle et nos résultats tangibles",
    "Leader dans l'innovation et l'adoption des meilleures pratiques internationales",
    "Partenaire privilégié des organisations ambitieuses",
    "Catalyseur du développement organisationnel et de la performance"
  ]
}

const engagement = {
  icon: Heart,
  title: "Notre Engagement",
  description: "Fournir des services de qualité supérieure",
  details: [
    "Respect des plus hauts standards d'éthique professionnelle et de déontologie",
    "Approche centrée sur les résultats et la création de valeur durable",
    "Disponibilité et réactivité face aux besoins de nos clients",
    "Amélioration continue de nos méthodes et de notre expertise"
  ]
}

const equipe = {
  title: "Notre Équipe",
  description: "Une équipe d'experts passionnés et expérimentés",
  specialites: [
    {
      icon: Award,
      name: "Consultants Seniors",
      description: "Experts avec 10+ ans d'expérience dans différents secteurs"
    },
    {
      icon: Users,
      name: "Spécialistes RH",
      description: "Experts en gestion des talents et développement organisationnel"
    },
    {
      icon: Building2,
      name: "Conseillers Juridiques",
      description: "Avocats et juristes spécialisés en droit des affaires"
    },
    {
      icon: Trophy,
      name: "Analystes Financiers",
      description: "Experts en finance d'entreprise et stratégie financière"
    }
  ]
}

const approche = {
  title: "Notre Approche",
  description: "Une méthodologie éprouvée pour garantir votre réussite",
  principes: [
    {
      title: "Écoute Active",
      description: "Nous prenons le temps de comprendre vos enjeux et vos objectifs avant de proposer des solutions"
    },
    {
      title: "Sur-Mesure",
      description: "Chaque organisation est unique. Nos solutions sont personnalisées et adaptées à votre contexte"
    },
    {
      title: "Collaboration",
      description: "Nous travaillons main dans la main avec vos équipes pour garantir l'appropriation des solutions"
    },
    {
      title: "Résultats",
      description: "Nous nous engageons sur des livrables concrets et mesurables avec des indicateurs de performance clairs"
    }
  ]
}

export function AboutDetailed() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <FadeIn delay={0.1}>
            <Badge className="mb-4 bg-odillon-teal/10 text-odillon-teal hover:bg-odillon-teal/20">
              À Propos de Nous
            </Badge>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Votre partenaire de confiance en{" "}
              <span className="text-odillon-teal">ingénierie d'entreprises</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-base text-gray-600">
              Découvrez qui nous sommes, nos valeurs et notre engagement envers l'excellence 
              et la réussite de nos clients.
            </p>
          </FadeIn>
        </div>

        {/* Stats */}
        <FadeIn delay={0.4}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => {
              return (
                <Card key={stat.label} className="border border-gray-200 text-center">
                  <CardHeader>
                    <div className="text-3xl font-bold text-odillon-teal">{stat.value}</div>
                    <CardTitle className="text-base">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{stat.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </FadeIn>

        {/* Histoire */}
        <FadeIn delay={0.5}>
          <Card className="border border-gray-200 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">{histoire.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {histoire.content.map((paragraph, idx) => (
                <p key={idx} className="text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Mission, Vision, Engagement */}
        <FadeIn delay={0.6}>
          <Tabs defaultValue="mission" className="w-full mb-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mission">Mission</TabsTrigger>
              <TabsTrigger value="vision">Vision</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="mission">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl">{mission.title}</CardTitle>
                  <CardDescription>{mission.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mission.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-odillon-teal mt-1">•</span>
                        <span className="text-sm text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vision">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl">{vision.title}</CardTitle>
                  <CardDescription>{vision.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vision.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-odillon-lime mt-1">•</span>
                        <span className="text-sm text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl">{engagement.title}</CardTitle>
                  <CardDescription>{engagement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {engagement.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-odillon-teal mt-1">•</span>
                        <span className="text-sm text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </FadeIn>

        {/* Notre Équipe */}
        <FadeIn delay={0.7}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">{equipe.title}</h2>
            <p className="text-center text-gray-600 mb-8">{equipe.description}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {equipe.specialites.map((spec) => {
                return (
                  <Card key={spec.name} className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-base">{spec.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{spec.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </FadeIn>

        {/* Notre Approche */}
        <FadeIn delay={0.8}>
          <Card className="border border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{approche.title}</CardTitle>
              <CardDescription className="text-center">{approche.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {approche.principes.map((principe, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 h-8 bg-odillon-teal rounded flex items-center justify-center flex-shrink-0 text-white font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{principe.title}</h4>
                      <p className="text-sm text-gray-600">{principe.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.9}>
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Prêt à transformer votre entreprise ?
            </h3>
            <Button asChild size="lg" className="bg-odillon-teal hover:bg-odillon-teal/90 text-white">
              <Link href="/contact">Contactez-nous</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

