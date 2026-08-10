"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { typoFr } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, MapPin, User, GraduationCap, ArrowRight, Wallet, Users } from "lucide-react"
import {
    type Formation,
    MODALITE_LABELS,
    estComplet,
    placesRestantes,
    formatMontant,
} from "@/types/formation"

function toDate(iso: string) {
    return new Date(iso + "T00:00:00")
}

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate()
}

function formatDateRange(debut: string, fin?: string | null) {
    const d = toDate(debut)
    const full: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
    if (!fin || fin === debut) {
        return d.toLocaleDateString("fr-FR", full)
    }
    const f = toDate(fin)
    return `${d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} – ${f.toLocaleDateString("fr-FR", full)}`
}

function FormationCard({ f }: { f: Formation }) {
    const complet = estComplet(f)
    const restantes = placesRestantes(f)
    const ouvert = (f.inscriptions_ouvertes ?? true) && !complet

    return (
        <div className="od-surface p-5 md:p-6 transition-colors hover:border-[#00a795]/24">
            <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-odillon-teal/10 text-odillon-teal hover:bg-odillon-teal/20 border-none">
                    <CalendarDays className="w-3.5 h-3.5 mr-1" />
                    {formatDateRange(f.date_debut, f.date_fin)}
                </Badge>
                {f.modalite && (
                    <Badge variant="outline" className="border-odillon-lime/40 text-odillon-dark bg-odillon-lime/10">
                        {MODALITE_LABELS[f.modalite] || f.modalite}
                    </Badge>
                )}
                {complet && (
                    <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-none">
                        Complet
                    </Badge>
                )}
            </div>

            <h3 className="text-xl font-semibold text-odillon-dark mb-2">{f.titre}</h3>
            <p className="text-gray-600 leading-relaxed mb-4">{f.description}</p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-5">
                {(f.horaires || f.duree) && (
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-odillon-teal" />
                        {[f.horaires, f.duree].filter(Boolean).join(" · ")}
                    </span>
                )}
                {f.lieu && (
                    <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-odillon-teal" />
                        {f.lieu}
                    </span>
                )}
                {f.formateur && (
                    <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-odillon-teal" />
                        {f.formateur}
                    </span>
                )}
                {f.prix != null && (
                    <span className="flex items-center gap-1.5 font-medium text-odillon-dark">
                        <Wallet className="w-4 h-4 text-odillon-teal" />
                        {formatMontant(f.prix, f.devise)}
                    </span>
                )}
                {restantes !== null && restantes > 0 && (
                    <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-odillon-teal" />
                        {restantes} place{restantes > 1 ? "s" : ""} restante{restantes > 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {ouvert ? (
                <Button asChild className="bg-odillon-teal hover:bg-odillon-teal/90 text-white gap-2">
                    <Link href={`/formations/${f.id}/inscription`}>
                        S'inscrire
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </Button>
            ) : (
                <Button disabled className="gap-2">
                    {complet ? "Complet" : "Inscriptions fermées"}
                </Button>
            )}
        </div>
    )
}

export function FormationsCalendar({ formations }: { formations: Formation[] }) {
    const [month, setMonth] = useState<Date>(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

    const formationDays = useMemo(
        () => formations.map(f => toDate(f.date_debut)),
        [formations]
    )

    // Le hero annonce le programme réellement à venir : une session dont la
    // date est passée ne doit ni être comptée, ni proposée à l'inscription.
    const sessionsAVenir = useMemo(() => {
        const aujourdhui = new Date()
        aujourdhui.setHours(0, 0, 0, 0)
        return formations
            .filter(f => toDate(f.date_fin || f.date_debut) >= aujourdhui)
            .sort((a, b) => a.date_debut.localeCompare(b.date_debut))
    }, [formations])

    const prochaine = sessionsAVenir[0] ?? null

    const modalites = useMemo(() => {
        const codes = new Set(sessionsAVenir.map(f => f.modalite).filter(Boolean) as string[])
        // En milieu de phrase : « présentiel et distanciel », pas de capitales.
        return Array.from(codes).map(code => (MODALITE_LABELS[code] || code).toLowerCase())
    }, [sessionsAVenir])

    const visible = useMemo(() => {
        if (!selectedDate) return formations
        return formations.filter(f => isSameDay(toDate(f.date_debut), selectedDate))
    }, [formations, selectedDate])

    return (
        <>
            {/* ===== HERO =====
                Un calendrier ne se raconte pas, il se date : le hero ouvre donc
                sur la prochaine session nommée, tenue à droite par un filet. */}
            <header className="relative overflow-hidden">
                <div aria-hidden="true" className="od-hero-grid absolute inset-0" />

                <div className="relative od-container py-12 md:py-16 lg:py-20">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
                        <div className="od-rise max-w-2xl">
                            <h1 className="font-baskvill italic text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.06] tracking-[-0.02em] text-odillon-dark text-balance">
                                Formations
                            </h1>
                            <p className="mt-5 max-w-[56ch] text-base sm:text-lg leading-relaxed text-[#4A5C64] text-pretty">
                                Des sessions courtes animées par les consultants du cabinet : gouvernance,
                                maîtrise des risques, droit des affaires et gestion des ressources humaines.
                                Sélectionnez une date dans le calendrier pour ne voir que ce jour-là.
                            </p>

                            {sessionsAVenir.length > 0 && (
                                <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#4A5C64]">
                                    <span className="font-medium text-odillon-dark">
                                        {sessionsAVenir.length} session{sessionsAVenir.length > 1 ? "s" : ""} à venir
                                    </span>
                                    {modalites.length > 0 && (
                                        <>
                                            <span aria-hidden="true" className="text-odillon-teal/40">/</span>
                                            <span>{modalites.join(" et ")}</span>
                                        </>
                                    )}
                                </p>
                            )}
                        </div>

                        <div className="od-rise [--od-rise-delay:90ms] border-t border-odillon-teal/15 pt-6 lg:w-72 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                            {prochaine ? (
                                <>
                                    <p className="od-eyebrow">Prochaine session</p>
                                    <p className="mt-3 text-sm font-medium tabular-nums text-odillon-teal">
                                        {formatDateRange(prochaine.date_debut, prochaine.date_fin)}
                                    </p>
                                    <p className="mt-1.5 text-base font-semibold leading-snug text-odillon-dark text-balance">
                                        {typoFr(prochaine.titre)}
                                    </p>
                                    {prochaine.lieu && (
                                        <p className="mt-1 text-sm text-[#4A5C64]">{prochaine.lieu}</p>
                                    )}

                                    {(prochaine.inscriptions_ouvertes ?? true) && !estComplet(prochaine) ? (
                                        <Link
                                            href={`/formations/${prochaine.id}/inscription`}
                                            className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-odillon-teal hover:text-odillon-teal/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odillon-teal"
                                        >
                                            S&apos;inscrire
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    ) : (
                                        <p className="mt-4 text-sm font-medium text-[#4A5C64]">
                                            {estComplet(prochaine) ? "Session complète" : "Inscriptions fermées"}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p className="od-eyebrow">Programme</p>
                                    <p className="mt-3 max-w-[30ch] text-sm text-[#4A5C64]">
                                        Aucune session n&apos;est programmée pour le moment.
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-odillon-teal hover:text-odillon-teal/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odillon-teal"
                                    >
                                        Être informé des prochaines dates
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <section className="od-section py-14 md:py-20">
                <div className="od-container">
                    <div className="grid lg:grid-cols-[minmax(0,360px)_1fr] gap-8 lg:gap-12 items-start">
                        {/* Le calendrier reste ancré en haut de sa colonne : ni sticky
                            (il suivrait le défilement dès que la liste de droite est
                            longue), ni dimensionné au contenu (sa largeur changerait
                            d'un mois à l'autre). */}
                        <div>
                            <div className="od-surface mx-auto flex w-fit max-w-full justify-center p-4 lg:mx-0 lg:w-full">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    month={month}
                                    onMonthChange={setMonth}
                                    modifiers={{ hasFormation: formationDays }}
                                    modifiersClassNames={{
                                        hasFormation: "bg-odillon-teal/15 text-odillon-teal font-bold rounded-full",
                                    }}
                                />
                            </div>
                            {selectedDate && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedDate(undefined)}
                                    className="mt-3 w-full text-odillon-teal hover:text-odillon-teal/80"
                                >
                                    Voir toutes les formations
                                </Button>
                            )}
                        </div>

                        <div className="space-y-5">
                            {visible.length === 0 ? (
                                <div className="od-surface-muted text-center py-16 border-dashed">
                                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">
                                        {selectedDate
                                            ? "Aucune formation programmée à cette date."
                                            : "Aucune formation programmée pour le moment."}
                                    </p>
                                </div>
                            ) : (
                                visible.map(f => <FormationCard key={f.id} f={f} />)
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
