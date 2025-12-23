export interface TeamMember {
    name: string
    role: string
    photo: string
    linkedIn?: string
    email?: string
}

export const teamMembers: TeamMember[] = [
    {
        name: "Jean Dupont",
        role: "Directeur Général",
        photo: "",
        linkedIn: "#",
        email: "jean@odillon.com"
    },
    {
        name: "Marie Curie",
        role: "Directrice des Opérations",
        photo: "",
        linkedIn: "#",
        email: "marie@odillon.com"
    },
    {
        name: "Pierre Martin",
        role: "Responsable Conseil",
        photo: "",
        linkedIn: "#",
        email: "pierre@odillon.com"
    },
    {
        name: "Sophie Bernard",
        role: "Responsable Innovation",
        photo: "",
        linkedIn: "#",
        email: "sophie@odillon.com"
    }
]
