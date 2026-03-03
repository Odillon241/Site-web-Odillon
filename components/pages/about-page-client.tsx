"use client"

import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { AboutDetailed } from "@/components/sections/about-detailed"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"

export function AboutPageClient() {
  return (
    <>
      {/* Background subtil */}
      <div className="fixed inset-0 w-screen h-screen -z-10 bg-transparent overflow-hidden" />

      <ScrollToTop />
      <HeaderPro />
      <main className="relative min-h-screen pt-[88px] md:pt-[104px]">
        <AboutDetailed />
      </main>
      <Footer />
    </>
  )
}

