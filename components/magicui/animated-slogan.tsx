"use client"

import { useEffect, useState, useRef } from "react"
import { m, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedSloganProps {
  text: string
  className?: string
  iconPosition?: number // Position de l'icône dans le texte (index du mot après lequel insérer l'icône)
}

// Icône de stylo animée
function AnimatedPenIcon({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center justify-center mx-3 align-middle", className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[0.85em] h-[0.85em] animate-pen-write"
      >
        {/* Corps du stylo */}
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
        {/* Trait d'écriture animé */}
        <path
          d="M2 22h8"
          className="animate-writing-line"
          strokeDasharray="8"
          strokeDashoffset="8"
        />
      </svg>
    </span>
  )
}

export function AnimatedSlogan({
  text,
  className,
  iconPosition = 2,
}: AnimatedSloganProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-50px" })
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  const words = text.split(" ")
  const beforeIcon = words.slice(0, iconPosition).join(" ")
  const afterIcon = words.slice(iconPosition).join(" ")
  const fullText = beforeIcon + " " + afterIcon

  // Effet machine à écrire
  useEffect(() => {
    if (!isInView) {
      setDisplayedText("")
      setCurrentIndex(0)
      setIsComplete(false)
      return
    }

    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 70)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, fullText, isInView])

  // Curseur clignotant
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [])

  // Calculer quelle partie du texte afficher
  const beforeIconLength = beforeIcon.length
  const displayedBefore = displayedText.slice(0, Math.min(displayedText.length, beforeIconLength))
  const showIcon = displayedText.length > beforeIconLength
  const displayedAfter = displayedText.length > beforeIconLength + 1
    ? displayedText.slice(beforeIconLength + 1)
    : ""

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "font-baskvill text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white italic tracking-wide text-center leading-relaxed",
        className
      )}
    >
      <span className="drop-shadow-lg">{displayedBefore}</span>
      {showIcon && (
        <m.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        >
          <AnimatedPenIcon />
        </m.span>
      )}
      <span className="drop-shadow-lg">{displayedAfter}</span>
      {!isComplete && (
        <span
          className={cn(
            "inline-block w-[2px] h-[0.9em] bg-white/80 ml-1 align-middle transition-opacity duration-100",
            showCursor ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </m.div>
  )
}
