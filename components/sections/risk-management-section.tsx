"use client"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Button } from "@/components/ui/button"
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
        color: "#39837a",
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
        color: "#39837a",
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
        color: "#39837a",
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
    return (
        <section className="relative py-14 sm:py-20 lg:py-32 overflow-hidden">
            {/* Background Decor - aligné avec ServicesHome */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-odillon-teal/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-odillon-lime/5 rounded-full blur-[100px]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                {/* Header flex - pattern ServicesHome */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 md:mb-16 gap-6 sm:gap-8">
                    <BlurFade delay={0.2} className="max-w-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-baskvill tracking-tight">
                            Management des <span className="text-odillon-teal">Risques</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Notre approche structurée en 6 étapes vous permet d&apos;anticiper, maîtriser et transformer les risques en opportunités de croissance.
                        </p>
                    </BlurFade>

                    <BlurFade delay={0.3}>
                        <Button
                            asChild
                            variant="default"
                            className="group bg-odillon-teal hover:bg-odillon-teal/90 text-white font-semibold rounded-lg px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Link href="/offres">
                                Découvrir notre approche
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </BlurFade>
                </div>

                {/* Image bannière contenue - même traitement visuel que les cards */}
                <BlurFade delay={0.4}>
                    <div className="relative overflow-hidden rounded-lg border border-gray-200/80 shadow-lg mb-10 sm:mb-14 md:mb-16">
                        <div className="relative aspect-[21/9] w-full">
                            <Image
                                src="/images/management-risques.jpg"
                                alt="Management des Risques - Les 6 étapes clés : Analyser, Transférer, Éviter, Réduire, Préparer, Contrôler"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1280px) 100vw, 1280px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                                <p className="text-white text-base md:text-lg font-medium drop-shadow-lg max-w-2xl">
                                    Une méthodologie éprouvée pour anticiper et maîtriser tous les risques de votre organisation.
                                </p>
                            </div>
                        </div>
                    </div>
                </BlurFade>

                {/* Steps Grid - pattern ServicesHome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {riskManagementSteps.map((step, idx) => {
                        const StepIcon = step.icon
                        const stepNumber = String(idx + 1).padStart(2, "0")
                        return (
                            <BlurFade key={step.title} delay={0.1 * (idx + 1)} className="h-full">
                                <div className="relative h-full bg-white rounded-lg p-8 shadow-lg border border-gray-200/80 overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                    {/* Hover Gradient Background */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{
                                            background: `linear-gradient(135deg, ${step.color}08 0%, ${step.color}03 50%, transparent 100%)`
                                        }}
                                    />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div
                                            className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 border-2 shadow-sm group-hover:shadow-md transition-all duration-300"
                                            style={{
                                                background: `linear-gradient(135deg, ${step.color}12 0%, ${step.color}08 100%)`,
                                                borderColor: `${step.color}30`,
                                                color: step.color
                                            }}
                                        >
                                            <StepIcon className="w-7 h-7" strokeWidth={1.5} />
                                        </div>

                                        <p
                                            className="text-xs font-semibold mb-2 uppercase tracking-wider"
                                            style={{ color: `${step.color}cc` }}
                                        >
                                            Étape {stepNumber}
                                        </p>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-odillon-teal transition-colors font-baskvill">
                                            {step.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                            {step.description}
                                        </p>

                                        <ul className="space-y-3 mt-auto">
                                            {step.features.map((feature, i) => (
                                                <li key={i} className="flex items-center text-sm text-gray-600">
                                                    <span
                                                        className="w-2 h-2 rounded-full mr-3 shrink-0"
                                                        style={{ backgroundColor: step.color }}
                                                    />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </BlurFade>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
