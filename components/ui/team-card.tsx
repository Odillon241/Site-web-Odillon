"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Fonction pour s'assurer que l'URL a un protocole
function ensureUrl(url?: string): string | undefined {
    if (!url || url === "#") return undefined
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    return `https://${url}`
}

interface TeamCardProps {
    name: string
    role: string
    imageSrc?: string
    bio?: string
    linkedinUrl?: string
    email?: string
    className?: string
    delay?: number
}

export function TeamCard({
    name,
    role,
    imageSrc,
    bio,
    linkedinUrl,
    email,
    className,
    delay = 0,
}: TeamCardProps) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                className
            )}
        >
            {/* Image Container */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100 relative">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-300">
                        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                )}

                {/* Overlay Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-odillon-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Social Actions Overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-10 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    {ensureUrl(linkedinUrl) && (
                        <Link href={ensureUrl(linkedinUrl)!} target="_blank" className="p-2 bg-white rounded-full text-odillon-dark hover:text-odillon-teal transition-colors shadow-lg hover:scale-110">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    )}
                    {email && (
                        <Link href={`mailto:${email}`} className="p-2 bg-white rounded-full text-odillon-dark hover:text-odillon-teal transition-colors shadow-lg hover:scale-110">
                            <Mail className="w-5 h-5" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-odillon-teal transition-colors">{name}</h3>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">{role}</p>

                {bio && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                        {bio}
                    </p>
                )}
            </div>
        </div>
    )
}
