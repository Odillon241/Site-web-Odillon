"use client"

import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { AboutDetailed } from "@/components/sections/about-detailed"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { InteractiveGridPattern } from "@/components/ui/shadcn-io/interactive-grid-pattern"

export function AboutPageClient() {
  return (
    <>
      {/* Background avec grille interactive inclinée */}
      <div className="fixed inset-0 w-screen h-screen -z-10 bg-transparent overflow-hidden">
        <InteractiveGridPattern
          width={40}
          height={40}
          squares={[60, 60]}
          className="inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        />
      </div>

      <ScrollProgress />
      <ScrollToTop />
      <HeaderPro />
      <main className="relative min-h-screen pt-[88px] md:pt-[104px]">
        <AboutDetailed />
      </main>
      <Footer />
    </>
  )
}

