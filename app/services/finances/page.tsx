import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { ServiceSingle } from "@/components/sections/service-single"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { servicesData } from "@/lib/services-data"

export const metadata = {
  title: "Conseil Financier | Odillon - Ingénierie d'Entreprises",
  description: "De l'élaboration du business plan à la levée de fonds, structurez votre stratégie financière pour maximiser vos performances.",
}

export default function FinancesPage() {
  const service = servicesData.find(s => s.id === "finances")
  
  if (!service) {
    return null
  }

  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <HeaderPro />
      <main className="min-h-screen pt-[88px] md:pt-[104px]">
        <ServiceSingle service={service} />
      </main>
      <Footer />
    </>
  )
}


