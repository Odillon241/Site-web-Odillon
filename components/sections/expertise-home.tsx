"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Target,
  Briefcase,
  Globe2,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import { NumberTicker } from "@/components/ui/number-ticker"
import { TextReveal } from "@/components/magicui/text-reveal"

const expertiseDomains = [
  {
    icon: Target,
    title: "Structuration & Restructuration",
    impact: "35%",
    metric: "d'efficacité en plus",
    color: "#39837a",
    features: ["Diagnostic complet", "Optimisation", "Accompagnement"]
  },
  {
    icon: Briefcase,
    title: "Gestion Intégrée",
    impact: "25%",
    metric: "de coûts en moins",
    color: "#C4D82E",
    features: ["Conformité totale", "Digitalisation", "Pilotage"]
  },
  {
    icon: Globe2,
    title: "Relations Publiques",
    impact: "60%",
    metric: "de visibilité en plus",
    color: "#39837a",
    features: ["Communication", "Médias", "Lobbying"]
  },
  {
    icon: TrendingUp,
    title: "Management des Risques",
    impact: "50%",
    metric: "d'incidents en moins",
    color: "#C4D82E",
    features: ["Cartographie", "PCA/PRA", "Audit"]
  }
]

export function ExpertiseHome() {
  return (
    <section id="expertise" className="relative py-24 lg:py-32 bg-transparent border-t border-gray-100/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left Content - Sticky Header */}
          <div className="relative lg:sticky lg:top-32">
            <BlurFade delay={0.1}>
              <div className="inline-flex items-center space-x-3 text-odillon-teal font-medium mb-8">
                <span className="w-12 h-[1px] bg-odillon-teal"></span>
                <span className="uppercase tracking-widest text-sm font-semibold">Expertise Reconnue</span>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <TextReveal
                text="Des résultats mesurables et durables."
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 font-petrov-sans leading-[1.1] items-start justify-start"
                delay={0.2}
              />
            </BlurFade>

            <BlurFade delay={0.3}>
              <p className="text-lg text-gray-600 mb-12 max-w-md leading-relaxed">
                Au-delà du conseil, nous nous engageons sur l'impact réel de nos interventions. Notre approche pragmatique garantit un retour sur investissement rapide.
              </p>
            </BlurFade>

            <BlurFade delay={0.5}>
              <Link
                href="/services"
                className="inline-flex items-center text-odillon-teal font-semibold group"
              >
                Découvrir notre approche
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </BlurFade>
          </div>

          {/* Right Content - Cards List */}
          <div className="space-y-8">
            {expertiseDomains.map((domain, idx) => {
              const DomainIcon = domain.icon
              return (
                <FadeIn key={domain.title} delay={0.1 * (idx + 1)}>
                  <Link href="/services" className="block group perspective-1000">
                    <div className="relative overflow-hidden bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-lg border border-white/20 hover:border-odillon-teal/40 hover:bg-white/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-odillon-teal/10 hover:-translate-y-2 transition-all duration-500 group">
                      {/* Decorative Background Glow */}
                      <div
                        className="absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                        style={{ backgroundColor: domain.color }}
                      />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                        <div className="flex items-center gap-5">
                          <div
                            className="p-4 rounded-lg bg-white shadow-lg border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                            style={{ boxShadow: `0 10px 25px -5px ${domain.color}20` }}
                          >
                            <DomainIcon className="w-8 h-8" style={{ color: domain.color }} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-odillon-teal transition-colors font-petrov-sans">
                              {domain.title}
                            </h3>
                            <div className="text-sm text-slate-400 mt-1 font-medium flex items-center group-hover:text-odillon-teal/70 transition-colors">
                              Explorez notre savoir-faire <ArrowRight className="w-3 h-3 ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-x-8 gap-y-3 relative z-10">
                        {domain.features.map((feature, i) => (
                          <div key={i} className="flex items-center text-sm font-semibold text-slate-600">
                            <CheckCircle className="w-4 h-4 mr-2.5 text-odillon-teal transition-transform group-hover:scale-110" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

