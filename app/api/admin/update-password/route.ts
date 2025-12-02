import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Route API temporaire pour mettre à jour le mot de passe d'un utilisateur
// À supprimer après utilisation pour des raisons de sécurité

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Récupérer l'utilisateur par email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      return NextResponse.json(
        { error: `Erreur lors de la récupération des utilisateurs: ${listError.message}` },
        { status: 500 }
      )
    }

    const user = users.users.find(u => u.email === email)

    if (!user) {
      return NextResponse.json(
        { error: `Utilisateur avec l'email ${email} introuvable` },
        { status: 404 }
      )
    }

    // Mettre à jour le mot de passe
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        password: password
      }
    )

    if (error) {
      return NextResponse.json(
        { error: `Erreur lors de la mise à jour: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès',
      user: {
        id: data.user.id,
        email: data.user.email
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erreur: ${error.message}` },
      { status: 500 }
    )
  }
}
