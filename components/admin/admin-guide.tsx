"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  ChevronDown,
  Image,
  Building2,
  Video,
  Quote,
  Settings,
  CalendarDays,
  ChevronRight,
  Users,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type GuideSection = {
  title: string
  icon: LucideIcon
  badge?: string
  items: string[]
}

const guideSections: GuideSection[] = [
  {
    title: "Photos Hero",
    icon: Image,
    badge: "Principal",
    items: [
      "Gérez les images du carrousel en haut de page",
      "Filtrez par mois/thème pour les campagnes (Octobre Rose, etc.)",
      "Activez/désactivez pour contrôler la visibilité",
    ],
  },
  {
    title: "Logos partenaires",
    icon: Building2,
    items: [
      "Ajoutez les logos des entreprises partenaires",
      "Ordre d'affichage modifiable par glisser-déposer",
    ],
  },
  {
    title: "Vidéos",
    icon: Video,
    items: [
      "Supporté : YouTube, Vimeo, vidéos directes",
      "Catégories : Présentation ou Témoignage",
    ],
  },
  {
    title: "Témoignages",
    icon: Quote,
    items: [
      "Citations de clients satisfaits",
      "Affichez photo, nom et poste du client",
    ],
  },
  {
    title: "Équipe",
    icon: Users,
    items: [
      "Gérez les membres de l'équipe et la direction",
      "Ordre modifiable par glisser-déposer",
    ],
  },
  {
    title: "À propos",
    icon: Target,
    items: [
      "Définissez la mission et la description",
      "Gérez les valeurs (icônes, couleurs)",
    ],
  },
  {
    title: "Expertise CTA",
    icon: Sparkles,
    items: [
      "Personnalisez la bannière d'appel à l'action",
      "Modifiez titre, bouton et image de fond",
    ],
  },
  {
    title: "Calendrier Gabon",
    icon: CalendarDays,
    items: [
      "Visualisez les jours fériés et événements",
      "Utile pour planifier les campagnes thématiques",
    ],
  },
  {
    title: "Paramètres du site",
    icon: Settings,
    items: [
      "Activez/désactivez sections entières",
      "Configuration globale du site",
    ],
  },
]

export function AdminGuide() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-odillon-teal sm:px-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
            <BookOpen className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-950">Guide d'utilisation</h2>
            <p className="text-[13px] text-slate-500">Repères rapides pour les sections les plus utilisées.</p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="border-t border-slate-200/80 bg-[#f7f9f8]">
          <div className="grid gap-x-8 gap-y-6 p-5 sm:p-6 md:grid-cols-2">
            {guideSections.map((section) => {
              const Icon = section.icon

              return (
                <div key={section.title}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-odillon-teal/[0.08] text-odillon-teal">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-semibold text-slate-900">{section.title}</h3>
                    {section.badge && (
                      <Badge variant="outline" className="border-odillon-lime/40 bg-odillon-lime/10 text-[10px] font-medium text-slate-700">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <ul className="ml-9 space-y-1.5 text-sm text-slate-600">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-odillon-teal" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="mx-5 mb-5 rounded-lg border border-odillon-lime/30 bg-odillon-lime/[0.08] p-4 sm:mx-6 sm:mb-6">
            <p className="mb-1 text-sm font-medium text-slate-900">Conseil</p>
            <p className="text-sm leading-relaxed text-slate-600">
              Naviguez entre les sections via le menu latéral ou la recherche (Ctrl K). Les changements
              sont sauvegardés automatiquement — pensez à vérifier le rendu en direct sur le site.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
