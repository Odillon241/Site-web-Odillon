# 🔧 Dépannage : Emails non reçus

## 🎯 Diagnostic

Le script de test a confirmé que :
- ✅ Resend est correctement installé
- ✅ La clé API est valide
- ✅ L'email est envoyé sans erreur

**Mais vous ne recevez pas les emails.**

## 🔍 Problème identifié

Le domaine `odillon.fr` **n'est probablement PAS vérifié** dans votre compte Resend.

Lorsqu'un domaine n'est pas vérifié, Resend peut :
- Accepter l'email (d'où le succès dans les logs)
- Mais le bloquer ou le mettre en spam côté serveur
- Ou simplement ne pas le délivrer

## ✅ Solutions (par ordre de priorité)

### Solution 1 : Utiliser l'email de test Resend (RAPIDE - Pour tester immédiatement)

Resend fournit un email de test qui fonctionne **sans vérification de domaine** : `onboarding@resend.dev`

**Étape 1 : Modifier `.env.local`**

```env
# Changez cette ligne :
FROM_EMAIL=Odillon <contact@odillon.fr>

# En :
FROM_EMAIL=Odillon <onboarding@resend.dev>
```

**Étape 2 : Redémarrer le serveur**

```bash
# Arrêtez le serveur (Ctrl+C)
npm run dev
```

**Étape 3 : Tester à nouveau**

1. Remplissez le formulaire de contact sur [http://localhost:3000](http://localhost:3000)
2. Envoyez le message
3. Vérifiez votre boîte email `contact@odillon.fr`
4. **Vérifiez aussi vos spams !**

✅ **Avantage** : Fonctionne immédiatement, aucune configuration supplémentaire
❌ **Inconvénient** : L'email provient de `onboarding@resend.dev` au lieu de votre domaine

---

### Solution 2 : Vérifier votre domaine `odillon.fr` dans Resend (RECOMMANDÉ pour la production)

Pour utiliser `contact@odillon.fr` comme expéditeur, vous **devez vérifier votre domaine** dans Resend.

**Étape 1 : Ajouter votre domaine dans Resend**

1. Connectez-vous à [https://resend.com](https://resend.com)
2. Allez dans **Domains** (dans la sidebar)
3. Cliquez sur **"Add Domain"**
4. Entrez : `odillon.fr`
5. Cliquez sur **"Add"**

**Étape 2 : Configurer les enregistrements DNS**

Resend va vous fournir **3 enregistrements DNS** à ajouter chez votre hébergeur DNS (OVH, Cloudflare, Infomaniak, etc.) :

#### 1. Enregistrement SPF (TXT)

```
Type: TXT
Nom: @ (ou odillon.fr)
Valeur: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

#### 2. Enregistrement DKIM (TXT)

```
Type: TXT
Nom: resend._domainkey
Valeur: [Une longue clé fournie par Resend]
TTL: 3600
```

#### 3. Enregistrement DMARC (TXT) - Optionnel mais recommandé

```
Type: TXT
Nom: _dmarc
Valeur: v=DMARC1; p=none; rua=mailto:contact@odillon.fr
TTL: 3600
```

**Étape 3 : Attendre la propagation DNS**

- La vérification peut prendre de **quelques minutes à 48 heures**
- En général, c'est très rapide (5-30 minutes)

**Étape 4 : Vérifier dans Resend**

1. Retournez dans **Domains** sur Resend
2. Cliquez sur **"Verify"** ou rafraîchissez la page
3. Si les enregistrements sont corrects, vous verrez un statut ✅ **"Verified"**

**Étape 5 : Remettre l'email d'origine dans `.env.local`**

```env
FROM_EMAIL=Odillon <contact@odillon.fr>
```

**Étape 6 : Redémarrer et tester**

```bash
npm run dev
```

✅ **Avantage** : Emails professionnels depuis votre propre domaine, meilleure délivrabilité
❌ **Inconvénient** : Nécessite un accès à votre configuration DNS

---

### Solution 3 : Vérifier si les emails vont en spam

**Sur Gmail :**
1. Ouvrez Gmail
2. Cliquez sur **"Spam"** dans la sidebar gauche
3. Cherchez des emails de `Odillon` ou `Resend`

**Sur Outlook/Office 365 :**
1. Ouvrez Outlook
2. Allez dans **"Courrier indésirable"**
3. Cherchez les emails récents

**Si vous trouvez l'email dans les spams :**
1. Sélectionnez l'email
2. Cliquez sur **"Non spam"** ou **"Pas de courrier indésirable"**
3. Ajoutez `contact@odillon.fr` à vos contacts

---

## 🧪 Tester l'envoi d'emails

J'ai créé un script de test pour diagnostiquer les problèmes :

```bash
node test-resend.js
```

Ce script va :
- ✅ Vérifier que Resend est configuré
- ✅ Tenter d'envoyer un email de test
- ✅ Afficher des messages d'erreur détaillés si quelque chose ne fonctionne pas

---

## 📊 Vérifier les logs Resend

Pour voir si vos emails ont été envoyés :

1. Connectez-vous à [https://resend.com](https://resend.com)
2. Allez dans **Emails** (dans la sidebar)
3. Vous verrez la liste de tous les emails envoyés
4. Cliquez sur un email pour voir les détails :
   - ✅ **Delivered** : Email livré avec succès
   - ⏳ **Queued** : En attente d'envoi
   - ❌ **Bounced** : Email rejeté (adresse invalide, boîte pleine, etc.)
   - ⚠️ **Failed** : Échec de l'envoi

---

## ⚙️ Configuration actuelle

D'après votre `.env.local` :

```env
RESEND_API_KEY=re_fGV8rTKP_Kp4HUXzRR4Y4ssbVdjBVzaSf
CONTACT_EMAIL=contact@odillon.fr
FROM_EMAIL=Odillon <contact@odillon.fr>
```

**Problème** : `FROM_EMAIL` utilise `contact@odillon.fr` mais le domaine n'est pas vérifié.

---

## 🎯 Ma recommandation

### Pour tester MAINTENANT (5 minutes) :

1. **Modifier `.env.local`** :
   ```env
   FROM_EMAIL=Odillon <onboarding@resend.dev>
   ```

2. **Redémarrer** :
   ```bash
   npm run dev
   ```

3. **Tester le formulaire**

4. **Vérifier vos spams**

### Pour la production (1-2 heures) :

1. **Vérifier le domaine `odillon.fr` dans Resend** (voir Solution 2 ci-dessus)
2. **Configurer les DNS** chez votre hébergeur
3. **Attendre la vérification** (5-30 minutes en général)
4. **Remettre `contact@odillon.fr` comme expéditeur**

---

## ❓ FAQ

### Pourquoi le test dit "succès" mais je ne reçois rien ?

Resend accepte l'email, mais comme le domaine n'est pas vérifié, il peut le bloquer silencieusement ou le marquer comme spam.

### Combien d'emails puis-je envoyer avec le plan gratuit ?

- **100 emails/jour**
- **3 000 emails/mois**

C'est largement suffisant pour un formulaire de contact.

### Puis-je utiliser un autre service que Resend ?

Oui, mais Resend est le plus simple et le plus moderne. Alternatives :
- SendGrid
- Mailgun
- Amazon SES
- Postmark

### Les messages sont-ils sauvegardés si l'email échoue ?

**Oui !** Tous les messages sont sauvegardés dans Supabase (`contact_messages`) même si l'email échoue. Vous pouvez les consulter dans l'interface admin.

---

## 🔗 Ressources

- [Documentation Resend](https://resend.com/docs)
- [Guide de vérification de domaine](https://resend.com/docs/dashboard/domains/introduction)
- [Dashboard Resend](https://resend.com/emails)
- [Support Resend](https://resend.com/support)

---

## 🚨 Si rien ne fonctionne

Contactez-moi avec :

1. Les logs de `node test-resend.js`
2. Une capture d'écran de votre dashboard Resend (page "Emails")
3. Le message d'erreur complet si vous en avez un

Je vous aiderai à résoudre le problème ! 🚀
