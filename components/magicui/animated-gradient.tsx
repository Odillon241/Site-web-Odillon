"use client"

import { m } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedGradientProps {
  children?: React.ReactNode
  className?: string
}

export function AnimatedGradient({ children, className }: AnimatedGradientProps) {
  return (
    <m.div
      className={cn("relative overflow-hidden", className)}
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{
        duration: 8,
        ease: "linear",
        repeat: Infinity,
      }}
      style={{
        background: "linear-gradient(90deg, rgba(57, 131, 122, 0.1), rgba(196, 216, 46, 0.1), rgba(57, 131, 122, 0.1))",
        backgroundSize: "200% 200%",
      }}
    >
      {children}
    </m.div>
  )
}

