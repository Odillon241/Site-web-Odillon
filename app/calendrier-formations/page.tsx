import dynamic from "next/dynamic"
import { createClient } from "@/lib/supabase/server"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { FormationsCalendar, type Formation } from "@/components/sections/formations-calendar"

const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then(mod => mod.HeaderPro), { ssr: true })

export const metadata = {
    title: "Calendrier des Formations | Odillon - Ingénierie d'Entreprises",
    description: "Découvrez le calendrier des sessions de formation professionnelle proposées par le cabinet Odillon au Gabon et inscrivez-vous.",
}

export default async function CalendrierFormationsPage() {
    const supabase = await createClient()
    const { data: formations } = await supabase
        .from("formations")
        .select("*")
        .eq("is_active", true)
        .order("date_debut", { ascending: true })

    return (
        <>
            <ScrollToTop />
            <HeaderPro />
            <main className="min-h-screen pt-[88px] md:pt-[104px]">
                <FormationsCalendar formations={(formations as Formation[]) || []} />
            </main>
            <Footer />
        </>
    )
}
