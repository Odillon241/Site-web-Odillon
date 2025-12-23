"use client"

import React, { useState, useEffect, useMemo } from "react"
import { m, useInView } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedStatCardProps {
  icon: LucideIcon
  value: number
  suffix?: string
  label: string
  description?: string
  color?: string
  delay?: number
  className?: string
}

function hexToRgba(hexColor: string, alpha: number): string {
  const hex = hexColor.replace("#", "")
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16)
    const g = parseInt(hex[1] + hex[1], 16)
    const b = parseInt(hex[2] + hex[2], 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return hexColor
}

export function AnimatedStatCard({
  icon: Icon,
  value,
  suffix = "",
  label,
  description,
  color = "#39837a",
  delay = 0,
  className,
}: AnimatedStatCardProps) {
  const [count, setCount] = useState(0)
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  // Unique ID for gradient
  const gradientId = useMemo(() => `stat-grad-${Math.random().toString(36).slice(2, 8)}`, [])

  // Animated counter
  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const startTime = Date.now()
    const startDelay = delay * 1000

    const timer = setTimeout(() => {
      const animate = () => {
        const elapsed = Date.now() - startTime - startDelay
        const progress = Math.min(elapsed / duration, 1)
        // Easing function for smooth animation
        const easeOutExpo = 1 - Math.pow(2, -10 * progress)
        setCount(Math.floor(easeOutExpo * value))

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(value)
        }
      }
      animate()
    }, startDelay)

    return () => clearTimeout(timer)
  }, [isInView, value, delay])

  return (
    <m.div
      ref={ref}
      className={cn("relative group", className)}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer container with animated border */}
      <div
        className="relative w-full h-full rounded-xl p-[2px] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(color, 0.3)}, transparent 50%, ${hexToRgba(color, 0.2)})`,
        }}
      >
        {/* Animated rotating border gradient */}
        <m.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `conic-gradient(from 0deg, ${color}, transparent 30%, transparent 70%, ${color})`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Moving halo/dot */}
        <m.div
          className="absolute w-16 h-16 rounded-full blur-2xl z-10"
          style={{ background: hexToRgba(color, 0.4) }}
          animate={{
            top: ["10%", "10%", "70%", "70%", "10%"],
            left: ["10%", "75%", "75%", "10%", "10%"],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner card */}
        <div
          className="relative w-full h-full rounded-xl backdrop-blur-xl overflow-hidden"
          style={{
            background: `linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))`,
          }}
        >
          {/* Background glow effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${hexToRgba(color, 0.15)} 0%, transparent 70%)`,
            }}
          />

          {/* Rotating ray effect */}
          <m.div
            className="absolute top-1/2 left-1/2 w-[200%] h-[50px] -translate-x-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${hexToRgba(color, 0.5)}, transparent)`,
              filter: "blur(20px)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Shimmer sweep effect on hover */}
          <m.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${hexToRgba('#ffffff', 0.6)} 45%, ${hexToRgba('#ffffff', 0.8)} 50%, ${hexToRgba('#ffffff', 0.6)} 55%, transparent 60%)`,
            }}
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Content */}
          <div className="relative z-10 p-6 md:p-8 text-center flex flex-col items-center justify-center min-h-[200px] md:min-h-[240px]">
            {/* Animated icon container */}
            <m.div
              className="relative mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Icon glow */}
              <m.div
                className="absolute inset-0 rounded-xl blur-xl"
                style={{ background: hexToRgba(color, 0.4) }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Icon background */}
              <div
                className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${hexToRgba(color, 0.2)}, ${hexToRgba(color, 0.1)})`,
                  border: `2px solid ${hexToRgba(color, 0.4)}`,
                  boxShadow: `0 4px 20px ${hexToRgba(color, 0.2)}, inset 0 1px 0 rgba(255,255,255,0.5)`,
                }}
              >
                <Icon
                  className="w-7 h-7 md:w-8 md:h-8"
                  style={{ color: color }}
                />
              </div>
            </m.div>

            {/* Animated value */}
            <div className="relative mb-2">
              <m.div
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                style={{ color: color }}
                animate={{
                  textShadow: [
                    `0 0 20px ${hexToRgba(color, 0)}`,
                    `0 0 30px ${hexToRgba(color, 0.3)}`,
                    `0 0 20px ${hexToRgba(color, 0)}`,
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {count}
                <span className="text-2xl md:text-3xl ml-1">{suffix}</span>
              </m.div>
            </div>

            {/* Label */}
            <div className="text-sm md:text-base font-semibold text-gray-800 mb-1">
              {label}
            </div>

            {/* Description */}
            {description && (
              <div className="text-xs md:text-sm text-gray-500">
                {description}
              </div>
            )}
          </div>

          {/* Animated border lines */}
          <m.div
            className="absolute top-4 left-4 right-4 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${hexToRgba(color, 0.3)}, transparent)`,
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <m.div
            className="absolute bottom-4 left-4 right-4 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${hexToRgba(color, 0.3)}, transparent)`,
            }}
            animate={{ opacity: [0.7, 0.3, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Progress bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100/50 overflow-hidden">
            <m.div
              className="h-full"
              style={{
                background: `linear-gradient(90deg, ${color}, ${hexToRgba(color, 0.6)})`,
              }}
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : {}}
              transition={{ duration: 1.5, delay: delay * 0.15 + 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Corner accents */}
          <div
            className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 rounded-tl-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"
            style={{ borderColor: color }}
          />
          <div
            className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 rounded-br-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"
            style={{ borderColor: color }}
          />
        </div>
      </div>

      {/* Floating particles */}
      <m.div
        className="absolute w-1 h-1 rounded-full z-20"
        style={{
          background: color,
          boxShadow: `0 0 6px ${color}`,
          top: "15%",
          left: "8%",
        }}
        animate={{
          y: [0, -10, 0],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.2,
        }}
      />
      <m.div
        className="absolute w-1.5 h-1.5 rounded-full z-20"
        style={{
          background: color,
          boxShadow: `0 0 8px ${color}`,
          bottom: "20%",
          right: "12%",
        }}
        animate={{
          y: [0, -8, 0],
          opacity: [0.3, 0.9, 0.3],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.2 + 0.5,
        }}
      />
    </m.div>
  )
}

