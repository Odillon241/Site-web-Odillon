"use client"

import { usePathname } from "next/navigation"
import { MessageCircle } from "lucide-react"

const NUMERO = "24174759515"
const MESSAGE = "Bonjour Odillon, je souhaite échanger avec vous."

export function WhatsAppButton() {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  return (
    <a
      href={`https://wa.me/${NUMERO}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire à Odillon sur WhatsApp"
      className="group fixed bottom-8 right-8 z-40 flex items-center gap-3"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-odillon-dark opacity-0 shadow-lg ring-1 ring-black/5 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block">
        Écrivez-nous sur WhatsApp
      </span>
      <span className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition-transform duration-200 group-hover:scale-105 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-[#25D366]/40">
        <MessageCircle className="size-7" aria-hidden="true" />
      </span>
    </a>
  )
}
