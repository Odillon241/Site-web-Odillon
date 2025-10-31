"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

interface ParticlesBackgroundProps {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  refresh?: boolean
  color?: string
  vx?: number
  vy?: number
}

export function ParticlesBackground({
  className,
  quantity = 50,
  staticity = 50,
  ease = 50,
  refresh = false,
  color = "rgba(26, 155, 142, 0.5)",
  vx = 0,
  vy = 0,
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasSize = useRef({ w: 0, h: 0 })
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d")
    }
    initCanvas()
    animate()
    window.addEventListener("resize", initCanvas)

    return () => {
      window.removeEventListener("resize", initCanvas)
    }
  }, [])

  useEffect(() => {
    onMouseMove()
  }, [mouse.current.x, mouse.current.y])

  const initCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      particles.current.length = 0
      canvasSize.current.w = canvasContainerRef.current.offsetWidth
      canvasSize.current.h = canvasContainerRef.current.offsetHeight
      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)
    }
  }

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      mouse.current.x = mouse.current.x - rect.left
      mouse.current.y = mouse.current.y - rect.top
    }
  }

  const animate = () => {
    if (context.current && canvasRef.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h)

      // Create particles on first render
      if (particles.current.length === 0) {
        for (let i = 0; i < quantity; i++) {
          particles.current.push({
            x: Math.random() * canvasSize.current.w,
            y: Math.random() * canvasSize.current.h,
            vx: (Math.random() - 0.5) * (vx / 2),
            vy: (Math.random() - 0.5) * (vy / 2),
            size: Math.random() * 2 + 1,
          })
        }
      }

      // Update and draw particles
      particles.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvasSize.current.w) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvasSize.current.h) particle.vy *= -1

        if (context.current) {
          context.current.fillStyle = color
          context.current.beginPath()
          context.current.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          context.current.fill()
        }
      })

      requestAnimationFrame(animate)
    }
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} ref={canvasContainerRef}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}

