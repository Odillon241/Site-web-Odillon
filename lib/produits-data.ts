// Catalogue des produits Odillon — source : « RESUME LUCRECE.xlsx », feuille « Catalogue ».

export type IconePole = "Landmark" | "Users" | "Scale" | "Rocket"

export type GroupeProduits = {
  titre?: string
  produits: string[]
}

export type PoleProduits = {
  id: string
  titre: string
  accroche: string
  couleur: string
  icone: IconePole
  groupes: GroupeProduits[]
}

export const polesProduits: PoleProduits[] = [
  {
    id: "gouvernance",
    titre: "Gouvernance",
    accroche: "Structuration et restructuration d'entreprises",
    couleur: "#00a795",
    icone: "Landmark",
    groupes: [
      {
        produits: [
          "Rédaction des procédures",
          "Mise en place du plan stratégique",
          "Structuration du conseil d'administration",
          "Structuration de l'organigramme",
          "Formation des membres du conseil d'administration",
          "Gestion des risques",
          "Rôles et responsabilités des institutions",
          "Tenue du secrétariat du conseil",
          "Assistance dans le suivi du plan d'action",
          "Création et modification des sociétés",
          "Rédaction des chartes de conformité",
          "Définition de la cartographie des risques",
        ],
      },
    ],
  },
  {
    id: "ressources-humaines",
    titre: "Ressources Humaines",
    accroche: "Audit, rémunération, compétences et recrutement",
    couleur: "#C4D82E",
    icone: "Users",
    groupes: [
      {
        produits: [
          "Audit RH",
          "Enquête salariale",
          "Grille de rémunération",
          "Évaluation des emplois",
          "Gestion des emplois et des compétences",
          "Rédaction des fiches de poste",
          "Bilan social",
          "Externalisation de la fonction RH",
          "Audit des avantages sociaux",
          "Recensement des salariés",
          "Gestion des talents",
          "Assistance au recrutement",
          "Accompagnement des équipes (montée en expérience)",
        ],
      },
    ],
  },
  {
    id: "juridique",
    titre: "Juridique",
    accroche: "Conseil, droit du travail et droit des affaires",
    couleur: "#C4D82E",
    icone: "Scale",
    groupes: [
      {
        titre: "Conseil & conformité",
        produits: [
          "Dialogue social et conventions (rédactions partenaires)",
          "Rédaction et analyse des contrats",
          "Audit et conformité (tous types de contrats)",
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
    id: "business-plan",
    titre: "Business Plan",
    accroche: "Création et développement d'entreprise, en 3 packs",
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
]

export function nombreProduits(pole: PoleProduits): number {
  return pole.groupes.reduce((total, groupe) => total + groupe.produits.length, 0)
}
