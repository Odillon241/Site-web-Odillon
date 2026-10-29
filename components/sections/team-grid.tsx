"use client"

import { useEffect, useState } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { Mail, Linkedin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
    POLE_DIRECTION,
    branchesOrganigramme,
    liensFonctionnels,
    polesHerites,
    rattachementsDirection,
    type EntiteOrganigramme
} from "@/lib/identite"

interface TeamMemberDB {
    id: string
    name: string
    role: string
    photo_url?: string
    linkedin_url?: string
    email?: string
    pole?: string
    is_active: boolean
    display_order: number
}

// Fonction pour s'assurer que l'URL a un protocole
function ensureUrl(url?: string): string | undefined {
    if (!url || url === "#") return undefined
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    return `https://${url}`
}

// « BINGANGOYE Nathalie » → « BN »
function initiales(nom: string): string {
    return nom
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((mot) => mot[0]!.toUpperCase())
        .join("")
}

// Composant Avatar pour l'organigramme
function OrgAvatar({ photoUrl, name, size = "normal" }: { photoUrl?: string; name: string; size?: "large" | "normal" }) {
    const sizeClasses = size === "large" ? "w-16 h-16" : "w-12 h-12"

    return (
        <div className={`${sizeClasses} rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm flex-shrink-0`}>
            {photoUrl ? (
                <Image
                    src={photoUrl}
                    alt={name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                />
            ) : (
                /* Sans photo : les initiales plutôt qu'une silhouette grise. */
                <div
                    aria-hidden="true"
                    className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-odillon-teal to-[#0f7a6e] font-semibold text-white ${size === "large" ? "text-lg" : "text-sm"}`}
                >
                    {initiales(name)}
                </div>
            )}
        </div>
    )
}

// Composant boîte de l'organigramme avec photos
function OrgBox({
    title,
    surtitre,
    members,
    variant = "default",
    className = ""
}: {
    title: string
    surtitre?: string
    members: TeamMemberDB[]
    variant?: "direction" | "branche" | "default"
    className?: string
}) {
    const isDirection = variant === "direction"
    const isBranche = variant === "branche"

    /* Trois niveaux de lecture, repris de l'organigramme officiel : direction
       générale en sombre, départements en ambre, pôles et sections en teal. */
    const cadre = isDirection
        ? "border-odillon-dark"
        : isBranche
            ? "border-amber-200"
            : "border-odillon-teal/20"

    const entete = isDirection
        ? "bg-odillon-dark text-white border-odillon-dark"
        : isBranche
            ? "bg-amber-50 text-amber-900 border-amber-100"
            : "bg-odillon-teal/[0.07] text-odillon-dark border-odillon-teal/10"

    return (
        <div className={`
            relative bg-white border-2 rounded-lg shadow-md hover:shadow-lg transition-shadow
            ${cadre}
            ${className}
        `}>
            {/* Titre ; un pôle sans membre se réduit à son intitulé. */}
            <div className={`px-4 py-2.5 text-center font-semibold rounded-t-lg ${members.length > 0 ? "border-b" : "rounded-b-lg"} ${entete}`}>
                {surtitre && (
                    <span className={`block text-[10px] uppercase tracking-[0.18em] font-bold mb-0.5 ${isDirection ? "text-white/70" : "text-odillon-teal/70"}`}>
                        {surtitre}
                    </span>
                )}
                <span className={isDirection ? "text-base tracking-wide uppercase" : "text-sm"}>{title}</span>
            </div>

            {/* Membres avec photos. Un pôle sans membre reste visible : le
                livret présente la structure complète, pas seulement les postes
                pourvus. */}
            {members.length > 0 && (
            <div className="p-4 space-y-3">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                        <OrgAvatar
                            photoUrl={member.photo_url}
                            name={member.name}
                            size={isDirection ? "large" : "normal"}
                        />
                        <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-gray-900 break-words ${isDirection ? "text-sm" : "text-xs"}`}>
                                {member.name}
                            </p>
                            {member.role && (
                                <p className="mt-0.5 line-clamp-2 text-[11px] text-gray-500">{member.role}</p>
                            )}
                            <div className="flex items-center gap-1.5 mt-1">
                                {ensureUrl(member.linkedin_url) && (
                                    <Link
                                        href={ensureUrl(member.linkedin_url)!}
                                        target="_blank"
                                        className="text-gray-400 hover:text-[#0077b5] transition-colors"
                                        title="LinkedIn"
                                    >
                                        <Linkedin className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                                {member.email && (
                                    <Link
                                        href={`mailto:${member.email}`}
                                        className="text-gray-400 hover:text-odillon-teal transition-colors"
                                        title={member.email}
                                    >
                                        <Mail className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    )
}

export function TeamGrid() {
    const [team, setTeam] = useState<TeamMemberDB[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch team members from API
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch('/api/team')
                if (res.ok) {
                    const data = await res.json()
                    if (data.team) {
                        // Filtrer uniquement les membres actifs avec un pôle assigné
                        setTeam(data.team.filter((m: TeamMemberDB) => m.is_active && m.pole))
                    }
                }
            } catch (error) {
                console.error("Failed to fetch team", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTeam()
    }, [])

    /* Rattachement d'un membre à un pôle du livret. Les intitulés hérités sont
       traduits au passage, le temps que la colonne `pole` soit migrée. */
    const membresDe = (pole: string) =>
        team.filter(m => (m.pole && polesHerites[m.pole]) === pole || m.pole === pole)

    const directionGenerale = membresDe(POLE_DIRECTION)

    // Si aucun membre dans l'organigramme
    if (!loading && team.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <p className="text-gray-500">
                    Aucun membre n'est encore assigné à l'organigramme.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    Ajoutez des membres depuis l'administration et assignez-leur un pôle.
                </p>
            </div>
        )
    }

    /* Une colonne de l'organigramme : l'entité en tête, ses services dessous,
       reliés par un filet vertical comme sur le schéma officiel. */
    const Colonne = ({
        entite,
        enfants,
        surtitre,
    }: {
        entite: EntiteOrganigramme
        enfants: EntiteOrganigramme[]
        surtitre?: string
    }) => (
        <div>
            <OrgBox
                title={entite.titre ?? entite.pole}
                surtitre={surtitre}
                members={membresDe(entite.pole)}
                variant="branche"
                className="w-full"
            />
            <div className="ml-6 border-l-2 border-odillon-teal/20 pl-4 pt-3 space-y-2.5">
                {enfants.map((enfant) => (
                    <OrgBox
                        key={enfant.pole}
                        title={enfant.titre ?? enfant.pole}
                        members={membresDe(enfant.pole)}
                        className="w-full"
                    />
                ))}
            </div>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
                <div className="relative">
                    {/* ========== DIRECTION GÉNÉRALE ========== */}
                    <div className="flex justify-center">
                        <OrgBox
                            title="Direction Générale"
                            members={directionGenerale}
                            variant="direction"
                            className="w-full max-w-72"
                        />
                    </div>

                    {/* ===== À CÔTÉ DE LA DIRECTION : ASSISTANTE, AUDIT ===== */}
                    <div className="flex justify-center">
                        <div className="w-0.5 h-6 bg-odillon-teal/40" />
                    </div>
                    <div className="mx-auto grid max-w-2xl items-start gap-4 sm:grid-cols-2">
                        {rattachementsDirection.map((entite) => (
                            <OrgBox
                                key={entite.pole}
                                title={entite.titre ?? entite.pole}
                                members={membresDe(entite.pole)}
                                className="w-full"
                            />
                        ))}
                    </div>

                    {/* ===== SECRÉTARIAT GÉNÉRAL · DGA · DIRECTION TECHNIQUE ===== */}
                    <div className="flex justify-center">
                        <div className="w-0.5 h-8 bg-gray-300" />
                    </div>
                    <div className="grid items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {branchesOrganigramme.flatMap((branche) => [
                            <Colonne key={branche.pole} entite={branche} enfants={branche.enfants} />,
                            ...(branche.rattachee
                                ? [
                                    <Colonne
                                        key={branche.rattachee.pole}
                                        entite={branche.rattachee}
                                        enfants={branche.rattachee.enfants}
                                        surtitre={`Rattachée à la ${branche.titre ?? branche.pole}`}
                                    />,
                                ]
                                : []),
                        ])}
                    </div>

                    {/* Liens fonctionnels : les pointillés du schéma officiel. */}
                    <div className="mx-auto mt-10 max-w-3xl rounded-lg border border-dashed border-odillon-teal/40 bg-odillon-teal/[0.03] px-5 py-4 text-sm text-gray-600">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-odillon-teal">Liens fonctionnels</p>
                        <ul className="list-disc space-y-1 pl-5">
                            {liensFonctionnels.map((lien) => (
                                <li key={lien}>{lien}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </FadeIn>
        </div>
    )
}
