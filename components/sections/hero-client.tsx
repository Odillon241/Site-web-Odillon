"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { ArrowRight, Shield, TrendingUp, Users, Award } from "lucide-react"
import Link from "next/link"
import { m } from "framer-motion"
import { BackgroundSlideshow } from "@/components/ui/background-slideshow"
import TextPressure from "@/components/ui/shadcn-io/text-pressure"
import { WordPullUp } from "@/components/magicui/word-pull-up"
import { FlipWords } from "@/components/magicui/flip-words"
import { TextReveal } from "@/components/magicui/text-reveal"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee"
import Image from "next/image"
import { CompanyLogo } from "@/types/admin"

interface HeroClientProps {
  images: Array<{ src: string; alt: string }>
  logos: CompanyLogo[]
}

// Composant pour afficher un logo avec fallback
function LogoItem({ company }: { company: CompanyLogo }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="group relative flex items-center justify-center w-32 h-20 md:w-40 md:h-24 transition-all duration-300">
      {!imageError && company.logo_path ? (
        <div className="relative w-full h-full flex items-center justify-center transition-all duration-300 group-hover:scale-105">
          <Image
            src={company.logo_path}
            alt={`${company.name} logo`}
            width={120}
            height={80}
            className="object-contain max-w-full max-h-full opacity-80 group-hover:opacity-100 transition-opacity"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="text-center w-full group-hover:scale-105 transition-transform">
          <div
            className="text-xl md:text-2xl font-bold mb-1 text-odillon-teal/60 group-hover:text-odillon-teal transition-colors duration-300"
          >
            {company.fallback}
          </div>
          <div className="text-xs text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
            {company.name}
          </div>
        </div>
      )}
    </div>
  )
}

export function HeroClient({ images, logos }: HeroClientProps) {
  return (
    <section id="accueil" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-transparent">
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Main Headline - With FlipWords */}
        <FadeIn delay={0.2}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 md:mb-8 font-petrov-sans drop-shadow-lg">
            Structurer pour{" "}
            <span className="text-odillon-lime">
              <FlipWords
                words={["réussir", "croître", "performer", "exceller"]}
                duration={3000}
                className="text-odillon-lime"
              />
            </span>
            <br className="hidden md:block" />
            Innover pour <span className="text-odillon-teal">durer</span>.
          </h1>
        </FadeIn>

        {/* Subtitle - More readable */}
        <FadeIn delay={0.5}>
          <TextReveal
            text="Cabinet de conseil en stratégie et organisation."
            className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-10 md:mb-12 font-light justify-center"
            delay={0.3}
          />
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

        {/* Footer Tagline - Future Vision */}
        <FadeIn delay={0.6}>
          <div className="mt-10 md:mt-12 pt-6 border-t border-white/10">
            <div className="relative w-full h-full flex items-center justify-center min-h-[100px] mb-6">
              <TextPressure
                text="Together we @ the future"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                minFontSize={24}
                icons={{
                  "@": "https://img.icons8.com/?id=36871&format=png&size=64"
                }}
              />
            </div>

            {/* Logos Marquee - Trusted By - No Background */}
            {logos && logos.length > 0 && (
              <div className="mt-8 py-8 px-4">
                <p className="text-sm text-white/80 uppercase tracking-widest mb-6 font-medium text-center">
                  Ils nous font confiance
                </p>
                <Marquee>
                  <MarqueeContent speed={30} pauseOnHover>
                    {logos.map((company) => (
                      <MarqueeItem
                        key={company.id}
                        className="mx-6 md:mx-10"
                      >
                        <LogoItem company={company} />
                      </MarqueeItem>
                    ))}
                  </MarqueeContent>
                  <MarqueeFade side="left" className="from-transparent" />
                  <MarqueeFade side="right" className="from-transparent" />
                </Marquee>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
