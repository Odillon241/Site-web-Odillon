"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import Link from "next/link"
import {
  Puzzle,
  Lightbulb,
  Target,
  CheckCircle,
  ArrowRight
} from "lucide-react"

const expertiseDomains = [
  {
    icon: Puzzle,
    title: "Cohérence",
    description: "Adaptation de la gestion et des outils de travail au changement opérationnel.",
    color: "#39837a",
    features: ["Gestion du changement", "Outils adaptés", "Opérationnel"]
  },
  {
    icon: Lightbulb,
    title: "Amélioration",
    description: "Proposer des solutions idoines.",
    color: "#C4D82E",
    features: ["Solutions sur-mesure", "Optimisation", "Performance"]
  },
  {
    icon: Target,
    title: "Pertinence",
    description: "Adapter les besoins du client aux contraintes.",
    color: "#39837a",
    features: ["Analyse des besoins", "Adaptation", "Contraintes maîtrisées"]
  }
]

export function ExpertiseHome() {
  return (
    <section id="expertise" className="relative py-14 sm:py-20 lg:py-32 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-24 items-start">

          {/* Left Content - Sticky Header */}
          <div className="relative lg:sticky lg:top-32">
            <BlurFade delay={0.1}>
              <div className="inline-flex items-center space-x-3 text-odillon-teal font-medium mb-8">
                <span className="w-12 h-[1px] bg-odillon-teal"></span>
                <span className="uppercase tracking-widest text-sm font-semibold">De 2017 à Nos Jours</span>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 font-baskvill leading-[1.1]">
                Nos compétences au service de votre réussite.
              </h2>
            </BlurFade>

            <BlurFade delay={0.3}>
              <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-md leading-relaxed">
                Nous partageons notre expérience professionnelle et notre éthique afin que nos clients puissent intégrer les pratiques qui pourraient leur convenir.
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
          <div className="space-y-5 sm:space-y-8">
            {expertiseDomains.map((domain, idx) => {
              const DomainIcon = domain.icon
              return (
                <FadeIn key={domain.title} delay={0.1 * (idx + 1)}>
                  <Link href="/services" className="block group perspective-1000">
                    <div className="relative overflow-hidden bg-white/60 backdrop-blur-md p-5 sm:p-8 md:p-10 rounded-lg border border-gray-200/80 hover:border-odillon-teal/30 shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-odillon-teal/10 hover:-translate-y-1 transition-all duration-500 group">
                      {/* Decorative Background Glow */}
                      <div
                        className="absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                        style={{ backgroundColor: domain.color }}
                      />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                        <div className="flex items-center gap-5">
                          <div
                            className="p-4 rounded-lg border-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${domain.color}12 0%, ${domain.color}06 100%)`,
                              borderColor: `${domain.color}25`,
                              boxShadow: `0 8px 20px -4px ${domain.color}15`
                            }}
                          >
                            <DomainIcon className="w-8 h-8" style={{ color: domain.color }} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-odillon-teal transition-colors font-baskvill">
                              {domain.title}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                              {domain.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-slate-100/80 flex flex-wrap gap-x-8 gap-y-3 relative z-10">
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
