"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { BubbleBackground } from "@/components/ui/shadcn-io/bubble-background"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { OrbitingCircles } from "@/components/ui/orbiting-circles"
import { Icon3D } from "@/components/ui/icon-3d"
import { NumberTicker } from "@/components/ui/number-ticker"
import { 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Star,
  Mail,
  Calendar,
  FolderOpen,
  MessageSquare,
  Shield,
  FileText,
  Users,
  CheckCircle2,
  ExternalLink
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
      { label: "+241 11747574", link: "tel:+24111747574" }
    ],
    color: "#1A9B8E"
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
    color: "#1A9B8E"
  }
]

const stats = [
  { value: 24, suffix: "h", label: "Temps de réponse", icon: Clock },
  { value: 95, suffix: "%", label: "Satisfaction client", icon: Star },
  { value: 200, suffix: "+", label: "Projets réalisés", icon: CheckCircle2 },
  { value: 50, suffix: "+", label: "Clients accompagnés", icon: Users }
]

export function Contact() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero Section with Bubble Background */}
      <div className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-white">
        <BubbleBackground
          interactive={true}
          className="absolute inset-0 opacity-20"
          colors={{
            first: '26,155,142',      // odillon-teal
            second: '196,216,46',     // odillon-lime
            third: '26,155,142',      // odillon-teal
            fourth: '196,216,46',     // odillon-lime
            fifth: '26,155,142',      // odillon-teal
            sixth: '196,216,46'       // odillon-lime
          }}
          transition={{ stiffness: 150, damping: 25 }}
        />
        
        {/* Gradient overlay vers le blanc en bas */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 md:mb-16">
            {/* Left - Content */}
            <div className="space-y-6 md:space-y-8">
              <BlurFade delay={0.1}>
                <Badge className="bg-[#1A9B8E]/10 border border-[#1A9B8E]/20 text-[#1A9B8E] hover:bg-[#1A9B8E]/15 backdrop-blur-sm text-sm md:text-base px-4 md:px-6 py-2 md:py-3 inline-flex items-center gap-2 font-medium">
                  <Send className="w-3 h-3 md:w-4 md:h-4" />
                  Contactez-nous
                </Badge>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transformons ensemble votre{" "}
                  <span className="bg-gradient-to-r from-[#1A9B8E] via-[#C4D82E] to-[#1A9B8E] bg-clip-text text-transparent animate-gradient-x">
                    vision en réalité
                  </span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Notre équipe d'experts est à votre écoute pour comprendre vos enjeux 
                  et vous proposer des solutions innovantes adaptées à vos besoins
                </p>
              </BlurFade>

              {/* Stats Grid */}
              <BlurFade delay={0.4}>
                <div className="grid grid-cols-2 gap-4 md:gap-6 pt-6 md:pt-8">
                  {stats.map((stat, idx) => {
                    const StatIcon = stat.icon
                    return (
                      <FadeIn key={stat.label} delay={0.1 * (idx + 1)}>
                        <div>
                          <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-sm mb-2 md:mb-3 border border-gray-200"
                               style={{ 
                                 background: `linear-gradient(135deg, ${idx % 2 === 0 ? '#1A9B8E' : '#C4D82E'}20, ${idx % 2 === 0 ? '#1A9B8E' : '#C4D82E'}10)`
                               }}
                          >
                            <StatIcon className="w-5 h-5 md:w-6 md:h-6" style={{ color: idx % 2 === 0 ? '#1A9B8E' : '#C4D82E' }} />
                          </div>
                          <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: idx % 2 === 0 ? '#1A9B8E' : '#C4D82E' }}>
                            <NumberTicker 
                              value={stat.value} 
                              delay={0.5 + idx * 0.1}
                              className="inline"
                            />
                            {stat.suffix}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                        </div>
                      </FadeIn>
                    )
                  })}
                </div>
              </BlurFade>
            </div>

            {/* Right - Orbiting Circles */}
            <BlurFade delay={0.5}>
              <div className="relative flex h-[300px] md:h-[400px] lg:h-[500px] w-full items-center justify-center">
                {/* Center Logo/Icon */}
                <div className="absolute z-10 flex items-center justify-center">
                  <Icon3D
                    src="/icons/3d/mail.webp" 
                    alt="Email"
                    width={60}
                    height={60}
                    fallbackIcon={Mail}
                    className="drop-shadow-lg text-odillon-teal md:w-[80px] md:h-[80px]"
                  />
                </div>

                {/* Inner Circle Mobile - Services principaux */}
                <OrbitingCircles radius={70} duration={20} iconSize={40} className="md:hidden">
                  <Icon3D
                    src="/icons/3d/calendar.webp" 
                    alt="Calendrier"
                    width={40}
                    height={40}
                    fallbackIcon={Calendar}
                    className="drop-shadow-lg text-odillon-teal"
                  />
                  <Icon3D
                    src="/icons/3d/folder.webp" 
                    alt="Stockage"
                    width={40}
                    height={40}
                    fallbackIcon={FolderOpen}
                    className="drop-shadow-lg text-odillon-lime"
                  />
                  <Icon3D
                    src="/icons/3d/chat.webp" 
                    alt="Messages"
                    width={40}
                    height={40}
                    fallbackIcon={MessageSquare}
                    className="drop-shadow-lg text-odillon-teal"
                  />
                </OrbitingCircles>

                {/* Inner Circle Desktop - Services principaux */}
                <OrbitingCircles radius={100} duration={20} iconSize={60} className="hidden md:flex">
                  <Icon3D
                    src="/icons/3d/calendar.webp" 
                    alt="Calendrier"
                    width={60}
                    height={60}
                    fallbackIcon={Calendar}
                    className="drop-shadow-lg text-odillon-teal"
                  />
                  <Icon3D
                    src="/icons/3d/folder.webp" 
                    alt="Stockage"
                    width={60}
                    height={60}
                    fallbackIcon={FolderOpen}
                    className="drop-shadow-lg text-odillon-lime"
                  />
                  <Icon3D
                    src="/icons/3d/chat.webp" 
                    alt="Messages"
                    width={60}
                    height={60}
                    fallbackIcon={MessageSquare}
                    className="drop-shadow-lg text-odillon-teal"
                  />
                </OrbitingCircles>

                {/* Outer Circle Mobile - Services additionnels */}
                <OrbitingCircles radius={120} duration={25} reverse iconSize={40} className="md:hidden">
                  <Icon3D
                    src="/icons/3d/shield.webp" 
                    alt="Sécurité"
                    width={40}
                    height={40}
                    fallbackIcon={Shield}
                    className="drop-shadow-lg text-odillon-lime"
                  />
                  <Icon3D
                    src="/icons/3d/users.webp" 
                    alt="Collaboration"
                    width={40}
                    height={40}
                    fallbackIcon={Users}
                    className="drop-shadow-lg text-odillon-lime"
                  />
                </OrbitingCircles>

                {/* Outer Circle Desktop - Services additionnels */}
                <OrbitingCircles radius={180} duration={25} reverse iconSize={60} className="hidden md:flex">
                  <Icon3D
                    src="/icons/3d/shield.webp" 
                    alt="Sécurité"
                    width={60}
                    height={60}
                    fallbackIcon={Shield}
                    className="drop-shadow-lg text-odillon-lime"
                  />
                  <Icon3D
                    src="/icons/3d/document.webp" 
                    alt="Documents"
                    width={60}
                    height={60}
                    fallbackIcon={FileText}
                    className="drop-shadow-lg text-odillon-teal"
                  />
                  <Icon3D
                    src="/icons/3d/users.webp" 
                    alt="Collaboration"
                    width={60}
                    height={60}
                    fallbackIcon={Users}
                    className="drop-shadow-lg text-odillon-lime"
                  />
                  <Icon3D
                    src="/icons/3d/checkmark.webp" 
                    alt="Vérification"
                    width={60}
                    height={60}
                    fallbackIcon={CheckCircle2}
                    className="drop-shadow-lg text-odillon-teal"
                  />
                </OrbitingCircles>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative py-12 md:py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                          className={`group relative overflow-hidden rounded border border-gray-200 hover:border-odillon-teal transition-all duration-300 p-4 md:p-6 ${isClickable ? 'cursor-pointer hover:shadow-lg' : ''}`}
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
                      8h00 - 17h00
                    </p>
                  </div>
                </FadeIn>
              </div>
            </BlurFade>

            {/* Right - Contact Form */}
            <BlurFade delay={0.6}>
              <Card className="border border-gray-200">
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

                  <form className="space-y-3 md:space-y-4">
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
                        className="w-full bg-odillon-teal hover:bg-odillon-teal/90 text-white group"
                      >
                        Envoyer le message
                        <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
