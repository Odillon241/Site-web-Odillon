"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface BackgroundsDemoClientProps {
    hero: React.ReactNode
    aurora: React.ReactNode
    retro: React.ReactNode
}

export function BackgroundsDemoClient({ hero, aurora, retro }: BackgroundsDemoClientProps) {
    const [currentBg, setCurrentBg] = useState(0)

    const backgrounds = [
        { name: "Grid Pattern", node: hero, description: "Grille moderne et professionnelle avec animations subtiles" },
        { name: "Aurora", node: aurora, description: "Effet d'aurore boréale premium et élégant" },
        { name: "Retro Grid", node: retro, description: "Grille 3D style cyberpunk futuriste" },
    ]

    return (
        <div className="min-h-screen">
            {/* Sélecteur de background */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 mb-3 text-center">
                    Démonstration des Backgrounds
                </h2>
                <div className="flex gap-2">
                    {backgrounds.map((bg, index) => (
                        <Button
                            key={bg.name}
                            onClick={() => setCurrentBg(index)}
                            variant={currentBg === index ? "default" : "outline"}
                            className={
                                currentBg === index
                                    ? "bg-odillon-teal hover:bg-odillon-teal/90"
                                    : "border-odillon-teal text-odillon-teal hover:bg-odillon-teal/10"
                            }
                            size="sm"
                        >
                            {bg.name}
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-gray-600 mt-3 text-center max-w-xs">
                    {backgrounds[currentBg].description}
                </p>
            </div>

            {/* Affichage du background actuel */}
            {backgrounds[currentBg].node}

            {/* Instructions */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-odillon-teal text-white rounded-lg shadow-lg p-3 text-center text-sm max-w-md">
                <p className="font-semibold">💡 Astuce</p>
                <p className="text-xs mt-1">
                    Naviguez entre les différents backgrounds pour comparer les effets visuels
                </p>
            </div>
        </div>
    )
}
