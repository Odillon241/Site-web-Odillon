import {
    ImageIcon,
    Users,
    Quote,
    Building2,
    Video,
    CalendarDays,
    Sparkles,
    Settings as SettingsIcon,
    Target,
    LayoutDashboard,
    Newspaper,
    Mail,
    MessageSquare,
    Rss,
    GraduationCap,
    ClipboardList,
    SmilePlus,
    type LucideIcon,
} from "lucide-react"

export type AdminNavItem = {
    title: string
    icon: LucideIcon
    value: string
    /** Mots-clés supplémentaires pour la recherche (palette de commandes). */
    keywords?: string[]
}

export type AdminNavGroup = {
    label: string
    items: AdminNavItem[]
}

export const adminNav: AdminNavGroup[] = [
    {
        label: "Vue d'ensemble",
        items: [
            { title: "Tableau de bord", icon: LayoutDashboard, value: "dashboard", keywords: ["accueil", "stats"] },
        ],
    },
    {
        label: "Contenu du site",
        items: [
            { title: "Photos", icon: ImageIcon, value: "photos", keywords: ["hero", "carrousel", "images"] },
            { title: "Vidéos", icon: Video, value: "videos", keywords: ["youtube", "vimeo"] },
            { title: "Articles", icon: Newspaper, value: "articles", keywords: ["blog", "actualités"] },
            { title: "Témoignages", icon: Quote, value: "testimonials", keywords: ["avis", "clients"] },
            { title: "Logos partenaires", icon: Building2, value: "logos", keywords: ["entreprises", "références"] },
            { title: "Expertise CTA", icon: Sparkles, value: "expertise-cta", keywords: ["bannière", "appel à l'action"] },
        ],
    },
    {
        label: "Formations",
        items: [
            { title: "Formations", icon: GraduationCap, value: "formations", keywords: ["catalogue", "sessions"] },
            { title: "Inscriptions", icon: ClipboardList, value: "inscriptions", keywords: ["participants"] },
            { title: "Satisfaction", icon: SmilePlus, value: "satisfaction", keywords: ["questionnaires", "enquêtes"] },
        ],
    },
    {
        label: "Communication",
        items: [
            { title: "Messages", icon: MessageSquare, value: "messages", keywords: ["contact", "boîte de réception"] },
            { title: "Newsletter", icon: Mail, value: "newsletter", keywords: ["abonnés", "emails"] },
            { title: "News Ticker", icon: Rss, value: "news", keywords: ["bandeau", "annonces"] },
        ],
    },
    {
        label: "Organisation",
        items: [
            { title: "Équipe", icon: Users, value: "team", keywords: ["membres", "direction"] },
            { title: "À propos", icon: Target, value: "about", keywords: ["mission", "valeurs"] },
            { title: "Calendrier", icon: CalendarDays, value: "calendar", keywords: ["jours fériés", "gabon", "événements"] },
        ],
    },
    {
        label: "Système",
        items: [
            { title: "Paramètres", icon: SettingsIcon, value: "settings", keywords: ["configuration", "images du site"] },
        ],
    },
]

/** Groupes affichés dans le corps de la sidebar. Le tableau de bord est épinglé
 *  en tête sans libellé de groupe et les Paramètres vivent dans le pied. */
export const sidebarGroups = adminNav.filter(
    (g) => g.label !== "Vue d'ensemble" && g.label !== "Système"
)

export const dashboardItem = adminNav[0].items[0]
export const settingsItem = adminNav[adminNav.length - 1].items[0]

const labelByValue = new Map(
    adminNav.flatMap((group) => group.items.map((item) => [item.value, item.title]))
)

export function getTabLabel(value: string): string {
    return labelByValue.get(value) ?? value
}
