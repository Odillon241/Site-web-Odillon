"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/shadcn-io/marquee"
import { TiltCard } from "@/components/ui/tilt-card"
import {
  Landmark,
  Scale,
  TrendingUp,
  Users,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { TextReveal } from "@/components/magicui/text-reveal"

const mainServices = [
  {
    icon: Landmark, // Changed from Shield
    title: "Gouvernance",
    tagline: "Structuration et Restructuration d'Entreprises",
    color: "#39837a",
    highlights: ["Règles de bonne gouvernance", "Conseil d'Administration", "Risques opérationnels"]
  },
  {
    icon: Scale,
    title: "Juridique",
    tagline: "Gestion Administrative, Juridique et Financière",
    color: "#C4D82E",
    highlights: ["Service externalisé", "Contrats", "Négociation"]
  },
  {
    icon: TrendingUp,
    title: "Finances",
    tagline: "Management des Risques",
    color: "#39837a",
    highlights: ["Business plan", "Levée de fonds", "Tableaux de bord"]
  },
  {
    icon: Users,
    title: "Capital Humain",
    tagline: "Relations Publiques",
    color: "#C4D82E",
    highlights: ["Développement RH", "Évaluation", "Rémunérations"]
  }
]

export function ServicesHome() {
  return (
    <section id="services" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-odillon-teal/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <BlurFade delay={0.2} className="max-w-2xl">
            <TextReveal
              text="L'expertise stratégique au service de votre transformation."
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-petrov-sans tracking-tight justify-start"
              delay={0.2}
            />
            {/* Keeping the 'votre réussite' highlight logic by custom styling if needed, or accepting the TextReveal style */}
            <p className="text-lg text-gray-600 leading-relaxed">
              Quatre piliers d'expertise pour transformer et structurer votre organisation de manière pérenne.
            </p>
          </BlurFade>

          <BlurFade delay={0.3}>
            <Button
              asChild
              variant="default"
              className="group bg-odillon-teal hover:bg-odillon-teal/90 text-white font-semibold rounded-md px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/services">
                Voir tous nos services
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </BlurFade>
        </div>

        {/* Clean Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {mainServices.map((service, idx) => {
            const ServiceIcon = service.icon
            return (
              <BlurFade key={service.title} delay={0.1 * (idx + 1)} className="h-full">
                <Link href="/services" className="block h-full cursor-none-target">
                  <TiltCard containerClassName="h-full" className="h-full">
                    <div className="relative h-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100/50 overflow-hidden transform-style-3d group">
                      {/* Hover Gradient Background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${service.color}05 0%, transparent 100%)`
                        }}
                      />

                      <div className="relative z-10 flex flex-col h-full transform-style-3d">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all duration-300"
                          style={{
                            backgroundColor: `${service.color}15`,
                            color: service.color,
                            transform: "translateZ(20px)"
                          }}
                        >
                          <ServiceIcon className="w-7 h-7" strokeWidth={1.5} />
                        </div>

                        <h3
                          className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-odillon-teal transition-colors"
                          style={{ transform: "translateZ(30px)" }}
                        >
                          {service.title}
                        </h3>

                        <p
                          className="text-sm font-medium text-gray-500 mb-6 uppercase tracking-wider"
                          style={{ transform: "translateZ(25px)" }}
                        >
                          {service.tagline}
                        </p>

                        <ul className="space-y-3 mb-8 flex-grow" style={{ transform: "translateZ(15px)" }}>
                          {service.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600">
                              <span
                                className="w-1.5 h-1.5 rounded-full mr-3"
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


      </div >
    </section >
  )
}

