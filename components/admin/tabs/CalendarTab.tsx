"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { CalendarDays } from "lucide-react"
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
        <Card className="shadow-lg border-pink-200">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100/50 border-b">
                <CardTitle className="flex items-center gap-2 text-pink-900">
                    <CalendarDays className="w-5 h-5" />
                    Calendrier des Événements du Gabon
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Calendrier */}
                    <div>
                        <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                            className="rounded-md border"
                            modifiers={{
                                hasEvent: (date) => hasEvent(date)
                            }}
                            modifiersStyles={{
                                hasEvent: {
                                    fontWeight: 'bold',
                                    backgroundColor: '#fce7f3',
                                    color: '#ec4899'
                                }
                            }}
                        />
                    </div>

                    {/* Informations sur l'événement sélectionné */}
                    <div className="space-y-4">
                        {selectedEvent ? (
                            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                                <h3 className="font-semibold text-pink-900 mb-2">
                                    {selectedEvent.title}
                                </h3>
                                <p className="text-sm text-pink-700 mb-3">
                                    {selectedEvent.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-pink-600">
                                    <CalendarDays className="w-4 h-4" />
                                    <span>
                                        {selectedDate.toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                {selectedEvent.type && (
                                    <Badge className="mt-2" variant="outline">
                                        {selectedEvent.type}
                                    </Badge>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                                <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-600">
                                    Sélectionnez une date pour voir les événements
                                </p>
                            </div>
                        )}

                        {/* Prochains événements */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Prochains événements
                            </h3>
                            <div className="space-y-2">
                                {getUpcomingEvents(5).map((event, index) => (
                                    <div
                                        key={index}
                                        className="p-3 bg-white rounded-lg border hover:border-pink-300 transition-colors"
                                    >
                                        <p className="font-medium text-sm">{event.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">
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
            </CardContent>
        </Card>
    )
}
