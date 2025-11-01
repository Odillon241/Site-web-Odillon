# 🚀 DÉMARRAGE RAPIDE - SUPABASE

## 🎯 OBJECTIF

Mettre en place votre système de gestion de photos en 15 minutes.

---

## ✅ ÉTAPE PAR ÉTAPE

### **1️⃣ Créer le projet Supabase** (5 min)

1. Allez sur **https://supabase.com**
2. Créez un compte (GitHub recommandé)
3. Cliquez sur **"New Project"**
4. Remplissez :
   ```
   Project name : odillon-cabinet
   Database password : [CHOISISSEZ UN MOT DE PASSE FORT]
   Region : West EU (Ireland)
   ```
5. Cliquez sur **"Create new project"**
6. ⏳ Attendez ~2 minutes

### **2️⃣ Récupérer vos clés** (2 min)

1. Dans votre projet Supabase, cliquez sur **⚙️ Settings**
2. Allez dans **API**
3. Copiez ces 3 valeurs :
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** key (visible directement)
   - **service_role** key (cliquez sur "Reveal")

### **3️⃣ Configurer Next.js** (2 min)

1. **Créez le fichier `.env.local`** à la racine de votre projet :

```bash
# Dans le terminal
touch .env.local
```

2. **Ouvrez `.env.local`** et collez (remplacez par vos vraies valeurs) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_EMAIL=votre-email@odillon.com
```

3. **Sauvegardez** le fichier

### **4️⃣ Créer la base de données** (3 min)

1. Dans Supabase, allez dans **🔍 SQL Editor**
2. Cliquez sur **"New query"**
3. Ouvrez le fichier `supabase/schema.sql` de votre projet
4. **Copiez TOUT le contenu** (Ctrl+A, Ctrl+C)
5. **Collez** dans l'éditeur SQL de Supabase
6. Cliquez sur **"Run"** (ou F5)
7. ✅ Vérifiez qu'il n'y a pas d'erreurs (vous devriez voir "Success")

### **5️⃣ Créer votre compte admin** (2 min)

1. Dans Supabase, allez dans **👤 Authentication**
2. Cliquez sur **"Users"**
3. Cliquez sur **"Add user"** > **"Create new user"**
4. Remplissez :
   ```
   Email : votre-email@odillon.com
   Password : [CHOISISSEZ UN MOT DE PASSE FORT]
   Auto Confirm User : ✅ OUI (important !)
   ```
5. Cliquez sur **"Create user"**

### **6️⃣ Configurer les URLs de redirection** (1 min)

1. Dans Supabase, **Authentication** > **URL Configuration**
2. Ajoutez dans **"Redirect URLs"** :
   ```
   http://localhost:3000/auth/callback
   ```
3. Cliquez sur **"Save"**

### **7️⃣ Tester !** (2 min)

1. **Redémarrez le serveur** :
   ```bash
   # Arrêtez avec Ctrl+C
   npm run dev
   ```

2. **Allez sur** :
   ```
   http://localhost:3000/admin/login
   ```

3. **Connectez-vous** avec l'email et mot de passe que vous avez créés

4. ✅ **Vous devriez arriver sur** `/admin/photos` !

---

## 🎉 C'EST PRÊT !

Vous pouvez maintenant :
- ✅ Vous connecter à l'admin
- ✅ Gérer les photos (interface en cours)
- ✅ Upload des images
- ✅ Organiser par mois et thématiques

---

## 🐛 PROBLÈMES FRÉQUENTS

### **❌ "Invalid API key"**

**Solution** :
1. Vérifiez que `.env.local` est à la racine
2. Vérifiez qu'il n'y a pas d'espaces avant/après les clés
3. Redémarrez le serveur (`Ctrl+C` puis `npm run dev`)

### **❌ "Email not confirmed"**

**Solution** :
1. Allez dans Supabase > Authentication > Users
2. Trouvez votre utilisateur
3. Cliquez dessus
4. Cochez **"Email Confirmed"** si ce n'est pas fait

### **❌ "Permission denied"**

**Solution** :
1. Vérifiez que le schema.sql a bien été exécuté
2. Allez dans **Database** > **Tables**
3. Vous devriez voir `photos` et `photo_themes`

### **❌ Page blanche sur /admin/photos**

**Solution** :
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs
3. Vérifiez que vous êtes bien connecté

---

## 📞 AIDE

### **Logs Supabase**

Pour voir ce qui se passe :
1. Supabase > **Logs**
2. Sélectionnez **"Postgres Logs"** ou **"API Logs"**

### **Tester manuellement**

Dans la console du navigateur (F12) :

```javascript
// Vérifier la connexion
const response = await fetch('/api/photos')
const data = await response.json()
console.log(data)
```

---

## 📁 FICHIERS IMPORTANTS

| Fichier | Description |
|---------|-------------|
| `.env.local` | ⚠️ VOS CLÉS (ne jamais commiter) |
| `supabase/schema.sql` | Schéma de base de données |
| `app/admin/login/page.tsx` | Page de connexion |
| `app/admin/photos/page.tsx` | Interface de gestion |
| `app/api/photos/route.ts` | API photos |
| `app/api/upload/route.ts` | API upload |

---

## ⏭️ APRÈS L'INSTALLATION

1. **Testez l'upload** :
   - La fonctionnalité sera disponible dans l'interface admin

2. **Ajoutez vos vraies photos** :
   - Remplacez les photos Unsplash
   - Organisez par mois (ex: Novembre pour Novembre Bleu)

3. **Créez d'autres admins** si besoin :
   - Supabase > Authentication > Users > "Add user"

4. **Configurez les sauvegardes** (recommandé) :
   - Supabase fait des backups automatiques
   - Vous pouvez aussi exporter manuellement

---

## 🎓 POUR ALLER PLUS LOIN

### **Personnaliser les thématiques**

Éditez `lib/photo-themes.ts` :
```typescript
{
  id: "ma-thematique",
  name: "Ma Thématique",
  color: "#FF5733",
  month: 3
}
```

### **Changer l'email admin**

Dans `.env.local` :
```env
ADMIN_EMAIL=nouveau-email@odillon.com
```

### **Voir les statistiques**

Supabase > **Reports** > Usage statistics

---

## ✅ CHECKLIST

Avant de continuer :

- [ ] Projet Supabase créé
- [ ] Clés copiées dans `.env.local`
- [ ] Base de données créée (schema.sql exécuté)
- [ ] Compte admin créé
- [ ] URLs de redirection configurées
- [ ] Connexion à /admin/login fonctionne
- [ ] Accès à /admin/photos OK

---

**Temps total** : ~15 minutes  
**Difficulté** : 🟢 Facile  
**Support** : https://supabase.com/docs

**🎉 Félicitations ! Votre système est opérationnel !**

