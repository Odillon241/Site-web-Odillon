"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { BlurFade } from "@/components/magicui/blur-fade"

interface CtaBannerProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  badgeText?: string
  imageUrl?: string | null
  defaultImageUrl?: string
  className?: string
}

export function CtaBanner({
  title,
  description,
  buttonText,
  buttonHref,
  badgeText,
  imageUrl: propImageUrl,
  defaultImageUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=500&fit=crop",
  className = ""
}: CtaBannerProps) {
  const [ctaImageUrl, setCtaImageUrl] = useState<string | null>(propImageUrl ?? null)

  // Récupérer l'URL de la photo CTA depuis les paramètres si non fournie
  useEffect(() => {
    if (propImageUrl !== undefined) {
      setCtaImageUrl(propImageUrl)
      return
    }

    const fetchCtaImage = async () => {
      try {
        const res = await fetch('/api/settings', {
          cache: 'default',
          next: { revalidate: 60 }
        })
        if (res.ok) {
          const data = await res.json()
          setCtaImageUrl(data.settings?.services_cta_image_url || null)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la photo CTA:', error)
      }
    }
    fetchCtaImage()
  }, [propImageUrl])

  return (
    <BlurFade delay={0.4}>
      <section className={`py-12 w-full ${className}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden w-full rounded-xl shadow-xl">
            {/* Image Background */}
            <div className="absolute inset-0">
              <Image
                alt="Équipe en collaboration"
                src={ctaImageUrl || defaultImageUrl}
                width={1200}
                height={500}
                className="w-full h-full object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
            </div>

            <div className="relative z-10 flex items-center min-h-[400px]">
              <div className="max-w-2xl px-8 md:px-12 py-12">
                {badgeText && (
                  <span className="inline-block py-1 px-3 rounded bg-white/10 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-wider mb-6 border border-white/20">
                    {badgeText}
                  </span>
                )}

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 font-petrov-sans">
                  {title}
                </h2>

                {description && (
                  <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-lg">
                    {description}
                  </p>
                )}

                <Button
                  asChild
                  size="lg"
                  className="bg-white text-odillon-dark hover:bg-gray-100 border-0 text-base px-8 py-6 rounded-full shadow-lg transition-all hover:scale-105"
                >
                  <Link href={buttonHref} className="inline-flex items-center gap-2">
                    {buttonText}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BlurFade>
  )
}

