"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedGradientProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGradient({ children, className }: AnimatedGradientProps) {
  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{
        duration: 8,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.div>
  )
}

