"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { LogOut, ExternalLink } from "lucide-react"

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
    SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { sidebarGroups, dashboardItem, settingsItem } from "@/components/admin/nav"

const itemClass =
    "text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-white data-[active=true]:bg-odillon-teal data-[active=true]:font-medium data-[active=true]:text-white"

export function AdminSidebar({
    activeTab,
    setActiveTab,
    unreadMessages = 0,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    activeTab: string
    setActiveTab: (tab: string) => void
    unreadMessages?: number
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

    return (
        <Sidebar collapsible="icon" className="border-r border-sidebar-border" {...props}>
            <SidebarHeader className="border-b border-sidebar-border px-3 pb-3 pt-4 group-data-[collapsible=icon]:px-2">
                <button
                    type="button"
                    onClick={() => setActiveTab("dashboard")}
                    className="flex items-center justify-start rounded-md outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center"
                    aria-label="Retour au tableau de bord"
                >
                    <Image
                        src="/images/logos/odillon-logo-white.svg"
                        alt="Odillon"
                        width={174}
                        height={52}
                        className="h-8 w-auto group-data-[collapsible=icon]:hidden"
                        priority
                    />
                    <Image
                        src="/images/logos/odillon-icon-white.svg"
                        alt="Odillon"
                        width={28}
                        height={28}
                        className="hidden size-7 group-data-[collapsible=icon]:block"
                    />
                </button>
                <p className="px-0.5 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
                    Espace d'administration
                </p>
            </SidebarHeader>

            <SidebarContent className="gap-0 py-1.5">
                {/* Tableau de bord : épinglé en tête, sans libellé de groupe */}
                <SidebarGroup className="py-0.5">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip={dashboardItem.title}
                                onClick={() => setActiveTab(dashboardItem.value)}
                                isActive={activeTab === dashboardItem.value}
                                className={itemClass}
                            >
                                <dashboardItem.icon />
                                <span>{dashboardItem.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {sidebarGroups.map((group) => (
                    <SidebarGroup key={group.label} className="py-0.5">
                        <SidebarGroupLabel className="h-6 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
                            {group.label}
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.value}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        onClick={() => setActiveTab(item.value)}
                                        isActive={activeTab === item.value}
                                        className={itemClass}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                    {item.value === "messages" && unreadMessages > 0 && (
                                        <SidebarMenuBadge className="bg-odillon-lime font-semibold text-odillon-dark">
                                            {unreadMessages}
                                        </SidebarMenuBadge>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border pb-3 pt-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={settingsItem.title}
                            onClick={() => setActiveTab(settingsItem.value)}
                            isActive={activeTab === settingsItem.value}
                            className={itemClass}
                        >
                            <settingsItem.icon />
                            <span>{settingsItem.title}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Voir le site"
                            className="text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-white"
                        >
                            <Link href="/" target="_blank" rel="noopener noreferrer">
                                <ExternalLink />
                                <span>Voir le site</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Déconnexion"
                            onClick={handleLogout}
                            className="text-sidebar-foreground/85 hover:bg-red-500/15 hover:text-red-300"
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
