"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, AlertCircle, CheckCircle2, ArrowLeft, Home } from "lucide-react"
import { GridPattern } from "@/components/ui/grid-pattern"

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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
        <GridPattern
          width={40}
          height={40}
          className="absolute inset-0 opacity-20"
        />

        <div className="absolute top-20 -left-20 w-72 h-72 bg-odillon-teal/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-odillon-lime/20 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <Logo
                width={400}
                height={120}
                className="h-24 md:h-28 w-auto"
                priority
              />
            </div>
          </div>

          <Card className="border-gray-200 bg-white/80 backdrop-blur-xl shadow-2xl shadow-odillon-teal/10">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-odillon-dark">
                  E-mail envoyé
                </h2>
                <p className="text-sm text-gray-600">
                  Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un e-mail contenant un lien pour réinitialiser votre mot de passe.
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  Vérifiez votre boîte de réception et votre dossier spam.
                </p>
                <div className="pt-4 space-y-3">
                  <Button
                    onClick={() => router.push("/admin/login")}
                    className="w-full bg-odillon-teal hover:bg-odillon-teal/90 text-white"
                  >
                    Retour à la connexion
                  </Button>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-odillon-teal hover:text-odillon-teal/80 transition-colors duration-200 font-medium"
                  >
                    <Home className="w-4 h-4" />
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      <GridPattern
        width={40}
        height={40}
        className="absolute inset-0 opacity-20"
      />

      <div className="absolute top-20 -left-20 w-72 h-72 bg-odillon-teal/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-odillon-lime/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
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
            Mot de passe oublié ?
          </h1>
          <p className="text-gray-600">
            Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
          </p>
        </div>

        <Card className="border-gray-200 bg-white/80 backdrop-blur-xl shadow-2xl shadow-odillon-teal/10">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-odillon-dark">
              Réinitialisation du mot de passe
            </CardTitle>
            <p className="text-sm text-gray-500">
              Nous vous enverrons un lien par e-mail
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-5">
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Erreur</p>
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-odillon-teal to-odillon-lime hover:opacity-90 text-white font-semibold shadow-lg shadow-odillon-teal/25 transition-all duration-200"
              >
                {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-sm text-odillon-teal hover:text-odillon-teal/80 transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          </CardContent>
        </Card>

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
