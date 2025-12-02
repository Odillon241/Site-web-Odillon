"use client"

import { useState } from "react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Fonction pour obtenir le chemin du logo (essaie .webp puis .png puis .jpg)
function getLogoPath(basePath: string): string[] {
  const base = basePath.replace(/\.(webp|png|jpg|jpeg)$/i, '')
  return [`${base}.webp`, `${base}.png`, `${base}.jpg`, `${base}.jpeg`]
}

// Composant pour afficher un logo avec fallback
function LogoItem({ company }: { company: { name: string; logo: string; fallback: string; color: string } }) {
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const logoPaths = getLogoPath(company.logo)
  
  const handleImageError = () => {
    if (currentImageIndex < logoPaths.length - 1) {
      // Essayer le format suivant
      setCurrentImageIndex(currentImageIndex + 1)
      setImageLoaded(false)
    } else {
      // Tous les formats ont échoué, afficher le fallback
      setImageError(true)
    }
  }
  
  const handleImageLoad = () => {
    setImageLoaded(true)
  }
  
  return (
    <div className="flex items-center justify-center w-32 h-24 md:w-40 md:h-28 transition-all duration-300 hover:scale-105 group">
      {!imageError ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={logoPaths[currentImageIndex]}
            alt={`${company.name} logo`}
            width={120}
            height={80}
            className={`object-contain max-w-full max-h-full transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            unoptimized
            priority={currentImageIndex === 0} // Priorité pour les WebP
          />
        </div>
      ) : (
        <div className="text-center w-full">
          <div 
            className="text-2xl md:text-3xl font-bold mb-1 transition-colors duration-300"
            style={{ color: company.color }}
          >
            {company.fallback}
          </div>
          <div className="text-xs md:text-sm text-gray-600 font-medium group-hover:text-odillon-teal transition-colors">
            {company.name}
          </div>
        </div>
      )}
    </div>
  )
}

// Logos d'entreprises gabonaises
const trustedCompanies = [
  { 
    name: "CDC", 
    fullName: "Caisse des Dépôts et Consignations",
    logo: "/images/logos/cdc.webp",
    fallback: "CDC",
    color: "#1A9B8E" 
  },
  { 
    name: "CAISTAB", 
    fullName: "Caisse de Stabilisation",
    logo: "/images/logos/caistab.webp",
    fallback: "CAISTAB",
    color: "#C4D82E" 
  },
  { 
    name: "SEEG", 
    fullName: "Société d'Énergie et d'Eau du Gabon",
    logo: "/images/logos/seeg.webp",
    fallback: "SEEG",
    color: "#1A9B8E" 
  },
  { 
    name: "UBA", 
    fullName: "United Bank for Africa",
    logo: "/images/logos/uba.webp",
    fallback: "UBA",
    color: "#C4D82E" 
  },
  { 
    name: "SEM", 
    fullName: "Société d'Economie Mixte",
    logo: "/images/logos/sem.webp",
    fallback: "SEM",
    color: "#1A9B8E" 
  },
  { 
    name: "EDG", 
    fullName: "Energie du Gabon",
    logo: "/images/logos/edg.webp",
    fallback: "EDG",
    color: "#C4D82E" 
  },
  { 
    name: "ANAC", 
    fullName: "Agence Nationale de l'Aviation Civile",
    logo: "/images/logos/anac.webp",
    fallback: "ANAC",
    color: "#1A9B8E" 
  },
  { 
    name: "Gabon Télécom", 
    fullName: "Gabon Télécom",
    logo: "/images/logos/gabon-telecom.webp",
    fallback: "GT",
    color: "#C4D82E" 
  },
  { 
    name: "HPG", 
    fullName: "Hôpital Privé de Libreville",
    logo: "/images/logos/hpg.webp",
    fallback: "HPG",
    color: "#1A9B8E" 
  },
  { 
    name: "Trésor", 
    fullName: "Direction Générale du Trésor",
    logo: "/images/logos/tresor.webp",
    fallback: "TRÉSOR",
    color: "#C4D82E" 
  },
  { 
    name: "SGS", 
    fullName: "SGS Gabon",
    logo: "/images/logos/sgs.webp",
    fallback: "SGS",
    color: "#1A9B8E" 
  }
]

export function TrustedByHome() {
  return (
    <section className="relative py-12 md:py-20 lg:py-24 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #1A9B8E 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <BlurFade delay={0.2}>
          <div className="text-center mb-8 md:mb-12">
            <Badge 
              variant="outline" 
              className="text-xs md:text-sm px-3 md:px-4 py-1 md:py-1.5 border-odillon-teal/30 text-odillon-teal font-medium mb-4"
            >
              Nos Références
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Ils nous font{" "}
              <span className="bg-gradient-to-r from-[#1A9B8E] to-[#C4D82E] bg-clip-text text-transparent">
                Confiance
              </span>
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Des entreprises de toutes tailles nous font confiance pour leurs besoins en gouvernance et conseil
            </p>
          </div>
        </BlurFade>

        {/* Logos Marquee */}
        <BlurFade delay={0.4}>
          <div className="mb-8">
            <Marquee>
              <MarqueeContent speed={30} pauseOnHover>
                {trustedCompanies.map((company) => (
                  <MarqueeItem 
                    key={company.name}
                    className="mx-3 md:mx-4"
                  >
                    <LogoItem company={company} />
                  </MarqueeItem>
                ))}
              </MarqueeContent>
              <MarqueeFade side="left" />
              <MarqueeFade side="right" />
            </Marquee>
          </div>
        </BlurFade>

        {/* Bottom Message */}
        <BlurFade delay={0.6}>
          <div className="text-center">
            <p className="text-sm md:text-base text-gray-600">
              Des <span className="font-semibold text-odillon-teal">entreprises leaders</span> nous font confiance pour transformer leur gouvernance
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

