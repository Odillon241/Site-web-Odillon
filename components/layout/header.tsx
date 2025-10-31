"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Accueil", href: "#accueil" },
  { name: "Services", href: "#services" },
  { name: "Expertise", href: "#expertise" },
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
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo.svg"
                alt="Odillon"
                width={180}
                height={50}
                className="h-12 w-auto"
                priority
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
              href="tel:+24111454454"
              className="flex items-center text-sm text-gray-600 hover:text-odillon-teal transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              +241 11 45 45 54
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
              className="text-gray-700 hover:text-odillon-teal"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-odillon-teal"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <a
                  href="tel:+24111454454"
                  className="flex items-center px-3 py-2 text-sm text-gray-600"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +241 11 45 45 54
                </a>
                <a
                  href="mailto:odillon2017@gmail.com"
                  className="flex items-center px-3 py-2 text-sm text-gray-600"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  odillon2017@gmail.com
                </a>
                <Button
                  asChild
                  className="w-full bg-odillon-teal hover:bg-odillon-teal/90 text-white"
                >
                  <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

