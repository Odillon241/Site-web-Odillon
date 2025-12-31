import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, ExternalLink, ChevronRight, Briefcase, Scale, PiggyBank, Users } from "lucide-react"


export function Footer() {
  const currentYear = new Date().getFullYear()

  const expertises = [
    { name: 'Gouvernance', icon: Briefcase, href: '/#services' },
    { name: 'Juridique', icon: Scale, href: '/#services' },
    { name: 'Finances', icon: PiggyBank, href: '/#services' },
    { name: 'Ressources Humaines', icon: Users, href: '/#services' },
  ]

  const quickLinks = [
    { name: 'Accueil', href: '/#accueil' },
    { name: 'Notre Expertise', href: '/#expertise' },
    { name: 'Photothèque', href: '/phototheque' },
    { name: 'À Propos', href: '/#apropos' },
    { name: 'Contact', href: '/#contact' },
  ]

  return (
    <footer className="relative bg-gradient-to-b from-[#2a6b63] to-[#1f524c]" role="contentinfo">

      {/* Decorative Accents */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-56 h-56 bg-odillon-lime/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              href="/#accueil"
              className="inline-block focus:outline-none focus:ring-2 focus:ring-odillon-teal/50 rounded-lg transition-all group"
              aria-label="Retour à l'accueil"
            >
              <Image
                src="/images/logos/odillon-logo-white.svg?v=2"
                alt="Odillon"
                width={180}
                height={54}
                className="h-12 w-auto transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-white/80 leading-relaxed max-w-sm">
              Cabinet de conseil en ingénierie d'entreprises,
              spécialisé dans la structuration et le management stratégique pour une croissance durable.
            </p>
            {/* Decorative Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <span className="w-2 h-2 rounded-full bg-odillon-lime animate-pulse" />
              <span className="text-sm text-white">Basé au Gabon 🇬🇦</span>
            </div>
          </div>

          {/* Expertises Column */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-odillon-lime rounded-full" />
              Expertises
            </h3>
            <ul className="space-y-3">
              {expertises.map((item) => {
                const IconComponent = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3 text-white/80 hover:text-odillon-lime transition-all duration-300"
                    >
                      <span className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all border border-white/10 group-hover:border-odillon-lime/30">
                        <IconComponent className="w-4 h-4 text-odillon-lime" />
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-odillon-lime rounded-full" />
              Navigation
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-white/80 hover:text-odillon-lime transition-all duration-300"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-odillon-lime" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-odillon-lime rounded-full" />
              Nous Contacter
            </h3>
            <div className="space-y-4">
              {/* Phone Card */}
              <a
                href="tel:+24111747574"
                className="group flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all border border-white/10 hover:border-odillon-lime/30"
              >
                <div className="p-2.5 rounded-lg bg-odillon-lime text-odillon-dark shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-white/60 block">Téléphone</span>
                  <span className="text-white font-medium group-hover:text-odillon-lime transition-colors">+241 11 74 75 74</span>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:contact@odillon.fr"
                className="group flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all border border-white/10 hover:border-odillon-lime/30"
              >
                <div className="p-2.5 rounded-lg bg-white text-odillon-teal shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-white/60 block">Email</span>
                  <span className="text-white font-medium group-hover:text-odillon-lime transition-colors">contact@odillon.fr</span>
                </div>
              </a>

              {/* Address Card */}
              <div className="flex items-start gap-4 p-3 rounded-xl bg-white/10 border border-white/10">
                <div className="p-2.5 rounded-lg bg-white/20 text-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-white/60 block">Adresse</span>
                  <span className="text-white font-medium">BP- 13262 Libreville, Gabon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative mt-16 pt-8">
          {/* Decorative Separator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <span className="w-24 h-[1px] bg-gradient-to-r from-transparent to-white/30" />
            <span className="w-2 h-2 rounded-full bg-odillon-lime/50" />
            <span className="w-24 h-[1px] bg-gradient-to-l from-transparent to-white/30" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
            <p className="flex items-center gap-1">
              © {currentYear} <span className="font-semibold text-white">Odillon</span>. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/mentions-legales"
                className="hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-odillon-lime hover:after:w-full after:transition-all"
              >
                Mentions Légales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-odillon-lime hover:after:w-full after:transition-all"
              >
                Politique de Confidentialité
              </Link>

              <a
                href="https://www.odillon.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-odillon-lime text-odillon-dark rounded-full hover:bg-white hover:text-odillon-teal transition-all group"
              >
                odillon.fr
                <ExternalLink className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

