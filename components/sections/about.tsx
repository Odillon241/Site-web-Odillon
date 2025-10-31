"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { Building2, Users, Trophy, Globe } from "lucide-react"
import Image from "next/image"
import { CountingNumber } from "@/components/ui/counting-number"
import { GradientText } from "@/components/ui/gradient-text"

const stats = [
  {
    icon: Building2,
    value: 15,
    suffix: "+",
    label: "Années d'expérience"
  },
  {
    icon: Users,
    value: 50,
    suffix: "+",
    label: "Clients accompagnés"
  },
  {
    icon: Trophy,
    value: 100,
    suffix: "+",
    label: "Projets réussis"
  },
  {
    icon: Globe,
    value: 3,
    suffix: "",
    label: "Pays couverts"
  }
]

export function About() {
  return (
    <section id="apropos" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <FadeIn delay={0.1}>
              <span className="inline-flex items-center rounded-full bg-odillon-teal/10 px-4 py-1.5 text-sm font-medium text-odillon-teal">
                À Propos de Nous
              </span>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Votre partenaire de confiance en{" "}
                <GradientText>ingénierie d'entreprises</GradientText>
              </h2>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Odillon - Ingénierie d'Entreprises</strong> est 
                  un cabinet de conseil spécialisé dans l'accompagnement des organisations dans leur 
                  développement et leur transformation.
                </p>
                <p>
                  Nous intervenons sur quatre domaines principaux : la <strong className="text-odillon-teal">gouvernance</strong>, 
                  le <strong className="text-odillon-teal">juridique</strong>, 
                  les <strong className="text-odillon-teal">finances</strong> et 
                  l'<strong className="text-odillon-teal">administration des ressources humaines</strong>.
                </p>
                <p>
                  Notre approche personnalisée et notre expertise reconnue nous permettent de proposer 
                  des solutions adaptées aux enjeux spécifiques de chaque client, qu'il s'agisse de 
                  structuration, de restructuration ou de management stratégique.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="grid grid-cols-2 gap-6 pt-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="border-l-4 border-odillon-teal pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="w-5 h-5 text-odillon-teal" />
                        <div className="text-3xl font-bold text-gray-900">
                          <CountingNumber 
                            value={stat.value} 
                            suffix={stat.suffix} 
                            duration={2 + index * 0.2} 
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </FadeIn>
          </div>

          {/* Right Content - Image & Highlights */}
          <div className="relative">
            <FadeIn delay={0.3} direction="left">
              <div className="relative rounded overflow-hidden bg-odillon-teal/5 p-8 border border-gray-200">
                <div className="space-y-6">
                  <div className="bg-white rounded p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Notre Mission</h3>
                    <p className="text-gray-600 text-sm">
                      Accompagner les entreprises dans leur transformation et leur croissance 
                      en apportant des solutions innovantes et personnalisées.
                    </p>
                  </div>

                  <div className="bg-white rounded p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Notre Vision</h3>
                    <p className="text-gray-600 text-sm">
                      Être le partenaire de référence en ingénierie d'entreprises en Afrique 
                      centrale, reconnu pour notre excellence et notre engagement.
                    </p>
                  </div>

                  <div className="bg-odillon-teal rounded p-6 border border-odillon-teal text-white">
                    <h3 className="text-lg font-semibold mb-3">Notre Engagement</h3>
                    <p className="text-sm">
                      Fournir des services de qualité supérieure en respectant les plus hauts 
                      standards d'éthique professionnelle et de déontologie.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

