import dynamic from "next/dynamic"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServiceClient } from "@/lib/supabase/service"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { FormationSatisfactionForm } from "@/components/sections/formation-satisfaction-form"
import { Button } from "@/components/ui/button"
import { CheckCircle2, LinkIcon, ArrowLeft } from "lucide-react"
import type { Formation } from "@/types/formation"

const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then((mod) => mod.HeaderPro), {
    ssr: true,
})

export const metadata = {
    title: "Questionnaire de satisfaction | Odillon",
    // Page nominative (lien personnel) : elle n'a pas vocation à être indexée.
    robots: { index: false, follow: false },
}

/** Écran centré neutre pour les états « lien invalide » et « déjà répondu ». */
function EtatMessage({
    icon,
    titre,
    message,
}: {
    icon: React.ReactNode
    titre: string
    message: string
}) {
    return (
        <section className="od-section py-16 md:py-24">
            <div className="od-container max-w-xl">
                <div className="od-surface p-8 md:p-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-5">
                        {icon}
                    </div>
                    <h1 className="od-heading-display text-2xl md:text-3xl mb-3 text-balance">{titre}</h1>
                    <p className="text-gray-600 mb-6 text-pretty">{message}</p>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4" />
                            Retour à l'accueil
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default async function SatisfactionPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ token?: string }>
}) {
    const { id } = await params
    const { token } = await searchParams

    // Tout est lu via la clé service-role : le questionnaire est envoyé APRÈS la
    // session, quand la formation a pu être masquée (is_active = false) — la
    // lecture publique la filtrerait alors. Le contrôle d'accès ici, c'est le
    // jeton nominatif, pas le statut d'activité de la session.
    const service = await createServiceClient()
    const { data: formation } = await service
        .from("formations")
        .select("*")
        .eq("id", id)
        .maybeSingle()

    if (!formation) {
        notFound()
    }

    const shell = (contenu: React.ReactNode) => (
        <>
            <ScrollToTop />
            <HeaderPro />
            <main className="min-h-screen pt-[88px] md:pt-[104px]">{contenu}</main>
            <Footer />
        </>
    )

    if (!token) {
        return shell(
            <EtatMessage
                icon={<LinkIcon className="w-8 h-8 text-gray-400" />}
                titre="Lien incomplet"
                message="Ce questionnaire s'ouvre depuis le lien personnel envoyé par e-mail après votre formation. Vérifiez que vous avez bien copié l'adresse en entier."
            />
        )
    }

    // Résolution du jeton avec la clé service-role : la table des inscriptions
    // n'est pas lisible publiquement. On ne renvoie AUCUNE donnée d'inscription
    // au client, seulement l'état (valide / déjà répondu).
    const { data: inscription } = await service
        .from("formation_inscriptions")
        .select("id, formation_id, satisfaction_repondu_at")
        .eq("satisfaction_token", token)
        .maybeSingle()

    if (!inscription || inscription.formation_id !== id) {
        return shell(
            <EtatMessage
                icon={<LinkIcon className="w-8 h-8 text-gray-400" />}
                titre="Lien invalide"
                message="Ce lien de satisfaction n'est pas valide ou a expiré. N'hésitez pas à nous contacter si vous souhaitez partager votre avis."
            />
        )
    }

    if (inscription.satisfaction_repondu_at) {
        return shell(
            <EtatMessage
                icon={<CheckCircle2 className="w-8 h-8 text-green-600" />}
                titre="Merci, c'est déjà fait"
                message="Vous avez déjà répondu à ce questionnaire. Votre retour a bien été enregistré et nous vous en remercions."
            />
        )
    }

    return shell(<FormationSatisfactionForm formation={formation as Formation} token={token} />)
}
