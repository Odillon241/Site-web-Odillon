"use client"

import { useEffect, useState } from "react"
import { FadeIn } from "@/components/magicui/fade-in"
import { TeamCard } from "@/components/ui/team-card"
import { teamMembers as fallbackTeam } from "@/lib/team-data"

interface TeamMember {
    id: string
    name: string
    role: string
    photo_url?: string
    linkedin_url?: string
    email?: string
    display_order: number
    is_active: boolean
}

export function TeamGrid() {
    const [team, setTeam] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch('/api/team')
                if (res.ok) {
                    const data = await res.json()
                    if (data.team && data.team.length > 0) {
                        setTeam(data.team.filter((m: TeamMember) => m.is_active))
                    } else {
                        // Fallback if DB is empty
                        // setTeam(fallbackTeam.map((m, i) => ({ ...m, id: i.toString(), display_order: i, is_active: true } as any)))
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

    // If loading or empty DB, show fallback from file (optional, or just show nothing/skeleton)
    const displayTeam = team.length > 0 ? team : fallbackTeam.map((m, i) => ({
        ...m,
        id: `fallback-${i}`,
        photo_url: m.photo,
        linkedin_url: m.linkedIn,
        display_order: i,
        is_active: true
    }))

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayTeam.map((member, idx) => (
                <FadeIn key={member.id} delay={0.1 * idx}>
                    <TeamCard
                        name={member.name}
                        role={member.role}
                        linkedinUrl={member.linkedin_url}
                        email={member.email}
                        imageSrc={member.photo_url}
                    />
                </FadeIn>
            ))}
        </div>
    )
}
