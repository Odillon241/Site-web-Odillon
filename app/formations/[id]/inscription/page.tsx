import dynamic from "next/dynamic"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { FormationInscriptionForm } from "@/components/sections/formation-inscription-form"
import type { Formation } from "@/types/formation"

const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then((mod) => mod.HeaderPro), {
    ssr: true,
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: formation } = await supabase
        .from("formations")
        .select("titre, description")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle()

    if (!formation) {
        return { title: "Formation introuvable | Odillon" }
    }

    return {
        title: `Inscription : ${formation.titre} | Odillon`,
        description: formation.description?.substring(0, 160),
        // Une page d'inscription n'a pas vocation à être indexée : c'est le
        // calendrier qui doit ressortir dans les moteurs de recherche.
        robots: { index: false, follow: true },
    }
}

export default async function InscriptionFormationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: formation } = await supabase
        .from("formations")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle()

    if (!formation) {
        notFound()
    }

    return (
        <>
            <ScrollToTop />
            <HeaderPro />
            <main className="min-h-screen pt-[88px] md:pt-[104px]">
                <FormationInscriptionForm formation={formation as Formation} />
            </main>
            <Footer />
        </>
    )
}
