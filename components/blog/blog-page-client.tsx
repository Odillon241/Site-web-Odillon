"use client"

import { useState, useMemo } from "react"
import { ArrowRight, ChevronDown, Search, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/** Valeur sentinelle : Radix n'accepte pas la chaîne vide comme valeur de radio. */
const ALL_CATEGORIES = "__all__"

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

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
})

export function BlogPageClient({ articles, settings }: BlogPageClientProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    // La bannière configurée en administration sert de visuel d'accueil.
    const heroImage = settings?.show_blog_banner ? settings.blog_banner_image_url : null
    const heroLink = heroImage ? settings?.blog_banner_link : null

    const categories = useMemo(
        () => Array.from(new Set(articles.map((a) => a.category))),
        [articles]
    )

    const filteredArticles = useMemo(() => {
        const search = searchTerm.trim().toLowerCase()

        return articles.filter((article) => {
            if (selectedCategory && article.category !== selectedCategory) return false
            if (!search) return true

            return (
                article.title.toLowerCase().includes(search) ||
                article.excerpt.toLowerCase().includes(search) ||
                article.category.toLowerCase().includes(search)
            )
        })
    }, [articles, searchTerm, selectedCategory])

    const formatDate = (dateString: string) => dateFormatter.format(new Date(dateString))

    const isFiltering = searchTerm.trim() !== "" || selectedCategory !== null

    const resetFilters = () => {
        setSearchTerm("")
        setSelectedCategory(null)
    }

    return (
        <div className="pb-8">
            {/* Accueil de la rubrique — le visuel de bannière tient lieu de fond */}
            <header className="relative overflow-hidden border-b border-[#0A1F2C]/10">
                {heroImage && (
                    <div aria-hidden="true" className="absolute inset-0">
                        <Image
                            src={heroImage}
                            alt=""
                            fill
                            sizes="100vw"
                            className="object-cover"
                            priority
                        />
                        {/* Voile de lisibilité : quasi opaque sous le texte, dégagé sur l'image.
                            Garantit le contraste quelle que soit la bannière téléversée. */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(250,253,252,0.95)_0%,rgba(250,253,252,0.88)_55%,rgba(250,253,252,0.72)_100%)] md:bg-[linear-gradient(to_right,rgba(250,253,252,0.97)_0%,rgba(250,253,252,0.94)_36%,rgba(250,253,252,0.62)_62%,rgba(250,253,252,0.18)_100%)]" />
                    </div>
                )}

                {/* Trame posée au-dessus du voile, sous le texte. Présente aussi
                    quand aucune bannière n'est configurée. */}
                <div aria-hidden="true" className="blog-hero-grid absolute inset-0" />

                <div
                    className={`relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${
                        heroImage
                            ? "flex min-h-[340px] items-center py-14 lg:min-h-[440px] lg:py-20"
                            : "pt-12 pb-10 lg:pt-20 lg:pb-14"
                    }`}
                >
                    <div className="blog-rise max-w-2xl">
                        <h1 className="font-baskvill text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.06] tracking-[-0.02em] text-[#0A1F2C] text-balance">
                            Publications
                        </h1>
                        <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-[#4A5C64] text-pretty">
                            Analyses, repères méthodologiques et retours de mission de nos consultants
                            sur la gouvernance, la maîtrise des risques et le capital humain.
                        </p>

                        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                            <p
                                aria-live="polite"
                                className="text-sm font-medium tabular-nums text-[#65757C]"
                            >
                                {filteredArticles.length}{" "}
                                {isFiltering
                                    ? filteredArticles.length > 1
                                        ? "résultats"
                                        : "résultat"
                                    : filteredArticles.length > 1
                                    ? "articles publiés"
                                    : "article publié"}
                            </p>

                            {heroLink && (
                                <Link
                                    href={heroLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-[#00786B] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odillon-teal"
                                >
                                    Découvrir l&apos;offre en cours
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                                    />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Barre de filtres — collante sous l'en-tête du site.
                Les rubriques sont repliées dans un menu ; les deux contrôles portent
                une surface pleine pour se lire comme des contrôles, pas comme du texte. */}
            <div className="sticky top-[88px] z-30 border-b border-[#0A1F2C]/10 bg-[#FAFDFC]/95 backdrop-blur-md md:top-[104px]">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-8 sm:px-6 lg:px-8">
                    {categories.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="group inline-flex h-11 shrink-0 items-center gap-2.5 rounded-md border border-[#0A1F2C]/20 bg-white px-4 text-sm transition-colors hover:border-[#0A1F2C]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-odillon-teal data-[state=open]:border-odillon-teal"
                                >
                                    <span className="hidden text-[#65757C] sm:inline">Rubrique</span>
                                    <span className="font-semibold text-[#0A1F2C]">
                                        {selectedCategory ?? "Toutes"}
                                    </span>
                                    <ChevronDown
                                        aria-hidden="true"
                                        className="h-4 w-4 text-[#4A5C64] transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
                                    />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="start" className="w-60">
                                <DropdownMenuRadioGroup
                                    value={selectedCategory ?? ALL_CATEGORIES}
                                    onValueChange={(value) =>
                                        setSelectedCategory(value === ALL_CATEGORIES ? null : value)
                                    }
                                >
                                    <DropdownMenuRadioItem value={ALL_CATEGORIES}>
                                        Toutes les rubriques
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuSeparator />
                                    {categories.map((category) => (
                                        <DropdownMenuRadioItem key={category} value={category}>
                                            {category}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <div className="relative w-full max-w-sm shrink">
                        <label htmlFor="blog-search" className="sr-only">
                            Rechercher une publication
                        </label>
                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5C64]"
                        />
                        <input
                            id="blog-search"
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un sujet"
                            className="h-11 w-full appearance-none rounded-md border border-[#0A1F2C]/20 bg-white pl-11 pr-11 text-sm text-[#0A1F2C] transition-colors placeholder:text-[#65757C] hover:border-[#0A1F2C]/40 focus:border-odillon-teal focus:outline-none focus:ring-2 focus:ring-odillon-teal/20 [&::-webkit-search-cancel-button]:hidden"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm("")}
                                aria-label="Effacer la recherche"
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-[#65757C] transition-colors hover:text-[#0A1F2C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-odillon-teal"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Index des publications */}
                <section aria-label="Index des publications" className="pt-8 pb-10 lg:pt-12 lg:pb-16">
                    {filteredArticles.length === 0 ? (
                        <div className="max-w-xl py-14 lg:py-20">
                            <h2 className="font-baskvill text-2xl leading-snug text-[#0A1F2C] lg:text-3xl">
                                {searchTerm.trim() ? (
                                    <>
                                        Aucune publication pour «&nbsp;
                                        <span className="italic">{searchTerm.trim()}</span>
                                        &nbsp;».
                                    </>
                                ) : (
                                    <>Aucune publication dans cette rubrique pour l&apos;instant.</>
                                )}
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-[#4A5C64]">
                                Essayez un autre terme ou revenez à l&apos;ensemble des articles.
                            </p>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="group mt-7 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-[#00786B] underline decoration-[#00786B]/30 underline-offset-4 transition-colors hover:decoration-[#00786B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odillon-teal"
                            >
                                Voir toutes les publications
                                <ArrowRight
                                    aria-hidden="true"
                                    className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                                />
                            </button>
                        </div>
                    ) : (
                        <ul className="divide-y divide-[#0A1F2C]/10 border-b border-[#0A1F2C]/10">
                            {filteredArticles.map((article, index) => (
                                <li
                                    key={article.id}
                                    className="blog-rise"
                                    style={{ animationDelay: `${Math.min(index, 8) * 45 + 120}ms` }}
                                >
                                    <Link
                                        href={`/blog/${article.slug}`}
                                        className="group grid grid-cols-1 gap-y-3 py-8 transition-colors sm:grid-cols-[1fr_10rem] sm:gap-x-8 sm:gap-y-0 lg:grid-cols-[7rem_1fr_12rem] lg:gap-x-12 lg:py-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odillon-teal"
                                    >
                                        {/* Colonne date — sommaire */}
                                        <div className="flex items-baseline gap-3 sm:col-start-1 sm:row-start-1 lg:flex-col lg:gap-1.5 lg:pt-1">
                                            <time
                                                dateTime={article.published_at}
                                                className="text-sm font-medium tabular-nums text-[#0A1F2C]"
                                            >
                                                {formatDate(article.published_at)}
                                            </time>
                                            <span className="text-sm tabular-nums text-[#65757C]">
                                                {article.read_time}
                                            </span>
                                        </div>

                                        {/* Colonne texte */}
                                        <div className="sm:col-start-1 sm:row-start-2 sm:mt-3 lg:col-start-2 lg:row-start-1 lg:mt-0">
                                            <p className="text-sm font-semibold text-[#00786B]">
                                                {article.category}
                                            </p>
                                            <h3 className="mt-2 max-w-[38ch] font-baskvill text-xl leading-snug tracking-[-0.01em] text-[#0A1F2C] transition-colors duration-300 text-balance group-hover:text-[#00786B] lg:text-[1.5rem]">
                                                {article.title}
                                            </h3>
                                            <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-[#4A5C64] text-pretty line-clamp-2">
                                                {article.excerpt}
                                            </p>
                                            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#65757C] transition-colors group-hover:text-[#00786B]">
                                                Lire
                                                <ArrowRight
                                                    aria-hidden="true"
                                                    className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                                                />
                                            </span>
                                        </div>

                                        {/* Vignette */}
                                        <div className="hidden sm:col-start-2 sm:row-start-1 sm:row-span-2 sm:block lg:col-start-3 lg:row-span-1">
                                            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#EEF3F2] ring-1 ring-inset ring-[#0A1F2C]/[0.06]">
                                                {article.cover_image ? (
                                                    <Image
                                                        src={article.cover_image}
                                                        alt=""
                                                        fill
                                                        sizes="(min-width: 1024px) 192px, 160px"
                                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,167,149,0.08),rgba(196,216,46,0.08))]" />
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {isFiltering && filteredArticles.length > 0 && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="mt-8 rounded-sm text-sm font-medium text-[#65757C] underline decoration-[#0A1F2C]/20 underline-offset-4 transition-colors hover:text-[#0A1F2C] hover:decoration-[#0A1F2C]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odillon-teal"
                        >
                            Réinitialiser les filtres
                        </button>
                    )}
                </section>
            </div>
        </div>
    )
}
