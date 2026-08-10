"use client"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Button } from "@/components/ui/button"
import { m, useReducedMotion } from "framer-motion"
import Image from "next/image"
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
        color: "#00a795",
        features: ["Cartographie des risques", "Évaluation d'impact", "Matrice de probabilité"]
    },
    {
        icon: ArrowRightLeft,
        title: "Transférer",
        description: "Délégation des risques via assurances, contrats ou partenariats stratégiques.",
        color: "#C4D82E",
        features: ["Assurances adaptées", "Clauses contractuelles", "Partenariats stratégiques"]
    },
    {
        icon: ShieldOff,
        title: "Éviter",
        description: "Élimination des activités ou processus générateurs de risques majeurs.",
        color: "#00a795",
        features: ["Revue des processus", "Arbitrages stratégiques", "Élimination ciblée"]
    },
    {
        icon: TrendingDown,
        title: "Réduire",
        description: "Mise en place de contrôles pour minimiser la probabilité et l'impact.",
        color: "#C4D82E",
        features: ["Contrôles internes", "Procédures renforcées", "Formation des équipes"]
    },
    {
        icon: ClipboardList,
        title: "Préparer",
        description: "Élaboration de plans de continuité et de gestion de crise (PCA/PRA).",
        color: "#00a795",
        features: ["Plan de continuité (PCA)", "Plan de reprise (PRA)", "Gestion de crise"]
    },
    {
        icon: Eye,
        title: "Contrôler",
        description: "Surveillance continue et ajustement des mesures de maîtrise des risques.",
        color: "#C4D82E",
        features: ["Audits réguliers", "KPI dédiés", "Reporting continu"]
    }
]

export function RiskManagementSection() {
    const shouldReduceMotion = useReducedMotion()

    const gridVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.1,
                delayChildren: shouldReduceMotion ? 0 : 0.08
            }
        }
    }

    const cardVariants = {
        hidden: shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 24, filter: "blur(4px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: shouldReduceMotion ? 0 : 0.5,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    }

    return (
        <section id="risques" className="relative py-20 sm:py-28 lg:py-36 overflow-hidden bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                
                {/* Top Section: Split Layout with Image */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 sm:mb-32">
                    <BlurFade delay={0.1}>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-odillon-teal/5 rounded-[2rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
                            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
                                <Image
                                    src="/images/management-risques-moderne.png"
                                    alt="Management des Risques"
                                    fill
                                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 600px"
                                />
                            </div>
                            
                            {/* Floating Badge on Image */}
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block max-w-[200px]">
                                <p className="text-xs font-bold text-odillon-teal uppercase tracking-widest mb-2">Objectif</p>
                                <p className="text-sm font-medium text-slate-600 leading-snug">
                                    Transformer vos vulnérabilités en leviers de performance.
                                </p>
                            </div>
                        </div>
                    </BlurFade>

                    <div className="flex flex-col">
                        <BlurFade delay={0.2}>
                            <div className="inline-flex items-center space-x-2 mb-6">
                                <span className="w-8 h-px bg-odillon-teal"></span>
                                <span className="text-odillon-teal text-xs font-bold uppercase tracking-[0.2em]">
                                    Management Stratégique
                                </span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 font-baskvill italic tracking-tight leading-[1.1]">
                                Anticiper pour mieux <span className="italic text-odillon-teal underline decoration-odillon-lime/30 underline-offset-8">maîtriser</span>.
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-10">
                                Notre approche structurée en 6 étapes clés vous permet non seulement de protéger vos actifs, mais aussi d&apos;asseoir une gouvernance solide face aux incertitudes du marché.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    asChild
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg px-8 h-12 transition-all"
                                >
                                    <Link href="/offres">
                                        Découvrir notre approche
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </BlurFade>
                    </div>
                </div>

                {/* Bottom Section: Methodology Grid */}
                <div className="relative">
                    <BlurFade delay={0.3} className="mb-12">
                        <h3 className="text-xl font-bold text-slate-900 font-baskvill italic flex items-center gap-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-odillon-teal text-white text-xs">6</span>
                            Étapes de notre méthodologie
                        </h3>
                    </BlurFade>

                    <m.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={gridVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.12 }}
                    >
                        {riskManagementSteps.map((step, idx) => {
                            const Icon = step.icon
                            return (
                                <m.article
                                    key={step.title}
                                    variants={cardVariants}
                                    whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                                    className="group relative h-full overflow-hidden rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-8 shadow-[0_1px_0_rgba(15,23,42,0.05),0_12px_36px_rgba(15,23,42,0.045)] ring-1 ring-inset ring-slate-200/70 transition-[box-shadow,background-color] duration-300 hover:bg-white hover:shadow-[0_1px_0_rgba(15,23,42,0.05),0_22px_50px_rgba(15,23,42,0.10)]"
                                >
                                    <m.span
                                        aria-hidden="true"
                                        className="absolute inset-x-8 top-0 h-[2px] origin-left rounded-full"
                                        style={{ backgroundColor: step.color }}
                                        variants={{
                                            hidden: { scaleX: shouldReduceMotion ? 1 : 0, opacity: 0.25 },
                                            visible: {
                                                scaleX: 1,
                                                opacity: 0.8,
                                                transition: { duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.16 }
                                            }
                                        }}
                                    />

                                    <div className="flex items-start justify-between mb-6">
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset ring-black/[0.035] transition-[transform,box-shadow] duration-300 group-hover:-rotate-3 group-hover:scale-105 group-hover:shadow-md"
                                            style={{ backgroundColor: `${step.color}12`, color: step.color }}
                                        >
                                            <Icon className="w-5 h-5" strokeWidth={1.5} />
                                        </div>
                                        <span className="font-mono text-[10px] font-bold tabular-nums text-slate-300 transition-colors duration-300 group-hover:text-odillon-teal/45 uppercase tracking-[0.16em]">
                                            Étape 0{idx + 1}
                                        </span>
                                    </div>

                                    <h4 className="text-lg font-bold text-slate-900 mb-3 font-baskvill italic group-hover:text-odillon-teal transition-colors duration-300">
                                        {step.title}
                                    </h4>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-6 text-pretty">
                                        {step.description}
                                    </p>

                                    <ul className="space-y-2.5">
                                        {step.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-xs font-medium text-slate-600">
                                                <span
                                                    className="mr-3 h-1 w-1 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-150"
                                                    style={{ backgroundColor: step.color }}
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </m.article>
                            )
                        })}
                    </m.div>
                </div>
            </div>
        </section>
    )
}
