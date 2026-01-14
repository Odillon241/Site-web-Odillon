"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Loader2,
  CalendarDays,
  Search,
  Building2,
  Video,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Quote,
  Sparkles,
  Users,
  Target,
  LayoutDashboard
} from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { AdminGuide } from "@/components/admin/admin-guide"
import { createClient } from "@/lib/supabase/client"

// Import Tab Components
import { PhotosTab } from "@/components/admin/tabs/PhotosTab"
import { LogosTab } from "@/components/admin/tabs/LogosTab"
import { VideosTab } from "@/components/admin/tabs/VideosTab"
import { TestimonialsTab } from "@/components/admin/tabs/TestimonialsTab"
import { CalendarTab } from "@/components/admin/tabs/CalendarTab"
import { ExpertiseCtasTab } from "@/components/admin/tabs/ExpertiseCtasTab"
import { SettingsTab } from "@/components/admin/tabs/SettingsTab"
import { TeamTab } from "@/components/admin/tabs/TeamTab"
import { AboutTab } from "@/components/admin/tabs/AboutTab"
import { ArticlesTab } from "@/components/admin/tabs/ArticlesTab"
import { NewsletterTab } from "@/components/admin/tabs/NewsletterTab"

export default function AdminPhotosPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [commandSearch, setCommandSearch] = useState("")

  const [dashboardStats, setDashboardStats] = useState({
    photos: 0,
    team: 0,
    testimonials: 0,
    logos: 0
  })

  // Fetch Dashboard Stats
  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const { count: photosCount } = await supabase.from('photos').select('*', { count: 'exact', head: true })
      const { count: teamCount } = await supabase.from('team_members').select('*', { count: 'exact', head: true })
      const { count: testimonialsCount } = await supabase.from('testimonials').select('*', { count: 'exact', head: true })
      const { count: logosCount } = await supabase.from('company_logos').select('*', { count: 'exact', head: true })

      setDashboardStats({
        photos: photosCount || 0,
        team: teamCount || 0,
        testimonials: testimonialsCount || 0,
        logos: logosCount || 0
      })
    }

    if (!checkingAuth) {
      fetchStats()
    }
  }, [checkingAuth])

  // Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin/login')
      } else {
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-odillon-teal mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )

  const getTabLabel = (val: string) => {
    const labels: Record<string, string> = {
      dashboard: "Tableau de Bord",
      photos: "Photos",
      team: "Équipe",
      about: "A Propos",
      logos: "Logos",
      videos: "Vidéos",
      articles: "Articles",
      testimonials: "Témoignages",
      calendar: "Calendrier",
      "expertise-cta": "Expertise CTA",
      settings: "Paramètres",
      newsletter: "Newsletter"
    }
    return labels[val] || val
  }

  return (
    <SidebarProvider>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-white px-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getTabLabel(activeTab)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="ml-auto w-full max-w-sm flex items-center gap-2">
            <div className="relative flex-1 hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="w-full bg-gray-50/50 pl-8 md:w-[200px] lg:w-[300px] border-none focus-visible:ring-1"
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 bg-gray-50/50 min-h-full">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de Bord</h2>
                <p className="text-gray-500">Aperçu rapide de l'activité du site.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Photos en ligne" value={dashboardStats.photos} icon={ImageIcon} color="bg-blue-500" />
                <StatCard title="Membres de l'équipe" value={dashboardStats.team} icon={Users} color="bg-teal-500" />
                <StatCard title="Témoignages" value={dashboardStats.testimonials} icon={Quote} color="bg-orange-500" />
                <StatCard title="Logos Partenaires" value={dashboardStats.logos} icon={Building2} color="bg-indigo-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Guide Rapide</h3>
                    <AdminGuide />
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-odillon-teal to-teal-700 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
                  <CardContent className="p-8 flex flex-col items-start justify-center h-full relative z-10">
                    <Sparkles className="w-10 h-10 mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold mb-2">Besoin d'aide ?</h3>
                    <p className="text-teal-100 mb-6 max-w-md text-sm leading-relaxed">
                      Consultez la documentation ou contactez le support technique pour toute assistance sur la gestion de votre site.
                    </p>
                    <Button className="bg-white text-teal-700 hover:bg-teal-50 border-none shadow-lg font-medium">
                      Contacter le support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div className={activeTab === 'dashboard' ? 'hidden' : 'block animate-in fade-in slide-in-from-bottom-4 duration-500'}>
            {activeTab === 'photos' && <PhotosTab />}
            {activeTab === 'logos' && <LogosTab />}
            {activeTab === 'videos' && <VideosTab />}
            {activeTab === 'articles' && <ArticlesTab />}
            {activeTab === 'testimonials' && <TestimonialsTab />}
            {activeTab === 'calendar' && <CalendarTab />}
            {activeTab === 'expertise-cta' && <ExpertiseCtasTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'team' && <TeamTab />}
            {activeTab === 'about' && <AboutTab />}
            {activeTab === 'newsletter' && <NewsletterTab />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
