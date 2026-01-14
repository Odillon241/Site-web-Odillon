import { Metadata } from "next"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then(mod => mod.HeaderPro), { ssr: true })
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Share2, User } from "lucide-react"
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
        title: `${article.title} | Odillon Blog`,
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <>
            <HeaderPro />
            <main className="min-h-screen pt-[88px]">
                {/* Hero Section */}
                <section className="relative py-16 lg:py-20 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                    {article.cover_image && (
                        <div className="absolute inset-0">
                            <Image
                                src={article.cover_image}
                                alt={article.title}
                                fill
                                className="object-cover opacity-30"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
                        </div>
                    )}

                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
                        <BlurFade delay={0.1}>
                            <Link
                                href="/blog"
                                className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour aux articles
                            </Link>

                            <Badge className="bg-odillon-teal text-white mb-6">
                                {article.category}
                            </Badge>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-petrov-sans leading-tight">
                                {article.title}
                            </h1>

                            <p className="text-xl text-white/80 mb-8">
                                {article.excerpt}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {article.author}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(article.published_at || article.created_at)}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {article.read_time}
                                </span>
                            </div>
                        </BlurFade>
                    </div>
                </section>

                {/* Article Content */}
                <section className="py-16 lg:py-20 bg-white">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <BlurFade delay={0.2}>
                            <article className="prose prose-lg prose-gray max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: article.content }} />
                            </article>
                        </BlurFade>

                        {/* Share */}
                        <BlurFade delay={0.3}>
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 text-sm">Partager :</span>
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-odillon-teal">
                                            <Share2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <Link href="/blog">
                                        <Button variant="outline">
                                            Voir tous les articles
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </BlurFade>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
