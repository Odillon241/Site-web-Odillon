# Guide de Déploiement - odillon.fr

Guide complet pour déployer le site Odillon sur le domaine `odillon.fr` hébergé chez Infomaniak.

## Table des matières

1. [Options de déploiement](#options-de-déploiement)
2. [Option 1 : Vercel (Recommandé)](#option-1--vercel-recommandé)
3. [Option 2 : VPS/Cloud Server Infomaniak](#option-2--vpscloud-server-infomaniak)
4. [Configuration DNS Infomaniak](#configuration-dns-infomaniak)
5. [Variables d'environnement](#variables-denvironnement)

---

## Options de déploiement

### Comparaison rapide

| Option | Avantages | Inconvénients | Coût |
|--------|-----------|---------------|------|
| **Vercel** | • Optimisé pour Next.js<br>• CI/CD automatique<br>• CDN global<br>• SSL gratuit<br>• Déploiement en 1 clic | • Dépendance externe | Gratuit (plan Hobby) |
| **VPS Infomaniak** | • Contrôle total<br>• Hébergement local | • Configuration manuelle<br>• Maintenance serveur | ~8-15€/mois |
| **Hébergement Web** | • Simple<br>• Peu coûteux | • Ne supporte généralement pas Node.js | Non compatible |

**Recommandation :** Vercel pour un déploiement rapide, performant et sans maintenance.

---

## Option 1 : Vercel (Recommandé)

Vercel est la plateforme créée par l'équipe Next.js. C'est la solution optimale pour votre projet.

### Étape 1 : Préparer le projet

Le projet est déjà prêt ! Assurez-vous que tout est bien commité et pushé sur GitHub.

```bash
git status
# Tout doit être propre
```

### Étape 2 : Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up"
3. Choisissez "Continue with GitHub"
4. Autorisez Vercel à accéder à vos dépôts

### Étape 3 : Importer le projet

1. Sur le dashboard Vercel, cliquez sur **"Add New Project"**
2. Sélectionnez votre dépôt GitHub : `Danel2025/Site-web-Odillon`
3. Vercel détectera automatiquement qu'il s'agit d'un projet Next.js

### Étape 4 : Configurer le projet

#### Configuration de base :
- **Framework Preset :** Next.js (détecté automatiquement)
- **Root Directory :** `./` (racine)
- **Build Command :** `npm run build` (par défaut)
- **Output Directory :** `.next` (par défaut)
- **Install Command :** `npm install` (par défaut)

#### Variables d'environnement :

Ajoutez ces variables d'environnement dans Vercel :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Admin
ADMIN_EMAIL=admin@odillon.com

# Base URL (après déploiement)
NEXT_PUBLIC_SITE_URL=https://odillon.fr
```

**Important :** Ne commitez JAMAIS ces clés dans Git !

### Étape 5 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes pendant que Vercel :
   - Clone votre repo
   - Installe les dépendances
   - Build l'application
   - Déploie sur leur CDN global
3. Vous obtiendrez une URL de type : `site-web-odillon.vercel.app`

### Étape 6 : Lier votre domaine odillon.fr

1. Dans Vercel, allez dans **Settings > Domains**
2. Cliquez sur **"Add Domain"**
3. Entrez `odillon.fr`
4. Entrez aussi `www.odillon.fr`
5. Vercel vous donnera des enregistrements DNS à configurer

Exemple de ce que Vercel affichera :

```
Pour odillon.fr :
Type: A
Name: @
Value: 76.76.21.21

Pour www.odillon.fr :
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Passez ensuite à la section [Configuration DNS Infomaniak](#configuration-dns-infomaniak).

### Étape 7 : Déploiements automatiques

Une fois configuré, chaque fois que vous pushez sur `master`, Vercel déploiera automatiquement la nouvelle version !

```bash
# Faire des changements
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin master

# Vercel déploie automatiquement en 2-3 minutes
```

---

## Option 2 : VPS/Cloud Server Infomaniak

Si vous avez un VPS ou Cloud Server chez Infomaniak, voici comment déployer.

### Prérequis sur le serveur

```bash
# Connectez-vous en SSH
ssh user@votre-serveur.infomaniak.com

# Installer Node.js 18+ et npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2

# Installer Nginx (reverse proxy)
sudo apt-get install nginx
```

### Déploiement

#### 1. Cloner le projet

```bash
cd /var/www
sudo git clone https://github.com/Danel2025/Site-web-Odillon.git odillon
cd odillon
```

#### 2. Configurer les variables d'environnement

```bash
sudo nano .env.local
```

Ajoutez vos variables :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
ADMIN_EMAIL=admin@odillon.com
NEXT_PUBLIC_SITE_URL=https://odillon.fr
```

#### 3. Installer et builder

```bash
sudo npm install
sudo npm run build
```

#### 4. Démarrer avec PM2

```bash
# Créer un fichier ecosystem.config.js
sudo nano ecosystem.config.js
```

Contenu :

```javascript
module.exports = {
  apps: [{
    name: 'odillon-site',
    script: 'npm',
    args: 'start',
    env: {
      PORT: 3000,
      NODE_ENV: 'production'
    }
  }]
}
```

Démarrer :

```bash
sudo pm2 start ecosystem.config.js
sudo pm2 save
sudo pm2 startup
```

#### 5. Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/odillon
```

Configuration :

```nginx
server {
    listen 80;
    server_name odillon.fr www.odillon.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activer le site :

```bash
sudo ln -s /etc/nginx/sites-available/odillon /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Configurer SSL avec Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d odillon.fr -d www.odillon.fr
```

#### 7. Configuration DNS

Pour un VPS, dans Infomaniak, configurez :

```
Type: A
Name: @
Value: [IP de votre VPS]

Type: A
Name: www
Value: [IP de votre VPS]
```

---

## Configuration DNS Infomaniak

### Accéder à la console Infomaniak

1. Connectez-vous sur [manager.infomaniak.com](https://manager.infomaniak.com)
2. Allez dans **Noms de domaine**
3. Cliquez sur `odillon.fr`
4. Allez dans **Zone DNS**

### Pour Vercel (Option 1)

Ajoutez/modifiez les enregistrements suivants :

#### Enregistrement pour le domaine racine

```
Type: A
Nom: @
Valeur: 76.76.21.21
TTL: 300
```

#### Enregistrement pour www

```
Type: CNAME
Nom: www
Valeur: cname.vercel-dns.com
TTL: 300
```

**Note :** Les valeurs exactes seront fournies par Vercel dans l'interface "Add Domain".

### Pour VPS Infomaniak (Option 2)

```
Type: A
Nom: @
Valeur: [IP de votre VPS]
TTL: 300

Type: A
Nom: www
Valeur: [IP de votre VPS]
TTL: 300
```

### Vérification

La propagation DNS peut prendre de **5 minutes à 48 heures**. Pour vérifier :

```bash
# Vérifier le domaine racine
nslookup odillon.fr

# Vérifier www
nslookup www.odillon.fr

# Outil en ligne
# Visitez : https://dnschecker.org
```

---

## Variables d'environnement

### Liste complète des variables requises

Créez un fichier `.env.local` (pour le développement) ou configurez-les sur votre plateforme de déploiement.

```env
# =====================================
# SUPABASE - Base de données et Auth
# =====================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# =====================================
# ADMINISTRATION
# =====================================
ADMIN_EMAIL=admin@odillon.com

# =====================================
# SITE CONFIGURATION
# =====================================
NEXT_PUBLIC_SITE_URL=https://odillon.fr
NODE_ENV=production
```

### Où trouver vos clés Supabase

1. Connectez-vous sur [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Checklist finale avant mise en production

- [ ] Build réussit en local (`npm run build`)
- [ ] Variables d'environnement configurées
- [ ] Base de données Supabase configurée (schema.sql exécuté)
- [ ] Bucket de stockage `hero-photos` créé et public
- [ ] Utilisateur admin créé dans Supabase Auth
- [ ] DNS configuré et propagé
- [ ] SSL/HTTPS activé
- [ ] Test de connexion à `/admin/login`
- [ ] Test d'upload de photos
- [ ] Test du Hero avec slideshow
- [ ] Vérification responsive (mobile, tablet, desktop)
- [ ] Analytics configuré (optionnel)

---

## Dépannage

### Le site ne se charge pas

1. Vérifiez que le DNS est bien propagé : `nslookup odillon.fr`
2. Vérifiez les logs de build sur Vercel ou les logs PM2 : `pm2 logs`
3. Vérifiez que le port 3000 est bien accessible (VPS)

### Erreurs de connexion Supabase

1. Vérifiez que les variables d'environnement sont bien définies
2. Vérifiez que l'URL Supabase est correcte (pas de `/` à la fin)
3. Vérifiez les RLS (Row Level Security) dans Supabase

### Images ne s'affichent pas

1. Vérifiez que le bucket `hero-photos` est bien public
2. Vérifiez les CORS dans Supabase Storage
3. Vérifiez la configuration dans `next.config.js`

### Erreur 500 après déploiement

1. Vérifiez les logs serveur
2. Vérifiez que toutes les dépendances sont installées
3. Vérifiez la version Node.js (minimum 18)

---

## Support

- **Next.js** : [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Supabase** : [supabase.com/docs](https://supabase.com/docs)
- **Infomaniak** : [Support Infomaniak](https://www.infomaniak.com/fr/support)

---

## Mises à jour futures

Pour déployer des mises à jour :

### Avec Vercel (automatique)
```bash
git add .
git commit -m "Mise à jour"
git push origin master
# Déploiement automatique en 2-3 minutes
```

### Avec VPS (manuel)
```bash
# SSH sur le serveur
cd /var/www/odillon
sudo git pull
sudo npm install
sudo npm run build
sudo pm2 restart odillon-site
```

---

**Prochaine étape :** Choisissez votre option de déploiement et suivez les instructions correspondantes !
