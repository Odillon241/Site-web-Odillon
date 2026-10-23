"use client"

import { m, useInView, useReducedMotion } from "framer-motion"
import { useRef } from "react"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  fullWidth?: boolean
  className?: string
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  fullWidth = false,
  className = "",
}: FadeInProps) {
  const ref = useRef(null)
  // Une seule fois, marge sur le bas seulement : voir BlurFade.
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" })
  const reduire = useReducedMotion()

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  }

  if (reduire) {
    return <div className={`${fullWidth ? "w-full" : ""} ${className}`}>{children}</div>
  }

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{
        duration: 0.7,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </m.div>
  )
}

