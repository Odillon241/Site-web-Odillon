"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export default function SetPasswordPage() {
  const [email, setEmail] = useState("dereckdanel@odillon.fr")
  const [password, setPassword] = useState("Reviti2025@")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResult({ success: false, message: data.error || "Erreur inconnue" })
      } else {
        setResult({
          success: true,
          message: `Mot de passe mis à jour avec succès pour ${data.user.email}`,
        })
      }
    } catch (error: any) {
      setResult({ success: false, message: `Erreur: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-gray-200 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-odillon-dark">
              Définir le mot de passe utilisateur
            </CardTitle>
            <p className="text-sm text-gray-500 mt-2">
              Mise à jour du mot de passe via l'API Supabase Admin
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email de l'utilisateur
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <Input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              {result && (
                <div
                  className={`flex items-start gap-3 p-4 rounded-lg border ${
                    result.success
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {result.success ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {result.success ? "Succès" : "Erreur"}
                    </p>
                    <p className="text-sm mt-1">{result.message}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-odillon-teal to-odillon-lime hover:opacity-90 text-white font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mise à jour en cours...
                  </span>
                ) : (
                  "Mettre à jour le mot de passe"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important :</strong> Cette page est temporaire et doit être supprimée après utilisation pour des raisons de sécurité.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
