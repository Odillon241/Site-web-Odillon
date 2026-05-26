# Spécification Design : Section 8 Pôles d'Accompagnement (Option A : Bento Grid Éditoriale)

## Vision
Transformer la grille standard des 8 pôles en une structure "Bento Grid" dynamique et haut de gamme, inspirée des magazines économiques modernes. L'objectif est de briser la monotonie visuelle tout en conservant une lisibilité parfaite des informations.

## Architecture Visuelle
- **Mise en page** : Utilisation de `display: grid` avec des portées de colonnes/lignes variables (`grid-column: span X`).
- **Hiérarchie** : Les pôles "Gouvernance" et "Juridique" (ou selon importance) occupent des surfaces plus grandes pour créer un point focal.
- **Typographie de fond** : Intégration de chiffres massifs ou de mots-clés en arrière-plan avec une opacité très faible (2-3%) pour ajouter de la texture.

## Composants & Interactions
- **Cartes Bento** :
  - Fond blanc pur avec bordures extrêmement fines.
  - Typographie : Titres en Baskerville pour l'élégance, corps en Sans-serif pour la clarté.
  - Hover : Effet de soulèvement minimaliste et changement subtil de la couleur de l'icône.
- **Micro-interactions** :
  - Staggered reveal (apparition en cascade) lors du scroll.
  - Infobulles ou expansion légère pour les détails secondaires (prestations/points).

## Adaptabilité (Responsive)
- **Desktop** : Grille asymétrique complexe.
- **Tablette** : Simplification vers une grille 2x4 plus régulière mais conservant des hauteurs variables.
- **Mobile** : Passage en colonne unique avec des cartes de hauteurs différentes pour garder le rythme visuel.

## Accessibilité
- Contrastes respectant les normes WCAG.
- Navigation au clavier préservée (Focus states clairs).
- Lecteurs d'écran : Structure logique maintenue malgré l'asymétrie visuelle.
