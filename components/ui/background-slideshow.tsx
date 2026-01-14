"use client"

import { useState, useEffect } from "react"
import { m, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface BackgroundSlideshowProps {
  images: { src: string; alt: string }[]
  interval?: number
  className?: string
}

export function BackgroundSlideshow({
  images,
  interval = 5000,
  className = ""
}: BackgroundSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Next.js Image component handles preloading automatically
  // No need for manual vanilla preloading which causes double requests
  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  if (images.length === 0) return null

  return (
    <div className={`relative w-full h-full ${className}`}>
      <AnimatePresence mode="wait">
        <m.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={currentIndex === 0}
            quality={75}
            loading={currentIndex === 0 ? "eager" : "lazy"}
          />
        </m.div>
      </AnimatePresence>
    </div>
  )
}

