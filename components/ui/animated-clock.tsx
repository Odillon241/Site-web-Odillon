"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedClockProps {
  className?: string
  size?: number
  color?: string
}

export function AnimatedClock({
  className,
  size = 32,
  color = "#39837a"
}: AnimatedClockProps) {
  // Initialize with a fixed date to avoid hydration mismatch
  // Will be updated on client after mount
  const [time, setTime] = useState(() => new Date(2024, 0, 1, 12, 0, 0))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(new Date())

    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Calcul des angles pour les aiguilles
  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  // Angle en degrés (0° = 12h, 90° = 3h, etc.)
  // L'aiguille des heures bouge aussi avec les minutes
  const hourAngle = (hours * 30 + minutes * 0.5 - 90) * (Math.PI / 180)
  const minuteAngle = (minutes * 6 + seconds * 0.1 - 90) * (Math.PI / 180)
  const secondAngle = (seconds * 6 - 90) * (Math.PI / 180)

  // Longueurs des aiguilles (en pourcentage du rayon)
  const hourLength = 0.5
  const minuteLength = 0.7
  const secondLength = 0.8

  const viewBoxSize = 32
  const center = viewBoxSize / 2
  const radius = viewBoxSize / 2 - 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className={cn("transition-all duration-300", className)}
      style={{ color }}
    >
      {/* Cercle extérieur */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-20"
      />
      
      {/* Marques des heures */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x1 = center + (radius - 3) * Math.cos(angle)
        const y1 = center + (radius - 3) * Math.sin(angle)
        const x2 = center + radius * Math.cos(angle)
        const y2 = center + radius * Math.sin(angle)

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
            className="opacity-30"
            suppressHydrationWarning
          />
        )
      })}

      {/* Aiguille des heures */}
      <line
        x1={center}
        y1={center}
        x2={center + radius * hourLength * Math.cos(hourAngle)}
        y2={center + radius * hourLength * Math.sin(hourAngle)}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="transition-transform duration-1000 ease-linear"
        suppressHydrationWarning
      />

      {/* Aiguille des minutes */}
      <line
        x1={center}
        y1={center}
        x2={center + radius * minuteLength * Math.cos(minuteAngle)}
        y2={center + radius * minuteLength * Math.sin(minuteAngle)}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="transition-transform duration-1000 ease-linear"
        suppressHydrationWarning
      />

      {/* Aiguille des secondes (optionnelle, plus subtile) */}
      <line
        x1={center}
        y1={center}
        x2={center + radius * secondLength * Math.cos(secondAngle)}
        y2={center + radius * secondLength * Math.sin(secondAngle)}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        className="opacity-60 transition-transform duration-1000 ease-linear"
        suppressHydrationWarning
      />
      
      {/* Centre de l'horloge */}
      <circle
        cx={center}
        cy={center}
        r="2"
        fill="currentColor"
      />
    </svg>
  )
}

