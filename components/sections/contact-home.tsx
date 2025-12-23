"use client"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Button } from "@/components/ui/button"
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Send
} from "lucide-react"

const contactMethods = [
  {
    icon: Phone,
    title: "Appelez-nous",
    value: "+241 11747574",
    link: "tel:+24111747574",
    description: "Du lundi au vendredi, 8h-18h"
  },
  {
    icon: Mail,
    title: "Écrivez-nous",
    value: "contact@odillon.fr",
    link: "mailto:contact@odillon.fr",
    description: "Réponse sous 24h ouvrées"
  },
  {
    icon: MapPin,
    title: "Nous rendre visite",
    value: "Libreville, Gabon",
    link: "https://www.google.com/maps",
    description: "Sur rendez-vous uniquement"
  }
]

export function ContactHome() {
  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-gray-50/50 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-1/2 h-1/2 bg-odillon-teal/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <BlurFade delay={0.1}>
              <div className="inline-flex items-center space-x-2 text-odillon-teal font-medium mb-6">
                <span className="w-8 h-[1px] bg-odillon-teal"></span>
                <span className="uppercase tracking-widest text-sm">Contact</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-petrov-sans leading-tight">
                Transformons votre <br />
                <span className="text-odillon-teal">vision en réalité</span>.
              </h2>
            </BlurFade>
            <BlurFade delay={0.2}>
              <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
                Vous avez un projet de structuration ou de développement ? Notre équipe est prête à vous écouter et à construire avec vous des solutions sur mesure.
              </p>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="grid gap-6">
                {contactMethods.map((method, idx) => {
                  const MethodIcon = method.icon
                  return (
                    <a
                      key={method.title}
                      href={method.link}
                      className="group flex items-start p-6 bg-white rounded-lg shadow-sm border border-gray-100/80 hover:border-odillon-teal/50 hover:shadow-lg hover:-translate-x-1 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-md bg-odillon-teal/5 flex items-center justify-center text-odillon-teal group-hover:bg-odillon-teal group-hover:text-white transition-all duration-300 shrink-0 mt-1">
                        <MethodIcon className="w-5 h-5" />
                      </div>
                      <div className="ml-5 flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-odillon-teal transition-colors font-petrov-sans text-lg">{method.title}</h3>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-odillon-teal opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                        </div>
                        <div className="text-base font-medium text-gray-700 mb-1">{method.value}</div>
                        <div className="text-sm text-gray-400 font-medium group-hover:text-odillon-teal/60 transition-colors">{method.description}</div>
                      </div>
                    </a>
                  )
                })}
              </div>
            </BlurFade>
          </div>

          <div className="lg:sticky lg:top-32">
            <BlurFade delay={0.4}>
              <div className="bg-white p-8 md:p-10 rounded-lg shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">


                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-petrov-sans">Envoyez-nous un message</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Remplissez le formulaire ci-dessous et nous reviendrons vers vous avec une proposition adaptée.</p>
                </div>

                <form className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Nom</label>
                      <input type="text" placeholder="Doe" className="w-full h-12 px-4 bg-gray-50/50 rounded-md border border-gray-200 focus:border-odillon-teal focus:ring-4 focus:ring-odillon-teal/10 outline-none transition-all placeholder:text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Prénom</label>
                      <input type="text" placeholder="John" className="w-full h-12 px-4 bg-gray-50/50 rounded-md border border-gray-200 focus:border-odillon-teal focus:ring-4 focus:ring-odillon-teal/10 outline-none transition-all placeholder:text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email professionnel</label>
                    <input type="email" placeholder="john@entreprise.com" className="w-full h-12 px-4 bg-gray-50/50 rounded-md border border-gray-200 focus:border-odillon-teal focus:ring-4 focus:ring-odillon-teal/10 outline-none transition-all placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Message</label>
                    <textarea placeholder="Parlez-nous de votre projet..." className="w-full h-32 p-4 bg-gray-50/50 rounded-md border border-gray-200 focus:border-odillon-teal focus:ring-4 focus:ring-odillon-teal/10 outline-none transition-all resize-none placeholder:text-gray-400"></textarea>
                  </div>

                  <Button className="w-full bg-odillon-teal hover:bg-odillon-teal/90 h-14 text-base font-bold rounded-md shadow-lg shadow-odillon-teal/20 hover:shadow-odillon-teal/40 transition-all duration-300 mt-4 group">
                    <span>Envoyer le message</span>
                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>

                  <p className="text-xs text-center text-gray-400 mt-4 px-4">
                    Vos données sont sécurisées et traitées conformément à notre <a href="#" className="underline hover:text-odillon-teal">politique de confidentialité</a>.
                  </p>
                </form>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
