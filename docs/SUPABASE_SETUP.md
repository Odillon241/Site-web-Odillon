# 🚀 CONFIGURATION SUPABASE

## Étapes d'installation

### 1. Créer un projet Supabase

1. Allez sur https://supabase.com
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez :
   - **Project name** : odillon-cabinet
   - **Database password** : (choisissez un mot de passe fort)
   - **Region** : choisissez le plus proche (ex: West EU - Ireland)
5. Cliquez sur "Create new project"
6. Attendez ~2 minutes que le projet soit prêt

### 2. Récupérer les clés

1. Dans votre projet, allez dans **Settings** (⚙️) > **API**
2. Copiez :
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** key
   - **service_role** key (cliquez sur "Reveal" pour la voir)

### 3. Créer le fichier .env.local

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key-ici
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key-ici
ADMIN_EMAIL=votre-email@odillon.com
```

⚠️ **Important** : Ne commitez JAMAIS ce fichier ! Il est déjà dans `.gitignore`.

### 4. Créer la base de données

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur "New query"
3. Copiez tout le contenu de `supabase/schema.sql`
4. Collez et cliquez sur "Run"
5. Vérifiez qu'il n'y a pas d'erreurs

### 5. Configurer le Storage

1. Allez dans **Storage**
2. Vérifiez que le bucket `hero-photos` a été créé
3. Si non, créez-le manuellement :
   - Nom : `hero-photos`
   - Public : ✅ Oui
   - Allowed MIME types : image/jpeg, image/png, image/webp

### 6. Créer votre compte admin

1. Allez dans **Authentication** > **Users**
2. Cliquez sur "Add user" > "Create new user"
3. Remplissez :
   - **Email** : votre-email@odillon.com
   - **Password** : (choisissez un mot de passe fort)
   - **Auto Confirm User** : ✅ Oui
4. Cliquez sur "Create user"

### 7. Configurer l'authentification

1. Allez dans **Authentication** > **Providers**
2. Activez "Email" si ce n'est pas déjà fait
3. Dans **Email Templates**, personnalisez si besoin
4. Dans **URL Configuration**, ajoutez :
   - **Site URL** : http://localhost:3000 (développement)
   - **Redirect URLs** : 
     - http://localhost:3000/auth/callback
     - https://votre-domaine.com/auth/callback (production)

### 8. Tester la connexion

```bash
npm run dev
```

Allez sur http://localhost:3000/admin/login

---

## Structure de la base de données

### Table `photos`

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | ID unique |
| src | TEXT | URL de la photo |
| alt | TEXT | Texte alternatif |
| theme | TEXT | ID de la thématique (nullable) |
| month | INTEGER | Mois (1-12, nullable) |
| year | INTEGER | Année (nullable) |
| active | BOOLEAN | Photo active ? |
| order | INTEGER | Ordre d'affichage |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de modification |
| created_by | UUID | ID de l'utilisateur créateur |

### Table `photo_themes`

| Colonne | Type | Description |
|---------|------|-------------|
| id | TEXT | ID unique (slug) |
| name | TEXT | Nom affiché |
| description | TEXT | Description |
| color | TEXT | Code couleur hex |
| month | INTEGER | Mois associé |
| start_date | DATE | Date de début (nullable) |
| end_date | DATE | Date de fin (nullable) |
| active | BOOLEAN | Thématique active ? |
| created_at | TIMESTAMP | Date de création |

---

## Sécurité (Row Level Security)

### Politiques activées

**Photos** :
- ✅ Lecture publique des photos actives (anonyme)
- ✅ Lecture complète pour utilisateurs authentifiés
- ✅ CRUD complet pour utilisateurs authentifiés

**Storage** :
- ✅ Lecture publique des fichiers
- ✅ Upload uniquement pour authentifiés
- ✅ Suppression uniquement pour authentifiés

---

## Commandes utiles

### Redémarrer le serveur
```bash
npm run dev
```

### Vérifier la connexion Supabase
```bash
npm run test:supabase
```

### Voir les logs Supabase
Dans le dashboard : **Logs** > **Postgres Logs**

---

## Dépannage

### Erreur "Invalid API key"
- Vérifiez que les clés dans `.env.local` sont correctes
- Redémarrez le serveur (`Ctrl+C` puis `npm run dev`)

### Erreur "Permission denied"
- Vérifiez que vous êtes connecté en tant qu'admin
- Vérifiez les politiques RLS dans Supabase

### Photos ne s'affichent pas
- Vérifiez que le bucket est public
- Vérifiez les politiques Storage
- Vérifiez l'URL des photos dans la base

---

## URLs importantes

- **Dashboard** : https://app.supabase.com
- **Documentation** : https://supabase.com/docs
- **Admin local** : http://localhost:3000/admin/photos
- **Login** : http://localhost:3000/admin/login

---

**Prochaine étape** : Créer les pages de login et l'API

