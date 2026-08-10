/**
 * Contenus institutionnels du Cabinet ODILLON.
 *
 * Source de vérité : « Livret d'accueil du collaborateur » — V1, édition
 * réorganisée du 29 juillet 2026 (§1.2 Nos valeurs, §2.1 Qui sommes-nous ?).
 * Les libellés et descriptions ci-dessous reprennent le livret mot pour mot :
 * toute retouche éditoriale doit d'abord être répercutée dans le livret, faute
 * de quoi le site et le document interne divergent à nouveau.
 */

export type Valeur = {
  /** Libellé du livret, article compris : « Le Talent », « La Rigueur »… */
  title: string
  /** Animal totem associé à la valeur dans le livret. */
  totem: string
  description: string
  /** Mots-clés listés sous la description dans le livret. */
  keywords: string
  /** Aquarelle du totem, extraite de la page 4 du livret. */
  image: string
  /** Nom d'icône lucide, utilisé en repli si l'illustration est indisponible. */
  icon: string
  color: string
}

/** Les quatre valeurs fondamentales (livret §1.2). */
export const valeurs: Valeur[] = [
  {
    title: "Le Talent",
    totem: "Dauphin",
    image: "/images/valeurs/dauphin.webp",
    description:
      "Valoriser les compétences, développer le potentiel de chacun et encourager l'innovation, la créativité ainsi que l'excellence professionnelle.",
    keywords: "Intelligence · agilité · esprit d'équipe",
    icon: "Gem",
    color: "#00a795",
  },
  {
    title: "La Rigueur",
    totem: "Fourmi",
    image: "/images/valeurs/fourmi.webp",
    description:
      "Agir avec discipline, intégrité et respect des procédures, tout en garantissant la qualité et la fiabilité des résultats.",
    keywords: "Discipline · organisation · fiabilité",
    icon: "ShieldCheck",
    color: "#C4D82E",
  },
  {
    title: "Le Challenge",
    totem: "Aigle",
    image: "/images/valeurs/aigle.webp",
    description:
      "Cultiver l'esprit de dépassement de soi, relever les défis avec détermination, rechercher en permanence l'amélioration continue et l'atteinte d'objectifs ambitieux.",
    keywords: "Vision · ambition · dépassement de soi",
    icon: "Flame",
    color: "#00a795",
  },
  {
    title: "La Proximité",
    totem: "Éléphant",
    image: "/images/valeurs/elephant.webp",
    description:
      "Être à l'écoute des clients, partenaires et collaborateurs, favoriser la confiance, le dialogue, la collaboration et offrir un accompagnement adapté aux besoins.",
    keywords: "Écoute · mémoire · confiance · force tranquille",
    icon: "HeartHandshake",
    color: "#C4D82E",
  },
]

/** Chapeau de la section « Nos valeurs » (livret §1.2). */
export const chapeauValeurs =
  "Notre performance repose sur quatre valeurs fondamentales : le Talent, qui révèle le potentiel de chacun ; la Rigueur, qui garantit l'excellence de nos actions ; le Challenge, qui nous pousse à innover et à nous dépasser ; et la Proximité, qui place l'humain, l'écoute et la confiance au cœur de toutes nos relations."

/** Présentation du Cabinet (livret §2.1 « Qui sommes-nous ? »). */
export const presentation = {
  accroche:
    "Créée en mai 2017, la Société ODILLON est un Cabinet d'ingénierie d'entreprises implanté à Libreville, au Gabon, spécialisé dans le conseil, l'audit et la gouvernance.",
  mission:
    "Nous accompagnons les organisations publiques et privées dans l'amélioration de leurs performances, le renforcement de leur conformité et la structuration de leur gouvernance.",
  citation:
    "ODILLON est un partenaire stratégique qui aide les organisations à se structurer, à sécuriser leur gouvernance, à améliorer leurs performances et à assurer une croissance durable.",
}

/**
 * Les trois repères chiffrés du livret §2.1.
 *
 * Le nombre de pôles suit l'organigramme structurel de février 2026, qui en
 * compte six ; le livret annonce encore « 05 », chiffre hérité de son schéma
 * reconstitué. Le livret reste à corriger sur ce point.
 */
export const chiffresCles = [
  { valeur: "2017", legende: "Création du Cabinet, en mai" },
  { valeur: "06", legende: "Pôles de compétences pluridisciplinaires" },
  { valeur: "Libreville", legende: "Glass, Gabon — siège du Cabinet" },
]

/* ── Organigramme structurel ────────────────────────────────────────────────
   Source : « Organigramme structurel ODILLON — Février 2026 », qui fait foi et
   remplace le schéma reconstitué du livret §2.3 (lequel décrivait cinq pôles
   numérotés aujourd'hui obsolètes).

   Les libellés ci-dessous sont ceux attendus dans la colonne `pole` de la table
   `team_members` : toute affectation doit utiliser exactement l'une de ces
   valeurs, sans quoi le membre n'apparaît pas dans l'organigramme. */

/** Direction générale, au sommet de l'organigramme. */
export const POLE_DIRECTION = "Direction Générale"

/** Les deux entités rattachées à la Direction Générale, avec leurs rattachements. */
export const branchesOrganigramme = [
  {
    pole: "Département Technique",
    enfants: [
      "Pôle Gestion du Capital Humain Clients",
      "Pôle Systèmes d'Information",
      "Pôle Communication & RSE",
    ],
  },
  {
    pole: "Secrétariat Général",
    enfants: [
      "Section Administration",
      "Section Comptabilité",
      "Section Logistique",
    ],
  },
]

/** Pôles rattachés directement à la Direction Générale. */
export const polesDirects = [
  "Pôle Formation",
  "Pôle Audit, Qualité et Conformité",
  "Pôle Juridique",
]

/** Toutes les affectations possibles, à plat, dans l'ordre de l'organigramme. */
export const affectationsPossibles = [
  POLE_DIRECTION,
  ...branchesOrganigramme.flatMap((b) => [b.pole, ...b.enfants]),
  ...polesDirects,
]

/**
 * Correspondance transitoire entre les anciens intitulés de pôles et ceux de
 * l'organigramme de février 2026. Elle évite qu'un membre disparaisse tant que
 * la colonne `pole` n'a pas été migrée en base.
 *
 * Attention : « Pôle Informatique et Communication » regroupait des personnes
 * qui relèvent désormais d'entités distinctes (systèmes d'information d'un côté,
 * logistique de l'autre) ; seule une reprise des affectations en base permet de
 * les séparer. À supprimer une fois la migration faite
 * (voir docs/HARMONISATION_LIVRET_ACCUEIL.md).
 */
export const polesHerites: Record<string, string> = {
  "Pôle Administratif": "Secrétariat Général",
  "Pôle Audit et Conformité": "Pôle Audit, Qualité et Conformité",
  "Pôle Qualité et Développement": "Pôle Gestion du Capital Humain Clients",
  "Pôle Informatique et Communication": "Pôle Systèmes d'Information",
}

/**
 * Domaines d'intervention (livret §2.1). Le segment en gras du livret est isolé
 * dans `accent` pour permettre la même emphase à l'écran.
 */
export const domainesIntervention = [
  { accent: "Le conseil stratégique", suite: " aux dirigeants" },
  { accent: "L'audit", suite: " organisationnel, opérationnel et de gouvernance" },
  { accent: "La gouvernance d'entreprise", suite: "" },
  {
    accent: "L'accompagnement en ingénierie d'entreprises",
    suite: " — structuration, organisation et optimisation",
  },
  {
    accent: "L'appui aux entreprises",
    suite: " dans leurs projets de croissance, de transformation et de conformité",
  },
]
