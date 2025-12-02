"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/shadcn-io/marquee"
import { 
  ArrowRight,
  Target,
  FileText,
  Users2,
  BarChart3,
  Briefcase,
  Award,
  Lightbulb,
  Rocket,
  ChevronRight,
  Shield,
  Scale,
  TrendingUp,
  Users
} from "lucide-react"
import Link from "next/link"
import { ServiceData } from "@/lib/services-data"

// Mapping des noms d'icônes vers les composants
const iconMap: Record<string, React.ComponentType<any>> = {
  Shield,
  Scale,
  TrendingUp,
  Users,
  Target,
  FileText,
  Users2,
  BarChart3,
  Briefcase,
  Award,
  Lightbulb,
  Rocket,
}

type ServiceSingleProps = {
  service: ServiceData
}

export function ServiceSingle({ service }: ServiceSingleProps) {
  if (!service) {
    return null
  }
  
  // Récupérer les composants d'icônes depuis les strings
  const ServiceIcon = iconMap[service.icon] || Shield
  
  return (
    <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(to_bottom,white,transparent,white)] pointer-events-none opacity-5" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16">
          <BlurFade delay={0.1}>
            <Badge className="mb-3 md:mb-4 bg-[#1A9B8E]/10 border border-[#1A9B8E]/20 text-[#1A9B8E] hover:bg-[#1A9B8E]/15 backdrop-blur-sm text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 font-medium">
              Excellence · Expertise · Innovation
            </Badge>
          </BlurFade>
          
          <BlurFade delay={0.2}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-4">
              {service.title}
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.3}>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed px-4">
              {service.description}
            </p>
          </BlurFade>
        </div>

        {/* Service Header */}
        <FadeIn>
          <Card className="border-2 relative overflow-hidden mb-8 md:mb-12" style={{ borderColor: `${service.color}30` }}>
            <div 
              className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${service.gradient} pointer-events-none`}
            />
            <CardHeader className="relative px-4 md:px-6 py-4 md:py-6">
              <CardTitle className="text-2xl md:text-3xl mb-2">{service.title}</CardTitle>
              <CardDescription className="text-base md:text-lg font-medium" style={{ color: service.color }}>
                {service.tagline}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative px-4 md:px-6 pb-4 md:pb-6">
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 md:mb-6">
                {service.description}
              </p>
              
              {/* Key Benefits */}
              <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
                {service.keyBenefits.map((benefit, idx) => {
                  const BenefitIcon = iconMap[benefit.icon] || Shield
                  return (
                    <div 
                      key={idx}
                      className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm"
                    >
                      <div 
                        className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${service.color}15`, color: service.color }}
                      >
                        <BenefitIcon className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs md:text-sm text-gray-900">{benefit.text}</div>
                        <div className="text-[10px] md:text-xs text-gray-600 mt-0.5">{benefit.detail}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Workflow */}
        <FadeIn delay={0.1}>
          <div>
            <div className="text-center mb-6 md:mb-8 px-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Notre méthode d'accompagnement
              </h3>
              <p className="text-sm md:text-base text-gray-600">Un processus éprouvé en 4 étapes</p>
            </div>
            
            <Marquee className="py-4">
              <MarqueeFade side="left" />
              <MarqueeFade side="right" />
              <MarqueeContent speed={40} pauseOnHover={true}>
                {service.workflow.map((step, idx) => {
                  const StepIcon = iconMap[step.icon] || FileText
                  return (
                    <MarqueeItem key={idx} className="w-80">
                      <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                        <CardContent className="p-6 text-center">
                          <div 
                            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold relative z-10 bg-white shadow-lg"
                            style={{ 
                              color: service.color,
                              border: `3px solid ${service.color}30`
                            }}
                          >
                            <StepIcon className="w-8 h-8" />
                          </div>
                          <div className="text-xs font-semibold text-gray-500 mb-2">ÉTAPE {step.step}</div>
                          <h4 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </CardContent>
                      </Card>
                    </MarqueeItem>
                  )
                })}
              </MarqueeContent>
            </Marquee>
          </div>
        </FadeIn>

        {/* Services Details */}
        <FadeIn delay={0.2}>
          <div className="mt-8 md:mt-12">
            <div className="text-center mb-6 md:mb-8 px-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Nos prestations en détail
              </h3>
              <p className="text-sm md:text-base text-gray-600">Explorez chaque service pour comprendre comment nous pouvons vous aider</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
              {service.services.map((subService, idx) => {
                const SubIcon = iconMap[subService.icon] || FileText
                return (
                  <Card key={idx} className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 group">
                    <CardHeader className="px-4 md:px-6 py-4 md:py-6">
                      <div className="flex items-start gap-2 md:gap-3 mb-2">
                        <div 
                          className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                          style={{ backgroundColor: `${service.color}15`, color: service.color }}
                        >
                          <SubIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base md:text-xl">{subService.name}</CardTitle>
                          <CardDescription className="text-xs md:text-sm font-medium mt-1" style={{ color: service.color }}>
                            {subService.tagline}
                          </CardDescription>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                        {subService.description}
                      </p>
                    </CardHeader>
                    <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
                      <Accordion type="multiple" className="w-full">
                        {subService.details.map((detail, detailIdx) => (
                          <AccordionItem 
                            key={detailIdx} 
                            value={`item-${detailIdx}`}
                            className="border-b border-gray-200 last:border-0"
                          >
                            <AccordionTrigger className="hover:no-underline py-2.5 md:py-3 text-left">
                              <span className="text-xs md:text-sm font-medium text-gray-900">{detail.title}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 md:space-y-3 pt-2 pb-3">
                                <div className="bg-gray-50 p-2.5 md:p-3 border-l-2" style={{ borderColor: service.color }}>
                                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                    {detail.content}
                                  </p>
                                </div>
                                <div className="bg-gradient-to-r from-gray-50 to-white p-2.5 md:p-3 border-l-2 border-gray-300">
                                  <div className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase mb-1">Impact mesurable</div>
                                  <p className="text-xs md:text-sm font-medium text-gray-900">{detail.impact}</p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn delay={0.3}>
          <Card className="border-2 bg-gradient-to-br from-gray-50 to-white mt-8 md:mt-12" style={{ borderColor: `${service.color}30` }}>
            <CardContent className="p-6 md:p-8 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 px-4">
                Prêt à transformer votre {service.title.toLowerCase()} ?
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 max-w-2xl mx-auto px-4">
                Discutons de vos enjeux et découvrez comment nos solutions peuvent propulser votre organisation vers l'excellence.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 md:gap-4">
                <Link 
                  href="/contact"
                  className="relative inline-flex items-center justify-center gap-2 h-10 md:h-11 px-6 md:px-8 rounded-md text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group w-full sm:w-auto"
                  style={{ 
                    backgroundColor: service.color,
                    color: '#ffffff'
                  }}
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300"></span>
                  <span 
                    className="relative" 
                    style={{ color: '#ffffff' }}
                  >
                    Discutons de votre projet
                  </span>
                  <ArrowRight 
                    className="w-4 h-4 md:w-5 md:h-5 relative" 
                    style={{ color: '#ffffff' }}
                  />
                </Link>
                <Link 
                  href="/#apropos"
                  className="relative inline-flex items-center justify-center gap-2 h-10 md:h-11 px-6 md:px-8 rounded-md text-xs md:text-sm font-medium border-2 transition-all duration-300 overflow-hidden group w-full sm:w-auto"
                  style={{ 
                    borderColor: service.color,
                    color: service.color
                  }}
                >
                  <span 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{ backgroundColor: service.color }}
                  ></span>
                  <span className="relative" style={{ color: service.color }}>En savoir plus sur nous</span>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 relative" style={{ color: service.color }} />
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  )
}


