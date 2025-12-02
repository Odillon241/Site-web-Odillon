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

export function Hero() {
  // Plus d'images par défaut - seules les images téléversées via l'admin s'affichent
  const [heroImages, setHeroImages] = useState<Array<{ src: string; alt: string }>>([])

  useEffect(() => {
    // Charger les photos depuis l'API
    const loadPhotos = async () => {
      try {
        const currentMonth = new Date().getMonth() + 1
        
        // Récupérer toutes les photos actives, puis filtrer côté client
        // car l'API ne supporte pas de filtrer par month IS NULL
        const res = await fetch(`/api/photos?active=true`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        
        let allPhotos: any[] = []
        
        if (res.ok) {
          const data = await res.json()
          if (data.photos && Array.isArray(data.photos)) {
            // Filtrer : photos du mois en cours OU photos sans mois spécifique (month = null)
            allPhotos = data.photos.filter((p: any) => 
              p.month === currentMonth || p.month === null || p.month === undefined
            )
          }
        }
        
        // Supprimer les doublons par ID
        const uniquePhotos = Array.from(
          new Map(allPhotos.map((p: any) => [p.id, p])).values()
        )
        
        if (uniquePhotos.length > 0) {
          // Transformer les photos au format attendu
          const images = uniquePhotos
            .filter((photo: any) => {
              // Filtrer les photos qui ont une URL valide
              const photoUrl = photo.url || photo.src
              return photoUrl && typeof photoUrl === 'string' && photoUrl.length > 0
            })
            .sort((a: any, b: any) => {
              // Trier par display_order
              const orderA = a.display_order || 999
              const orderB = b.display_order || 999
              return orderA - orderB
            })
            .map((photo: any) => ({
              src: photo.url || photo.src, // Support des deux formats
              alt: photo.description || photo.alt || 'Photo Odillon'
            }))
          
          if (images.length > 0) {
            console.log(`✅ ${images.length} photo(s) chargée(s) pour le Hero (mois ${currentMonth} + photos annuelles)`)
            setHeroImages(images)
            return
          }
        }
        
        // Si aucune photo trouvée, ne rien afficher (plus d'images par défaut)
        console.log(`ℹ️ Aucune photo active trouvée - Hero sans image d'arrière-plan`)
        setHeroImages([])
      } catch (error) {
        console.error("❌ Erreur lors du chargement des photos:", error)
        // En cas d'erreur, ne rien afficher (plus d'images par défaut)
        setHeroImages([])
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
    <section id="accueil" className="relative min-h-[85vh] sm:min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Photo Background Slideshow - Uniquement si des images sont disponibles */}
      {heroImages.length > 0 && (
        <div className="absolute inset-0 z-0">
          <BackgroundSlideshow
            images={heroImages}
            interval={5000}
          />
          {/* Overlay sombre pour lisibilité - Responsive */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/85 to-gray-900/90 md:from-gray-900/85 md:via-gray-900/80 md:to-gray-900/85 z-[1]" />
        </div>
      )}
      
      {/* Fond de secours si aucune image n'est disponible */}
      {heroImages.length === 0 && (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
      )}

      {/* Dotted Map Background - Gabon (par-dessus les photos) */}
      <div className="absolute inset-0 opacity-10 sm:opacity-15 md:opacity-20 lg:opacity-30 pointer-events-none z-[1]">
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
        className="absolute inset-0 h-full w-full opacity-15 sm:opacity-20 md:opacity-25 lg:opacity-30 z-[2]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 text-white">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
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
              <p className="text-sm sm:text-base md:text-lg text-gray-100 leading-relaxed max-w-2xl">
                Cabinet de conseil en ingénierie d'entreprises spécialisé dans la structuration, 
                la gestion administrative, les relations publiques et le management des risques.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-odillon-teal hover:bg-odillon-teal/90 text-white text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 w-full sm:w-auto group"
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
                  className="border-2 border-odillon-teal text-odillon-teal hover:bg-odillon-teal hover:text-white text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 w-full sm:w-auto"
                >
                  <Link href="#services">Nos services</Link>
                </Button>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.5}>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-6 pt-4 sm:pt-6 md:pt-8 border-t border-white/20" id="gouvernance">
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-odillon-teal">
                    <CountingNumber value={15} suffix="+" duration={2} />
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-200 mt-0.5 sm:mt-1 leading-tight">Années d'expérience</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-odillon-lime">
                    <CountingNumber value={100} suffix="+" duration={2.5} />
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-200 mt-0.5 sm:mt-1 leading-tight">Projets réalisés</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-odillon-teal">
                    <CountingNumber value={50} suffix="+" duration={2.3} />
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-200 mt-0.5 sm:mt-1 leading-tight">Clients satisfaits</div>
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
                    <h3 className="text-sm md:text-base font-semibold text-white drop-shadow-sm mb-1 md:mb-2">Gouvernance</h3>
                    <p className="text-xs md:text-sm text-white drop-shadow-sm">
                      Structuration et mise en place de politiques efficaces
                    </p>
                  </div>
                </motion.div>
              </BlurFade>

              <BlurFade delay={0.3}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="relative overflow-hidden p-4 md:p-6 rounded-xl group sm:mt-4 md:mt-8"
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
                    <h3 className="text-sm md:text-base font-semibold text-white drop-shadow-sm mb-1 md:mb-2">Finances</h3>
                    <p className="text-xs md:text-sm text-white drop-shadow-sm">
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
                    <h3 className="text-sm md:text-base font-semibold text-white drop-shadow-sm mb-1 md:mb-2">RH</h3>
                    <p className="text-xs md:text-sm text-white drop-shadow-sm">
                      Gestion des talents et développement organisationnel
                    </p>
                  </div>
                </motion.div>
              </BlurFade>

              <BlurFade delay={0.5}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="relative overflow-hidden p-4 md:p-6 rounded-xl group sm:mt-4 md:mt-8"
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
                    <h3 className="text-sm md:text-base font-semibold text-white drop-shadow-sm mb-1 md:mb-2">Juridique</h3>
                    <p className="text-xs md:text-sm text-white drop-shadow-sm">
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
          <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 relative">
            <ScrollVelocityContainer className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-bold tracking-[-0.02em] leading-[1.5] sm:leading-[2rem] md:leading-[3rem] lg:leading-[4rem]">
              <ScrollVelocityRow baseVelocity={5} direction={1} className="text-white/70">
                Gouvernance • Finances • Ressources Humaines • Juridique
              </ScrollVelocityRow>
              <ScrollVelocityRow baseVelocity={5} direction={-1} className="text-odillon-lime/60">
                Excellence • Innovation • Expertise • Performance
              </ScrollVelocityRow>
            </ScrollVelocityContainer>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 sm:w-1/3 bg-gradient-to-r from-gray-900/85 to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 sm:w-1/3 bg-gradient-to-l from-gray-900/85 to-transparent"></div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

