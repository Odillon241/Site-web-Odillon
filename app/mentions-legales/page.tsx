import { Footer } from "@/components/layout/footer"

export default function MentionsLegalesPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-odillon-lime mb-10">
                    Mentions Légales
                </h1>

                <div className="space-y-12 text-sm leading-relaxed text-gray-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Édition du site</h2>
                        <p className="mb-4">
                            En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site internet <strong>https://www.odillon.fr</strong> l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Propriétaire du site :</strong> Odillon - Ingénierie d'Entreprises</li>
                            <li><strong>Adresse postale :</strong> BP- 13262 Libreville, Gabon</li>
                            <li><strong>Contact :</strong> contact@odillon.fr | +241 11747574</li>
                            <li><strong>Directeur de la publication :</strong> La Direction Générale</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. Hébergement</h2>
                        <p>
                            Le site est hébergé par <strong>Vercel Inc.</strong><br />
                            Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA<br />
                            Site web : https://vercel.com
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Propriété intellectuelle et contrefaçons</h2>
                        <p>
                            Odillon est propriétaire des droits de propriété intellectuelle et détient les droits d'usage sur tous les éléments accessibles sur le site internet, notamment les textes, images, graphismes, logos, vidéos, architecture, icônes et sons.
                        </p>
                        <p className="mt-2">
                            Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Odillon.
                        </p>
                        <p className="mt-2">
                            Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Limitations de responsabilité</h2>
                        <p>
                            Odillon ne pourra être tenu pour responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site https://www.odillon.fr.
                        </p>
                        <p className="mt-2">
                            Odillon décline toute responsabilité quant à l'utilisation qui pourrait être faite des informations et contenus présents sur https://www.odillon.fr.
                        </p>
                        <p className="mt-2">
                            Odillon s'engage à sécuriser au mieux le site https://www.odillon.fr, cependant sa responsabilité ne pourra être mise en cause si des données indésirables sont importées et installées sur son site à son insu.
                        </p>
                        <p className="mt-2">
                            Des espaces interactifs (espace contact) sont à la disposition des utilisateurs. Odillon se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui contreviendrait à la législation applicable au Gabon, en particulier aux dispositions relatives à la protection des données.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Droit applicable et attribution de juridiction</h2>
                        <p>
                            Tout litige en relation avec l'utilisation du site https://www.odillon.fr est soumis au droit gabonais. En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents de Libreville.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    )
}
