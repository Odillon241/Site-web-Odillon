import { use } from "react"
import dynamic from "next/dynamic"
const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then(mod => mod.HeaderPro), { ssr: true })
import { Footer } from "@/components/layout/footer"
import { SubServicePage } from "@/components/sections/sub-service-page"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { servicesData } from "@/lib/services-data"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ serviceId: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId, slug } = await params
  const service = servicesData.find(s => s.id === serviceId)
  const subService = service?.services.find(s => s.slug === slug)

  if (!service || !subService) {
    return { title: "Page non trouvée | Odillon" }
  }

  return {
    title: `${subService.name} - ${service.title} | Odillon`,
    description: subService.description,
  }
}

export default function SubServiceRoute({ params }: Props) {
  const { serviceId, slug } = use(params)
  const service = servicesData.find(s => s.id === serviceId)
  const subService = service?.services.find(s => s.slug === slug)

  if (!service || !subService) {
    notFound()
  }

  return (
    <>
      <ScrollToTop />
      <HeaderPro />
      <main className="min-h-screen pt-[88px] md:pt-[104px]">
        <SubServicePage service={service} subService={subService} />
      </main>
      <Footer />
    </>
  )
}
