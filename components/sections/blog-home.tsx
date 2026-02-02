"use client"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

function formatDate(dateString: string) {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

export function BlogHome({ articles }: { articles: Article[] }) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className="relative py-24 lg:py-32 overflow-hidden bg-gray-50/50">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-1/3 h-1/3 bg-odillon-teal/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-1/4 h-1/4 bg-odillon-lime/10 rounded-full blur-[100px]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <BlurFade delay={0.1}>
                        <Badge variant="odillon" className="mb-4">
                            Ressources
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-petrov-sans">
                            Notre sélection <span className="text-odillon-teal">d'articles</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Découvrez les articles que nous vous recommandons sur la stratégie d'entreprise.
                        </p>
                    </BlurFade>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((post, idx) => (
                        <BlurFade key={post.id} delay={0.1 * (idx + 1)}>
                            <Link href={`/blog/${post.slug}`} className="block h-full">
                                <Card className="group h-full overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-odillon-teal/20 to-odillon-lime/20">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {post.cover_image ? (
                                                <Image
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <span className="text-6xl font-bold text-odillon-teal/20 font-petrov-sans">
                                                    {post.category.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <Badge
                                            className="absolute top-4 left-4 bg-white/90 text-odillon-teal backdrop-blur-sm shadow-sm"
                                        >
                                            {post.category}
                                        </Badge>
                                    </div>

                                    <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(post.published_at)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {post.read_time}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-odillon-teal transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                                            {post.excerpt}
                                        </p>

                                        {/* Link - always at bottom */}
                                        <div className="flex items-center text-odillon-teal font-semibold text-sm mt-auto group/link cursor-pointer">
                                            Lire l'article
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </BlurFade>
                    ))}
                </div>

                {/* View All Link */}
                <BlurFade delay={0.5}>
                    <div className="text-center mt-12">
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-odillon-teal font-semibold hover:text-odillon-teal/80 transition-colors group"
                        >
                            Voir toutes les actualités
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </BlurFade>
            </div>
        </section>
    )
}
