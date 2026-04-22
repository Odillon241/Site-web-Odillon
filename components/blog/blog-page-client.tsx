"use client"

import { useState, useMemo } from "react"
import { m, AnimatePresence } from "framer-motion"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
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

    const isFiltering = searchTerm !== "" || selectedCategory !== null
    const featuredArticle = !isFiltering && filteredArticles.length > 0 ? filteredArticles[0] : null
    const gridArticles = featuredArticle ? filteredArticles.slice(1) : filteredArticles

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Hero Newsroom — split-screen fusionné avec l'article featured */}
            <section className="relative overflow-hidden border-b border-gray-200/60 bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-odillon-teal/[0.06] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-odillon-lime/[0.05] via-transparent to-transparent" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
                        {/* LEFT — 40% : headline + search */}
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-5 flex flex-col justify-center py-4 lg:py-10"
                        >
                            <div className="flex items-center gap-3 mb-6 text-xs font-semibold tracking-[0.2em] uppercase text-odillon-teal">
                                <span className="h-px w-10 bg-odillon-teal/40" />
                                Le Journal d'Odillon
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight mb-6 font-baskvill leading-[1.05]">
                                Pensées,<br />
                                <span className="text-odillon-teal italic">analyses</span> &amp;<br />
                                perspectives.
                            </h1>

                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 font-light max-w-lg">
                                Nos regards sur la gouvernance, les risques et la transformation des organisations.
                            </p>

                            {/* Search Bar — épurée */}
                            <div className="relative max-w-lg">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Rechercher un article, un sujet..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-6 bg-white border-gray-200 text-gray-900 shadow-sm focus:ring-2 focus:ring-odillon-teal/20 focus:border-odillon-teal transition-all text-base"
                                />
                            </div>
                        </m.div>

                        {/* RIGHT — 60% : article featured visuel */}
                        <m.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="lg:col-span-7 relative"
                        >
                            {featuredArticle ? (
                                <Link href={`/blog/${featuredArticle.slug}`} className="group block relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-[560px] overflow-hidden bg-gray-100 shadow-xl">
                                    {featuredArticle.cover_image ? (
                                        <Image
                                            src={featuredArticle.cover_image}
                                            alt={featuredArticle.title}
                                            fill
                                            className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                                            priority
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-odillon-teal/10 to-odillon-lime/10">
                                            <Newspaper className="w-20 h-20 text-odillon-teal/40" />
                                        </div>
                                    )}

                                    {/* Overlay teal/lime + dégradé bas pour lisibilité du texte */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-odillon-teal/35 via-transparent to-odillon-lime/15 mix-blend-multiply" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Badges haut gauche */}
                                    <div className="absolute top-5 left-5 flex items-center gap-2 flex-wrap">
                                        <Badge className="bg-odillon-lime text-odillon-dark hover:bg-odillon-lime border-none px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
                                            À la une
                                        </Badge>
                                        <Badge className="bg-white/95 text-odillon-teal hover:bg-white border-none px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                                            {featuredArticle.category}
                                        </Badge>
                                    </div>

                                    {/* Contenu overlay — bas */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10 text-white">
                                        <div className="flex items-center gap-4 text-xs font-medium text-white/80 mb-3 uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(featuredArticle.published_at)}
                                            </span>
                                            <span className="w-1 h-1 bg-white/50 rounded-full" />
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {featuredArticle.read_time}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3 font-baskvill group-hover:text-odillon-lime transition-colors duration-500 max-w-2xl">
                                            {featuredArticle.title}
                                        </h2>
                                        <p className="text-sm sm:text-base text-white/85 line-clamp-2 max-w-xl mb-5 leading-relaxed">
                                            {featuredArticle.excerpt}
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
                                            Lire l'article
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="relative aspect-[16/10] lg:aspect-auto lg:h-[560px] overflow-hidden bg-gradient-to-br from-odillon-teal/10 via-white to-odillon-lime/10 flex items-center justify-center border border-gray-100">
                                    <Newspaper className="w-20 h-20 text-odillon-teal/30" />
                                </div>
                            )}
                        </m.div>
                    </div>

                    {/* Tabs catégories — underlined, sous le hero */}
                    {categories.length > 0 && (
                        <m.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-10 lg:mt-14 border-t border-gray-200/60"
                        >
                            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`relative whitespace-nowrap px-4 sm:px-5 py-4 text-sm font-semibold transition-colors ${
                                        selectedCategory === null
                                            ? "text-odillon-teal"
                                            : "text-gray-500 hover:text-gray-900"
                                    }`}
                                >
                                    Tous les articles
                                    {selectedCategory === null && (
                                        <m.span
                                            layoutId="category-underline"
                                            className="absolute inset-x-3 sm:inset-x-4 -bottom-px h-0.5 bg-odillon-teal"
                                        />
                                    )}
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`relative whitespace-nowrap px-4 sm:px-5 py-4 text-sm font-semibold transition-colors ${
                                            selectedCategory === category
                                                ? "text-odillon-teal"
                                                : "text-gray-500 hover:text-gray-900"
                                        }`}
                                    >
                                        {category}
                                        {selectedCategory === category && (
                                            <m.span
                                                layoutId="category-underline"
                                                className="absolute inset-x-3 sm:inset-x-4 -bottom-px h-0.5 bg-odillon-teal"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </m.div>
                    )}
                </div>

                {/* Bannière promotionnelle optionnelle */}
                {hasBanner && (
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
                        <m.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.35 }}
                            className="relative overflow-hidden shadow-xl aspect-[21/6] group"
                        >
                            <Link href={settings!.blog_banner_link || "#"} target="_blank">
                                <Image
                                    src={settings!.blog_banner_image_url!}
                                    alt="Bannière promotionnelle"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                            </Link>
                        </m.div>
                    </div>
                )}
            </section>

            {/* Articles Content — Grille éditoriale newsroom */}
            <section id="articles" className="py-16 sm:py-20 lg:py-24 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Section heading éditorial */}
                    <div className="flex items-end justify-between gap-6 mb-10 lg:mb-14 pb-6 border-b border-gray-300/70">
                        <div>
                            <div className="flex items-center gap-3 mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-odillon-teal">
                                <span className="h-px w-8 bg-odillon-teal/40" />
                                {selectedCategory
                                    ? "Rubrique"
                                    : searchTerm
                                    ? "Résultats"
                                    : "Édition courante"}
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight font-baskvill leading-tight">
                                {selectedCategory
                                    ? selectedCategory
                                    : searchTerm
                                    ? <>Pour « <span className="italic text-odillon-teal">{searchTerm}</span> »</>
                                    : featuredArticle
                                    ? "Derniers articles"
                                    : "Tous les articles"}
                            </h2>
                        </div>
                        {isFiltering && filteredArticles.length > 0 && (
                            <button
                                onClick={() => {
                                    setSearchTerm("")
                                    setSelectedCategory(null)
                                }}
                                className="text-sm font-semibold text-gray-500 hover:text-odillon-teal transition-colors underline underline-offset-4 decoration-gray-300 hover:decoration-odillon-teal whitespace-nowrap"
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>

                    {/* Empty state éditorial */}
                    {filteredArticles.length === 0 ? (
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-20 lg:py-28 text-center max-w-2xl mx-auto"
                        >
                            <div className="text-7xl lg:text-8xl font-baskvill italic text-odillon-teal/30 mb-6 leading-none">«&nbsp;»</div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 font-baskvill">
                                Aucun article ne correspond.
                            </h3>
                            <p className="text-gray-500 text-base lg:text-lg leading-relaxed mb-8">
                                Essayez un autre terme de recherche ou explorez l'ensemble de nos publications.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("")
                                    setSelectedCategory(null)
                                }}
                                className="inline-flex items-center gap-2 text-odillon-teal font-semibold text-base hover:gap-3 transition-all underline underline-offset-4 decoration-odillon-teal/40 hover:decoration-odillon-teal"
                            >
                                Voir tous les articles
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </m.div>
                    ) : (
                        <m.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 lg:gap-y-20"
                        >
                            {gridArticles.map((article) => (
                                <m.article key={article.id} variants={item}>
                                    <Link href={`/blog/${article.slug}`} className="group block h-full">
                                        {/* Image — cadre simple sans border, coin carré cohérent avec hero */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-6">
                                            {article.cover_image ? (
                                                <Image
                                                    src={article.cover_image}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-odillon-teal/8 to-odillon-lime/8">
                                                    <Newspaper className="w-12 h-12 text-odillon-teal/30" />
                                                </div>
                                            )}
                                            {/* Barre lime révélée au hover */}
                                            <div className="absolute inset-x-0 top-0 h-1 bg-odillon-lime origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                        </div>

                                        {/* Contenu */}
                                        <div className="flex flex-col">
                                            {/* Eyebrow : catégorie + date en alignement minimaliste */}
                                            <div className="flex items-center gap-3 mb-4 text-xs font-semibold tracking-[0.15em] uppercase">
                                                <span className="text-odillon-teal">{article.category}</span>
                                                <span className="h-px w-6 bg-gray-300" />
                                                <span className="text-gray-500 normal-case tracking-normal font-medium">
                                                    {formatDate(article.published_at)}
                                                </span>
                                            </div>

                                            {/* Titre */}
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-snug font-baskvill group-hover:text-odillon-teal transition-colors duration-300 line-clamp-2">
                                                {article.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed text-[0.95rem]">
                                                {article.excerpt}
                                            </p>

                                            {/* Footer : temps de lecture + flèche */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-200/70">
                                                <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium uppercase tracking-wider">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {article.read_time}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 group-hover:text-odillon-teal group-hover:gap-2.5 transition-all">
                                                    Lire
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </m.article>
                            ))}
                        </m.div>
                    )}
                </div>
            </section>
        </div>
    )
}
