"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/magicui/fade-in";
import { BackgroundSlideshow } from "@/components/ui/background-slideshow";
import { AnimatedSlogan } from "@/components/magicui/animated-slogan";
import { LogoRotator } from "@/components/ui/logo-rotator";
import Link from "next/link";
import { CompanyLogo, Video } from "@/types/admin";
import { VideoPlayer } from "@/components/ui/video-player";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { GridPattern } from "@/components/ui/grid-pattern";
import { NewsTicker } from "@/components/sections/news-ticker";
import { chiffresCles } from "@/lib/identite";

interface HeroClientProps {
  images: Array<{ src: string; alt: string }>;
  logos: CompanyLogo[];
  video?: Video | null;
}

const DOMAINES = [
  "gouvernance",
  "ressources humaines",
  "conseil juridique",
  "entrepreneuriat",
  "formation",
];

// Titre principal : les domaines défilent sous « Votre partenaire en ».
// Tous les mots occupent la même cellule de grille, donc la largeur ne bouge pas.
function TitreHero() {
  const reduireMouvement = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduireMouvement) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % DOMAINES.length), 2600);
    return () => clearInterval(id);
  }, [reduireMouvement]);

  return (
    <h1 className="font-baskvill text-[2rem] font-bold leading-[1.1] text-odillon-dark sm:text-5xl xl:text-[3.5rem]">
      <span className="sr-only">
        Votre partenaire en gouvernance, ressources humaines, conseil juridique, entrepreneuriat et formation
      </span>
      <span aria-hidden="true">
        Votre partenaire en
        <span className="mt-1 grid italic text-odillon-teal">
          {DOMAINES.map((mot, i) => (
            <m.span
              key={mot}
              className="whitespace-nowrap [grid-area:1/1]"
              initial={false}
              animate={{
                opacity: i === index ? 1 : 0,
                y: i === index ? 0 : i < index ? -14 : 14,
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {mot}
            </m.span>
          ))}
        </span>
      </span>
    </h1>
  );
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

            <FadeIn delay={0.2} direction="up">
              <TitreHero />
            </FadeIn>

            {/* Description */}
            <FadeIn delay={0.37} direction="up">
              <div className="max-w-xl space-y-3 text-[0.925rem] leading-[1.82] text-slate-600 sm:text-base">
                <p>
                  <strong className="font-semibold text-odillon-dark">Fondée en mai 2017,</strong>{" "}
                  ODILLON accompagne les entreprises dans leurs projets de restructuration, les assiste en matière juridique, de structuration organisationnelle, d’accompagnement dans leur développement et dans l’optimisation de la performance.
                </p>
                <p>
                  Nous concevons et déployons des solutions fiables, innovantes et durables sur mesure, adaptées à vos réalités et à vos besoins spécifiques.
                </p>
              </div>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={0.52} direction="up">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/rendez-vous"
                  className="group inline-flex items-center justify-center gap-2 rounded-md bg-odillon-teal px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-odillon-teal/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-odillon-teal/90 hover:shadow-md hover:shadow-odillon-teal/20 sm:text-base"
                >
                  <CalendarCheck className="w-4 h-4" aria-hidden="true" />
                  Prendre rendez-vous
                </Link>
                <Link
                  href="/produits"
                  className="group inline-flex items-center justify-center gap-2 rounded-md border border-odillon-dark/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-odillon-dark transition-all duration-300 hover:-translate-y-0.5 hover:border-odillon-teal/40 hover:text-odillon-teal sm:text-base"
                >
                  Découvrir nos produits
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
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
              <AnimatedSlogan text="Together we the future." iconPosition={2} />
            </div>
          </div>

          {/* Logos Carousel - Glassmorphism */}
          <div className="od-container pb-8 sm:pb-12">
            {/* Repères du livret d'accueil (§2.1) */}
            <dl className="mt-8 grid divide-y divide-odillon-teal/10 sm:mt-10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {chiffresCles.map(({ valeur, legende }) => (
                // flex-col-reverse : le chiffre s'affiche au-dessus de sa légende.
                <div key={valeur} className="flex flex-col-reverse items-center gap-1 px-4 py-4 text-center sm:py-2">
                  <dt className="text-sm text-gray-600">{legende}</dt>
                  <dd className="font-baskvill text-3xl font-bold italic text-odillon-teal md:text-4xl">{valeur}</dd>
                </div>
              ))}
            </dl>

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
