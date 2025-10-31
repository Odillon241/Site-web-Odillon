"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn } from "@/components/magicui/fade-in"
import { 
  Shield, 
  Scale, 
  TrendingUp, 
  Users,
  CheckCircle2,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HighlightText } from "@/components/ui/highlight-text"

const services = [
  {
    icon: Shield,
    title: "Gouvernance",
    color: "odillon-teal",
    description: "Promotion des règles de bonne gouvernance",
    features: [
      "Définition des orientations et de la vision",
      "Rédaction du plan stratégique",
      "Formalisation de l'organisation",
      "Code d'éthique et standards",
      "Mécanismes de bonne gouvernance",
      "Structuration du conseil d'Administration"
    ]
  },
  {
    icon: Scale,
    title: "Juridique",
    color: "odillon-lime",
    description: "Service juridique externalisé complet",
    features: [
      "Négociation des clauses financières",
      "Rédaction des contrats",
      "Analyse des contrats",
      "Service juridique externalisé",
      "Accompagnement dans l'audit externe"
    ]
  },
  {
    icon: TrendingUp,
    title: "Finances",
    color: "odillon-teal",
    description: "Conseil financier pour les opérations stratégiques",
    features: [
      "Rédaction des procédures",
      "Rédaction du Business plan",
      "Accompagnement dans l'élaboration du budget",
      "Mise ne place des tableaux de bord",
      "Lobbying financier"
    ]
  },
  {
    icon: Users,
    title: "Administration et RH",
    color: "odillon-lime",
    description: "Gestion complète des ressources humaines",
    features: [
      "Identification des atouts et handicaps",
      "Définition des objectifs et plans d'action",
      "Indicateurs de performance",
      "Management de la mauvaise performance",
      "Transformation qualitative des ressources",
      "Gestion des talents et carrières"
    ]
  }
]

export function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn delay={0.1}>
            <span className="inline-flex items-center rounded-full bg-odillon-teal/10 px-4 py-1.5 text-sm font-medium text-odillon-teal mb-4">
              Nos Domaines d'Expertise
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Des services complets pour votre{" "}
              <HighlightText className="text-odillon-teal" delay={0.5}>
                réussite
              </HighlightText>
            </h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-lg text-gray-600">
              Nous accompagnons les entreprises dans leur structuration, 
              leur gestion administrative, leurs relations publiques et le management des risques.
            </p>
          </FadeIn>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <FadeIn key={service.title} delay={0.1 * (index + 1)} fullWidth>
                <Card className="h-full border border-gray-200 hover:border-odillon-teal transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-${service.color}/10 rounded flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 text-${service.color}`} style={{ 
                        color: service.color === 'odillon-teal' ? '#1A9B8E' : '#C4D82E' 
                      }} />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle2 
                            className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" 
                            style={{ color: service.color === 'odillon-teal' ? '#1A9B8E' : '#C4D82E' }}
                          />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>

        {/* CTA */}
        <FadeIn delay={0.6}>
          <div className="mt-16 text-center">
            <Button
              asChild
              size="lg"
              className="bg-odillon-teal hover:bg-odillon-teal/90 text-white text-lg px-8 py-6 group"
            >
              <Link href="#contact">
                Discutons de votre projet
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

