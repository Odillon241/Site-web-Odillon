import { use } from "react"
import dynamic from "next/dynamic"
const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then(mod => mod.HeaderPro), { ssr: true })
import { Footer } from "@/components/layout/footer"
import { ServiceSingle } from "@/components/sections/service-single"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { servicesData } from "@/lib/services-data"

export const metadata = {
  title: "Capital Humain | Odillon - Ingénierie d'Entreprises",
  description: "De la stratégie RH à la gestion des talents, développez une organisation performante centrée sur l'humain.",
}

export default function RessourcesHumainesPage({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}) {
  // Unwrap promises to prevent DevTools enumeration warnings
  use(params)
  use(searchParams)
  const service = servicesData.find(s => s.id === "ressources-humaines")

  if (!service) {
    return null
  }

  return (
    <>
      <ScrollToTop />
      <HeaderPro />
      <main className="min-h-screen pt-[88px]">
        <ServiceSingle service={service} />
      </main>
      <Footer />
    </>
  )
}





