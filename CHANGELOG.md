# Changelog

Toutes les modifications notables de ce projet sont documentees dans ce fichier.

Le format est base sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhere au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.2.0] - 2025-03-19

### Added

- **Nouveaux services** : Entreprenariat et Paie ajoutees aux offres
- **Architecture modulaire des services** : nouveau dossier `lib/services/` avec un fichier par service (gouvernance, juridique, finances, ressources-humaines, formations, communication, entreprenariat, paie)
- **Systeme de types services** : `lib/services/types.ts` centralise les types ServiceData
- **Pages dynamiques sous-services** : route `/offres/[serviceId]/[slug]` pour les pages detaillees de chaque sous-service
- **Composant SubServicePage** : `components/sections/sub-service-page.tsx` pour l'affichage des sous-services
- **Extraction couleur dominante** : LogosTab extrait automatiquement la couleur dominante des logos via Canvas
- **Mode edition logos** : edition inline des logos (nom, URL, couleur) dans l'admin
- **Apercu image logos** : preview des logos avec gestion des erreurs dans l'admin
- **Script migration logos** : `scripts/migrate-logos-to-bucket.mjs` pour migrer les logos vers le bucket Supabase

### Changed

- **Refonte routing** : `/services/` renomme en `/offres/` (navigation, header, footer, liens internes)
- **Navigation** : header et footer mis a jour avec les nouveaux liens `/offres/*` et les 2 nouveaux services
- **services-data.ts** : simplifie en re-exportant depuis `lib/services/index.ts` (suppression du monolithe de donnees)
- **ServicesDetailed** : refactoring du composant pour utiliser la nouvelle architecture modulaire
- **ServiceSingle** : mise a jour pour fonctionner avec le nouveau systeme de donnees
- **ServicesHome** : adaptation aux nouvelles routes `/offres/`
- **ExpertiseCtasTab** : corrections mineures
- **next.config.js** : ajout de configurations supplementaires

### Removed

- **Pages services statiques** : suppression des pages individuelles `/services/gouvernance`, `/services/juridique`, `/services/finances`, `/services/ressources-humaines`, `/services/formations`, `/services/communication`
- **Page index services** : suppression de `/services/page.tsx`

## [1.1.0] - 2025-02-15

### Added

- Mise a jour contenu valide par Mme Nathalie
- 6 services complets (Gouvernance, Juridique, Finances, Capital Humain, Formations, Communication)
- Refonte des heros (services, contact, a-propos)
- Composants admin, API settings et corrections globales
- Systeme de blog avec flux RSS
- Phototheque et gestion des photos par themes mensuels
- Calendrier des jours feries gabonais

## [1.0.0] - 2025-01-15

### Added

- Structure initiale du site web Odillon
- Pages principales (accueil, services, contact, a-propos)
- Interface d'administration des photos
- Integration Supabase (auth, database, storage)
- Design responsive avec Tailwind CSS et shadcn/ui
- Animations Framer Motion
- Multi-domaine avec proxy Next.js
