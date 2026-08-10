# Harmonisation éditoriale — site web ↔ Livret d'accueil

**Document de référence** : « Livret d'accueil du collaborateur », Cabinet ODILLON —
V1, édition réorganisée du **29 juillet 2026** (13 pages).
**Date du recensement** : 10 août 2026.

Le livret fait foi pour l'identité, les valeurs, la présentation du Cabinet et
l'organigramme. Ce document recense les écarts constatés sur le site, distingue
ce qui a été corrigé de ce qui demande un arbitrage, et rappelle les actions
restant à mener.

---

## 1. Écarts corrigés

### 1.1 Nos valeurs

| # | Écart constaté | Correction |
|---|---|---|
| V1 | **La Rigueur était absente** : le site n'affichait que 3 des 4 valeurs (Talent, Challenge, Proximité) | Les 4 valeurs du livret sont désormais affichées |
| V2 | Libellés tronqués : « Talent » au lieu de « **Le** Talent » | Libellés du livret, article compris |
| V3 | Descriptions divergentes, rédigées indépendamment du livret | Descriptions reprises **mot pour mot** du livret §1.2 |
| V4 | **Animaux totems absents** (dauphin, fourmi, aigle, éléphant) | Totem affiché en badge, comme dans le livret |
| V5 | **Mots-clés absents** (« Intelligence · agilité · esprit d'équipe »…) | Ajoutés sous chaque description |
| V6 | Chapeau générique (« Les principes qui guident chaque action… ») | Remplacé par la phrase du livret : « Notre performance repose sur quatre valeurs fondamentales… » |
| V7 | **Les valeurs étaient dupliquées en 4 exemplaires** dans le code, d'où la dérive | Source unique : [`lib/identite.ts`](../lib/identite.ts) |

### 1.2 Qui sommes-nous

| # | Écart constaté | Correction |
|---|---|---|
| Q1 | Accroche du site : « Fondée en mai 2017, ODILLON accompagne les entreprises dans leurs projets de conseil, d'ingénierie organisationnelle et d'optimisation de la performance. » — **l'audit et la gouvernance n'y figuraient pas**, alors que le livret en fait deux des trois spécialités | Accroche du livret §2.1 reprise à l'identique |
| Q2 | Mission centrée sur « l'efficacité opérationnelle » ; le livret vise les organisations **publiques et privées**, la **conformité** et la **structuration de la gouvernance** | Formulation du livret reprise |
| Q3 | **Repères chiffrés absents** (2017 · 05 pôles · Libreville) | Ajoutés sur `/a-propos` |
| Q4 | **Les 5 domaines d'intervention n'apparaissaient nulle part** | Ajoutés sur `/a-propos` |
| Q5 | Formule de synthèse du livret absente (« ODILLON est un partenaire stratégique qui aide les organisations à se structurer… ») | Ajoutée en exergue |
| Q6 | Section d'accueil intitulée « À propos » | Renommée « Qui sommes-nous », conformément au livret (ancre `#apropos` conservée) |

**Fichiers modifiés** : `lib/identite.ts` (nouveau), `components/sections/about-home.tsx`,
`components/sections/about-detailed.tsx`, `app/api/settings/route.ts`,
`components/admin/tabs/AboutTab.tsx`.

---

## 2. Point de vigilance : la surcharge en base

**Les valeurs enregistrées en base priment sur le code.** `about-detailed.tsx`
lit `about_values_json` depuis la table `site_settings` : une surcharge saisie
depuis l'administration masquerait les valeurs de référence.

**Vérifié le 10 août 2026** : l'appel à `/api/settings` renvoie bien les
4 valeurs du livret, ce qui confirme qu'aucune surcharge n'est enregistrée et
que les valeurs de référence s'appliquent. Le rendu des pages `/` et `/a-propos`
a été contrôlé (desktop, 1024 px et mobile).

Si l'environnement de production pointe sur une autre instance Supabase, refaire
ce contrôle après déploiement : administration → onglet **À propos**.

---

## 3. Écarts restants — arbitrage nécessaire

### 3.1 Organigramme — structure alignée, affectations à trancher

**Référence retenue** : « Organigramme structurel ODILLON — Février 2026 »,
fourni par la Direction. Il **prime sur le schéma du livret §2.3**, lequel
décrivait cinq pôles numérotés (Gouvernance, Conseil d'Administration, Risques
Opérationnels, Communication d'Entreprise, Juridique · Finances · Capital
Humain) qui n'ont plus cours. Le livret est à corriger sur ce point.

Structure désormais reproduite par le site :

```
Direction Générale
├── Département Technique
│   ├── Pôle Gestion du Capital Humain Clients
│   ├── Pôle Systèmes d'Information
│   └── Pôle Communication & RSE
├── Secrétariat Général
│   ├── Section Administration
│   ├── Section Comptabilité
│   └── Section Logistique
└── Pôle Formation · Pôle Audit, Qualité et Conformité · Pôle Juridique
```

Le repère « 05 pôles » de la page « Qui sommes-nous » a été porté à **06**, seul
chiffre compatible avec cet organigramme. À répercuter dans le livret.

**Reste à faire — affectations individuelles.** Les rattachements sont stockés
en base (colonne `pole` de `team_members`). Une correspondance transitoire
(`polesHerites`) traduit les anciens intitulés pour que personne ne disparaisse,
mais quatre situations demandent une décision RH avant migration :

| Membre | Rattachement actuel à l'écran | Point à trancher |
|---|---|---|
| Abigaël NFONO (Assistance Logistique) | Pôle Systèmes d'Information | Devrait vraisemblablement rejoindre la **Section Logistique** |
| Nadia TATY (Business Administrative & Client Relation) | Pôle Gestion du Capital Humain Clients | Hypothèse retenue par défaut, à confirmer |
| Boniface EGAWAN (Report & Training Facilitator / Backup IT) | *absent de l'organigramme* | Aucun pôle en base : Pôle Formation ? Systèmes d'Information ? |

Déjà tranchés :

- **Éliane FIOKLOU-TALE** — rattachée au **Département Technique**, avec
  l'intitulé « Chef de Département Technique ». Appliqué en base le 10 août 2026.
- **Vanessa MBOUMBA** (Assistante Audit) — **Pôle Audit, Qualité et Conformité** ;
  la correspondance avec l'ancien intitulé est directe.

Une fois ces choix arrêtés, la migration se fait soit depuis l'administration
(onglet Équipe, liste déroulante désormais alignée sur l'organigramme), soit par
une mise à jour de la colonne `pole`. La table `polesHerites` de
`lib/identite.ts` pourra alors être supprimée.

### 3.2 Offres et domaines d'expertise

Le site expose **4 offres** (Gouvernance, Juridique, Capital Humain, Formation).
Le livret décrit 5 pôles et **5 familles de missions** : Conseil & stratégie,
Transformation & pilotage de projets, Audit & maîtrise des risques, Gouvernance
& conformité, Croissance & expertise pluridisciplinaire.

Ni « Risques Opérationnels » ni « Communication d'Entreprise » n'apparaissent
dans l'offre commerciale. À noter : `lib/services/` contient déjà des fiches
`communication.ts`, `finances.ts`, `entreprenariat.ts` et `paie.ts` **non
branchées** dans `lib/services/index.ts` — un rapprochement est possible sans
tout réécrire.

### 3.3 Coordonnées

| Écart | Détail |
|---|---|
| **Second site absent** | Le livret mentionne un site à **Angondjé** et sa ligne fixe **+241 11 45 54 54**. Le site n'affiche que Libreville — Glass (footer et page contact) |
| **Adresse Gmail publique** | `odillon2017@gmail.com` figure dans le footer et la page contact. Le livret ne connaît que le domaine `@odillon.fr`. Question de cohérence de marque plus que d'exactitude |
| **Coordonnées GPS** | Livret : `0.3779878 / 9.4542272`. Site : `0.3780070 / 9.4543255` (lien Google Maps). Écart d'une quinzaine de mètres, à aligner sur le livret |
| **Horaires** | Le site annonce « lundi au vendredi, 8h-16h30 ». Le livret ne documente pas les horaires d'ouverture au public (seulement la pause déjeuner 12h30–13h30) — à faire confirmer |

### 3.4 Éléments de marque non repris

- La signature **« Together we ✍ the future ! »**, présente sur trois pages du
  livret, n'apparaît nulle part sur le site.
- Le gentilé **« les Odilliens »** (page de clôture du livret) n'est pas utilisé.
- **Baseline** : le livret retient « Ingénierie d'Entreprises · Conseil · Audit ·
  Gouvernance ». Le footer parle de « structuration et management stratégique »,
  et **l'audit est absent des métadonnées SEO** (`app/layout.tsx`) alors qu'il
  constitue l'un des trois axes revendiqués.

### 3.5 Contenu non sourcé

`components/sections/history-timeline.tsx` contient une frise avec des jalons
(2019 « Expansion », 2022 « Reconnaissance », 2024 « Innovation », 2026
« Excellence ») qui ne reposent sur aucune donnée du livret. **Ce fichier n'est
importé nulle part** — il s'agit de code mort. La frise réellement affichée ne
comporte que la fondation en 2017.

À décider : supprimer le fichier, ou documenter ces jalons dans le livret s'ils
correspondent à des faits réels.

### 3.6 Mentions légales

`app/mentions-legales/page.tsx` ne mentionne ni forme juridique, ni RCCM, ni NIF,
ni capital social, ni directeur de publication nommé. Le livret ne fournit pas
ces informations : elles sont à demander au Secrétariat Général.

---

## 4. Règle de fonctionnement

Les contenus institutionnels sont désormais centralisés dans
[`lib/identite.ts`](../lib/identite.ts) : valeurs, chapeau, accroche, mission,
repères chiffrés et domaines d'intervention. **Toute évolution de ces textes doit
être portée d'abord dans le livret**, puis répercutée dans ce fichier — et non
l'inverse, sous peine de voir les deux supports diverger à nouveau.
