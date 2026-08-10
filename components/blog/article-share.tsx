"use client"

import { useState } from "react"
import { Check, Link2 } from "lucide-react"
import { toast } from "sonner"

/**
 * Partage d'un article : API de partage native quand elle existe,
 * copie du lien sinon. Remplace l'ancien bouton décoratif sans action.
 */
export function ArticleShare({ title }: { title: string }) {
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        const url = window.location.href

        if (navigator.share) {
            try {
                await navigator.share({ title, url })
                return
            } catch (error) {
                // Partage annulé par l'utilisateur : on retombe sur la copie du lien.
                if (error instanceof DOMException && error.name === "AbortError") return
            }
        }

        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            toast.success("Lien copié dans le presse-papiers.")
            setTimeout(() => setCopied(false), 2500)
        } catch {
            toast.error("Le lien n'a pas pu être copié. Copiez-le depuis la barre d'adresse.")
        }
    }

    return (
        <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#4A5C64] transition-colors hover:bg-[#0A1F2C]/[0.04] hover:text-[#0A1F2C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-odillon-teal"
        >
            {copied ? (
                <Check aria-hidden="true" className="h-4 w-4 text-[#00786B]" />
            ) : (
                <Link2 aria-hidden="true" className="h-4 w-4" />
            )}
            {copied ? "Lien copié" : "Partager l'article"}
        </button>
    )
}
