import { Footer } from "@/components/layout/footer"
import Link from "next/link"

export default function PolitiqueConfidentialitePage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-odillon-lime mb-10">
                    Politique de Confidentialité
                </h1>

                <div className="space-y-12 text-sm leading-relaxed text-gray-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Gestion des données personnelles</h2>
                        <p className="mb-4">
                            Le Client est informé des réglementations concernant la communication marketing, la loi du 21 Juin 2014 pour la confiance dans l'Economie Numérique, la Loi Informatique et Liberté du 06 Août 2004 ainsi que du Règlement Général sur la Protection des Données (RGPD : n° 2016-679).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. Responsables de la collecte des données personnelles</h2>
                        <p>
                            Pour les Données Personnelles collectées dans le cadre de la création du compte personnel de l'Utilisateur et de sa navigation sur le Site, le responsable du traitement des Données Personnelles est : Odillon.
                        </p>
                        <p className="mt-2">
                            En tant que responsable du traitement des données qu'il collecte, Odillon s'engage à respecter le cadre des dispositions légales en vigueur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Finalité des données collectées</h2>
                        <p>
                            Odillon est susceptible de traiter tout ou partie des données :
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Pour permettre la navigation sur le Site et la gestion et la traçabilité des prestations et services commandés par l'utilisateur : données de connexion et d'utilisation du Site, facturation, historique des commandes, etc.</li>
                            <li>Pour prévenir et lutter contre la fraude informatique (spamming, hacking...) : matériel informatique utilisé pour la navigation, l'adresse IP, le mot de passe (hashé)</li>
                            <li>Pour améliorer la navigation sur le Site : données de connexion et d'utilisation</li>
                            <li>Pour mener des enquêtes de satisfaction facultatives sur https://www.odillon.fr : adresse email</li>
                            <li>Pour mener des campagnes de communication (sms, mail) : numéro de téléphone, adresse email</li>
                        </ul>
                        <p className="mt-2">
                            https://www.odillon.fr ne commercialise pas vos données personnelles qui sont donc uniquement utilisées par nécessité ou à des fins statistiques et d'analyses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Droit d'accès, de rectification et d'opposition</h2>
                        <p>
                            Conformément à la réglementation européenne en vigueur, les Utilisateurs de https://www.odillon.fr disposent des droits suivants :
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Droit d'accès (article 15 RGPD) et de rectification (article 16 RGPD), de mise à jour, de complétude des données des Utilisateurs droit de verrouillage ou d'effacement des données des Utilisateurs à caractère personnel (article 17 du RGPD), lorsqu'elles sont inexactes, incomplètes, équivoques, périmées, ou dont la collecte, l'utilisation, la communication ou la conservation est interdite</li>
                            <li>Droit de retirer à tout moment un consentement (article 13-2c RGPD)</li>
                            <li>Droit à la limitation du traitement des données des Utilisateurs (article 18 RGPD)</li>
                            <li>Droit d'opposition au traitement des données des Utilisateurs (article 21 RGPD)</li>
                        </ul>
                        <p className="mt-4">
                            Pour exercer ces droits, vous pouvez nous contacter par écrit à l'adresse suivante :<br />
                            <strong>Odillon - DPO</strong><br />
                            BP- 13262 Libreville, Gabon.<br />
                            Ou par email à : <a href="mailto:contact@odillon.fr" className="text-odillon-teal hover:underline">contact@odillon.fr</a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Cookies</h2>
                        <p>
                            Un « cookie » est un petit fichier d'information envoyé sur le navigateur de l'Utilisateur et enregistré au sein du terminal de l'Utilisateur (ex : ordinateur, smartphone). Ce fichier comprend des informations telles que le nom de domaine de l'Utilisateur, le fournisseur d'accès Internet de l'Utilisateur, le système d'exploitation de l'Utilisateur, ainsi que la date et l'heure d'accès. Les Cookies ne risquent en aucun cas d'endommager le terminal de l'Utilisateur.
                        </p>
                        <p className="mt-2">
                            https://www.odillon.fr est susceptible de traiter les informations de l'Utilisateur concernant sa visite du Site, telles que les pages consultées, les recherches effectuées. Ces informations permettent à Odillon d'améliorer le contenu du Site, de la navigation de l'Utilisateur.
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10">
                    <Link href="/" className="text-sm text-gray-400 hover:text-odillon-lime transition-colors">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    )
}
