import { redirect } from "next/navigation"

/**
 * Ancienne page de gestion des photos.
 *
 * Le shell d'administration unifié vit dans /admin/settings (onglet Photos) ;
 * cette route est conservée uniquement pour ne pas casser les liens existants.
 */
export default function AdminPhotosPage() {
  redirect("/admin/settings")
}
