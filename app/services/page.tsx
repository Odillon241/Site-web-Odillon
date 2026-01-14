"use client"

import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { ServicesDetailed } from "@/components/sections/services-detailed"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"

export default function ServicesPage() {
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <HeaderPro />
      <main className="relative min-h-screen pt-[88px]">
        <ServicesDetailed />
      </main>
      <Footer />
    </>
  )
}

