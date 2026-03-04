"use client"

import { useState, useEffect, useRef } from "react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Gem,
  Flame,
  HeartHandshake,
  Milestone
} from "lucide-react"
import { m, useScroll, useSpring } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

const coreValues = [
  {
    icon: Gem,
    title: "Talent",
    description: "Notre équipe se définit par l'expression de ses compétences transversales matérialisées par le professionnalisme, la rigueur et la discipline.",
    color: "#39837a"
  },
  {
    icon: Flame,
    title: "Challenge",
    description: "Notre détermination et notre motivation à toujours proposer des solutions innovantes mieux adaptées aux besoins de nos clients.",
    color: "#C4D82E"
  },
  {
    icon: HeartHandshake,
    title: "Proximité",
    description: "Notre implication à fournir des services de qualité exceptionnelle aux clients.",
    color: "#39837a"
  }
]

export type JourneyItem = { year: string; title: string; description: string }

const journey: JourneyItem[] = [
  { year: "2017", title: "FONDATION", description: "Création de la Société ODILLON, spécialisée en Ingénierie d'Entreprises." }
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
    <section id="apropos" className="relative py-14 sm:py-20 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-14 md:mb-24">
          <div>
            <BlurFade delay={0.1}>
              <div className="inline-flex items-center space-x-3 text-odillon-teal font-medium mb-6">
                <span className="w-12 h-[1px] bg-odillon-teal"></span>
                <span className="uppercase tracking-widest text-sm font-semibold">À propos</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-odillon-dark mb-4 sm:mb-6 font-baskvill leading-tight">
                Votre partenaire <br />
                <span className="text-odillon-teal">de confiance</span>.
              </h2>
            </BlurFade>
            <BlurFade delay={0.2}>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Crée en mai 2017, la Société ODILLON, spécialisée en Ingénierie d'Entreprises propose des solutions robustes, pertinentes, durables, adaptées aux besoins de nos clients. Le profil transversal de notre équipe fait de nous le partenaire idéal pour relever vos défis.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Nous partageons notre expérience professionnelle et notre éthique afin que nos clients puissent intégrer les pratiques qui pourraient leur convenir. Nous les encourageons à implémenter la diversité, respecter les normes environnementales et celles relatives à la vie privée des collaborateurs. Nous les accompagnons dans la mise en place des outils de mesure et d'analyse de la performance de leur stratégie.
              </p>
              <div className="inline-flex items-center gap-2 text-odillon-teal font-semibold mb-8">
                <span className="uppercase tracking-widest text-sm">Vision :</span>
                <span className="font-baskvill text-lg">Entreprise Compétitive</span>
              </div>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-odillon-teal text-white hover:bg-odillon-teal/90 rounded-lg shadow-lg shadow-odillon-teal/25 hover:shadow-xl transition-all duration-300">
                  <Link href="/a-propos">Notre histoire</Link>
                </Button>
              </div>
            </BlurFade>
          </div>

          <div className="relative">
            <BlurFade delay={0.3}>
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-3 bg-gradient-to-br from-[#1A9B8E]/20 via-[#C4D82E]/10 to-[#1A9B8E]/5 rounded-lg blur-sm" />
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border border-gray-200/80 ring-1 ring-black/5">
                  {expertiseImageUrl ? (
                    <Image
                      src={expertiseImageUrl}
                      alt="Équipe Odillon"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      <span className="text-gray-300 text-lg font-baskvill">Odillon</span>
                    </div>
                  )}
                </div>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16 md:mb-32 relative">
          <JourneyTimeline journey={journey} />
        </div>

        {/* Core Values - Clean Grid */}
        <BlurFade delay={0.5}>
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 font-baskvill">Nos Valeurs Fondamentales</h3>
            <p className="text-gray-500 max-w-2xl mx-auto">Les principes qui guident chaque action et façonnent notre engagement.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value) => {
              const ValueIcon = value.icon
              return (
                <div key={value.title} className="p-6 rounded-lg bg-white/60 backdrop-blur-md border border-gray-200/80 shadow-lg shadow-slate-200/30 hover:shadow-xl hover:border-odillon-teal/30 hover:-translate-y-1 transition-all duration-300 text-center group">
                  <div
                    className="w-12 h-12 mx-auto rounded-lg border-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${value.color}12 0%, ${value.color}06 100%)`,
                      borderColor: `${value.color}25`
                    }}
                  >
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

export function JourneyTimeline({ journey }: { journey: JourneyItem[] }) {
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
      {/* Central Line - softened color */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-200/60 -translate-x-1/2 rounded-full overflow-hidden">
        <m.div
          className="absolute top-0 w-full bg-odillon-teal/30 origin-top"
          style={{ height: "100%", scaleY }}
        />
      </div>

      <div className="space-y-12 md:space-y-24 pt-8">
        {journey.map((item, index) => (
          <TimelineItem
            key={item.year}
            item={item}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

function TimelineItem({ item, index }: { item: JourneyItem; index: number }) {
  const isEven = index % 2 === 0
  const ref = useRef(null)

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
            "w-4 h-4 rounded-full border-[3px] bg-white shadow-sm ring-4 ring-white/50 transition-colors duration-500",
            isEven ? "border-odillon-teal/50" : "border-odillon-lime/50"
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
            "relative p-6 md:p-8 rounded-lg border bg-white/40 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-500 group-hover:bg-white/60",
            isEven ? "border-gray-200/60 hover:border-odillon-teal/20" : "border-gray-200/60 hover:border-odillon-lime/20"
          )}>
            {/* Year Label */}
            <div className={cn(
              "text-4xl md:text-5xl font-black mb-2 select-none opacity-15 group-hover:opacity-30 transition-opacity flex items-center gap-3",
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
