import { use } from "react"
import type { Metadata } from "next"
import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { Contact } from "@/components/sections/contact"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"

export const metadata: Metadata = {
  title: "Contact | Odillon - Ingénierie d'Entreprises",
  description:
    "Contactez Odillon, cabinet de conseil en ingénierie d'entreprises à Libreville, Gabon. Discutons de vos projets en gouvernance, finances, capital humain et accompagnement juridique.",
  openGraph: {
    title: "Contact | Odillon - Ingénierie d'Entreprises",
    description:
      "Contactez Odillon, cabinet de conseil en ingénierie d'entreprises à Libreville, Gabon.",
    url: "https://www.odillon.fr/contact",
  },
}

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
      <main className="min-h-screen pt-[88px] md:pt-[104px]">
        <Contact />
      </main>
      <Footer />
    </>
  )
}

