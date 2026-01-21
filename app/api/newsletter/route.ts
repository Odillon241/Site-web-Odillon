import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
    validateEmail,
    checkRateLimit,
    verifyOrigin,
    getClientIP,
    logSecurityEvent
} from "@/lib/security"

/**
 * Configuration du rate limiting pour la newsletter
 */
const RATE_LIMIT_CONFIG = {
    maxRequests: 3,        // Maximum 3 requêtes
    windowMs: 60 * 1000,   // Par minute
}

/**
 * POST: Subscribe to newsletter
 *
 * Protections de sécurité implémentées :
 * - Rate limiting par IP
 * - Validation de l'origine (CSRF basique)
 * - Validation stricte de l'email
 * - Blocage des emails jetables
 */
export async function POST(request: NextRequest) {
    const clientIP = getClientIP(request)

    try {
        // 1. Vérifier l'origine de la requête (protection CSRF)
        if (!verifyOrigin(request)) {
            logSecurityEvent('origin_blocked', clientIP, 'Origin/Referer non autorisé pour /api/newsletter')
            return NextResponse.json(
                { error: 'Requête non autorisée' },
                { status: 403 }
            )
        }

        // 2. Vérifier le rate limiting
        const rateLimitResult = checkRateLimit(
            `newsletter:${clientIP}`,
            RATE_LIMIT_CONFIG.maxRequests,
            RATE_LIMIT_CONFIG.windowMs
        )

        if (!rateLimitResult.allowed) {
            logSecurityEvent('rate_limit', clientIP, 'Rate limit dépassé pour /api/newsletter')
            return NextResponse.json(
                {
                    error: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.',
                    retryAfter: rateLimitResult.resetIn
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimitResult.resetIn.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
                    }
                }
            )
        }

        // 3. Vérifier le Content-Type
        const contentType = request.headers.get('content-type')
        if (!contentType?.includes('application/json')) {
            return NextResponse.json(
                { error: 'Content-Type invalide' },
                { status: 415 }
            )
        }

        // 4. Parser le body
        let body: Record<string, unknown>
        try {
            body = await request.json()
        } catch {
            return NextResponse.json(
                { error: 'Format JSON invalide' },
                { status: 400 }
            )
        }

        const { email } = body

        // 5. Validation de base
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email est requis' },
                { status: 400 }
            )
        }

        // 6. Validation stricte de l'email
        const emailValidation = validateEmail(email)
        if (!emailValidation.isValid) {
            // Log si c'est une tentative d'injection
            if (emailValidation.error?.includes('caractères non autorisés')) {
                logSecurityEvent('email_header_injection', clientIP, `Email rejeté: ${email.substring(0, 50)}`)
            }
            return NextResponse.json(
                { error: emailValidation.error || 'Format d\'email invalide' },
                { status: 400 }
            )
        }

        const sanitizedEmail = emailValidation.sanitized

        const supabase = await createClient()

        // 7. Check if email already exists
        const { data: existingSubscriber } = await supabase
            .from('newsletter_subscribers')
            .select('id, is_active')
            .eq('email', sanitizedEmail)
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
                    .update({
                        is_active: true,
                        subscribed_at: new Date().toISOString(),
                        ip_address: clientIP // Track IP for audit
                    })
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

        // 8. Create new subscriber
        const { error: insertError } = await supabase
            .from('newsletter_subscribers')
            .insert({
                email: sanitizedEmail,
                is_active: true,
                ip_address: clientIP // Track IP for audit
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

/**
 * GET: Get all subscribers (admin only)
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const url = new URL(request.url)
    const activeOnly = url.searchParams.get('active') === 'true'
    const limitParam = url.searchParams.get('limit')

    // Valider le paramètre limit
    let limit = 100
    if (limitParam) {
        const parsedLimit = parseInt(limitParam)
        if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 500) {
            return NextResponse.json(
                { error: 'Le paramètre limit doit être un nombre entre 1 et 500' },
                { status: 400 }
            )
        }
        limit = parsedLimit
    }

    let query = supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false })
        .limit(limit)

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

/**
 * DELETE: Unsubscribe from newsletter (using token or admin)
 */
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
        // Validate token format (prevent injection)
        if (typeof token !== 'string' || token.length > 100 || !/^[a-zA-Z0-9\-_]+$/.test(token)) {
            return NextResponse.json({ error: 'Token invalide' }, { status: 400 })
        }
        // Unsubscribe via token (public)
        query = query.eq('unsubscribe_token', token)
    } else if (user && email) {
        // Validate email
        const emailValidation = validateEmail(email)
        if (!emailValidation.isValid) {
            return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
        }
        // Admin unsubscribe via email
        query = query.eq('email', emailValidation.sanitized)
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
