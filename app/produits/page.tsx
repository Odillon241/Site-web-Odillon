import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { ProduitsPage } from "@/components/sections/produits-page"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"

export const metadata = {
  title: "Nos produits | Odillon - Ingénierie d'Entreprises",
  description:
    "Produits Odillon : gouvernance, administration RH, juridique, entrepreneuriat (packs Odillon Start, Project et Grow) et formation.",
}

export default function Page() {
  return (
    <>
      <ScrollToTop />
      <HeaderPro />
      <main className="relative min-h-screen pt-[88px] md:pt-[104px] pb-10 md:pb-14">
        <ProduitsPage />
      </main>
      <Footer />
    </>
  )
}
