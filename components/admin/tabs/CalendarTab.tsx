"use client"

import { useState, useEffect } from "react"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { CalendarDays } from "lucide-react"
import { AdminPanel } from "@/components/admin/ui/admin-panel"
import {
    getEventForDate,
    hasEvent,
    getUpcomingEvents,
    type GabonEvent
} from "@/lib/gabon-events"

export function CalendarTab() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedEvent, setSelectedEvent] = useState<GabonEvent | undefined>()
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

    useEffect(() => {
        if (selectedDate) {
            const event = getEventForDate(selectedDate)
            setSelectedEvent(event)
        }
    }, [selectedDate])

    return (
        <AdminPanel
            icon={CalendarDays}
            title="Calendrier des événements du Gabon"
            description="Jours fériés et dates clés pour planifier vos campagnes thématiques."
        >
            <div className="grid gap-6 md:grid-cols-2">
                {/* Calendrier */}
                <div className="rounded-lg border border-slate-200/80 bg-white p-2 shadow-sm">
                    <CalendarComponent
                        mode="single"
                        locale={fr}
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        month={currentMonth}
                        onMonthChange={setCurrentMonth}
                        modifiers={{
                            hasEvent: (date) => hasEvent(date)
                        }}
                        modifiersStyles={{
                            hasEvent: {
                                fontWeight: '600',
                                backgroundColor: 'rgba(0, 167, 149, 0.12)',
                                color: '#007a6d'
                            }
                        }}
                    />
                </div>

                {/* Informations sur l'événement sélectionné */}
                <div className="space-y-4">
                    {selectedEvent ? (
                        <div className="rounded-lg border border-odillon-teal/20 bg-odillon-teal/[0.06] p-4">
                            <h3 className="mb-2 font-semibold text-slate-950">
                                {selectedEvent.title}
                            </h3>
                            <p className="mb-3 text-sm leading-relaxed text-slate-600">
                                {selectedEvent.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-odillon-teal">
                                <CalendarDays className="h-4 w-4" />
                                <span>
                                    {selectedDate.toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            {selectedEvent.type && (
                                <Badge variant="outline" className="mt-3 border-odillon-lime/40 bg-odillon-lime/10 text-slate-700">
                                    {selectedEvent.type}
                                </Badge>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-white/60 p-6 text-center">
                            <CalendarDays className="mx-auto mb-2 h-10 w-10 text-slate-300" />
                            <p className="text-sm text-slate-600">
                                Sélectionnez une date pour voir les événements
                            </p>
                        </div>
                    )}

                    {/* Prochains événements */}
                    <div>
                        <h3 className="mb-3 font-semibold text-slate-950">
                            Prochains événements
                        </h3>
                        <div className="space-y-2">
                            {getUpcomingEvents(5).length === 0 && (
                                <p className="rounded-lg border border-slate-200/80 bg-white p-3 text-sm text-slate-500">
                                    Aucun événement à venir.
                                </p>
                            )}
                            {getUpcomingEvents(5).map((event, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-slate-200/80 bg-white p-3 shadow-sm transition-colors hover:border-odillon-teal/30"
                                >
                                    <p className="text-sm font-medium text-slate-900">{event.title}</p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {event.date.toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long'
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminPanel>
    )
}
