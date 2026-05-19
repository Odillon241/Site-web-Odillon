"use client"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Button } from "@/components/ui/button"
import {
  Landmark,
  Scale,
  TrendingUp,
  Users,
  ArrowRight,
  GraduationCap,
  Megaphone,
  Rocket,
  Banknote,
  Check
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const mainServices = [
  {
    icon: Landmark,
    title: "Gouvernance",
    slug: "gouvernance",
    tagline: "Structuration et Restructuration d'Entreprises",
    color: "#39837a",
    highlights: ["Règles de bonne gouvernance", "Conseil d'Administration", "Risques opérationnels"],
    span: "lg:col-span-4"
  },
  {
    icon: Scale,
    title: "Juridique",
    slug: "juridique",
    tagline: "Accompagnement Juridique Externalisé",
    color: "#C4D82E",
    highlights: ["Service externalisé", "Contrats", "Négociation"],
    span: "lg:col-span-4"
  },
  {
    icon: TrendingUp,
    title: "Finances",
    slug: "finances",
    tagline: "Conseils Financiers",
    color: "#39837a",
    highlights: ["Levée de fonds", "Conseils en investissement", "Tableaux de bord"],
    span: "lg:col-span-4"
  },
  {
    icon: Users,
    title: "Capital Humain",
    slug: "ressources-humaines",
    tagline: "Administration et Ressources Humaines",
    color: "#C4D82E",
    highlights: ["Développement RH", "Évaluation", "Rémunérations"],
    span: "lg:col-span-6"
  },
  {
    icon: GraduationCap,
    title: "Formations",
    slug: "formations",
    tagline: "Formation Professionnelle",
    color: "#39837a",
    highlights: ["Master Class", "Coaching professionnel", "Formations en ligne"],
    span: "lg:col-span-6"
  },
  {
    icon: Megaphone,
    title: "Communication",
    slug: "communication",
    tagline: "Stratégie de Communication",
    color: "#C4D82E",
    highlights: ["Communication institutionnelle", "Communication digitale", "Communication de crise"],
    span: "lg:col-span-4"
  },
  {
    icon: Rocket,
    title: "Entreprenariat",
    slug: "entreprenariat",
    tagline: "Accompagnement Entrepreneurial",
    color: "#39837a",
    highlights: ["Création d'entreprise", "Business plan", "Développement"],
    span: "lg:col-span-4"
  },
  {
    icon: Banknote,
    title: "Paie",
    slug: "paie",
    tagline: "Gestion de la Paie",
    color: "#C4D82E",
    highlights: ["Bulletins de paie", "Déclarations sociales", "Optimisation"],
    span: "lg:col-span-4"
  }
]

export function ServicesHome() {
  return (
    <section id="services" className="relative py-20 sm:py-28 lg:py-36 overflow-hidden bg-white">
      {/* Background Decor - Minimalist */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-8">
          <div className="max-w-3xl">
            <BlurFade delay={0.1}>
              <div className="inline-flex items-center space-x-2 mb-6">
                <span className="w-8 h-px bg-odillon-teal"></span>
                <span className="text-odillon-teal text-xs font-bold uppercase tracking-[0.2em]">
                  Nos Piliers d&apos;Expertise
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-baskvill tracking-tight leading-[1.2]">
                L&apos;expertise stratégique au service de votre transformation.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Huit domaines d&apos;intervention pour structurer votre organisation et sécuriser votre croissance de manière pérenne.
              </p>
            </BlurFade>
          </div>

          <BlurFade delay={0.2}>
            <Button
              asChild
              variant="outline"
              className="group border-slate-200 hover:border-odillon-teal hover:bg-odillon-teal/5 text-slate-900 font-bold rounded-lg px-8 h-12 transition-all duration-300"
            >
              <Link href="/offres">
                Voir toutes nos offres
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </BlurFade>
        </div>

        {/* Bento Grid Layout - Clean & Structured */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-16 sm:mb-24">
          {mainServices.map((service, idx) => {
            const Icon = service.icon
            return (
              <BlurFade
                key={service.title}
                delay={0.05 * (idx + 1)}
                className={cn("h-full", service.span)}
              >
                <Link href={`/offres/${service.slug}`} className="block h-full group">
                  <div className="relative h-full bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 rounded-2xl p-8 sm:p-10 flex flex-col overflow-hidden">
                    {/* Discret Accent Color Top */}
                    <div 
                      className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: service.color }}
                    />

                    {/* Icon - Static & Clean */}
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-8 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${service.color}10`, color: service.color }}
                    >
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                        style={{ color: service.color }}
                      >
                        {service.tagline}
                      </p>
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 font-baskvill">
                        {service.title}
                      </h3>

                      <ul className="space-y-3 mb-8">
                        {service.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start text-sm text-slate-600 leading-tight">
                            <Check className="w-4 h-4 mr-3 mt-0.5 shrink-0" style={{ color: service.color }} />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer link */}
                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-odillon-teal transition-colors">
                      En savoir plus
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              </BlurFade>
            )
          })}
        </div>
      </div>
    </section>
  )
}
