"use client"

import { useState, useMemo, useRef } from "react"
import { m, useScroll, useTransform } from "framer-motion"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, Calendar, Clock, Newspaper, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

interface BlogPageClientProps {
    articles: Article[]
    settings: {
        show_blog_banner: boolean
        blog_banner_image_url: string | null
        blog_banner_link: string | null
    } | null
}

export function BlogPageClient({ articles, settings }: BlogPageClientProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

    const hasBanner = settings?.show_blog_banner && settings?.blog_banner_image_url

    const categories = useMemo(() =>
        Array.from(new Set(articles.map(a => a.category))),
        [articles]
    )

    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            if (searchTerm) {
                const search = searchTerm.toLowerCase()
                const matchesTitle = article.title.toLowerCase().includes(search)
                const matchesExcerpt = article.excerpt.toLowerCase().includes(search)
                const matchesCategory = article.category.toLowerCase().includes(search)
                if (!matchesTitle && !matchesExcerpt && !matchesCategory) {
                    return false
                }
            }

            if (selectedCategory && article.category !== selectedCategory) {
                return false
            }

            return true
        })
    }, [articles, searchTerm, selectedCategory])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <>
            {/* Hero Section with Search & Filters */}
            <section
                ref={containerRef}
                className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-odillon-teal"
            >
                {/* Background Parallax */}
                <m.div
                    style={{ y, opacity }}
                    className="absolute inset-0 w-full h-full"
                >
                    {hasBanner ? (
                        <>
                            <img
                                src={settings!.blog_banner_image_url!}
                                alt="Fond Blog"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-odillon-teal to-[#2a6b63]">
                            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/5 rounded-full blur-3xl opacity-60" />
                            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-odillon-lime/10 rounded-full blur-3xl opacity-60" />
                        </div>
                    )}
                </m.div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <m.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <Badge className="bg-white/10 text-white border-white/20 mb-6 backdrop-blur-sm inline-flex">
                                <Newspaper className="w-3.5 h-3.5 mr-1.5" />
                                Blog
                            </Badge>
                        </m.div>

                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        >
                            {settings?.show_blog_banner && settings?.blog_banner_link ? (
                                <a
                                    href={settings.blog_banner_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                >
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-petrov-sans group-hover:opacity-90 transition-opacity">
                                        Actualités & <span className="text-odillon-lime">Insights</span>
                                    </h1>
                                </a>
                            ) : (
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-petrov-sans">
                                    Actualités & <span className="text-odillon-lime">Insights</span>
                                </h1>
                            )}
                        </m.div>

                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        >
                            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed mb-10">
                                Restez informés des tendances et bonnes pratiques en stratégie d'entreprise, gouvernance et management.
                            </p>
                        </m.div>

                        {/* Search Bar */}
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                            className="max-w-xl mx-auto mb-6"
                        >
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-odillon-teal transition-colors" />
                                <Input
                                    placeholder="Rechercher un article..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 py-6 text-base bg-white/95 backdrop-blur-sm border-white/20 shadow-lg focus:ring-2 focus:ring-odillon-lime/30 focus:bg-white rounded-full"
                                />
                            </div>
                        </m.div>

                        {/* Categories Filter */}
                        {categories.length > 0 && (
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                                className="flex flex-wrap gap-2 justify-center"
                            >
                                <Badge
                                    variant={selectedCategory === null ? "default" : "outline"}
                                    className={`cursor-pointer transition-all px-4 py-2 text-sm ${selectedCategory === null
                                        ? "bg-white text-odillon-teal hover:bg-white/90"
                                        : "bg-white/10 hover:bg-white/20 text-white border-white/30"
                                        }`}
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    Tous
                                </Badge>
                                {categories.map((cat) => (
                                    <Badge
                                        key={cat}
                                        variant={selectedCategory === cat ? "default" : "outline"}
                                        className={`cursor-pointer transition-all px-4 py-2 text-sm ${selectedCategory === cat
                                            ? "bg-white text-odillon-teal hover:bg-white/90"
                                            : "bg-white/10 hover:bg-white/20 text-white border-white/30"
                                            }`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                    </Badge>
                                ))}
                            </m.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Articles Grid Section */}
            <section className="py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Results count header */}
                    {(searchTerm || selectedCategory) && (
                        <BlurFade delay={0.1}>
                            <div className="mb-8 pb-4 border-b border-gray-200">
                                <p className="text-gray-600">
                                    {filteredArticles.length} article{filteredArticles.length > 1 ? "s" : ""} trouvé{filteredArticles.length > 1 ? "s" : ""}
                                    {selectedCategory && <span className="text-odillon-teal font-medium"> dans {selectedCategory}</span>}
                                    {searchTerm && <span> pour "<span className="text-odillon-teal font-medium">{searchTerm}</span>"</span>}
                                </p>
                            </div>
                        </BlurFade>
                    )}

                    {/* Articles Grid */}
                    {filteredArticles.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Newspaper className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                {searchTerm || selectedCategory ? "Aucun article trouvé" : "Aucun article publié"}
                            </h3>
                            <p className="text-gray-500">
                                {searchTerm || selectedCategory
                                    ? "Essayez de modifier vos critères de recherche."
                                    : "Revenez bientôt pour découvrir nos actualités."}
                            </p>
                        </div>
                    ) : (
                        <m.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredArticles.map((article) => (
                                <m.div key={article.id} variants={item}>
                                    <Link href={`/blog/${article.slug}`} className="block h-full">
                                        <Card className="group h-full overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-300 bg-white flex flex-col">
                                            {/* Image */}
                                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                                {article.cover_image ? (
                                                    <Image
                                                        src={article.cover_image}
                                                        alt={article.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-odillon-teal/5">
                                                        <Newspaper className="w-12 h-12 text-odillon-teal/20" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-white/90 text-odillon-teal backdrop-blur-sm shadow-sm hover:bg-white border-none">
                                                        {article.category}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <CardContent className="p-6 flex flex-col flex-grow">
                                                {/* Meta */}
                                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {formatDate(article.published_at)}
                                                    </span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {article.read_time}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-odillon-teal transition-colors line-clamp-2 leading-tight">
                                                    {article.title}
                                                </h2>

                                                {/* Excerpt */}
                                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                                                    {article.excerpt}
                                                </p>

                                                {/* Link */}
                                                <div className="flex items-center text-odillon-teal font-semibold text-sm mt-auto pt-4 border-t border-gray-50 group-hover:border-odillon-teal/10 transition-colors">
                                                    Lire l'article
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </m.div>
                            ))}
                        </m.div>
                    )}
                </div>
            </section>
        </>
    )
}
