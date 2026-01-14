import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    try {
        const { albumNames } = await request.json()

        if (!Array.isArray(albumNames)) {
            return NextResponse.json({ error: 'Format invalide' }, { status: 400 })
        }

        // Since we need to update many rows, and Supabase/Postgres doesn't have a simple "update based on case" for this specific logic easily adaptable to "per album groups", 
        // we'll do it in a slightly more iterative way or fetch all and update.
        // Fetching all might be heavy if there are thousands, but for a typical website it's fine.
        // Better approach:
        // 1. Fetch ALL photos (id, description, created_at).
        // 2. Sort them in memory: First by album order (index in albumNames), then by created_at DESC.
        // 3. Assign new display_order.
        // 4. Upsert (update) the changed ones.

        // Fetch all photos
        const { data: allPhotos, error: fetchError } = await supabase
            .from('photos')
            .select('id, description, created_at')

        if (fetchError) throw fetchError

        // Create a map for album rank
        const albumRank = new Map(albumNames.map((name, index) => [name, index]))

        // Sort
        const sortedPhotos = [...allPhotos].sort((a, b) => {
            // Get rank, default to infinity if not in list (shouldn't happen for the ones we care about, but for others maybe put at end)
            const rankA = albumRank.has(a.description) ? albumRank.get(a.description)! : 999999
            const rankB = albumRank.has(b.description) ? albumRank.get(b.description)! : 999999

            if (rankA !== rankB) {
                return rankA - rankB
            }

            // Same album, sort by date desc
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })

        // Prepare updates
        const updates = sortedPhotos.map((photo, index) => ({
            id: photo.id,
            display_order: index + 1 // 1-based index
        }))

        // Perform bulk update
        // upsert works if we provide primary key
        const { error: updateError } = await supabase
            .from('photos')
            .upsert(updates, { onConflict: 'id' })

        if (updateError) throw updateError

        // Invalidate cache
        revalidateTag('photos', 'max')
        revalidateTag('active-photos', 'max')

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error reordering:', error)
        return NextResponse.json({ error: 'Erreur lors de la réorganisation' }, { status: 500 })
    }
}
