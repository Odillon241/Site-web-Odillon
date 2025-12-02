import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { ServiceSingle } from "@/components/sections/service-single"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { servicesData } from "@/lib/services-data"

export const metadata = {
  title: "Gouvernance d'Entreprise | Odillon - Ingénierie d'Entreprises",
  description: "Structurez votre organisation avec des mécanismes de gouvernance robustes et transparents qui inspirent confiance et performance.",
}

export default function GouvernancePage() {
  const service = servicesData.find(s => s.id === "gouvernance")
  
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



