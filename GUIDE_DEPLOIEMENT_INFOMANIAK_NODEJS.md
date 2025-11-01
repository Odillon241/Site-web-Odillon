# Guide de déploiement - Node.js Infomaniak

Guide pas-à-pas pour déployer votre site Odillon sur l'hébergement Node.js d'Infomaniak.

## Étape 1 : Créer un site Node.js sur Infomaniak

1. **Dans votre interface Infomaniak** (celle que vous voyez actuellement) :
   - Cliquez sur **"Créer un site avec Node.js"** (dans la section Node.js)
   - Suivez l'assistant de création

2. **Configuration du site** :
   - **Nom de domaine** : Sélectionnez `odillon.fr`
   - **Version Node.js** : Choisissez Node.js 18 ou 20 (la plus récente disponible)
   - **Port** : Notez le port qui vous sera assigné (généralement 3000 ou assigné automatiquement)

## Étape 2 : Accéder via FTP/SSH

Vous aurez besoin des identifiants FTP/SSH fournis par Infomaniak.

### Via FTP (plus simple pour commencer)

1. Dans Infomaniak, allez dans **FTP/SSH** dans le menu de gauche
2. Notez vos identifiants :
   - **Serveur FTP** : `ftp.odillon.fr` ou similaire
   - **Utilisateur** : `votre-username`
   - **Mot de passe** : celui que vous avez défini
3. Utilisez un client FTP comme FileZilla pour vous connecter

### Via SSH (recommandé pour le déploiement)

```bash
ssh votre-username@odillon.fr
# Ou l'adresse SSH fournie par Infomaniak
```

## Étape 3 : Uploader votre projet

### Option A : Via FTP (FileZilla)

1. **Préparer le projet localement** :
   ```bash
   # Dans votre dossier de projet
   npm run build
   ```

2. **Fichiers à uploader** via FTP :
   - Tout le dossier `.next/` (résultat du build)
   - `public/`
   - `node_modules/` (ou installer sur le serveur)
   - `package.json`
   - `package-lock.json`
   - `next.config.js`
   - `.env.local` (avec vos variables de production)

3. **Uploadez** tout dans le dossier racine de votre site Node.js

### Option B : Via Git (recommandé)

Si Infomaniak donne accès SSH avec Git :

```bash
# SSH sur le serveur
ssh votre-username@odillon.fr

# Aller dans le dossier du site
cd ~/www/odillon.fr  # ou le chemin fourni

# Cloner votre repo
git clone https://github.com/Danel2025/Site-web-Odillon.git .

# Installer les dépendances
npm install

# Builder l'application
npm run build
```

## Étape 4 : Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine :

```bash
# Via SSH
nano .env.local
```

Ajoutez vos variables :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
ADMIN_EMAIL=admin@odillon.com
NEXT_PUBLIC_SITE_URL=https://odillon.fr
NODE_ENV=production
```

**Important** : Ne commitez JAMAIS ce fichier dans Git !

## Étape 5 : Démarrer l'application

### Si Infomaniak utilise un système de gestion automatique :

L'application devrait démarrer automatiquement. Vérifiez dans l'interface Infomaniak.

### Si vous devez démarrer manuellement via SSH :

```bash
# Option 1 : Démarrage simple
npm start

# Option 2 : Avec PM2 (si disponible)
pm2 start npm --name "odillon" -- start
pm2 save
```

## Étape 6 : Configurer le domaine

Dans l'interface Infomaniak, vérifiez que `odillon.fr` pointe bien vers votre application Node.js.

Si ce n'est pas automatique :

1. Allez dans **Noms de domaine**
2. Cliquez sur `odillon.fr`
3. Allez dans **Zone DNS**
4. Assurez-vous que le domaine pointe vers votre hébergement Node.js

## Étape 7 : Configurer HTTPS

Infomaniak devrait fournir SSL/HTTPS automatiquement via Let's Encrypt.

Si ce n'est pas le cas :
1. Dans l'interface, allez dans **SSL/TLS**
2. Activez **Let's Encrypt** pour `odillon.fr` et `www.odillon.fr`

## Étape 8 : Vérifier le déploiement

1. Ouvrez votre navigateur
2. Allez sur `https://odillon.fr`
3. Vérifiez que le site se charge correctement
4. Testez la connexion admin : `https://odillon.fr/admin/login`

## Déployer des mises à jour

### Via Git (recommandé)

```bash
# SSH sur le serveur
ssh votre-username@odillon.fr
cd ~/www/odillon.fr

# Récupérer les dernières modifications
git pull origin master

# Réinstaller les dépendances si nécessaire
npm install

# Rebuilder
npm run build

# Redémarrer (si PM2)
pm2 restart odillon
```

### Via FTP

1. Buildez localement : `npm run build`
2. Uploadez le nouveau dossier `.next/` via FTP
3. Redémarrez l'application via l'interface Infomaniak

---

## Limitations possibles de Node.js Infomaniak

⚠️ **Points à vérifier** :
- Temps d'exécution maximum par requête
- Limite de mémoire RAM
- Possibilité d'utiliser PM2 ou autre gestionnaire de processus
- Version de Node.js disponible (minimum 18 requis)
- Accès SSH complet ou limité

Si vous rencontrez des limitations, **Vercel reste la meilleure option** (voir le guide Vercel ci-dessous).

---

## Troubleshooting

### L'application ne démarre pas
- Vérifiez que Node.js 18+ est installé
- Vérifiez que `npm install` a bien installé toutes les dépendances
- Vérifiez les logs d'erreur dans l'interface Infomaniak

### Erreur "Cannot find module"
```bash
# Réinstaller toutes les dépendances
rm -rf node_modules
npm install
```

### Le site est lent
- Vérifiez que le build de production est utilisé (`npm run build` puis `npm start`)
- Considérez Vercel pour un CDN global

### Erreurs Supabase
- Vérifiez que `.env.local` est bien présent
- Vérifiez que les variables d'environnement sont correctes

---

**Prochaine étape** : Testez cette méthode. Si vous rencontrez des limitations, je vous montrerai comment déployer sur Vercel (plus simple et plus performant).
