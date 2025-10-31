import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { AboutDetailed } from "@/components/sections/about-detailed"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"

export const metadata = {
  title: "À Propos | Odillon - Ingénierie d'Entreprises",
  description: "Découvrez l'histoire, la mission et les valeurs d'Odillon, votre partenaire de confiance en ingénierie d'entreprises.",
}

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <HeaderPro />
      <main className="min-h-screen pt-[104px]">
        <AboutDetailed />
      </main>
      <Footer />
    </>
  )
}

