"use client"

import { usePathname } from "next/navigation"
import { Facebook, Linkedin, MessageCircle, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Bouton = {
  href: string
  libelle: string
  infobulle: string
  icone: LucideIcon
  couleur: string
  principal?: boolean
}

const MESSAGE_WHATSAPP = "Bonjour Odillon, je souhaite échanger avec vous."

// Du haut vers le bas : WhatsApp, l'action principale, reste au plus près du coin.
const BOUTONS: Bouton[] = [
  {
    href: "https://www.facebook.com/share/19f5mYgma2/",
    libelle: "Odillon sur Facebook",
    infobulle: "Suivez-nous sur Facebook",
    icone: Facebook,
    couleur: "#1877F2",
  },
  {
    href: "https://www.linkedin.com/company/odillon-sarl/",
    libelle: "Odillon sur LinkedIn",
    infobulle: "Suivez-nous sur LinkedIn",
    icone: Linkedin,
    couleur: "#0A66C2",
  },
  {
    href: `https://wa.me/24174759515?text=${encodeURIComponent(MESSAGE_WHATSAPP)}`,
    libelle: "Écrire à Odillon sur WhatsApp",
    infobulle: "Écrivez-nous sur WhatsApp",
    icone: MessageCircle,
    couleur: "#25D366",
    principal: true,
  },
]

export function WhatsAppButton() {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  return (
    <nav aria-label="Réseaux et messagerie" className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-3">
      {BOUTONS.map(({ href, libelle, infobulle, icone: Icone, couleur, principal }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={libelle}
          className="group flex items-center gap-3"
        >
          <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-odillon-dark opacity-0 shadow-lg ring-1 ring-black/5 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block">
            {infobulle}
          </span>
          {/* Les petits boutons sont centrés sur l'axe du bouton WhatsApp (56 px). */}
          <span className={cn("flex justify-center", !principal && "w-14")}>
            <span
              className={cn(
                "flex items-center justify-center rounded-full text-white shadow-lg shadow-black/15 transition-transform duration-200 group-hover:scale-105 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-black/15",
                principal ? "size-14" : "size-11"
              )}
              style={{ backgroundColor: couleur }}
            >
              <Icone className={principal ? "size-7" : "size-5"} aria-hidden="true" />
            </span>
          </span>
        </a>
      ))}
    </nav>
  )
}
