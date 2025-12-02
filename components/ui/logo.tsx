"use client"

import Image from "next/image"

interface LogoProps {
  width?: number
  height?: number
  className?: string
  priority?: boolean
  alt?: string
}

export function Logo({ 
  width = 350, 
  height = 100, 
  className = "h-14 md:h-16 lg:h-20 w-auto",
  priority = true,
  alt = "Odillon - Ingénierie d'Entreprises"
}: LogoProps) {
  // Utiliser le PNG qui fonctionne dans le footer
  // Le WebP sera utilisé automatiquement par Next.js si disponible via le srcSet
  return (
    <Image
      src="/logo-odillon.png"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}
