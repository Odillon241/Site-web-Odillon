"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HighlightTextProps {
  children: React.ReactNode
  className?: string
  highlightClassName?: string
  delay?: number
}

export function HighlightText({
  children,
  className,
  highlightClassName,
  delay = 0,
}: HighlightTextProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      <motion.span
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          delay,
        }}
        className={cn(
          "absolute bottom-1 left-0 h-3 bg-odillon-teal/20 -z-10",
          highlightClassName
        )}
      />
      <span className="relative z-10">{children}</span>
    </span>
  )
}

