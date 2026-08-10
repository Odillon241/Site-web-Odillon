"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { m, useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedSloganProps {
  text: string
  className?: string
  iconPosition?: number // Position de l'icône dans le texte (index du mot après lequel insérer l'icône)
}

interface AnimatedWritingHandProps {
  className?: string
  isWriting: boolean
}

function AnimatedWritingHand({ className, isWriting }: AnimatedWritingHandProps) {
  const shouldReduceMotion = useReducedMotion()
  const isMoving = isWriting && !shouldReduceMotion

  return (
    <m.span
      initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      className={cn(
        "mx-1.5 inline-flex h-[1.8em] w-[1.55em] items-center justify-center align-middle sm:mx-2 md:h-[1.7em] md:w-[1.46em]",
        className
      )}
      aria-hidden="true"
    >
      <m.span
        animate={
          isMoving
            ? {
                x: [0, 3, -1, 2, 0],
                y: [0, -2, 1, -1, 0],
                rotate: [0, -2, 1.2, -1, 0],
              }
            : { x: 0, y: 0, rotate: 0 }
        }
        transition={
          isMoving
            ? {
                duration: 1.35,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1],
              }
            : { type: "spring", duration: 0.3, bounce: 0 }
        }
        className="inline-flex size-full origin-[18%_82%] will-change-transform"
      >
        <Image
          src="/images/hand-drawing-future-icon.png"
          alt=""
          width={805}
          height={937}
          sizes="(max-width: 640px) 40px, 84px"
          className="size-full object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.18)]"
          draggable={false}
        />
      </m.span>
    </m.span>
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
        "font-baskvill text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl text-white italic tracking-wide text-center leading-relaxed",
        className
      )}
    >
      <span className="drop-shadow-lg">{displayedBefore}</span>
      {showIcon && <AnimatedWritingHand isWriting={!isComplete} />}
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
