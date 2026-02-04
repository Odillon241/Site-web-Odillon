import { Footer } from "@/components/layout/footer"
import { HeaderPro } from "@/components/layout/header-pro"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, UserCheck, Database, Search, ArrowLeft, Building } from "lucide-react"
import Link from "next/link"

export default function PolitiqueConfidentialitePage() {
    return (
        <main className="min-h-screen relative bg-slate-50/50 pt-[148px] md:pt-[164px]">
            <HeaderPro />

            <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
                {/* Hero Header */}
                <FadeIn delay={0.1}>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-odillon-teal/10 text-odillon-teal text-sm font-medium mb-6">
                            <Lock className="w-4 h-4" />
                            <span>Confidentialité & Sécurité</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                            Politique de <span className="text-odillon-teal">Confidentialité</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Chez Odillon, la protection de vos données personnelles est au cœur de notre engagement. Découvrez comment nous gérons vos informations.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid gap-12">
                    <BlurFade delay={0.2}>
                        <Card className="border-white/20 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/50 overflow-hidden">
                            <CardContent className="p-8 md:p-12">
                                <div className="space-y-16">
                                    <section>
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-lg bg-odillon-teal/10 flex items-center justify-center text-odillon-teal flex-shrink-0">
                                                <Shield className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 mb-2">1. Préambule</h2>
                                                <p className="text-slate-600 leading-relaxed">
                                                    Odillon, cabinet d&apos;ingénierie d&apos;entreprises basé à Libreville, Gabon, accorde une importance capitale à la protection de la vie privée et des données à caractère personnel de ses utilisateurs.
                                                </p>
                                                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm italic text-slate-500">
                                                    Conformément à la Loi n° 001-2011 du 25 septembre 2011 relative à la protection des données à caractère personnel en République Gabonaise.
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-lg bg-odillon-teal/10 flex items-center justify-center text-odillon-teal flex-shrink-0">
                                                <Database className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Collecte des données</h2>
                                                <p className="text-slate-600 mb-6">
                                                    Dans le cadre de son activité d&apos;ingénierie d&apos;entreprises et de conseil, Odillon collecte les données suivantes via son formulaire de contact :
                                                </p>
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    {[
                                                        { label: "Identité", desc: "Nom complet", icon: UserCheck },
                                                        { label: "Contact", desc: "Email & Téléphone", icon: Eye },
                                                        { label: "Professionnel", desc: "Nom de l'entreprise", icon: Building },
                                                        { label: "Message", desc: "Objet de la demande", icon: Search }
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
                                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                                <item.icon className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.label}</p>
                                                                <p className="text-slate-700 font-medium">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-lg bg-odillon-teal/10 flex items-center justify-center text-odillon-teal flex-shrink-0">
                                                <Eye className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Finalité du traitement</h2>
                                                <div className="space-y-4">
                                                    <p className="text-slate-600">Les données collectées sont utilisées exclusivement pour :</p>
                                                    <ul className="grid gap-3 sm:grid-cols-2">
                                                        {[
                                                            "Répondre aux demandes de renseignements",
                                                            "Assurer le suivi des prestations",
                                                            "Gérer la relation commerciale",
                                                            "Améliorer l'expérience utilisateur"
                                                        ].map((text, i) => (
                                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-odillon-teal" />
                                                                {text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-lg bg-odillon-teal/10 flex items-center justify-center text-odillon-teal flex-shrink-0">
                                                <UserCheck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Vos Droits</h2>
                                                <div className="grid gap-4 sm:grid-cols-2 mb-8">
                                                    {[
                                                        { title: "Accès", text: "Confirmer le traitement de vos données" },
                                                        { title: "Rectification", text: "Mettre à jour vos informations" },
                                                        { title: "Opposition", text: "S'opposer au traitement" },
                                                        { title: "Suppression", text: "Demander l'effacement total" }
                                                    ].map((item, i) => (
                                                        <div key={i} className="p-5 rounded-lg bg-slate-50 border border-slate-100">
                                                            <h3 className="font-bold text-slate-900 mb-1">Droit de {item.title}</h3>
                                                            <p className="text-sm text-slate-500">{item.text}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="p-6 rounded-lg bg-odillon-teal text-white shadow-lg shadow-odillon-teal/20">
                                                    <h3 className="font-bold mb-2">Exercer vos droits</h3>
                                                    <p className="text-white/80 text-sm mb-4">
                                                        Contactez notre responsable de la protection des données (DPO) :
                                                    </p>
                                                    <address className="not-italic text-sm space-y-1">
                                                        <p className="font-bold">Odillon - DPO</p>
                                                        <p>BP- 13262 Libreville, Gabon</p>
                                                        <p>Email : <a href="mailto:contact@odillon.fr" className="underline hover:text-odillon-lime transition-colors">contact@odillon.fr</a></p>
                                                    </address>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-odillon-teal/10 flex items-center justify-center text-odillon-teal flex-shrink-0">
                                                <Lock className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 mb-2">5. Sécurité</h2>
                                                <p className="text-slate-600 leading-relaxed">
                                                    Odillon met en œuvre toutes les mesures de sécurité techniques et organisationnelles nécessaires pour protéger vos données contre tout accès non autorisé, perte ou altération.
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </CardContent>
                        </Card>
                    </BlurFade>

                    <BlurFade delay={0.4}>
                        <div className="flex justify-center">
                            <Link
                                href="/"
                                className="group inline-flex items-center gap-2 text-slate-500 hover:text-odillon-teal transition-colors font-medium"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Retour à l&apos;accueil
                            </Link>
                        </div>
                    </BlurFade>
                </div>
            </div>
            <Footer />
        </main>
    )
}
