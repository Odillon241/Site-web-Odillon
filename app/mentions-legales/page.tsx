import { Footer } from "@/components/layout/footer"
import { HeaderPro } from "@/components/layout/header-pro"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { Scale, Shield, Building, Info, MapPin } from "lucide-react"
import Link from "next/link"

export default function MentionsLegalesPage() {
    return (
        <main className="min-h-screen relative bg-slate-50/50 pt-[148px] md:pt-[164px]">
            <HeaderPro />

            <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
                {/* Hero Header */}
                <FadeIn delay={0.1}>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-odillon-teal/10 text-odillon-teal text-sm font-medium mb-6">
                            <Scale className="w-4 h-4" />
                            <span>Cadre Réglementaire</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                            Mentions <span className="text-odillon-teal">Légales</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Informations obligatoires concernant l&apos;éditeur, l&apos;hébergeur et les conditions d&apos;utilisation du site Odillon.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid gap-8">
                    <BlurFade delay={0.2}>
                        <Card className="border-white/20 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/50 overflow-hidden">
                            <CardContent className="p-8 md:p-12">
                                <div className="space-y-16">
                                    <section className="relative">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-lg bg-odillon-teal/10 flex items-center justify-center text-odillon-teal">
                                                <Building className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900">1. Édition du site</h2>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed mb-6">
                                            En vertu de la législation en vigueur en République Gabonaise, il est précisé aux utilisateurs du site internet <strong>https://www.odillon.fr</strong> l&apos;identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
                                        </p>
                                        <div className="grid sm:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-lg border border-slate-100">
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Propriétaire du site</p>
                                                <p className="text-slate-800 font-semibold italic">Odillon - Ingénierie d&apos;Entreprises</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Siège Social</p>
                                                <p className="text-slate-800">BP- 13262 Libreville, Gabon</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact</p>
                                                <p className="text-slate-800">contact@odillon.fr | +241 11747574</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Directeur de publication</p>
                                                <p className="text-slate-800">La Direction Générale</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex items-start gap-3 p-4 bg-odillon-lime/5 rounded-lg border border-odillon-lime/10">
                                            <Info className="w-5 h-5 text-odillon-teal mt-0.5" />
                                            <p className="text-sm text-slate-600">
                                                <strong>Activité :</strong> Cabinet spécialisé en ingénierie d&apos;entreprises, conseil juridique, gouvernance et ingénierie financière.
                                            </p>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-lg bg-odillon-teal/10 flex items-center justify-center text-odillon-teal">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900">2. Hébergement</h2>
                                        </div>
                                        <div className="bg-slate-50/50 p-6 rounded-lg border border-slate-100">
                                            <p className="text-slate-700 font-semibold mb-2">Vercel Inc.</p>
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                340 S Lemon Ave #4133 Walnut, CA 91789, USA<br />
                                                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-odillon-teal hover:underline inline-flex items-center gap-1 mt-2">
                                                    Consulter le site web
                                                </a>
                                            </p>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-lg bg-odillon-teal/10 flex items-center justify-center text-odillon-teal">
                                                <Info className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900">3. Propriété intellectuelle</h2>
                                        </div>
                                        <div className="space-y-4 text-slate-600 leading-relaxed">
                                            <p>
                                                Odillon est propriétaire des droits de propriété intellectuelle et détient les droits d&apos;usage sur tous les éléments accessibles sur le site internet, notamment les textes, images, graphismes, logos, vidéos, architecture, icônes et sons.
                                            </p>
                                            <p>
                                                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Odillon.
                                            </p>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-lg bg-odillon-teal/10 flex items-center justify-center text-odillon-teal">
                                                <Shield className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900">4. Protection des données</h2>
                                        </div>
                                        <div className="p-6 rounded-lg bg-odillon-teal/5 border border-odillon-teal/10">
                                            <p className="text-slate-700 leading-relaxed italic">
                                                Le traitement des données personnelles sur le site est régi par la <strong>Loi n° 001-2011 du 25 septembre 2011</strong> relative à la protection des données à caractère personnel, modifiée par la <strong>Loi n°025/2023</strong>.
                                            </p>
                                            <div className="mt-6">
                                                <Link
                                                    href="/politique-confidentialite"
                                                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-odillon-teal text-white text-sm font-bold hover:bg-odillon-teal/90 transition-all shadow-lg shadow-odillon-teal/20"
                                                >
                                                    Voir la Politique de Confidentialité
                                                </Link>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-lg bg-odillon-teal/10 flex items-center justify-center text-odillon-teal">
                                                <Scale className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900">5. Droit applicable</h2>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed">
                                            Tout litige en relation avec l&apos;utilisation du site https://www.odillon.fr est soumis au <strong>droit gabonais</strong>. Il est fait attribution exclusive de juridiction aux tribunaux compétents de <strong>Libreville</strong>.
                                        </p>
                                    </section>
                                </div>
                            </CardContent>
                        </Card>
                    </BlurFade>
                </div>
            </div>
            <Footer />
        </main>
    )
}
