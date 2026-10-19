"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronDown, Home, Briefcase, Users, Send, Menu, X, Image as ImageIcon, Newspaper, CalendarDays } from "lucide-react"
import { m, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Accueil",
    href: "/",
    icon: "Home"
  },
  {
    name: "Nos produits",
    href: "/produits",
    icon: "Briefcase",
    submenu: [
      { name: "Gouvernance", href: "/produits#gouvernance" },
      { name: "Administration RH", href: "/produits#ressources-humaines" },
      { name: "Juridique", href: "/produits#juridique" },
      { name: "Entrepreneuriat", href: "/produits#entrepreneuriat" },
      { name: "Formation", href: "/produits#formation" },
    ]
  },
  {
    name: "Calendrier",
    href: "/calendrier-formations",
    icon: "CalendarDays"
  },
  {
    name: "Nos événements",
    href: "/phototheque",
    icon: "Image"
  },
  {
    name: "À propos",
    href: "/a-propos",
    icon: "Users"
  },
  {
    name: "Blog",
    href: "/blog",
    icon: "Newspaper"
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
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-300",
        isScrolled
          ? "bg-white/88 backdrop-blur-xl border-b border-odillon-teal/10 shadow-sm shadow-[#0A1F2C]/[0.03]"
          : "bg-white/80 backdrop-blur-xl border-b border-odillon-teal/10"
      )}
      style={{
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
      }}
    >
      {/* Main Navigation */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex h-full items-center min-w-0">
            <Image
              src="/images/logos/odillon-logo-full.svg"
              alt="Odillon - Ingénierie d'Entreprises"
              width={200}
              height={60}
              className="h-8 md:h-10 lg:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex xl:items-center xl:space-x-1">
            {navigation.map((item) => {
              const getIcon = (iconName: string) => {
                switch (iconName) {
                  case 'Home': return Home
                  case 'Briefcase': return Briefcase
                  case 'Users': return Users
                  case 'Image': return ImageIcon
                  case 'Newspaper': return Newspaper
                  case 'CalendarDays': return CalendarDays
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
                  onFocus={() => item.submenu && setActiveSubmenu(item.name)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActiveSubmenu(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setActiveSubmenu(null)
                  }}
                >
                  <Link
                    href={item.href}
                    aria-haspopup={item.submenu ? "true" : undefined}
                    aria-expanded={item.submenu ? activeSubmenu === item.name : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-3 text-sm font-semibold transition-all",
                      isActive
                        ? "text-odillon-teal bg-odillon-teal/10"
                        : "text-gray-700 hover:text-odillon-teal hover:bg-odillon-teal/5",
                      activeSubmenu === item.name && "text-odillon-teal bg-odillon-teal/5"
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.name}
                    {item.submenu && (
                      <ChevronDown
                        className={cn("ml-1 w-4 h-4 transition-transform", activeSubmenu === item.name && "rotate-180")}
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {/* Submenu : le pt-2 (et non mt-2) garde la souris dans la zone survolée */}
                  {item.submenu && activeSubmenu === item.name && (
                    <m.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 pt-2"
                    >
                      <div className="w-64 rounded-xl border border-odillon-teal/10 bg-white py-2 shadow-lg shadow-[#0A1F2C]/10">
                        {item.submenu.map((subitem) => (
                          <a
                            key={subitem.name}
                            href={subitem.href}
                            className="block px-4 py-3 text-sm text-gray-700 outline-none transition-colors hover:bg-odillon-teal/5 hover:text-odillon-teal focus-visible:bg-odillon-teal/5 focus-visible:text-odillon-teal"
                          >
                            {subitem.name}
                          </a>
                        ))}
                      </div>
                    </m.div>
                  )}
                </div>
              )
            })}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden xl:flex">
            <Button asChild className="h-11">
              <Link href="/contact" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Nous contacter
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-gray-700 hover:text-odillon-teal transition-colors rounded-md hover:bg-gray-100"
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
            className="xl:hidden bg-background/95 backdrop-blur-xl border-b border-gray-200"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 space-y-2 max-h-[calc(100dvh-4rem)] overflow-y-auto">
              {navigation.map((item) => {
                const getIcon = (iconName: string) => {
                  switch (iconName) {
                    case 'Home': return Home
                    case 'Briefcase': return Briefcase
                    case 'Users': return Users
                    case 'Image': return ImageIcon
                    case 'Newspaper': return Newspaper
                    case 'CalendarDays': return CalendarDays
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
                        "flex items-center gap-3 px-4 py-3 rounded-md text-base font-semibold transition-colors",
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
                          <a
                            key={subitem.name}
                            href={subitem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 text-sm text-gray-600 hover:text-odillon-teal rounded-md hover:bg-gray-50 transition-colors"
                          >
                            {subitem.name}
                          </a>
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
                  className="w-full h-12 bg-odillon-teal hover:bg-odillon-teal/90 text-white"
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

