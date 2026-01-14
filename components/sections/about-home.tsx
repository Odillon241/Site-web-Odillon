"use client"

import { useState, useEffect, useRef } from "react"
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
  Send,
  Milestone,
  History
} from "lucide-react"
import { m, useScroll, useSpring, useTransform } from "framer-motion"
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

type JourneyItem = { year: string; title: string; description: string }

const journey: JourneyItem[] = [
  { year: "2017", title: "FONDATION", description: "Création d'Odillon avec une vision claire" },
  { year: "2019", title: "EXPANSION", description: "Extension de nos services et équipe" },
  { year: "2022", title: "RECONNAISSANCE", description: "Certifications et leadership régional" },
  { year: "2024", title: "INNOVATION", description: "Solutions digitales et présence renforcée" },
  { year: "2026", title: "EXCELLENCE", description: "Référence en ingénierie d'entreprise au Gabon" }
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
    <section id="apropos" className="relative py-20 lg:py-32 overflow-hidden">
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

        {/* Timeline - Modern Vertical Redesign */}
        <div className="mb-32 relative">
          <JourneyTimeline journey={journey} />
        </div>


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

function JourneyTimeline({ journey }: { journey: JourneyItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"]
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div ref={containerRef} className="relative max-w-5xl mx-auto px-4">
      {/* Central Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-100 -translate-x-1/2 rounded-full overflow-hidden">
        <m.div
          className="absolute top-0 w-full bg-odillon-teal origin-top"
          style={{ height: "100%", scaleY }}
        />
      </div>

      <div className="space-y-12 md:space-y-24 pt-8">
        {journey.map((item, index) => (
          <TimelineItem
            key={item.year}
            item={item}
            index={index}
            isLast={index === journey.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

function TimelineItem({ item, index, isLast }: { item: JourneyItem; index: number; isLast: boolean }) {
  const isEven = index % 2 === 0
  const ref = useRef(null)
  const isInView = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.1"]
  })

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center justify-between md:justify-normal group",
        isEven ? "md:flex-row-reverse" : "md:flex-row"
      )}
    >
      {/* Dot on the line */}
      <div className="absolute left-4 md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
        <m.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          className={cn(
            "w-5 h-5 rounded-full border-4 bg-white shadow-sm ring-4 ring-white/50 transition-colors duration-500",
            index % 2 === 0 ? "border-odillon-teal" : "border-odillon-lime"
          )}
        />
      </div>

      {/* Content Side */}
      <div className="w-[calc(100%-3rem)] md:w-[42%] ml-12 md:ml-0">
        <m.div
          initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <div className={cn(
            "relative p-6 md:p-8 rounded-2xl border bg-white/40 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-500 group-hover:bg-white/60",
            isEven ? "border-odillon-teal/10 hover:border-odillon-teal/30" : "border-odillon-lime/10 hover:border-odillon-lime/30"
          )}>
            {/* Year Label */}
            <div className={cn(
              "text-4xl md:text-5xl font-black mb-2 select-none opacity-20 group-hover:opacity-40 transition-opacity flex items-center gap-3",
              isEven ? "text-odillon-teal" : "text-odillon-lime"
            )}>
              {item.year}
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              {item.title}
            </h3>

            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              {item.description}
            </p>

            {/* Accent Corner */}
            <div className={cn(
              "absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 opacity-[0.03] group-hover:opacity-10 transition-opacity rotate-12 pointer-events-none",
              isEven ? "text-odillon-teal" : "text-odillon-lime"
            )}>
              <Milestone size={120} />
            </div>
          </div>
        </m.div>
      </div>

      {/* Empty Side (Desktop only) */}
      <div className="hidden md:block w-[42%]" />
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

