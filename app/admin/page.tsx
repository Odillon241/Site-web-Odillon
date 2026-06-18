import { redirect } from "next/navigation"

/**
 * Point d'entrée /admin
 *
 * La route /admin n'a pas d'interface propre : on redirige vers le tableau de bord.
 * La vérification d'authentification est gérée par /admin/settings
 * (redirige vers /admin/login si la session est absente).
 */
export default function AdminIndexPage() {
  redirect("/admin/settings")
}
