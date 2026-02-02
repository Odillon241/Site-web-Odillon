"use client"

import { useState } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { BackgroundSlideshow } from "@/components/ui/background-slideshow"
import { AnimatedSlogan } from "@/components/magicui/animated-slogan"
import { FlipWords } from "@/components/magicui/flip-words"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee"
import Image from "next/image"
import { CompanyLogo, Video } from "@/types/admin"
import { VideoPlayer } from "@/components/ui/video-player"

interface HeroClientProps {
  images: Array<{ src: string; alt: string }>
  logos: CompanyLogo[]
  video?: Video | null
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

export function HeroClient({ images, logos, video }: HeroClientProps) {
  return (
    <section id="accueil" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-transparent">
      {/* Background Layer */}
      {images.length > 0 ? (
        <div className="absolute inset-0 z-0">
          <BackgroundSlideshow
            images={images}
            interval={6000}
          />
          {/* Enhanced Overlay for text readability - darker/more premium */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65 z-[1]" />
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px] z-[1]" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-gray-800" />
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">

        {/* Main Headline - With FlipWords */}
        <FadeIn delay={0.2}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-12 md:mb-16 font-petrov-sans drop-shadow-lg">
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


        {/* Hero Video - Displayed prominently if available */}
        {video && (
          <FadeIn delay={0.4}>
            <div className="mx-auto max-w-5xl">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 backdrop-blur-sm bg-black/20">
                <VideoPlayer
                  url={video.url}
                  type={video.type}
                  thumbnail={video.thumbnail || undefined}
                  title={video.title}
                  className="w-full aspect-video"
                  autoplay={false}
                  muted={true}
                  loop={true}
                />
              </div>
              {(video.presenter_name || video.presenter_position) && (
                <div className="mt-4 text-center">
                  <p className="font-semibold text-white text-base md:text-lg">{video.presenter_name}</p>
                  <p className="text-odillon-lime font-medium text-sm uppercase tracking-wide">{video.presenter_position}</p>
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* Footer Tagline - Future Vision */}
        <FadeIn delay={0.5}>
          <div className="mt-14 md:mt-16 pt-8 border-t border-white/15">
            <div className="relative w-full flex items-center justify-center min-h-[90px] mb-8">
              <AnimatedSlogan
                text="Together we the future"
                iconPosition={2}
              />
            </div>

            {/* Logos Marquee - Trusted By - White Background */}
            {logos && logos.length > 0 && (
              <div className="mt-8 -mx-4 sm:-mx-6 lg:-mx-8 bg-white rounded-2xl shadow-lg py-8 px-4 border border-odillon-teal/30">
                <p className="text-sm text-odillon-dark/70 uppercase tracking-widest mb-6 font-medium text-center -mt-2">
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
                  <MarqueeFade side="left" className="from-white" />
                  <MarqueeFade side="right" className="from-white" />
                </Marquee>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
