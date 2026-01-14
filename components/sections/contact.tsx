"use client"

import { useState, useRef } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ContactHeroBackground } from "@/components/ui/contact-hero-background"
import {
  Phone,
  MapPin,
  Clock,
  Send,
  Mail,
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react"

type ContactItem = {
  label: string
  link?: string
}

type ContactInfo = {
  icon: any
  title: string
  items: ContactItem[]
  link?: string
  color: string
}

const contactInfo: ContactInfo[] = [
  {
    icon: Phone,
    title: "Par Téléphone",
    items: [
      { label: "+241 11 74 75 74", link: "tel:+24111747574" },
      { label: "+241 74 75 95 15", link: "tel:+24174759515" }
    ],
    color: "#39837a"
  },
  {
    icon: Mail,
    title: "Par Email",
    items: [
      { label: "contact@odillon.fr", link: "mailto:contact@odillon.fr" }
    ],
    color: "#C4D82E"
  },
  {
    icon: MapPin,
    title: "Adresse",
    items: [
      { label: "BP- 13262" },
      { label: "Libreville, Gabon" }
    ],
    link: "https://www.google.com/maps/search/?api=1&query=Libreville,+Gabon",
    color: "#39837a"
  }
]

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Une erreur est survenue')
      }

      // Succès
      setSubmitStatus({
        type: 'success',
        message: result.message || 'Votre message a été envoyé avec succès. Nous vous recontacterons rapidement.'
      })

      // Réinitialiser le formulaire de manière sécurisée
      if (formRef.current) {
        formRef.current.reset()
      }

      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        setSubmitStatus({ type: null, message: '' })
      }, 5000)
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Simple Hero Header */}
      <div className="relative pt-6 pb-12 md:pt-10 md:pb-16 lg:pt-12 lg:pb-20">
        {/* Background Pattern */}
        <ContactHeroBackground />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <FadeIn delay={0.1}>
              <Badge variant="odillon" className="mb-4 md:mb-6">
                <Send className="w-4 h-4 mr-2" />
                Contactez-nous
              </Badge>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                Parlons de votre projet
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                Notre équipe est à votre disposition pour répondre à vos questions
                et vous accompagner dans vos projets
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative py-12 md:py-16 lg:py-20 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Large Map */}
          <BlurFade delay={0.2} className="mb-16 md:mb-20">
            <div className="w-full h-[350px] md:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-500 relative group bg-gray-100">
              <iframe
                width="100%"
                height="100%"
                id="gmap_canvas"
                src="https://maps.google.com/maps?q=Hotel+Re-Ndama+Libreville&t=&z=15&ie=UTF8&iwloc=&output=embed"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                className="w-full h-full filter grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium text-gray-800 shadow-sm pointer-events-none flex items-center gap-2 border border-white/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Quartier Glass, Libreville</span>
              </div>
            </div>
          </BlurFade>
          {/* Section Title */}
          <BlurFade delay={0.3}>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Coordonnées
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Plusieurs moyens de nous joindre pour échanger sur vos besoins
              </p>
            </div>
          </BlurFade>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
            {/* Left - Contact Info */}
            <BlurFade delay={0.5}>
              <div className="space-y-6 md:space-y-8">
                {/* Contact Cards */}
                <div className="space-y-4 md:space-y-6">
                  {contactInfo.map((info, idx) => {
                    const InfoIcon = info.icon
                    const isClickable = info.link || info.items.some(item => item.link)

                    return (
                      <FadeIn key={info.title} delay={0.1 * (idx + 1)}>
                        <div
                          className={`group relative overflow-hidden rounded border border-gray-200 hover:border-odillon-teal transition-all duration-300 p-4 md:p-6 bg-white ${isClickable ? 'cursor-pointer hover:shadow-lg' : ''}`}
                          onClick={() => {
                            if (info.link) {
                              window.open(info.link, '_blank')
                            }
                          }}
                        >
                          {/* Gradient overlay */}
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                            style={{ background: `linear-gradient(135deg, ${info.color} 0%, transparent 100%)` }}
                          />

                          <div className="flex items-start gap-4 md:gap-6 relative">
                            <div
                              className="w-10 h-10 md:w-12 md:h-12 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all duration-300"
                              style={{
                                background: `linear-gradient(135deg, ${info.color}30, ${info.color}15)`
                              }}
                            >
                              <InfoIcon className="w-5 h-5 md:w-6 md:h-6" style={{ color: info.color }} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm md:text-base font-semibold text-gray-900">
                                  {info.title}
                                </h3>
                                {isClickable && (
                                  <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-odillon-teal transition-colors flex-shrink-0" />
                                )}
                              </div>
                              <div className="space-y-1 md:space-y-2">
                                {info.items.map((item, i) => (
                                  item.link ? (
                                    <a
                                      key={i}
                                      href={item.link}
                                      onClick={(e) => e.stopPropagation()}
                                      className="block text-xs md:text-sm text-gray-600 hover:text-odillon-teal transition-colors font-medium break-all"
                                    >
                                      {item.label}
                                    </a>
                                  ) : (
                                    <div key={i} className="text-xs md:text-sm text-gray-600">
                                      {item.label}
                                    </div>
                                  )
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    )
                  })}
                </div>

                {/* Hours */}
                <FadeIn delay={0.5}>
                  <div className="bg-white p-4 md:p-6 rounded border border-gray-200">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-odillon-teal/10 rounded-sm flex items-center justify-center mb-3 md:mb-4">
                      <Clock className="w-5 h-5 md:w-6 md:h-6 text-odillon-teal" />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2">Horaires d'ouverture</h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      Lundi - Vendredi<br />
                      8h00 - 16h30
                    </p>
                  </div>
                </FadeIn>


              </div>
            </BlurFade>

            {/* Right - Contact Form */}
            <BlurFade delay={0.6}>
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-4 md:p-6">
                  <div className="mb-4 md:mb-6">
                    <div className="w-8 h-8 md:w-9 md:h-9 bg-odillon-teal/10 rounded-sm flex items-center justify-center mb-2 md:mb-3">
                      <Send className="w-5 h-5 md:w-6 md:h-6 text-odillon-teal" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-xs md:text-sm text-gray-600">
                      Remplissez le formulaire et nous vous recontacterons rapidement
                    </p>
                  </div>

                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                    {/* Messages de statut */}
                    {submitStatus.type && (
                      <div
                        className={`p-3 md:p-4 rounded-lg border ${submitStatus.type === 'success'
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                          }`}
                      >
                        <div className="flex items-start gap-2">
                          {submitStatus.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          )}
                          <p className="text-sm font-medium">{submitStatus.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Name & Email */}
                    <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet *
                        </label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          required
                          placeholder="Votre nom"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          required
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    {/* Phone & Company */}
                    <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="+241 XX XX XX XX"
                        />
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                          Entreprise
                        </label>
                        <Input
                          type="text"
                          id="company"
                          name="company"
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Sujet *
                      </label>
                      <Input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        placeholder="Objet de votre demande"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        className="resize-none"
                        placeholder="Décrivez-nous votre projet ou votre besoin..."
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        size="default"
                        disabled={isSubmitting}
                        className="w-full bg-odillon-teal hover:bg-odillon-teal/90 text-white group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer le message
                            <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
