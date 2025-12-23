"use client"

import { LucideIcon } from "lucide-react"
import { m } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface GlassmorphismIconProps {
  icon: LucideIcon
  className?: string
  size?: number
  color?: string
  variant?: "default" | "electric" | "pulse" | "aurora"
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

export function GlassmorphismIcon({
  icon: Icon,
  className,
  size = 64,
  color = "#39837a",
  variant = "default"
}: GlassmorphismIconProps) {
  // Unique ID for SVG filters
  const filterId = useMemo(() => `glow-${Math.random().toString(36).slice(2, 8)}`, [])

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {/* SVG Filter definitions */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feFlood floodColor={color} floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Outer glow layer */}
      <m.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${hexToRgba(color, 0.4)}, transparent 70%)`,
          filter: "blur(12px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main container */}
      <m.div
        className="relative w-full h-full rounded-xl overflow-hidden group cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(color, 0.15)} 0%, ${hexToRgba(color, 0.05)} 100%)`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: `
            0 0 0 1px ${hexToRgba(color, 0.3)},
            0 0 20px ${hexToRgba(color, 0.2)},
            inset 0 1px 0 ${hexToRgba('#ffffff', 0.2)},
            inset 0 -1px 0 ${hexToRgba('#000000', 0.1)}
          `,
        }}
        whileHover={{
          scale: 1.05,
          boxShadow: `
            0 0 0 2px ${color},
            0 0 40px ${hexToRgba(color, 0.5)},
            0 0 80px ${hexToRgba(color, 0.3)},
            inset 0 1px 0 ${hexToRgba('#ffffff', 0.3)},
            inset 0 -1px 0 ${hexToRgba('#000000', 0.1)}
          `,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Animated border gradient */}
        <m.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${color}, transparent, ${color}, transparent)`,
            padding: "1px",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMaskComposite: "xor",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Glass shine - sweeping highlight */}
        <m.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${hexToRgba('#ffffff', 0.4)} 45%, ${hexToRgba('#ffffff', 0.6)} 50%, ${hexToRgba('#ffffff', 0.4)} 55%, transparent 60%)`,
          }}
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Inner glow ring */}
        <div
          className="absolute inset-[3px] rounded-xl"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${hexToRgba('#ffffff', 0.15)} 0%, transparent 60%)`,
          }}
        />

        {/* Shimmer particles effect */}
        {variant === "aurora" && (
          <m.div
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(circle at 20% 20%, ${hexToRgba(color, 0.6)} 0%, transparent 30%),
                radial-gradient(circle at 80% 80%, ${hexToRgba(color, 0.4)} 0%, transparent 30%),
                radial-gradient(circle at 60% 30%, ${hexToRgba('#ffffff', 0.3)} 0%, transparent 20%)
              `,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Electric pulse effect */}
        {variant === "electric" && (
          <>
            <m.div
              className="absolute inset-0 rounded-xl"
              style={{
                border: `2px solid ${color}`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 1.1, 1.2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <m.div
              className="absolute inset-0 rounded-xl"
              style={{
                border: `1px solid ${color}`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 1.2, 1.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
          </>
        )}

        {/* Pulse ring effect */}
        {variant === "pulse" && (
          <m.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, ${hexToRgba(color, 0.3)} 0%, transparent 60%)`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Icon with glow */}
        <m.div
          className="absolute inset-0 flex items-center justify-center"
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <m.div
            animate={{
              filter: [
                `drop-shadow(0 0 4px ${hexToRgba(color, 0.6)})`,
                `drop-shadow(0 0 8px ${hexToRgba(color, 0.8)})`,
                `drop-shadow(0 0 4px ${hexToRgba(color, 0.6)})`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon
              size={size * 0.45}
              strokeWidth={2}
              className="relative z-10"
              style={{
                color: 'white',
                filter: `url(#${filterId})`,
              }}
            />
          </m.div>
        </m.div>

        {/* Bottom reflection */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20"
          style={{
            background: `linear-gradient(0deg, ${hexToRgba(color, 0.3)} 0%, transparent 100%)`,
          }}
        />
      </m.div>

      {/* Floating particles */}
      <m.div
        className="absolute w-1 h-1 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 6px ${color}`,
          top: "20%",
          left: "10%",
        }}
        animate={{
          y: [0, -8, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <m.div
        className="absolute w-1.5 h-1.5 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 8px ${color}`,
          bottom: "25%",
          right: "15%",
        }}
        animate={{
          y: [0, -6, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </div>
  )
}

