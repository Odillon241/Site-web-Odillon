"use client"

import { useState, useMemo } from "react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { m } from "framer-motion"
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

interface BlogArticlesGridProps {
    articles: Article[]
}

export function BlogArticlesGrid({ articles }: BlogArticlesGridProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const categories = useMemo(() =>
        Array.from(new Set(articles.map(a => a.category))),
        [articles]
    )

    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            // Filter by search term
            if (searchTerm) {
                const search = searchTerm.toLowerCase()
                const matchesTitle = article.title.toLowerCase().includes(search)
                const matchesExcerpt = article.excerpt.toLowerCase().includes(search)
                const matchesCategory = article.category.toLowerCase().includes(search)
                if (!matchesTitle && !matchesExcerpt && !matchesCategory) {
                    return false
                }
            }

            // Filter by category
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
            {/* Search and Filters */}
            <BlurFade delay={0.2}>
                <div className="mb-12 space-y-4">
                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto md:mx-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Rechercher un article..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 py-6 text-base bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-odillon-teal/20"
                        />
                    </div>

                    {/* Categories Filter */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <Badge
                                variant={selectedCategory === null ? "default" : "outline"}
                                className={`cursor-pointer transition-all px-4 py-2 text-sm ${selectedCategory === null
                                    ? "bg-odillon-teal text-white hover:bg-odillon-teal/90"
                                    : "hover:bg-odillon-teal/10 text-gray-600 border-gray-300"
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
                                        ? "bg-odillon-teal text-white hover:bg-odillon-teal/90"
                                        : "hover:bg-odillon-teal/10 text-gray-600 border-gray-300"
                                        }`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </BlurFade>

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

            {/* Results count */}
            {(searchTerm || selectedCategory) && filteredArticles.length > 0 && (
                <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-sm text-gray-500 mt-12 italic"
                >
                    {filteredArticles.length} article{filteredArticles.length > 1 ? "s" : ""} trouvé{filteredArticles.length > 1 ? "s" : ""}
                </m.p>
            )}
        </>
    )
}
