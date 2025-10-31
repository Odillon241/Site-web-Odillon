"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Phone, Mail, ChevronDown, Home, Briefcase, Award, Users } from "lucide-react"
import { motion } from "framer-motion"
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
      { name: "Ressources Humaines", href: "/services/ressources-humaines" },
    ]
  },
  { 
    name: "Expertise", 
    href: "/expertise",
    icon: "Award"
  },
  { 
    name: "À propos", 
    href: "/a-propos",
    icon: "Users"
  },
  { 
    name: "Contact", 
    href: "/contact",
    icon: "Mail"
  },
]

export function HeaderPro() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

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
          ? "bg-white/70 backdrop-blur-xl border-b border-gray-200/30"
          : "bg-white/80 backdrop-blur-lg border-b border-white/10"
      )}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Top Bar */}
      <div className="bg-odillon-dark/95 backdrop-blur-sm text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <a href="tel:+24111454454" className="flex items-center hover:text-odillon-lime transition-colors">
                <Phone className="w-3.5 h-3.5 mr-1.5" />
                +241 11 45 45 54
              </a>
              <a href="mailto:odillon2017@gmail.com" className="hidden md:flex items-center hover:text-odillon-lime transition-colors">
                <Mail className="w-3.5 h-3.5 mr-1.5" />
                odillon2017@gmail.com
              </a>
            </div>
            <div className="text-xs text-gray-300">
              Libreville, Gabon
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="Odillon - Ingénierie d'Entreprises"
              width={280}
              height={80}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigation.map((item) => {
              const getIcon = (iconName: string) => {
                switch(iconName) {
                  case 'Home': return Home
                  case 'Briefcase': return Briefcase
                  case 'Award': return Award
                  case 'Users': return Users
                  case 'Mail': return Mail
                  default: return null
                }
              }
              const Icon = item.icon ? getIcon(item.icon) : null
              
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
                      "px-4 py-2 text-sm font-medium text-gray-700 hover:text-odillon-teal transition-colors relative group flex items-center gap-2",
                      activeSubmenu === item.name && "text-odillon-teal"
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.name}
                    {item.submenu && (
                      <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-odillon-teal transition-all duration-300 group-hover:w-full" />
                  </Link>

                  {/* Submenu */}
                  {item.submenu && activeSubmenu === item.name && (
                    <motion.div
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
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex">
            <Button
              asChild
              className="bg-odillon-teal hover:bg-odillon-teal/90 text-white"
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}

