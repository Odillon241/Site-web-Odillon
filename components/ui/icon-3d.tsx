"use client"

import Image from "next/image"
import { useState } from "react"
import { LucideIcon } from "lucide-react"

interface Icon3DProps {
  src: string
  alt: string
  width: number
  height: number
  fallbackIcon?: LucideIcon
  className?: string
}

export function Icon3D({ 
  src, 
  alt, 
  width, 
  height, 
  fallbackIcon: FallbackIcon,
  className = "" 
}: Icon3DProps) {
  const [imageError, setImageError] = useState(false)

  // Si l'image 3D échoue et qu'il y a une icône de fallback, on l'affiche
  if (imageError && FallbackIcon) {
    return (
      <FallbackIcon 
        className={`${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}

