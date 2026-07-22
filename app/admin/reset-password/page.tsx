"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    // Récupérer l'URL de redirection - utiliser la route callback qui gère la redirection Supabase
    const redirectTo = `${window.location.origin}/admin/reset-callback`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
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
            Mot de passe oublié ?
          </h1>
          <p className="mt-2 text-slate-600">
            Recevez un lien de réinitialisation par e-mail
          </p>
        </div>

        <div className="rounded-2xl border border-odillon-teal/10 bg-white/85 shadow-xl shadow-odillon-teal/[0.08] backdrop-blur-xl">
          {success ? (
            <div className="space-y-4 p-6 text-center sm:p-8">
              <div className="flex justify-center">
                <div className="rounded-full bg-emerald-100 p-3">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-odillon-dark">
                E-mail envoyé
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un
                e-mail contenant un lien pour réinitialiser votre mot de passe.
              </p>
              <p className="text-xs text-slate-500">
                Vérifiez votre boîte de réception et votre dossier spam.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => router.push("/admin/login")}
                  className="h-11 w-full bg-odillon-teal font-semibold text-white shadow-sm hover:bg-odillon-teal/90"
                >
                  Retour à la connexion
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5 p-6 sm:p-8">
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
                <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="reset-email"
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

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-odillon-teal font-semibold text-white shadow-sm transition-colors hover:bg-odillon-teal/90"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi en cours…
                  </span>
                ) : (
                  "Envoyer le lien de réinitialisation"
                )}
              </Button>

              <div className="pt-1 text-center">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-odillon-teal transition-colors hover:text-odillon-teal/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}
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
