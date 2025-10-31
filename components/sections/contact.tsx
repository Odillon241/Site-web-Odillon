"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"
import { GradientText } from "@/components/ui/gradient-text"

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn delay={0.1}>
            <span className="inline-flex items-center rounded-full bg-odillon-teal/10 px-4 py-1.5 text-sm font-medium text-odillon-teal mb-4">
              Contactez-nous
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Parlons de votre{" "}
              <GradientText>projet</GradientText>
            </h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-xl text-gray-600">
              Notre équipe est à votre disposition pour échanger sur vos besoins 
              et vous proposer des solutions adaptées.
            </p>
          </FadeIn>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <FadeIn delay={0.2} fullWidth>
            <Card className="border border-gray-200 hover:border-odillon-teal transition-all duration-300 h-full">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-odillon-teal/10 rounded flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-odillon-teal" />
                </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Téléphone</h3>
                <div className="space-y-2">
                  <a 
                    href="tel:+24111454454" 
                    className="block text-gray-600 hover:text-odillon-teal transition-colors"
                  >
                    +241 11 45 45 54
                  </a>
                  <a 
                    href="tel:+24174759515" 
                    className="block text-gray-600 hover:text-odillon-teal transition-colors"
                  >
                    +241 74 75 95 15
                  </a>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.3} fullWidth>
            <Card className="border border-gray-200 hover:border-odillon-teal transition-all duration-300 h-full">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-odillon-lime/10 rounded flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-odillon-lime" />
                </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Email</h3>
                <a 
                  href="mailto:odillon2017@gmail.com" 
                  className="text-gray-600 hover:text-odillon-teal transition-colors block"
                >
                  odillon2017@gmail.com
                </a>
                <p className="text-sm text-gray-500 mt-2">
                  Nous répondons sous 24h
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.4} fullWidth>
            <Card className="border border-gray-200 hover:border-odillon-teal transition-all duration-300 h-full">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-odillon-teal/10 rounded flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-odillon-teal" />
                </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Adresse</h3>
                <p className="text-gray-600">
                  BP- 13262<br />
                  Libreville, Gabon
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  www.odillon.fr
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Contact Form */}
        <FadeIn delay={0.5}>
          <Card className="mt-12 border border-gray-200">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Envoyez-nous un message
                  </h3>
                  <p className="text-gray-600">
                    Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-odillon-teal focus:border-transparent transition-all"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-odillon-teal focus:border-transparent transition-all"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-odillon-teal focus:border-transparent transition-all"
                        placeholder="+241 XX XX XX XX"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Entreprise
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-odillon-teal focus:border-transparent transition-all"
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-odillon-teal focus:border-transparent transition-all"
                      placeholder="Objet de votre demande"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-odillon-teal focus:border-transparent transition-all resize-none"
                      placeholder="Décrivez-nous votre projet ou votre besoin..."
                    />
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-odillon-teal hover:bg-odillon-teal/90 text-white px-12 py-6 text-lg group"
                    >
                      Envoyer le message
                      <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Additional Info */}
        <FadeIn delay={0.6}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-md">
              <Clock className="w-5 h-5 text-odillon-teal mr-2" />
              <span className="text-gray-700">
                Horaires d'ouverture : Lundi - Vendredi, 8h00 - 17h00
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

