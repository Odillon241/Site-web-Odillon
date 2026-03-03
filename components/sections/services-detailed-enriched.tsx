"use client"

import { FadeIn } from "@/components/magicui/fade-in"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
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

// Données enrichies avec explications détaillées
const servicesDetailed = [
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
            detail: "Ce processus implique l'identification de la mission de l'entreprise (raison d'être), la définition d'une vision inspirante (où nous voulons aller) et l'établissement de valeurs fondamentales qui reflètent la culture et les principes éthiques de l'organisation.",
            exemple: "Par exemple, une entreprise de services peut définir sa vision comme 'Devenir le leader régional en excellence opérationnelle d'ici 2030' avec des valeurs telles que l'intégrité, l'innovation et l'excellence client."
          },
          {
            title: "Rédaction du plan stratégique à moyen et long terme (3-5 ans)",
            description: "Le plan stratégique est un document structuré qui traduit la vision en objectifs concrets, mesurables et réalisables sur une période de 3 à 5 ans.",
            detail: "Il comprend une analyse approfondie de l'environnement (SWOT, PESTEL), la définition d'objectifs SMART, l'identification des initiatives stratégiques, l'allocation des ressources nécessaires et la définition des indicateurs de performance (KPI) pour mesurer les progrès.",
            exemple: "Un plan stratégique peut inclure des objectifs tels que 'Augmenter le chiffre d'affaires de 25% en 3 ans', 'Étendre les opérations à 3 nouveaux pays' ou 'Atteindre un taux de satisfaction client de 90%'."
          },
          {
            title: "Formalisation de l'organisation : organigrammes, fiches de poste, procédures",
            description: "La formalisation organisationnelle consiste à documenter clairement la structure, les rôles et les processus de l'entreprise pour assurer cohérence et efficacité.",
            detail: "Cela implique la création d'organigrammes détaillés montrant les lignes hiérarchiques et les relations fonctionnelles, la rédaction de fiches de poste précises définissant les responsabilités, compétences requises et critères de performance, ainsi que la documentation des procédures opérationnelles standard (SOP) pour les processus clés.",
            exemple: "Une fiche de poste pour un Directeur Commercial inclurait : objectifs (développement du CA), responsabilités (gestion de l'équipe commerciale, stratégie de vente), compétences requises (négociation, leadership) et indicateurs de performance (CA réalisé, taux de conversion)."
          },
          {
            title: "Élaboration du code d'éthique et des standards de conduite",
            description: "Le code d'éthique est un document fondamental qui établit les principes moraux et les normes de comportement attendus de tous les membres de l'organisation.",
            detail: "Il couvre des domaines tels que l'intégrité professionnelle, la prévention de la corruption, le respect de la confidentialité, la gestion des conflits d'intérêts, les relations avec les parties prenantes et les procédures de signalement des manquements. Ce code doit être communiqué, compris et accepté par tous les collaborateurs.",
            exemple: "Un code d'éthique peut interdire explicitement les pots-de-vin, définir les règles d'acceptation de cadeaux (limite de 50€), établir des règles de confidentialité des données clients et prévoir une ligne d'alerte anonyme pour signaler les violations."
          },
          {
            title: "Mise en place des mécanismes et outils de bonne gouvernance",
            description: "Les mécanismes de gouvernance sont les structures, processus et outils qui permettent une prise de décision transparente, responsable et efficace.",
            detail: "Cela inclut la création de comités spécialisés (audit, rémunération, risques), l'établissement de règlements intérieurs, la définition de processus d'approbation clairs, la mise en place de systèmes de reporting réguliers, et l'utilisation d'outils digitaux de gouvernance (portails de conseil, plateformes de vote électronique).",
            exemple: "Un comité d'audit peut se réunir trimestriellement pour examiner les états financiers, évaluer les risques financiers, superviser l'audit interne et externe, et s'assurer de la conformité aux normes comptables."
          },
          {
            title: "Mise en place des politiques et procédures de l'entreprise",
            description: "Les politiques et procédures constituent le cadre opérationnel qui guide les actions quotidiennes et assure la conformité aux standards internes et externes.",
            detail: "Les politiques définissent les règles générales (ex: politique de sécurité, politique RH, politique d'achat) tandis que les procédures détaillent les étapes spécifiques pour réaliser une tâche. Ces documents doivent être accessibles, régulièrement mis à jour et communiqués à tous les collaborateurs concernés.",
            exemple: "Une politique d'achat peut établir les seuils d'approbation (>10 000€ nécessite validation du directeur financier), les critères de sélection des fournisseurs (qualité, prix, délai) et la procédure de passation de commande (demande d'achat > validation > bon de commande > réception > paiement)."
          }
        ]
      },
      {
        icon: Users2,
        name: "Conseil d'Administration",
        description: "Structuration et optimisation du fonctionnement de votre conseil d'administration.",
        detailsEnriched: [
          {
            title: "Structuration du conseil d'Administration et des Comités spécialisés",
            description: "Le conseil d'administration est l'organe de gouvernance suprême qui définit la stratégie et supervise la direction. Sa structuration optimale est cruciale pour une gouvernance efficace.",
            detail: "La structuration implique la définition de la composition du conseil (nombre d'administrateurs, équilibre entre indépendants et exécutifs, diversité des compétences), la création de comités spécialisés (audit, rémunération, stratégie, risques, nominations) avec des mandats clairs, et l'établissement de règles de fonctionnement (quorum, fréquence des réunions, processus de prise de décision).",
            exemple: "Un conseil peut comprendre 9 membres : 3 administrateurs indépendants, 3 représentants des actionnaires, 2 dirigeants exécutifs et 1 représentant des salariés. Les comités spécialisés (audit, rémunération, stratégie) comptent 3-4 membres chacun et se réunissent avant chaque conseil pour préparer les décisions."
          },
          {
            title: "Documentation et formalisation des rôles du conseil d'Administration",
            description: "La formalisation des rôles et responsabilités du conseil garantit clarté, responsabilité et efficacité dans la prise de décision stratégique.",
            detail: "Cela comprend la rédaction d'une charte du conseil définissant ses attributions, responsabilités et limites, la clarification des rôles spécifiques (président du conseil, administrateurs indépendants, comités), la définition des relations avec la direction générale (qui décide quoi), et l'établissement de procédures de fonctionnement (convocation, ordre du jour, procès-verbaux, votes).",
            exemple: "Le règlement intérieur du conseil peut préciser : le conseil se réunit 6 fois par an minimum, l'ordre du jour est envoyé 10 jours avant, les décisions stratégiques majeures (acquisitions >5M€, endettement >10M€) nécessitent l'approbation du conseil, et chaque administrateur doit consacrer au moins 20 jours/an à son mandat."
          },
          {
            title: "Formation et développement des membres du Management et du Conseil",
            description: "Le développement continu des compétences des administrateurs et dirigeants est essentiel pour maintenir une gouvernance de qualité face aux évolutions du marché et des réglementations.",
            detail: "Les programmes de formation couvrent la gouvernance moderne, la stratégie d'entreprise, la finance pour non-financiers, la gestion des risques, la cybersécurité, les enjeux ESG (environnementaux, sociaux et de gouvernance), et les évolutions réglementaires. Des sessions d'intégration sont organisées pour les nouveaux administrateurs.",
            exemple: "Un programme annuel peut inclure : 2 jours de formation sur les nouvelles normes IFRS, 1 séminaire sur la transformation digitale et la cybersécurité, 1 session sur la responsabilité des administrateurs, et des visites de sites opérationnels pour mieux comprendre le business."
          },
          {
            title: "Mise en place de tableaux de bord pour le suivi de la performance",
            description: "Les tableaux de bord stratégiques fournissent au conseil une vision synthétique et en temps réel de la performance de l'entreprise pour faciliter la prise de décision éclairée.",
            detail: "Ces tableaux de bord consolident les indicateurs clés de performance (KPI) financiers (CA, marge, EBITDA, cash-flow), opérationnels (part de marché, productivité, qualité), commerciaux (acquisition clients, taux de rétention), RH (turnover, engagement) et stratégiques (avancement des projets clés). Ils incluent des analyses comparatives (budget vs réalisé, année N vs N-1) et des projections.",
            exemple: "Un tableau de bord conseil peut présenter mensuellement : performance financière (CA: +12% vs budget, marge: 18% vs 17% cible), indicateurs commerciaux (nouveaux contrats: 45, pipeline: 12M€), opérations (taux de service: 96%), RH (effectifs: 250, turnover: 8%) et projets stratégiques (expansion Afrique: 65% complété)."
          },
          {
            title: "Accompagnement dans la définition des rôles et responsabilités",
            description: "La clarification des rôles et responsabilités entre le conseil, la direction générale et les différentes instances de gouvernance évite les conflits et améliore l'efficacité organisationnelle.",
            detail: "Nous aidons à définir précisément qui fait quoi : le conseil définit la stratégie et supervise, la direction exécute et gère le quotidien, les comités préparent et recommandent. Cela inclut la matrice de délégation de pouvoir (qui peut approuver quoi et jusqu'à quel montant), la séparation des fonctions de président du conseil et de directeur général si pertinent, et les mécanismes de reporting et de contrôle.",
            exemple: "Matrice de décision : investissements <500K€ (DG), 500K-2M€ (DG + avis comité stratégie), >2M€ (conseil). Embauches : collaborateurs (managers), cadres (DG), directeurs (DG + avis conseil), DG adjoint (conseil). Engagements financiers : <1M€ (DG), >1M€ (conseil)."
          }
        ]
      }
    ],
    benefits: [
      "Amélioration de la transparence et de la responsabilité",
      "Réduction des risques organisationnels et opérationnels",
      "Optimisation de la prise de décision stratégique",
      "Renforcement de la confiance des parties prenantes",
      "Conformité aux standards internationaux de gouvernance"
    ]
  }
]

export function ServicesDetailedEnriched() {
  return (
    <section className="py-16 bg-white">
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

        {/* Services Sections with Enriched Details */}
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
                <div className="space-y-4 mt-8">
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
                              value={`item-${detailIndex}`}
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
                                    <p className="text-sm font-medium text-gray-900 mb-1">📌 En bref</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{detail.description}</p>
                                  </div>
                                  
                                  {/* Détail complet */}
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 mb-2">📖 Explication détaillée</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{detail.detail}</p>
                                  </div>
                                  
                                  {/* Exemple concret */}
                                  {detail.exemple && (
                                    <div className="bg-gray-50 p-4 border-l-2 border-odillon-lime">
                                      <p className="text-sm font-medium text-gray-900 mb-1">💡 Exemple concret</p>
                                      <p className="text-sm text-gray-700 leading-relaxed italic">{detail.exemple}</p>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Benefits */}
                <Card className="border border-gray-200 bg-gray-50 mt-8">
                  <CardHeader>
                    <CardTitle className="text-lg">Bénéfices Clés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-odillon-teal mt-1">•</span>
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

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

