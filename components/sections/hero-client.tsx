"use client"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { ArrowRight, Shield, TrendingUp, Users, Award } from "lucide-react"
import Link from "next/link"
import { m } from "framer-motion"
import { BackgroundSlideshow } from "@/components/ui/background-slideshow"

interface HeroClientProps {
  images: Array<{ src: string; alt: string }>
}

export function HeroClient({ images }: HeroClientProps) {
  return (
    <section id="accueil" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Background Layer */}
      {images.length > 0 ? (
        <div className="absolute inset-0 z-0">
          <BackgroundSlideshow
            images={images}
            interval={6000}
          />
          {/* Enhanced Overlay for text readability - darker/more premium */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-[1]" />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-[1]" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-gray-800" />
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
        
        {/* Main Badge/Tagline */}
        <FadeIn delay={0.1}>
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-odillon-lime mr-2 animate-pulse" />
              Ingénierie d'Entreprises & Conseil Stratégique
            </span>
          </div>
        </FadeIn>

        {/* Main Headline - Simplified and Stronger */}
        <FadeIn delay={0.2}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 md:mb-8 font-petrov-sans drop-shadow-lg">
            Structurer pour <span className="text-odillon-lime">réussir</span>,<br className="hidden md:block" />
            Innover pour <span className="text-odillon-teal">durer</span>.
          </h1>
        </FadeIn>

        {/* Subtitle - More readable */}
        <FadeIn delay={0.3}>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-10 md:mb-12 font-light">
            Cabinet expert en <strong>gouvernance</strong>, <strong>finance</strong>, <strong>RH</strong> et <strong>juridique</strong>. 
            Nous transformons vos défis organisationnels en leviers de performance durable.
          </p>
        </FadeIn>

        {/* CTA Buttons - Centered and Premium */}
        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-odillon-teal hover:bg-odillon-teal/90 text-white text-lg px-8 py-6 rounded-full shadow-lg shadow-odillon-teal/20 transition-all hover:scale-105"
            >
              <Link href="#contact">
                Discuter de votre projet
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/5 border-white/30 text-white hover:bg-white hover:text-odillon-dark text-lg px-8 py-6 rounded-full backpack-blur-sm transition-all"
            >
              <Link href="#services">
                Découvrir nos services
              </Link>
            </Button>
          </div>
        </FadeIn>

        {/* Stats / Trust Indicators - Minimized at bottom */}
        <FadeIn delay={0.6}>
          <div className="mt-20 md:mt-24 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
             <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">15+</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Années d'expérience</div>
             </div>
             <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">100+</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Projets Réalisés</div>
             </div>
             <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">4</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Pôles d'Expertise</div>
             </div>
             <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">Libreville</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Basé au Gabon</div>
             </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
