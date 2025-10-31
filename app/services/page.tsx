import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { ServicesDetailed } from "@/components/sections/services-detailed"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"

export const metadata = {
  title: "Nos Services | Odillon - Ingénierie d'Entreprises",
  description: "Découvrez nos services en gouvernance, juridique, finances et ressources humaines. Solutions complètes pour votre entreprise.",
}

export default function ServicesPage() {
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <HeaderPro />
      <main className="min-h-screen pt-[104px]">
        <ServicesDetailed />
      </main>
      <Footer />
    </>
  )
}

