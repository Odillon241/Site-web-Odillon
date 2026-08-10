import { Metadata } from "next"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then(mod => mod.HeaderPro), { ssr: true })
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { ArticleShare } from "@/components/blog/article-share"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()

    const { data: article } = await supabase
        .from('articles')
        .select('title, excerpt')
        .eq('slug', slug)
        .single()

    if (!article) {
        return { title: 'Article non trouvé | Odillon' }
    }

    return {
        title: `${article.title} | Odillon`,
        description: article.excerpt,
    }
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

    if (!article) {
        notFound()
    }

    const publishedAt = article.published_at || article.created_at
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(publishedAt))

    return (
        <>
            <HeaderPro />
            <main className="min-h-screen pt-[88px] md:pt-[104px]">
                {/* En-tête de l'article */}
                <header className="mx-auto w-full max-w-3xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
                    <div className="blog-rise">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-[#65757C] transition-colors hover:text-[#0A1F2C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odillon-teal"
                        >
                            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                            Publications
                        </Link>

                        <p className="mt-8 text-sm font-semibold text-[#00786B]">
                            {article.category}
                        </p>

                        {/* `not-italic` neutralise la règle globale h1 : l'italique convient à
                            « Publications » (titre de rubrique), pas à un titre d'article long.
                            Cohérent avec les titres romains de l'index. */}
                        <h1 className="mt-3 font-baskvill text-[clamp(1.875rem,4.5vw,3rem)] not-italic leading-[1.15] tracking-[-0.015em] text-[#0A1F2C] text-balance">
                            {article.title}
                        </h1>

                        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-[#4A5C64] text-pretty">
                            {article.excerpt}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#0A1F2C]/10 pt-5 text-sm text-[#65757C]">
                            <span className="font-medium text-[#0A1F2C]">{article.author}</span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={publishedAt} className="tabular-nums">
                                {formattedDate}
                            </time>
                            <span aria-hidden="true">·</span>
                            <span>{article.read_time}</span>
                        </div>
                    </div>
                </header>

                {/* Image de couverture — pleine largeur de la colonne de lecture */}
                {article.cover_image && (
                    <div
                        className="blog-rise mx-auto mt-10 w-full max-w-4xl px-4 sm:px-6 lg:mt-12 lg:px-8"
                        style={{ animationDelay: "80ms" }}
                    >
                        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-[#EEF3F2] ring-1 ring-inset ring-[#0A1F2C]/[0.06]">
                            <Image
                                src={article.cover_image}
                                alt=""
                                fill
                                sizes="(min-width: 1024px) 896px, 100vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* Corps de l'article */}
                <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                    <article
                        className="prose prose-lg max-w-none prose-headings:font-baskvill prose-headings:tracking-[-0.015em] prose-headings:text-[#0A1F2C] prose-p:text-[#4A5C64] prose-p:leading-relaxed prose-li:text-[#4A5C64] prose-strong:text-[#0A1F2C] prose-a:text-[#00786B] prose-a:underline-offset-4 hover:prose-a:text-[#00695E] prose-blockquote:border-l prose-blockquote:border-[#0A1F2C]/20 prose-blockquote:not-italic prose-blockquote:text-[#0A1F2C] prose-img:rounded-lg"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[#0A1F2C]/10 pt-6">
                        <ArticleShare title={article.title} />

                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-[#00786B] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odillon-teal"
                        >
                            Toutes les publications
                            <ArrowRight
                                aria-hidden="true"
                                className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                            />
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
