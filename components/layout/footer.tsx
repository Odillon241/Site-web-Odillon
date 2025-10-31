import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-odillon-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="space-y-4">
            <Image
              src="/logo.svg"
              alt="Odillon"
              width={150}
              height={40}
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="text-sm text-gray-300 leading-relaxed">
              Cabinet de conseil en ingénierie d'entreprises, 
              spécialisé dans la structuration et le management stratégique.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-odillon-lime">Nos Services</h3>
            <ul className="space-y-2 text-sm">
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
            <h3 className="text-lg font-semibold mb-4 text-odillon-lime">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
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
            <h3 className="text-lg font-semibold mb-4 text-odillon-lime">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-0.5 text-odillon-lime flex-shrink-0" />
                <div>
                  <a href="tel:+24111454454" className="text-gray-300 hover:text-odillon-lime transition-colors">
                    +241 11 45 45 54
                  </a>
                  <br />
                  <a href="tel:+24174759515" className="text-gray-300 hover:text-odillon-lime transition-colors">
                    +241 74 75 95 15
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-0.5 text-odillon-lime flex-shrink-0" />
                <a href="mailto:odillon2017@gmail.com" className="text-gray-300 hover:text-odillon-lime transition-colors">
                  odillon2017@gmail.com
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

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Odillon - Ingénierie d'Entreprises. Tous droits réservés.</p>
          <p className="mt-2 md:mt-0">
            Site web : <a href="https://www.odillon.fr" className="text-odillon-lime hover:underline">www.odillon.fr</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

