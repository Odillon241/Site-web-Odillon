import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { items } = body

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
        }

        // Process updates in parallel or batch
        // Since Supabase doesn't support a single bulk update easily for different values on different rows without a stored proc,
        // we'll loop. For small lists (team members), this is acceptable.
        const updates = items.map(async (item: { id: string; display_order: number }) => {
            return supabase
                .from("team_members")
                .update({ display_order: item.display_order })
                .eq("id", item.id)
        })

        await Promise.all(updates)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error reordering:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
