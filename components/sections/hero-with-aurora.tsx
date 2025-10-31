"use client"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { ArrowRight, Shield, TrendingUp, Users, Award } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AuroraBackground } from "@/components/ui/aurora-background"

export function HeroWithAurora() {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Aurora Background Effect */}
      <AuroraBackground>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <FadeIn delay={0.1}>
                <div className="inline-block">
                  <span className="inline-flex items-center rounded-full bg-odillon-teal/10 px-4 py-1.5 text-sm font-medium text-odillon-teal">
                    <Award className="w-4 h-4 mr-2" />
                    Excellence en Ingénierie d'Entreprises
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                  Structurez votre{" "}
                  <span className="text-odillon-teal">entreprise</span> pour la{" "}
                  <span className="text-odillon-lime">réussite</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Cabinet de conseil en ingénierie d'entreprises spécialisé dans la structuration, 
                  la gestion administrative, les relations publiques et le management des risques.
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-odillon-teal hover:bg-odillon-teal/90 text-white text-lg px-8 py-6 group"
                  >
                    <Link href="#contact">
                      Démarrer un projet
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-odillon-teal text-odillon-teal hover:bg-odillon-teal hover:text-white text-lg px-8 py-6"
                  >
                    <Link href="#services">Nos services</Link>
                  </Button>
                </div>
              </FadeIn>

              {/* Stats */}
              <FadeIn delay={0.5}>
                <div className="grid grid-cols-3 gap-6 pt-8 border-t" id="gouvernance">
                  <div>
                    <div className="text-3xl font-bold text-odillon-teal">15+</div>
                    <div className="text-sm text-gray-600 mt-1">Années d'expérience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-odillon-teal">100+</div>
                    <div className="text-sm text-gray-600 mt-1">Projets réalisés</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-odillon-teal">50+</div>
                    <div className="text-sm text-gray-600 mt-1">Clients satisfaits</div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Content - Feature Cards */}
            <div className="relative" id="services">
              <div className="grid grid-cols-2 gap-4">
                <BlurFade delay={0.2}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-odillon-teal/10 rounded flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-odillon-teal" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Gouvernance</h3>
                    <p className="text-sm text-gray-600">
                      Structuration et mise en place de politiques efficaces
                    </p>
                  </motion.div>
                </BlurFade>

                <BlurFade delay={0.3}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded border border-gray-200 mt-8"
                    id="conseil"
                  >
                    <div className="w-12 h-12 bg-odillon-lime/10 rounded flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-odillon-lime" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Finances</h3>
                    <p className="text-sm text-gray-600">
                      Conseil financier et levée de fonds stratégique
                    </p>
                  </motion.div>
                </BlurFade>

                <BlurFade delay={0.4}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded border border-gray-200"
                    id="administration"
                  >
                    <div className="w-12 h-12 bg-odillon-teal/10 rounded flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-odillon-teal" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">RH</h3>
                    <p className="text-sm text-gray-600">
                      Gestion des talents et développement organisationnel
                    </p>
                  </motion.div>
                </BlurFade>

                <BlurFade delay={0.5}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded border border-gray-200 mt-8"
                  >
                    <div className="w-12 h-12 bg-odillon-lime/10 rounded flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-odillon-lime" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Juridique</h3>
                    <p className="text-sm text-gray-600">
                      Accompagnement juridique et contractuel complet
                    </p>
                  </motion.div>
                </BlurFade>
              </div>
            </div>
          </div>
        </div>
      </AuroraBackground>
    </section>
  )
}

