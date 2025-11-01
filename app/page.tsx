import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { TrustedByHome } from "@/components/sections/trusted-by-home"
import { ServicesHome } from "@/components/sections/services-home"
import { ExpertiseHome } from "@/components/sections/expertise-home"
import { AboutHome } from "@/components/sections/about-home"
import { ContactHome } from "@/components/sections/contact-home"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <HeaderPro />
      <main className="min-h-screen pt-[88px] md:pt-[104px]">
        <Hero />
        <TrustedByHome />
        <ServicesHome />
        <ExpertiseHome />
        <AboutHome />
        <ContactHome />
      </main>
      <Footer />
    </>
  )
}
