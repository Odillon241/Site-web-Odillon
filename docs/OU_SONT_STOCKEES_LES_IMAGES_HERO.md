# 📍 Où sont Stockées les Images du Hero ?

## 🎯 Résumé Rapide

Les images qui défilent dans le Hero peuvent provenir de **deux sources différentes** :

### 1. ✅ Images Téléversées (Prioritaires)
- **Stockage** : Supabase Storage (bucket `hero-photos`)
- **Base de données** : Table `photos` dans Supabase
- **Gestion** : Via la page `/admin/photos`
- **Priorité** : Ces images remplacent les images par défaut si elles existent

### 2. ⚠️ Images par Défaut (Fallback)
- **Stockage** : Directement dans le code source
- **Fichier** : `components/sections/hero.tsx` (lignes 22-31)
- **Source** : URLs Unsplash (`images.unsplash.com`)
- **Utilisation** : Uniquement si aucune photo téléversée n'est active

---

## 🔍 Comment Vérifier Quelles Images sont Affichées ?

### Option 1 : Via l'Interface Admin (Recommandé)

1. Connectez-vous à `/admin/photos`
2. Faites défiler jusqu'à la section **"Images Actuellement Affichées dans le Hero"**
3. Vous verrez :
   - Le nombre d'images chargées
   - Leur source (Supabase ou Code)
   - Des miniatures de chaque image
   - Les URLs complètes

### Option 2 : Via la Console du Navigateur

1. Ouvrez la console du navigateur (F12)
2. Rechargez la page d'accueil
3. Cherchez les messages :
   - `✅ X photo(s) chargée(s) pour le Hero` → Images depuis Supabase
   - `ℹ️ Aucune photo active trouvée, utilisation des images par défaut` → Images par défaut

---

## 📦 Détails du Stockage

### Supabase Storage

**Bucket** : `hero-photos`
- **Type** : Public (accessible sans authentification)
- **URL de base** : `https://[PROJECT_ID].supabase.co/storage/v1/object/public/hero-photos/`
- **Gestion** : Via l'interface Supabase ou l'API `/api/upload`

**Exemple d'URL** :
```
https://xqkaraihiqqfcasmduuh.supabase.co/storage/v1/object/public/hero-photos/1764678755322-Gh_gnonga_village_2.png
```

### Base de Données

**Table** : `photos`
- **Colonnes principales** :
  - `id` : Identifiant unique
  - `url` : URL complète de l'image (Supabase Storage ou externe)
  - `description` : Description/texte alternatif
  - `month` : Mois associé (1-12 ou NULL pour toute l'année)
  - `is_active` : Statut actif/inactif
  - `display_order` : Ordre d'affichage
  - `theme_id` : Thématique associée

**Requête pour voir les photos actives** :
```sql
SELECT id, url, description, month, is_active, display_order 
FROM photos 
WHERE is_active = true 
ORDER BY display_order ASC;
```

### Code Source

**Fichier** : `components/sections/hero.tsx`

**Constante** : `DEFAULT_IMAGES` (lignes 22-31)

**Contenu** : 8 URLs Unsplash avec descriptions

**Exemple** :
```typescript
const DEFAULT_IMAGES = [
  { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&q=85", alt: "Équipe professionnelle africaine en réunion" },
  // ... 7 autres images
]
```

---

## 🔄 Logique de Chargement

Le composant Hero suit cette logique :

1. **Au chargement** : Initialise avec les images par défaut
2. **Requête API** : Appelle `/api/photos?active=true`
3. **Filtrage** : Garde uniquement :
   - Photos du mois en cours (`month = mois actuel`)
   - Photos sans mois spécifique (`month = NULL`)
4. **Remplacement** : Si des photos sont trouvées, remplace les images par défaut
5. **Rafraîchissement** : Recharge automatiquement toutes les 30 secondes

---

## 🛠️ Comment Gérer les Images

### Ajouter une Image

1. Allez sur `/admin/photos`
2. Cliquez sur "Choose File"
3. Sélectionnez votre image
4. Ajoutez une description
5. Choisissez le mois (ou laissez vide pour toute l'année)
6. Cliquez sur "Upload"
7. ✅ L'image apparaît dans le Hero sous 30 secondes

### Supprimer une Image

1. Allez sur `/admin/photos`
2. Survolez l'image à supprimer
3. Cliquez sur l'icône poubelle
4. Confirmez
5. ✅ L'image est supprimée de Supabase Storage ET de la base de données

### Désactiver une Image (sans la supprimer)

1. Allez sur `/admin/photos`
2. Survolez l'image
3. Cliquez sur l'icône œil
4. ✅ L'image est désactivée mais reste stockée

### Modifier les Images par Défaut

1. Ouvrez `components/sections/hero.tsx`
2. Modifiez le tableau `DEFAULT_IMAGES` (lignes 22-31)
3. Remplacez les URLs Unsplash par vos propres URLs
4. Sauvegardez et redémarrez le serveur

---

## 📊 Statistiques Actuelles

Pour voir quelles images sont actuellement affichées :

1. **Via l'admin** : Section "Images Actuellement Affichées dans le Hero"
2. **Via Supabase** : Requête SQL ci-dessus
3. **Via le code** : Vérifiez `DEFAULT_IMAGES` dans `hero.tsx`

---

## ⚠️ Notes Importantes

- Les images par défaut sont **toujours disponibles** en fallback
- Si vous téléversez des images, elles **remplacent** les images par défaut
- Les images sont **toujours filtrées par mois** (sauf celles avec `month = NULL`)
- Le rechargement automatique se fait **toutes les 30 secondes**
- Les images doivent être **actives** (`is_active = true`) pour s'afficher

---

## 🔗 Liens Utiles

- **Interface Admin** : http://localhost:3000/admin/photos
- **Dashboard Supabase** : https://app.supabase.com
- **Storage Supabase** : Storage > hero-photos
- **Base de données** : Table Editor > photos
