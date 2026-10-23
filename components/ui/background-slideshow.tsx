"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface BackgroundSlideshowProps {
  images: { src: string; alt: string }[]
  interval?: number
  className?: string
  /** Largeur de rendu réelle du conteneur, transmise à next/image */
  sizes?: string
}

/**
 * Fondu enchaîné : les photos sont superposées et seule l'opacité change, la
 * nouvelle apparaît donc par-dessus l'ancienne sans passage par le blanc. Seules
 * la photo affichée, la précédente (qui s'efface) et la suivante (préchargée)
 * sont dans le DOM.
 */
export function BackgroundSlideshow({
  images: rawImages,
  interval = 5000,
  className = "",
  sizes = "100vw"
}: BackgroundSlideshowProps) {
  // Filter out images with empty or missing src
  const images = rawImages.filter(img => img.src && img.src.trim() !== '')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  if (images.length === 0) return null

  const total = images.length
  const precedent = (currentIndex - 1 + total) % total
  const suivant = (currentIndex + 1) % total

  return (
    // Fond de marque visible le temps que la première photo arrive.
    <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#00a795]/25 via-[#f7fafc] to-[#C4D82E]/20 ${className}`}>
      {images.map((image, i) => {
        if (i !== currentIndex && i !== precedent && i !== suivant) return null
        return (
          <div
            key={`${i}-${image.src}`}
            aria-hidden={i !== currentIndex}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none ${i === currentIndex ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={image.src}
              alt={i === currentIndex ? image.alt : ""}
              fill
              className="object-cover"
              sizes={sizes}
              priority={i === 0}
              quality={75}
            />
          </div>
        )
      })}
    </div>
  )
}
