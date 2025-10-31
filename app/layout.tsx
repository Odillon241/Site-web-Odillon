import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { baskvill } from "./fonts"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.odillon.fr'),
  title: "Odillon - Ingénierie d'Entreprises | Cabinet de Conseil au Gabon",
  description: "Cabinet de conseil spécialisé en structuration, gestion administrative juridique et financière, relations publiques et management des risques. Gouvernance, RH, Finances et Juridique.",
  keywords: ["ingénierie d'entreprises", "conseil", "gabon", "gouvernance", "gestion administrative", "ressources humaines", "finances", "juridique", "libreville"],
  authors: [{ name: "Odillon" }],
  creator: "Odillon",
  publisher: "Odillon",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.odillon.fr",
    title: "Odillon - Ingénierie d'Entreprises",
    description: "Cabinet de conseil spécialisé en structuration, gestion administrative, relations publiques et management des risques",
    siteName: "Odillon",
  },
  twitter: {
    card: "summary_large_image",
    title: "Odillon - Ingénierie d'Entreprises",
    description: "Cabinet de conseil au Gabon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn(inter.className, baskvill.variable, "antialiased")}>{children}</body>
    </html>
  )
}

