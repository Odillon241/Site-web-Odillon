import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react"


export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#050505] border-t border-white/5 relative overflow-hidden" role="contentinfo">
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#39837a]/50 to-transparent" />

      {/* Ambient Glow */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-[#39837a]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c4d82e]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              href="/#accueil"
              className="inline-block focus:outline-none focus:ring-2 focus:ring-[#39837a]/50 rounded-lg transition-all"
              aria-label="Retour à l'accueil"
            >
              <Image
                src="/Logo-blanclogo-de-chronodil-pour-fond-sombre.webp"
                alt="Odillon"
                width={180}
                height={54}
                className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs font-light">
              Cabinet de conseil en ingénierie d'entreprises,
              spécialisé dans la structuration et le management stratégique pour une croissance durable.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Social placeholders could go here */}
            </div>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">
              Expertises
            </h3>
            <ul className="space-y-4">
              {['Gouvernance', 'Juridique', 'Finances', 'Ressources Humaines'].map((item) => (
                <li key={item}>
                  <Link
                    href="/#services"
                    className="group flex items-center text-sm text-white/60 hover:text-[#c4d82e] transition-colors duration-300"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 h-[1px] bg-[#c4d82e] mr-0 group-hover:mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">
              Navigation
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Accueil', href: '/#accueil' },
                { name: 'Notre Expertise', href: '/#expertise' },
                { name: 'Photothèque', href: '/phototheque' },
                { name: 'À Propos', href: '/#apropos' },
                { name: 'Contact', href: '/#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">
              Nous Contacter
            </h3>
            <ul className="space-y-5">
              <li>
                <a
                  href="tel:+24111747574"
                  className="group flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#39837a]/20 transition-colors border border-white/5 group-hover:border-[#39837a]/30">
                    <Phone className="w-4 h-4 text-[#39837a]" />
                  </div>
                  <span>+241 11747574</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@odillon.fr"
                  className="group flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#39837a]/20 transition-colors border border-white/5 group-hover:border-[#39837a]/30">
                    <Mail className="w-4 h-4 text-[#39837a]" />
                  </div>
                  <span>contact@odillon.fr</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-white/60">
                  <div className="p-2 rounded-full bg-white/5 border border-white/5 flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#39837a]" />
                  </div>
                  <span className="leading-relaxed">BP- 13262 Libreville, Gabon</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>
              &copy; {currentYear} Odillon. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
              <Link href="/politique-confidentialite" className="hover:text-white transition-colors">Politique de Confidentialité</Link>
              <a
                href="https://www.odillon.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[#39837a] transition-colors group"
              >
                odillon.fr
                <ExternalLink className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

