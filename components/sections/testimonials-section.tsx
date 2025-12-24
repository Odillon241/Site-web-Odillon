"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"
import { BlurFade } from "@/components/magicui/blur-fade"

interface Testimonial {
    id: string
    quote: string
    name: string
    position: string
    avatar_url: string
    display_order: number
    is_active: boolean
    page?: string
    section?: string
}

interface TestimonialsSectionProps {
    page?: string
    section?: string
    title?: string
    badge?: string
    className?: string
    limit?: number
}

export function TestimonialsSection({
    page,
    section,
    title = "Témoignages Clients",
    badge = "Avis",
    className = "",
    limit
}: TestimonialsSectionProps) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch('/api/testimonials?active=true')
                if (!res.ok) throw new Error("Failed to fetch")

                const data = await res.json()
                let filtered = (data.testimonials || []) as Testimonial[]

                // Filter by page if specified
                if (page) {
                    filtered = filtered.filter(t => !t.page || t.page === page || t.page === 'none')
                }

                // Filter by section if specified
                if (section) {
                    filtered = filtered.filter(t => !t.section || t.section === section || t.section === 'none')
                }

                // Sort by order
                filtered.sort((a, b) => a.display_order - b.display_order)

                // Limit if needed
                if (limit) {
                    filtered = filtered.slice(0, limit)
                }

                setTestimonials(filtered)
            } catch (error) {
                console.error("Error fetching testimonials:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchTestimonials()
    }, [page, section, limit])

    if (!loading && testimonials.length === 0) {
        return null
    }

    return (
        <div className={`py-12 md:py-16 ${className}`}>
            {/* Header */}
            <BlurFade delay={0.1}>
                <div className="text-center mb-10 md:mb-14 px-4">
                    <Badge variant="odillon" className="mb-4">
                        {badge}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {title}
                    </h2>
                </div>
            </BlurFade>

            {/* Grid */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <BlurFade key={testimonial.id} delay={0.1 * (idx + 1)}>
                            <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                                    <div className="mb-6 text-odillon-teal/20">
                                        <Quote className="w-10 h-10 md:w-12 md:h-12" />
                                    </div>

                                    <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed italic mb-6 flex-grow">
                                        "{testimonial.quote}"
                                    </blockquote>

                                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 bg-gray-100 ring-2 ring-white shadow-md">
                                            {testimonial.avatar_url ? (
                                                <img
                                                    src={testimonial.avatar_url}
                                                    alt={testimonial.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-odillon-teal text-white font-bold text-lg">
                                                    {testimonial.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-odillon-teal font-medium">{testimonial.position}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </BlurFade>
                    ))}
                </div>
            </div>
        </div>
    )
}
