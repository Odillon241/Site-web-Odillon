import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-odillon-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo et Description */}
          <div className="space-y-3 md:space-y-4 sm:col-span-2 lg:col-span-1">
            <Image
              src="/logo-odillon.png"
              alt="Odillon"
              width={200}
              height={60}
              className="h-12 md:h-14 w-auto"
            />
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-xs">
              Cabinet de conseil en ingénierie d'entreprises, 
              spécialisé dans la structuration et le management stratégique.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-odillon-lime">Nos Services</h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link href="#services" className="text-gray-300 hover:text-odillon-lime transition-colors">
                  Gouvernance
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-300 hover:text-odillon-lime transition-colors">
                  Juridique
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-300 hover:text-odillon-lime transition-colors">
                  Finances
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-300 hover:text-odillon-lime transition-colors">
                  Ressources Humaines
                </Link>
              </li>
            </ul>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-odillon-lime">Liens Rapides</h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link href="#accueil" className="text-gray-300 hover:text-odillon-lime transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#expertise" className="text-gray-300 hover:text-odillon-lime transition-colors">
                  Notre Expertise
                </Link>
              </li>
              <li>
                <Link href="#apropos" className="text-gray-300 hover:text-odillon-lime transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-300 hover:text-odillon-lime transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-odillon-lime">Contact</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-0.5 text-odillon-lime flex-shrink-0" />
                <div>
                  <a href="tel:+24111747574" className="text-gray-300 hover:text-odillon-lime transition-colors">
                    +241 11747574
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-0.5 text-odillon-lime flex-shrink-0" />
                <a href="mailto:contact@odillon.fr" className="text-gray-300 hover:text-odillon-lime transition-colors">
                  contact@odillon.fr
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-odillon-lime flex-shrink-0" />
                <span className="text-gray-300">
                  BP- 13262 Libreville, Gabon
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 md:my-8 bg-gray-700" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs md:text-sm text-gray-400">
          <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} Odillon - Ingénierie d'Entreprises. Tous droits réservés.</p>
          <p className="text-center sm:text-right">
            Site web : <a href="https://www.odillon.fr" className="text-odillon-lime hover:underline">www.odillon.fr</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

