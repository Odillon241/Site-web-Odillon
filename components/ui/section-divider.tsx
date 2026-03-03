"use client"

import { cn } from "@/lib/utils"

interface SectionDividerProps {
  variant?: "default" | "gradient" | "dotted" | "minimal"
  className?: string
}

export function SectionDivider({ 
  variant = "default",
  className 
}: SectionDividerProps) {
  const variants = {
    default: "h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent",
    gradient: "h-px bg-gradient-to-r from-transparent via-[#39837a]/30 via-[#C4D82E]/30 to-transparent",
    dotted: "h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent border-dotted border-t border-gray-300",
    minimal: "h-[1px] bg-gray-200/50"
  }

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", variants[variant])} />
    </div>
  )
}

