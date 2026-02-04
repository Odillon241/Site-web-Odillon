import { use } from "react"
import dynamic from "next/dynamic"
const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then(mod => mod.HeaderPro), { ssr: true })
import { Footer } from "@/components/layout/footer"
import { ServiceSingle } from "@/components/sections/service-single"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { servicesData } from "@/lib/services-data"

export const metadata = {
  title: "Conseil Financier | Odillon - Ingénierie d'Entreprises",
  description: "De l'élaboration du business plan à la levée de fonds, structurez votre stratégie financière pour maximiser vos performances.",
}

export default function FinancesPage({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}) {
  // Unwrap promises to prevent DevTools enumeration warnings
  use(params)
  use(searchParams)
  const service = servicesData.find(s => s.id === "finances")

  if (!service) {
    return null
  }

  return (
    <>
      <ScrollToTop />
      <HeaderPro />
      <main className="min-h-screen pt-[148px] md:pt-[164px]">
        <ServiceSingle service={service} />
      </main>
      <Footer />
    </>
  )
}





