import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { items } = await request.json()

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
        }

        // Update each item's order
        // Note: In a real production environment with many items, 
        // it's better to use a stored procedure or a single batch query.
        // simpler approach for small lists:
        const updates = items.map(async (item: { id: string, display_order: number }) => {
            const { error } = await supabase
                .from('testimonials')
                .update({ display_order: item.display_order })
                .eq('id', item.id)

            if (error) throw error
        })

        await Promise.all(updates)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error reordering testimonials:', error)
        return NextResponse.json(
            { error: 'Failed to reorder testimonials' },
            { status: 500 }
        )
    }
}
