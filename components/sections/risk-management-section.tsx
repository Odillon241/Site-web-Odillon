"use client"

import { useRef } from "react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { m, useScroll, useTransform } from "framer-motion"
import {
    Search,
    ArrowRightLeft,
    ShieldOff,
    TrendingDown,
    ClipboardList,
    Eye,
    ArrowRight
} from "lucide-react"
import Link from "next/link"

const riskManagementSteps = [
    {
        icon: Search,
        title: "Analyser",
        description: "Identification et évaluation des risques potentiels pour votre organisation.",
        color: "#39837a"
    },
    {
        icon: ArrowRightLeft,
        title: "Transférer",
        description: "Délégation des risques via assurances, contrats ou partenariats stratégiques.",
        color: "#C4D82E"
    },
    {
        icon: ShieldOff,
        title: "Éviter",
        description: "Élimination des activités ou processus générateurs de risques majeurs.",
        color: "#39837a"
    },
    {
        icon: TrendingDown,
        title: "Réduire",
        description: "Mise en place de contrôles pour minimiser la probabilité et l'impact.",
        color: "#C4D82E"
    },
    {
        icon: ClipboardList,
        title: "Préparer",
        description: "Élaboration de plans de continuité et de gestion de crise (PCA/PRA).",
        color: "#39837a"
    },
    {
        icon: Eye,
        title: "Contrôler",
        description: "Surveillance continue et ajustement des mesures de maîtrise des risques.",
        color: "#C4D82E"
    }
]

export function RiskManagementSection() {
    const containerRef = useRef<HTMLDivElement>(null)

    // Track scroll progress within this section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    // Transform scroll progress to width (starts small, expands to full)
    const imageWidth = useTransform(scrollYProgress, [0, 0.3, 0.5], ["60%", "85%", "100%"])
    const imageScale = useTransform(scrollYProgress, [0, 0.3, 0.5], [0.9, 0.95, 1])
    const borderRadius = useTransform(scrollYProgress, [0, 0.3, 0.5], ["24px", "12px", "0px"])
    const imageOpacity = useTransform(scrollYProgress, [0, 0.15], [0.7, 1])

    return (
        <section
            ref={containerRef}
            className="relative py-24 lg:py-32 overflow-hidden"
        >
            {/* Header */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
                <div className="text-center">
                    <BlurFade delay={0.1}>
                        <Badge variant="odillon" className="mb-4">
                            Expertise
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-petrov-sans">
                            Management des <span className="text-odillon-teal">Risques</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Notre approche structurée en 6 étapes vous permet d'anticiper, maîtriser et transformer les risques en opportunités de croissance.
                        </p>
                    </BlurFade>
                </div>
            </div>

            {/* Animated Full-Width Image Container */}
            <div className="flex justify-center mb-16">
                <m.div
                    className="relative overflow-hidden shadow-2xl"
                    style={{
                        width: imageWidth,
                        scale: imageScale,
                        borderRadius: borderRadius,
                        opacity: imageOpacity
                    }}
                >
                    <div className="relative aspect-[16/9] w-full">
                        <Image
                            src="/images/management-risques.jpg"
                            alt="Management des Risques - Les 6 étapes clés : Analyser, Transférer, Éviter, Réduire, Préparer, Contrôler"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {/* Caption on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                            <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg max-w-2xl">
                                Une méthodologie éprouvée pour anticiper et maîtriser tous les risques de votre organisation.
                            </p>
                        </div>
                    </div>
                </m.div>
            </div>

            {/* Steps Grid */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {riskManagementSteps.map((step, idx) => {
                        const StepIcon = step.icon
                        return (
                            <BlurFade key={step.title} delay={0.1 * (idx + 1)}>
                                <div className="group p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-odillon-teal/30 transition-all duration-300">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: `${step.color}15` }}
                                    >
                                        <StepIcon
                                            className="w-6 h-6"
                                            style={{ color: step.color }}
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-odillon-teal transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </BlurFade>
                        )
                    })}
                </div>

                {/* CTA */}
                <BlurFade delay={0.6}>
                    <div className="text-center mt-16">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-odillon-teal text-white font-semibold rounded-xl shadow-lg shadow-odillon-teal/20 hover:shadow-xl hover:bg-odillon-teal/90 transition-all group"
                        >
                            Découvrir notre approche complète
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </BlurFade>
            </div>
        </section>
    )
}
