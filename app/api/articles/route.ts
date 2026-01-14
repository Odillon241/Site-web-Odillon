import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

// GET - Récupérer tous les articles
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const published = searchParams.get('published')
    const limit = searchParams.get('limit')

    const supabase = await createClient()

    let query = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })

    // Filtrer par statut publié
    if (published === 'true') {
        query = query.eq('is_published', true)
    }

    // Filtrer par catégorie
    if (category && category !== 'all') {
        query = query.eq('category', category)
    }

    // Limiter le nombre de résultats
    if (limit) {
        query = query.limit(parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ articles: data })
}

// POST - Créer un nouvel article
export async function POST(request: Request) {
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()

    // Générer le slug depuis le titre si non fourni
    if (!body.slug && body.title) {
        body.slug = body.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    // Set published_at si publié
    if (body.is_published && !body.published_at) {
        body.published_at = new Date().toISOString()
    }

    // Nettoyer les champs non présents en base
    delete body.scheduled_at

    const { data, error } = await supabase
        .from('articles')
        .insert([body])
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidateTag('articles', 'max')
    revalidatePath('/blog')
    revalidatePath('/')

    return NextResponse.json({ article: data }, { status: 201 })
}
