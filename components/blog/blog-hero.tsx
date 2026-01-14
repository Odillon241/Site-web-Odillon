"use client"

import { useRef } from "react"
import { m, useScroll, useTransform } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Newspaper } from "lucide-react"

interface BlogHeroProps {
    settings: {
        show_blog_banner: boolean
        blog_banner_image_url: string | null
        blog_banner_link: string | null
    } | null
}

export function BlogHero({ settings }: BlogHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

    const hasBanner = settings?.show_blog_banner && settings?.blog_banner_image_url

    return (
        <section
            ref={containerRef}
            className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-odillon-teal"
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
            <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
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
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light leading-relaxed mx-auto sm:mx-0">
                        Restez informés des tendances et bonnes pratiques en stratégie d'entreprise, gouvernance et management.
                    </p>
                </m.div>
            </div>

            {/* Scroll Indicator */}
            <m.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                    <m.div
                        className="w-1.5 h-1.5 bg-white rounded-full"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </m.div>
        </section>
    )
}
