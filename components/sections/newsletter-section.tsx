"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { m } from "framer-motion"
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export function NewsletterSection() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !email.includes('@')) {
            setStatus("error")
            setMessage("Veuillez entrer un email valide")
            return
        }

        setStatus("loading")
        setMessage("")

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setStatus("success")
                setMessage(data.message)
                setEmail("")

                // Reset after 5 seconds
                setTimeout(() => {
                    setStatus("idle")
                    setMessage("")
                }, 5000)
            } else {
                setStatus("error")
                setMessage(data.error || "Une erreur est survenue")

                // Reset error after 5 seconds
                setTimeout(() => {
                    setStatus("idle")
                    setMessage("")
                }, 5000)
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error)
            setStatus("error")
            setMessage("Une erreur est survenue. Veuillez réessayer.")

            // Reset error after 5 seconds
            setTimeout(() => {
                setStatus("idle")
                setMessage("")
            }, 5000)
        }
    }

    return (
        <section className="py-20 bg-gray-50/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <m.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-xl bg-white border border-gray-100 px-6 py-16 sm:px-16 sm:py-24 shadow-xl"
                >
                    {/* Background effects - Subtle now */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-odillon-teal/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-odillon-lime/10 rounded-full blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4 sm:text-4xl font-petrov-sans">
                            Restez à la pointe de l'innovation
                        </h2>
                        <p className="mx-auto mt-4 mb-8 max-w-xl text-lg text-gray-600 font-light">
                            Recevez nos dernières analyses, études de cas et conseils stratégiques directement dans votre boîte mail.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <Input
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === "loading" || status === "success"}
                                    className="pl-10 h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-odillon-teal focus:border-transparent rounded-lg disabled:opacity-50"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={status === "loading" || status === "success"}
                                className="h-12 bg-odillon-teal text-white font-semibold hover:bg-odillon-teal/90 transition-all duration-300 px-8 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                        Envoi...
                                    </>
                                ) : status === "success" ? (
                                    <>
                                        <CheckCircle2 className="mr-2 w-4 h-4" />
                                        Abonné
                                    </>
                                ) : (
                                    <>
                                        S'abonner
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {message && (
                            <m.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-4 flex items-center justify-center gap-2 text-sm ${
                                    status === "success" ? "text-green-600" : "text-red-600"
                                }`}
                            >
                                {status === "success" ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <AlertCircle className="w-4 h-4" />
                                )}
                                {message}
                            </m.div>
                        )}

                        <p className="mt-6 text-xs text-gray-500">
                            Nous respectons votre vie privée. Vous pourrez vous désinscrire à tout moment.
                        </p>
                    </div>
                </m.div>
            </div>
        </section>
    )
}
