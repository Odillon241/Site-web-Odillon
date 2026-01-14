"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Menu, X, Phone, Mail } from "lucide-react"
import { m, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Accueil", href: "#accueil" },
  { name: "Services", href: "#services" },
  { name: "À propos", href: "#apropos" },
  { name: "Contact", href: "#contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/60 backdrop-blur-2xl shadow-sm"
          : "bg-transparent"
      )}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Logo
                width={240}
                height={70}
                className="h-12 md:h-14 lg:h-16 w-auto"
                priority
                alt="Odillon"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-odillon-teal transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-odillon-teal transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <a
              href="tel:+24111747574"
              className="flex items-center text-sm text-gray-600 hover:text-odillon-teal transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              +241 11747574
            </a>
            <Button
              asChild
              className="bg-odillon-teal hover:bg-odillon-teal/90 text-white"
            >
              <Link href="#contact">Nous contacter</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-odillon-teal transition-colors rounded-md hover:bg-gray-100"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? (
                <X className="h-5 w-5 md:h-6 md:w-6" />
              ) : (
                <Menu className="h-5 w-5 md:h-6 md:w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t shadow-lg"
          >
            <div className="space-y-1 px-4 pb-4 pt-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-odillon-teal transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 mt-4 space-y-3">
                <a
                  href="tel:+24111747574"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-odillon-teal transition-colors rounded-md hover:bg-gray-50"
                >
                  <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="break-all">+241 11747574</span>
                </a>
                <a
                  href="mailto:contact@odillon.fr"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-odillon-teal transition-colors rounded-md hover:bg-gray-50"
                >
                  <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="break-all">contact@odillon.fr</span>
                </a>
                <Button
                  asChild
                  className="w-full bg-odillon-teal hover:bg-odillon-teal/90 text-white mt-2"
                >
                  <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}

