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
    title: "Gouvernance d'Entreprise",
    color: "#1A9B8E",
    gradient: "from-[#1A9B8E]/20 via-[#1A9B8E]/10 to-transparent",
    tagline: "Bâtissez les fondations de votre excellence organisationnelle",
    description: "Structurez votre organisation avec des mécanismes de gouvernance robustes et transparents qui inspirent confiance et performance.",
    keyBenefits: [
      { icon: "Target", text: "Alignement stratégique", detail: "Vision claire partagée par tous" },
      { icon: "Shield", text: "Conformité assurée", detail: "Standards internationaux respectés" },
      { icon: "TrendingUp", text: "Performance optimale", detail: "Décisions basées sur des données" }
    ],
    workflow: [
      { step: "1", title: "Diagnostic", description: "Analyse de votre organisation actuelle", icon: "FileText" },
      { step: "2", title: "Conception", description: "Définition du cadre de gouvernance", icon: "Lightbulb" },
      { step: "3", title: "Déploiement", description: "Mise en œuvre des structures", icon: "Rocket" },
      { step: "4", title: "Suivi", description: "Accompagnement et ajustements", icon: "BarChart3" }
    ],
    services: [
      {
        icon: "Target",
        name: "Stratégie & Vision",
        tagline: "Définissez votre cap",
        description: "Construisez les fondations stratégiques de votre entreprise avec une vision claire et des valeurs partagées.",
        details: [
          {
            title: "Définition des orientations stratégiques",
            content: "Clarifiez votre mission, vision et valeurs pour guider toutes les décisions organisationnelles",
            impact: "Une direction claire augmente l'engagement des équipes de 40%"
          },
          {
            title: "Plan stratégique à 3-5 ans",
            content: "Élaborez une feuille de route détaillée avec objectifs mesurables et jalons clés",
            impact: "Les entreprises avec plan stratégique croissent 2x plus vite"
          },
          {
            title: "Formalisation organisationnelle",
            content: "Créez organigrammes, fiches de poste et procédures pour une structure claire",
            impact: "Réduit les conflits de rôles de 60%"
          },
          {
            title: "Code d'éthique",
            content: "Établissez les standards de conduite et principes éthiques de votre organisation",
            impact: "Renforce la confiance des parties prenantes"
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
            title: "Structuration du conseil",
            content: "Organisation du conseil d'administration et des comités spécialisés (Audit, Rémunération, Stratégie)",
            impact: "Améliore la qualité des décisions stratégiques"
          },
          {
            title: "Documentation et cadre légal",
            content: "Formalisation des règlements intérieurs, charte du conseil et processus décisionnels",
            impact: "Sécurise juridiquement votre gouvernance"
          },
          {
            title: "Formation des membres",
            content: "Développement des compétences du conseil et du management",
            impact: "Augmente l'efficacité du conseil de 35%"
          },
          {
            title: "Tableaux de bord",
            content: "Mise en place d'indicateurs de performance pour le suivi stratégique",
            impact: "Décisions 3x plus rapides et éclairées"
          }
        ]
      },
      {
        icon: "FileText",
        name: "Gestion des Risques",
        tagline: "Anticipez et maîtrisez",
        description: "Identifiez, évaluez et gérez proactivement les risques pour protéger votre organisation.",
        details: [
          {
            title: "Contrôle interne",
            content: "Système de contrôle et audit interne pour sécuriser vos opérations",
            impact: "Réduit les incidents de 70%"
          },
          {
            title: "Cartographie des risques",
            content: "Identification et évaluation systématique de tous les risques organisationnels",
            impact: "Permet une allocation optimale des ressources"
          },
          {
            title: "Audit et évaluation",
            content: "Évaluation régulière de la performance et de la conformité",
            impact: "Amélioration continue garantie"
          }
        ]
      },
      {
        icon: "BarChart3",
        name: "Communication d'Entreprise",
        tagline: "Valorisez votre image",
        description: "Développez une communication stratégique cohérente et impactante.",
        details: [
          {
            title: "Management de l'image",
            content: "Stratégie de communication interne et externe pour renforcer votre réputation",
            impact: "Augmente la valeur de marque de 45%"
          },
          {
            title: "Gestion de crise",
            content: "Préparation et gestion des situations de crise avec protocoles adaptés",
            impact: "Minimise l'impact des crises"
          },
          {
            title: "Conduite du changement",
            content: "Accompagnement des transformations organisationnelles",
            impact: "Taux de réussite des changements de 85%"
          }
        ]
      }
    ]
  },
  {
    id: "juridique",
    icon: "Scale",
    title: "Services Juridiques",
    color: "#C4D82E",
    gradient: "from-[#C4D82E]/20 via-[#C4D82E]/10 to-transparent",
    tagline: "Sécurisez vos opérations avec une expertise juridique de pointe",
    description: "Bénéficiez d'un accompagnement juridique complet et externalisé pour tous vos besoins contractuels et réglementaires.",
    keyBenefits: [
      { icon: "Shield", text: "Protection juridique", detail: "Tous vos contrats sécurisés" },
      { icon: "BarChart3", text: "Réduction des coûts", detail: "Expertise sans recrutement interne" },
      { icon: "Rocket", text: "Réactivité", detail: "Conseil disponible en temps réel" }
    ],
    workflow: [
      { step: "1", title: "Analyse", description: "Compréhension de vos besoins", icon: "FileText" },
      { step: "2", title: "Conseil", description: "Recommandations juridiques", icon: "Lightbulb" },
      { step: "3", title: "Rédaction", description: "Documents et contrats", icon: "Award" },
      { step: "4", title: "Suivi", description: "Accompagnement continu", icon: "Target" }
    ],
    services: [
      {
        icon: "FileText",
        name: "Service Juridique Externalisé",
        tagline: "Votre équipe juridique dédiée",
        description: "Une expertise juridique complète sans les coûts d'une équipe interne.",
        details: [
          {
            title: "Négociation de contrats",
            content: "Négociation des clauses financières et commerciales pour protéger vos intérêts",
            impact: "Économies moyennes de 25% sur les transactions"
          },
          {
            title: "Rédaction contractuelle",
            content: "Tous types de contrats : commerciaux, travail, partenariat, prestations...",
            impact: "Taux de litige réduit de 80%"
          },
          {
            title: "Analyse juridique",
            content: "Revue approfondie des documents légaux et identification des risques",
            impact: "Sécurisation totale de vos opérations"
          },
          {
            title: "Conseil permanent",
            content: "Assistance juridique en temps réel pour vos questions quotidiennes",
            impact: "Décisions sécurisées instantanément"
          },
          {
            title: "Veille réglementaire",
            content: "Surveillance des évolutions légales impactant votre activité",
            impact: "Toujours en conformité"
          }
        ]
      },
      {
        icon: "Shield",
        name: "Conformité & Audit",
        tagline: "Restez conforme",
        description: "Préparez et réussissez vos audits avec un accompagnement expert.",
        details: [
          {
            title: "Préparation aux audits",
            content: "Mise en conformité et préparation complète avant audit externe",
            impact: "Taux de réussite de 95%"
          },
          {
            title: "Accompagnement audit",
            content: "Présence et support durant tout le processus d'audit",
            impact: "Réduction du stress de 70%"
          },
          {
            title: "Mise en conformité",
            content: "Alignement avec les réglementations légales et sectorielles",
            impact: "Zéro risque de sanction"
          },
          {
            title: "Gestion des contentieux",
            content: "Résolution des litiges et gestion des conflits juridiques",
            impact: "Résolution 60% plus rapide"
          }
        ]
      },
      {
        icon: "Briefcase",
        name: "Droit des Affaires",
        tagline: "Développez sereinement",
        description: "Expertise complète en droit commercial et droit des sociétés.",
        details: [
          {
            title: "Création de sociétés",
            content: "Structuration juridique optimale de votre entreprise",
            impact: "Structure fiscalement avantageuse"
          },
          {
            title: "Fusions & Acquisitions",
            content: "Accompagnement dans les opérations de croissance externe",
            impact: "Transactions sécurisées"
          },
          {
            title: "Propriété intellectuelle",
            content: "Protection de vos marques, brevets et créations",
            impact: "Valorisation de vos actifs immatériels"
          },
          {
            title: "Optimisation fiscale",
            content: "Conseil en droit fiscal pour minimiser votre charge fiscale légalement",
            impact: "Économies fiscales substantielles"
          }
        ]
      }
    ]
  },
  {
    id: "finances",
    icon: "TrendingUp",
    title: "Conseil Financier",
    color: "#1A9B8E",
    gradient: "from-[#1A9B8E]/20 via-[#1A9B8E]/10 to-transparent",
    tagline: "Optimisez votre santé financière et accélérez votre croissance",
    description: "De l'élaboration du business plan à la levée de fonds, structurez votre stratégie financière pour maximiser vos performances.",
    keyBenefits: [
      { icon: "TrendingUp", text: "Croissance accélérée", detail: "Stratégie financière optimale" },
      { icon: "Target", text: "Financement facilité", detail: "Accès aux meilleures sources" },
      { icon: "BarChart3", text: "Performance mesurée", detail: "KPIs et tableaux de bord" }
    ],
    workflow: [
      { step: "1", title: "Diagnostic", description: "Analyse de votre situation financière", icon: "BarChart3" },
      { step: "2", title: "Stratégie", description: "Élaboration du plan financier", icon: "Target" },
      { step: "3", title: "Financement", description: "Recherche et négociation", icon: "TrendingUp" },
      { step: "4", title: "Pilotage", description: "Suivi et optimisation", icon: "BarChart3" }
    ],
    services: [
      {
        icon: "FileText",
        name: "Structuration Financière",
        tagline: "Posez les bases solides",
        description: "Mettez en place les processus et outils pour un pilotage financier efficace.",
        details: [
          {
            title: "Procédures financières",
            content: "Rédaction des processus comptables et financiers standardisés",
            impact: "Efficacité opérationnelle +50%"
          },
          {
            title: "Business plan",
            content: "Élaboration de prévisions financières détaillées sur 3-5 ans",
            impact: "Crédibilité auprès des investisseurs"
          },
          {
            title: "Budget annuel",
            content: "Construction du budget avec allocation optimale des ressources",
            impact: "Contrôle des dépenses assuré"
          },
          {
            title: "Tableaux de bord",
            content: "KPIs financiers et indicateurs de performance en temps réel",
            impact: "Décisions 5x plus rapides"
          },
          {
            title: "Gestion de trésorerie",
            content: "Optimisation des flux financiers et prévisions de cash",
            impact: "Zéro rupture de trésorerie"
          }
        ]
      },
      {
        icon: "TrendingUp",
        name: "Levée de Fonds",
        tagline: "Financez votre ambition",
        description: "Accompagnement complet dans la recherche et négociation de financements.",
        details: [
          {
            title: "Stratégie de financement",
            content: "Identification des meilleures sources : dette, equity, subventions...",
            impact: "Coût du capital optimisé"
          },
          {
            title: "Montage de dossiers",
            content: "Préparation des documents pour banques et investisseurs",
            impact: "Taux d'acceptation de 75%"
          },
          {
            title: "Lobbying financier",
            content: "Réseau et relations avec institutions financières",
            impact: "Accès privilégié aux financements"
          },
          {
            title: "Négociation",
            content: "Négociation des termes et conditions avec les financeurs",
            impact: "Conditions 20% plus favorables"
          },
          {
            title: "Structure financière",
            content: "Optimisation du mix dette/equity",
            impact: "Dilution minimisée"
          }
        ]
      },
      {
        icon: "BarChart3",
        name: "Analyse & Performance",
        tagline: "Pilotez avec précision",
        description: "Évaluez et optimisez votre performance financière en continu.",
        details: [
          {
            title: "Analyse financière",
            content: "Diagnostic approfondi de la santé financière",
            impact: "Identification des leviers de croissance"
          },
          {
            title: "Audit financier",
            content: "Évaluation indépendante de vos états financiers",
            impact: "Crédibilité renforcée"
          },
          {
            title: "Optimisation des coûts",
            content: "Identification et réduction des dépenses non essentielles",
            impact: "Marge améliorée de 15-30%"
          },
          {
            title: "Planification stratégique",
            content: "Vision financière long terme alignée avec la stratégie",
            impact: "Croissance durable assurée"
          }
        ]
      }
    ]
  },
  {
    id: "ressources-humaines",
    icon: "Users",
    title: "Ressources Humaines",
    color: "#C4D82E",
    gradient: "from-[#C4D82E]/20 via-[#C4D82E]/10 to-transparent",
    tagline: "Transformez votre capital humain en avantage compétitif",
    description: "De la stratégie RH à la gestion des talents, développez une organisation performante centrée sur l'humain.",
    keyBenefits: [
      { icon: "Users2", text: "Talents retenus", detail: "Turnover réduit de 50%" },
      { icon: "Award", text: "Performance accrue", detail: "Engagement +60%" },
      { icon: "Rocket", text: "Culture d'excellence", detail: "Organisation apprenante" }
    ],
    workflow: [
      { step: "1", title: "Audit RH", description: "État des lieux de votre capital humain", icon: "FileText" },
      { step: "2", title: "Stratégie", description: "Définition de la politique RH", icon: "Target" },
      { step: "3", title: "Déploiement", description: "Mise en œuvre des programmes", icon: "Rocket" },
      { step: "4", title: "Développement", description: "Formation et évolution", icon: "TrendingUp" }
    ],
    services: [
      {
        icon: "Target",
        name: "Stratégie RH",
        tagline: "Alignez votre capital humain",
        description: "Définissez le cadre stratégique et opérationnel de vos ressources humaines.",
        details: [
          {
            title: "Diagnostic RH",
            content: "Identification des forces et faiblesses de votre organisation humaine",
            impact: "Vision claire des enjeux"
          },
          {
            title: "Objectifs et plans d'action",
            content: "Définition de la feuille de route RH alignée avec la stratégie",
            impact: "Cohérence organisationnelle totale"
          },
          {
            title: "Indicateurs de performance",
            content: "Mise en place de KPIs RH pour mesurer l'efficacité",
            impact: "Décisions basées sur la data"
          },
          {
            title: "Systèmes d'information RH",
            content: "Analyse et optimisation des outils SIRH",
            impact: "Processus RH digitalisés"
          }
        ]
      },
      {
        icon: "Users2",
        name: "Développement des Talents",
        tagline: "Cultivez l'excellence",
        description: "Développez et optimisez votre capital humain pour une performance maximale.",
        details: [
          {
            title: "Gestion de la performance",
            content: "Management des sous-performances et plans d'amélioration",
            impact: "Performance +40% en 6 mois"
          },
          {
            title: "Transformation qualitative",
            content: "Développement des compétences et montée en puissance des équipes",
            impact: "Qualité du travail améliorée"
          },
          {
            title: "Gestion des talents",
            content: "Identification et développement des hauts potentiels",
            impact: "Pipeline de leaders assuré"
          },
          {
            title: "Plans de carrière",
            content: "Remodelage des parcours et plans de succession",
            impact: "Rétention des talents clés"
          },
          {
            title: "Formation continue",
            content: "Programmes de développement des compétences",
            impact: "Organisation apprenante"
          }
        ]
      },
      {
        icon: "Award",
        name: "Évaluation & Performance",
        tagline: "Mesurez et reconnaissez",
        description: "Systèmes d'évaluation objectifs et programmes de reconnaissance.",
        details: [
          {
            title: "Système d'évaluation",
            content: "Mise en place de processus d'appréciation transparents et équitables",
            impact: "Équité perçue de 90%"
          },
          {
            title: "Fiches de poste",
            content: "Description détaillée et pesée des postes",
            impact: "Clarté des attentes"
          },
          {
            title: "Management par objectifs",
            content: "Système MBO avec objectifs SMART et suivi régulier",
            impact: "Atteinte des objectifs +65%"
          },
          {
            title: "Entretiens d'évaluation",
            content: "Formation des managers et processus d'entretien structurés",
            impact: "Feedback de qualité"
          }
        ]
      },
      {
        icon: "BarChart3",
        name: "Rémunération & Avantages",
        tagline: "Récompensez justement",
        description: "Politique de rémunération compétitive et attractive.",
        details: [
          {
            title: "Audit de rémunération",
            content: "Analyse de la rémunération globale et benchmarking sectoriel",
            impact: "Compétitivité salariale assurée"
          },
          {
            title: "Enquête salariale",
            content: "Comparaison avec le marché pour rester attractif",
            impact: "Positionnement optimal"
          },
          {
            title: "Grille salariale",
            content: "Élaboration d'une structure salariale équitable",
            impact: "Équité interne garantie"
          },
          {
            title: "Avantages sociaux",
            content: "Design de packages attractifs au-delà du salaire",
            impact: "Attractivité +50%"
          },
          {
            title: "Politique d'augmentation",
            content: "Processus de révision salariale transparent",
            impact: "Motivation maintenue"
          }
        ]
      }
    ]
  }
]
