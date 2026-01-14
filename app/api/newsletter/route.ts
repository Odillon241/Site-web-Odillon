import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST: Subscribe to newsletter
export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        // Validate email format
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email est requis' },
                { status: 400 }
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Format d\'email invalide' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Check if email already exists
        const { data: existingSubscriber } = await supabase
            .from('newsletter_subscribers')
            .select('id, is_active')
            .eq('email', email.toLowerCase())
            .single()

        if (existingSubscriber) {
            if (existingSubscriber.is_active) {
                return NextResponse.json(
                    { error: 'Cet email est déjà abonné à notre newsletter' },
                    { status: 409 }
                )
            } else {
                // Reactivate the subscription
                const { error: updateError } = await supabase
                    .from('newsletter_subscribers')
                    .update({ is_active: true, subscribed_at: new Date().toISOString() })
                    .eq('id', existingSubscriber.id)

                if (updateError) {
                    console.error('Error reactivating subscription:', updateError)
                    return NextResponse.json(
                        { error: 'Erreur lors de la réactivation de l\'abonnement' },
                        { status: 500 }
                    )
                }

                return NextResponse.json({
                    message: 'Votre abonnement a été réactivé avec succès!'
                })
            }
        }

        // Create new subscriber
        const { error: insertError } = await supabase
            .from('newsletter_subscribers')
            .insert({
                email: email.toLowerCase(),
                is_active: true
            })

        if (insertError) {
            console.error('Error creating subscription:', insertError)
            return NextResponse.json(
                { error: 'Erreur lors de l\'inscription à la newsletter' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            message: 'Merci! Vous êtes maintenant abonné à notre newsletter.'
        })

    } catch (error) {
        console.error('Newsletter subscription error:', error)
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de l\'inscription' },
            { status: 500 }
        )
    }
}

// GET: Get all subscribers (admin only)
export async function GET(request: NextRequest) {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const url = new URL(request.url)
    const activeOnly = url.searchParams.get('active') === 'true'

    let query = supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false })

    if (activeOnly) {
        query = query.eq('is_active', true)
    }

    const { data: subscribers, error } = await query

    if (error) {
        console.error('Error fetching subscribers:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des abonnés' },
            { status: 500 }
        )
    }

    return NextResponse.json(subscribers)
}

// DELETE: Unsubscribe from newsletter (using token or admin)
export async function DELETE(request: NextRequest) {
    const supabase = await createClient()
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    const email = url.searchParams.get('email')

    // Check if it's an admin request
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !token) {
        return NextResponse.json({ error: 'Token de désabonnement requis' }, { status: 401 })
    }

    let query = supabase
        .from('newsletter_subscribers')
        .update({ is_active: false })

    if (token) {
        // Unsubscribe via token (public)
        query = query.eq('unsubscribe_token', token)
    } else if (user && email) {
        // Admin unsubscribe via email
        query = query.eq('email', email.toLowerCase())
    } else {
        return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    }

    const { error } = await query

    if (error) {
        console.error('Error unsubscribing:', error)
        return NextResponse.json(
            { error: 'Erreur lors du désabonnement' },
            { status: 500 }
        )
    }

    return NextResponse.json({
        message: 'Vous avez été désabonné avec succès de notre newsletter.'
    })
}
