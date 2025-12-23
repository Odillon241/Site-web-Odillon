"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardCleanProps {
    icon: LucideIcon
    value: number
    suffix?: string
    label: string
    description?: string
    color?: string
    delay?: number
    className?: string
}

export function StatCardClean({
    icon: Icon,
    value,
    suffix = "",
    label,
    description,
    color = "#39837a",
    className,
}: StatCardCleanProps) {
    return (
        <div
            className={cn(
                "relative group overflow-hidden rounded-xl border border-white/20 bg-white/50 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                className
            )}
        >
            {/* Background Gradient Spot */}
            <div
                className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none"
                style={{ backgroundColor: color }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Icon with glowing background */}
                <div className="mb-6 relative">
                    <div
                        className="absolute inset-0 rounded-lg blur-lg opacity-20"
                        style={{ backgroundColor: color }}
                    />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-lg border border-gray-100 bg-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6" style={{ color }} />
                    </div>
                </div>

                {/* Value */}
                <div className="mb-2 flex items-baseline justify-center">
                    <span
                        className="text-5xl font-bold tracking-tight"
                        style={{ color: "#1a1a1a" }} // Darker text for better readability
                    >
                        {value}
                    </span>
                    <span className="text-3xl font-bold ml-1" style={{ color }}>
                        {suffix}
                    </span>
                </div>

                {/* Label and Description */}
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-900">
                    {label}
                </h3>
                {description && (
                    <p className="text-sm text-gray-500">
                        {description}
                    </p>
                )}
            </div>

            {/* Subtle Corner Accents */}
            <div
                className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full opacity-40"
                style={{ backgroundColor: color }}
            />
            <div
                className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full opacity-40 ml-auto"
                style={{ backgroundColor: color }} // Only keeping one accent or minimal
            />
        </div>
    )
}
