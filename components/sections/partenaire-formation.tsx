import { Mail, MapPin, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { PARTENAIRE_FORMATION } from "@/lib/produits-data"

/** Coordonnées du partenaire qui anime les formations (calendrier, inscription). */
export function ContactPartenaireFormation({ className }: { className?: string }) {
  const { nom, telephone, telephoneHref, email, adresse } = PARTENAIRE_FORMATION

  return (
    <div className={cn("text-sm text-gray-600", className)}>
      <p className="font-semibold text-odillon-dark">{nom} : notre partenaire formation</p>
      <ul className="mt-2.5 space-y-2">
        <li className="flex items-center gap-2">
          <Phone className="size-4 shrink-0 text-odillon-teal" aria-hidden="true" />
          <a href={telephoneHref} className="tabular-nums hover:text-odillon-teal">{telephone}</a>
        </li>
        <li className="flex items-center gap-2">
          <Mail className="size-4 shrink-0 text-odillon-teal" aria-hidden="true" />
          <a href={`mailto:${email}`} className="break-all hover:text-odillon-teal">{email}</a>
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-odillon-teal" aria-hidden="true" />
          {adresse}
        </li>
      </ul>
    </div>
  )
}
