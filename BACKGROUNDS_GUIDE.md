# 🎨 Guide des Arrière-plans Animés

## Vue d'ensemble

Ce projet intègre maintenant plusieurs composants d'arrière-plan animés modernes basés sur shadcn/ui, optimisés pour des performances élevées avec Canvas et `requestAnimationFrame`.

## 🚀 Composants Disponibles

### 1. Grid Pattern Background (Actuel)
**Fichier**: `components/ui/grid-pattern.tsx`  
**Utilisation actuelle**: Section Hero principale

#### Caractéristiques
- Grille SVG animée avec des carrés qui s'illuminent
- Animations fluides avec Framer Motion
- Personnalisable via props (largeur, hauteur, position)
- Performance optimale (SVG léger)
- Idéal pour un look professionnel et moderne

#### Code d'exemple
```tsx
import { GridBackground } from "@/components/ui/grid-pattern"

<GridBackground className="bg-gradient-to-b from-gray-50 to-white">
  {/* Votre contenu */}
</GridBackground>
```

#### Personnalisation
```tsx
<GridBackground 
  className="bg-gradient-to-b from-gray-50 to-white"
  squares={[
    [4, 4],   // Position [x, y] des carrés animés
    [8, 8],
    [12, 4],
  ]}
/>
```

---

### 2. Aurora Background
**Fichier**: `components/ui/aurora-background.tsx`  
**Variante hero**: `components/sections/hero-with-aurora.tsx`

#### Caractéristiques
- Effet d'aurore boréale élégant et premium
- Animation CSS pure (pas de JavaScript)
- Dégradés fluides avec les couleurs Odillon (teal et lime)
- Filtre blur pour effet mystique
- Excellent pour sections premium/VIP

#### Code d'exemple
```tsx
import { AuroraBackground } from "@/components/ui/aurora-background"

<AuroraBackground showRadialGradient={true}>
  {/* Votre contenu */}
</AuroraBackground>
```

#### Activation
Pour utiliser cette variante :
```tsx
// Dans app/page.tsx, remplacez :
import { Hero } from "@/components/sections/hero"
// Par :
import { HeroWithAurora as Hero } from "@/components/sections/hero-with-aurora"
```

---

### 3. Retro Grid Background
**Fichier**: `components/ui/retro-grid.tsx`  
**Variante hero**: `components/sections/hero-with-retro-grid.tsx`

#### Caractéristiques
- Grille en perspective 3D (style cyberpunk/années 80)
- Animation continue avec effet de profondeur
- Angle personnalisable
- Parfait pour un look tech et futuriste
- Utilise la propriété CSS `perspective`

#### Code d'exemple
```tsx
import { RetroGrid } from "@/components/ui/retro-grid"

<div className="relative">
  <RetroGrid angle={65} />
  {/* Votre contenu */}
</div>
```

#### Personnalisation de l'angle
```tsx
<RetroGrid angle={45} />  // Angle plus plat
<RetroGrid angle={75} />  // Angle plus prononcé
```

---

### 4. Particles Background
**Fichier**: `components/ui/particles-background.tsx`

#### Caractéristiques
- Système de particules interactif
- Rendu Canvas haute performance
- Particules avec physique réaliste
- Personnalisation complète (quantité, couleur, vitesse)

#### Code d'exemple
```tsx
import { ParticlesBackground } from "@/components/ui/particles-background"

<div className="relative">
  <ParticlesBackground 
    quantity={50}
    color="rgba(26, 155, 142, 0.5)"
    vx={0.5}
    vy={0.5}
  />
  {/* Votre contenu */}
</div>
```

#### Props disponibles
- `quantity`: Nombre de particules (défaut: 50)
- `color`: Couleur des particules (format rgba)
- `vx`: Vitesse horizontale
- `vy`: Vitesse verticale
- `staticity`: Statique ou dynamique
- `ease`: Fluidité du mouvement

---

## 🎯 Quelle Background Choisir ?

### Pour un look Professionnel et Corporate
✅ **Grid Pattern Background** (actuel)
- Épuré et moderne
- Ne distrait pas du contenu
- Excellent pour B2B et services professionnels

### Pour un look Premium et Luxueux
✅ **Aurora Background**
- Effet wow garanti
- Parfait pour sections VIP ou premium
- Idéal pour se démarquer

### Pour un look Tech et Innovant
✅ **Retro Grid Background**
- Style cyberpunk moderne
- Excellent pour startups tech
- Look futuriste

### Pour un look Interactif et Dynamique
✅ **Particles Background**
- Engagement visuel élevé
- Parfait pour sections de présentation
- Style moderne et scientifique

---

## 🔧 Configuration Technique

### Animations ajoutées dans Tailwind
**Fichier**: `tailwind.config.ts`

```typescript
keyframes: {
  aurora: {
    from: { backgroundPosition: '50% 50%, 50% 50%' },
    to: { backgroundPosition: '350% 50%, 350% 50%' }
  },
  grid: {
    '0%': { transform: 'translateY(-50%)' },
    '100%': { transform: 'translateY(0)' }
  }
},
animation: {
  aurora: 'aurora 60s linear infinite',
  grid: 'grid 15s linear infinite'
}
```

### Variables CSS ajoutées
**Fichier**: `app/globals.css`

```css
:root {
  /* Aurora Background Variables */
  --white: rgba(255, 255, 255, 0.05);
  --black: rgba(0, 0, 0, 0.05);
  --transparent: rgba(255, 255, 255, 0);
  --odillon-teal: rgba(26, 155, 142, 0.5);
  --odillon-lime: rgba(196, 216, 46, 0.5);
}
```

---

## 📱 Performance

Tous les composants sont optimisés pour :
- ✅ Mobile et Desktop
- ✅ Animations fluides (60fps)
- ✅ Pas de ralentissement
- ✅ requestAnimationFrame pour Canvas
- ✅ CSS animations pour Aurora et Grid

### Bonnes pratiques
1. N'utilisez qu'un seul background animé par page
2. Testez sur mobile pour vérifier la performance
3. Utilisez `backdrop-blur` pour les cartes au-dessus
4. Maintenez la lisibilité du texte

---

## 🎨 Personnalisation des Couleurs

### Modifier les couleurs Grid Pattern
```tsx
// Dans components/ui/grid-pattern.tsx, ligne 86
className="fill-odillon-teal/10 stroke-odillon-teal/20"
```

### Modifier les couleurs Aurora
```css
/* Dans app/globals.css */
--odillon-teal: rgba(26, 155, 142, 0.5);
--odillon-lime: rgba(196, 216, 46, 0.5);
```

### Modifier les couleurs Retro Grid
```tsx
// Dans components/ui/retro-grid.tsx, ligne 24-27
[background-image:linear-gradient(to_right,rgba(26,155,142,0.15)_1px,transparent_0)]
```

---

## 🚀 Changer de Background

### Méthode 1: Modifier le Hero principal
```tsx
// components/sections/hero.tsx
// Remplacez l'import
import { GridBackground } from "@/components/ui/grid-pattern"
// Par
import { AuroraBackground } from "@/components/ui/aurora-background"
```

### Méthode 2: Utiliser une variante
```tsx
// app/page.tsx
// Actuel
import { Hero } from "@/components/sections/hero"

// Option 1: Aurora
import { HeroWithAurora as Hero } from "@/components/sections/hero-with-aurora"

// Option 2: Retro Grid
import { HeroWithRetroGrid as Hero } from "@/components/sections/hero-with-retro-grid"
```

---

## 📚 Ressources

- [Documentation shadcn/ui Backgrounds](https://www.shadcn.io/background)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 🐛 Dépannage

### Les animations ne fonctionnent pas
1. Vérifiez que `framer-motion` est installé
2. Vérifiez que les animations sont dans `tailwind.config.ts`
3. Vérifiez que les variables CSS sont dans `globals.css`

### Performance lente
1. Réduisez la quantité de particules
2. Utilisez Grid ou Aurora (plus légers)
3. Testez sur un appareil mobile réel

### Problèmes de couleur
1. Vérifiez les variables CSS `--odillon-teal` et `--odillon-lime`
2. Vérifiez que Tailwind compile les nouvelles classes
3. Lancez `npm run dev` pour recompiler

---

**Créé avec les meilleures pratiques shadcn/ui** ✨

