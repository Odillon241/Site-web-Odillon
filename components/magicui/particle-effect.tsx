"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Particle {
  x: number
  y: string
  scale: number
  duration: number
  delay: number
}

interface ParticleEffectProps {
  className?: string
  quantity?: number
  staticity?: number
  color?: string
}

export function ParticleEffect({
  className = "absolute inset-0",
  quantity = 30,
  staticity = 40,
  color = "rgba(26, 155, 142, 0.3)"
}: ParticleEffectProps = {}) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Générer les particules uniquement côté client
    const particleArray = Array.from({ length: quantity }, () => ({
      x: Math.random() * 100,
      y: "100%",
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 10 + staticity / 4,
      delay: Math.random() * 5,
    }))
    setParticles(particleArray)
    setMounted(true)
  }, [quantity, staticity])

  // Ne rien rendre pendant le SSR
  if (!mounted) {
    return <div className={`${className} overflow-hidden pointer-events-none`} />
  }

  return (
    <div className={`${className} overflow-hidden pointer-events-none`}>
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ backgroundColor: color }}
          initial={{
            x: particle.x + "%",
            y: particle.y,
            scale: particle.scale,
          }}
          animate={{
            y: "-10%",
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

