// Types avec icônes en string pour la sérialisation
export type ServiceData = {
  id: string
  icon: string // Nom de l'icône (string sérialisable)
  title: string
  color: string
  gradient: string
  tagline: string
  description: string
  keyBenefits: Array<{ icon: string; text: string; detail: string }>
  workflow: Array<{ step: string; title: string; description: string; icon: string }>
  services: Array<{
    icon: string
    name: string
    tagline: string
    description: string
    details: Array<{ title: string; content: string; impact: string }>
  }>
}

export const servicesData: ServiceData[] = [
  {
    id: "gouvernance",
    icon: "Shield",
    title: "Gouvernance",
    color: "#39837a",
    gradient: "from-[#39837a]/20 via-[#39837a]/10 to-transparent",
    tagline: "Structuration et Restructuration d'Entreprises",
    description: "Nous mettons en place des règles de bonne gouvernance pour structurer votre organisation de manière transparente et performante.",
    keyBenefits: [
      { icon: "Target", text: "Vision stratégique claire", detail: "Orientations et valeurs définies" },
      { icon: "Shield", text: "Contrôle des risques", detail: "Cartographie et audit interne" },
      { icon: "TrendingUp", text: "Performance globale", detail: "Évaluation et suivi continu" }
    ],
    workflow: [
      { step: "1", title: "Analiser", description: "Identification et évaluation des risques", icon: "BarChart3" },
      { step: "2", title: "Transférer", description: "Délégation des risques à des tiers", icon: "Users" },
      { step: "3", title: "Réduire", description: "Diminution de l'impact des risques", icon: "TrendingUp" },
      { step: "4", title: "Contrôler", description: "Surveillance et vérification", icon: "Shield" },
      { step: "5", title: "Préparer", description: "Plans de continuité d'activité", icon: "Rocket" },
      { step: "6", title: "Éviter", description: "Stratégies d'évitement", icon: "Target" }
    ],
    services: [
      {
        icon: "Target",
        name: "Promotion des Règles de Bonne Gouvernance",
        tagline: "Définissez votre cap stratégique",
        description: "Construisez les fondations stratégiques de votre entreprise avec une vision claire et des valeurs partagées.",
        details: [
          {
            title: "Définition des orientations, de la vision et des valeurs",
            content: "Clarifiez votre mission, vision et valeurs pour guider toutes les décisions organisationnelles",
            impact: "Une direction claire augmente l'engagement des équipes"
          },
          {
            title: "Rédaction du plan stratégique",
            content: "Élaborez une feuille de route détaillée avec objectifs mesurables et jalons clés",
            impact: "Les entreprises avec plan stratégique croissent plus vite"
          },
          {
            title: "Formalisation de l'organisation",
            content: "Créez organigrammes, fiches de poste et procédures pour une structure claire",
            impact: "Réduit les conflits de rôles"
          },
          {
            title: "Code d'éthique standards",
            content: "Établissez les standards de conduite et principes éthiques de votre organisation",
            impact: "Renforce la confiance des parties prenantes"
          },
          {
            title: "Mise en place des mécanismes et outils de bonne gouvernance",
            content: "Implémentation des structures de gouvernance adaptées à votre organisation",
            impact: "Transparence et efficacité décisionnelle"
          },
          {
            title: "Mise en place des politiques et procédures de l'entreprise",
            content: "Documentation et formalisation des processus internes",
            impact: "Standardisation et conformité"
          }
        ]
      },
      {
        icon: "Users2",
        name: "Conseil d'Administration",
        tagline: "Optimisez votre gouvernance",
        description: "Structurez et dynamisez votre conseil pour une gouvernance efficace et performante.",
        details: [
          {
            title: "Structuration du Conseil d'Administration et des Comités spécialisés",
            content: "Organisation du conseil d'administration et des comités spécialisés (Audit, Rémunération, Stratégie)",
            impact: "Améliore la qualité des décisions stratégiques"
          },
          {
            title: "Documentation et information clés du Conseil d'Administration",
            content: "Formalisation des règlements intérieurs, charte du conseil et processus décisionnels",
            impact: "Sécurise juridiquement votre gouvernance"
          },
          {
            title: "Formation et développement des membres du Management et du Conseil",
            content: "Développement des compétences du conseil et du management",
            impact: "Augmente l'efficacité du conseil"
          }
        ]
      },
      {
        icon: "FileText",
        name: "Couverture des Risques Opérationnels",
        tagline: "Anticipez et maîtrisez",
        description: "Identifiez, évaluez et gérez proactivement les risques pour protéger votre organisation.",
        details: [
          {
            title: "Mise en place du contrôle interne",
            content: "Système de contrôle et audit interne pour sécuriser vos opérations",
            impact: "Réduit les incidents"
          },
          {
            title: "Définition de la cartographie des risques",
            content: "Identification et évaluation systématique de tous les risques organisationnels",
            impact: "Permet une allocation optimale des ressources"
          },
          {
            title: "Audit Interne",
            content: "Évaluation régulière de la performance et de la conformité",
            impact: "Amélioration continue garantie"
          },
          {
            title: "Préparation et accompagnement de l'Audit Externe",
            content: "Support complet avant et pendant les audits externes",
            impact: "Réussite des audits assurée"
          },
          {
            title: "Audit et évaluation de la performance globale de l'entreprise",
            content: "Évaluation complète de la performance organisationnelle",
            impact: "Identification des axes d'amélioration"
          },
          {
            title: "Gestion de l'information",
            content: "Organisation et sécurisation des flux d'information",
            impact: "Information fiable et accessible"
          },
          {
            title: "Gestion de la documentation de l'entreprise",
            content: "Structuration et archivage de la documentation entreprise",
            impact: "Traçabilité et conformité"
          }
        ]
      },
      {
        icon: "BarChart3",
        name: "La Communication d'Entreprise",
        tagline: "Valorisez votre image",
        description: "Développez une communication stratégique cohérente et impactante.",
        details: [
          {
            title: "Management de l'image",
            content: "Stratégie de communication pour renforcer votre réputation",
            impact: "Augmente la valeur de marque"
          },
          {
            title: "Communication de crise",
            content: "Préparation et gestion des situations de crise avec protocoles adaptés",
            impact: "Minimise l'impact des crises"
          },
          {
            title: "Gestion du changement",
            content: "Accompagnement des transformations organisationnelles",
            impact: "Taux de réussite des changements élevé"
          },
          {
            title: "Communication interne & externe",
            content: "Stratégies de communication adaptées à chaque audience",
            impact: "Cohérence du message"
          },
          {
            title: "Assistance dans la prise des rendez-vous avec les Administrations",
            content: "Facilitation des relations avec les institutions publiques",
            impact: "Accès facilité aux interlocuteurs clés"
          },
          {
            title: "Assistance dans la coordination et le suivi des projets avec les Administrations",
            content: "Gestion des projets impliquant les administrations publiques",
            impact: "Projets menés à terme efficacement"
          }
        ]
      }
    ]
  },
  {
    id: "juridique",
    icon: "Scale",
    title: "Juridique",
    color: "#C4D82E",
    gradient: "from-[#C4D82E]/20 via-[#C4D82E]/10 to-transparent",
    tagline: "Gestion Administrative, Juridique et Financière",
    description: "Bénéficiez d'un accompagnement juridique complet et externalisé pour tous vos besoins contractuels et réglementaires.",
    keyBenefits: [
      { icon: "Shield", text: "Protection juridique", detail: "Tous vos contrats sécurisés" },
      { icon: "BarChart3", text: "Réduction des coûts", detail: "Expertise sans recrutement interne" },
      { icon: "Rocket", text: "Réactivité", detail: "Conseil disponible en temps réel" }
    ],
    workflow: [
      { step: "1", title: "Analiser", description: "Compréhension de vos besoins juridiques", icon: "BarChart3" },
      { step: "2", title: "Transférer", description: "Recommandations et clauses contractuelles", icon: "Users" },
      { step: "3", title: "Réduire", description: "Mitigation des risques juridiques", icon: "TrendingUp" },
      { step: "4", title: "Contrôler", description: "Veille juridique et conformité", icon: "Shield" },
      { step: "5", title: "Préparer", description: "Documentation et procédures", icon: "Rocket" },
      { step: "6", title: "Éviter", description: "Prévention des litiges", icon: "Target" }
    ],
    services: [
      {
        icon: "FileText",
        name: "Service Juridique Externalisé",
        tagline: "Votre équipe juridique dédiée",
        description: "Une expertise juridique complète sans les coûts d'une équipe interne.",
        details: [
          {
            title: "Service juridique externalisé",
            content: "Mise à disposition d'une expertise juridique complète pour votre entreprise",
            impact: "Réduction des coûts RH juridiques"
          },
          {
            title: "Négociation des clauses financières des Contrats",
            content: "Négociation des clauses financières et commerciales pour protéger vos intérêts",
            impact: "Économies sur les transactions"
          },
          {
            title: "Rédaction des contrats",
            content: "Tous types de contrats : commerciaux, travail, partenariat, prestations...",
            impact: "Taux de litige réduit"
          },
          {
            title: "Analyse des contrats",
            content: "Revue approfondie des documents légaux et identification des risques",
            impact: "Sécurisation totale de vos opérations"
          }
        ]
      }
    ]
  },
  {
    id: "finances",
    icon: "TrendingUp",
    title: "Finances",
    color: "#39837a",
    gradient: "from-[#39837a]/20 via-[#39837a]/10 to-transparent",
    tagline: "Management des Risques",
    description: "De l'élaboration du business plan à la levée de fonds, structurez votre stratégie financière pour maximiser vos performances.",
    keyBenefits: [
      { icon: "TrendingUp", text: "Croissance accélérée", detail: "Stratégie financière optimale" },
      { icon: "Target", text: "Financement facilité", detail: "Accès aux meilleures sources" },
      { icon: "BarChart3", text: "Performance mesurée", detail: "KPIs et tableaux de bord" }
    ],
    workflow: [
      { step: "1", title: "Analiser", description: "Diagnostic financier complet", icon: "BarChart3" },
      { step: "2", title: "Transférer", description: "Partenariats financiers", icon: "Users" },
      { step: "3", title: "Réduire", description: "Optimisation des coûts et risques", icon: "TrendingUp" },
      { step: "4", title: "Contrôler", description: "Tableaux de bord et reporting", icon: "Shield" },
      { step: "5", title: "Préparer", description: "Business plan et projections", icon: "Rocket" },
      { step: "6", title: "Éviter", description: "Stratégies de prudence", icon: "Target" }
    ],
    services: [
      {
        icon: "TrendingUp",
        name: "Conseil Financier",
        tagline: "Financez votre ambition",
        description: "Accompagnement complet dans la structuration et la recherche de financements.",
        details: [
          {
            title: "Conseil Financier pour les opérations de levée de fonds sous forme de Dette ou d'Actions",
            content: "Identification des meilleures sources de financement : dette, equity, subventions...",
            impact: "Coût du capital optimisé"
          },
          {
            title: "Conseil en Investissement",
            content: "Analyse et recommandations pour vos décisions d'investissement",
            impact: "ROI maximisé"
          },
          {
            title: "Rédaction des Procédures",
            content: "Documentation des processus comptables et financiers standardisés",
            impact: "Efficacité opérationnelle"
          },
          {
            title: "Rédaction du Business Plan",
            content: "Élaboration de prévisions financières détaillées sur 3-5 ans",
            impact: "Crédibilité auprès des investisseurs"
          },
          {
            title: "Accompagnement dans l'élaboration du Budget",
            content: "Construction du budget avec allocation optimale des ressources",
            impact: "Contrôle des dépenses assuré"
          },
          {
            title: "Mise en place des tableaux de bord",
            content: "KPIs financiers et indicateurs de performance en temps réel",
            impact: "Décisions rapides et éclairées"
          },
          {
            title: "Lobbying financier",
            content: "Réseau et relations avec institutions financières",
            impact: "Accès privilégié aux financements"
          }
        ]
      }
    ]
  },
  {
    id: "ressources-humaines",
    icon: "Users",
    title: "Administration et Ressources Humaines",
    color: "#C4D82E",
    gradient: "from-[#C4D82E]/20 via-[#C4D82E]/10 to-transparent",
    tagline: "Relations Publiques",
    description: "De la stratégie RH à la gestion des talents, développez une organisation performante centrée sur l'humain.",
    keyBenefits: [
      { icon: "Users2", text: "Talents retenus", detail: "Turnover réduit" },
      { icon: "Award", text: "Performance accrue", detail: "Engagement renforcé" },
      { icon: "Rocket", text: "Culture d'excellence", detail: "Organisation apprenante" }
    ],
    workflow: [
      { step: "1", title: "Analiser", description: "Audit du capital humain", icon: "BarChart3" },
      { step: "2", title: "Transférer", description: "Externalisation et partenariats RH", icon: "Users" },
      { step: "3", title: "Réduire", description: "Optimisation des processus RH", icon: "TrendingUp" },
      { step: "4", title: "Contrôler", description: "Indicateurs de performance RH", icon: "Shield" },
      { step: "5", title: "Préparer", description: "Développement des compétences", icon: "Rocket" },
      { step: "6", title: "Éviter", description: "Prévention des conflits", icon: "Target" }
    ],
    services: [
      {
        icon: "Target",
        name: "Projets et Chartes d'Entreprise",
        tagline: "Alignez votre capital humain",
        description: "Définissez le cadre stratégique et opérationnel de vos ressources humaines.",
        details: [
          {
            title: "Identification des atouts et des handicaps de l'Entreprise",
            content: "Diagnostic complet des forces et faiblesses de votre organisation humaine",
            impact: "Vision claire des enjeux"
          },
          {
            title: "Définition des objectifs et des plans d'action",
            content: "Définition de la feuille de route RH alignée avec la stratégie",
            impact: "Cohérence organisationnelle totale"
          },
          {
            title: "Mise en place des indicateurs de performance",
            content: "Mise en place de KPIs RH pour mesurer l'efficacité",
            impact: "Décisions basées sur la data"
          },
          {
            title: "Analyse des systèmes d'information des Ressources Humaines",
            content: "Analyse et optimisation des outils SIRH",
            impact: "Processus RH digitalisés"
          }
        ]
      },
      {
        icon: "Users2",
        name: "Politiques de Développement des Ressources Humaines",
        tagline: "Cultivez l'excellence",
        description: "Développez et optimisez votre capital humain pour une performance maximale.",
        details: [
          {
            title: "Management de la mauvaise performance",
            content: "Management des sous-performances et plans d'amélioration",
            impact: "Performance améliorée"
          },
          {
            title: "Transformation qualitative des Ressources Humaines",
            content: "Développement des compétences et montée en puissance des équipes",
            impact: "Qualité du travail améliorée"
          },
          {
            title: "Gestion des Talents",
            content: "Identification et développement des hauts potentiels",
            impact: "Pipeline de leaders assuré"
          },
          {
            title: "Remodelage des carrières",
            content: "Remodelage des parcours et plans de succession",
            impact: "Rétention des talents clés"
          },
          {
            title: "Mise en place et suivi du Plan individuel de développement",
            content: "Programmes de développement des compétences personnalisés",
            impact: "Organisation apprenante"
          }
        ]
      },
      {
        icon: "Award",
        name: "Politiques d'Évaluation de la Performance des Employés",
        tagline: "Mesurez et reconnaissez",
        description: "Systèmes d'évaluation objectifs et programmes de reconnaissance.",
        details: [
          {
            title: "Mise en place du système d'appréciation et d'évaluation",
            content: "Mise en place de processus d'appréciation transparents et équitables",
            impact: "Équité perçue"
          },
          {
            title: "Inventaire des positions/fonctions à développer",
            content: "Identification des postes clés nécessitant un développement",
            impact: "Focus stratégique"
          },
          {
            title: "Évaluation des emplois (fiches de poste et pesée des postes)",
            content: "Description détaillée et pesée des postes",
            impact: "Clarté des attentes"
          }
        ]
      },
      {
        icon: "BarChart3",
        name: "Politiques des Rémunérations et Avantages Divers",
        tagline: "Récompensez justement",
        description: "Politique de rémunération compétitive et attractive.",
        details: [
          {
            title: "Analyse des avantages et de la rémunération globale",
            content: "Analyse de la rémunération globale et benchmarking sectoriel",
            impact: "Compétitivité salariale assurée"
          },
          {
            title: "Analyse de l'enquête salariale",
            content: "Comparaison avec le marché pour rester attractif",
            impact: "Positionnement optimal"
          },
          {
            title: "Gestion des augmentations des salaires",
            content: "Processus de révision salariale transparent",
            impact: "Motivation maintenue"
          },
          {
            title: "Assistance dans l'élaboration de la grille salariale",
            content: "Élaboration d'une structure salariale équitable",
            impact: "Équité interne garantie"
          },
          {
            title: "Audit des avantages sociaux et autres avantages",
            content: "Design de packages attractifs au-delà du salaire",
            impact: "Attractivité renforcée"
          }
        ]
      }
    ]
  }
]
