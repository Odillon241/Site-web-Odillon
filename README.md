# Odillon - Ingénierie d'Entreprises

Site web officiel du cabinet Odillon spécialisé en ingénierie d'entreprises.

## Technologies utilisées

- **Next.js 16** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI réutilisables
- **Framer Motion** - Animations fluides et professionnelles
- **Lucide React** - Icônes modernes

## Démarrage rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build de production

```bash
npm run build
npm start
```

## 🔧 Gestion du dépôt Git

### Configurer `main` comme branche principale

Pour configurer la branche `main` comme branche principale du dépôt :

#### En local

```bash
# Vérifier la branche actuelle
git branch

# Passer sur main
git checkout main

# Récupérer les dernières modifications
git fetch origin

# Synchroniser avec origin/main
git pull origin main

# Configurer main comme branche par défaut
git remote set-head origin main
git branch --set-upstream-to=origin/main main
```

#### Depuis la console SSH (Infomaniak)

```bash
# Se connecter en SSH
ssh votre-user@odillon.fr

# Aller dans le dossier du site
cd /chemin/vers/site

# Passer sur main
git checkout main

# Récupérer et synchroniser
git fetch origin
git pull origin main

# Configurer main comme branche par défaut
git remote set-head origin main
git branch --set-upstream-to=origin/main main
```

#### Mise à jour du dépôt sur Infomaniak

```bash
# Se connecter en SSH puis aller dans le dossier du site
cd sites/odillon.fr

# Si le pull échoue à cause de fichiers locaux modifiés (ex: package-lock.json)
git checkout -- package-lock.json

# Récupérer les dernières modifications
git pull origin main

# Réinstaller les dépendances
npm install

# Rebuilder
npm run build

# Redémarrer l'application
pm2 restart odillon-site
```

> **Astuce** : Si `git pull` échoue avec l'erreur "Your local changes would be overwritten by merge", c'est généralement `package-lock.json` qui a été modifié par un `npm install` sur le serveur. Lancez `git checkout -- package-lock.json` avant le pull pour résoudre le conflit.

**Note** : Pour changer la branche par défaut sur GitHub, allez dans **Settings > Branches > Default branch** et sélectionnez `main`.

## Fonctionnalités

- ✅ Design ultra professionnel et moderne
- ✅ Animations subtiles et performantes
- ✅ Responsive sur tous les devices
- ✅ Navigation fluide avec scroll smooth
- ✅ Formulaire de contact
- ✅ SEO optimisé
- ✅ Performance optimisée

## 📚 Documentation

La documentation complète du projet se trouve dans le dossier [`docs/`](./docs/) :

- 📖 **[Index de la documentation](./docs/INDEX_DOCUMENTATION.md)** - Point d'entrée complet
- 👋 **[Lisez en premier](./docs/LIRE_EN_PREMIER.md)** - Guide de démarrage rapide
- 🚀 **[Démarrage rapide](./docs/DEMARRAGE_RAPIDE.md)** - Pour démarrer immédiatement
- 🎉 **[Présentation](./docs/PRESENTATION.md)** - Vue d'ensemble du projet
- ✨ **[Fonctionnalités](./docs/FONCTIONNALITES.md)** - Liste détaillée des features
- 📘 **[Guide d'utilisation](./docs/GUIDE_UTILISATION.md)** - Guide complet

## Structure du projet

```
├── app/                    # Pages Next.js (App Router)
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/
│   ├── layout/            # Composants de structure (Header, Footer)
│   ├── magicui/          # Composants d'animation
│   ├── sections/         # Sections de la page
│   └── ui/               # Composants shadcn/ui
├── lib/
│   └── utils.ts          # Utilitaires
├── docs/                  # Documentation complète
├── scripts/               # Scripts utilitaires
└── public/               # Fichiers statiques
```

## Domaines d'expertise

1. **Gouvernance** - Structuration et règles de bonne gouvernance
2. **Juridique** - Service juridique externalisé complet
3. **Finances** - Conseil financier et levée de fonds
4. **Capital Humain** - Administration et ressources humaines
5. **Formations** - Master Class, coaching, formations en ligne
6. **Communication** - Institutionnelle, digitale, de crise, médiatique

## Contact

- **Téléphone** : +241 11 74 75 74
- **Email** : contact@odillon.fr
- **Adresse** : BP- 13262 Libreville, Gabon
- **Site web** : www.odillon.fr

## License

Le contenu de ce site est protégé par le droit d'auteur et est la propriété exclusive de Odillon - Ingénierie d'Entreprises, sauf mention contraire.

Toute reproduction, distribution ou utilisation partielle ou totale des contenus (textes, images, code source, graphismes, logos, etc.) sans autorisation écrite préalable de Odillon est strictement interdite.

© 2025 Odillon - Ingénierie d'Entreprises. Tous droits réservés.