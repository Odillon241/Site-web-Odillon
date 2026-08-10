"use client"

import { useEffect, useState } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { Mail, Linkedin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
    POLE_DIRECTION,
    branchesOrganigramme,
    polesDirects,
    polesHerites
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
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
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
            {/* Titre */}
            <div className={`px-4 py-2.5 text-center font-semibold border-b rounded-t-lg ${entete}`}>
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
            <div className="p-4 space-y-3">
                {members.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">Pôle en structuration</p>
                )}
                {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                        <OrgAvatar
                            photoUrl={member.photo_url}
                            name={member.name}
                            size={isDirection ? "large" : "normal"}
                        />
                        <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-gray-900 truncate ${isDirection ? "text-sm" : "text-xs"}`}>
                                {member.name}
                            </p>
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

                    <div className="flex justify-center">
                        <div className="w-0.5 h-10 bg-gradient-to-b from-odillon-teal to-gray-300" />
                    </div>

                    {/* ===== DÉPARTEMENT TECHNIQUE · SECRÉTARIAT GÉNÉRAL ===== */}
                    <div className="grid gap-8 md:gap-10 lg:grid-cols-2">
                        {branchesOrganigramme.map((branche) => (
                            <div key={branche.pole}>
                                <div className="flex justify-center">
                                    <OrgBox
                                        title={branche.pole}
                                        members={membresDe(branche.pole)}
                                        variant="branche"
                                        className="w-full max-w-xs"
                                    />
                                </div>

                                {/* Rattachements de la branche */}
                                <div className="flex justify-center">
                                    <div className="w-0.5 h-6 bg-gray-300" />
                                </div>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {branche.enfants.map((enfant) => (
                                        <OrgBox
                                            key={enfant}
                                            title={enfant}
                                            members={membresDe(enfant)}
                                            className="w-full"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ===== PÔLES RATTACHÉS À LA DIRECTION GÉNÉRALE ===== */}
                    <div className="flex justify-center mt-12">
                        <div className="w-0.5 h-8 bg-gray-300" />
                    </div>
                    <div className="grid gap-4 md:gap-5 sm:grid-cols-3">
                        {polesDirects.map((pole) => (
                            <OrgBox
                                key={pole}
                                title={pole}
                                members={membresDe(pole)}
                                className="w-full"
                            />
                        ))}
                    </div>
                </div>
            </FadeIn>
        </div>
    )
}
