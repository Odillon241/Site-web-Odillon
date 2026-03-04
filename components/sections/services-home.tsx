"use client"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Button } from "@/components/ui/button"
import { TiltCard } from "@/components/ui/tilt-card"
import {
  Landmark,
  Scale,
  TrendingUp,
  Users,
  ArrowRight,
  GraduationCap,
  Megaphone
} from "lucide-react"
import Link from "next/link"

const mainServices = [
  {
    icon: Landmark,
    title: "Gouvernance",
    slug: "gouvernance",
    tagline: "Structuration et Restructuration d'Entreprises",
    color: "#39837a",
    highlights: ["Règles de bonne gouvernance", "Conseil d'Administration", "Risques opérationnels"]
  },
  {
    icon: Scale,
    title: "Juridique",
    slug: "juridique",
    tagline: "Accompagnement Juridique Externalisé",
    color: "#C4D82E",
    highlights: ["Service externalisé", "Contrats", "Négociation"]
  },
  {
    icon: TrendingUp,
    title: "Finances",
    slug: "finances",
    tagline: "Conseils Financiers",
    color: "#39837a",
    highlights: ["Levée de fonds", "Conseils en investissement", "Tableaux de bord"]
  },
  {
    icon: Users,
    title: "Capital Humain",
    slug: "ressources-humaines",
    tagline: "Administration et Ressources Humaines",
    color: "#C4D82E",
    highlights: ["Développement RH", "Évaluation", "Rémunérations"]
  },
  {
    icon: GraduationCap,
    title: "Formations",
    slug: "formations",
    tagline: "Formation Professionnelle",
    color: "#39837a",
    highlights: ["Master Class", "Coaching professionnel", "Formations en ligne"]
  },
  {
    icon: Megaphone,
    title: "Communication",
    slug: "communication",
    tagline: "Stratégie de Communication",
    color: "#C4D82E",
    highlights: ["Communication institutionnelle", "Communication digitale", "Communication de crise"]
  }
]

export function ServicesHome() {
  return (
    <section id="services" className="relative py-14 sm:py-20 lg:py-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-odillon-teal/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 md:mb-16 gap-6 sm:gap-8">
          <BlurFade delay={0.2} className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-baskvill tracking-tight">
              L&apos;expertise stratégique au service de votre transformation.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Six piliers d&apos;expertise pour transformer et structurer votre organisation de manière pérenne.
            </p>
          </BlurFade>

          <BlurFade delay={0.3}>
            <Button
              asChild
              variant="default"
              className="group bg-odillon-teal hover:bg-odillon-teal/90 text-white font-semibold rounded-lg px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/services">
                Voir tous nos services
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </BlurFade>
        </div>

        {/* Clean Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-14 sm:mb-20 md:mb-24">
          {mainServices.map((service, idx) => {
            const ServiceIcon = service.icon
            return (
              <BlurFade key={service.title} delay={0.1 * (idx + 1)} className="h-full">
                <Link href={`/services/${service.slug}`} className="block h-full cursor-none-target">
                  <TiltCard containerClassName="h-full" className="h-full">
                    <div className="relative h-full bg-white rounded-lg p-8 shadow-lg border border-gray-200/80 overflow-hidden transform-style-3d group">
                      {/* Hover Gradient Background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${service.color}08 0%, ${service.color}03 50%, transparent 100%)`
                        }}
                      />

                      <div className="relative z-10 flex flex-col h-full transform-style-3d">
                        {/* Icon box with gradient border */}
                        <div
                          className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 border-2 shadow-sm group-hover:shadow-md transition-all duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${service.color}12 0%, ${service.color}08 100%)`,
                            borderColor: `${service.color}30`,
                            color: service.color,
                            transform: "translateZ(20px)"
                          }}
                        >
                          <ServiceIcon className="w-7 h-7" strokeWidth={1.5} />
                        </div>

                        <h3
                          className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-odillon-teal transition-colors font-baskvill"
                          style={{ transform: "translateZ(30px)" }}
                        >
                          {service.title}
                        </h3>

                        <p
                          className="text-sm font-medium mb-6 uppercase tracking-wider"
                          style={{ color: `${service.color}cc`, transform: "translateZ(25px)" }}
                        >
                          {service.tagline}
                        </p>

                        <ul className="space-y-3 mb-8 flex-grow" style={{ transform: "translateZ(15px)" }}>
                          {service.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600">
                              <span
                                className="w-2 h-2 rounded-full mr-3 shrink-0"
                                style={{ backgroundColor: service.color }}
                              />
                              {highlight}
                            </li>
                          ))}
                        </ul>

                        <div
                          className="flex items-center text-sm font-semibold mt-auto"
                          style={{ color: service.color, transform: "translateZ(10px)" }}
                        >
                          En savoir plus
                          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </BlurFade>
            )
          })}
        </div>
      </div>
    </section>
  )
}
