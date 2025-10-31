"use client"

import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { wrap } from "@motionone/utils"

interface ScrollVelocityContainerProps {
  children: React.ReactNode
  className?: string
}

export function ScrollVelocityContainer({
  children,
  className,
}: ScrollVelocityContainerProps) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  )
}

interface ScrollVelocityRowProps {
  children: React.ReactNode
  baseVelocity?: number
  direction?: number
  className?: string
}

export function ScrollVelocityRow({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
}: ScrollVelocityRowProps) {
  const baseX = useMotionValue(0)
  const x = useTransform(baseX, (v) => `${wrap(-100 / 4, 0, v)}%`)

  const directionFactor = useRef(direction)

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="relative m-0 flex flex-nowrap overflow-hidden">
      <motion.div
        className={cn("flex whitespace-nowrap", className)}
        style={{ x }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="mr-8">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

