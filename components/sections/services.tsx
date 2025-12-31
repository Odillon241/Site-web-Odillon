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
      "Définition des orientations, de la vision et des valeurs",
      "Rédaction du plan stratégique",
      "Formalisation de l'organisation",
      "Code d'éthique standards",
      "Mise en place des mécanismes et outils de bonne gouvernance",
      "Structuration du Conseil d'Administration et des Comités spécialisés"
    ]
  },
  {
    icon: Scale,
    title: "Juridique",
    color: "odillon-lime",
    description: "Service juridique externalisé complet",
    features: [
      "Service juridique externalisé",
      "Négociation des clauses financières des Contrats",
      "Rédaction des contrats",
      "Analyse des contrats"
    ]
  },
  {
    icon: TrendingUp,
    title: "Finances",
    color: "odillon-teal",
    description: "Conseil financier pour les opérations stratégiques",
    features: [
      "Conseil Financier pour les opérations de levée de fonds",
      "Conseil en Investissement",
      "Rédaction des Procédures",
      "Rédaction du Business Plan",
      "Accompagnement dans l'élaboration du Budget",
      "Mise en place des tableaux de bord",
      "Lobbying financier"
    ]
  },
  {
    icon: Users,
    title: "Administration et RH",
    color: "odillon-lime",
    description: "Gestion complète des ressources humaines",
    features: [
      "Identification des atouts et des handicaps de l'Entreprise",
      "Définition des objectifs et des plans d'action",
      "Mise en place des indicateurs de performance",
      "Management de la mauvaise performance",
      "Transformation qualitative des Ressources Humaines",
      "Gestion des Talents et remodelage des carrières"
    ]
  }
]

export function Services() {
  return (
    <section id="services" className="py-12 md:py-16 lg:py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 px-4">
          <FadeIn delay={0.1}>
            <span className="inline-flex items-center rounded-full bg-odillon-teal/10 px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium text-odillon-teal mb-3 md:mb-4">
              Nos Domaines d'Expertise
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Des services complets pour votre{" "}
              <HighlightText className="text-odillon-teal" delay={0.5}>
                réussite
              </HighlightText>
            </h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-base md:text-lg text-gray-600">
              Nous accompagnons les entreprises dans leur structuration,
              leur gestion administrative, leurs relations publiques et le management des risques.
            </p>
          </FadeIn>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <FadeIn key={service.title} delay={0.1 * (index + 1)} fullWidth>
                <Card className="h-full border border-gray-200 hover:border-odillon-teal transition-all duration-300 group">
                  <CardHeader className="px-4 md:px-6 py-4 md:py-6">
                    <div className={`w-10 h-10 md:w-12 md:h-12 bg-${service.color}/10 rounded flex items-center justify-center mb-3 md:mb-4 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 md:w-6 md:h-6 text-${service.color}`} style={{
                        color: service.color === 'odillon-teal' ? '#39837a' : '#C4D82E'
                      }} />
                    </div>
                    <CardTitle className="text-lg md:text-xl text-gray-900">{service.title}</CardTitle>
                    <CardDescription className="text-xs md:text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
                    <ul className="space-y-2 md:space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle2
                            className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0 mt-0.5"
                            style={{ color: service.color === 'odillon-teal' ? '#39837a' : '#C4D82E' }}
                          />
                          <span className="text-xs md:text-sm text-gray-700">{feature}</span>
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
          <div className="mt-12 md:mt-16 text-center">
            <Button
              asChild
              size="lg"
              className="bg-odillon-teal hover:bg-odillon-teal/90 text-white text-base md:text-lg px-6 md:px-8 py-5 md:py-6 group w-full sm:w-auto"
            >
              <Link href="/contact">
                Discutons de votre projet
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

