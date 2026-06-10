"use client"

import * as React from "react"
import {
    ImageIcon,
    Users,
    Quote,
    Building2,
    Video,
    CalendarDays,
    Sparkles,
    Settings as SettingsIcon,
    LogOut,
    Target,
    LayoutDashboard,
    Newspaper,
    Mail,
    MessageSquare,
    Rss,
    GraduationCap
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function AdminSidebar({
    activeTab,
    setActiveTab,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    activeTab: string,
    setActiveTab: (tab: string) => void
}) {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const supabase = createClient()
            await supabase.auth.signOut()
            router.push('/admin/login')
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const navItems = [
        {
            label: "Vue d'ensemble",
            items: [
                { title: "Tableau de Bord", icon: LayoutDashboard, value: "dashboard" }
            ]
        },
        {
            label: "Contenu",
            items: [
                { title: "Photos", icon: ImageIcon, value: "photos" },
                { title: "Vidéos", icon: Video, value: "videos" },
                { title: "Articles", icon: Newspaper, value: "articles" },
                { title: "Témoignages", icon: Quote, value: "testimonials" },
                { title: "Logos Partenaires", icon: Building2, value: "logos" },
                { title: "Formations", icon: GraduationCap, value: "formations" },
            ]
        },
        {
            label: "Marketing",
            items: [
                { title: "Messages", icon: MessageSquare, value: "messages" },
                { title: "Newsletter", icon: Mail, value: "newsletter" },
                { title: "News Ticker", icon: Rss, value: "news" },
            ]
        },
        {
            label: "Organisation",
            items: [
                { title: "Équipe", icon: Users, value: "team" },
                { title: "A Propos", icon: Target, value: "about" },
                { title: "Calendrier", icon: CalendarDays, value: "calendar" },
                { title: "Expertise CTA", icon: Sparkles, value: "expertise-cta" },
            ]
        },
        {
            label: "Système",
            items: [
                { title: "Paramètres", icon: SettingsIcon, value: "settings" },
            ]
        }
    ]

    return (
        <Sidebar collapsible="icon" className="border-r border-slate-200/80 bg-white" {...props}>
            <SidebarHeader className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3 px-2 py-2 text-slate-900">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.08] text-odillon-teal">
                        <SettingsIcon className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold tracking-tight">Odillon Admin</span>
                        <span className="truncate text-xs text-slate-500">v1.2.0</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="gap-1 py-2">
                {navItems.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{group.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.value}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        onClick={() => setActiveTab(item.value)}
                                        isActive={activeTab === item.value}
                                        className={activeTab === item.value
                                            ? "!bg-odillon-teal/[0.08] !text-odillon-teal"
                                            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950"
                                        }
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-100 pt-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleLogout}
                            className="text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut />
                            <span>Déconnexion</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
