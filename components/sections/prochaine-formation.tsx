import Link from "next/link"
import { ArrowRight, CalendarDays, GraduationCap, MapPin, Users } from "lucide-react"
import { MODALITE_LABELS, placesRestantes, type Formation } from "@/types/formation"

function periode(f: Formation): string {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
  const debut = new Date(f.date_debut + "T00:00:00")
  if (!f.date_fin || f.date_fin === f.date_debut) return debut.toLocaleDateString("fr-FR", options)
  const fin = new Date(f.date_fin + "T00:00:00")
  const memeMois = debut.getMonth() === fin.getMonth() && debut.getFullYear() === fin.getFullYear()
  const debutCourt = memeMois
    ? String(debut.getDate())
    : debut.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
  return `${debutCourt} – ${fin.toLocaleDateString("fr-FR", options)}`
}

export function ProchaineFormation({ formation }: { formation: Formation | null }) {
  if (!formation) return null

  const restantes = placesRestantes(formation)
  const lieu = formation.lieu || (formation.modalite ? MODALITE_LABELS[formation.modalite] : null)

  return (
    <section aria-labelledby="prochaine-formation-titre" className="py-8 md:py-10">
      <div className="od-container">
        <div className="od-surface flex flex-col gap-5 border-l-4 border-l-odillon-teal p-5 md:flex-row md:items-center md:gap-8 md:p-6">
          <span className="hidden size-12 shrink-0 items-center justify-center rounded-lg bg-odillon-teal/10 text-odillon-teal md:flex">
            <GraduationCap className="size-6" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-odillon-teal">Prochaine formation</p>
            <h2 id="prochaine-formation-titre" className="mt-1 text-lg font-semibold text-odillon-dark md:text-xl">
              {formation.titre}
            </h2>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
              <li className="flex items-center gap-1.5">
                <CalendarDays className="size-4 text-gray-400" aria-hidden="true" />
                {periode(formation)}
              </li>
              {lieu && (
                <li className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-gray-400" aria-hidden="true" />
                  {lieu}
                </li>
              )}
              {restantes !== null && restantes > 0 && (
                <li className="flex items-center gap-1.5 tabular-nums">
                  <Users className="size-4 text-gray-400" aria-hidden="true" />
                  {restantes} place{restantes > 1 ? "s" : ""} restante{restantes > 1 ? "s" : ""}
                </li>
              )}
            </ul>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link
              href={`/formations/${formation.id}/inscription`}
              className="group inline-flex items-center gap-2 rounded-md bg-odillon-teal px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-odillon-teal/90"
            >
              S&apos;inscrire
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/calendrier-formations"
              className="rounded-md px-3 py-3 text-sm font-semibold text-odillon-dark transition-colors hover:text-odillon-teal"
            >
              Tout le calendrier
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
