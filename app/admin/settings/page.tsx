"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Loader2,
  Search,
  Building2,
  Image as ImageIcon,
  Quote,
  Sparkles,
  Users,
  Mail
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
import { FormationsTab } from "@/components/admin/tabs/FormationsTab"
import { InscriptionsTab } from "@/components/admin/tabs/InscriptionsTab"
import { SatisfactionTab } from "@/components/admin/tabs/SatisfactionTab"
import { AboutTab } from "@/components/admin/tabs/AboutTab"
import { ArticlesTab } from "@/components/admin/tabs/ArticlesTab"
import { NewsletterTab } from "@/components/admin/tabs/NewsletterTab"
import { MessagesTab } from "@/components/admin/tabs/MessagesTab"
import { NewsTab } from "@/components/admin/tabs/NewsTab"

export default function AdminPhotosPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [commandSearch, setCommandSearch] = useState("")

  const [dashboardStats, setDashboardStats] = useState({
    photos: 0,
    team: 0,
    testimonials: 0,
    logos: 0,
    messages: 0
  })

  // Fetch Dashboard Stats
  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const { count: photosCount } = await supabase.from('photos').select('*', { count: 'exact', head: true })
      const { count: teamCount } = await supabase.from('team_members').select('*', { count: 'exact', head: true })
      const { count: testimonialsCount } = await supabase.from('testimonials').select('*', { count: 'exact', head: true })
      const { count: logosCount } = await supabase.from('company_logos').select('*', { count: 'exact', head: true })
      const { count: messagesCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new')

      setDashboardStats({
        photos: photosCount || 0,
        team: teamCount || 0,
        testimonials: testimonialsCount || 0,
        logos: logosCount || 0,
        messages: messagesCount || 0
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

  const StatCard = ({ title, value, icon: Icon }: { title: string, value: number, icon: any }) => (
    <div className="group relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm transition-colors hover:border-odillon-teal/25">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-odillon-teal/25 to-transparent" />
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal transition-colors group-hover:bg-odillon-teal/[0.1]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
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
      formations: "Formations",
      inscriptions: "Inscriptions",
      "expertise-cta": "Expertise CTA",
      settings: "Paramètres",
      newsletter: "Newsletter",
      messages: "Messages",
      news: "News Ticker"
    }
    return labels[val] || val
  }

  return (
    <SidebarProvider className="bg-[#f7f9f8]">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                className="h-9 w-full border-slate-200 bg-slate-50/80 pl-8 shadow-none md:w-[200px] lg:w-[300px] focus-visible:ring-1 focus-visible:ring-odillon-teal"
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="flex min-h-full flex-1 flex-col gap-4 bg-[#f7f9f8] p-4 md:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-slate-950">Tableau de Bord</h2>
                <p className="text-slate-500">Aperçu rapide de l'activité du site.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard title="Messages non lus" value={dashboardStats.messages} icon={Mail} />
                <StatCard title="Photos en ligne" value={dashboardStats.photos} icon={ImageIcon} />
                <StatCard title="Membres de l'équipe" value={dashboardStats.team} icon={Users} />
                <StatCard title="Témoignages" value={dashboardStats.testimonials} icon={Quote} />
                <StatCard title="Logos Partenaires" value={dashboardStats.logos} icon={Building2} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border border-slate-200/80 bg-white shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="mb-4 font-semibold text-slate-950">Guide Rapide</h3>
                    <AdminGuide />
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-slate-200/80 bg-white shadow-sm">
                  <div className="absolute inset-y-0 left-0 w-1 bg-odillon-teal" />
                  <CardContent className="relative z-10 flex h-full flex-col items-start justify-center p-8">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-2xl font-semibold tracking-tight text-slate-950">Besoin d'aide ?</h3>
                    <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-600">
                      Consultez la documentation ou contactez le support technique pour toute assistance sur la gestion de votre site.
                    </p>
                    <Button className="border border-odillon-teal/20 bg-odillon-teal text-white shadow-sm hover:bg-odillon-teal/90">
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
            {activeTab === 'formations' && <FormationsTab />}
            {activeTab === 'inscriptions' && <InscriptionsTab />}
            {activeTab === 'satisfaction' && <SatisfactionTab />}
            {activeTab === 'expertise-cta' && <ExpertiseCtasTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'team' && <TeamTab />}
            {activeTab === 'about' && <AboutTab />}
            {activeTab === 'newsletter' && <NewsletterTab />}
            {activeTab === 'messages' && <MessagesTab />}
            {activeTab === 'news' && <NewsTab />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
