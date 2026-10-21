import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { RendezVousForm } from "@/components/sections/rendez-vous-form"

export const metadata = {
  title: "Prendre rendez-vous | Odillon - Ingénierie d'Entreprises",
  description:
    "Demandez un rendez-vous de 30 minutes avec Odillon : au bureau à Libreville, par téléphone ou en visioconférence.",
}

export default function Page() {
  return (
    <>
      <ScrollToTop />
      <HeaderPro />
      <main id="contenu" tabIndex={-1} className="outline-none relative min-h-screen pt-14 md:pt-16">
        <section className="od-section py-12 md:py-16">
          <div className="od-container">
            <div className="mb-10 max-w-2xl md:mb-12">
              <h1 className="od-heading-display text-4xl md:text-5xl">Prendre rendez-vous</h1>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                Choisissez un jour et un créneau : nous vous confirmons le rendez-vous rapidement.
              </p>
            </div>
            <RendezVousForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
