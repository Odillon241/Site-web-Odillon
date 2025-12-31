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
  height = 104,
  className = "h-14 md:h-16 lg:h-20 w-auto",
  priority = true,
  alt = "Odillon - Ingénierie d'Entreprises"
}: LogoProps) {
  // Utiliser le nouveau logo SVG
  return (
    <Image
      src="/images/logos/odillon-logo-new.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}
