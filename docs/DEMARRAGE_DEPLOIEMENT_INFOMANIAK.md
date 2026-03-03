# Démarrage rapide - Déploiement Node.js Infomaniak

Checklist et étapes rapides pour déployer odillon.fr sur Node.js Infomaniak.

## 📋 Checklist avant de commencer

- [ ] Compte Infomaniak avec accès au manager
- [ ] Domaine odillon.fr configuré
- [ ] Projet compilé et testé en local
- [ ] Variables d'environnement Supabase prêtes
- [ ] GitHub repo à jour (dernier commit pushé)

---

## 🚀 Étapes de déploiement

### 1️⃣ Créer le site Node.js (5 min)

**Dans votre manager Infomaniak** ([manager.infomaniak.com](https://manager.infomaniak.com)) :

1. Cliquez sur **"Créer un site avec Node.js"** (section Node.js)
2. Sélectionnez le domaine **odillon.fr**
3. Choisissez Node.js **18** ou **20** (la plus récente)
4. Validez et notez :
   - L'adresse SSH : `_______________________________`
   - Le port assigné : `_______________________________`
   - Le chemin du site : `_______________________________`

### 2️⃣ Préparer les fichiers localement (2 min)

```bash
# Dans votre dossier de projet
cd "c:\Users\nexon\Odillon site web"

# Builder le projet
npm run build

# Vérifier que .next/ a été créé
dir .next
```

### 3️⃣ Créer le fichier de variables d'environnement (2 min)

Créez un fichier `.env.production` avec vos vraies valeurs :

```bash
# Ne commitez JAMAIS ce fichier !
echo .env.production >> .gitignore
```

Contenu de `.env.production` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ADMIN_EMAIL=admin@odillon.com
NEXT_PUBLIC_SITE_URL=https://odillon.fr
NODE_ENV=production
PORT=3000
```

### 4️⃣ Option A : Déploiement via FTP (plus simple pour commencer)

#### Télécharger FileZilla

Si vous ne l'avez pas : [filezilla-project.org](https://filezilla-project.org)

#### Se connecter

Dans FileZilla :
- **Hôte** : `ftp.odillon.fr` (ou l'adresse fournie par Infomaniak)
- **Utilisateur** : `votre-username-infomaniak`
- **Mot de passe** : `votre-mot-de-passe`
- **Port** : `21`

#### Uploader les fichiers

**Fichiers/dossiers à uploader** (dans le bon ordre) :

1. `package.json`
2. `package-lock.json`
3. `next.config.js`
4. `.env.production` (renommez-le en `.env.local` après upload)
5. Dossier `public/` (tout)
6. Dossier `.next/` (tout - après avoir fait `npm run build`)
7. Dossier `app/` (tout)
8. Dossier `components/` (tout)
9. Dossier `lib/` (tout)
10. Tous les autres fichiers nécessaires

**NE PAS uploader** :
- ❌ `node_modules/` (trop lourd, installez sur le serveur)
- ❌ `.git/`
- ❌ `.env.local` (utilisez `.env.production`)

#### Sur le serveur (via l'interface Infomaniak ou terminal SSH)

Si Infomaniak vous donne accès à un terminal :

```bash
# Installer les dépendances
npm install --production

# Démarrer l'application
npm start
```

### 4️⃣ Option B : Déploiement via Git/SSH (recommandé si disponible)

#### Se connecter en SSH

```bash
ssh votre-username@odillon.fr
# Ou l'adresse SSH fournie par Infomaniak
```

#### Cloner le projet

```bash
# Aller dans le dossier du site (path fourni par Infomaniak)
cd /path/to/your/site

# Cloner votre repo
git clone https://github.com/Danel2025/Site-web-Odillon.git .

# Créer le fichier .env.local
nano .env.local
# Copiez-collez vos variables d'environnement
# Ctrl+X pour sauvegarder

# Installer les dépendances
npm install

# Builder
npm run build

# Démarrer
npm start
```

### 5️⃣ Vérifier le démarrage (2 min)

1. Dans l'interface Infomaniak, vérifiez que l'application est **"Running"** ou **"Active"**
2. Testez l'URL temporaire si fournie
3. Visitez `https://odillon.fr` (peut prendre quelques minutes)

### 6️⃣ Configurer HTTPS (automatique normalement)

Infomaniak devrait activer HTTPS automatiquement via Let's Encrypt.

Si ce n'est pas le cas :
1. Dans le manager, allez dans **SSL/TLS**
2. Activez **Let's Encrypt** pour `odillon.fr` et `www.odillon.fr`

---

## ✅ Tests à effectuer après déploiement

- [ ] Le site se charge : `https://odillon.fr`
- [ ] Redirection www fonctionne : `https://www.odillon.fr`
- [ ] HTTPS activé (cadenas 🔒)
- [ ] Page d'accueil s'affiche correctement
- [ ] Section Hero avec slideshow de photos
- [ ] Toutes les sections (Services, Expertise, About, Contact)
- [ ] Page admin accessible : `https://odillon.fr/admin/login`
- [ ] Connexion admin fonctionne
- [ ] Upload de photos fonctionne
- [ ] Version mobile responsive
- [ ] Vitesse de chargement acceptable

---

## 🔧 Configuration avancée

### Redémarrage automatique avec PM2 (si disponible)

Si vous avez accès SSH complet :

```bash
# Installer PM2 globalement
npm install -g pm2

# Créer un fichier ecosystem
nano ecosystem.config.js
```

Contenu :

```javascript
module.exports = {
  apps: [{
    name: 'odillon',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
```

Démarrer :

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Mises à jour futures

```bash
# SSH sur le serveur
ssh votre-username@odillon.fr
cd /path/to/site

# Récupérer les modifications
git pull origin master

# Réinstaller si nécessaire
npm install

# Rebuilder
npm run build

# Redémarrer
pm2 restart odillon
# Ou si pas PM2 :
# Arrêter et redémarrer via l'interface Infomaniak
```

---

## ❓ Questions à vérifier avec Infomaniak

Avant de commencer, contactez le support Infomaniak pour confirmer :

1. ✅ La version de Node.js disponible (minimum 18)
2. ✅ L'accès SSH est-il disponible ?
3. ✅ Peut-on utiliser PM2 ou un gestionnaire de processus ?
4. ✅ Quelle est la limite de mémoire RAM ?
5. ✅ Y a-t-il un reverse proxy déjà configuré ?
6. ✅ Comment redémarrer l'application si elle plante ?
7. ✅ Les logs sont-ils accessibles ? Où ?

---

## 🆘 En cas de problème

### L'application ne démarre pas

1. Vérifiez les logs (interface Infomaniak ou `pm2 logs`)
2. Vérifiez que Node.js 18+ est installé : `node -v`
3. Vérifiez que les dépendances sont installées : `ls node_modules`
4. Vérifiez `.env.local` est bien présent

### Erreur "Port already in use"

Le port est peut-être déjà utilisé. Modifiez le port dans `.env.local` :
```env
PORT=3001
```

### Le site affiche une page blanche

1. Vérifiez que `npm run build` a bien fonctionné
2. Vérifiez le dossier `.next/` existe
3. Regardez les logs navigateur (F12 > Console)

### Erreurs Supabase

1. Vérifiez `.env.local` a les bonnes clés
2. Testez la connexion Supabase localement d'abord
3. Vérifiez les RLS dans Supabase

---

## 📞 Support

- **Infomaniak** : [support.infomaniak.com](https://support.infomaniak.com)
- **Documentation Next.js** : [nextjs.org/docs](https://nextjs.org/docs)
- **Guide complet** : Voir `GUIDE_DEPLOIEMENT_INFOMANIAK_NODEJS.md`

---

## 🎯 Prochaines étapes

Une fois le site déployé :

1. Configurez Google Analytics (optionnel)
2. Configurez un système de backup
3. Configurez les emails de notification
4. Testez les performances avec [PageSpeed Insights](https://pagespeed.web.dev)
5. Créez une procédure de mise à jour documentée

---

**Bon déploiement ! 🚀**

N'hésitez pas à me poser des questions si vous bloquez quelque part.
