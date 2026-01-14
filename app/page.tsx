
import dynamic from "next/dynamic"
import { HeaderPro } from "@/components/layout/header-pro"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
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
const BlogHome = dynamic(() => import("@/components/sections/blog-home").then(mod => ({ default: mod.BlogHome })), {
  loading: () => <div className="min-h-[400px]" />,
})
const FaqHome = dynamic(() => import("@/components/sections/faq-home").then(mod => ({ default: mod.FaqHome })), {
  loading: () => <div className="min-h-[300px]" />,
})
const NewsletterSection = dynamic(() => import("@/components/sections/newsletter-section").then(mod => ({ default: mod.NewsletterSection })), {
  loading: () => null,
})
const RiskManagementSection = dynamic(() => import("@/components/sections/risk-management-section").then(mod => ({ default: mod.RiskManagementSection })), {
  loading: () => <div className="min-h-[500px]" />,
})

// Lazy load UI enhancement components (client-only)
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

    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  // Fetch Homepage Video
  const { data: videosData } = await supabase
    .from('videos')
    .select('*')
    .eq('is_active', true)

  // Fetch Latest Articles
  const { data: latestArticles } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, cover_image, category, author, read_time, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  const homeVideo = videosData?.find(v => v.page === 'Accueil' && (v.section === 'Contenu' || v.section === 'Hero')) || null

  // Fetch site settings for CTA
  const { data: requestSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  const settings = requestSettings || {}

  return (
    <>
      <ScrollToTop />
      <HeaderPro />
      <main className="min-h-screen pt-[88px]">
        <Hero logos={logos || []} />
        <ServicesHome />
        <ExpertiseHome />
        <RiskManagementSection />
        <VideoSection video={homeVideo} />
        <CtaBanner
          title={settings.expertise_cta_title || "Découvrez notre expertise approfondie et nos méthodologies éprouvées"}
          description={settings.expertise_cta_description || ""}
          buttonText={settings.expertise_cta_button_text || "En savoir plus sur notre expertise"}
          buttonHref={settings.expertise_cta_button_link || "/services"}
          badgeText={settings.expertise_cta_badge_text || "Expertise"}
          imageUrl={settings.services_cta_image_url} // Reusing this field as per admin implementation
        />
        <AboutHome />
        <BlogHome articles={latestArticles || []} />
        <TestimonialsSection page="Accueil" limit={3} />
        <FaqHome />
        <NewsletterSection />
        <ContactHome />
      </main>
      <Footer />
    </>
  )
}
