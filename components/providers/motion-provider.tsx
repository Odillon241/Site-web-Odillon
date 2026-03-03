"use client"

import { LazyMotion } from "framer-motion"
import { ReactNode } from "react"

// Lazy load motion features to reduce initial bundle size
const loadFeatures = () =>
  import("@/lib/motion-features").then((res) => res.default)

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  )
}
