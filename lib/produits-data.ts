// Catalogue des produits Odillon.
// Sources : « RESUME LUCRECE.xlsx » (feuille « Catalogue »), listes mises à jour
// par le client, et catalogue de formations 2026-2027 (Mallet Consulting).

export type IconePole = "Landmark" | "Users" | "Scale" | "Rocket" | "GraduationCap"

export type GroupeProduits = {
  titre?: string
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
  // Libellé du compteur (« produits » par défaut).
  unite?: string
  // Précision affichée sous la liste (partenariat, conditions…).
  mention?: string
  liens?: LienPole[]
}

export const CATALOGUE_FORMATIONS_PDF = "/documents/catalogue-formations-2026-2027.pdf"

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
          "Dialogue social et conventions (rédactions partenaires)",
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
    accroche: "Vous créez ou développez votre entreprise : 3 packs",
    couleur: "#00a795",
    icone: "Rocket",
    groupes: [
      {
        titre: "Odillon Start",
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
        produits: ["Politique commerciale", "Élaboration de l'organigramme", "Coaching"],
      },
      {
        titre: "Odillon Grow",
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
    accroche: "Vous voulez faire monter vos équipes en compétences",
    couleur: "#C4D82E",
    icone: "GraduationCap",
    unite: "formations",
    mention: "Catalogue 2026-2027, en partenariat avec Mallet Consulting.",
    groupes: [
      {
        produits: [
          "Accueil et qualité de service",
          "Management de la performance",
          "Le bilan social",
          "Gestion des conflits",
          "Recruter efficacement",
          "Devenir manager",
          "Le leadership inclusif",
          "La gestion des risques RH",
          "Asseoir son leadership",
          "Le droit du travail pour le manager",
          "La digitalisation RH",
          "L'administration des ressources humaines",
          "Gestion des carrières",
          "Gestion du temps et des priorités",
          "Le leadership féminin",
          "Conduite du changement",
          "La gestion des archives",
        ],
      },
    ],
    liens: [
      { libelle: "Télécharger le catalogue (PDF)", href: CATALOGUE_FORMATIONS_PDF, telechargement: true },
      { libelle: "Voir les dates et s'inscrire", href: "/calendrier-formations" },
    ],
  },
]

export function nombreProduits(pole: PoleProduits): number {
  return pole.groupes.reduce((total, groupe) => total + groupe.produits.length, 0)
}
