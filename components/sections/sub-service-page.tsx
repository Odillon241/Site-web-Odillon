"use client"

import { useState, useEffect, useRef } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Target,
  FileText,
  Users2,
  BarChart3,
  Award,
  Lightbulb,
  Rocket,
  Shield,
  Scale,
  TrendingUp,
  Users,
  Search,
  Banknote,
  ExternalLink,
  FileDown,
  Briefcase,
  List
} from "lucide-react"
import Link from "next/link"
import type { ServiceData } from "@/lib/services-data"

const iconMap: Record<string, React.ComponentType<any>> = {
  Shield, Scale, TrendingUp, Users, Target, FileText, Users2,
  BarChart3, Briefcase, Award, Lightbulb, Rocket, Search, Banknote,
}

type SubServiceData = ServiceData["services"][number]

type SubServicePageProps = {
  service: ServiceData
  subService: SubServiceData
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function SubServicePage({ service, subService }: SubServicePageProps) {
  const SubIcon = iconMap[subService.icon] || Shield
  const [activeSection, setActiveSection] = useState<string>("")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Sections pour la navigation
  const sections = subService.details.map((detail, idx) => ({
    id: `section-${idx}`,
    label: detail.title,
    number: idx + 1,
  }))

  // Autres prestations du même service
  const siblingServices = service.services.filter(s => s.slug !== subService.slug)

  // Observer pour highlight la section active au scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          // Prendre la première section visible
          const sorted = visible.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top
          })
          setActiveSection(sorted[0].target.id)
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    )

    sections.forEach(section => {
      const el = document.getElementById(section.id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [subService.slug])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      setMobileNavOpen(false)
    }
  }

  return (
    <section className="relative py-8 md:py-12 lg:py-16 bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(to_bottom,white,transparent,white)] pointer-events-none opacity-5" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Back navigation + Badge */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/offres/${service.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors opacity-70 hover:opacity-100"
            style={{ color: service.color }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à {service.title}
          </Link>
          <Badge variant="odillon">
            {service.title}
          </Badge>
        </div>

        {/* Header */}
        <div className="mb-8 md:mb-10">
          <BlurFade delay={0.15}>
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                style={{ backgroundColor: `${service.color}15`, color: service.color }}
              >
                <SubIcon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight font-baskvill">
                  {subService.name}
                </h1>
                <p className="text-sm md:text-base font-medium mt-1" style={{ color: service.color }}>
                  {subService.tagline}
                </p>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl">
              {subService.description}
            </p>
          </BlurFade>
        </div>

        {/* Mobile: Sommaire déroulant */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <List className="w-4 h-4" style={{ color: service.color }} />
              Sommaire
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileNavOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileNavOpen && (
            <div className="border border-t-0 border-gray-200 bg-white divide-y divide-gray-100">
              {/* Sections du contenu */}
              <div className="p-3">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                  Sur cette page
                </div>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-2 py-2 text-sm transition-colors ${
                      activeSection === section.id
                        ? "font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={activeSection === section.id ? { color: service.color } : undefined}
                  >
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={
                        activeSection === section.id
                          ? { backgroundColor: `${service.color}15`, color: service.color }
                          : { backgroundColor: "#f3f4f6", color: "#9ca3af" }
                      }
                    >
                      {section.number}
                    </span>
                    <span className="truncate">{section.label}</span>
                  </button>
                ))}
              </div>

              {/* Autres prestations */}
              {siblingServices.length > 0 && (
                <div className="p-3">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Autres prestations
                  </div>
                  {siblingServices.map((sibling) => {
                    const SibIcon = iconMap[sibling.icon] || Shield
                    return (
                      <Link
                        key={sibling.slug}
                        href={`/offres/${service.id}/${sibling.slug}`}
                        className="flex items-center gap-2.5 px-2 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <SibIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{sibling.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="flex gap-8 lg:gap-10">
          {/* Sidebar - Desktop only */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-[120px]">
              <nav className="space-y-6">
                {/* Sections du contenu actuel */}
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                    Sur cette page
                  </div>
                  <div className="space-y-0.5">
                    {sections.map((section) => {
                      const isActive = activeSection === section.id
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm transition-all duration-200 border-l-2 ${
                            isActive
                              ? "font-medium bg-white/80"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                          }`}
                          style={isActive ? { borderColor: service.color, color: service.color } : undefined}
                        >
                          <span
                            className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={
                              isActive
                                ? { backgroundColor: `${service.color}15`, color: service.color }
                                : { backgroundColor: "#f3f4f6", color: "#9ca3af" }
                            }
                          >
                            {section.number}
                          </span>
                          <span className="leading-tight line-clamp-2">{section.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Séparateur */}
                {siblingServices.length > 0 && (
                  <>
                    <div className="border-t border-gray-100 mx-3" />

                    {/* Autres prestations */}
                    <div>
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                        Autres prestations
                      </div>
                      <div className="space-y-0.5">
                        {siblingServices.map((sibling) => {
                          const SibIcon = iconMap[sibling.icon] || Shield
                          return (
                            <Link
                              key={sibling.slug}
                              href={`/offres/${service.id}/${sibling.slug}`}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 transition-all duration-200 border-l-2 border-transparent group"
                            >
                              <SibIcon className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover:opacity-80 transition-opacity" />
                              <span className="leading-tight line-clamp-2">{sibling.name}</span>
                              <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
                            </Link>
                          )
                        })}
                      </div>
                    </div>

                    {/* Lien retour au service */}
                    <div className="border-t border-gray-100 mx-3 pt-4">
                      <Link
                        href={`/offres/${service.id}`}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors opacity-60 hover:opacity-100"
                        style={{ color: service.color }}
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Toutes les prestations {service.title}
                      </Link>
                    </div>
                  </>
                )}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Details as full sections */}
            <div className="space-y-8 md:space-y-12">
              {subService.details.map((detail, idx) => (
                <FadeIn key={idx} delay={0.05 * idx}>
                  <article id={`section-${idx}`} className="group scroll-mt-[130px]">
                    {/* Detail title */}
                    <div className="flex items-center gap-3 mb-4 md:mb-5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
                        style={{ backgroundColor: `${service.color}15`, color: service.color }}
                      >
                        {idx + 1}
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 font-baskvill">
                        {detail.title}
                      </h2>
                    </div>

                    {/* Detail content - full paragraphs */}
                    <div className="pl-11 space-y-4">
                      <div className="border-l-2 pl-5 md:pl-6 space-y-4" style={{ borderColor: `${service.color}40` }}>
                        {detail.content.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx} className="text-sm md:text-base text-gray-700 leading-relaxed md:leading-7">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {/* Impact */}
                      <div className="bg-gradient-to-r from-gray-50 to-white p-3 md:p-4 border-l-2 border-gray-300">
                        <div className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase mb-1">
                          Impact mesurable
                        </div>
                        <p className="text-sm md:text-base font-medium text-gray-900">
                          {detail.impact}
                        </p>
                      </div>
                    </div>

                    {/* Separator */}
                    {idx < subService.details.length - 1 && (
                      <div className="mt-8 md:mt-10 border-t border-gray-100" />
                    )}
                  </article>
                </FadeIn>
              ))}
            </div>

            {/* Legal References */}
            {service.legalReferences && service.legalReferences.length > 0 && (
              <FadeIn delay={0.3}>
                <div className="mt-12 md:mt-16">
                  <Badge variant="odillon" className="mb-3">
                    Ressources
                  </Badge>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 font-baskvill">
                    Documents et textes de référence
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.legalReferences.map((ref, idx) => (
                      <a
                        key={idx}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 p-3 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-300"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${service.color}15`, color: service.color }}
                        >
                          {ref.type === "pdf" ? (
                            <FileDown className="w-4 h-4" />
                          ) : (
                            <ExternalLink className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                            {ref.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {ref.description}
                          </div>
                          <div className="text-xs font-medium mt-1.5 flex items-center gap-1" style={{ color: service.color }}>
                            {ref.type === "pdf" ? "Télécharger le PDF" : "Consulter"}
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* CTA */}
            <FadeIn delay={0.4}>
              <Card className="border-2 bg-gradient-to-br from-gray-50 to-white mt-10 md:mt-14" style={{ borderColor: `${service.color}30` }}>
                <CardContent className="p-6 md:p-8 text-center">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 font-baskvill">
                    Besoin d'accompagnement ?
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 max-w-xl mx-auto">
                    Nos experts en {service.title.toLowerCase()} sont à votre disposition pour vous conseiller.
                  </p>
                  <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
                    <Link
                      href="/contact"
                      className="relative inline-flex items-center justify-center gap-2 h-10 md:h-11 px-6 md:px-8 rounded-md text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group w-full sm:w-auto"
                      style={{ backgroundColor: service.color, color: '#ffffff' }}
                    >
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300" />
                      <span className="relative" style={{ color: '#ffffff' }}>Discutons de votre projet</span>
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative" style={{ color: '#ffffff' }} />
                    </Link>
                    <Link
                      href={`/offres/${service.id}`}
                      className="relative inline-flex items-center justify-center gap-2 h-10 md:h-11 px-6 md:px-8 rounded-md text-xs md:text-sm font-medium border-2 transition-all duration-300 overflow-hidden group w-full sm:w-auto"
                      style={{ borderColor: service.color, color: service.color }}
                    >
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: service.color }} />
                      <span className="relative" style={{ color: service.color }}>Voir toutes nos prestations</span>
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 relative" style={{ color: service.color }} />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
