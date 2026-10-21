
import dynamic from "next/dynamic"
import { HeaderPro } from "@/components/layout/header-pro"
import { SiteOpening } from "@/components/layout/site-opening"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { ExpertiseHome } from "@/components/sections/expertise-home"
import { VideoSection } from "@/components/sections/video-section"
import { MondayMotivationSection } from "@/components/sections/monday-motivation-section"
import { ProchaineFormation } from "@/components/sections/prochaine-formation"
import { estComplet, type Formation } from "@/types/formation"
import { createClient } from "@/lib/supabase/server"

// Produits, À propos, Blog et Contact ont chacun leur onglet : l'accueil ne les
// répète pas.

// Lazy load components below the fold (not visible initially)
const TestimonialsSection = dynamic(() => import("@/components/sections/testimonials-section").then(mod => ({ default: mod.TestimonialsSection })), {
  loading: () => null,
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

  // Fetch Homepage Video
  const { data: videosData } = await supabase
    .from('videos')
    .select('*')
    .eq('is_active', true)

  // Vidéo Hero (pour le background du hero)
  const heroVideo = videosData?.find(v => v.page === 'Accueil' && v.section === 'Hero' && v.is_active) || null
  // Vidéo de contenu (pour la section vidéo séparée)
  const contentVideo = videosData?.find(v => v.page === 'Accueil' && v.section === 'Contenu' && v.is_active) || null
  // Vidéo Monday Motivation (actualité de la semaine) : la plus récente par
  // date renseignée, pas la première trouvée — plusieurs vidéos peuvent être
  // actives à la fois (archive consultable sur /monday-motivation).
  const mondayMotivationVideos = (videosData || [])
    .filter(v => v.page === 'Accueil' && v.section === 'MondayMotivation' && v.is_active)
    .sort((a, b) => {
      const dateA = a.video_date || a.created_at || ''
      const dateB = b.video_date || b.created_at || ''
      return dateB.localeCompare(dateA)
    })
  const mondayMotivationVideo = mondayMotivationVideos[0] || null

  // Prochaine session ouverte aux inscriptions (le bandeau disparaît s'il n'y en a pas)
  const aujourdHui = new Date().toISOString().slice(0, 10)
  const { data: sessions } = await supabase
    .from('formations')
    .select('*')
    .eq('is_active', true)
    .gte('date_debut', aujourdHui)
    .order('date_debut', { ascending: true })
    .limit(10)
  const prochaineFormation = ((sessions as Formation[]) || []).find(
    (f) => f.inscriptions_ouvertes !== false && !estComplet(f)
  ) || null

  return (
    <>
      <SiteOpening />
      <ScrollToTop />
      <HeaderPro />
      <main id="contenu" tabIndex={-1} className="outline-none min-h-screen pt-14 md:pt-16">
        <Hero logos={logos || []} video={heroVideo} />
        <ProchaineFormation formation={prochaineFormation} />
        <MondayMotivationSection video={mondayMotivationVideo} />
        <ExpertiseHome />
        <RiskManagementSection />
        <VideoSection video={contentVideo} />
        <TestimonialsSection page="Accueil" limit={3} />
        <FaqHome />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
