"use client"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee"
import { Badge } from "@/components/ui/badge"
import { Award, Shield, TrendingUp } from "lucide-react"
import { NumberTicker } from "@/components/ui/number-ticker"

// Logos d'entreprises (remplacer par de vrais logos)
const trustedCompanies = [
  { name: "TechCorp", logo: "TC", color: "#1A9B8E" },
  { name: "InnoSoft", logo: "IS", color: "#C4D82E" },
  { name: "DataFlow", logo: "DF", color: "#1A9B8E" },
  { name: "CloudBase", logo: "CB", color: "#C4D82E" },
  { name: "SecureNet", logo: "SN", color: "#1A9B8E" },
  { name: "SmartHub", logo: "SH", color: "#C4D82E" },
  { name: "WebCraft", logo: "WC", color: "#1A9B8E" },
  { name: "CodeMaster", logo: "CM", color: "#C4D82E" },
  { name: "DigitalEdge", logo: "DE", color: "#1A9B8E" },
  { name: "FutureNet", logo: "FN", color: "#C4D82E" },
  { name: "ProSystems", logo: "PS", color: "#1A9B8E" },
  { name: "TechVision", logo: "TV", color: "#C4D82E" }
]

const trustStats = [
  { 
    icon: Award, 
    value: 50, 
    suffix: "+", 
    label: "Entreprises",
    color: "#1A9B8E"
  },
  { 
    icon: Shield, 
    value: 98, 
    suffix: "%", 
    label: "Satisfaction",
    color: "#C4D82E"
  },
  { 
    icon: TrendingUp, 
    value: 200, 
    suffix: "+", 
    label: "Projets réussis",
    color: "#1A9B8E"
  }
]

export function TrustedByHome() {
  return (
    <section className="relative py-12 md:py-20 lg:py-24 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #1A9B8E 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <BlurFade delay={0.2}>
          <div className="text-center mb-8 md:mb-12">
            <Badge 
              variant="outline" 
              className="text-xs md:text-sm px-3 md:px-4 py-1 md:py-1.5 border-odillon-teal/30 text-odillon-teal font-medium mb-4"
            >
              Nos Références
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Ils nous font{" "}
              <span className="bg-gradient-to-r from-[#1A9B8E] to-[#C4D82E] bg-clip-text text-transparent">
                Confiance
              </span>
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Des entreprises de toutes tailles nous font confiance pour leurs besoins en gouvernance et conseil
            </p>
          </div>
        </BlurFade>

        {/* Stats */}
        <BlurFade delay={0.4}>
          <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-10 md:mb-16">
            {trustStats.map((stat, idx) => {
              const StatIcon = stat.icon
              return (
                <div 
                  key={idx}
                  className="text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-odillon-teal transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <div className="flex justify-center mb-3">
                    <div 
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                        border: `2px solid ${stat.color}30`
                      }}
                    >
                      <StatIcon className="w-6 h-6 md:w-7 md:h-7" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-1">
                    <NumberTicker value={stat.value} />
                    <span>{stat.suffix}</span>
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </BlurFade>

        {/* Logos Marquee */}
        <BlurFade delay={0.6}>
          <div className="mb-8">
            <Marquee>
              <MarqueeContent speed={30} pauseOnHover>
                {trustedCompanies.map((company) => (
                  <MarqueeItem 
                    key={company.name}
                    className="mx-3 md:mx-4"
                  >
                    <div className="flex items-center justify-center w-32 h-24 md:w-40 md:h-28 bg-white rounded-xl border-2 border-gray-200 hover:border-odillon-teal transition-all duration-300 hover:shadow-xl hover:scale-105 group">
                      {/* Logo Placeholder */}
                      <div className="text-center">
                        <div 
                          className="text-3xl md:text-4xl font-bold mb-1 transition-colors duration-300"
                          style={{ color: company.color }}
                        >
                          {company.logo}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 font-medium group-hover:text-odillon-teal transition-colors">
                          {company.name}
                        </div>
                      </div>
                    </div>
                  </MarqueeItem>
                ))}
              </MarqueeContent>
              <MarqueeFade side="left" />
              <MarqueeFade side="right" />
            </Marquee>
          </div>
        </BlurFade>

        {/* Bottom Message */}
        <BlurFade delay={0.8}>
          <div className="text-center">
            <p className="text-sm md:text-base text-gray-600">
              <span className="font-semibold text-odillon-teal">Plus de 50 entreprises</span> nous font confiance pour transformer leur gouvernance
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

