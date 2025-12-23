"use client"

import { useState, useEffect } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Award,
  Shield,
  Lightbulb,
  Heart,
  ArrowRight,
  TrendingUp,
  Send
} from "lucide-react"
import Link from "next/link"

const coreValues = [
  {
    icon: Award,
    title: "Excellence",
    description: "Standards élevés dans chaque mission",
    color: "#39837a"
  },
  {
    icon: Shield,
    title: "Intégrité",
    description: "Transparence et éthique totale",
    color: "#C4D82E"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Solutions créatives et adaptées",
    color: "#39837a"
  },
  {
    icon: Heart,
    title: "Partenariat",
    description: "Collaboration étroite et durable",
    color: "#C4D82E"
  }
]

const journey = [
  { year: "2017", title: "Fondation", description: "Création d'Odillon avec une vision claire" },
  { year: "2019", title: "Expansion", description: "Extension de nos services et équipe" },
  { year: "2022", title: "Reconnaissance", description: "Certifications et leadership régional" },
  { year: "2024", title: "Innovation", description: "Solutions digitales et présence renforcée" }
]

export function AboutHome() {
  const [expertiseImageUrl, setExpertiseImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchExpertiseImage = async () => {
      try {
        const res = await fetch('/api/settings', {
          cache: 'default',
          next: { revalidate: 60 }
        })
        if (res.ok) {
          const data = await res.json()
          setExpertiseImageUrl(data.settings?.expertise_image_url || null)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'image Expertise:', error)
      }
    }
    fetchExpertiseImage()
  }, [])

  return (
    <section id="apropos" className="relative py-20 lg:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section - Redesigned */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <BlurFade delay={0.1}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-odillon-dark mb-6 font-petrov-sans leading-tight">
                Votre partenaire <br />
                <span className="text-odillon-teal">de confiance</span>.
              </h2>
            </BlurFade>
            <BlurFade delay={0.2}>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Depuis 2017, nous accompagnons les entreprises dans leur transformation avec excellence et intégrité. Nous croyons que chaque organisation a le potentiel de devenir un leader dans son secteur.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-odillon-dark text-white hover:bg-odillon-teal">
                  <Link href="/a-propos">Notre histoire</Link>
                </Button>
              </div>
            </BlurFade>
          </div>

          <div className="relative">
            <BlurFade delay={0.3}>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl">
                {expertiseImageUrl ? (
                  <Image
                    src={expertiseImageUrl}
                    alt="Équipe Odillon"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    Image Équipe
                  </div>
                )}
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 bg-odillon-teal text-white p-6 rounded-xl shadow-lg max-w-xs hidden md:block">
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-sm opacity-90">de clients recommandent nos services année après année</div>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* Timeline - Simplified */}
        <BlurFade delay={0.4}>
          <div className="mb-24 relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {journey.map((step, idx) => (
                <div key={step.year} className="relative bg-white md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none border md:border-0 border-gray-100">
                  <div className="w-4 h-4 rounded-full bg-odillon-teal border-4 border-white shadow-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-10" />
                  <div className="text-center md:pt-12">
                    <div className="text-3xl font-bold text-gray-900 mb-2 font-petrov-sans">{step.year}</div>
                    <div className="text-sm font-semibold text-odillon-teal uppercase tracking-wide mb-2">{step.title}</div>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* Core Values - Clean Grid */}
        <BlurFade delay={0.5}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nos Valeurs Fondamentales</h3>
            <p className="text-gray-500 max-w-2xl mx-auto">Les principes qui guident chaque action et façonnent notre engagement.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, idx) => {
              const ValueIcon = value.icon
              return (
                <div key={value.title} className="p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100 text-center group">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-white flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <ValueIcon className="w-6 h-6" style={{ color: value.color }} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              )
            })}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

