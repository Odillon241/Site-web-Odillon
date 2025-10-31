"use client"

import { cn } from "@/lib/utils"

interface TextShimmerProps {
  children: React.ReactNode
  className?: string
  shimmerClassName?: string
}

export function TextShimmer({
  children,
  className,
  shimmerClassName,
}: TextShimmerProps) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-gradient-to-r from-odillon-teal via-odillon-lime to-odillon-teal bg-[length:200%_100%] animate-shimmer",
        className
      )}
    >
      {children}
    </span>
  )
}

