"use client"

import { useEffect, useState, useRef } from "react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import {
  Phone,
  MapPin,
  Send,
  Mail,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Building2,
  User,
  AtSign,
  MessageSquare,
  FileText,
  ShieldCheck,
  ShieldAlert
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
      { label: "+241 74 75 95 15", link: "tel:+24174759515" },
    ],
    description: "Du lundi au vendredi, 8h-16h30"
  },
  {
    icon: Mail,
    title: "Email",
    items: [
      { label: "contact@odillon.fr", link: "mailto:contact@odillon.fr" },
      { label: "odillon2017@gmail.com", link: "mailto:odillon2017@gmail.com" }
    ],
    description: "Réponse sous 24h ouvrées"
  },
  {
    icon: MapPin,
    title: "Adresse",
    items: [
      { label: "BP: 13 262" },
      { label: "Libreville (Gabon)" }
    ],
    link: "https://www.google.com/maps?q=0.3780070242976405,9.454325471658247",
    description: "Sur rendez-vous uniquement"
  },
  {
    icon: MapPin,
    title: "Nos Bureaux",
    items: [
      { label: "Libreville - Glass (Gabon)" },
    ],
    description: ""
  }
]

/* ── Heures d'ouverture du cabinet ─────────────────────────────────────────
   Le Gabon est à UTC+1 toute l'année (pas de changement d'heure), mais le
   visiteur, lui, peut être n'importe où : l'état affiché est donc toujours
   calculé dans le fuseau de Libreville, jamais dans celui du navigateur. */

const OUVERTURE_MIN = 8 * 60        // 8h00
const FERMETURE_MIN = 16 * 60 + 30  // 16h30
const NOMS_JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
const CODES_JOURS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const formatteurLibreville = new Intl.DateTimeFormat("en-US", {
  timeZone: "Africa/Libreville",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

type EtatCabinet = { ouvert: boolean; detail: string }

function etatCabinet(maintenant: Date): EtatCabinet {
  const parts = Object.fromEntries(
    formatteurLibreville.formatToParts(maintenant).map((p) => [p.type, p.value])
  )
  const jour = CODES_JOURS.indexOf(parts.weekday)
  const minutes = Number(parts.hour) * 60 + Number(parts.minute)
  const ouvrable = jour >= 1 && jour <= 5

  if (ouvrable && minutes >= OUVERTURE_MIN && minutes < FERMETURE_MIN) {
    return { ouvert: true, detail: "ferme à 16h30" }
  }
  if (ouvrable && minutes < OUVERTURE_MIN) {
    return { ouvert: false, detail: "ouvre à 8h00" }
  }

  // Après la fermeture ou le week-end : on cherche le prochain jour ouvré.
  let decalage = 1
  while ([0, 6].includes((jour + decalage) % 7)) decalage++

  return {
    ouvert: false,
    detail: decalage === 1
      ? "ouvre demain à 8h00"
      : `ouvre ${NOMS_JOURS[(jour + decalage) % 7]} à 8h00`,
  }
}

/** L'état reste `null` au premier rendu : le serveur ne peut pas connaître
    l'instant du client sans provoquer une divergence d'hydratation. */
function useEtatCabinet() {
  const [etat, setEtat] = useState<EtatCabinet | null>(null)

  useEffect(() => {
    const rafraichir = () => setEtat(etatCabinet(new Date()))
    rafraichir()
    const timer = setInterval(rafraichir, 60_000)
    return () => clearInterval(timer)
  }, [])

  return etat
}

export function Contact() {
  const etat = useEtatCabinet()
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
      {/* ===== HERO =====
          Le fait le plus utile à qui arrive ici n'est pas une promesse, c'est
          de savoir si le cabinet décroche maintenant. L'état d'ouverture tient
          donc la colonne de droite, séparé du titre par un simple filet. */}
      <header className="relative overflow-hidden border-b border-odillon-teal/10">
        <div aria-hidden="true" className="od-hero-grid absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <div className="od-rise max-w-2xl">
              <h1 className="font-baskvill italic text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.06] tracking-[-0.02em] text-odillon-dark text-balance">
                Contact
              </h1>
              <p className="mt-5 max-w-[56ch] text-base sm:text-lg leading-relaxed text-[#4A5C64] text-pretty">
                Une question, un projet de structuration, un besoin d'accompagnement :
                écrivez-nous par le formulaire ci-dessous, ou appelez le cabinet
                pendant les heures d'ouverture.
              </p>
              <a
                href="tel:+24111747574"
                className="mt-7 inline-flex items-center gap-2 rounded-md border border-odillon-teal/30 px-4 py-3 text-sm font-semibold text-odillon-teal transition-colors hover:bg-odillon-teal/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odillon-teal"
              >
                <Phone className="w-4 h-4" />
                Appeler le cabinet
              </a>
            </div>

            <div className="od-rise [--od-rise-delay:90ms] border-t border-odillon-teal/15 pt-6 lg:w-[19rem] lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="flex min-h-6 items-center gap-2.5 text-sm">
                {etat ? (
                  <>
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 shrink-0 rounded-full ${etat.ouvert ? "bg-emerald-600" : "bg-amber-500"}`}
                    />
                    <span className="text-[#4A5C64]">
                      <span className="font-semibold text-odillon-dark">
                        {etat.ouvert ? "Ouvert" : "Fermé"}
                      </span>
                      {" · "}
                      {etat.detail}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold text-odillon-dark">Horaires du cabinet</span>
                )}
              </p>

              <dl className="mt-4 text-sm">
                <div className="flex items-baseline justify-between gap-6 border-t border-odillon-teal/10 pt-2.5">
                  <dt className="whitespace-nowrap text-[#4A5C64]">Lundi – vendredi</dt>
                  <dd className="whitespace-nowrap font-medium tabular-nums text-odillon-dark">8h00 – 16h30</dd>
                </div>
                <div className="mt-2.5 flex items-baseline justify-between gap-6 border-t border-odillon-teal/10 pt-2.5">
                  <dt className="whitespace-nowrap text-[#4A5C64]">Samedi – dimanche</dt>
                  <dd className="text-[#4A5C64]">Fermé</dd>
                </div>
              </dl>

              <p className="mt-3 text-xs text-[#4A5C64]">Heure de Libreville (UTC+1)</p>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 pt-14 md:pt-20 pb-20 md:pb-28 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Form-first layout: form takes center stage */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

            {/* ===== LEFT: FORM (focal point) ===== */}
            <div className="lg:col-span-7 order-1">
              <BlurFade delay={0.2}>
                <div className="relative bg-white rounded-lg p-6 sm:p-8 md:p-10 border border-gray-100 shadow-lg shadow-gray-100/50">
                  {/* Subtle top accent */}
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-odillon-teal/30 to-transparent" />

                  {/* Form Header */}
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-odillon-teal/[0.06] rounded-full mb-4">
                      <Send className="w-3.5 h-3.5 text-odillon-teal" />
                      <span className="text-xs font-semibold text-odillon-teal uppercase tracking-wider">Formulaire</span>
                    </div>
                    <h2 className="font-baskvill italic text-2xl md:text-3xl font-bold text-gray-900 mb-2">
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
                        className={`p-4 rounded-lg border ${submitStatus.type === 'success'
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
                          className="h-12 bg-gray-50/60 border-gray-200 rounded-lg focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
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
                          className="h-12 bg-gray-50/60 border-gray-200 rounded-lg focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
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
                          className="h-12 bg-gray-50/60 border-gray-200 rounded-lg focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
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
                          className="h-12 bg-gray-50/60 border-gray-200 rounded-lg focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
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
                        className="h-12 bg-gray-50/60 border-gray-200 rounded-lg focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
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
                        className="resize-none bg-gray-50/60 border-gray-200 rounded-lg focus:border-odillon-teal focus:ring-2 focus:ring-odillon-teal/10 transition-all placeholder:text-gray-300"
                        placeholder="Décrivez-nous votre projet ou votre besoin..."
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-odillon-teal hover:bg-odillon-teal/90 text-white text-base font-semibold rounded-lg shadow-lg shadow-odillon-teal/20 hover:shadow-odillon-teal/30 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className={`group relative bg-white rounded-lg p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-odillon-teal/20 transition-all duration-300 ${hasLink ? 'cursor-pointer' : ''}`}
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
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-odillon-teal/[0.02] via-transparent to-odillon-lime/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative flex items-start gap-4">
                        <div className="w-11 h-11 rounded-lg bg-odillon-teal/[0.07] flex items-center justify-center flex-shrink-0 group-hover:bg-odillon-teal/[0.12] group-hover:scale-105 transition-all duration-300">
                          <InfoIcon className="w-5 h-5 text-odillon-teal" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-odillon-teal transition-colors text-sm mb-1.5">
                            {info.title}
                          </h3>
                          {/* Les coordonnées cliquables sont l'action principale sur
                              mobile : chacune porte sa propre marge interne pour
                              atteindre 44px de haut, sans zones qui se recouvrent. */}
                          <div className="mb-1.5 space-y-0.5">
                            {info.items.map((item, i) => (
                              item.link ? (
                                <a
                                  key={i}
                                  href={item.link}
                                  onClick={(e) => e.stopPropagation()}
                                  className="-mx-2 block rounded-md px-2 py-3 text-sm font-medium text-gray-700 hover:bg-odillon-teal/[0.06] hover:text-odillon-teal transition-colors"
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

              {/* Les horaires ne sont plus répétés ici : le hero les porte,
                  avec l'état d'ouverture en temps réel. */}

              {/* Compact Map */}
              <BlurFade delay={0.5}>
                <div className="relative rounded-lg overflow-hidden border border-gray-100 shadow-sm group h-[200px] sm:h-[220px]">
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

      {/* ===== SÉCURITÉ & AUTHENTICITÉ ===== */}
      <div className="relative z-10 pb-20 md:pb-24 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.2}>
            <div className="relative bg-white rounded-lg border border-amber-200/60 shadow-sm overflow-hidden">
              {/* Deux colonnes à partir de lg : à gauche l'avertissement (mesure de
                  lecture tenue à ~62ch), à droite la référence pratique. Sans cela
                  la pleine largeur de page étirerait le paragraphe à ~150ch. */}
              <div className="grid gap-8 p-6 sm:p-8 md:p-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8">

                {/* ---- L'avertissement ---- */}
                <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                      <ShieldAlert className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full mb-2">
                        <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">Vigilance</span>
                      </div>
                      <h2 className="font-baskvill italic text-2xl md:text-3xl font-bold text-gray-900 leading-tight text-balance">
                        Vérifiez l'authenticité de nos contacts
                      </h2>
                    </div>
                  </div>

                  {/* 46ch ≈ 500px avec cette fonte, soit ~75 caractères par ligne :
                      le `ch` CSS mesure la chasse du « 0 », bien plus large que la
                      moyenne réelle. Le plafond ne mord qu'entre 805 et 1023px. */}
                  <div className="mt-6 max-w-[46ch] space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed text-pretty">
                    <p>
                      Des personnes mal intentionnées peuvent tenter d'usurper l'identité du cabinet Odillon en utilisant
                      des adresses e-mail ressemblantes, des numéros de téléphone frauduleux ou des messages se réclamant
                      faussement de nos équipes.
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Avant toute transmission d'informations sensibles,
                      virement ou engagement contractuel</span>, nous vous invitons à vérifier scrupuleusement l'origine
                      des communications reçues.
                    </p>
                  </div>
                </div>

                {/* ---- La référence pratique ---- */}
                <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-2 lg:border-l lg:border-gray-100 lg:pl-12">
                  {/* Canaux officiels */}
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-4 h-4 text-odillon-teal" />
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Nos seuls canaux officiels
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="border-t border-gray-100 pt-3.5">
                      <p className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                        <Mail className="w-3.5 h-3.5 text-odillon-teal flex-shrink-0" />
                        E-mails officiels
                      </p>
                      <a href="mailto:contact@odillon.fr" className="-mx-2 block rounded-md px-2 py-3 text-sm font-medium text-gray-800 hover:bg-odillon-teal/[0.06] hover:text-odillon-teal transition-colors break-words">
                        contact@odillon.fr
                      </a>
                      <a href="mailto:odillon2017@gmail.com" className="-mx-2 block rounded-md px-2 py-3 text-sm font-medium text-gray-800 hover:bg-odillon-teal/[0.06] hover:text-odillon-teal transition-colors break-words">
                        odillon2017@gmail.com
                      </a>
                    </div>

                    <div className="border-t border-gray-100 pt-3.5">
                      <p className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                        <Phone className="w-3.5 h-3.5 text-odillon-teal flex-shrink-0" />
                        Numéros officiels
                      </p>
                      <a href="tel:+24111747574" className="-mx-2 block rounded-md px-2 py-3 text-sm font-medium text-gray-800 hover:bg-odillon-teal/[0.06] hover:text-odillon-teal transition-colors">
                        +241 11 74 75 74
                      </a>
                      <a href="tel:+24174759515" className="-mx-2 block rounded-md px-2 py-3 text-sm font-medium text-gray-800 hover:bg-odillon-teal/[0.06] hover:text-odillon-teal transition-colors">
                        +241 74 75 95 15
                      </a>
                    </div>
                  </div>

                  {/* Points de vigilance */}
                  <div className="mt-9">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        Points de vigilance
                      </h3>
                    </div>
                    <ul className="space-y-2.5 text-sm text-gray-600 leading-relaxed">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        <span>Contrôlez l'orthographe exacte du domaine e-mail (ex : <span className="font-mono text-gray-900">odillon.fr</span>) — méfiez-vous des variantes trompeuses.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        <span>Ne communiquez jamais de données bancaires ou confidentielles sans avoir confirmé l'identité de votre interlocuteur.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        <span>En cas de doute, contactez-nous directement via les coordonnées officielles avant toute action.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* ---- CTA Signaler ---- */}
                <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-end pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Vous avez reçu un message suspect se réclamant d'Odillon ?
                  </p>
                  <a
                    href="mailto:contact@odillon.fr?subject=Signalement%20-%20Message%20suspect"
                    className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 bg-odillon-teal hover:bg-odillon-teal/90 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-odillon-teal/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odillon-teal"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Nous le signaler
                  </a>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
