"use client"

import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { ServicesDetailed } from "@/components/sections/services-detailed"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"

export default function ServicesPage() {
  return (
    <>
      <ScrollToTop />
      <HeaderPro />
      <main className="relative min-h-screen pt-[148px] md:pt-[164px]">
        <ServicesDetailed />
      </main>
      <Footer />
    </>
  )
}

