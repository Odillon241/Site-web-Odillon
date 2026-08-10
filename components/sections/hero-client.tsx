"use client";

import { FadeIn } from "@/components/magicui/fade-in";
import { BackgroundSlideshow } from "@/components/ui/background-slideshow";
import { AnimatedSlogan } from "@/components/magicui/animated-slogan";
import { LogoRotator } from "@/components/ui/logo-rotator";
import Link from "next/link";
import { CompanyLogo, Video } from "@/types/admin";
import { VideoPlayer } from "@/components/ui/video-player";
import { ArrowRight, Phone } from "lucide-react";
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
      {/* Modern architectural background */}
      <div className="pointer-events-none absolute inset-0 bg-[#f7fafc]" />
      <GridPattern
        width={64}
        height={64}
        x={-20}
        y={-20}
        className="absolute inset-0 fill-[#00a795]/[0.025] stroke-[#00a795]/[0.11] [mask-image:linear-gradient(to_bottom,black_5%,black_72%,transparent_100%)]"
      />
      <div className="pointer-events-none absolute -right-40 top-16 h-[34rem] w-[34rem] rounded-full border border-odillon-teal/10 bg-[radial-gradient(circle_at_center,rgba(0,167,149,0.10),rgba(0,167,149,0.025)_42%,transparent_68%)]" />
      <div className="pointer-events-none absolute -right-20 top-36 h-[24rem] w-[24rem] rounded-full border border-odillon-lime/15" />
      <div className="pointer-events-none absolute -left-36 bottom-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(196,216,46,0.12),transparent_68%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.18)_48%,rgba(255,255,255,0.72)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

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

            {/* Description */}
            <FadeIn delay={0.37} direction="up">
              <p className="max-w-xl text-[0.925rem] leading-[1.82] text-slate-600 sm:text-base">
                <strong className="font-semibold text-odillon-dark">Fondée en 2017,</strong>{" "}
                ODILLON accompagne les entreprises dans leurs projets de conseil, d&apos;ingénierie organisationnelle et d&apos;optimisation de la performance. Nous concevons et déployons des solutions fiables, innovantes et durables, adaptées aux réalités et aux ambitions de chaque organisation.
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={0.52} direction="up">
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
                      <BackgroundSlideshow
                        images={images}
                        interval={6000}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
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
