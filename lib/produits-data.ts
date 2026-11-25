// Catalogue des produits Odillon.
// Sources : « RESUME LUCRECE.xlsx » (feuille « Catalogue »), listes mises à jour
// par le client, et catalogue de formations 2026-2027 (Mallet Consulting).

export type IconePole = "Landmark" | "Users" | "Scale" | "Rocket" | "GraduationCap"

export type Illustration = {
  src: string
  alt: string
}

export type SectionServices = {
  titre: string
  produits: string[]
}

export type GroupeProduits = {
  titre?: string
  // Étape d'un programme en plusieurs modules (« Module 1 »…).
  etape?: string
  // Verbe court du sélecteur de module (« Créer ») et finalité en une ligne.
  verbe?: string
  finalite?: string
  illustration?: Illustration
  description?: string[]
  produits: string[]
  // Services regroupés par thème, à la place de la liste simple.
  sections?: SectionServices[]
  livrables?: string[]
  resultat?: string
}

export type LienPole = {
  libelle: string
  href: string
  telechargement?: boolean
}

export type PoleProduits = {
  id: string
  titre: string
  accroche: string
  couleur: string
  icone: IconePole
  groupes: GroupeProduits[]
  // Remplace le compteur « N produits » de l'en-tête.
  badge?: string
  // Catalogue consultable page par page à la place d'une liste de produits.
  catalogue?: { href: string; pages: Illustration[] }
  // Précision affichée sous la liste (partenariat, conditions…).
  mention?: string
  liens?: LienPole[]
}

export const CATALOGUE_FORMATIONS_PDF = "/documents/catalogue-formations-2026-2027.pdf"

// Coordonnées reprises de la page « Contactez-nous » du catalogue 2026-2027.
export const PARTENAIRE_FORMATION = {
  nom: "Mallet Consulting",
  telephone: "+241 62 22 36 36",
  telephoneHref: "tel:+24162223636",
  email: "malletconsulting26@gmail.com",
  adresse: "13262 Akanda, Entraco",
} as const

export const polesProduits: PoleProduits[] = [
  {
    id: "gouvernance",
    titre: "Gouvernance",
    accroche: "Vous voulez structurer la direction de votre entreprise",
    couleur: "#00a795",
    icone: "Landmark",
    groupes: [
      {
        produits: [
          "Formation des membres du conseil d'administration",
          "Rédaction ou révision des procédures",
          "Structuration de l'organigramme",
          "Tenue du secrétariat du conseil d'administration",
          "Audit de la gouvernance",
        ],
      },
    ],
  },
  {
    id: "ressources-humaines",
    titre: "Administration RH",
    accroche: "Vous voulez recruter, rémunérer et faire grandir vos équipes",
    couleur: "#C4D82E",
    icone: "Users",
    groupes: [
      {
        produits: [
          "Recrutement",
          "Enquête salariale",
          "Gestion des emplois et des compétences",
          "Bilan social",
          "Audit social",
          "Évaluation des emplois",
          "Externalisation de la paie",
          "Externalisation de la fonction RH",
        ],
      },
    ],
  },
  {
    id: "juridique",
    titre: "Juridique",
    accroche: "Vous voulez sécuriser vos contrats et votre conformité",
    couleur: "#C4D82E",
    icone: "Scale",
    groupes: [
      {
        titre: "Conseil & conformité",
        produits: [
          "Dialogue social et conventions (partenaire de négociation)",
          "Rédaction et analyse des contrats",
          "Audit et conformité",
          "Création et modification des sociétés",
        ],
      },
      {
        titre: "Droit du travail",
        produits: ["Contrat de travail", "Rédaction et amélioration du règlement intérieur"],
      },
      {
        titre: "Droit des affaires",
        produits: [
          "Contrats commerciaux",
          "Conventions",
          "Contrat de partenariat",
          "Contrat d'apport d'affaires",
        ],
      },
    ],
  },
  {
    id: "entrepreneuriat",
    titre: "Entrepreneuriat",
    accroche: "Notre accompagnement en trois modules : structurer, créer, développer",
    couleur: "#00a795",
    icone: "Rocket",
    badge: "3 modules",
    groupes: [
      {
        titre: "PROJECT",
        etape: "Module 1",
        verbe: "Structurer",
        finalite: "Concevoir et structurer le projet",
        illustration: {
          src: "/images/entrepreneuriat/odillon-project.jpg",
          alt: "Équipe organisant ses priorités sur un tableau de notes adhésives",
        },
        description: [
          "L'offre PROJECT accompagne le porteur de projet dans la conception et la structuration de son idée, avant tout engagement : le projet est analysé, chiffré et organisé pour être prêt à devenir une entreprise.",
        ],
        produits: [
          "Analyse du projet",
          "Rédaction du business plan",
          "Politique commerciale",
          "Élaboration de l'organigramme",
          "Coaching",
        ],
        resultat: "Préparer son projet : une idée analysée, structurée et chiffrée, prête à devenir une entreprise.",
      },
      {
        titre: "START",
        etape: "Module 2",
        verbe: "Créer",
        finalite: "Création, lancement et démarrage de l'activité",
        illustration: {
          src: "/images/entrepreneuriat/odillon-start.jpg",
          alt: "Porteur de projet annotant son plan d'affaires à côté d'un ordinateur",
        },
        description: [
          "L'offre START accompagne le promoteur dans le passage du projet à la réalité entrepreneuriale. Elle vise à concrétiser le projet préalablement structuré, à mettre en place les conditions nécessaires au démarrage de l'activité et à sécuriser les premiers mois d'exploitation.",
          "L'objectif est de permettre à l'entrepreneur de démarrer son activité dans un cadre juridique, administratif, organisationnel et financier maîtrisé.",
        ],
        produits: [],
        sections: [
          {
            titre: "Création juridique et formalisation",
            produits: [
              "Accompagnement dans le choix de la forme juridique",
              "Assistance à la constitution du dossier de création",
              "Orientation dans les formalités d'immatriculation",
              "Accompagnement dans l'obtention des autorisations et agréments nécessaires",
              "Identification des obligations fiscales et sociales",
              "Mise en place des documents administratifs de base",
            ],
          },
          {
            titre: "Installation et organisation opérationnelle",
            produits: [
              "Identification des besoins matériels et logistiques",
              "Accompagnement dans l'installation de l'activité",
              "Mise en place des outils de gestion",
              "Définition des processus opérationnels",
              "Organisation des circuits administratifs et financiers",
              "Mise en place des premiers tableaux de bord",
            ],
          },
          {
            titre: "Mise en place de la gestion financière",
            produits: [
              "Accompagnement à l'ouverture du compte bancaire professionnel",
              "Mise en place des outils de suivi de trésorerie",
              "Organisation de la facturation et du recouvrement",
              "Définition des procédures de dépenses",
              "Suivi des premiers investissements",
              "Mise en place d'un dispositif de suivi budgétaire",
            ],
          },
          {
            titre: "Organisation des ressources humaines",
            produits: [
              "Identification des besoins en personnel",
              "Définition des premiers postes et fiches de fonction",
              "Assistance au recrutement",
              "Mise en place des contrats et documents RH",
              "Identification des obligations sociales",
              "Sensibilisation aux règles de droit du travail",
            ],
          },
          {
            titre: "Identité commerciale et communication",
            produits: [
              "Définition de l'identité de marque",
              "Élaboration des supports de présentation",
              "Création des outils de communication commerciale",
              "Mise en place de la présence digitale",
              "Développement des premiers supports de prospection",
              "Préparation du lancement commercial",
            ],
          },
          {
            titre: "Lancement commercial",
            produits: [
              "Définition du plan d'action commercial",
              "Identification des premiers prospects",
              "Préparation des offres commerciales",
              "Accompagnement dans les premières négociations",
              "Développement des partenariats",
              "Suivi des premières ventes et prestations",
            ],
          },
          {
            titre: "Coaching et suivi post-lancement",
            produits: [
              "Coaching du promoteur",
              "Accompagnement dans la prise de décision",
              "Suivi des premiers résultats",
              "Identification des difficultés rencontrées",
              "Ajustement du dispositif opérationnel",
              "Évaluation de la viabilité du démarrage",
            ],
          },
        ],
        livrables: [
          "Une entreprise juridiquement constituée",
          "Un dossier administratif et réglementaire structuré",
          "Une organisation opérationnelle fonctionnelle",
          "Des outils de gestion administrative et financière",
          "Une identité commerciale et des supports de communication",
          "Un plan d'action commercial opérationnel",
          "Un tableau de bord de suivi des premiers mois",
        ],
        resultat: "Passer du projet à l'entreprise : créer, installer, lancer et réussir les premiers pas de son activité.",
      },
      {
        titre: "GROW",
        etape: "Module 3",
        verbe: "Développer",
        finalite: "Consolider et développer l'activité",
        illustration: {
          src: "/images/entrepreneuriat/odillon-grow.jpg",
          alt: "Tableau de bord affichant la progression de l'activité",
        },
        description: [
          "GROW est un module d'accompagnement opérationnel et stratégique, au cours de laquelle le cabinet ne se limite plus au conseil : il accompagne concrètement l'entrepreneur dans la mise en œuvre de sa stratégie de développement.",
        ],
        produits: [],
        sections: [
          {
            titre: "Les quatre dimensions de GROW",
            produits: [
              "G – Growth : accélérer la croissance",
              "R – Restructuring : renforcer et structurer l'organisation",
              "O – Opportunities : saisir les opportunités de marché",
              "W – Winning Performance : construire une performance durable",
            ],
          },
          {
            titre: "Accompagnement proposé",
            produits: [
              "Recherche de financement",
              "Visibilité de l'activité",
              "Analyse du chiffre d'affaires",
              "Coaching",
            ],
          },
        ],
        resultat: "Passer d'une entreprise qui fonctionne à une entreprise qui se développe, se structure et crée durablement de la valeur.",
      },
    ],
  },
  {
    id: "formation",
    titre: "Formation",
    accroche: "Mallet Consulting : notre partenaire formation",
    couleur: "#C4D82E",
    icone: "GraduationCap",
    badge: "Catalogue 2026-2027",
    catalogue: {
      href: CATALOGUE_FORMATIONS_PDF,
      pages: [1, 2, 3, 4].map((n) => ({
        src: `/images/catalogue-formations/page-${n}.jpg`,
        alt: `Catalogue des formations 2026-2027 de Mallet Consulting, page ${n} sur 4`,
      })),
    },
    mention: "Liste non exhaustive de formations : nous adaptons notre programme à vos besoins.",
    groupes: [],
    liens: [
      { libelle: "Télécharger le catalogue 2026-2027", href: CATALOGUE_FORMATIONS_PDF, telechargement: true },
      { libelle: "Voir le calendrier et s'inscrire", href: "/calendrier-formations" },
    ],
  },
]

export function nombreProduits(pole: PoleProduits): number {
  return pole.groupes.reduce(
    (total, groupe) =>
      total + groupe.produits.length + (groupe.sections ?? []).reduce((n, s) => n + s.produits.length, 0),
    0
  )
}
