import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { ServiceSingle } from "@/components/sections/service-single"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { servicesData } from "@/lib/services-data"

export const metadata = {
  title: "Services Juridiques | Odillon - Ingénierie d'Entreprises",
  description: "Bénéficiez d'un accompagnement juridique complet et externalisé pour tous vos besoins contractuels et réglementaires.",
}

export default function JuridiquePage() {
  const service = servicesData.find(s => s.id === "juridique")
  
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


