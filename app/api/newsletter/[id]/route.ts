import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// DELETE: Permanently delete a subscriber by ID (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params

    const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting subscriber:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        )
    }

    return NextResponse.json({
        message: 'Abonné supprimé définitivement'
    })
}
