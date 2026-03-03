# Configuration du Webhook Resend pour la Réception d'Emails

Ce guide explique comment configurer le système de réception d'emails bidirectionnel avec Resend pour le formulaire de contact.

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Configuration dans Resend](#configuration-dans-resend)
4. [Configuration dans l'application](#configuration-dans-lapplication)
5. [Test du système](#test-du-système)
6. [Dépannage](#dépannage)
7. [Architecture technique](#architecture-technique)

---

## 🎯 Vue d'ensemble

### Fonctionnement actuel (sans webhook)

```
Visiteur → Formulaire → Supabase + Emails envoyés
```

### Fonctionnement avec webhook (bidirectionnel)

```
Visiteur → Formulaire → Supabase + Email à contact@odillon.fr
                                         ↓
                   Réponse de l'équipe → contact@odillon.fr
                                         ↓
                          Webhook Resend → API Next.js (/api/webhooks/email-received)
                                         ↓
                            Stockage dans Supabase (contact_replies)
                                         ↓
                            Notification + Affichage dans l'admin
```

### Avantages

- ✅ **Centralisation** : Toutes les communications (formulaire + emails) dans Supabase
- ✅ **Historique complet** : Voir tout le fil de conversation avec chaque client
- ✅ **Gestion simplifiée** : Gérer les conversations depuis le panneau admin
- ✅ **Automatisation** : Possibilité d'ajouter des réponses automatiques, tri, etc.

---

## ✅ Prérequis

### 1. Domaine vérifié dans Resend

Votre domaine `odillon.fr` doit être vérifié dans Resend avec :

- ✅ **DKIM** vérifié (pour l'envoi)
- ✅ **SPF** vérifié (pour l'envoi)
- ✅ **MX** configuré (pour la réception) ← **Important !**

### 2. Base de données à jour

La table `contact_replies` doit exister dans votre base Supabase. Elle a été créée automatiquement par la migration `20260114000000_create_contact_replies_table.sql`.

Vérifiez qu'elle existe :

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'contact_replies';
```

### 3. Variables d'environnement

Dans votre fichier `.env.local`, ajoutez (optionnel pour sécuriser le webhook) :

```env
# Optionnel : Secret du webhook pour vérifier les signatures
RESEND_WEBHOOK_SECRET=votre_secret_webhook
```

---

## 🔧 Configuration dans Resend

### Étape 1 : Activer la réception d'emails

1. Connectez-vous à [Resend Dashboard](https://resend.com/domains)
2. Sélectionnez votre domaine `odillon.fr`
3. Vérifiez que **Enable Receiving** est activé (toggle vert)
4. Assurez-vous que l'enregistrement MX est bien configuré

### Étape 2 : Créer le webhook

1. Allez dans [Webhooks](https://resend.com/webhooks)
2. Cliquez sur **"Add Webhook"**
3. Remplissez les informations :

   **Endpoint URL** :
   ```
   https://odillon.fr/api/webhooks/email-received
   ```

   > ⚠️ **Important** : Remplacez `odillon.fr` par votre nom de domaine de production.
   > Pour tester en local, utilisez un service comme [ngrok](https://ngrok.com/).

   **Events** :
   - ✅ Cochez uniquement : `email.received`

   **Description** (optionnel) :
   ```
   Webhook pour recevoir les emails entrants et les stocker dans Supabase
   ```

4. Cliquez sur **"Add Webhook"**

### Étape 3 : Récupérer le secret (optionnel mais recommandé)

1. Une fois le webhook créé, cliquez dessus
2. Copiez le **Signing Secret**
3. Ajoutez-le dans `.env.local` :
   ```env
   RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

## ⚙️ Configuration dans l'application

### 1. Variables d'environnement

Votre fichier `.env.local` doit contenir :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Resend
RESEND_API_KEY=re_xxxxx
CONTACT_EMAIL=contact@odillon.fr
FROM_EMAIL=Odillon <noreply@odillon.fr>

# Webhook (optionnel)
RESEND_WEBHOOK_SECRET=whsec_xxxxx
```

### 2. Redémarrer le serveur

Après avoir configuré le webhook dans Resend, redémarrez votre application :

```bash
npm run dev
```

Ou en production :

```bash
pm2 restart odillon-site
```

---

## 🧪 Test du système

### Test local avec ngrok

Si vous voulez tester en local avant de déployer en production :

1. **Installez ngrok** :
   ```bash
   npm install -g ngrok
   ```

2. **Démarrez votre serveur Next.js** :
   ```bash
   npm run dev
   ```

3. **Créez un tunnel ngrok** :
   ```bash
   ngrok http 3000
   ```

4. **Copiez l'URL HTTPS** (ex: `https://abc123.ngrok.io`)

5. **Configurez le webhook dans Resend** avec :
   ```
   https://abc123.ngrok.io/api/webhooks/email-received
   ```

6. **Testez** en envoyant un email à `contact@odillon.fr`

### Test en production

1. **Remplissez le formulaire de contact** sur votre site
2. **Vérifiez dans Supabase** :
   - Table `contact_messages` : Le message initial doit apparaître
   - Table `contact_replies` : L'email de confirmation doit apparaître avec `direction='outbound'`

3. **Répondez à l'email** depuis votre boîte `contact@odillon.fr`

4. **Vérifiez dans Supabase** :
   - Table `contact_replies` : La réponse doit apparaître avec `direction='inbound'`

5. **Vérifiez dans l'API** :
   ```bash
   curl https://odillon.fr/api/conversations \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## 🔍 Dépannage

### Le webhook ne reçoit rien

**Vérifiez** :

1. ✅ L'URL du webhook est correcte (HTTPS obligatoire en production)
2. ✅ L'enregistrement MX est bien configuré dans vos DNS
3. ✅ **Enable Receiving** est activé dans Resend
4. ✅ Vous avez bien envoyé un email à `contact@odillon.fr` (et non à une autre adresse)

**Logs Resend** :
- Allez dans [Resend Webhooks](https://resend.com/webhooks)
- Cliquez sur votre webhook
- Consultez les **Delivery Logs** pour voir les tentatives et erreurs

### Le webhook retourne une erreur 500

**Vérifiez** :

1. Les logs de votre serveur Next.js (voir les erreurs dans la console)
2. La base de données Supabase (la table `contact_replies` existe-t-elle ?)
3. Les variables d'environnement sont bien configurées

**Tester manuellement** :

```bash
curl -X POST https://odillon.fr/api/webhooks/email-received \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email.received",
    "created_at": "2026-01-14T12:00:00.000Z",
    "data": {
      "email_id": "test-123",
      "from": "test@example.com",
      "to": ["contact@odillon.fr"],
      "subject": "Test",
      "text": "Ceci est un test"
    }
  }'
```

### Les emails ne s'associent pas au bon message

Le système recherche le message original par :

1. **Email de l'expéditeur** (prioritaire)
2. **Sujet nettoyé** (sans "Re:", "Fwd:", etc.)

Si l'association échoue, un **nouveau message** est créé automatiquement.

**Pour forcer l'association**, assurez-vous que :
- L'email de réponse provient de la même adresse que le message original
- Le sujet contient au moins une partie du sujet original

---

## 🏗️ Architecture technique

### Tables Supabase

#### `contact_messages`
Messages initiaux du formulaire de contact.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | ID unique |
| name | TEXT | Nom du visiteur |
| email | TEXT | Email du visiteur |
| subject | TEXT | Sujet du message |
| message | TEXT | Contenu du message |
| status | TEXT | `new`, `read`, `replied`, `archived` |
| created_at | TIMESTAMPTZ | Date de création |

#### `contact_replies`
Réponses et échanges liés aux messages de contact.

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | ID unique |
| contact_message_id | UUID | FK vers `contact_messages` |
| from_email | TEXT | Email expéditeur |
| to_email | TEXT | Email destinataire |
| subject | TEXT | Sujet de l'email |
| body_text | TEXT | Contenu texte |
| body_html | TEXT | Contenu HTML |
| direction | TEXT | `inbound` (reçu) ou `outbound` (envoyé) |
| resend_email_id | TEXT | ID Resend pour récupération complète |
| created_at | TIMESTAMPTZ | Date de création |

### Routes API

#### `POST /api/contact`
- Crée un nouveau message de contact
- Envoie 2 emails (notification + confirmation)
- Enregistre l'email de confirmation dans `contact_replies` avec `direction='outbound'`

#### `POST /api/webhooks/email-received`
- Reçoit les événements `email.received` de Resend
- Trouve le message original associé
- Stocke la réponse dans `contact_replies` avec `direction='inbound'`
- Met à jour le statut du message original

#### `GET /api/conversations`
- Récupère toutes les conversations (admin uniquement)
- Supporte les filtres : `?status=new`, `?limit=10`, `?messageId=xxx`
- Retourne messages + leurs réponses

### Helpers (`lib/email-helpers.ts`)

- `parseEmailAddress()` : Parse "Name <email@domain.com>"
- `cleanEmailSubject()` : Nettoie les préfixes Re:, Fwd:
- `getConversationThread()` : Récupère un fil complet
- `getAllConversations()` : Récupère toutes les conversations
- `recordOutboundEmail()` : Enregistre un email sortant
- `updateMessageStatus()` : Met à jour le statut
- `findMessageByEmailAndSubject()` : Recherche un message

---

## 🚀 Prochaines étapes

### Fonctionnalités à ajouter (optionnel)

1. **Interface admin pour les conversations**
   - Afficher les fils de conversation
   - Répondre directement depuis l'interface
   - Marquer comme lu/archivé

2. **Notifications**
   - Email à l'équipe quand une réponse arrive
   - Badge de notification dans l'interface admin

3. **Automatisation**
   - Réponses automatiques conditionnelles
   - Classification automatique (support, commercial, etc.)
   - Assignation automatique à des membres de l'équipe

4. **Sécurité avancée**
   - Vérification de la signature Svix du webhook
   - Rate limiting sur le webhook
   - Validation stricte des données entrantes

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez les [logs Resend](https://resend.com/webhooks)
2. Vérifiez les logs de votre serveur Next.js
3. Consultez la [documentation Resend](https://resend.com/docs/dashboard/receiving/introduction)
4. Vérifiez la table `contact_replies` dans Supabase

---

**✅ Configuration terminée !** Votre système de réception d'emails bidirectionnel est maintenant opérationnel.
