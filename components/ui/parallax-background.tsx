"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useScroll, useTransform, m } from "framer-motion"

interface ParallaxBackgroundProps {
  images: Array<{
    url: string
    alt: string
  }>
  speed?: number
  className?: string
}

export function ParallaxBackground({ 
  images, 
  speed = 0.3,
  className = "" 
}: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [nextImageIndex, setNextImageIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Utiliser useScroll de Framer Motion pour une meilleure performance
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Transformer le scroll progress en valeur de translation fluide
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -300 * speed],
    { clamp: false }
  )

  // Rotation des images si plusieurs sont disponibles

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setIsTransitioning(true)
        setNextImageIndex((currentImageIndex + 1) % images.length)
        
        // Après la transition, changer l'image actuelle
        setTimeout(() => {
          setCurrentImageIndex((prev) => (prev + 1) % images.length)
          setIsTransitioning(false)
        }, 1000) // Durée de la transition
      }, 6000) // Change d'image toutes les 6 secondes

      return () => clearInterval(interval)
    }
  }, [images.length, currentImageIndex])

  if (!images || images.length === 0) {
    return null
  }

  const currentImage = images[currentImageIndex]
  const nextImage = images[nextImageIndex]

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Image actuelle avec m.div pour une animation fluide */}
      <m.div
        className="absolute inset-0"
        style={{
          y,
          opacity: isTransitioning ? 0 : 1,
        }}
        transition={{
          opacity: { duration: 1, ease: "easeInOut" }
        }}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt}
          fill
          className="object-cover"
          priority
          quality={90}
          sizes="100vw"
          style={{
            objectPosition: "center",
          }}
        />
        {/* Overlay léger pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
      </m.div>
      
      {/* Image suivante pour transition en fondu (si plusieurs images) */}
      {images.length > 1 && (
        <m.div
          className="absolute inset-0"
          style={{
            y,
            opacity: isTransitioning ? 1 : 0,
          }}
          transition={{
            opacity: { duration: 1, ease: "easeInOut" }
          }}
          key={`next-${nextImageIndex}`}
        >
          <Image
            src={nextImage.url}
            alt={nextImage.alt}
            fill
            className="object-cover"
            quality={90}
            sizes="100vw"
            style={{
              objectPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
        </m.div>
      )}
    </div>
  )
}
