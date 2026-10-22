// Catalogue des produits Odillon.
// Sources : « RESUME LUCRECE.xlsx » (feuille « Catalogue »), listes mises à jour
// par le client, et catalogue de formations 2026-2027 (Mallet Consulting).

export type IconePole = "Landmark" | "Users" | "Scale" | "Rocket" | "GraduationCap"

export type Illustration = {
  src: string
  alt: string
}

export type GroupeProduits = {
  titre?: string
  // Étape d'un programme en plusieurs phases (« Phase 1 »…).
  etape?: string
  illustration?: Illustration
  produits: string[]
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
    accroche: "Découvrez notre programme d'accompagnement en trois modules",
    couleur: "#00a795",
    icone: "Rocket",
    badge: "3 modules",
    groupes: [
      {
        titre: "Odillon Start",
        etape: "Phase 1 · Créer",
        illustration: {
          src: "/images/entrepreneuriat/odillon-start.jpg",
          alt: "Porteur de projet annotant son plan d'affaires à côté d'un ordinateur",
        },
        produits: [
          "Analyse du projet",
          "Accompagnement à la création",
          "Lancement de la société",
          "Rédaction du business plan",
          "Coaching",
        ],
      },
      {
        titre: "Odillon Project",
        etape: "Phase 2 · Structurer",
        illustration: {
          src: "/images/entrepreneuriat/odillon-project.jpg",
          alt: "Équipe organisant ses priorités sur un tableau de notes adhésives",
        },
        produits: ["Politique commerciale", "Élaboration de l'organigramme", "Coaching"],
      },
      {
        titre: "Odillon Grow",
        etape: "Phase 3 · Développer",
        illustration: {
          src: "/images/entrepreneuriat/odillon-grow.jpg",
          alt: "Tableau de bord affichant la progression de l'activité",
        },
        produits: [
          "Recherche de financement",
          "Visibilité de l'activité",
          "Analyse du chiffre d'affaires",
          "Coaching",
        ],
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
  return pole.groupes.reduce((total, groupe) => total + groupe.produits.length, 0)
}
