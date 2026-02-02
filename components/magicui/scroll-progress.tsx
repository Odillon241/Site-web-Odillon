"use client"

import { m, useScroll } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <m.div
      className="fixed top-[88px] md:top-[104px] left-0 right-0 h-1 bg-odillon-teal origin-left z-30"
      style={{ scaleX: scrollYProgress, willChange: 'transform' }}
    />
  )
}

