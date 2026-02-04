import { Metadata } from "next"
import dynamic from "next/dynamic"
const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then(mod => mod.HeaderPro))
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { BlogArticlesGrid } from "@/components/sections/blog-articles-grid"
import { BlogHero } from "@/components/blog/blog-hero"
import { NewsletterSection } from "@/components/sections/newsletter-section"

export const metadata: Metadata = {
    title: "Blog | Odillon - Actualités et Conseils en Stratégie d'Entreprise",
    description: "Découvrez nos derniers articles sur la gouvernance, le management des risques, les ressources humaines et bien plus.",
}

interface Article {
    id: string
    title: string
    slug: string
    excerpt: string
    cover_image: string | null
    category: string
    author: string
    read_time: string
    published_at: string
}

export default async function BlogPage() {
    const supabase = await createClient()

    const { data: articles } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, cover_image, category, author, read_time, published_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    const { data: settings } = await supabase
        .from('site_settings')
        .select('show_blog_banner, blog_banner_image_url, blog_banner_link')
        .eq('id', 'main')
        .single()

    return (
        <>
            <HeaderPro />
            <main className="min-h-screen pt-[148px] md:pt-[164px] bg-gray-50/30">
                <BlogHero settings={settings} />

                {/* Articles Grid */}
                <section className="py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <BlogArticlesGrid articles={articles || []} />
                    </div>
                </section>

                <NewsletterSection />
            </main>
            <Footer />
        </>
    )
}
