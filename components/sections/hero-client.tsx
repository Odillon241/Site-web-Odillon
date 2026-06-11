"use client";

import { FadeIn } from "@/components/magicui/fade-in";
import { BackgroundSlideshow } from "@/components/ui/background-slideshow";
import { AnimatedSlogan } from "@/components/magicui/animated-slogan";
import { LogoRotator } from "@/components/ui/logo-rotator";
import Link from "next/link";
import { CompanyLogo, Video } from "@/types/admin";
import { VideoPlayer } from "@/components/ui/video-player";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { GridPattern } from "@/components/ui/grid-pattern";
import { NewsTicker } from "@/components/sections/news-ticker";

interface HeroClientProps {
  images: Array<{ src: string; alt: string }>;
  logos: CompanyLogo[];
  video?: Video | null;
}





export function HeroClient({ images, logos, video }: HeroClientProps) {
  return (
    <section
      id="accueil"
      className="od-page relative flex min-h-[85vh] flex-col overflow-hidden"
    >
      {/* Subtle grid background pattern */}
      <GridPattern
        width={50}
        height={50}
        className="absolute inset-0 fill-[#00a795]/[0.015] stroke-[#00a795]/[0.03]"
      />
      {/* Fade out grid at edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

      {/* Subtle background illustration */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat opacity-[0.045] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: 'url("/images/hero-bg-subtle.png")' }}
      />

      {/* News Ticker / Saline */}
      <div className="relative z-10 w-full">
        <NewsTicker
          className="h-[50px] border-b border-gray-200/50"
          showControls={true}
        />
      </div>

      {/* Main Content - Split Layout */}
      <div className="od-container relative z-10 flex flex-1 items-center py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center w-full">
          {/* Left Column - Text Content */}
          <div className="order-1 flex max-w-2xl flex-col gap-5 sm:gap-6">
            {/* Main Headline */}
            <FadeIn delay={0.1} direction="up">
              <h1 className="max-w-2xl font-baskvill text-[1.2rem] font-semibold italic leading-[1.12] tracking-normal text-odillon-dark min-[380px]:text-[1.38rem] sm:text-[1.85rem] lg:text-[2.2rem]">
                <span className="block whitespace-nowrap">Odillon vous accompagne</span>
                <span className="mt-1.5 block whitespace-nowrap text-slate-700">
                  en Afrique francophone
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg font-semibold text-slate-700 sm:text-xl md:text-2xl">
                Stratégies robustes et durables
              </p>
            </FadeIn>

            {/* Subtitle */}
            <FadeIn delay={0.25} direction="up">
              <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Fondée en mai 2017, ODILLON accompagne les entreprises dans leurs projets de conseil, d’ingénierie organisationnelle et d’optimisation de la performance. Nous concevons et déployons des solutions fiables, innovantes et durables, adaptées aux réalités, aux enjeux et aux ambitions de chaque organisation.
              </p>
            </FadeIn>



            {/* CTA Buttons */}
            <FadeIn delay={0.4} direction="up">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="#apropos"
                  className="group inline-flex items-center justify-center gap-2 rounded-md bg-odillon-teal px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-odillon-teal/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-odillon-teal/90 hover:shadow-md hover:shadow-odillon-teal/20 sm:text-base"
                >
                  Découvrir notre approche
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-odillon-dark/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-odillon-dark shadow-sm shadow-odillon-dark/[0.03] transition-all duration-300 hover:-translate-y-0.5 hover:border-odillon-teal/40 hover:bg-odillon-teal/5 hover:text-odillon-teal sm:text-base"
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
                <div className="od-surface absolute -left-4 top-6 z-20 hidden max-w-[210px] p-4 lg:block">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#00a795]">
                    <MapPin className="h-4 w-4" />
                    Proximité
                  </div>
                  <p className="text-sm font-semibold leading-snug text-odillon-dark">
                    Basés à Libreville, nous accompagnons vos enjeux avec une
                    lecture locale et opérationnelle.
                  </p>
                </div>

                {/* Decorative frame behind */}
                <div className="absolute -inset-3 rounded-xl bg-gradient-to-br from-[#00a795]/15 via-[#C4D82E]/10 to-transparent" />

                {/* Main visual container */}
                <div className="od-surface relative overflow-hidden">
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
                      <BackgroundSlideshow images={images} interval={6000} />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#00a795] to-[#0A1F2C] flex items-center justify-center">
                      <span className="text-white/40 text-lg font-baskvill italic">
                        Odillon
                      </span>
                    </div>
                  )}
                </div>

                {/* Video presenter info */}
                {video &&
                  (video.presenter_name || video.presenter_position) && (
                    <div className="mt-4 text-center">
                      <p className="font-semibold text-odillon-dark text-base md:text-lg">
                        {video.presenter_name}
                      </p>
                      <p className="text-[#00a795] font-medium text-sm uppercase tracking-wide">
                        {video.presenter_position}
                      </p>
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
          {/* Slogan band - dark background with decorative pattern */}
          <div className="relative w-full overflow-hidden bg-odillon-dark py-6 sm:py-8 md:py-10">
            {/* Dot grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(26,155,142,0.8) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 w-full flex items-center justify-center min-h-[60px] sm:min-h-[75px] md:min-h-[90px]">
              <AnimatedSlogan text="Together we the future" iconPosition={2} />
            </div>
          </div>

          {/* Logos Carousel - Glassmorphism */}
          <div className="od-container pb-8 sm:pb-12">
            {logos && logos.length > 0 && (
              <div className="od-surface mt-6 px-3 py-5 sm:mt-8 sm:px-4 sm:py-6 md:py-8">
                <p className="text-xs sm:text-sm text-odillon-dark/50 uppercase tracking-widest mb-4 sm:mb-6 font-medium text-center -mt-1 sm:-mt-2">
                  Ils nous font confiance
                </p>
                <LogoRotator logos={logos} interval={3000} />
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
