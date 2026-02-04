"use client"

import { useEffect, useState } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { Mail, Linkedin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
    members,
    variant = "default",
    className = ""
}: {
    title: string
    members: TeamMemberDB[]
    variant?: "direction" | "default"
    className?: string
}) {
    const isDirection = variant === "direction"

    if (members.length === 0) return null

    return (
        <div className={`
            relative bg-white border-2 rounded-xl shadow-md hover:shadow-lg transition-shadow
            ${isDirection ? "border-odillon-teal" : "border-gray-200"}
            ${className}
        `}>
            {/* Titre */}
            <div className={`
                px-4 py-2.5 text-center font-semibold border-b rounded-t-lg
                ${isDirection
                    ? "bg-odillon-teal text-white border-odillon-teal"
                    : "bg-gray-50 text-gray-800 border-gray-100"
                }
            `}>
                {title}
            </div>

            {/* Membres avec photos */}
            <div className="p-4 space-y-3">
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

    // Grouper par pôle
    const directionGenerale = team.filter(m => m.pole === "Direction Générale")
    const poleAdministratif = team.filter(m => m.pole === "Pôle Administratif")
    const poleAudit = team.filter(m => m.pole === "Pôle Audit et Conformité")
    const poleQualite = team.filter(m => m.pole === "Pôle Qualité et Développement")
    const poleInformatique = team.filter(m => m.pole === "Pôle Informatique et Communication")

    const autresPoles = [
        { title: "Audit et Conformité", members: poleAudit },
        { title: "Qualité et Développement", members: poleQualite },
        { title: "Informatique et Communication", members: poleInformatique },
    ].filter(p => p.members.length > 0)

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
        <div className="max-w-5xl mx-auto px-4">
            <FadeIn>
                <div className="relative">
                    {/* ========== DIRECTION GÉNÉRALE ========== */}
                    {directionGenerale.length > 0 && (
                        <>
                            <div className="flex justify-center">
                                <OrgBox
                                    title="Direction Générale"
                                    members={directionGenerale}
                                    variant="direction"
                                    className="w-72"
                                />
                            </div>

                            {/* Ligne verticale vers Pôle Administratif */}
                            {(poleAdministratif.length > 0 || autresPoles.length > 0) && (
                                <div className="flex justify-center">
                                    <div className="w-0.5 h-10 bg-gradient-to-b from-odillon-teal to-gray-300" />
                                </div>
                            )}
                        </>
                    )}

                    {/* ========== PÔLE ADMINISTRATIF ========== */}
                    {poleAdministratif.length > 0 && (
                        <>
                            <div className="flex justify-center">
                                <OrgBox
                                    title="Pôle Administratif"
                                    members={poleAdministratif}
                                    className="w-64"
                                />
                            </div>

                            {/* Ligne vers les autres pôles */}
                            {autresPoles.length > 0 && (
                                <div className="flex justify-center">
                                    <div className="w-0.5 h-6 bg-gray-300" />
                                </div>
                            )}
                        </>
                    )}

                    {/* ========== AUTRES PÔLES ========== */}
                    {autresPoles.length > 0 && (
                        <>
                            {/* Ligne horizontale qui connecte les pôles */}
                            <div className="relative h-0.5 mx-auto" style={{ width: "75%" }}>
                                <div className="absolute inset-0 bg-gray-300" />
                            </div>

                            <div
                                className="relative grid gap-4 md:gap-6 mt-0 mx-auto"
                                style={{
                                    width: "85%",
                                    gridTemplateColumns: `repeat(${autresPoles.length}, minmax(0, 1fr))`
                                }}
                            >
                                {/* Lignes verticales vers chaque pôle - Desktop */}
                                {autresPoles.map((_, idx) => {
                                    const position = ((idx + 0.5) / autresPoles.length) * 100
                                    return (
                                        <div
                                            key={idx}
                                            className="hidden md:block absolute -top-0 w-0.5 h-6 bg-gray-300"
                                            style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                                        />
                                    )
                                })}

                                {autresPoles.map((pole) => (
                                    <div key={pole.title} className="flex justify-center pt-6">
                                        <OrgBox
                                            title={pole.title}
                                            members={pole.members}
                                            className="w-full max-w-[220px]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </FadeIn>
        </div>
    )
}
