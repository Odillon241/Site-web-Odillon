import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const activeOnly = searchParams.get("active") === "true"

        const supabase = await createClient()
        let query = supabase
            .from("formations")
            .select("*")
            .order("date_debut", { ascending: true })

        if (activeOnly) {
            query = query.eq("is_active", true)
        }

        const { data: formations, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ formations })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { titre, description, date_debut, date_fin, horaires, duree, formateur, lieu, modalite, is_active } = body

        if (!titre || !description || !date_debut) {
            return NextResponse.json({ error: "Le titre, la description et la date de début sont obligatoires" }, { status: 400 })
        }

        const { data, error } = await supabase
            .from("formations")
            .insert({
                titre,
                description,
                date_debut,
                date_fin: date_fin || null,
                horaires: horaires || null,
                duree: duree || null,
                formateur: formateur || null,
                lieu: lieu || null,
                modalite: modalite || null,
                is_active: is_active ?? true,
                created_by: user.id
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ formation: data })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
