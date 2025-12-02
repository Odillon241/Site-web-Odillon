import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { ServiceSingle } from "@/components/sections/service-single"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { servicesData } from "@/lib/services-data"

export const metadata = {
  title: "Ressources Humaines | Odillon - Ingénierie d'Entreprises",
  description: "De la stratégie RH à la gestion des talents, développez une organisation performante centrée sur l'humain.",
}

export default function RessourcesHumainesPage() {
  const service = servicesData.find(s => s.id === "ressources-humaines")
  
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


