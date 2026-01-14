import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// PATCH: Reactivate a subscriber (admin only)
export async function PATCH(request: NextRequest) {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email requis' },
                { status: 400 }
            )
        }

        const { error } = await supabase
            .from('newsletter_subscribers')
            .update({
                is_active: true,
                subscribed_at: new Date().toISOString()
            })
            .eq('email', email.toLowerCase())

        if (error) {
            console.error('Error reactivating subscriber:', error)
            return NextResponse.json(
                { error: 'Erreur lors de la réactivation' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            message: 'Abonné réactivé avec succès'
        })
    } catch (error) {
        console.error('Reactivate error:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la réactivation' },
            { status: 500 }
        )
    }
}
