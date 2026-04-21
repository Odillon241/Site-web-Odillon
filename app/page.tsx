import dynamic from "next/dynamic"
import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"

const TrustedByHome = dynamic(() => import("@/components/sections/trusted-by-home").then(m => ({ default: m.TrustedByHome })))
const ServicesHome = dynamic(() => import("@/components/sections/services-home").then(m => ({ default: m.ServicesHome })))
const ExpertiseHome = dynamic(() => import("@/components/sections/expertise-home").then(m => ({ default: m.ExpertiseHome })))
const AboutHome = dynamic(() => import("@/components/sections/about-home").then(m => ({ default: m.AboutHome })))
const ContactHome = dynamic(() => import("@/components/sections/contact-home").then(m => ({ default: m.ContactHome })))

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
