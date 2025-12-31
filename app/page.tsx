
import dynamic from "next/dynamic"
import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { TrustedByHome } from "@/components/sections/trusted-by-home"
import { ServicesHome } from "@/components/sections/services-home"
import { ExpertiseHome } from "@/components/sections/expertise-home"
import { CtaBanner } from "@/components/sections/cta-banner"
import { VideoSection } from "@/components/sections/video-section"
import { createClient } from "@/lib/supabase/server"

// Lazy load components below the fold (not visible initially)
const AboutHome = dynamic(() => import("@/components/sections/about-home").then(mod => ({ default: mod.AboutHome })), {
  loading: () => <div className="min-h-[400px]" />,
})
const TestimonialsSection = dynamic(() => import("@/components/sections/testimonials-section").then(mod => ({ default: mod.TestimonialsSection })), {
  loading: () => null,
})
const ContactHome = dynamic(() => import("@/components/sections/contact-home").then(mod => ({ default: mod.ContactHome })), {
  loading: () => <div className="min-h-[600px]" />,
})

// Lazy load UI enhancement components (client-only)
const ScrollProgress = dynamic(() => import("@/components/magicui/scroll-progress").then(mod => ({ default: mod.ScrollProgress })))
const ScrollToTop = dynamic(() => import("@/components/magicui/scroll-to-top").then(mod => ({ default: mod.ScrollToTop })))

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}) {
  // Await the promises
  await params
  await searchParams

  // Fetch trusted companies
  const supabase = await createClient()
  const { data: logos } = await supabase
    .from('company_logos')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

    .order('display_order', { ascending: true })

  // Fetch Homepage Video
  const { data: videosData } = await supabase
    .from('videos')
    .select('*')
    .eq('is_active', true)

  const homeVideo = videosData?.find(v => v.page === 'Accueil' && (v.section === 'Contenu' || v.section === 'Hero')) || null

  // Fetch site settings for CTA
  const { data: requestSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  const settings = requestSettings || {}

  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <HeaderPro />
      <main className="min-h-screen pt-[88px] md:pt-[104px]">
        <Hero />
        <TrustedByHome logos={logos || []} />
        <ServicesHome />
        <ExpertiseHome />
        <VideoSection video={homeVideo} />
        <CtaBanner
          title={settings.expertise_cta_title || "Découvrez notre expertise approfondie et nos méthodologies éprouvées"}
          description={settings.expertise_cta_description || ""}
          buttonText={settings.expertise_cta_button_text || "En savoir plus sur notre expertise"}
          buttonHref={settings.expertise_cta_button_link || "/expertise"}
          badgeText={settings.expertise_cta_badge_text || "Expertise"}
          imageUrl={settings.services_cta_image_url} // Reusing this field as per admin implementation
        />
        <AboutHome />
        <TestimonialsSection page="Accueil" limit={3} />
        <ContactHome />
      </main>
      <Footer />
    </>
  )
}
