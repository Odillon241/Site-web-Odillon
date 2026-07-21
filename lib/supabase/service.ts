import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Client Supabase avec la clé service-role : il contourne la RLS.
 *
 * Le projet le ré-instanciait inline dans une demi-douzaine de fichiers
 * (`lib/email-helpers.ts`, `app/api/contact/route.ts`, le cron d'articles...).
 * Il est centralisé ici pour les nouveaux usages.
 *
 * ⚠️ À n'utiliser QUE côté serveur, dans des routes qui ont déjà validé
 * l'entrée et vérifié les droits : cette clé donne un accès total à la base.
 * Ne jamais l'importer depuis un Client Component.
 */
export async function createServiceClient(): Promise<SupabaseClient> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
        throw new Error(
            "Configuration Supabase incomplète : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis"
        )
    }

    // Import dynamique : cohérent avec le reste du projet, et évite d'alourdir
    // le bundle des routes qui n'en ont pas besoin.
    const { createClient } = await import("@supabase/supabase-js")

    return createClient(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    })
}
