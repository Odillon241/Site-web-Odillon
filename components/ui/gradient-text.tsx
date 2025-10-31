"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
  from?: string
  to?: string
}

export function GradientText({
  children,
  className,
  animate = true,
  from = "#1A9B8E", // odillon-teal
  to = "#C4D82E", // odillon-lime
}: GradientTextProps) {
  return (
    <motion.span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r font-bold",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${from}, ${to})`,
      }}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.span>
  )
}

