"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, AlertCircle, CheckCircle2, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"

/** Habillage commun du flux d'authentification : ambiance du site public + logo. */
function AuthShell({ title, subtitle, children }: {
  title?: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
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
          {title && (
            <h1 className="font-baskvill text-3xl italic text-odillon-dark">{title}</h1>
          )}
          {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
        </div>

        <div className="rounded-2xl border border-odillon-teal/10 bg-white/85 shadow-xl shadow-odillon-teal/[0.08] backdrop-blur-xl">
          {children}
        </div>

        <div className="mt-6 text-center">
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

function UpdatePasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  useEffect(() => {
    // Vérifier si on a une session active ou les paramètres nécessaires
    const checkToken = async () => {
      const supabase = createClient()

      // D'abord, vérifier si on a une session active (cas le plus courant après redirection)
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // On a une session active, le token a été vérifié par la route callback
        setTokenValid(true)
        return
      }

      // Pas de session, vérifier si on a les paramètres token_hash et type dans l'URL
      const tokenHash = searchParams.get("token_hash")
      const type = searchParams.get("type")

      if (tokenHash && type === "recovery") {
        // On a les paramètres, le token sera vérifié lors de la soumission
        setTokenValid(true)
      } else {
        // Aucun paramètre et pas de session, lien invalide
        setTokenValid(false)
        setError("Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.")
      }
    }

    checkToken()
  }, [searchParams])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)

    const supabase = createClient()

    // Vérifier d'abord si on a une session active (cas le plus courant)
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      // Pas de session, essayer avec token_hash si présent
      const tokenHash = searchParams.get("token_hash")
      const type = searchParams.get("type")

      if (tokenHash && type === "recovery") {
        // Vérifier le token
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        })

        if (verifyError) {
          setError(verifyError.message || "Le lien de réinitialisation est invalide ou a expiré.")
          setLoading(false)
          return
        }
      } else {
        // Pas de session et pas de token_hash valide
        setError("Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.")
        setLoading(false)
        return
      }
    }

    // À ce stade, on a soit une session active, soit un token vérifié
    // On peut maintenant mettre à jour le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      setError(updateError.message || "Erreur lors de la mise à jour du mot de passe.")
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)

      // Rediriger vers la page de login après 3 secondes
      setTimeout(() => {
        router.push("/admin/login")
      }, 3000)
    }
  }

  if (tokenValid === false) {
    return (
      <AuthShell>
        <div className="space-y-4 p-6 text-center sm:p-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-odillon-dark">Lien invalide</h2>
          <p className="text-sm text-slate-600">
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <p className="text-xs text-slate-500">
            Veuillez demander un nouveau lien de réinitialisation.
          </p>
          <div className="space-y-3 pt-2">
            <Button
              onClick={() => router.push("/admin/reset-password")}
              className="h-11 w-full bg-odillon-teal font-semibold text-white shadow-sm hover:bg-odillon-teal/90"
            >
              Demander un nouveau lien
            </Button>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-odillon-teal transition-colors hover:text-odillon-teal/80"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </AuthShell>
    )
  }

  if (success) {
    return (
      <AuthShell>
        <div className="space-y-4 p-6 text-center sm:p-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-emerald-100 p-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-odillon-dark">Mot de passe mis à jour</h2>
          <p className="text-sm text-slate-600">
            Votre mot de passe a été modifié avec succès.
          </p>
          <p className="text-xs text-slate-500">
            Vous allez être redirigé vers la page de connexion…
          </p>
          <div className="pt-2">
            <Button
              onClick={() => router.push("/admin/login")}
              className="h-11 w-full bg-odillon-teal font-semibold text-white shadow-sm hover:bg-odillon-teal/90"
            >
              Se connecter maintenant
            </Button>
          </div>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Nouveau mot de passe"
      subtitle="Choisissez un mot de passe sécurisé (minimum 8 caractères)"
    >
      <form onSubmit={handleUpdatePassword} className="space-y-5 p-6 sm:p-8">
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Erreur</p>
              <p className="mt-1 text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              minLength={8}
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

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••"
              required
              minLength={8}
              className="h-11 border-slate-300 bg-white pl-10 pr-11 text-slate-900 placeholder:text-slate-500 focus-visible:ring-odillon-teal"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
              aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-odillon-teal font-semibold text-white shadow-sm transition-colors hover:bg-odillon-teal/90"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Mise à jour…
            </span>
          ) : (
            "Mettre à jour le mot de passe"
          )}
        </Button>

        <div className="pt-1 text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-odillon-teal transition-colors hover:text-odillon-teal/80"
          >
            Retour à la connexion
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}

// Composant de chargement pour Suspense
function UpdatePasswordLoading() {
  return (
    <AuthShell>
      <div className="flex items-center justify-center gap-3 p-8 text-slate-600">
        <Loader2 className="h-5 w-5 animate-spin text-odillon-teal" />
        <p className="text-sm">Chargement…</p>
      </div>
    </AuthShell>
  )
}

// Export du composant principal avec Suspense
export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<UpdatePasswordLoading />}>
      <UpdatePasswordContent />
    </Suspense>
  )
}
