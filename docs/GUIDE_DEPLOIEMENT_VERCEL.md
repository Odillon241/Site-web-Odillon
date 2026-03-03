# Guide de déploiement Vercel - odillon.fr

Guide rapide et simple pour déployer votre site sur Vercel et le lier à votre domaine odillon.fr.

## Pourquoi Vercel ?

✅ **Gratuit** pour votre utilisation
✅ **Optimisé** pour Next.js (créé par la même équipe)
✅ **CDN global** - Site rapide partout dans le monde
✅ **SSL automatique** - HTTPS configuré en 1 clic
✅ **Déploiement automatique** - Chaque push GitHub = mise à jour du site
✅ **Zéro maintenance** - Pas de serveur à gérer
✅ **Analytics intégré** - Statistiques de performance

---

## Étape 1 : Créer un compte Vercel (2 minutes)

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"** (en haut à droite)
3. Choisissez **"Continue with GitHub"**
4. Connectez-vous avec votre compte GitHub (`Danel2025`)
5. Autorisez Vercel à accéder à vos dépôts

---

## Étape 2 : Importer votre projet (3 minutes)

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** puis **"Project"**
2. Vous verrez la liste de vos dépôts GitHub
3. Trouvez **"Site-web-Odillon"** et cliquez sur **"Import"**
4. Vercel détectera automatiquement qu'il s'agit d'un projet Next.js

---

## Étape 3 : Configurer le projet (5 minutes)

### Configuration automatique (déjà détectée par Vercel) :
- ✅ Framework Preset : **Next.js**
- ✅ Root Directory : `./`
- ✅ Build Command : `npm run build`
- ✅ Output Directory : `.next`
- ✅ Install Command : `npm install`

### Ajouter les variables d'environnement :

**IMPORTANT** : Cliquez sur **"Environment Variables"** et ajoutez ces 4 variables :

| Nom | Valeur | Note |
|-----|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Copiez depuis Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Copiez depuis Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Copiez depuis Supabase |
| `ADMIN_EMAIL` | `admin@odillon.com` | Votre email admin |

**Où trouver vos clés Supabase ?**
1. Allez sur [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. **Settings** > **API**
4. Copiez :
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`

---

## Étape 4 : Déployer (2 minutes)

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes pendant que Vercel :
   - Clone votre repo
   - Installe les dépendances
   - Build l'application
   - Déploie sur leur CDN
3. ✅ Vous obtiendrez une URL : `site-web-odillon.vercel.app`
4. Testez cette URL pour vérifier que tout fonctionne

---

## Étape 5 : Lier votre domaine odillon.fr (10 minutes)

### 5.1 Dans Vercel

1. Dans votre projet, allez dans **Settings** (en haut)
2. Cliquez sur **Domains** (menu de gauche)
3. Cliquez sur **"Add Domain"**
4. Entrez : `odillon.fr`
5. Cliquez sur **"Add"**
6. Entrez aussi : `www.odillon.fr`
7. Cliquez sur **"Add"**

Vercel vous affichera des enregistrements DNS à configurer. **Notez-les** (exemple ci-dessous) :

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

**Les valeurs exactes seront différentes - utilisez celles fournies par Vercel !**

### 5.2 Dans Infomaniak (Configuration DNS)

1. Allez sur [manager.infomaniak.com](https://manager.infomaniak.com)
2. Dans le menu, cliquez sur **Noms de domaine**
3. Cliquez sur **odillon.fr**
4. Cliquez sur **Zone DNS** (ou DNS)

#### Configurer le domaine racine (odillon.fr)

**Supprimer** ou **modifier** l'enregistrement A existant :
```
Type: A
Nom: @ (ou vide)
Valeur: [IP fournie par Vercel, ex: 76.76.21.21]
TTL: 300 ou Auto
```

#### Configurer www (www.odillon.fr)

**Ajouter** ou **modifier** un enregistrement CNAME :
```
Type: CNAME
Nom: www
Valeur: cname.vercel-dns.com (ou la valeur fournie par Vercel)
TTL: 300 ou Auto
```

5. Cliquez sur **"Enregistrer"** ou **"Valider"**

---

## Étape 6 : Attendre la propagation DNS (5 min à 48h)

Généralement, cela prend **5 à 30 minutes**.

### Vérifier la propagation :

1. Ouvrez un terminal :
   ```bash
   nslookup odillon.fr
   nslookup www.odillon.fr
   ```

2. Ou utilisez : [dnschecker.org](https://dnschecker.org)
   - Entrez `odillon.fr`
   - Vérifiez que l'IP correspond à celle de Vercel

### Dans Vercel :

Une fois propagé, retournez dans **Settings > Domains**.
Vous devriez voir :
- ✅ `odillon.fr` - Valid Configuration
- ✅ `www.odillon.fr` - Valid Configuration

---

## Étape 7 : Configurer HTTPS (automatique)

Vercel configure SSL/HTTPS **automatiquement** !

Une fois le DNS propagé, attendez quelques minutes et Vercel :
1. Détectera votre domaine
2. Générera un certificat SSL gratuit
3. Activera HTTPS

Vous verrez un cadenas vert 🔒 dans votre navigateur sur `https://odillon.fr`

---

## Étape 8 : Test final

1. Visitez `https://odillon.fr` ✅
2. Visitez `https://www.odillon.fr` ✅
3. Testez l'admin : `https://odillon.fr/admin/login` ✅
4. Testez sur mobile 📱
5. Testez la vitesse : [pagespeed.web.dev](https://pagespeed.web.dev)

---

## Déploiements automatiques futurs

**Magie de Vercel** : Chaque fois que vous pushez sur GitHub, Vercel déploie automatiquement !

```bash
# Faire des modifications
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin master

# ✨ Vercel déploie automatiquement en 2-3 minutes !
```

Vous recevrez même un email de confirmation à chaque déploiement.

---

## Configuration optionnelle

### Redirection www → non-www (ou inverse)

Dans Vercel, **Settings > Domains** :
- Cliquez sur `www.odillon.fr`
- Choisissez **"Redirect to odillon.fr"**

Ou l'inverse selon votre préférence.

### Analytics

Vercel offre des analytics gratuits :
1. **Analytics** (menu de gauche)
2. Activez **Vercel Analytics**
3. Installez le package :
   ```bash
   npm install @vercel/analytics
   ```
4. Ajoutez dans `app/layout.tsx` :
   ```tsx
   import { Analytics } from '@vercel/analytics/react'

   // Dans le return, après </body> :
   <Analytics />
   ```

---

## Troubleshooting

### Le site affiche "This deployment is currently unreachable"
- Le build a peut-être échoué. Allez dans **Deployments** et vérifiez les logs
- Vérifiez que toutes les variables d'environnement sont configurées

### Le domaine ne fonctionne pas après 1 heure
- Vérifiez votre configuration DNS dans Infomaniak
- Utilisez `nslookup odillon.fr` pour vérifier
- Assurez-vous d'avoir utilisé les bonnes valeurs fournies par Vercel

### Erreurs 500 sur le site
- Allez dans **Deployments** > cliquez sur le dernier déploiement > **Functions**
- Vérifiez les logs d'erreur
- Souvent lié aux variables d'environnement manquantes

### Les images ne s'affichent pas
- Vérifiez que le bucket Supabase `hero-photos` est public
- Vérifiez les variables d'environnement Supabase

---

## Avantages supplémentaires de Vercel

🚀 **Preview Deployments** : Chaque branche GitHub a sa propre URL de prévisualisation
📊 **Analytics** : Statistiques de performance en temps réel
🔍 **Monitoring** : Détection automatique des erreurs
⚡ **Edge Network** : Votre site est distribué sur +70 régions dans le monde
🔄 **Rollback** : Revenir à une version précédente en 1 clic

---

## Résumé de la configuration finale

| Élément | Configuration |
|---------|---------------|
| **Hébergement** | Vercel (gratuit) |
| **Domaine** | odillon.fr (Infomaniak) |
| **DNS** | A record pointant vers Vercel |
| **SSL** | Let's Encrypt via Vercel (auto) |
| **Déploiement** | Automatique via GitHub |
| **Base de données** | Supabase |
| **Stockage** | Supabase Storage |

---

**Support :**
- Documentation Vercel : [vercel.com/docs](https://vercel.com/docs)
- Discord Vercel : [vercel.com/discord](https://vercel.com/discord)
- Mon GitHub : Vos questions ici !

Bon déploiement ! 🚀
