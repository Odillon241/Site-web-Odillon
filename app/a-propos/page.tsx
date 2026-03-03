import { use } from "react"
import { AboutPageClient } from "@/components/pages/about-page-client"

export const metadata = {
  title: "À Propos | Odillon - Ingénierie d'Entreprises",
  description: "Découvrez l'histoire, la mission et les valeurs d'Odillon, votre partenaire de confiance en ingénierie d'entreprises.",
}

export default function AboutPage({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}) {
  // Unwrap promises to prevent DevTools enumeration warnings
  use(params)
  use(searchParams)

  return <AboutPageClient />
}

