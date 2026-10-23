"use client"

import { m, useInView, useReducedMotion } from "framer-motion"
import { useRef } from "react"

interface BlurFadeProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

/**
 * Apparition au défilement, une seule fois : un contenu déjà vu ne disparaît
 * plus quand on remonte. La marge est exprimée sur le seul bas de l'écran, ce
 * qui déclenche aussi les blocs plus hauts que la fenêtre (un formulaire, par
 * exemple), qu'une marge négative uniforme pouvait laisser invisibles.
 */
export function BlurFade({
  children,
  delay = 0,
  duration = 0.4,
  className = ""
}: BlurFadeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" })
  const reduire = useReducedMotion()

  if (reduire) return <div className={className}>{children}</div>

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={
        isInView
          ? { opacity: 1, filter: "blur(0px)" }
          : { opacity: 0, filter: "blur(10px)" }
      }
      transition={{
        delay: delay,
        duration: duration,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </m.div>
  )
}
