import { Metadata } from "next"
import dynamic from "next/dynamic"
const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then(mod => mod.HeaderPro))
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { BlogPageClient } from "@/components/blog/blog-page-client"
import { BlogNewsletter } from "@/components/blog/blog-newsletter"

export const metadata: Metadata = {
    title: "Publications | Odillon - Analyses et repères en ingénierie d'entreprises",
    description: "Analyses, repères méthodologiques et retours de mission de nos consultants sur la gouvernance, la maîtrise des risques et le capital humain.",
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
            <main className="min-h-screen pt-[88px] md:pt-[104px]">
                <BlogPageClient articles={articles || []} settings={settings} />
                <BlogNewsletter />
            </main>
            <Footer />
        </>
    )
}
