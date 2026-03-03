"use client";

import { m } from "framer-motion";
import { Camera, Aperture, Film, Focus, ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/magicui/fade-in";

interface HeroSectionProps {
  children?: React.ReactNode;
}

function FloatingElement({
  children,
  delay = 0,
  duration = 6,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: [0, 0.6, 0.6, 0],
        y: [20, -10, -20, -30],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeInOut",
      }}
    >
      {children}
    </m.div>
  );
}

export function HeroSection({ children }: HeroSectionProps) {
  return (
    <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* ── Aurora gradient background ── */}
      <div className="absolute inset-0 -z-10">
        {/* Primary aurora blob */}
        <m.div
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(57,131,122,0.12) 0%, rgba(57,131,122,0.04) 40%, transparent 70%)",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.05, 0.97, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Secondary aurora blob */}
        <m.div
          className="absolute bottom-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(196,216,46,0.1) 0%, rgba(196,216,46,0.03) 45%, transparent 70%)",
          }}
          animate={{
            x: [0, -25, 20, 0],
            y: [0, 20, -15, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Tertiary accent blob - center */}
        <m.div
          className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(57,131,122,0.06) 0%, transparent 60%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Geometric grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(57,131,122,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(57,131,122,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Radial dot pattern - subtle */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #39837a 0.8px, transparent 0.8px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top gradient fade */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />
      </div>

      {/* ── Floating decorative elements ── */}
      <div className="absolute inset-0 -z-5 pointer-events-none" aria-hidden="true">
        <FloatingElement
          delay={0}
          duration={7}
          className="absolute top-[15%] left-[8%] text-odillon-teal/20"
        >
          <Aperture className="w-8 h-8" strokeWidth={1} />
        </FloatingElement>

        <FloatingElement
          delay={2}
          duration={8}
          className="absolute top-[25%] right-[12%] text-odillon-lime/25"
        >
          <Film className="w-6 h-6" strokeWidth={1} />
        </FloatingElement>

        <FloatingElement
          delay={4}
          duration={6}
          className="absolute bottom-[30%] left-[15%] text-odillon-teal/15"
        >
          <Focus className="w-7 h-7" strokeWidth={1} />
        </FloatingElement>

        <FloatingElement
          delay={1}
          duration={9}
          className="absolute bottom-[25%] right-[8%] text-odillon-lime/20"
        >
          <Camera className="w-5 h-5" strokeWidth={1} />
        </FloatingElement>

        {/* Geometric shapes */}
        <m.div
          className="absolute top-[20%] right-[25%] w-16 h-16 border border-odillon-teal/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <m.div
          className="absolute bottom-[35%] left-[22%] w-10 h-10 border border-odillon-lime/10 rounded-lg"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />

        {/* Diagonal line accents */}
        <m.div
          className="absolute top-[40%] left-[5%] w-24 h-[1px] bg-gradient-to-r from-transparent via-odillon-teal/15 to-transparent"
          style={{ transform: "rotate(-30deg)" }}
          animate={{ opacity: [0, 0.5, 0], x: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <m.div
          className="absolute top-[30%] right-[5%] w-20 h-[1px] bg-gradient-to-r from-transparent via-odillon-lime/15 to-transparent"
          style={{ transform: "rotate(25deg)" }}
          animate={{ opacity: [0, 0.4, 0], x: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            {/* Badge */}
            <m.div
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-odillon-teal/8 border border-odillon-teal/15 backdrop-blur-sm mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-odillon-teal/60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-odillon-teal" />
              </span>
              <span className="text-xs font-semibold text-odillon-teal tracking-widest uppercase">
                Photothèque
              </span>
            </m.div>

            {/* Title */}
            <h1 className="font-baskvill text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] tracking-tight text-gray-900 mb-8 leading-[1.05]">
              Revivez nos{" "}
              <span className="relative inline-block">
                <span className="text-odillon-teal">moments</span>
                <m.span
                  className="absolute -bottom-1.5 left-0 w-full h-[3px] rounded-full origin-left"
                  style={{
                    background: "linear-gradient(90deg, #39837a, #C4D82E)",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
              <br className="hidden sm:block" />
              <span className="relative inline-block mt-1 sm:mt-2">
                <span className="text-odillon-teal">forts</span>
                <m.span
                  className="absolute -bottom-1.5 left-0 w-full h-[3px] rounded-full origin-left"
                  style={{
                    background: "linear-gradient(90deg, #C4D82E, #39837a)",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-4">
              {"Une collection d'instants capturés lors de nos événements, séminaires et activités. Plongez au cœur de la vie de notre communauté."}
            </p>

          </FadeIn>

          {/* Filter slot */}
          {children}
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <m.span
          className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          Découvrir
        </m.span>
        <m.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: [0, 0.7, 0.7, 0], y: [-5, 4, 8, 12] }}
          transition={{
            duration: 2,
            delay: 1.8,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-5 h-5 text-odillon-teal/60" strokeWidth={1.5} />
        </m.div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
