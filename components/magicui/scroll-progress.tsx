"use client"

import { m, useScroll } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <m.div
      className="fixed top-0 left-0 right-0 h-1 bg-odillon-teal origin-left z-50"
      style={{ scaleX: scrollYProgress, willChange: 'transform' }}
    />
  )
}

