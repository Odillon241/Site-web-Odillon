"use client"

import { useState, useRef } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import {
  Phone,
  MapPin,
  Clock,
  Send,
  Mail,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Building2,
  User,
  AtSign,
  MessageSquare,
  FileText
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
    <section className="relative overflow-hidden">
      {/* Decorative background - spans entire page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-odillon-teal/[0.03] via-white to-odillon-lime/[0.03]" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full border border-odillon-teal/[0.07]" />
        <div className="absolute bottom-1/3 -left-20 w-[350px] h-[350px] rounded-full border border-odillon-lime/[0.07]" />
      </div>

      {/* ===== HERO ===== */}
      <div className="relative z-10 pt-8 pb-10 md:pt-12 md:pb-14 lg:pt-16 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <FadeIn delay={0.1}>
              <Badge variant="odillon" className="mb-6">
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                Prenez contact
              </Badge>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="font-baskvill text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 tracking-tight leading-[1.1]">
                Échangeons sur{" "}
                <span className="relative">
                  <span className="text-odillon-teal">vos ambitions</span>
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-odillon-teal to-odillon-lime rounded-full" />
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-base sm:text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
                Une question, un projet de structuration ou un besoin d'accompagnement ?
                Notre équipe est à votre écoute pour bâtir ensemble des solutions sur mesure.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 pb-20 md:pb-28 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Form-first layout: form takes center stage */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

            {/* ===== LEFT: FORM (focal point) ===== */}
            <div className="lg:col-span-7 order-1">
              <BlurFade delay={0.2}>
                <div className="relative bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-lg shadow-gray-100/50">
                  {/* Subtle top accent */}
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-odillon-teal/30 to-transparent" />

                  {/* Form Header */}
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-odillon-teal/[0.06] rounded-full mb-4">
                      <Send className="w-3.5 h-3.5 text-odillon-teal" />
                      <span className="text-xs font-semibold text-odillon-teal uppercase tracking-wider">Formulaire</span>
                    </div>
                    <h2 className="font-baskvill text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Décrivez votre besoin et nous reviendrons vers vous avec une proposition adaptée.
                    </p>
                  </div>

                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    {/* Status Messages */}
                    {submitStatus.type && (
                      <div
                        role="alert"
                        className={`p-4 rounded-xl border ${submitStatus.type === 'success'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                          }`}
                      >
                        <div className="flex items-start gap-3">
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
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="name" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          Nom complet <span className="text-odillon-teal">*</span>
                        </label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          required
                          placeholder="Jean Ndong"
                          className="h-12 bg-gray-50/60 border-gray-200 rounded-xl focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                          <AtSign className="w-3.5 h-3.5 text-gray-400" />
                          Email <span className="text-odillon-teal">*</span>
                        </label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          required
                          placeholder="jean@entreprise.com"
                          className="h-12 bg-gray-50/60 border-gray-200 rounded-xl focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    {/* Phone & Company Row */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          Téléphone
                        </label>
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="+241 XX XX XX XX"
                          className="h-12 bg-gray-50/60 border-gray-200 rounded-xl focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="company" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" />
                          Entreprise
                        </label>
                        <Input
                          type="text"
                          id="company"
                          name="company"
                          placeholder="Nom de votre entreprise"
                          className="h-12 bg-gray-50/60 border-gray-200 rounded-xl focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label htmlFor="subject" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        Sujet <span className="text-odillon-teal">*</span>
                      </label>
                      <Input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        placeholder="Objet de votre demande"
                        className="h-12 bg-gray-50/60 border-gray-200 rounded-xl focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                        Message <span className="text-odillon-teal">*</span>
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        className="resize-none bg-gray-50/60 border-gray-200 rounded-xl focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
                        placeholder="Décrivez-nous votre projet ou votre besoin..."
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-odillon-teal hover:bg-odillon-teal/90 text-white text-base font-semibold rounded-xl shadow-lg shadow-odillon-teal/20 hover:shadow-odillon-teal/30 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer le message
                            <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                          </>
                        )}
                      </Button>
                    </div>

                    <p className="text-xs text-center text-gray-400 pt-1">
                      Vos données sont traitées conformément à notre{" "}
                      <Link href="/politique-confidentialite" className="underline underline-offset-2 hover:text-odillon-teal transition-colors">
                        politique de confidentialité
                      </Link>.
                    </p>
                  </form>
                </div>
              </BlurFade>
            </div>

            {/* ===== RIGHT: CONTACT INFO + MAP ===== */}
            <div className="lg:col-span-5 order-2 space-y-6">
              {/* Contact Cards */}
              {contactInfo.map((info, idx) => {
                const InfoIcon = info.icon
                const hasLink = info.link || info.items.some(item => item.link)

                return (
                  <BlurFade key={info.title} delay={0.15 * (idx + 1)}>
                    <div
                      className={`group relative bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-odillon-teal/20 transition-all duration-300 ${hasLink ? 'cursor-pointer' : ''}`}
                      role={info.link ? "button" : undefined}
                      tabIndex={info.link ? 0 : undefined}
                      onClick={() => {
                        if (info.link) {
                          window.open(info.link, '_blank')
                        }
                      }}
                      onKeyDown={(e) => {
                        if (info.link && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault()
                          window.open(info.link, '_blank')
                        }
                      }}
                      aria-label={info.link ? `${info.title} - ouvrir dans un nouvel onglet` : undefined}
                    >
                      {/* Hover gradient overlay */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-odillon-teal/[0.02] via-transparent to-odillon-lime/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-odillon-teal/[0.07] flex items-center justify-center flex-shrink-0 group-hover:bg-odillon-teal/[0.12] group-hover:scale-105 transition-all duration-300">
                          <InfoIcon className="w-5 h-5 text-odillon-teal" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-odillon-teal transition-colors text-sm mb-1.5">
                            {info.title}
                          </h3>
                          <div className="space-y-0.5 mb-1.5">
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

              {/* Hours Card (teal background) */}
              <BlurFade delay={0.5}>
                <div className="relative bg-gradient-to-br from-odillon-teal to-odillon-teal/90 rounded-2xl p-5 sm:p-6 text-white overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/[0.06] rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Clock className="w-4.5 h-4.5" />
                      </div>
                      <h3 className="font-semibold text-lg">Horaires d'ouverture</h3>
                    </div>
                    <div className="space-y-2.5 pl-[52px]">
                      <div className="flex justify-between items-center">
                        <span className="text-white/75 text-sm">Lundi - Vendredi</span>
                        <span className="font-semibold text-sm">8h00 - 16h30</span>
                      </div>
                      <div className="w-full h-px bg-white/10" />
                      <div className="flex justify-between items-center">
                        <span className="text-white/75 text-sm">Samedi - Dimanche</span>
                        <span className="text-white/50 text-sm">Fermé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>

              {/* Compact Map */}
              <BlurFade delay={0.6}>
                <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm group h-[200px] sm:h-[220px]">
                  <iframe
                    title="Localisation Odillon - Libreville, Gabon"
                    width="100%"
                    height="100%"
                    src="https://www.google.com/maps?q=0.3780070242976405,9.454325471658247&z=17&output=embed"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full filter grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 shadow-sm pointer-events-none flex items-center gap-2 border border-gray-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Libreville, Gabon
                  </div>
                </div>
              </BlurFade>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
