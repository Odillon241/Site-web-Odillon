# Configuration du sous-domaine admin.odillon.fr

## Problème

Le sous-domaine `admin.odillon.fr` doit afficher l'interface d'administration (`/admin/photos`) mais ne fonctionne pas en production.

## Solution : Étapes de configuration sur Infomaniak

### Étape 1 : Ajouter le sous-domaine dans Infomaniak

1. Connectez-vous au **Manager Infomaniak** (https://manager.infomaniak.com)
2. Allez dans **Hébergement web** → Sélectionnez **odillon.fr**
3. Dans le menu, cliquez sur **"Domaines"** ou **"Sous-domaines"**
4. Cliquez sur **"Ajouter un sous-domaine"**
5. Entrez : `admin`
6. **IMPORTANT** : Le sous-domaine doit pointer vers **le même répertoire** que `odillon.fr`
   - Typiquement : `/sites/odillon.fr/`
7. Cliquez sur **Valider**

### Étape 2 : Vérifier la configuration DNS (si nécessaire)

Si le sous-domaine utilise un DNS externe ou personnalisé :

1. Allez dans **Domaines** → **odillon.fr** → **Zone DNS**
2. Vérifiez qu'il existe un enregistrement pour `admin.odillon.fr` :

```
Type    Nom     Valeur
A       admin   [Même IP que odillon.fr]
```

**OU** un enregistrement CNAME :

```
Type    Nom     Valeur
CNAME   admin   odillon.fr
```

### Étape 3 : Activer SSL/HTTPS pour le sous-domaine

1. Dans le Manager, allez dans **SSL/TLS**
2. Cliquez sur **"Gérer les certificats"**
3. Ajoutez `admin.odillon.fr` au certificat Let's Encrypt existant
4. **OU** créez un nouveau certificat pour `admin.odillon.fr`

### Étape 4 : Redéployer l'application (si nécessaire)

Si vous utilisez PM2 :

```bash
ssh votre-user@odillon.fr
cd /chemin/vers/application
pm2 restart odillon-site
```

Ou reconstruisez l'application :

```bash
npm run build
pm2 restart odillon-site
```

## Vérification

### Test 1 : Accès direct au sous-domaine

1. Ouvrez `https://admin.odillon.fr`
2. Vous devriez être redirigé vers `https://admin.odillon.fr/admin/photos`
3. Si non authentifié, redirection vers `/admin/login`

### Test 2 : Vérifier les logs

En SSH sur le serveur :

```bash
pm2 logs odillon-site --lines 50
```

Vous devriez voir des lignes comme :
```
[Proxy] Host: admin.odillon.fr, Path: /, Forwarded-Host: none
```

### Test 3 : Vérifier le header Host

Depuis votre navigateur, ouvrez les DevTools (F12) → Network → rechargez la page → cliquez sur la première requête → Headers.

Vérifiez que `Host: admin.odillon.fr` est bien présent.

## Résolution des problèmes courants

### Problème : "admin.odillon.fr" affiche la page d'accueil au lieu de l'admin

**Cause** : Le header `Host` n'est pas transmis correctement par le reverse proxy.

**Solution** : Vérifiez que le reverse proxy (Nginx/Apache) préserve le header Host :

Pour Nginx (à ajouter dans la config du site) :
```nginx
proxy_set_header Host $host;
proxy_set_header X-Forwarded-Host $host;
```

Pour Apache (.htaccess inclus dans le projet) :
```apache
RequestHeader set X-Forwarded-Host "%{HTTP_HOST}s"
ProxyPreserveHost On
```

### Problème : Erreur SSL / Certificat invalide

**Cause** : Le certificat SSL ne couvre pas le sous-domaine.

**Solution** : Régénérez le certificat Let's Encrypt pour inclure `admin.odillon.fr`.

### Problème : 404 Not Found

**Cause** : Le sous-domaine ne pointe pas vers l'application Next.js.

**Solution** : Vérifiez que le sous-domaine est configuré pour pointer vers le même répertoire/application Node.js.

### Problème : Boucle de redirection

**Cause** : Configuration conflictuelle ou cookies incorrects.

**Solution** : 
1. Videz les cookies du navigateur pour `odillon.fr`
2. Vérifiez que Supabase Auth est correctement configuré

## Architecture du routage

```
admin.odillon.fr/                  → Redirige vers /admin/photos
admin.odillon.fr/admin/photos      → Dashboard admin
admin.odillon.fr/admin/login       → Page de connexion
admin.odillon.fr/api/*             → API autorisée
admin.odillon.fr/autre-page        → Redirige vers /admin/login

odillon.fr/admin/*                 → Redirige vers admin.odillon.fr/admin/*
odillon.fr/*                       → Site public normal
```

## Fichiers concernés

- `proxy.ts` : Logique de routage des sous-domaines
- `lib/supabase/middleware.ts` : Gestion de session et authentification
- `next.config.js` : Configuration Next.js
- `.htaccess` : Configuration Apache (si applicable)

## Contact support

Si le problème persiste, contactez le support Infomaniak pour vérifier :
1. La configuration du sous-domaine
2. La configuration du reverse proxy Node.js
3. Les règles de routage DNS

