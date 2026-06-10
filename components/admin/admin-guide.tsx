"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  X,
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
    title: "Logos Partenaires",
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
      "Supporté: YouTube, Vimeo, vidéos directes",
      "Catégories: Présentation ou Témoignage",
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
    title: "À Propos",
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
    title: "Paramètres Site",
    icon: Settings,
    items: [
      "Activez/désactivez sections entières",
      "Configuration globale du site",
    ],
  },
]

export function AdminGuide() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="fixed bottom-4 right-4 z-50 border-slate-200 bg-white shadow-lg hover:bg-slate-50"
      >
        <BookOpen className="mr-2 h-4 w-4 text-odillon-teal" />
        Guide d'utilisation
      </Button>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200/80 bg-slate-50/60">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-950">Guide d'utilisation du panneau d'administration</h4>
            <p className="text-xs text-slate-500">Repères rapides pour les sections les plus utilisées.</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-slate-400 hover:bg-white hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        {guideSections.map((section) => {
          const Icon = section.icon

          return (
            <div key={section.title} className="rounded-md border border-slate-200/80 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-odillon-teal/[0.08] text-odillon-teal">
                  <Icon className="h-4 w-4" />
                </div>
                <h5 className="font-semibold text-slate-900">{section.title}</h5>
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

      <div className="mx-5 mb-5 rounded-md border border-odillon-lime/30 bg-odillon-lime/[0.08] p-3">
        <p className="mb-1 text-sm font-medium text-slate-900">Conseil</p>
        <p className="text-sm leading-relaxed text-slate-600">
          Utilisez les onglets ci-dessous pour naviguer entre les différentes sections. Les changements sont sauvegardés automatiquement. Pensez à vérifier l'aperçu en direct sur le site.
        </p>
      </div>
    </div>
  )
}
