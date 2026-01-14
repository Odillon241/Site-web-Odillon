"use client"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

const faqItems = [
    {
        question: "Quels types d'entreprises accompagnez-vous ?",
        answer: "Nous accompagnons tous types d'organisations : PME, grandes entreprises, institutions publiques et organisations internationales. Notre expertise s'adapte à votre contexte spécifique, que vous soyez en phase de création, de développement ou de restructuration."
    },
    {
        question: "Quelle est votre zone d'intervention géographique ?",
        answer: "Basés à Libreville au Gabon, nous intervenons dans toute l'Afrique Centrale et de l'Ouest. Nous accompagnons également des projets à dimension internationale grâce à notre réseau de partenaires."
    },
    {
        question: "Combien de temps dure une mission type ?",
        answer: "La durée varie selon la complexité du projet. Une mission de diagnostic peut prendre 2 à 4 semaines, tandis qu'un accompagnement en restructuration complète peut s'étendre sur 6 à 12 mois. Nous définissons ensemble un calendrier adapté à vos objectifs."
    },
    {
        question: "Comment se déroule un premier contact ?",
        answer: "Après votre prise de contact, nous organisons une réunion de découverte gratuite pour comprendre vos besoins. Nous vous présentons ensuite une proposition personnalisée incluant méthodologie, calendrier et investissement."
    },
    {
        question: "Proposez-vous des formations ?",
        answer: "Oui, nous proposons des formations sur mesure dans nos domaines d'expertise : gouvernance d'entreprise, gestion des risques, management RH et conformité réglementaire. Ces formations peuvent être dispensées en présentiel ou à distance."
    },
    {
        question: "Quelles garanties offrez-vous sur vos prestations ?",
        answer: "Nous nous engageons sur des résultats mesurables définis en début de mission. Notre approche pragmatique et notre suivi régulier garantissent un retour sur investissement tangible. Nous restons disponibles après la mission pour assurer la pérennité des solutions mises en place."
    }
]

export function FaqHome() {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-odillon-teal/5 rounded-full blur-[120px] -translate-y-1/2" />
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <BlurFade delay={0.1}>
                        <Badge variant="odillon" className="mb-4">
                            <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                            FAQ
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-petrov-sans">
                            Questions <span className="text-odillon-teal">fréquentes</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Retrouvez les réponses aux questions les plus courantes sur nos services et notre approche.
                        </p>
                    </BlurFade>
                </div>

                {/* FAQ Accordion */}
                <BlurFade delay={0.2}>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <Accordion type="single" collapsible className="divide-y divide-gray-100">
                            {faqItems.map((item, idx) => (
                                <AccordionItem
                                    key={idx}
                                    value={`item-${idx}`}
                                    className="border-none px-6 md:px-8"
                                >
                                    <AccordionTrigger className="py-6 text-left text-base md:text-lg font-semibold text-gray-900 hover:text-odillon-teal hover:no-underline transition-colors">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6 text-gray-600 leading-relaxed">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </BlurFade>

                {/* Contact CTA */}
                <BlurFade delay={0.4}>
                    <div className="text-center mt-12">
                        <p className="text-gray-600 mb-4">
                            Vous avez une autre question ?
                        </p>
                        <a
                            href="#contact"
                            className="inline-flex items-center text-odillon-teal font-semibold hover:text-odillon-teal/80 transition-colors"
                        >
                            Contactez-nous directement
                            <span className="ml-2">→</span>
                        </a>
                    </div>
                </BlurFade>
            </div>
        </section>
    )
}
