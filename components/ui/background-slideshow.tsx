"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 1.5,
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
            quality={85}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

