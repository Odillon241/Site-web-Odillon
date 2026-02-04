export interface TeamMember {
    name: string
    role: string
    photo: string
    linkedIn?: string
    email?: string
    pole?: string
}

// Direction Générale
export const directionGenerale: TeamMember[] = [
    {
        name: "Nathalie BINGANGOYE",
        role: "Directrice Générale",
        photo: "",
        linkedIn: "#",
        email: "nathaliebingangoye@odillon.fr"
    },
    {
        name: "Eliane FIOKLOU-TALE",
        role: "Directrice Générale Adjointe",
        photo: "",
        linkedIn: "#",
        email: "elianetale@odillon.fr"
    }
]

// Responsables de Pôles
export const polesResponsables: TeamMember[] = [
    {
        name: "Fethia BICKE-BI-NGUEMA",
        role: "Responsable",
        pole: "Pôle Administratif",
        photo: "",
        linkedIn: "#",
        email: "fethiabicke@odillon.fr"
    },
    {
        name: "Vanessa MBOUMBA",
        role: "Responsable",
        pole: "Pôle Audit et Conformité",
        photo: "",
        linkedIn: "#",
        email: "vanessamboumba@odillon.fr"
    },
    {
        name: "Annick Nadia TATY",
        role: "Responsable",
        pole: "Pôle Qualité et Développement",
        photo: "",
        linkedIn: "#",
        email: "nadiataty@odillon.fr"
    },
    {
        name: "Déreck Danel NEXON",
        role: "Responsable",
        pole: "Pôle Informatique et Communication",
        photo: "",
        linkedIn: "#",
        email: "dereckdanel@odillon.fr"
    }
]

// Export combiné pour compatibilité
export const teamMembers: TeamMember[] = [
    ...directionGenerale,
    ...polesResponsables
]
