# Guide d'Utilisation - Site Web Odillon

## 🎉 Félicitations !

Votre site web professionnel est prêt ! Ce document vous guide pour l'utiliser et le personnaliser.

## 🚀 Démarrage Rapide

### 1. Le serveur de développement est déjà lancé !
Ouvrez votre navigateur sur **http://localhost:3000** pour voir le site.

### 2. Commandes disponibles

```bash
# Développement (déjà lancé en arrière-plan)
npm run dev

# Build de production
npm run build

# Démarrer le serveur de production
npm start

# Linter
npm run lint
```

## 📁 Structure du Projet

```
Odillon site web/
├── app/                          # Pages Next.js
│   ├── globals.css              # Styles globaux
│   ├── layout.tsx               # Layout avec métadonnées SEO
│   ├── page.tsx                 # Page d'accueil
│   └── opengraph-image.tsx      # Image Open Graph
│
├── components/
│   ├── layout/                  # Composants de structure
│   │   ├── header.tsx          # En-tête avec navigation
│   │   └── footer.tsx          # Pied de page
│   │
│   ├── sections/               # Sections de la page
│   │   ├── hero.tsx           # Section héro (haut de page)
│   │   ├── services.tsx       # Section services
│   │   ├── expertise.tsx      # Section expertise
│   │   ├── about.tsx          # Section à propos
│   │   └── contact.tsx        # Section contact
│   │
│   ├── magicui/               # Composants d'animation
│   │   ├── fade-in.tsx
│   │   ├── blur-fade.tsx
│   │   ├── scroll-progress.tsx
│   │   └── scroll-to-top.tsx
│   │
│   └── ui/                    # Composants shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── navigation-menu.tsx
│       └── separator.tsx
│
├── lib/
│   └── utils.ts              # Fonctions utilitaires
│
├── public/                   # Fichiers statiques
│   ├── logo d'odillon corrigé.png  # Logo Odillon
│   ├── robots.txt           # Configuration robots
│   └── sitemap.xml          # Plan du site
│
└── Configuration
    ├── package.json          # Dépendances
    ├── tailwind.config.ts    # Configuration Tailwind
    ├── components.json       # Configuration shadcn/ui
    └── tsconfig.json        # Configuration TypeScript
```

## 🎨 Personnalisation

### Couleurs

Les couleurs Odillon sont définies dans `tailwind.config.ts` :

- **Teal** (#1A9B8E) : `odillon-teal` - Couleur principale
- **Lime** (#C4D82E) : `odillon-lime` - Couleur secondaire
- **Dark** (#0A1F2C) : `odillon-dark` - Couleur sombre

Utilisation dans le code :
```tsx
<div className="bg-odillon-teal text-white">
  <p className="text-odillon-lime">Texte</p>
</div>
```

### Modifier le contenu

#### 1. Section Hero (Haut de page)
Fichier : `components/sections/hero.tsx`
- Titre principal
- Sous-titre
- Statistiques (années d'expérience, projets, clients)
- Boutons d'action

#### 2. Services
Fichier : `components/sections/services.tsx`
- 4 domaines d'expertise
- Liste de fonctionnalités pour chaque service

#### 3. Contact
Fichier : `components/sections/contact.tsx`
- Numéros de téléphone
- Email
- Adresse
- Formulaire de contact

### Ajouter des composants shadcn/ui

Pour ajouter plus de composants :

```bash
# Voir tous les composants disponibles
npx shadcn@latest add

# Exemples
npx shadcn@latest add dialog --yes
npx shadcn@latest add accordion --yes
npx shadcn@latest add tabs --yes
```

## 🔧 Personnalisation Avancée

### Ajouter une nouvelle section

1. Créez un fichier dans `components/sections/`
2. Importez-le dans `app/page.tsx`
3. Ajoutez-le entre les autres sections

Exemple :
```tsx
// components/sections/testimonials.tsx
export function Testimonials() {
  return (
    <section id="temoignages" className="py-24">
      {/* Votre contenu */}
    </section>
  )
}

// app/page.tsx
import { Testimonials } from "@/components/sections/testimonials"

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Testimonials /> {/* Nouvelle section */}
      <Contact />
      <Footer />
    </>
  )
}
```

### Modifier les métadonnées SEO

Fichier : `app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: "Votre titre",
  description: "Votre description",
  // ... autres métadonnées
}
```

## 🎯 Animations

Le site utilise **Framer Motion** pour des animations fluides et professionnelles :

### Composants d'animation disponibles

```tsx
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"

// Apparition avec fade
<FadeIn delay={0.2} direction="up">
  <div>Contenu</div>
</FadeIn>

// Apparition avec blur
<BlurFade delay={0.3}>
  <div>Contenu</div>
</BlurFade>
```

### Paramètres

- `delay` : délai avant l'animation (en secondes)
- `direction` : "up", "down", "left", "right"
- `duration` : durée de l'animation

## 📱 Responsive Design

Le site est entièrement responsive avec Tailwind CSS :

```tsx
// Mobile first
<div className="text-sm md:text-base lg:text-lg">
  {/* Taille de texte adaptative */}
</div>

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 col mobile, 2 tablette, 4 desktop */}
</div>
```

## 🌐 Déploiement

### Option 1 : Vercel (Recommandé)

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Installez Vercel CLI :
   ```bash
   npm install -g vercel
   ```
3. Déployez :
   ```bash
   vercel
   ```

### Option 2 : Netlify

1. Build du projet :
   ```bash
   npm run build
   ```
2. Déployez le dossier `.next` sur Netlify

### Option 3 : Serveur traditionnel

```bash
# Build
npm run build

# Démarrer le serveur
npm start
```

## 🔍 SEO

Le site est optimisé pour le référencement :

✅ Métadonnées complètes (title, description, keywords)
✅ Open Graph pour les réseaux sociaux
✅ Twitter Cards
✅ Sitemap XML
✅ Robots.txt
✅ Structure sémantique HTML5
✅ Images optimisées
✅ Performance optimale

## 🎓 Technologies Utilisées

- **Next.js 16** - Framework React moderne
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI accessibles
- **Framer Motion** - Animations fluides
- **Lucide React** - Icônes modernes

## 💡 Conseils

1. **Testez régulièrement** sur mobile, tablette et desktop
2. **Optimisez les images** avant de les ajouter
3. **Respectez la palette de couleurs** Odillon
4. **Gardez les animations subtiles** (pas de dégradés excessifs)
5. **Maintenez la cohérence** du design

## 🆘 Problèmes Courants

### Le serveur ne démarre pas
```bash
# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreurs TypeScript
```bash
# Vérifiez la configuration
npm run lint
```

### Composant manquant
```bash
# Réinstallez shadcn/ui
npx shadcn@latest add [component-name] --yes
```

## 📞 Support

Pour toute question ou modification, consultez :
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation shadcn/ui](https://ui.shadcn.com)
- [Documentation Framer Motion](https://www.framer.com/motion)

---

**Site créé avec ❤️ pour Odillon - Ingénierie d'Entreprises**

Libreville, Gabon | www.odillon.fr | contact@odillon.fr

