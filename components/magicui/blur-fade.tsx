"use client"

import { m, useInView } from "framer-motion"
import { useRef } from "react"

interface BlurFadeProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function BlurFade({
  children,
  delay = 0,
  duration = 0.4,
  className = ""
}: BlurFadeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-50px" })

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

