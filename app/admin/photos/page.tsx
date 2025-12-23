"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Loader2,
  LogOut,
  CalendarDays,
  Search,
  X,
  Building2,
  Video,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Quote,
  Sparkles,
  Users,
  Target
} from "lucide-react"

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

export default function AdminPhotosPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [activeTab, setActiveTab] = useState("photos")
  const [commandSearch, setCommandSearch] = useState("")

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

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (error: unknown) {
      console.error("Erreur lors de la déconnexion:", error)
      alert(error instanceof Error ? error.message : "Erreur lors de la déconnexion")
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-odillon-teal to-odillon-lime flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              Panneau d'Administration
            </h1>
            <p className="text-gray-600">
              Gérez le contenu de votre site web Odillon
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="shadow-sm">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* GUIDE */}
        <AdminGuide />

        {/* GLOBAL SEARCH */}
        <Card className="mb-6 shadow-md border-blue-100">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher dans toutes les sections..."
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                className="pl-10 bg-white"
              />
              {commandSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCommandSearch("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* TABS NAVIGATION */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-white shadow-md">
            <TabsTrigger
              value="photos"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Photos</span>
            </TabsTrigger>

            <TabsTrigger
              value="team"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Équipe</span>
            </TabsTrigger>

            <TabsTrigger
              value="about"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              <Target className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">A Propos</span>
            </TabsTrigger>

            <TabsTrigger
              value="logos"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white"
            >
              <Building2 className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Logos</span>
            </TabsTrigger>

            <TabsTrigger
              value="videos"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Video className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Vidéos</span>
            </TabsTrigger>

            <TabsTrigger
              value="testimonials"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
            >
              <Quote className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Témoignages</span>
            </TabsTrigger>

            <TabsTrigger
              value="calendar"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Calendrier</span>
            </TabsTrigger>

            <TabsTrigger
              value="expertise-cta"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Expertise</span>
            </TabsTrigger>

            <TabsTrigger
              value="settings"
              className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-700 data-[state=active]:text-white"
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Paramètres</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photos">
            <PhotosTab />
          </TabsContent>

          <TabsContent value="logos">
            <LogosTab />
          </TabsContent>

          <TabsContent value="videos">
            <VideosTab />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsTab />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarTab />
          </TabsContent>

          <TabsContent value="expertise-cta">
            <ExpertiseCtasTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>

          <TabsContent value="team">
            <TeamTab />
          </TabsContent>



          <TabsContent value="about">
            <AboutTab />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
