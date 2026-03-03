# 🔧 Configuration DNS Infomaniak pour Resend

## Pourquoi cette configuration est nécessaire ?

Infomaniak a des **filtres anti-spam très stricts**. Pour que vos emails arrivent dans la boîte de réception, vous devez :

1. ✅ Vérifier votre domaine `odillon.fr` dans Resend
2. ✅ Ajouter les enregistrements DNS dans Infomaniak
3. ✅ Utiliser `noreply@odillon.fr` au lieu de `onboarding@resend.dev`

Sans cette configuration, Infomaniak **bloque silencieusement** les emails (ils n'arrivent ni dans la boîte de réception, ni dans les spams).

---

## 📝 Étape 1 : Obtenir les enregistrements DNS depuis Resend

### 1.1 Connectez-vous à Resend

Allez sur [https://resend.com/domains](https://resend.com/domains)

### 1.2 Ajoutez votre domaine

1. Cliquez sur **"Add Domain"**
2. Entrez : `odillon.fr`
3. Cliquez sur **"Add"**

### 1.3 Copiez les enregistrements DNS

Resend vous affiche **3 enregistrements** à ajouter :

#### Enregistrement 1 : SPF
```
Type: TXT
Name: @ ou odillon.fr
Value: v=spf1 include:_spf.resend.com ~all
```

#### Enregistrement 2 : DKIM
```
Type: TXT
Name: resend._domainkey
Value: [Une longue clé unique générée par Resend]
```

**⚠️ Important** : Copiez EXACTEMENT la valeur de la clé DKIM (elle fait plusieurs lignes).

#### Enregistrement 3 : DMARC (optionnel)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:contact@odillon.fr
```

**Gardez cette page ouverte**, vous en aurez besoin pour copier-coller les valeurs.

---

## 🌐 Étape 2 : Ajouter les enregistrements dans Infomaniak

### 2.1 Connexion à Infomaniak Manager

1. Allez sur [https://manager.infomaniak.com](https://manager.infomaniak.com)
2. Connectez-vous avec vos identifiants
3. Attendez le chargement du tableau de bord

### 2.2 Accéder à la zone DNS

1. Dans le menu de gauche, cliquez sur **"Domaines"**
2. Cliquez sur votre domaine **`odillon.fr`**
3. Dans le sous-menu, cliquez sur **"Zone DNS"** (ou "Gestion DNS")

Vous devriez voir une interface avec une liste d'enregistrements DNS existants.

### 2.3 Ajouter l'enregistrement SPF

1. Cliquez sur **"Ajouter un enregistrement"** ou **"Nouvelle entrée"**
2. Remplissez les champs :

```
Type: TXT
Nom (ou Préfixe): @
   OU laissez vide
   OU écrivez "odillon.fr"
   (Infomaniak accepte les 3 formats)

Cible (ou Valeur): v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

3. Cliquez sur **"Enregistrer"** ou **"Valider"**

**⚠️ Attention** : Si vous avez déjà un enregistrement SPF (commençant par `v=spf1`), vous devez le **modifier** au lieu d'en créer un nouveau :

**Ancienne valeur** (exemple) :
```
v=spf1 include:spf.infomaniak.ch ~all
```

**Nouvelle valeur** (fusionnée) :
```
v=spf1 include:spf.infomaniak.ch include:_spf.resend.com ~all
```

### 2.4 Ajouter l'enregistrement DKIM

1. Cliquez sur **"Ajouter un enregistrement"**
2. Remplissez les champs :

```
Type: TXT
Nom (ou Préfixe): resend._domainkey
Cible (ou Valeur): [Copiez EXACTEMENT la longue clé depuis Resend]
TTL: 3600
```

**⚠️ Important** : La valeur DKIM est très longue (plusieurs lignes). Assurez-vous de copier **toute** la valeur depuis Resend.

3. Cliquez sur **"Enregistrer"**

### 2.5 Ajouter l'enregistrement DMARC (optionnel mais recommandé)

1. Cliquez sur **"Ajouter un enregistrement"**
2. Remplissez les champs :

```
Type: TXT
Nom (ou Préfixe): _dmarc
Cible (ou Valeur): v=DMARC1; p=none; rua=mailto:contact@odillon.fr
TTL: 3600
```

3. Cliquez sur **"Enregistrer"**

---

## ⏱️ Étape 3 : Attendre la propagation DNS

Les modifications DNS prennent du temps à se propager :

- **Minimum** : 5-10 minutes
- **Moyen** : 30 minutes
- **Maximum** : 2 heures (rare)

**Pendant ce temps** :
- Ne touchez plus à la configuration DNS
- Gardez Resend ouvert
- Patientez 😊

---

## ✅ Étape 4 : Vérifier le domaine dans Resend

Après 10-15 minutes :

1. Retournez sur [https://resend.com/domains](https://resend.com/domains)
2. À côté de `odillon.fr`, cliquez sur **"Verify"** (ou rafraîchissez la page)
3. Attendez quelques secondes

**Résultats possibles** :

- ✅ **"Verified"** (vert) : Parfait ! Le domaine est vérifié
- ⏳ **"Pending"** (orange) : Attendez encore 10-20 minutes et réessayez
- ❌ **"Failed"** (rouge) : Vérifiez que les DNS sont bien configurés

---

## 🧪 Étape 5 : Tester l'envoi d'emails

Une fois le domaine **vérifié** :

### 5.1 Vérifier la configuration

Ouvrez le fichier `.env.local` et assurez-vous que vous avez :

```env
FROM_EMAIL=Odillon <noreply@odillon.fr>
```

(Pas `onboarding@resend.dev`, mais bien `noreply@odillon.fr`)

### 5.2 Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
npm run dev
```

### 5.3 Tester avec le script

```bash
node test-resend.js
```

Vous devriez voir :
```
✅ Email envoyé avec succès !
```

### 5.4 Vérifier votre boîte email

1. Attendez 1-2 minutes
2. Ouvrez votre boîte `contact@odillon.fr`
3. L'email devrait être dans votre **boîte de réception** (pas dans les spams !)

### 5.5 Tester depuis le site

1. Allez sur [http://localhost:3000](http://localhost:3000)
2. Remplissez le formulaire de contact
3. Envoyez le message
4. Vérifiez votre boîte email `contact@odillon.fr`

---

## 🐛 Dépannage

### Problème : "Domain not verified" dans Resend

**Cause** : Les DNS ne sont pas encore propagés ou sont mal configurés.

**Solution** :
1. Attendez 30 minutes supplémentaires
2. Vérifiez que les enregistrements DNS sont bien dans Infomaniak (Zone DNS)
3. Utilisez un outil comme [https://mxtoolbox.com/dkim.aspx](https://mxtoolbox.com/dkim.aspx) pour vérifier

### Problème : L'email va toujours en spam

**Cause** : Le domaine est vérifié mais Infomaniak le bloque quand même.

**Solution - Whitelister Resend dans Infomaniak** :

1. Connectez-vous à [https://webmail.infomaniak.com](https://webmail.infomaniak.com)
2. Allez dans **Paramètres** → **Filtres anti-spam**
3. Ajoutez à la **liste blanche** :
   - `resend.com`
   - `resend.dev`
   - `noreply@odillon.fr`

### Problème : J'ai déjà un enregistrement SPF

**Cause** : Vous ne pouvez avoir qu'UN SEUL enregistrement SPF par domaine.

**Solution** : Fusionnez les enregistrements :

**Exemple - Si vous avez déjà** :
```
v=spf1 include:spf.infomaniak.ch ~all
```

**Modifiez-le en** :
```
v=spf1 include:spf.infomaniak.ch include:_spf.resend.com ~all
```

Ne créez PAS un deuxième enregistrement SPF, modifiez l'existant.

### Problème : "Invalid DKIM record"

**Cause** : La clé DKIM n'a pas été copiée entièrement ou contient des espaces en trop.

**Solution** :
1. Retournez sur Resend
2. Recopiez **toute** la valeur DKIM (elle peut faire 10 lignes)
3. Supprimez l'ancien enregistrement DKIM dans Infomaniak
4. Recréez-le en collant la valeur complète

---

## 📊 Vérifier les enregistrements DNS

Utilisez ces outils pour vérifier que vos DNS sont bien configurés :

### Vérifier SPF
[https://mxtoolbox.com/spf.aspx](https://mxtoolbox.com/spf.aspx)

Entrez : `odillon.fr`

Vous devriez voir : `v=spf1 include:spf.infomaniak.ch include:_spf.resend.com ~all`

### Vérifier DKIM
[https://mxtoolbox.com/dkim.aspx](https://mxtoolbox.com/dkim.aspx)

Entrez :
- **Domain** : `odillon.fr`
- **Selector** : `resend`

Vous devriez voir : ✅ **"DKIM record found"**

### Vérifier DMARC
[https://mxtoolbox.com/dmarc.aspx](https://mxtoolbox.com/dmarc.aspx)

Entrez : `odillon.fr`

Vous devriez voir : `v=DMARC1; p=none; rua=mailto:contact@odillon.fr`

---

## ✅ Checklist complète

Avant de tester, assurez-vous que :

- [ ] Le domaine `odillon.fr` est ajouté dans Resend
- [ ] L'enregistrement SPF est dans la zone DNS Infomaniak
- [ ] L'enregistrement DKIM est dans la zone DNS Infomaniak
- [ ] L'enregistrement DMARC est dans la zone DNS Infomaniak (optionnel)
- [ ] Vous avez attendu au moins 15 minutes pour la propagation DNS
- [ ] Le domaine est marqué ✅ "Verified" dans Resend
- [ ] Le fichier `.env.local` contient `FROM_EMAIL=Odillon <noreply@odillon.fr>`
- [ ] Vous avez redémarré le serveur Next.js

---

## 🎯 Résumé

**Problème** : Les emails ne sont pas reçus car Infomaniak bloque les emails de `onboarding@resend.dev`.

**Solution** : Vérifier le domaine `odillon.fr` dans Resend + Configurer les DNS dans Infomaniak.

**Durée totale** : 30-60 minutes (incluant l'attente de propagation DNS).

**Une fois configuré** : Tous les emails du formulaire de contact arriveront dans `contact@odillon.fr` ✅

---

## 🔗 Liens utiles

- [Dashboard Resend](https://resend.com/domains)
- [Manager Infomaniak](https://manager.infomaniak.com)
- [Webmail Infomaniak](https://webmail.infomaniak.com)
- [Documentation Resend - Domaines](https://resend.com/docs/dashboard/domains/introduction)
- [MXToolbox - Tests DNS](https://mxtoolbox.com)

---

## ❓ Besoin d'aide ?

Si vous rencontrez des difficultés :

1. Prenez une capture d'écran de votre zone DNS Infomaniak
2. Prenez une capture d'écran de la page Domains dans Resend
3. Partagez les erreurs que vous voyez

Je pourrai vous aider à diagnostiquer le problème ! 🚀
