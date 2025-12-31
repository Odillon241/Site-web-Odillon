"use client"

import { useState } from "react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee"
import Image from "next/image"
import { CompanyLogo } from "@/types/admin"

// Composant pour afficher un logo avec fallback
function LogoItem({ company }: { company: CompanyLogo }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="group relative flex items-center justify-center w-32 h-24 md:w-40 md:h-28 transition-all duration-300">
      {!imageError && company.logo_path ? (
        <div className="relative w-full h-full flex items-center justify-center transition-all duration-300 group-hover:scale-105">
          <Image
            src={company.logo_path}
            alt={`${company.name} logo`}
            width={120}
            height={80}
            className="object-contain max-w-full max-h-full"
            onError={() => setImageError(true)}
            unoptimized
          />
        </div>
      ) : (
        <div className="text-center w-full group-hover:scale-105 transition-transform">
          <div
            className="text-2xl md:text-3xl font-bold mb-1 text-gray-400 group-hover:text-gray-900 transition-colors duration-300"
          >
            {company.fallback}
          </div>
          <div className="text-xs md:text-sm text-gray-400 font-medium group-hover:text-odillon-teal transition-colors">
            {company.name}
          </div>
        </div>
      )}
    </div>
  )
}

export function TrustedByHome({ logos }: { logos: CompanyLogo[] }) {
  if (!logos || logos.length === 0) return null

  return (
    <section className="relative py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <BlurFade delay={0.2}>
          <div className="text-center mb-10">
            <h2 className="text-lg md:text-xl font-medium text-gray-500 mb-2 uppercase tracking-widest">
              Ils nous font confiance
            </h2>
            <div className="w-12 h-0.5 bg-odillon-teal/30 mx-auto rounded-full" />
          </div>
        </BlurFade>

        <BlurFade delay={0.4}>
          <div className="mb-0">
            <Marquee>
              <MarqueeContent speed={30} pauseOnHover>
                {logos.map((company) => (
                  <MarqueeItem
                    key={company.id}
                    className="mx-6 md:mx-10"
                  >
                    <LogoItem company={company} />
                  </MarqueeItem>
                ))}
              </MarqueeContent>
              <MarqueeFade side="left" className="from-white" />
              <MarqueeFade side="right" className="from-white" />
            </Marquee>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}



