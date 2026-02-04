"use client"

import { useState, useRef } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
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
  Loader2,
  AlertCircle,
  ArrowUpRight,
  Sparkles
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
  description: string
}

const contactInfo: ContactInfo[] = [
  {
    icon: Phone,
    title: "Téléphone",
    items: [
      { label: "+241 11 74 75 74", link: "tel:+24111747574" },
      { label: "+241 74 75 95 15", link: "tel:+24174759515" }
    ],
    description: "Du lundi au vendredi, 8h-16h30"
  },
  {
    icon: Mail,
    title: "Email",
    items: [
      { label: "contact@odillon.fr", link: "mailto:contact@odillon.fr" }
    ],
    description: "Réponse sous 24h ouvrées"
  },
  {
    icon: MapPin,
    title: "Adresse",
    items: [
      { label: "BP 13262" },
      { label: "Libreville, Gabon" }
    ],
    link: "https://www.google.com/maps?q=0.3780070242976405,9.454325471658247",
    description: "Sur rendez-vous uniquement"
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

      setSubmitStatus({
        type: 'success',
        message: result.message || 'Votre message a été envoyé avec succès. Nous vous recontacterons rapidement.'
      })

      if (formRef.current) {
        formRef.current.reset()
      }

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
      {/* Hero Header */}
      <div className="relative pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32">
        <ContactHeroBackground />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <FadeIn delay={0.1}>
              <Badge variant="odillon" className="mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Contactez-nous
              </Badge>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Parlons de votre{" "}
                <span className="text-odillon-teal">projet</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Notre équipe d'experts est à votre disposition pour vous accompagner
                dans la transformation de votre entreprise
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative pt-8 md:pt-12 pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Large Map */}
          <BlurFade delay={0.2} className="mb-16 md:mb-20">
            <div className="w-full h-[350px] md:h-[450px] rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-500 relative group bg-gray-100">
              <iframe
                width="100%"
                height="100%"
                src="https://www.google.com/maps?q=0.3780070242976405,9.454325471658247&z=17&output=embed"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium text-gray-800 shadow-sm pointer-events-none flex items-center gap-2 border border-white/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Libreville, Gabon</span>
              </div>
            </div>
          </BlurFade>

          {/* Bento Grid Layout */}
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left Column - Contact Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Methods */}
              {contactInfo.map((info, idx) => {
                const InfoIcon = info.icon
                const hasLink = info.link || info.items.some(item => item.link)

                return (
                  <BlurFade key={info.title} delay={0.1 * (idx + 1)}>
                    <div
                      className={`group relative bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-odillon-teal/30 transition-all duration-300 ${hasLink ? 'cursor-pointer' : ''}`}
                      onClick={() => {
                        if (info.link) {
                          window.open(info.link, '_blank')
                        }
                      }}
                    >
                      {/* Gradient Hover Effect */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-odillon-teal/5 via-transparent to-odillon-lime/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-md bg-odillon-teal/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                          <InfoIcon className="w-5 h-5 text-odillon-teal" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-odillon-teal transition-colors">
                              {info.title}
                            </h3>
                            {hasLink && (
                              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-odillon-teal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            )}
                          </div>
                          <div className="space-y-1 mb-2">
                            {info.items.map((item, i) => (
                              item.link ? (
                                <a
                                  key={i}
                                  href={item.link}
                                  onClick={(e) => e.stopPropagation()}
                                  className="block text-sm font-medium text-gray-700 hover:text-odillon-teal transition-colors"
                                >
                                  {item.label}
                                </a>
                              ) : (
                                <div key={i} className="text-sm text-gray-700">
                                  {item.label}
                                </div>
                              )
                            ))}
                          </div>
                          <p className="text-xs text-gray-400">{info.description}</p>
                        </div>
                      </div>
                    </div>
                  </BlurFade>
                )
              })}

              {/* Hours Card */}
              <BlurFade delay={0.4}>
                <div className="relative bg-gradient-to-br from-odillon-teal to-odillon-teal/90 rounded-lg p-6 text-white overflow-hidden">
                  {/* Decorative Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative">
                    <div className="w-12 h-12 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">Horaires d'ouverture</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-sm">Lundi - Vendredi</span>
                        <span className="font-medium">8h00 - 16h30</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-sm">Samedi - Dimanche</span>
                        <span className="text-white/60 text-sm">Fermé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>

            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-3">
              <BlurFade delay={0.3}>
                <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-200 shadow-sm">
                  {/* Form Header */}
                  <div className="mb-6">
                    <div className="w-10 h-10 bg-odillon-teal/10 rounded-md flex items-center justify-center mb-3">
                      <Send className="w-5 h-5 text-odillon-teal" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-gray-500">
                      Remplissez le formulaire et nous vous recontacterons sous 24h
                    </p>
                  </div>

                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {/* Status Messages */}
                    {submitStatus.type && (
                      <div
                        className={`p-4 rounded-lg border ${submitStatus.type === 'success'
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

                    {/* Name & Email Row */}
                    <div className="grid sm:grid-cols-2 gap-4">
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

                    {/* Phone & Company Row */}
                    <div className="grid sm:grid-cols-2 gap-4">
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
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
