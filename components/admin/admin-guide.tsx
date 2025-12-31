"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Target
} from "lucide-react"

export function AdminGuide() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Guide d'utilisation
      </Button>
    )
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <BookOpen className="w-5 h-5" />
            Guide d'utilisation du panneau d'administration
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-blue-700 hover:text-blue-900"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Photos Hero */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500 text-white">
                <Image className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-blue-900">Photos Hero</h3>
              <Badge variant="secondary" className="text-xs">Principal</Badge>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Gérez les images du carrousel en haut de page</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Filtrez par mois/thème pour les campagnes (Octobre Rose, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Activez/désactivez pour contrôler la visibilité</span>
              </li>
            </ul>
          </div>

          {/* Logos */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-500 text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-blue-900">Logos Partenaires</h3>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Ajoutez les logos des entreprises partenaires</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Ordre d'affichage modifiable par glisser-déposer</span>
              </li>
            </ul>
          </div>

          {/* Vidéos */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500 text-white">
                <Video className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-blue-900">Vidéos</h3>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Supporté: YouTube, Vimeo, vidéos directes</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Catégories: Présentation ou Témoignage</span>
              </li>
            </ul>
          </div>

          {/* Témoignages */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500 text-white">
                <Quote className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-blue-900">Témoignages</h3>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Citations de clients satisfaits</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Affichez photo, nom et poste du client</span>
              </li>
            </ul>
          </div>

          {/* Equipe */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500 text-white">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-blue-900">Équipe</h3>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Gérez les membres de l'équipe et la direction</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Ordre modifiable par glisser-déposer</span>
              </li>
            </ul>
          </div>

          {/* À Propos */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500 text-white">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-blue-900">À Propos</h3>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Définissez la mission et la description</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Gérez les valeurs (icônes, couleurs)</span>
              </li>
            </ul>
          </div>

          {/* Expertise CTA */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-blue-900">Expertise CTA</h3>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Personnalisez la bannière d'appel à l'action</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Modifiez titre, bouton et image de fond</span>
              </li>
            </ul>
          </div>

          {/* Calendrier */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-500 text-white">
                <CalendarDays className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-blue-900">Calendrier Gabon</h3>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Visualisez les jours fériés et événements</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Utile pour planifier les campagnes thématiques</span>
              </li>
            </ul>
          </div>

          {/* Paramètres */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gray-500 text-white">
                <Settings className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-blue-900">Paramètres Site</h3>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Activez/désactivez sections entières</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Configuration globale du site</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mt-4">
          <p className="text-sm text-blue-900 font-medium mb-1">💡 Conseil</p>
          <p className="text-sm text-blue-800">
            Utilisez les onglets ci-dessous pour naviguer entre les différentes sections.
            Les changements sont sauvegardés automatiquement. Pensez à vérifier l'aperçu en direct sur le site.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
