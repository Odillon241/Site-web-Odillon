"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Loader2,
  Search,
  Building2,
  Image as ImageIcon,
  Quote,
  Users,
  Mail,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { adminNav, getTabLabel } from "@/components/admin/nav"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

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

export default function AdminSettingsPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState("")

  // Filtrage déterministe (sous-chaîne, insensible aux accents) : le tri flou
  // de cmdk fait parfois passer un mot-clé éclaté devant un préfixe exact.
  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")

  const filteredNav = useMemo(() => {
    const q = normalize(paletteQuery.trim())
    if (!q) return adminNav
    return adminNav
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          normalize(`${item.title} ${item.keywords?.join(" ") ?? ""}`).includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [paletteQuery])

  const [statsLoading, setStatsLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState({
    photos: 0,
    team: 0,
    testimonials: 0,
    logos: 0,
    messages: 0
  })

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    []
  )

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
      setStatsLoading(false)
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

  // Palette de commandes : Ctrl+K / Cmd+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f7f9f8]">
        <Image
          src="/images/logos/odillon-logo-full.svg"
          alt="Odillon"
          width={200}
          height={60}
          className="h-12 w-auto"
          priority
        />
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-odillon-teal" />
          <p className="text-sm">Vérification de l'authentification…</p>
        </div>
      </div>
    )
  }

  const stats: { label: string, value: number, icon: LucideIcon, tab: string }[] = [
    { label: "Messages non lus", value: dashboardStats.messages, icon: Mail, tab: "messages" },
    { label: "Photos en ligne", value: dashboardStats.photos, icon: ImageIcon, tab: "photos" },
    { label: "Équipe", value: dashboardStats.team, icon: Users, tab: "team" },
    { label: "Témoignages", value: dashboardStats.testimonials, icon: Quote, tab: "testimonials" },
    { label: "Logos partenaires", value: dashboardStats.logos, icon: Building2, tab: "logos" },
  ]

  return (
    <SidebarProvider className="admin-shell bg-[#f7f9f8]">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMessages={dashboardStats.messages}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger className="-ml-1 text-slate-600" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <button
                    type="button"
                    onClick={() => setActiveTab("dashboard")}
                    className="transition-colors hover:text-slate-900"
                  >
                    Administration
                  </button>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">{getTabLabel(activeTab)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden h-9 w-56 items-center gap-2 rounded-md border border-slate-200 bg-slate-50/80 px-3 text-sm text-slate-500 transition-colors hover:border-odillon-teal/30 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-odillon-teal md:flex"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Rechercher…</span>
              <kbd className="pointer-events-none rounded border border-slate-200 bg-white px-1.5 font-sans text-[11px] text-slate-500">
                Ctrl K
              </kbd>
            </button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setPaletteOpen(true)}
              className="text-slate-600 md:hidden"
              aria-label="Rechercher"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden border-slate-200 text-slate-700 hover:border-odillon-teal/30 hover:text-odillon-teal sm:inline-flex"
            >
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Voir le site
              </Link>
            </Button>
          </div>
        </header>

        <CommandDialog
          open={paletteOpen}
          onOpenChange={(open) => {
            setPaletteOpen(open)
            if (!open) setPaletteQuery("")
          }}
          commandProps={{ shouldFilter: false }}
        >
          <CommandInput
            placeholder="Aller à une section…"
            value={paletteQuery}
            onValueChange={setPaletteQuery}
          />
          <CommandList>
            <CommandEmpty>Aucune section trouvée.</CommandEmpty>
            {filteredNav.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.title}
                    onSelect={() => {
                      setActiveTab(item.value)
                      setPaletteOpen(false)
                      setPaletteQuery("")
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4 text-odillon-teal" />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </CommandDialog>

        <div className="flex min-h-full flex-1 flex-col gap-4 bg-[#f7f9f8] p-4 md:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-1 duration-300">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-1 text-sm capitalize text-slate-500">{today}</p>
                  <h1 className="font-baskvill text-3xl italic text-odillon-dark md:text-4xl">
                    Tableau de bord
                  </h1>
                  <p className="mt-2 text-slate-600">
                    Bienvenue dans l'espace d'administration du cabinet Odillon.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                {stats.map(({ label, value, icon: Icon, tab }) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-colors hover:border-odillon-teal/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-odillon-teal"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal transition-colors group-hover:bg-odillon-teal/[0.12]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-slate-500">{label}</h3>
                        {statsLoading ? (
                          <Skeleton className="mt-1.5 h-6 w-10 rounded" />
                        ) : (
                          <p className="text-2xl font-semibold tabular-nums tracking-tight text-slate-950">{value}</p>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-slate-300 transition-colors group-hover:text-odillon-teal" />
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_380px]">
                <AdminGuide />

                <div className="relative overflow-hidden rounded-xl bg-odillon-dark shadow-sm">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 55% at 85% -10%, rgba(0, 167, 149, 0.35), transparent 70%), radial-gradient(ellipse 50% 40% at 0% 110%, rgba(196, 216, 46, 0.18), transparent 70%)",
                    }}
                  />
                  <div className="relative flex flex-col items-start p-7">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-odillon-lime">
                      <LifeBuoy className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold tracking-tight text-white">Besoin d'aide ?</h3>
                    <p className="mb-6 text-sm leading-relaxed text-white/75">
                      Consultez le guide ci-contre ou contactez le support technique pour toute assistance
                      sur la gestion de votre site.
                    </p>
                    <Button
                      asChild
                      className="bg-odillon-teal text-white shadow-sm hover:bg-odillon-teal/90"
                    >
                      <a href="mailto:contact@odillon.fr">
                        Contacter le support
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={activeTab === 'dashboard' ? 'hidden' : 'block animate-in fade-in slide-in-from-bottom-1 duration-300'}>
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
