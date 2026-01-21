"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Phone, Mail, ChevronDown, Home, Briefcase, Users, Send, Menu, X, Image as ImageIcon, Newspaper } from "lucide-react"
import { m, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Accueil",
    href: "/",
    icon: "Home"
  },
  {
    name: "Services",
    href: "/services",
    icon: "Briefcase",
    submenu: [
      { name: "Gouvernance", href: "/services/gouvernance" },
      { name: "Juridique", href: "/services/juridique" },
      { name: "Finances", href: "/services/finances" },
      { name: "Capital Humain", href: "/services/ressources-humaines" },
    ]
  },
  {
    name: "Photothèque",
    href: "/phototheque",
    icon: "Image"
  },
  {
    name: "Blog",
    href: "/blog",
    icon: "Newspaper"
  },
  {
    name: "À propos",
    href: "/a-propos",
    icon: "Users"
  },
]

export function HeaderPro() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/60 backdrop-blur-2xl border-b border-gray-200/30"
          : "bg-background/70 backdrop-blur-xl border-b border-white/10"
      )}
      style={{
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
      }}
    >
      {/* Top Bar */}
      <div className="bg-[#39837a]/95 backdrop-blur-lg border-t-2 border-[#39837a] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-8 md:h-10 items-center justify-between text-xs md:text-sm">
            <div className="flex items-center space-x-3 md:space-x-6">
              <a href="tel:+24111747574" className="flex items-center text-white/90 hover:text-white transition-colors">
                <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-1.5" />
                <span className="hidden sm:inline">+241 11 74 75 74</span>
                <span className="sm:hidden">+241 117...</span>
              </a>
              <a href="tel:+24174759515" className="hidden lg:flex items-center text-white/90 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 mr-1.5" />
                +241 74 75 95 15
              </a>
              <a href="mailto:contact@odillon.fr" className="hidden md:flex items-center text-white/90 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 mr-1.5" />
                contact@odillon.fr
              </a>
            </div>
            <div className="text-[10px] md:text-xs text-white/80">
              BP 13262, Libreville, Gabon
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center min-w-0">
            <Image
              src="/images/logos/odillon-logo-new.svg"
              alt="Odillon - Ingénierie d'Entreprises"
              width={200}
              height={60}
              className="h-8 md:h-10 lg:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigation.map((item) => {
              const getIcon = (iconName: string) => {
                switch (iconName) {
                  case 'Home': return Home
                  case 'Briefcase': return Briefcase
                  case 'Users': return Users
                  case 'Image': return ImageIcon
                  case 'Newspaper': return Newspaper
                  default: return null
                }
              }
              const Icon = item.icon ? getIcon(item.icon) : null
              const isActive = pathname === item.href || (item.submenu && pathname.startsWith(item.href))

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.submenu && setActiveSubmenu(item.name)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-all relative group flex items-center gap-2 rounded border",
                      isActive
                        ? "text-odillon-teal bg-odillon-teal/5 border-odillon-teal"
                        : "text-gray-700 hover:text-odillon-teal border-transparent hover:border-gray-200",
                      activeSubmenu === item.name && "text-odillon-teal"
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.name}
                    {item.submenu && (
                      <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-odillon-teal transition-all duration-300 group-hover:w-full" />
                    )}
                  </Link>

                  {/* Submenu */}
                  {item.submenu && activeSubmenu === item.name && (
                    <m.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-100 py-2"
                    >
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-odillon-teal/5 hover:text-odillon-teal transition-colors"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </m.div>
                  )}
                </div>
              )
            })}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex">
            <Button
              asChild
              className="bg-odillon-teal hover:bg-black text-white transition-colors"
              style={{
                boxShadow: 'inset 0 0 0 2px rgba(10, 31, 44, 0.5)',
              }}
            >
              <Link href="/contact" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Nous contacter
              </Link>
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
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-gray-200"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto">
              {navigation.map((item) => {
                const getIcon = (iconName: string) => {
                  switch (iconName) {
                    case 'Home': return Home
                    case 'Briefcase': return Briefcase
                    case 'Users': return Users
                    case 'Image': return ImageIcon
                    case 'Newspaper': return Newspaper
                    default: return null
                  }
                }
                const Icon = item.icon ? getIcon(item.icon) : null
                const isActive = pathname === item.href

                return (
                  <div key={item.name} className="space-y-1">
                    <Link
                      href={item.href}
                      onClick={() => !item.submenu && setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive
                          ? "bg-odillon-teal/10 text-odillon-teal"
                          : "text-gray-700 hover:bg-gray-100 hover:text-odillon-teal"
                      )}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      {item.name}
                      {item.submenu && <ChevronDown className="ml-auto w-4 h-4" />}
                    </Link>

                    {/* Mobile Submenu */}
                    {item.submenu && (
                      <div className="pl-12 space-y-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-odillon-teal rounded-md hover:bg-gray-50 transition-colors"
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Mobile CTA */}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  asChild
                  className="w-full bg-odillon-teal hover:bg-odillon-teal/90 text-white"
                >
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
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

