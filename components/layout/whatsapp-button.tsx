"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Facebook, Linkedin, MessageCircle, Plus, type LucideIcon } from "lucide-react"
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

/** Ordinateur : les trois boutons empilés, avec infobulle au survol. */
function PileBureau() {
  return (
    <nav aria-label="Réseaux et messagerie" className="fixed bottom-8 right-8 z-40 hidden flex-col items-end gap-3 md:flex">
      {BOUTONS.map(({ href, libelle, infobulle, icone: Icone, couleur, principal }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={libelle}
          className="group flex items-center gap-3"
        >
          <span className="pointer-events-none translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-odillon-dark opacity-0 shadow-lg ring-1 ring-black/5 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
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

/**
 * Mobile : un seul bouton, qui déplie les trois canaux avec leur libellé.
 * Trois pastilles en permanence masquaient le contenu sur un petit écran.
 */
function MenuMobile() {
  const [ouvert, setOuvert] = useState(false)
  const pathname = usePathname()

  // Se referme au changement de page et à la touche Échap.
  useEffect(() => setOuvert(false), [pathname])
  useEffect(() => {
    if (!ouvert) return
    const echap = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false)
    window.addEventListener("keydown", echap)
    return () => window.removeEventListener("keydown", echap)
  }, [ouvert])

  return (
    <div className="md:hidden">
      {ouvert && (
        <button
          type="button"
          aria-label="Fermer le menu de contact"
          tabIndex={-1}
          onClick={() => setOuvert(false)}
          className="fixed inset-0 z-40 bg-odillon-dark/30 backdrop-blur-[2px]"
        />
      )}
      <nav aria-label="Réseaux et messagerie" className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
        {/* Classe et non attribut hidden : « flex » l'emporterait sur [hidden]. */}
        <ul id="menu-contact" className={cn("flex-col items-end gap-2.5", ouvert ? "flex" : "hidden")}>
          {BOUTONS.map(({ href, libelle, infobulle, icone: Icone, couleur }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={libelle}
                onClick={() => setOuvert(false)}
                className="flex items-center gap-3 rounded-full bg-white py-1.5 pl-4 pr-1.5 text-sm font-semibold text-odillon-dark shadow-lg ring-1 ring-black/5"
              >
                {infobulle}
                <span className="flex size-10 items-center justify-center rounded-full text-white" style={{ backgroundColor: couleur }}>
                  <Icone className="size-5" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-expanded={ouvert}
          aria-controls="menu-contact"
          aria-label={ouvert ? "Fermer le menu de contact" : "Nous contacter : WhatsApp, LinkedIn, Facebook"}
          onClick={() => setOuvert((o) => !o)}
          className={cn(
            "flex size-[52px] items-center justify-center rounded-full text-white shadow-lg shadow-black/20 transition-colors",
            ouvert ? "bg-odillon-dark" : "bg-[#25D366]"
          )}
        >
          {ouvert ? (
            <Plus className="size-6 rotate-45 transition-transform" aria-hidden="true" />
          ) : (
            <MessageCircle className="size-6" aria-hidden="true" />
          )}
        </button>
      </nav>
    </div>
  )
}

export function WhatsAppButton() {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  return (
    <>
      <PileBureau />
      <MenuMobile />
    </>
  )
}
