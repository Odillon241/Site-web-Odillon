/**
 * Layout admin
 *
 * Note: La protection d'authentification est gérée au niveau de chaque page
 * et non dans ce layout pour éviter les boucles de redirection sur /admin/login
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

