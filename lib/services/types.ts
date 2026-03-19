// Types avec icônes en string pour la sérialisation
export type ServiceData = {
  id: string
  icon: string // Nom de l'icône (string sérialisable)
  title: string
  color: string
  gradient: string
  tagline: string
  description: string
  keyBenefits: Array<{ icon: string; text: string; detail: string }>
  workflow: Array<{ step: string; title: string; description: string; icon: string }>
  services: Array<{
    icon: string
    name: string
    slug: string
    tagline: string
    description: string
    details: Array<{ title: string; content: string; impact: string }>
  }>
  legalReferences?: Array<{
    title: string
    description: string
    url: string
    type: "pdf" | "link"
  }>
}
