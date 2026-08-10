"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

/**
 * Bande d'abonnement de la rubrique Publications.
 * Volontairement sans carte ni ombre : elle prolonge la grille de filets de
 * l'index plutôt que de rajouter un bloc au-dessus.
 */
export function BlogNewsletter() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.includes("@")) {
            setStatus("error")
            setMessage("Cette adresse e-mail est incomplète.")
            return
        }

        setStatus("loading")
        setMessage("")

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setStatus("success")
                setMessage(data.message || "Inscription enregistrée.")
                setEmail("")
            } else {
                setStatus("error")
                setMessage(data.error || "L'inscription n'a pas abouti. Réessayez.")
            }
        } catch (error) {
            console.error("Newsletter subscription error:", error)
            setStatus("error")
            setMessage("L'inscription n'a pas abouti. Vérifiez votre connexion et réessayez.")
        }
    }

    const isBusy = status === "loading" || status === "success"

    return (
        <section aria-labelledby="blog-newsletter-title" className="border-t border-[#0A1F2C]/10">
            <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_26rem] lg:items-start lg:gap-16 lg:px-8 lg:py-20">
                <div>
                    <h2
                        id="blog-newsletter-title"
                        className="font-baskvill text-[clamp(1.5rem,3vw,2rem)] leading-snug tracking-[-0.015em] text-[#0A1F2C] text-balance"
                    >
                        Recevoir les prochaines publications
                    </h2>
                    <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-[#4A5C64] text-pretty">
                        Une note par mois : ce que nos missions nous apprennent sur la gouvernance,
                        les risques et l&apos;organisation des entreprises. Désinscription en un clic.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="lg:pt-2">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <label
                                htmlFor="blog-newsletter-email"
                                className="block text-sm font-medium text-[#0A1F2C]"
                            >
                                Adresse e-mail
                            </label>
                            <input
                                id="blog-newsletter-email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isBusy}
                                aria-describedby={message ? "blog-newsletter-message" : undefined}
                                className="mt-2 w-full border-0 border-b border-[#0A1F2C]/20 bg-transparent py-2 text-base text-[#0A1F2C] transition-colors placeholder:text-[#65757C] focus:border-odillon-teal focus:outline-none disabled:opacity-60"
                                placeholder="prenom.nom@entreprise.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isBusy}
                            className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#0A1F2C] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#00786B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odillon-teal disabled:opacity-60"
                        >
                            {status === "loading" ? (
                                <>
                                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                                    Envoi
                                </>
                            ) : status === "success" ? (
                                <>
                                    <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                                    Inscrit
                                </>
                            ) : (
                                <>
                                    S&apos;inscrire
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                                    />
                                </>
                            )}
                        </button>
                    </div>

                    {message && (
                        <p
                            id="blog-newsletter-message"
                            role="status"
                            className={`mt-3 text-sm ${
                                status === "success" ? "text-[#00695E]" : "text-[#B42318]"
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </section>
    )
}
