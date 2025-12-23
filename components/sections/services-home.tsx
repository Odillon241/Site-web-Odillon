"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/shadcn-io/marquee"
import {
  Shield,
  Scale,
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles,
  Zap,
  Target
} from "lucide-react"
import Link from "next/link"
import { NumberTicker } from "@/components/ui/number-ticker"

const mainServices = [
  {
    icon: Shield,
    title: "Gouvernance",
    tagline: "Structurez votre organisation",
    color: "#39837a",
    highlights: ["Conseil d'admin.", "Politique interne", "Contrôle"]
  },
  {
    icon: Scale,
    title: "Juridique",
    tagline: "Sécurisez vos opérations",
    color: "#C4D82E",
    highlights: ["Contrats", "Conformité", "Audit"]
  },
  {
    icon: TrendingUp,
    title: "Finance",
    tagline: "Optimisez votre croissance",
    color: "#39837a",
    highlights: ["Business plan", "Levée de fonds", "Reporting"]
  },
  {
    icon: Users,
    title: "Ressources Humaines",
    tagline: "Développez vos talents",
    color: "#C4D82E",
    highlights: ["Recrutement", "Formation", "Carrières"]
  }
]

const benefits = [
  { icon: Sparkles, text: "Excellence garantie", metric: "95%" },
  { icon: Zap, text: "Réponse rapide", metric: "24h" },
  { icon: Target, text: "Résultats mesurables", metric: "100%" }
]

export function ServicesHome() {
  return (
    <section id="services" className="relative py-24 lg:py-32 bg-gray-50/50 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-odillon-teal/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <BlurFade delay={0.2} className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-petrov-sans tracking-tight">
              Solutions complètes pour <br />
              <span className="text-odillon-teal">votre réussite</span>.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Quatre piliers d'expertise pour transformer et structurer votre organisation de manière pérenne.
            </p>
          </BlurFade>

          <BlurFade delay={0.3}>
            <Button
              asChild
              variant="outline"
              className="group border-odillon-teal/20 hover:border-odillon-teal/50 hover:bg-odillon-teal/5 text-odillon-teal font-medium rounded-md px-6 h-12"
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
              <BlurFade key={service.title} delay={0.1 * (idx + 1)}>
                <Link href="/services" className="block h-full group">
                  <Card className="h-full border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white relative overflow-hidden group-hover:border-odillon-teal/30 rounded-lg">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-odillon-teal/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <CardContent className="p-8 flex flex-col h-full">
                      <div
                        className="w-14 h-14 rounded-md flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${service.color}10` }}
                      >
                        <ServiceIcon className="w-7 h-7" style={{ color: service.color }} />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 font-petrov-sans group-hover:text-odillon-teal transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-8 flex-grow leading-relaxed">
                        {service.tagline}
                      </p>

                      <ul className="space-y-3 mb-8">
                        {service.highlights.map((highlight, i) => (
                          <li key={i} className="text-xs font-medium text-gray-500 flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-odillon-teal/40 mr-3 group-hover:bg-odillon-teal transition-colors" />
                            {highlight}
                          </li>
                        ))}
                      </ul>

                      <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-sm font-medium text-gray-400 group-hover:text-odillon-teal transition-colors">
                        <span>En savoir plus</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </BlurFade>
            )
          })}
        </div>

        {/* Minimalist Stats/Benefits */}
        <BlurFade delay={0.5}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {benefits.map((benefit, idx) => {
                const BenefitIcon = benefit.icon
                return (
                  <div key={idx} className="flex items-center gap-5">
                    <div className="bg-odillon-teal/5 p-4 rounded-md">
                      <BenefitIcon className="w-8 h-8 text-odillon-teal" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 font-petrov-sans">
                        <NumberTicker value={parseInt(benefit.metric)} />
                        {benefit.metric.replace(/\d+/g, '')}
                      </div>
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">{benefit.text}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

