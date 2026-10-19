import { use } from "react"
import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { Contact } from "@/components/sections/contact"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"

export default function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}) {
  // Unwrap promises to prevent DevTools enumeration warnings
  use(params)
  use(searchParams)
  return (
    <>
      <ScrollToTop />
      <HeaderPro />
      <main id="contenu" tabIndex={-1} className="outline-none min-h-screen pt-14 md:pt-16">
        <Contact />
      </main>
      <Footer />
    </>
  )
}

