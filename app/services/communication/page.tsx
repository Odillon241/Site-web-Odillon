import { use } from "react"
import dynamic from "next/dynamic"
const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then(mod => mod.HeaderPro), { ssr: true })
import { Footer } from "@/components/layout/footer"
import { ServiceSingle } from "@/components/sections/service-single"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { servicesData } from "@/lib/services-data"

export const metadata = {
  title: "Communication | Odillon - Ingénierie d'Entreprises",
  description: "La communication est l'ensemble des interactions avec autrui qui transmettent une quelconque information.",
}

export default function CommunicationPage({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}) {
  use(params)
  use(searchParams)
  const service = servicesData.find(s => s.id === "communication")

  if (!service) {
    return null
  }

  return (
    <>
      <ScrollToTop />
      <HeaderPro />
      <main className="min-h-screen pt-[88px] md:pt-[104px]">
        <ServiceSingle service={service} />
      </main>
      <Footer />
    </>
  )
}
