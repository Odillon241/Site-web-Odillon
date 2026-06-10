# Calendrier de formations — Spécification de conception

**Date :** 2026-06-10
**Statut :** Validé (en attente de relecture utilisateur)

## Contexte

Le site Odillon propose une offre de service « Formations » (`/offres/formations`).
On souhaite ajouter une **nouvelle page publique** présentant le **calendrier des
sessions de formation** à venir, alimentée en base de données et **gérée depuis le
panneau d'administration**.

Cette fonctionnalité est **distincte** de l'onglet « Calendrier » existant de l'admin,
qui affiche un calendrier statique des événements/jours fériés du Gabon
(`lib/gabon-events.ts`, en lecture seule). Aucun chevauchement.

## Choix validés avec l'utilisateur

- **Présentation publique :** vue calendrier mensuel **+** liste détaillée
- **Inscription :** bouton « S'inscrire » renvoyant vers la page contact
  (aucun inscrit stocké en base)
- **Champs :** titre, dates, description (obligatoires) + horaires/durée, formateur,
  lieu + modalité
- **Emplacement :** page `/calendrier-formations`
- **Accès :** lien dans le **header** (menu de navigation), dans le **footer**, et
  bouton « Voir le calendrier » sur `/offres/formations`

## Approche retenue

Suivre le **pattern CRUD existant du projet** (utilisé pour équipe, témoignages,
vidéos, logos) : table Supabase + routes API + onglet admin + page publique.
Approches rejetées : étendre le calendrier statique du Gabon (lecture seule, codé en
dur) ; détourner la table `articles` (force le schéma).

---

## 1. Base de données — table `formations`

Migration appliquée via le **MCP Supabase** (`project_id: xqkaraihiqqfcasmduuh`),
nom `create_formations_table`.

| Colonne | Type | Contraintes / défaut |
|---|---|---|
| `id` | uuid | PK, `default gen_random_uuid()` |
| `titre` | text | **NOT NULL** |
| `description` | text | **NOT NULL** |
| `date_debut` | date | **NOT NULL** |
| `date_fin` | date | nullable (formations multi-jours) |
| `horaires` | text | nullable, ex. « 9h–17h » |
| `duree` | text | nullable, ex. « 2 jours » |
| `formateur` | text | nullable |
| `lieu` | text | nullable, ex. « Libreville » |
| `modalite` | text | nullable, valeurs : `presentiel` / `distanciel` / `hybride` |
| `is_active` | boolean | NOT NULL, `default true` |
| `created_by` | uuid | nullable, réf. `auth.users(id)` |
| `created_at` | timestamptz | NOT NULL, `default now()` |

### Row Level Security

RLS activé, identique aux autres tables du projet :

- **Lecture publique** des formations actives (`is_active = true`) — rôles `anon` et
  `authenticated`.
- **CRUD complet** réservé aux utilisateurs authentifiés (`auth.role() = 'authenticated'`).

## 2. API — `app/api/formations/`

Même pattern d'authentification que `app/api/team/route.ts`.

### `route.ts`
- `GET` : retourne toutes les formations, triées par `date_debut` ascendant.
  Filtre optionnel `?active=true` (n'expose que les actives) pour la page publique.
- `POST` : crée une formation. **Auth requise** (`supabase.auth.getUser()`, 401 sinon).
  Valide la présence de `titre`, `description`, `date_debut`.

### `[id]/route.ts`
- `PATCH` : met à jour une formation. **Auth requise.**
- `DELETE` : supprime une formation. **Auth requise.**

Clients Supabase : `lib/supabase/server.ts` (route handlers async cookies).

## 3. Administration — onglet « Formations »

### `components/admin/tabs/FormationsTab.tsx`
Composant client calqué sur `TeamTab.tsx` :
- Liste des formations existantes (titre, date, modalité, statut actif).
- Formulaire d'ajout / d'édition dans un `Dialog` :
  titre, description, date début, date fin, horaires, durée, formateur, lieu,
  modalité (select), case « Actif ».
- Actions : créer, éditer, activer/désactiver, supprimer (avec confirmation).
- Appelle les routes `/api/formations` et `/api/formations/[id]`.

### Intégration au dashboard
- `app/admin/settings/page.tsx` : import + montage `{activeTab === 'formations' && <FormationsTab />}`,
  ajout au mapping `getTabLabel` (`formations: "Formations"`).
- `components/admin/admin-sidebar.tsx` : entrée
  `{ title: "Formations", icon: GraduationCap, value: "formations" }` dans le
  groupe **Contenu**.
- (Optionnel) carte de statistique sur le tableau de bord — non bloquant.

## 4. Page publique — `/calendrier-formations`

### `app/calendrier-formations/page.tsx`
Server Component :
- Récupère les formations actives via le client serveur Supabase (tri par `date_debut`).
- Métadonnées SEO (titre/description en français).
- Respecte le header fixe : padding `pt-[88px] md:pt-[104px]`.
- Rend `<FormationsCalendar formations={...} />`.

### `components/sections/formations-calendar.tsx`
Client Component :
- **En-tête de page** : titre + intro (charte `odillon-teal` / `odillon-lime`).
- **Vue calendrier mensuel** : réutilise `components/ui/calendar.tsx`
  (`react-day-picker`), surligne les jours possédant au moins une formation
  (`modifiers` / `modifiersStyles`). Clic sur un jour → filtre/scroll vers les
  formations de ce jour.
- **Liste de cartes** sous le calendrier : pour chaque formation — titre, dates
  formatées en français, horaires/durée, lieu + modalité, formateur, description,
  et bouton **« S'inscrire »**.
- Bouton « S'inscrire » : lien vers `/contact` (avec, si simple, un paramètre
  `?formation=<titre>` pour pré-contextualiser ; sinon lien simple vers `/contact`).
- État vide géré (« Aucune formation programmée pour le moment »).
- Support `prefers-reduced-motion` pour les animations Framer Motion (convention projet).

## 5. Navigation

- **Header** (`components/layout/header-pro.tsx`) : ajout d'une entrée
  `{ name: "Formations", href: "/calendrier-formations" }` dans le tableau
  `navigation`. Rendue automatiquement dans les vues desktop et mobile existantes.
- **Footer** (`components/layout/footer.tsx`) : lien
  « Calendrier des formations » → `/calendrier-formations`.
- **Page offre** (`/offres/formations`) : bouton « Voir le calendrier des formations ».

---

## Découpage de l'implémentation (ordre)

1. Migration table `formations` + RLS (MCP Supabase).
2. Routes API `app/api/formations/route.ts` et `app/api/formations/[id]/route.ts`.
3. Onglet admin `FormationsTab` + branchement dashboard + sidebar.
4. Page publique `/calendrier-formations` + composant `formations-calendar.tsx`.
5. Liens de navigation (header, footer, page offre formations).
6. Vérification : build, test manuel admin (CRUD) + page publique.

## Hors périmètre (YAGNI)

- Pas de formulaire d'inscription en ligne ni de table d'inscrits.
- Pas de gestion de tarif / places / catégorie (non retenus).
- Pas de paiement, pas de notifications e-mail automatiques.
- Pas de modification du calendrier statique des événements du Gabon.
