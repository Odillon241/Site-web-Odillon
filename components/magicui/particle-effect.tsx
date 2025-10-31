"use client"

import { motion } from "framer-motion"

export function ParticleEffect() {
  const particles = Array.from({ length: 30 })

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-odillon-teal/30 rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: "100%",
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: "-10%",
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

