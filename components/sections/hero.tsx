"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { ArrowRight, Shield, TrendingUp, Users, Award } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { GridPattern } from "@/components/ui/grid-pattern"
import { CountingNumber } from "@/components/ui/counting-number"
import { HighlightText } from "@/components/ui/highlight-text"
import { TextShimmer } from "@/components/ui/text-shimmer"
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/magicui/scroll-based-velocity"
import { DottedMap } from "@/components/ui/dotted-map"
import { BackgroundSlideshow } from "@/components/ui/background-slideshow"

// Images par défaut au cas où l'API échoue ou n'a pas encore de photos
const DEFAULT_IMAGES = [
  { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&q=85", alt: "Équipe professionnelle africaine en réunion" },
  { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=85", alt: "Professionnels africains collaborant" },
  { src: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1920&q=85", alt: "Homme d'affaires africain confiant" },
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=85", alt: "Équipe diverse en réunion stratégique" },
  { src: "https://images.unsplash.com/photo-1600878459550-1cf6f36c5f66?w=1920&q=85", alt: "Femme d'affaires africaine leader" },
  { src: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1920&q=85", alt: "Équipe professionnelle au bureau moderne" },
  { src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=85", alt: "Professionnelle africaine au travail" },
  { src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=85", alt: "Équipe collaborative au bureau" }
]

export function Hero() {
  const [heroImages, setHeroImages] = useState<Array<{ src: string; alt: string }>>(DEFAULT_IMAGES)

  useEffect(() => {
    // Charger les photos depuis l'API
    const loadPhotos = async () => {
      try {
        const currentMonth = new Date().getMonth() + 1
        const res = await fetch(`/api/photos?month=${currentMonth}&active=true`, {
          cache: 'no-store' // Toujours récupérer les dernières données
        })
        
        if (res.ok) {
          const data = await res.json()
          
          if (data.photos && data.photos.length > 0) {
            // Transformer les photos de l'API au format attendu
            const images = data.photos.map((photo: any) => ({
              src: photo.url,
              alt: photo.description
            }))
            setHeroImages(images)
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des photos:", error)
        // Garder les images par défaut en cas d'erreur
      }
    }

    // Charger immédiatement au montage
    loadPhotos()

    // Recharger automatiquement toutes les 30 secondes pour détecter les nouvelles photos
    const interval = setInterval(loadPhotos, 30000)

    // Nettoyer l'interval au démontage
    return () => clearInterval(interval)
  }, [])
  return (
    <section id="accueil" className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Photo Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <BackgroundSlideshow
          images={heroImages}
          interval={5000}
        />
        {/* Overlay sombre pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/85 via-gray-900/80 to-gray-900/85 z-[1]" />
      </div>

      {/* Dotted Map Background - Gabon (par-dessus les photos) */}
      <div className="absolute inset-0 opacity-20 md:opacity-30 pointer-events-none z-[1]">
        <DottedMap
          width={1200}
          height={900}
          mapSamples={15000}
          markers={[
            {
              lat: 0.8037,
              lng: 11.6094,
              size: 8,
            },
          ]}
          markerColor="#C4D82E"
          dotColor="#1A9B8E"
          dotRadius={0.6}
          className="w-full h-full"
        />
      </div>

      {/* Animated Grid Background - En Arrière-Plan */}
      <GridPattern
        width={60}
        height={60}
        x={-1}
        y={-1}
        squares={[
          [4, 4],
          [8, 8],
          [12, 4],
          [16, 8],
          [6, 10],
          [10, 6],
          [14, 10],
          [3, 6],
          [18, 4],
        ]}
        className="absolute inset-0 h-full w-full opacity-30 z-[2]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 text-white">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <FadeIn delay={0.1}>
              <div className="inline-block">
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium text-white backdrop-blur-sm">
                  <Award className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  <TextShimmer className="text-xs md:text-sm text-white">Excellence en Ingénierie d'Entreprises</TextShimmer>
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                Structurez votre{" "}
                <HighlightText className="text-odillon-teal" delay={0.5}>
                  entreprise
                </HighlightText>{" "}
                pour la{" "}
                <HighlightText className="text-odillon-lime" highlightClassName="bg-odillon-lime/20" delay={0.8}>
                  réussite
                </HighlightText>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-base md:text-lg text-gray-100 leading-relaxed max-w-2xl">
                Cabinet de conseil en ingénierie d'entreprises spécialisé dans la structuration, 
                la gestion administrative, les relations publiques et le management des risques.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-odillon-teal hover:bg-odillon-teal/90 text-white text-base md:text-lg px-6 md:px-8 py-5 md:py-6 group"
                >
                  <Link href="#contact">
                    Démarrer un projet
                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-odillon-teal text-odillon-teal hover:bg-odillon-teal hover:text-white text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
                >
                  <Link href="#services">Nos services</Link>
                </Button>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.5}>
              <div className="grid grid-cols-3 gap-3 md:gap-6 pt-6 md:pt-8 border-t border-white/20" id="gouvernance">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-odillon-teal">
                    <CountingNumber value={15} suffix="+" duration={2} />
                  </div>
                  <div className="text-xs md:text-sm text-gray-200 mt-1">Années d'expérience</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-odillon-lime">
                    <CountingNumber value={100} suffix="+" duration={2.5} />
                  </div>
                  <div className="text-xs md:text-sm text-gray-200 mt-1">Projets réalisés</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-odillon-teal">
                    <CountingNumber value={50} suffix="+" duration={2.3} />
                  </div>
                  <div className="text-xs md:text-sm text-gray-200 mt-1">Clients satisfaits</div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative mt-8 lg:mt-0" id="services">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <BlurFade delay={0.2}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="relative overflow-hidden p-4 md:p-6 rounded-xl group"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 2px 8px 0 rgba(255, 255, 255, 0.25)',
                  }}
                >
                  {/* Glass shine effect - diagonal highlight */}
                  <div 
                    className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
                    }}
                  />
                  
                  {/* Top light reflection */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1/3 opacity-30"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)'
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-odillon-teal/10 rounded-sm flex items-center justify-center mb-3 md:mb-4">
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-odillon-teal" />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 drop-shadow-sm mb-1 md:mb-2">Gouvernance</h3>
                    <p className="text-xs md:text-sm text-gray-800 drop-shadow-sm">
                      Structuration et mise en place de politiques efficaces
                    </p>
                  </div>
                </motion.div>
              </BlurFade>

              <BlurFade delay={0.3}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="relative overflow-hidden p-4 md:p-6 rounded-xl group mt-4 md:mt-8"
                  id="conseil"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 2px 8px 0 rgba(255, 255, 255, 0.25)',
                  }}
                >
                  {/* Glass shine effect - diagonal highlight */}
                  <div 
                    className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
                    }}
                  />
                  
                  {/* Top light reflection */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1/3 opacity-30"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)'
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-odillon-lime/10 rounded-sm flex items-center justify-center mb-3 md:mb-4">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-odillon-lime" />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 drop-shadow-sm mb-1 md:mb-2">Finances</h3>
                    <p className="text-xs md:text-sm text-gray-800 drop-shadow-sm">
                      Conseil financier et levée de fonds stratégique
                    </p>
                  </div>
                </motion.div>
              </BlurFade>

              <BlurFade delay={0.4}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="relative overflow-hidden p-4 md:p-6 rounded-xl group"
                  id="administration"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 2px 8px 0 rgba(255, 255, 255, 0.25)',
                  }}
                >
                  {/* Glass shine effect - diagonal highlight */}
                  <div 
                    className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
                    }}
                  />
                  
                  {/* Top light reflection */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1/3 opacity-30"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)'
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-odillon-teal/10 rounded-sm flex items-center justify-center mb-3 md:mb-4">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-odillon-teal" />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 drop-shadow-sm mb-1 md:mb-2">RH</h3>
                    <p className="text-xs md:text-sm text-gray-800 drop-shadow-sm">
                      Gestion des talents et développement organisationnel
                    </p>
                  </div>
                </motion.div>
              </BlurFade>

              <BlurFade delay={0.5}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="relative overflow-hidden p-4 md:p-6 rounded-xl group mt-4 md:mt-8"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 2px 8px 0 rgba(255, 255, 255, 0.25)',
                  }}
                >
                  {/* Glass shine effect - diagonal highlight */}
                  <div 
                    className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
                    }}
                  />
                  
                  {/* Top light reflection */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1/3 opacity-30"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)'
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-odillon-lime/10 rounded-sm flex items-center justify-center mb-3 md:mb-4">
                      <Award className="w-5 h-5 md:w-6 md:h-6 text-odillon-lime" />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 drop-shadow-sm mb-1 md:mb-2">Juridique</h3>
                    <p className="text-xs md:text-sm text-gray-800 drop-shadow-sm">
                      Accompagnement juridique et contractuel complet
                    </p>
                  </div>
                </motion.div>
              </BlurFade>
            </div>
          </div>
        </div>

        {/* Scroll Velocity Section */}
        <FadeIn delay={0.6}>
          <div className="mt-12 md:mt-16 lg:mt-20 relative">
            <ScrollVelocityContainer className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-[-0.02em] md:leading-[4rem]">
              <ScrollVelocityRow baseVelocity={5} direction={1} className="text-white/70">
                Gouvernance • Finances • Ressources Humaines • Juridique
              </ScrollVelocityRow>
              <ScrollVelocityRow baseVelocity={5} direction={-1} className="text-odillon-lime/60">
                Excellence • Innovation • Expertise • Performance
              </ScrollVelocityRow>
            </ScrollVelocityContainer>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-900/85 to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-gray-900/85 to-transparent"></div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

