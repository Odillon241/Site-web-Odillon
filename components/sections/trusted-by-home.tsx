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
    <div className="group relative flex items-center justify-center w-20 h-16 sm:w-28 sm:h-20 md:w-36 md:h-24 lg:w-40 lg:h-28 transition-all duration-300">
      {!imageError && company.logo_path ? (
        <div className="relative w-full h-full flex items-center justify-center transition-all duration-300 group-hover:scale-105">
          <Image
            src={company.logo_path}
            alt={`${company.name} logo`}
            width={120}
            height={80}
            sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 120px"
            className="object-contain max-w-full max-h-full"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="text-center w-full group-hover:scale-105 transition-transform">
          <div
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 text-gray-400 group-hover:text-gray-900 transition-colors duration-300"
          >
            {company.fallback}
          </div>
          <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium group-hover:text-odillon-teal transition-colors">
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
    <section className="relative py-10 sm:py-14 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        <BlurFade delay={0.2}>
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-500 mb-2 uppercase tracking-widest">
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
                    className="mx-3 sm:mx-5 md:mx-8 lg:mx-10"
                  >
                    <LogoItem company={company} />
                  </MarqueeItem>
                ))}
              </MarqueeContent>
              <MarqueeFade side="left" className="from-white !w-8 sm:!w-16 md:!w-24" />
              <MarqueeFade side="right" className="from-white !w-8 sm:!w-16 md:!w-24" />
            </Marquee>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}



