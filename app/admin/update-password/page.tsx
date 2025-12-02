"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, AlertCircle, CheckCircle2, Home, Eye, EyeOff } from "lucide-react"
import { GridPattern } from "@/components/ui/grid-pattern"

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

    // Mettre à jour le mot de passe
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
                  <div className="rounded-full bg-red-100 p-3">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-odillon-dark">
                  Lien invalide
                </h2>
                <p className="text-sm text-gray-600">
                  Ce lien de réinitialisation est invalide ou a expiré.
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  Veuillez demander un nouveau lien de réinitialisation.
                </p>
                <div className="pt-4 space-y-3">
                  <Button
                    onClick={() => router.push("/admin/reset-password")}
                    className="w-full bg-odillon-teal hover:bg-odillon-teal/90 text-white"
                  >
                    Demander un nouveau lien
                  </Button>
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-2 text-sm text-odillon-teal hover:text-odillon-teal/80 transition-colors duration-200 font-medium"
                  >
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
                  Mot de passe mis à jour
                </h2>
                <p className="text-sm text-gray-600">
                  Votre mot de passe a été modifié avec succès.
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  Vous allez être redirigé vers la page de connexion...
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => router.push("/admin/login")}
                    className="w-full bg-odillon-teal hover:bg-odillon-teal/90 text-white"
                  >
                    Se connecter maintenant
                  </Button>
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
            Définir un nouveau mot de passe
          </h1>
          <p className="text-gray-600">
            Choisissez un mot de passe sécurisé pour votre compte
          </p>
        </div>

        <Card className="border-gray-200 bg-white/80 backdrop-blur-xl shadow-2xl shadow-odillon-teal/10">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-odillon-dark">
              Nouveau mot de passe
            </CardTitle>
            <p className="text-sm text-gray-500">
              Minimum 8 caractères
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-5">
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
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    minLength={8}
                    className="pl-10 pr-10 h-11 bg-white border-gray-300 focus:border-odillon-teal focus:ring-odillon-teal/20 text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    minLength={8}
                    className="pl-10 pr-10 h-11 bg-white border-gray-300 focus:border-odillon-teal focus:ring-odillon-teal/20 text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-odillon-teal to-odillon-lime hover:opacity-90 text-white font-semibold shadow-lg shadow-odillon-teal/25 transition-all duration-200"
              >
                {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-sm text-odillon-teal hover:text-odillon-teal/80 transition-colors duration-200 font-medium"
              >
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

// Composant de chargement pour Suspense
function UpdatePasswordLoading() {
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
            <div className="text-center">
              <p className="text-gray-600">Chargement...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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
