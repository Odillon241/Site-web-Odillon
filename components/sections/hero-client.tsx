"use client"

import { useState } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { BackgroundSlideshow } from "@/components/ui/background-slideshow"
import { AnimatedSlogan } from "@/components/magicui/animated-slogan"
import { FlipWords } from "@/components/magicui/flip-words"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee"
import Image from "next/image"
import Link from "next/link"
import { CompanyLogo, Video } from "@/types/admin"
import { VideoPlayer } from "@/components/ui/video-player"
import { ArrowRight, Phone } from "lucide-react"
import { GridPattern } from "@/components/ui/grid-pattern"
import { NewsTicker } from "@/components/sections/news-ticker"

interface HeroClientProps {
  images: Array<{ src: string; alt: string }>
  logos: CompanyLogo[]
  video?: Video | null
}

// Composant pour afficher un logo avec fallback
function LogoItem({ company }: { company: CompanyLogo }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="group relative flex items-center justify-center w-20 h-14 sm:w-28 sm:h-18 md:w-36 md:h-22 lg:w-40 lg:h-24 transition-all duration-300">
      {!imageError && company.logo_path ? (
        <div className="relative w-full h-full flex items-center justify-center transition-all duration-300 group-hover:scale-105">
          <Image
            src={company.logo_path}
            alt={`${company.name} logo`}
            width={120}
            height={80}
            sizes="(max-width: 640px) 70px, (max-width: 768px) 100px, 120px"
            className="object-contain max-w-full max-h-full opacity-80 group-hover:opacity-100 transition-opacity"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="text-center w-full group-hover:scale-105 transition-transform">
          <div
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 text-odillon-teal/60 group-hover:text-odillon-teal transition-colors duration-300"
          >
            {company.fallback}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
            {company.name}
          </div>
        </div>
      )}
    </div>
  )
}

export function HeroClient({ images, logos, video }: HeroClientProps) {
  return (
    <section id="accueil" className="relative min-h-[85vh] flex flex-col overflow-hidden bg-gradient-to-br from-white via-gray-50/80 to-[#1A9B8E]/5">
      {/* Subtle grid background pattern */}
      <GridPattern
        width={50}
        height={50}
        className="absolute inset-0 fill-[#1A9B8E]/[0.02] stroke-[#1A9B8E]/[0.04]"
      />
      {/* Fade out grid at edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1A9B8E]/[0.03] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C4D82E]/[0.04] rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />

      {/* News Ticker / Saline */}
      <div className="relative z-10 w-full">
        <NewsTicker className="h-[50px] border-b border-gray-200/50" showControls={true} />
      </div>

      {/* Main Content - Split Layout */}
      <div className="relative z-10 flex-1 flex items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center w-full">

          {/* Left Column - Text Content */}
          <div className="order-1 flex flex-col gap-5 sm:gap-6">
            {/* Main Headline */}
            <FadeIn delay={0.1} direction="up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-odillon-dark leading-[1.1]">
                <span className="font-baskvill">Ingénierie</span>{" "}
                <span className="text-odillon-teal font-baskvill">
                  d&apos;Entreprises
                </span>
              </h1>
              <p className="mt-3 sm:mt-4 font-baskvill text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl text-gray-600">
                <FlipWords
                  words={["Trouvez une solution adaptée", "Respect de nos délais", "Votre succès, notre priorité"]}
                  duration={3500}
                  className="text-odillon-teal"
                />
              </p>
            </FadeIn>

            {/* Subtitle */}
            <FadeIn delay={0.25} direction="up">
              <p className="text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed">
                La Société ODILLON, spécialisée en Ingénierie d&apos;Entreprises, propose des solutions robustes, pertinentes, durables, adaptées aux besoins de nos clients.
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={0.35} direction="up">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#1A9B8E] text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#1A9B8E]/25 hover:bg-[#178578] hover:shadow-xl hover:shadow-[#1A9B8E]/30 transition-all duration-300 group"
                >
                  Découvrir nos services
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border-2 border-odillon-dark/20 text-odillon-dark font-semibold text-sm sm:text-base hover:border-[#1A9B8E] hover:text-[#1A9B8E] hover:bg-[#1A9B8E]/5 transition-all duration-300"
                >
                  <Phone className="w-4 h-4" />
                  Nous contacter
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Right Column - Visual */}
          <div className="order-2">
            <FadeIn delay={0.3} direction="right">
              <div className="relative">
                {/* Decorative frame behind */}
                <div className="absolute -inset-3 bg-gradient-to-br from-[#1A9B8E]/20 via-[#C4D82E]/10 to-[#1A9B8E]/5 rounded-lg blur-sm" />

                {/* Main visual container */}
                <div className="relative rounded-lg overflow-hidden shadow-2xl border border-white/50 ring-1 ring-black/5">
                  {video ? (
                    <VideoPlayer
                      url={video.url}
                      type={video.type}
                      thumbnail={video.thumbnail || undefined}
                      title={video.title}
                      className="w-full aspect-[4/3]"
                      autoplay={false}
                      muted={true}
                      loop={true}
                    />
                  ) : images.length > 0 ? (
                    <div className="relative w-full aspect-[4/3]">
                      <BackgroundSlideshow
                        images={images}
                        interval={6000}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#1A9B8E] to-[#0A1F2C] flex items-center justify-center">
                      <span className="text-white/40 text-lg font-baskvill">Odillon</span>
                    </div>
                  )}
                </div>

                {/* Video presenter info */}
                {video && (video.presenter_name || video.presenter_position) && (
                  <div className="mt-4 text-center">
                    <p className="font-semibold text-odillon-dark text-base md:text-lg">{video.presenter_name}</p>
                    <p className="text-[#1A9B8E] font-medium text-sm uppercase tracking-wide">{video.presenter_position}</p>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Footer Section - Slogan + Logos */}
      <div className="relative z-10 w-full">
        <FadeIn delay={0.6}>
          {/* Slogan band - dark background for contrast with AnimatedSlogan's white text */}
          <div className="w-full bg-odillon-dark/95 py-6 sm:py-8 md:py-10">
            <div className="relative w-full flex items-center justify-center min-h-[60px] sm:min-h-[75px] md:min-h-[90px]">
              <AnimatedSlogan
                text="Together we the future"
                iconPosition={2}
              />
            </div>
          </div>

          {/* Logos Marquee - Glassmorphism */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
            {logos && logos.length > 0 && (
              <div className="mt-6 sm:mt-8 -mx-2 sm:-mx-4 md:-mx-6 lg:-mx-8 backdrop-blur-md bg-white/60 border border-gray-200/80 rounded-lg shadow-lg shadow-black/[0.04] py-5 sm:py-6 md:py-8 px-3 sm:px-4">
                <p className="text-xs sm:text-sm text-odillon-dark/50 uppercase tracking-widest mb-4 sm:mb-6 font-medium text-center -mt-1 sm:-mt-2">
                  Ils nous font confiance
                </p>
                <Marquee>
                  <MarqueeContent speed={30} pauseOnHover>
                    {logos.map((company) => (
                      <MarqueeItem
                        key={company.id}
                        className="mx-3 sm:mx-5 md:mx-8 lg:mx-10"
                      >
                        <LogoItem company={company} />
                      </MarqueeItem>
                    ))}
                  </MarqueeContent>
                  <MarqueeFade side="left" className="from-white/60 !w-6 sm:!w-12 md:!w-24" />
                  <MarqueeFade side="right" className="from-white/60 !w-6 sm:!w-12 md:!w-24" />
                </Marquee>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
