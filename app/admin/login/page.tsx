"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock, AlertCircle, ArrowRight, Home } from "lucide-react"
import { GridPattern } from "@/components/ui/grid-pattern"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Rediriger vers /admin/photos
      router.push("/admin/photos")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <GridPattern
        width={40}
        height={40}
        className="absolute inset-0 opacity-20"
      />

      {/* Accent Gradient Orbs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-odillon-teal/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-odillon-lime/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo et Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <Logo
              width={400}
              height={120}
              className="h-24 md:h-28 w-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-odillon-dark mb-2">
            Espace Administration
          </h1>
          <p className="text-gray-600">
            Gestion du contenu et des médias
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-gray-200 bg-white/80 backdrop-blur-xl shadow-2xl shadow-odillon-teal/10">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-odillon-dark">
              Connexion sécurisée
            </CardTitle>
            <p className="text-sm text-gray-500">
              Identifiez-vous pour accéder au panel
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Erreur de connexion</p>
                    <p className="text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre-email@odillon.fr"
                    required
                    className="pl-10 h-11 bg-white border-gray-300 focus:border-odillon-teal focus:ring-odillon-teal/20 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    className="pl-10 h-11 bg-white border-gray-300 focus:border-odillon-teal focus:ring-odillon-teal/20 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-odillon-teal to-odillon-lime hover:opacity-90 text-white font-semibold shadow-lg shadow-odillon-teal/25 transition-all duration-200 group"
              >
                {loading ? (
                  <span>Connexion en cours...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Se connecter
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/admin/reset-password"
                  className="text-sm text-odillon-teal hover:text-odillon-teal/80 transition-colors duration-200 font-medium"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-6">
          <Lock className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
          Accès réservé aux administrateurs autorisés
        </p>

        {/* Lien de retour vers la page d'accueil */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-odillon-teal hover:text-odillon-teal/80 transition-colors duration-200 font-medium"
          >
            <Home className="w-4 h-4" />
            Retour à la page d'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

