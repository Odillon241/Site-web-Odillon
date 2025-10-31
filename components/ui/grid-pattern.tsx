"use client"

import { useEffect, useId, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  squares?: Array<[number, number]>
  strokeDasharray?: string
  className?: string
  [key: string]: unknown
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares,
  className,
  ...props
}: GridPatternProps) {
  const id = useId()

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/10 stroke-gray-400/10",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], index) => (
            <motion.rect
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                repeat: Infinity,
                repeatDelay: 5,
              }}
              key={`${x}-${y}`}
              width={width - 1}
              height={height - 1}
              x={x * width + 1}
              y={y * height + 1}
              className="fill-odillon-teal/5 stroke-odillon-teal/10"
              strokeWidth="2"
            />
          ))}
        </svg>
      )}
    </svg>
  )
}

interface GridBackgroundProps {
  className?: string
  children?: React.ReactNode
  squares?: Array<[number, number]>
}

export function GridBackground({
  className,
  children,
  squares = [
    [4, 4],
    [8, 8],
    [12, 4],
    [16, 8],
    [6, 10],
    [10, 6],
    [14, 10],
    [3, 6],
    [18, 4],
  ],
}: GridBackgroundProps) {
  return (
    <div className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", className)}>
      <GridPattern
        width={60}
        height={60}
        x={-1}
        y={-1}
        squares={squares}
        className="absolute inset-0"
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}

