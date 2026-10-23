"use client"

import { useState, useEffect } from "react"
import { m, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Sur mobile, le bouton n'apparaît qu'après un écran et demi : il ne
    // s'ajoute pas aux autres boutons flottants dès les premiers défilements.
    const toggleVisibility = () => {
      const seuil = window.innerWidth < 768 ? window.innerHeight * 1.5 : 300
      setIsVisible(window.scrollY > seuil)
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true })
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-4 left-4 z-40 md:bottom-8 md:left-8"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-odillon-teal hover:bg-odillon-teal/90 text-white shadow-lg hover:shadow-xl transition-all"
            aria-label="Retour en haut"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </m.div>
      )}
    </AnimatePresence>
  )
}

