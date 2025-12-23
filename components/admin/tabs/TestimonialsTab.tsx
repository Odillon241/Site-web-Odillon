"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Quote } from "lucide-react"
import { Testimonial } from "@/types/admin"

export function TestimonialsTab() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])

    return (
        <Card className="shadow-lg border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b">
                <CardTitle className="flex items-center gap-2 text-orange-900">
                    <Quote className="w-5 h-5" />
                    Gestion des Témoignages
                    <Badge variant="secondary" className="ml-auto">
                        {testimonials.length} témoignages
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="text-center py-12 bg-orange-50 rounded-lg">
                    <Quote className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-orange-900 mb-2">
                        Section Témoignages
                    </h3>
                    <p className="text-orange-700 mb-4">
                        Cette section sera disponible dans la prochaine mise à jour
                    </p>
                    <p className="text-sm text-orange-600">
                        Fonctionnalités à venir : Ajout de témoignages clients, gestion des avatars, etc.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
