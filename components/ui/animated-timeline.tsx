"use client"

import { useEffect, useRef, useState } from "react"
import { m, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface TimelineEvent {
  year: number
  title: string
  description: string
  color?: "teal" | "lime"
}

interface AnimatedTimelineProps {
  events: TimelineEvent[]
  className?: string
}

export function AnimatedTimeline({ events, className }: AnimatedTimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(-1)

  // Progressive reveal animation
  useEffect(() => {
    if (!isInView) return

    const timers: NodeJS.Timeout[] = []
    events.forEach((_, index) => {
      const timer = setTimeout(() => {
        setActiveIndex(index)
      }, index * 400) // Delay each item by 400ms
      timers.push(timer)
    })

    return () => timers.forEach(clearTimeout)
  }, [isInView, events])

  const calculateProgress = () => {
    if (activeIndex === -1) return 0
    return ((activeIndex + 1) / events.length) * 100
  }

  return (
    <div ref={ref} className={cn("w-full py-12", className)}>
      <div className="container mx-auto px-4">
        {/* Progress bar */}
        <div className="relative mb-16 hidden md:block">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full overflow-hidden">
            <m.div
              className="h-full bg-gradient-to-r from-odillon-teal to-odillon-lime"
              initial={{ width: 0 }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Timeline events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {events.map((event, index) => {
            const isActive = index <= activeIndex
            const colorClass = event.color === "lime" ? "text-odillon-lime" : "text-odillon-teal"
            const bgColorClass = event.color === "lime"
              ? "bg-odillon-lime/10 border-odillon-lime/30"
              : "bg-odillon-teal/10 border-odillon-teal/30"

            return (
              <m.div
                key={event.year}
                initial={{ opacity: 0, y: 50 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Connector dot (desktop only) */}
                <m.div
                  className="hidden md:block absolute -top-16 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 bg-white z-10"
                  initial={{ scale: 0, borderColor: "#e5e7eb" }}
                  animate={isActive ? {
                    scale: 1,
                    borderColor: event.color === "lime" ? "#C4D82E" : "#39837A"
                  } : { scale: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                  style={{ willChange: 'transform, border-color' }}
                />

                {/* Card */}
                <m.div
                  className={cn(
                    "relative rounded-2xl border-2 p-6 backdrop-blur-sm transition-all duration-300",
                    bgColorClass,
                    isActive && "shadow-lg shadow-odillon-teal/10"
                  )}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {/* Year */}
                  <m.div
                    className="mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                  >
                    <span className={cn("text-4xl md:text-5xl font-bold", colorClass)}>
                      {event.year}
                    </span>
                  </m.div>

                  {/* Title */}
                  <m.h3
                    className="text-lg md:text-xl font-semibold text-gray-900 mb-2 uppercase tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                  >
                    {event.title}
                  </m.h3>

                  {/* Description */}
                  <m.p
                    className="text-sm md:text-base text-gray-600 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
                  >
                    {event.description}
                  </m.p>

                  {/* Decorative corner accent */}
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10",
                      event.color === "lime" ? "bg-odillon-lime" : "bg-odillon-teal"
                    )}
                  />
                </m.div>
              </m.div>
            )
          })}
        </div>

        {/* Mobile progress indicator */}
        <m.div
          className="md:hidden mt-8 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          {events.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index <= activeIndex
                  ? "w-8 bg-odillon-teal"
                  : "w-2 bg-gray-300"
              )}
            />
          ))}
        </m.div>
      </div>
    </div>
  )
}
