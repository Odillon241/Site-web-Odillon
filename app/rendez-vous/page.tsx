import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { RendezVousForm } from "@/components/sections/rendez-vous-form"

export const metadata = {
  title: "Prendre rendez-vous | Odillon - Ingénierie d'Entreprises",
  description:
    "Demandez un rendez-vous de 30 minutes avec Odillon : nous venons dans vos locaux ou échangeons en visioconférence.",
}

export default function Page() {
  return (
    <>
      <ScrollToTop />
      <HeaderPro />
      <main id="contenu" tabIndex={-1} className="outline-none relative min-h-screen pt-14 md:pt-16">
        <section className="od-section py-8 md:py-10">
          <div className="od-container max-w-3xl">
            <div className="mb-4">
              <h1 className="od-heading-display text-3xl md:text-4xl">Prendre rendez-vous</h1>
              <p className="mt-2 text-base text-gray-600">
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
