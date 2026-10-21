"use client"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
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

// Sélecteur d'étapes (motif « onglets » WAI-ARIA) : flèches, Début et Fin
// déplacent la sélection, le détail de l'étape s'affiche à côté.
function MethodologieInteractive() {
    const reduireMouvement = useReducedMotion()
    const [actif, setActif] = useState(0)
    const onglets = useRef<Array<HTMLButtonElement | null>>([])
    const etape = riskManagementSteps[actif]
    const Icone = etape.icon

    const selectionner = (i: number) => {
        const n = riskManagementSteps.length
        const cible = (i + n) % n
        setActif(cible)
        onglets.current[cible]?.focus()
    }

    const surTouche = (e: React.KeyboardEvent) => {
        const actions: Record<string, number> = {
            ArrowDown: actif + 1,
            ArrowRight: actif + 1,
            ArrowUp: actif - 1,
            ArrowLeft: actif - 1,
            Home: 0,
            End: riskManagementSteps.length - 1,
        }
        if (e.key in actions) {
            e.preventDefault()
            selectionner(actions[e.key])
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
            <div
                role="tablist"
                aria-label="Étapes de la méthodologie"
                aria-orientation="vertical"
                onKeyDown={surTouche}
                className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
            >
                {riskManagementSteps.map((s, i) => {
                    const estActif = i === actif
                    return (
                        <button
                            key={s.title}
                            ref={(el) => { onglets.current[i] = el }}
                            type="button"
                            role="tab"
                            id={`methodo-onglet-${i}`}
                            aria-selected={estActif}
                            aria-controls="methodo-panneau"
                            tabIndex={estActif ? 0 : -1}
                            onClick={() => setActif(i)}
                            className={`group flex shrink-0 items-center gap-4 rounded-xl px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-odillon-teal lg:px-5 lg:py-4 ${
                                estActif
                                    ? "bg-odillon-dark text-white shadow-lg shadow-odillon-dark/10"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            <span
                                className={`font-mono text-xs font-bold tabular-nums ${
                                    estActif ? "text-odillon-lime" : "text-slate-400"
                                }`}
                            >
                                0{i + 1}
                            </span>
                            <span className="font-baskvill text-lg font-bold italic">{s.title}</span>
                        </button>
                    )
                })}
            </div>

            <div
                role="tabpanel"
                id="methodo-panneau"
                aria-labelledby={`methodo-onglet-${actif}`}
                className="relative overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#ffffff,#f8fafc)] p-8 ring-1 ring-inset ring-slate-200/70 sm:p-10"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <m.div
                        key={etape.title}
                        initial={reduireMouvement ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduireMouvement ? undefined : { opacity: 0, y: -12 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div
                                className="flex size-14 items-center justify-center rounded-xl"
                                style={{ backgroundColor: `${etape.color}18`, color: etape.color }}
                            >
                                <Icone className="size-7" strokeWidth={1.5} aria-hidden="true" />
                            </div>
                            <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                Étape {actif + 1} / {riskManagementSteps.length}
                            </span>
                        </div>

                        <h4 className="mb-3 font-baskvill text-3xl font-bold italic text-slate-900">{etape.title}</h4>
                        <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-600 text-pretty">{etape.description}</p>

                        <ul className="flex flex-wrap gap-2">
                            {etape.features.map((f) => (
                                <li
                                    key={f}
                                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                                >
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </m.div>
                </AnimatePresence>

                <div className="mt-10 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
                    <div className="flex gap-1.5" aria-hidden="true">
                        {riskManagementSteps.map((s, i) => (
                            <span
                                key={s.title}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i === actif ? "w-8 bg-odillon-teal" : i < actif ? "w-3 bg-odillon-teal/40" : "w-3 bg-slate-200"
                                }`}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setActif((actif + 1) % riskManagementSteps.length)}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-odillon-teal outline-none transition-colors hover:bg-odillon-teal/5 focus-visible:ring-2 focus-visible:ring-odillon-teal"
                    >
                        {actif === riskManagementSteps.length - 1 ? "Recommencer" : "Étape suivante"}
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export function RiskManagementSection() {
    return (
        <section id="risques" className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                
                {/* Top Section: Split Layout with Image */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 sm:mb-20">
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
                                    <Link href="/produits#gouvernance">
                                        Nos produits de gouvernance
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </BlurFade>
                    </div>
                </div>

                {/* Bottom Section: Methodology Selector */}
                <div className="relative">
                    <BlurFade delay={0.3} className="mb-8 sm:mb-10">
                        <h3 className="text-xl font-bold text-slate-900 font-baskvill italic flex items-center gap-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-odillon-teal text-white text-xs not-italic">6</span>
                            Étapes de notre méthodologie
                        </h3>
                    </BlurFade>

                    <BlurFade delay={0.35}>
                        <MethodologieInteractive />
                    </BlurFade>
                </div>
            </div>
        </section>
    )
}
