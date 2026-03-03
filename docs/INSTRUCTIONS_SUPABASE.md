# 🚀 CONFIGURATION SUPABASE - PROCHAINES ÉTAPES

## ✅ Étape 1 : Configuration .env.local - TERMINÉ !

Votre fichier `.env.local` a été créé avec vos clés Supabase.

---

## 📋 Étape 2 : Créer la base de données

### **Que faire maintenant :**

1. **Allez sur votre dashboard Supabase**
   ```
   https://app.supabase.com
   ```

2. **Ouvrez votre projet** : `odillon-cabinet`

3. **Allez dans SQL Editor**
   - Cliquez sur l'icône 🔍 **"SQL Editor"** dans le menu de gauche

4. **Créez une nouvelle requête**
   - Cliquez sur **"New query"**

5. **Copiez le contenu du fichier schema**
   - Ouvrez le fichier : `supabase/schema.sql`
   - Sélectionnez TOUT le contenu (Ctrl+A)
   - Copiez (Ctrl+C)

6. **Collez dans l'éditeur SQL**
   - Retournez dans Supabase SQL Editor
   - Collez le code (Ctrl+V)

7. **Exécutez la requête**
   - Cliquez sur **"Run"** (ou appuyez sur F5)
   - Attendez quelques secondes
   - Vous devriez voir : **"Success. No rows returned"**

---

## 👤 Étape 3 : Créer votre compte administrateur

1. **Dans Supabase, allez dans Authentication**
   - Cliquez sur 👤 **"Authentication"** dans le menu

2. **Allez dans Users**
   - Cliquez sur **"Users"**

3. **Ajoutez un utilisateur**
   - Cliquez sur **"Add user"** en haut à droite
   - Sélectionnez **"Create new user"**

4. **Remplissez le formulaire**
   ```
   Email : votre-email@odillon.com
   Password : [CHOISISSEZ UN MOT DE PASSE FORT - min 8 caractères]
   Auto Confirm User : ✅ COCHEZ CETTE CASE (important!)
   ```

5. **Créez l'utilisateur**
   - Cliquez sur **"Create user"**

---

## 🔗 Étape 4 : Configurer les URLs de redirection

1. **Authentication > URL Configuration**

2. **Dans "Redirect URLs", ajoutez** :
   ```
   http://localhost:3000/auth/callback
   ```

3. **Cliquez sur "Save"**

---

## 🧪 Étape 5 : Tester !

1. **Redémarrez votre serveur de développement**
   ```bash
   # Si le serveur tourne, arrêtez-le (Ctrl+C)
   # Puis relancez :
   npm run dev
   ```

2. **Allez sur la page de login**
   ```
   http://localhost:3000/admin/login
   ```

3. **Connectez-vous**
   - Email : celui que vous avez créé
   - Password : celui que vous avez choisi

4. **Vérifiez l'accès**
   - Vous devriez être redirigé vers : `/admin/photos`
   - ✅ Si vous y êtes, c'est bon !

---

## 🎉 Une fois tout configuré

Vous pourrez :
- ✅ Gérer vos photos via l'interface admin
- ✅ Uploader de nouvelles photos
- ✅ Organiser par mois et thématiques
- ✅ Activer/désactiver des photos

---

## 🐛 En cas de problème

### **Erreur "Invalid API key"**
- Vérifiez que le serveur a bien redémarré
- Vérifiez le fichier `.env.local` (pas d'espaces en trop)

### **Impossible de se connecter**
- Vérifiez que "Auto Confirm User" était coché
- Sinon, retournez dans Users, cliquez sur l'utilisateur, et cochez "Email Confirmed"

### **Erreur SQL**
- Vérifiez que vous avez copié TOUT le contenu de `schema.sql`
- Essayez de ré-exécuter la requête

### **Redirection ne marche pas**
- Vérifiez que vous avez bien ajouté l'URL dans "Redirect URLs"
- Format exact : `http://localhost:3000/auth/callback`

---

## 📞 Besoin d'aide ?

Consultez les fichiers :
- `DEMARRAGE_RAPIDE_SUPABASE.md` - Guide détaillé
- `SUPABASE_SETUP.md` - Configuration complète

---

## ✅ Checklist

- [x] Fichier .env.local créé avec vos clés
- [ ] Base de données créée (schema.sql exécuté)
- [ ] Compte admin créé
- [ ] URLs de redirection configurées  
- [ ] Test de connexion réussi

---

**Une fois ces étapes terminées, votre système sera 100% opérationnel !** 🚀

