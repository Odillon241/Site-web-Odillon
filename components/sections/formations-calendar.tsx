"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, MapPin, User, GraduationCap, ArrowRight } from "lucide-react"

export interface Formation {
    id: string
    titre: string
    description: string
    date_debut: string
    date_fin?: string | null
    horaires?: string | null
    duree?: string | null
    formateur?: string | null
    lieu?: string | null
    modalite?: string | null
}

const MODALITE_LABELS: Record<string, string> = {
    presentiel: "Présentiel",
    distanciel: "Distanciel",
    hybride: "Hybride",
}

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
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
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
            </div>

            <h3 className="text-xl font-bold text-odillon-dark mb-2">{f.titre}</h3>
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
            </div>

            <Button asChild className="bg-odillon-teal hover:bg-odillon-teal/90 text-white gap-2">
                <Link href={`/contact?formation=${encodeURIComponent(f.titre)}`}>
                    S'inscrire
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </Button>
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

    const visible = useMemo(() => {
        if (!selectedDate) return formations
        return formations.filter(f => isSameDay(toDate(f.date_debut), selectedDate))
    }, [formations, selectedDate])

    return (
        <section className="bg-gradient-to-b from-white to-gray-50/50 py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-odillon-teal/10 text-odillon-teal text-sm font-medium mb-4">
                        <GraduationCap className="w-4 h-4" />
                        Formations professionnelles
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-odillon-dark mb-4">
                        Calendrier des formations
                    </h1>
                    <p className="text-lg text-gray-600">
                        Découvrez nos prochaines sessions de formation et inscrivez-vous pour développer
                        les compétences de votre entreprise.
                    </p>
                </div>

                <div className="grid lg:grid-cols-[minmax(0,360px)_1fr] gap-8 lg:gap-12 items-start">
                    <div className="lg:sticky lg:top-28">
                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex justify-center">
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
                            <div className="text-center py-16 rounded-2xl border border-dashed border-gray-200 bg-white">
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
    )
}
