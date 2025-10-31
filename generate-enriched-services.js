// Script pour générer le fichier services-detailed.tsx enrichi

const fs = require('fs');

// Contenu enrichi massif...
const fileContent = `"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { MenuDock, type MenuDockItem } from "@/components/ui/shadcn-io/menu-dock"
import { 
  Shield, 
  Scale, 
  TrendingUp, 
  Users,
  ArrowRight,
  Target,
  FileText,
  Users2,
  BarChart3,
  Briefcase,
  Award,
  Info
} from "lucide-react"
import Link from "next/link"

// Type pour les détails enrichis
type DetailItem = {
  title: string
  description: string
  detail: string
  exemple: string
}

type ServiceItem = {
  icon: any
  name: string
  description: string
  detailsEnriched: DetailItem[]
}

type ServiceDetailed = {
  id: string
  icon: any
  title: string
  color: string
  shortDescription: string
  longDescription: string
  services: ServiceItem[]
  benefits: string[]
}

// DONNÉES ENRICHIES MASSIVES
const servicesDetailed: ServiceDetailed[] = [
  {
    id: "gouvernance",
    icon: Shield,
    title: "Gouvernance d'Entreprise",
    color: "odillon-teal",
    shortDescription: "Structuration et mise en place des règles de bonne gouvernance pour optimiser la performance organisationnelle",
    longDescription: "La gouvernance d'entreprise est le socle fondamental de toute organisation performante. Nous vous accompagnons dans la définition et la mise en œuvre de structures de gouvernance adaptées à vos enjeux stratégiques, en conformité avec les meilleures pratiques internationales.",
    services: [
      {
        icon: Target,
        name: "Promotion des Règles de Bonne Gouvernance",
        description: "Nous établissons un cadre de gouvernance solide et transparent pour votre organisation.",
        detailsEnriched: [
          {
            title: "Définition des orientations stratégiques, de la vision et des valeurs",
            description: "Les orientations stratégiques constituent la boussole de l'entreprise. Elles définissent la direction à long terme, les objectifs majeurs et les principes fondamentaux qui guident toutes les décisions organisationnelles.",
            detail: "Ce processus implique l'identification de la mission de l'entreprise (raison d'être), la définition d'une vision inspirante (où nous voulons aller) et l'établissement de valeurs fondamentales qui reflètent la culture et les principes éthiques de l'organisation. Nous facilitons des ateliers stratégiques avec les dirigeants pour clarifier ces éléments, les documenter clairement et les communiquer efficacement à tous les niveaux de l'organisation.",
            exemple: "Par exemple, une entreprise de services peut définir sa vision comme 'Devenir le leader régional en excellence opérationnelle d'ici 2030' avec des valeurs telles que l'intégrité (relations transparentes avec tous les partenaires), l'innovation (amélioration continue des processus) et l'excellence client (satisfaction supérieure à 90%). Ces éléments guideront ensuite toutes les décisions stratégiques et opérationnelles."
          }
        ]
      }
    ],
    benefits: []
  }
]

export function ServicesDetailed() {
  // Menu items pour MenuDock
  const menuItems: MenuDockItem[] = [
    { 
      label: 'Gouvernance', 
      icon: Shield,
      onClick: () => {
        document.getElementById('gouvernance')?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    { 
      label: 'Juridique', 
      icon: Scale,
      onClick: () => {
        document.getElementById('juridique')?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    { 
      label: 'Finances', 
      icon: TrendingUp,
      onClick: () => {
        document.getElementById('finances')?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    { 
      label: 'RH', 
      icon: Users,
      onClick: () => {
        document.getElementById('ressources-humaines')?.scrollIntoView({ behavior: 'smooth' })
      }
    },
  ]

  return (
    <section className="py-16 bg-white">
      {/* Menu Dock Flottant */}
      <nav className="fixed right-8 top-32 z-40 hidden xl:block">
        <MenuDock 
          items={menuItems}
          variant="compact"
          orientation="vertical"
          showLabels={true}
          animated={true}
        />
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <FadeIn delay={0.1}>
            <Badge className="mb-4 bg-odillon-teal/10 text-odillon-teal hover:bg-odillon-teal/20">
              Nos Domaines d'Expertise
            </Badge>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Des services complets pour votre{" "}
              <span className="text-odillon-teal">réussite</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-base text-gray-600">
              Découvrez notre gamme complète de services en ingénierie d'entreprises. 
              Chaque domaine d'expertise est conçu pour répondre à vos enjeux stratégiques 
              et opérationnels avec des solutions sur mesure.
            </p>
          </FadeIn>
        </div>

        {/* Services Sections */}
        <FadeIn delay={0.4}>
          <div className="space-y-20">
            {servicesDetailed.map((service, serviceIndex) => (
              <div key={service.id} id={service.id} className="scroll-mt-32">
                {/* Service Overview */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{service.longDescription}</p>
                  </CardContent>
                </Card>

                {/* Detailed Services with Accordions */}
                <div className="space-y-6 mt-8">
                  <h3 className="text-xl font-semibold text-gray-900">Nos Prestations Détaillées</h3>
                  
                  {service.services.map((subService, subIndex) => (
                    <Card key={subIndex} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-900">{subService.name}</CardTitle>
                        <CardDescription>{subService.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {subService.detailsEnriched?.map((detail, detailIndex) => (
                            <AccordionItem 
                              key={detailIndex} 
                              value={\`item-\${detailIndex}\`}
                              className="border-b border-gray-200 last:border-b-0"
                            >
                              <AccordionTrigger className="hover:no-underline py-4 text-left">
                                <div className="flex items-start gap-3">
                                  <Info className="w-4 h-4 text-odillon-teal mt-1 flex-shrink-0" />
                                  <span className="font-medium text-gray-900">{detail.title}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-2 pb-4">
                                <div className="ml-7 space-y-4">
                                  {/* Description courte */}
                                  <div className="bg-odillon-teal/5 p-4 border-l-2 border-odillon-teal">
                                    <p className="text-sm font-medium text-gray-900 mb-1">��� En bref</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{detail.description}</p>
                                  </div>
                                  
                                  {/* Détail complet */}
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 mb-2">��� Explication détaillée</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{detail.detail}</p>
                                  </div>
                                  
                                  {/* Exemple concret */}
                                  <div className="bg-gray-50 p-4 border-l-2 border-odillon-lime">
                                    <p className="text-sm font-medium text-gray-900 mb-1">��� Exemple concret</p>
                                    <p className="text-sm text-gray-700 leading-relaxed italic">{detail.exemple}</p>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Separator between services */}
                {serviceIndex < servicesDetailed.length - 1 && (
                  <div className="mt-20 border-t border-gray-200" />
                )}
              </div>
            ))}

            {/* CTA */}
            <div className="flex justify-center pt-8">
              <Button asChild className="bg-odillon-teal hover:bg-odillon-teal/90 text-white">
                <Link href="/contact">
                  Discutons de votre projet
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
`;

fs.writeFileSync('components/sections/services-detailed-temp.tsx', fileContent);
console.log('✅ Fichier temporaire créé : services-detailed-temp.tsx');
console.log('��� Note: Ce fichier est un début, il faut maintenant enrichir TOUS les services');
