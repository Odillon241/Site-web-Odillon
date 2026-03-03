"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { 
  Target, 
  Lightbulb, 
  Users2, 
  TrendingUp,
  CheckCircle,
  Award,
  Briefcase,
  Globe2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { HighlightText } from "@/components/ui/highlight-text"

const expertiseAreas = [
  {
    icon: Target,
    title: "Structuration & Restructuration",
    description: "Nous aidons les organisations à optimiser leur structure pour une efficacité maximale et une croissance durable."
  },
  {
    icon: Briefcase,
    title: "Accompagnement Juridique Externalisé",
    description: "Bénéficiez d'une expertise juridique complète et externalisée pour tous vos besoins contractuels et réglementaires."
  },
  {
    icon: Globe2,
    title: "Relations Publiques",
    description: "Développement et gestion de votre image de marque et de vos relations avec les parties prenantes."
  },
  {
    icon: TrendingUp,
    title: "Management des Risques",
    description: "Identification, évaluation et gestion proactive des risques pour protéger votre entreprise."
  }
]

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "Nous visons l'excellence dans chaque projet"
  },
  {
    icon: CheckCircle,
    title: "Intégrité",
    description: "Transparence et éthique dans toutes nos actions"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Solutions innovantes adaptées à vos besoins"
  },
  {
    icon: Users2,
    title: "Partenariat",
    description: "Collaboration étroite avec nos clients"
  }
]

export function Expertise() {
  return (
    <section id="expertise" className="py-12 md:py-16 lg:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 px-4">
          <FadeIn delay={0.1}>
            <span className="inline-flex items-center rounded-full bg-odillon-teal/10 px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium text-odillon-teal mb-3 md:mb-4">
              Notre Expertise
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Une expertise reconnue au service de votre{" "}
              <HighlightText className="text-odillon-teal" delay={0.5}>
                croissance
              </HighlightText>
            </h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Depuis notre création, nous accompagnons les entreprises dans leur transformation 
              et leur développement avec des solutions sur mesure.
            </p>
          </FadeIn>
        </div>

        {/* Expertise Areas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16 lg:mb-20">
          {expertiseAreas.map((area, index) => {
            const Icon = area.icon
            return (
              <BlurFade key={area.title} delay={0.1 * index}>
                <Card className="h-full border border-gray-200 hover:border-odillon-teal transition-all duration-300 bg-white">
                  <CardContent className="pt-4 md:pt-6 px-3 md:px-6 pb-4 md:pb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-odillon-teal/10 rounded flex items-center justify-center mb-3 md:mb-4">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-odillon-teal" />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1.5 md:mb-2 leading-tight">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      {area.description}
                    </p>
                  </CardContent>
                </Card>
              </BlurFade>
            )
          })}
        </div>

        {/* Values Section */}
        <div className="bg-white rounded p-6 md:p-8 lg:p-12 border border-gray-200">
          <FadeIn delay={0.3}>
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                Nos Valeurs
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto text-xs md:text-sm">
                Des principes fondamentaux qui guident notre action quotidienne 
                et définissent notre relation avec nos clients.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <FadeIn key={value.title} delay={0.1 * (index + 4)}>
                  <div className="text-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-odillon-lime/10 rounded flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-odillon-lime" />
                    </div>
                    <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-1.5 md:mb-2">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {value.description}
                    </p>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

