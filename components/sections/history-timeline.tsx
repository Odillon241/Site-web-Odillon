"use client"

import { AnimatedTimeline } from "@/components/ui/animated-timeline"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"

export function HistoryTimeline() {
  const timelineEvents = [
    {
      year: 2017,
      title: "Fondation",
      description: "Création d'Odillon avec une vision claire",
      color: "teal" as const,
    },
    {
      year: 2019,
      title: "Expansion",
      description: "Extension de nos services et équipe",
      color: "teal" as const,
    },
    {
      year: 2022,
      title: "Reconnaissance",
      description: "Certifications et leadership régional",
      color: "lime" as const,
    },
    {
      year: 2024,
      title: "Innovation",
      description: "Solutions digitales et présence renforcée",
      color: "lime" as const,
    },
    {
      year: 2026,
      title: "Excellence",
      description: "Référence en ingénierie d'entreprise au Gabon",
      color: "teal" as const,
    },
  ]

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-odillon-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-odillon-lime/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <BlurFade delay={0.1}>
            <span className="inline-block px-4 py-2 rounded-full bg-odillon-teal/10 text-odillon-teal font-semibold text-sm mb-4">
              Notre Parcours
            </span>
          </BlurFade>

          <FadeIn delay={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Une Histoire de{" "}
              <span className="text-odillon-teal">Croissance</span> et{" "}
              <span className="text-odillon-lime">d'Innovation</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Depuis 2017, Odillon accompagne les entreprises gabonaises dans leur développement et leur transformation.
            </p>
          </FadeIn>
        </div>

        {/* Timeline */}
        <AnimatedTimeline events={timelineEvents} />

        {/* Stats summary */}
        <FadeIn delay={0.8}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-odillon-teal mb-2">9+</div>
              <div className="text-sm text-gray-600">Années d'expérience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-odillon-lime mb-2">100+</div>
              <div className="text-sm text-gray-600">Clients accompagnés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-odillon-teal mb-2">4</div>
              <div className="text-sm text-gray-600">Domaines d'expertise</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-odillon-lime mb-2">20+</div>
              <div className="text-sm text-gray-600">Professionnels qualifiés</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
