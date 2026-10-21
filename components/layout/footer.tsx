import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"

// Pas de liens de navigation ici : ils sont déjà tous dans le menu du haut.
export function Footer() {
  const annee = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-[#008f80] to-[#006f65] text-sm" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" aria-label="Retour à l'accueil" className="inline-block">
              <Image
                src="/images/logos/odillon-logo-white.svg?v=2"
                alt="Odillon"
                width={180}
                height={54}
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs leading-relaxed text-white/75">
              Cabinet de conseil en ingénierie d&apos;entreprises, basé à Libreville.
            </p>
          </div>

          <ul className="space-y-3 text-white/85">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-odillon-lime" aria-hidden="true" />
              <span>
                <a href="tel:+24111747574" className="transition-colors hover:text-odillon-lime">+241 11 74 75 74</a>
                <span className="text-white/40"> · </span>
                <a href="tel:+24174759515" className="transition-colors hover:text-odillon-lime">+241 74 75 95 15</a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-odillon-lime" aria-hidden="true" />
              <a href="mailto:contact@odillon.fr" className="transition-colors hover:text-odillon-lime">
                contact@odillon.fr
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-odillon-lime" aria-hidden="true" />
              <span>Glass, Libreville · BP 13262, Gabon</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-5 text-xs text-white/60 md:flex-row">
          <p className="md:pl-20">© {annee} Odillon. Tous droits réservés.</p>
          <div className="flex items-center gap-5 md:pr-20">
            <Link href="/mentions-legales" className="py-2 transition-colors hover:text-white">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="py-2 transition-colors hover:text-white">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
