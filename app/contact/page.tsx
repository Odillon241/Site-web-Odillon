import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { Contact } from "@/components/sections/contact"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"

export default function ContactPage() {
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <HeaderPro />
      <main className="min-h-screen pt-[104px]">
        <Contact />
      </main>
      <Footer />
    </>
  )
}

