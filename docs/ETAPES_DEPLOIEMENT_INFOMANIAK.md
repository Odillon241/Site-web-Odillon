# 🚀 Étapes de déploiement - Infomaniak Node.js

Guide ultra-simple pour déployer odillon.fr sur Infomaniak en 30 minutes.

---

## ✅ Avant de commencer

Assurez-vous d'avoir :
- [ ] Accès au [manager Infomaniak](https://manager.infomaniak.com)
- [ ] Vos identifiants Supabase (URL + clés API)
- [ ] FileZilla installé OU accès SSH

---

## 📋 ÉTAPE 1 : Créer le site Node.js sur Infomaniak (5 min)

### Dans le manager Infomaniak :

1. **Connectez-vous** sur [manager.infomaniak.com](https://manager.infomaniak.com)

2. **Allez dans la section Web** (menu de gauche)

3. **Cliquez sur "Créer un site avec Node.js"** (cadre avec badge "Nouveau")

4. **Configurez** :
   - **Domaine** : Sélectionnez `odillon.fr`
   - **Version Node.js** : Choisissez **Node.js 20** (ou 18 minimum)
   - **Nom du projet** : `odillon-site`

5. **Validez** et **notez ces informations** :
   ```
   Serveur FTP/SSH : ___________________________
   Utilisateur : ___________________________
   Chemin du site : ___________________________
   Port assigné : ___________________________
   ```

---

## 📦 ÉTAPE 2 : Préparer les fichiers localement (3 min)

### Dans votre terminal (dans le dossier du projet) :

```bash
# Aller dans le dossier du projet
cd "c:\Users\nexon\Odillon site web"

# Vérifier que tout est à jour
git status

# Builder le projet pour la production
npm run build

# Vérifier que le build a réussi
dir .next
```

Vous devez voir un dossier `.next` qui a été créé.

---

## 📤 ÉTAPE 3A : Upload via FTP (méthode simple - 15 min)

### Installer FileZilla (si pas déjà fait)

Téléchargez : [filezilla-project.org](https://filezilla-project.org)

### Se connecter

Dans FileZilla :
- **Hôte** : `ftp.odillon.fr` (ou l'adresse fournie à l'étape 1)
- **Utilisateur** : celui noté à l'étape 1
- **Mot de passe** : votre mot de passe Infomaniak
- **Port** : `21`

Cliquez sur **Connexion rapide**

### Créer le fichier .env.local sur votre ordinateur

1. **Copiez** le fichier `.env.production.example`
2. **Renommez-le** en `.env.production`
3. **Ouvrez-le** avec un éditeur de texte
4. **Remplacez** les valeurs par vos vraies clés Supabase :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-vrai-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-vraie-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-vraie-clé-service-role
ADMIN_EMAIL=admin@odillon.com
NEXT_PUBLIC_SITE_URL=https://odillon.fr
NODE_ENV=production
PORT=3000
```

**Où trouver vos clés Supabase ?**
1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez les clés

### Uploader les fichiers (dans l'ordre)

**Dans FileZilla, uploadez ces fichiers/dossiers** :

✅ **Fichiers de configuration** (uploadez en premier) :
1. `package.json`
2. `package-lock.json`
3. `next.config.js`
4. `.env.production` (renommez-le en `.env.local` après upload)
5. `ecosystem.config.js` (optionnel, pour PM2)

✅ **Dossiers du code source** :
6. `app/` (tout le dossier)
7. `components/` (tout le dossier)
8. `lib/` (tout le dossier)
9. `public/` (tout le dossier)
10. `.next/` (le dossier de build - IMPORTANT !)

✅ **Autres fichiers nécessaires** :
11. `middleware.ts`
12. `tailwind.config.ts`
13. `tsconfig.json`

❌ **NE PAS uploader** :
- `node_modules/` (trop lourd, on va installer sur le serveur)
- `.git/`
- `.env.local` (utilisez `.env.production`)
- Tous les fichiers `.md` (documentation)

---

## 🔧 ÉTAPE 3B : Upload via SSH/Git (méthode avancée - 10 min)

**Si vous avez accès SSH**, cette méthode est plus rapide.

### Se connecter en SSH

```bash
ssh votre-utilisateur@odillon.fr
# Ou l'adresse SSH fournie par Infomaniak
```

### Cloner et configurer

```bash
# Aller dans le dossier de votre site (chemin fourni à l'étape 1)
cd /chemin/vers/votre/site

# Cloner votre repo GitHub
git clone https://github.com/Danel2025/Site-web-Odillon.git .

# Créer le fichier de variables d'environnement
nano .env.local
```

Dans nano, copiez-collez :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
ADMIN_EMAIL=admin@odillon.com
NEXT_PUBLIC_SITE_URL=https://odillon.fr
NODE_ENV=production
PORT=3000
```

Puis :
- Appuyez sur `Ctrl + X`
- Tapez `Y` pour confirmer
- Appuyez sur `Entrée`

### Installer et builder

```bash
# Installer les dépendances
npm install

# Builder pour la production
npm run build
```

---

## ▶️ ÉTAPE 4 : Installer les dépendances (si FTP) (5 min)

### Si vous avez uploadé via FTP

Vous devez installer `node_modules` sur le serveur.

**Option A : Via l'interface Infomaniak**
- Cherchez un bouton "Terminal" ou "Console" dans l'interface
- Exécutez : `npm install`

**Option B : Via SSH**
```bash
ssh votre-utilisateur@odillon.fr
cd /chemin/vers/votre/site
npm install
```

---

## 🚀 ÉTAPE 5 : Démarrer l'application (2 min)

### Via l'interface Infomaniak (automatique)

Normalement, Infomaniak détecte `package.json` et démarre automatiquement avec `npm start`.

Vérifiez dans l'interface qu'il y a un statut **"Running"** ou **"Actif"**.

### Via SSH avec PM2 (si disponible)

```bash
# Installer PM2 (si pas déjà installé)
npm install -g pm2

# Démarrer l'application
pm2 start ecosystem.config.js

# Sauvegarder la configuration
pm2 save

# Configurer le démarrage automatique
pm2 startup
# Copiez et exécutez la commande affichée

# Vérifier que ça tourne
pm2 status
pm2 logs odillon-site
```

### Via SSH sans PM2

```bash
# Simplement démarrer
npm start

# Ou en arrière-plan avec nohup
nohup npm start > output.log 2>&1 &
```

---

## 🔒 ÉTAPE 6 : Configurer HTTPS/SSL (automatique normalement)

### Dans l'interface Infomaniak

1. Allez dans **SSL/TLS** ou **Certificats**
2. Vérifiez que **Let's Encrypt** est activé pour :
   - `odillon.fr`
   - `www.odillon.fr`

Si ce n'est pas automatique, activez-le manuellement.

---

## ✅ ÉTAPE 7 : Tester le site (5 min)

### Tests à effectuer

1. **Ouvrez votre navigateur** et visitez :
   - `https://odillon.fr` ✅
   - `https://www.odillon.fr` ✅

2. **Vérifiez HTTPS** :
   - Vous devez voir le cadenas 🔒 dans la barre d'adresse

3. **Testez les pages** :
   - Page d'accueil ✅
   - Section Hero avec slideshow ✅
   - Toutes les sections (Services, Expertise, About, Contact) ✅
   - Page admin : `https://odillon.fr/admin/login` ✅

4. **Testez la connexion admin** :
   - Utilisez votre email et mot de passe Supabase
   - Vérifiez que vous pouvez uploader une photo

5. **Test responsive** :
   - Redimensionnez la fenêtre du navigateur
   - Testez sur mobile (F12 > Mode responsive)

6. **Test de vitesse** :
   - Visitez [pagespeed.web.dev](https://pagespeed.web.dev)
   - Testez `https://odillon.fr`
   - Visez un score > 80

---

## 🔄 Pour les futures mises à jour

### Méthode Git/SSH (la plus simple)

```bash
# Se connecter au serveur
ssh votre-utilisateur@odillon.fr
cd /chemin/vers/site

# Récupérer les dernières modifications
git pull origin master

# Réinstaller les dépendances (si modifiées)
npm install

# Rebuilder
npm run build

# Redémarrer
pm2 restart odillon-site
# Ou via l'interface Infomaniak
```

### Méthode FTP

1. Buildez localement : `npm run build`
2. Uploadez le nouveau dossier `.next/` via FileZilla
3. Uploadez les fichiers modifiés
4. Redémarrez via l'interface Infomaniak

---

## 🆘 Dépannage

### Le site ne se charge pas

1. **Vérifiez le statut** dans l'interface Infomaniak
2. **Vérifiez les logs** :
   ```bash
   pm2 logs odillon-site
   # Ou cherchez les logs dans l'interface Infomaniak
   ```
3. **Vérifiez le port** dans `.env.local` correspond à celui assigné

### Erreur "Cannot find module"

```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### Le site affiche une page blanche

1. Vérifiez que `.next/` existe et contient des fichiers
2. Vérifiez que `npm run build` a bien fonctionné
3. Regardez la console du navigateur (F12)

### Erreurs Supabase / Admin ne fonctionne pas

1. Vérifiez `.env.local` sur le serveur
2. Vérifiez les clés Supabase sont correctes
3. Testez la connexion Supabase dans la console :
   ```bash
   curl https://votre-projet.supabase.co
   ```

### L'application redémarre sans cesse

1. Vérifiez la mémoire RAM disponible
2. Vérifiez les logs d'erreur
3. Contactez le support Infomaniak

---

## 📞 Support

### Infomaniak
- Support : [support.infomaniak.com](https://support.infomaniak.com)
- Téléphone : voir dans votre manager
- Email : via le manager

### Supabase
- Dashboard : [app.supabase.com](https://app.supabase.com)
- Documentation : [supabase.com/docs](https://supabase.com/docs)

### Next.js
- Documentation : [nextjs.org/docs](https://nextjs.org/docs)

---

## ✨ Félicitations !

Si vous êtes arrivé jusqu'ici et que le site fonctionne, vous avez réussi ! 🎉

Votre site professionnel est maintenant en ligne sur **odillon.fr** avec :
- ✅ Hébergement Node.js Infomaniak
- ✅ HTTPS/SSL sécurisé
- ✅ Backend Supabase
- ✅ Gestion de photos dynamique
- ✅ Panel d'administration
- ✅ Design moderne et responsive

**Prochaines étapes** :
1. Configurez Google Analytics (optionnel)
2. Créez un système de backup régulier
3. Testez les performances
4. Partagez votre site ! 🚀

---

**Besoin d'aide ?** N'hésitez pas à me poser des questions !
