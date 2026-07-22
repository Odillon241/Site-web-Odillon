"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock, AlertCircle, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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
      router.push("/admin/settings")
      router.refresh()
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Ambiance partagée avec le site public */}
      <div className="animated-gradient-bg" aria-hidden />
      <div className="grid-bg" aria-hidden />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-block" aria-label="Retour à l'accueil">
            <Logo
              width={348}
              height={104}
              className="h-14 w-auto md:h-16"
              priority
            />
          </Link>
          <h1 className="font-baskvill text-3xl italic text-odillon-dark">
            Espace d'administration
          </h1>
          <p className="mt-2 text-slate-600">
            Gestion du contenu et des médias du site
          </p>
        </div>

        <div className="rounded-2xl border border-odillon-teal/10 bg-white/85 shadow-xl shadow-odillon-teal/[0.08] backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-5 p-6 sm:p-8" noValidate={false}>
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Erreur de connexion</p>
                  <p className="mt-1 text-red-600">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre-email@odillon.fr"
                  required
                  className="h-11 border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-500 focus-visible:ring-odillon-teal"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="h-11 border-slate-300 bg-white pl-10 pr-11 text-slate-900 placeholder:text-slate-500 focus-visible:ring-odillon-teal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group h-11 w-full bg-odillon-teal font-semibold text-white shadow-sm transition-colors hover:bg-odillon-teal/90"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion en cours…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Se connecter
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>

            <div className="pt-1 text-center">
              <Link
                href="/admin/reset-password"
                className="text-sm font-medium text-odillon-teal transition-colors hover:text-odillon-teal/80"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Lock className="-mt-0.5 mr-1.5 inline-block h-3.5 w-3.5" />
          Accès réservé aux administrateurs autorisés
        </p>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-odillon-teal transition-colors hover:text-odillon-teal/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la page d'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
