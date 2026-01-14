# Configuration du sous-domaine support@odillon.fr pour Resend

Ce guide explique comment configurer `support@odillon.fr` pour recevoir les emails via Resend (webhook) tout en gardant `contact@odillon.fr` sur Infomaniak.

---

## 🎯 Objectif

**Avant** :
- `contact@odillon.fr` → Infomaniak ✅
- Pas de webhook ❌

**Après** :
- `contact@odillon.fr` → Infomaniak ✅ (inchangé)
- `support@odillon.fr` → Resend ✅ (nouveau, pour le webhook)

---

## 📋 Étapes de configuration

### Étape 1 : Ajouter le sous-domaine dans Resend

1. Allez sur https://resend.com/domains
2. Cliquez sur **"Add Domain"**
3. Entrez : `support.odillon.fr` (sans le @)
4. Cliquez sur **"Add"**

Resend va vous donner les enregistrements DNS à configurer.

---

### Étape 2 : Configurer les DNS chez Infomaniak

Vous allez ajouter des enregistrements DNS **uniquement pour le sous-domaine** `support.odillon.fr`.

#### 2.1 - Enregistrement MX (pour recevoir les emails)

**Important** : Vous ajoutez ces enregistrements **en plus** des MX existants pour `odillon.fr`.

Dans votre panneau Infomaniak (Manager → Domaines → odillon.fr → Zone DNS) :

```
Type: MX
Nom: support
Valeur: inbound-smtp.us-east-1.amazonaws.com (ou la valeur donnée par Resend)
Priorité: 10
TTL: Auto
```

> ⚠️ **Note** : Resend vous donnera l'adresse exacte du serveur MX dans leur dashboard.

#### 2.2 - Enregistrement TXT pour DKIM (pour l'envoi)

```
Type: TXT
Nom: resend._domainkey.support
Valeur: (la valeur donnée par Resend, commence par "p=...")
TTL: Auto
```

#### 2.3 - Enregistrement TXT pour SPF (pour l'envoi)

```
Type: TXT
Nom: support
Valeur: v=spf1 include:amazonses.com ~all
TTL: Auto
```

---

### Étape 3 : Vérifier le domaine dans Resend

1. Retournez sur https://resend.com/domains
2. Cliquez sur `support.odillon.fr`
3. Attendez que tous les indicateurs soient **verts** :
   - ✅ DKIM
   - ✅ SPF
   - ✅ MX

Cela peut prendre 5-30 minutes pour la propagation DNS.

---

### Étape 4 : Activer la réception d'emails

Dans Resend Dashboard → Domains → `support.odillon.fr` :

1. Activez **"Enable Receiving"** (toggle)
2. Vérifiez que l'enregistrement MX est bien configuré

---

### Étape 5 : Mettre à jour les variables d'environnement

Modifiez votre fichier `.env.local` :

```env
# Email de support (pour le webhook/système bidirectionnel)
SUPPORT_EMAIL=support@odillon.fr

# Email de contact principal (reste sur Infomaniak)
CONTACT_EMAIL=contact@odillon.fr

# Email d'envoi (utilisera le sous-domaine Resend)
FROM_EMAIL=Odillon <noreply@support.odillon.fr>

# Resend
RESEND_API_KEY=re_xxxxx
RESEND_WEBHOOK_SECRET=whsec_xxxxx
```

---

### Étape 6 : Configurer le webhook Resend

1. Allez sur https://resend.com/webhooks
2. Si vous avez déjà un webhook, **supprimez-le**
3. Cliquez sur **"Add Webhook"**
4. Configurez :
   - **URL** : `https://odillon.fr/api/webhooks/email-received`
   - **Events** : Cochez uniquement `email.received`
   - **Domain filter** : Sélectionnez `support.odillon.fr`
5. Cliquez sur **"Add Webhook"**
6. **Copiez le Signing Secret** et ajoutez-le dans `.env.local`

---

### Étape 7 : Mettre à jour le formulaire de contact

Le formulaire continuera d'envoyer des notifications à `contact@odillon.fr` (Infomaniak), mais on peut ajouter une copie à `support@odillon.fr` pour activer le webhook.

---

## 🧪 Test de la configuration

### Test 1 : Vérifier les DNS

```bash
# Vérifier l'enregistrement MX
nslookup -type=MX support.odillon.fr

# Doit retourner quelque chose comme :
# support.odillon.fr MX preference = 10, mail exchanger = inbound-smtp.us-east-1.amazonaws.com
```

### Test 2 : Envoyer un email de test

1. Depuis n'importe quelle boîte email, envoyez un email à `support@odillon.fr`
2. Vérifiez dans Resend Dashboard → Webhooks → Delivery Logs
3. Le webhook doit être appelé avec succès (200 OK)
4. Vérifiez dans Supabase → `contact_replies` : l'email doit apparaître

### Test 3 : Formulaire de contact complet

1. Remplissez le formulaire sur le site
2. Vérifiez que :
   - ✅ Email de notification → `contact@odillon.fr` (Infomaniak)
   - ✅ Copie pour webhook → `support@odillon.fr` (Resend)
   - ✅ Email de confirmation → Visiteur
3. Répondez depuis `contact@odillon.fr`
4. Transferez la réponse à `support@odillon.fr`
5. Le webhook doit capturer la réponse

---

## 🔍 Vérification des enregistrements DNS

Vous pouvez vérifier vos enregistrements DNS avec ces outils :

- **MX Toolbox** : https://mxtoolbox.com/SuperTool.aspx?action=mx%3asupport.odillon.fr
- **DNS Checker** : https://dnschecker.org/

---

## 📊 Architecture finale

```
┌─────────────────────────────────────────────┐
│         Formulaire de contact               │
└─────────────────────────────────────────────┘
                    ↓
    ┌───────────────────────────────┐
    │  POST /api/contact            │
    │  - Stockage Supabase          │
    │  - Envoi de 3 emails :        │
    └───────────────────────────────┘
                    ↓
        ┌───────────┴───────────┬──────────────────┐
        ↓                       ↓                  ↓
┌───────────────┐    ┌──────────────────┐  ┌─────────────┐
│ Notification  │    │ Copie webhook    │  │ Confirmation│
│ contact@      │    │ support@         │  │ au visiteur │
│ odillon.fr    │    │ odillon.fr       │  │             │
│               │    │                  │  │             │
│ → Infomaniak  │    │ → Resend         │  │ → Resend    │
│ (boîte mail)  │    │ (webhook activé) │  │             │
└───────────────┘    └──────────────────┘  └─────────────┘
                              ↓
                    ┌──────────────────┐
                    │ Webhook Resend   │
                    │ déclenché        │
                    └──────────────────┘
                              ↓
                    ┌──────────────────┐
                    │ POST /api/       │
                    │ webhooks/email-  │
                    │ received         │
                    └──────────────────┘
                              ↓
                    ┌──────────────────┐
                    │ Stockage dans    │
                    │ contact_replies  │
                    │ (direction=      │
                    │  'inbound')      │
                    └──────────────────┘
```

---

## ⚠️ Points importants

1. **Ne touchez PAS aux MX de `odillon.fr`** (le domaine racine)
   - Les MX de `odillon.fr` restent pointés vers Infomaniak
   - On ajoute UNIQUEMENT des enregistrements pour `support.odillon.fr`

2. **Propagation DNS**
   - Les changements DNS peuvent prendre 5 minutes à 24 heures
   - Utilisez `nslookup` pour vérifier

3. **Deux adresses email distinctes**
   - `contact@odillon.fr` : Votre boîte principale (Infomaniak)
   - `support@odillon.fr` : Boîte automatisée (Resend/Webhook)

4. **Workflow recommandé**
   - Les utilisateurs remplissent le formulaire
   - Vous recevez la notification sur `contact@odillon.fr`
   - Le webhook capture automatiquement via `support@odillon.fr`
   - Vous pouvez répondre depuis `contact@odillon.fr`
   - Pour que la réponse soit trackée, transférez-la à `support@odillon.fr`

---

## 🆘 Dépannage

### Le webhook ne se déclenche pas

1. ✅ Vérifiez que le MX de `support.odillon.fr` pointe vers Resend
2. ✅ Vérifiez que "Enable Receiving" est activé dans Resend
3. ✅ Envoyez un email directement à `support@odillon.fr` (pas via le formulaire)
4. ✅ Consultez les logs Resend

### Les emails n'arrivent nulle part

1. ✅ Vérifiez la propagation DNS avec `nslookup`
2. ✅ Vérifiez que vous avez bien ajouté l'enregistrement MX pour `support` (pas pour le domaine racine)

### Les emails arrivent en spam

1. ✅ Vérifiez que DKIM est configuré
2. ✅ Vérifiez que SPF est configuré
3. ✅ Attendez quelques heures pour la réputation du domaine

---

## ✅ Checklist de configuration

- [ ] Sous-domaine `support.odillon.fr` ajouté dans Resend
- [ ] Enregistrement MX configuré chez Infomaniak
- [ ] Enregistrement DKIM configuré
- [ ] Enregistrement SPF configuré
- [ ] Vérification DNS (tous verts dans Resend)
- [ ] "Enable Receiving" activé dans Resend
- [ ] Webhook créé et configuré
- [ ] Variables d'environnement mises à jour
- [ ] Test d'envoi d'email à `support@odillon.fr`
- [ ] Webhook se déclenche avec succès

---

**Prochaine étape** : Configuration du code pour utiliser `support@odillon.fr`
