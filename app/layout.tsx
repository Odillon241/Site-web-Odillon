import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { baskvill } from "./fonts"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.odillon.fr'),
  title: "Odillon - Ingénierie d'Entreprises | Cabinet de Conseil au Gabon",
  description: "Cabinet de conseil spécialisé en structuration, gestion administrative juridique et financière, relations publiques et management des risques. Gouvernance, RH, Finances et Juridique.",
  keywords: ["ingénierie d'entreprises", "conseil", "gabon", "gouvernance", "gestion administrative", "ressources humaines", "finances", "juridique", "libreville"],
  authors: [{ name: "Odillon" }],
  creator: "Odillon",
  publisher: "Odillon",
  icons: {
    icon: "/favicon-odillon.png",
    shortcut: "/favicon-odillon.png",
    apple: "/favicon-odillon.png",
  },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "name": "Odillon",
  "description": "Cabinet de conseil en ingénierie d'entreprises, spécialisé dans la structuration et le management stratégique au Gabon.",
  "url": "https://www.odillon.fr",
  "logo": "https://www.odillon.fr/logo-odillon.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Libreville",
    "addressCountry": "GA"
  },
  "telephone": "+241117475474",
  "email": "contact@odillon.fr",
  "sameAs": ["https://www.odillon.fr"],
  "knowsAbout": [
    "Gouvernance d'entreprise",
    "Ressources humaines",
    "Gestion financière",
    "Conseil juridique",
    "Ingénierie d'entreprises"
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn(inter.className, baskvill.variable, "antialiased")}>{children}</body>
    </html>
  )
}

