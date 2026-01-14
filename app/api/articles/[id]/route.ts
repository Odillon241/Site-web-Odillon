import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// GET - Récupérer un article par ID ou slug
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    // Try to get by ID first, then by slug
    let query = supabase.from('articles').select('*')

    // Check if id is a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    if (isUUID) {
        query = query.eq('id', id)
    } else {
        query = query.eq('slug', id)
    }

    const { data, error } = await query.single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ article: data })
}

// PATCH - Mettre à jour un article
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()

    // Update slug if title changed and slug not explicitly provided
    if (body.title && !body.slug) {
        body.slug = body.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    // Set published_at if publishing for the first time
    if (body.is_published === true) {
        const { data: existing } = await supabase
            .from('articles')
            .select('is_published, published_at')
            .eq('id', id)
            .single()

        if (existing && !existing.is_published && !existing.published_at) {
            body.published_at = new Date().toISOString()
        }
    }

    const { data, error } = await supabase
        .from('articles')
        .update(body)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidateTag('articles', 'max')

    return NextResponse.json({ article: data })
}

// DELETE - Supprimer un article
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidateTag('articles', 'max')

    return NextResponse.json({ success: true })
}
