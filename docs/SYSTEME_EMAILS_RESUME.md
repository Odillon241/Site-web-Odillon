# 📧 Système de Gestion des Emails - Résumé Complet

## ✅ Qu'est-ce qui a été créé ?

Un système complet de gestion bidirectionnelle des emails pour le formulaire de contact avec :

### 1. **Double envoi d'emails** lors d'une soumission de formulaire
- ✉️ Email de notification → `contact@odillon.fr`
- ✉️ Email de confirmation → Visiteur

### 2. **Réception des réponses par email**
- Les réponses envoyées à `contact@odillon.fr` sont automatiquement capturées
- Stockées dans Supabase avec le fil de conversation complet
- Association automatique au message original

### 3. **Historique complet des conversations**
- Tous les échanges (formulaire + emails) stockés dans Supabase
- Consultation possible via API
- Base pour future interface admin

---

## 📂 Fichiers créés

### Migrations Supabase

| Fichier | Description |
|---------|-------------|
| `supabase/migrations/20260114000000_create_contact_replies_table.sql` | Création de la table `contact_replies` pour stocker les réponses |

### Routes API

| Fichier | Endpoint | Description |
|---------|----------|-------------|
| `app/api/contact/route.ts` | `/api/contact` | **Mis à jour** : Formulaire de contact + enregistrement des emails sortants |
| `app/api/webhooks/email-received/route.ts` | `/api/webhooks/email-received` | **Nouveau** : Webhook Resend pour recevoir les emails entrants |
| `app/api/conversations/route.ts` | `/api/conversations` | **Nouveau** : Récupérer les conversations (messages + réponses) |

### Utilitaires

| Fichier | Description |
|---------|-------------|
| `lib/email-helpers.ts` | **Nouveau** : Helpers pour parser, rechercher et gérer les emails/conversations |

### Documentation

| Fichier | Description |
|---------|-------------|
| `docs/RESEND_WEBHOOK_CONFIGURATION.md` | Guide complet de configuration du webhook |
| `docs/QUICK_START_WEBHOOK.md` | Guide de démarrage rapide (5 min) |
| `docs/SYSTEME_EMAILS_RESUME.md` | Ce fichier - Résumé complet |
| `.env.example` | Template des variables d'environnement |

---

## 🗄️ Base de données

### Tables créées

#### `contact_messages` (existante, non modifiée)
Stocke les messages initiaux du formulaire de contact.

#### `contact_replies` (nouvelle)
Stocke toutes les réponses et échanges d'emails.

**Colonnes principales** :
- `contact_message_id` : Référence au message original
- `from_email`, `to_email` : Expéditeur et destinataire
- `subject`, `body_text`, `body_html` : Contenu de l'email
- `direction` : `inbound` (reçu) ou `outbound` (envoyé)
- `resend_email_id` : ID Resend pour récupération complète

### Fonctions SQL créées

- `get_contact_message_reply_count(message_id)` : Nombre de réponses d'un message
- `get_contact_message_last_reply(message_id)` : Date de la dernière réponse

---

## 🔄 Flux de fonctionnement

### 1. Soumission du formulaire

```
Visiteur → Formulaire de contact
           ↓
     POST /api/contact
           ↓
  ┌─────────────────────┐
  │ 1. Validation       │
  │ 2. Stockage dans    │
  │    contact_messages │
  └─────────────────────┘
           ↓
  ┌─────────────────────────────┐
  │ 3. Envoi de 2 emails :      │
  │    - Notification (équipe)  │
  │    - Confirmation (visiteur)│
  └─────────────────────────────┘
           ↓
  ┌─────────────────────────────┐
  │ 4. Stockage confirmation    │
  │    dans contact_replies     │
  │    (direction='outbound')   │
  └─────────────────────────────┘
```

### 2. Réception d'une réponse

```
Équipe répond à l'email
           ↓
  Email → contact@odillon.fr
           ↓
     Serveur Resend
           ↓
  Webhook déclenché
           ↓
POST /api/webhooks/email-received
           ↓
  ┌─────────────────────────────┐
  │ 1. Parse l'email            │
  │ 2. Recherche message        │
  │    original par email+sujet │
  └─────────────────────────────┘
           ↓
  ┌─────────────────────────────┐
  │ 3. Stockage dans            │
  │    contact_replies          │
  │    (direction='inbound')    │
  └─────────────────────────────┘
           ↓
  ┌─────────────────────────────┐
  │ 4. Mise à jour statut du    │
  │    message → 'replied'      │
  └─────────────────────────────┘
```

---

## 🔌 API Endpoints

### `POST /api/contact`
**Accès** : Public

**Fonction** : Soumettre un message de contact

**Body** :
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+241 XX XX XX XX",
  "company": "Entreprise SA",
  "subject": "Demande de renseignements",
  "message": "Bonjour, je souhaiterais..."
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Votre message a été envoyé avec succès.",
  "id": "uuid-du-message"
}
```

### `POST /api/webhooks/email-received`
**Accès** : Webhook Resend uniquement

**Fonction** : Recevoir les emails entrants

**Body** (envoyé par Resend) :
```json
{
  "type": "email.received",
  "created_at": "2026-01-14T12:00:00Z",
  "data": {
    "email_id": "xxx",
    "from": "client@example.com",
    "to": ["contact@odillon.fr"],
    "subject": "Re: Demande de renseignements",
    "text": "Merci pour votre réponse...",
    "html": "<p>Merci pour votre réponse...</p>"
  }
}
```

### `GET /api/conversations`
**Accès** : Admin authentifié uniquement

**Fonction** : Récupérer les conversations

**Paramètres** :
- `?status=new` : Filtrer par statut
- `?limit=10` : Limiter le nombre de résultats
- `?messageId=uuid` : Récupérer une conversation spécifique

**Réponse** :
```json
{
  "conversations": [
    {
      "message": {
        "id": "uuid",
        "name": "Jean Dupont",
        "email": "jean@example.com",
        "subject": "Demande de renseignements",
        "message": "Bonjour...",
        "status": "replied",
        "created_at": "2026-01-14T10:00:00Z"
      },
      "replies": [
        {
          "id": "uuid",
          "from_email": "noreply@odillon.fr",
          "to_email": "jean@example.com",
          "subject": "Confirmation de réception",
          "direction": "outbound",
          "created_at": "2026-01-14T10:00:01Z"
        },
        {
          "id": "uuid",
          "from_email": "jean@example.com",
          "to_email": "contact@odillon.fr",
          "subject": "Re: Demande de renseignements",
          "direction": "inbound",
          "created_at": "2026-01-14T12:00:00Z"
        }
      ],
      "replyCount": 2,
      "lastReplyAt": "2026-01-14T12:00:00Z"
    }
  ]
}
```

---

## 🛠️ Helpers disponibles

Dans `lib/email-helpers.ts` :

| Fonction | Description |
|----------|-------------|
| `parseEmailAddress(email)` | Parse "Name <email@domain.com>" |
| `cleanEmailSubject(subject)` | Nettoie Re:, Fwd: du sujet |
| `getConversationThread(messageId)` | Récupère un fil complet |
| `getAllConversations()` | Récupère toutes les conversations |
| `recordOutboundEmail(messageId, data)` | Enregistre un email sortant |
| `updateMessageStatus(messageId, status)` | Met à jour le statut |
| `findMessageByEmailAndSubject(email, subject)` | Recherche un message |
| `getConversationStats()` | Statistiques globales |

---

## ⚙️ Configuration requise

### Variables d'environnement

```env
# Resend
RESEND_API_KEY=re_xxxxx
CONTACT_EMAIL=contact@odillon.fr
FROM_EMAIL=Odillon <noreply@odillon.fr>
RESEND_WEBHOOK_SECRET=whsec_xxxxx (optionnel)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

### Configuration Resend

1. ✅ Domaine `odillon.fr` vérifié
2. ✅ Enregistrements DNS configurés (DKIM, SPF, MX)
3. ✅ **Enable Receiving** activé
4. ✅ Webhook créé : `https://odillon.fr/api/webhooks/email-received`

---

## 🧪 Tests

### Test 1 : Formulaire de contact

1. Remplir le formulaire sur `/contact`
2. ✅ Vérifier dans Supabase → `contact_messages`
3. ✅ Vérifier dans Supabase → `contact_replies` (email confirmation)
4. ✅ Vérifier la réception des 2 emails

### Test 2 : Réponse par email

1. Répondre à l'email depuis `contact@odillon.fr`
2. ✅ Vérifier dans Resend → Webhooks → Delivery Logs
3. ✅ Vérifier dans Supabase → `contact_replies` (email entrant)
4. ✅ Vérifier le statut du message → `replied`

### Test 3 : API Conversations

```bash
curl https://odillon.fr/api/conversations \
  -H "Authorization: Bearer TOKEN"
```

---

## 📊 Statistiques

### Nombre total de messages
```sql
SELECT COUNT(*) FROM contact_messages;
```

### Nombre de messages par statut
```sql
SELECT status, COUNT(*)
FROM contact_messages
GROUP BY status;
```

### Conversations avec réponses
```sql
SELECT
  cm.id,
  cm.subject,
  COUNT(cr.id) as reply_count
FROM contact_messages cm
LEFT JOIN contact_replies cr ON cr.contact_message_id = cm.id
GROUP BY cm.id, cm.subject
ORDER BY reply_count DESC;
```

---

## 🚀 Prochaines étapes suggérées

### Interface admin pour les conversations
- [ ] Créer un onglet "Conversations" dans `/admin/settings`
- [ ] Afficher les fils de discussion complets
- [ ] Permettre de répondre directement depuis l'interface
- [ ] Marquer comme lu/archivé

### Notifications
- [ ] Email à l'équipe quand une réponse arrive
- [ ] Badge de notification dans l'admin
- [ ] Notification push (optionnel)

### Automatisation
- [ ] Réponses automatiques conditionnelles
- [ ] Classification automatique (support, commercial, etc.)
- [ ] Assignation à des membres de l'équipe

### Sécurité
- [ ] Vérification signature Svix du webhook
- [ ] Rate limiting sur le webhook
- [ ] Validation stricte des données entrantes

---

## 📞 Support & Documentation

- **Guide complet** : `docs/RESEND_WEBHOOK_CONFIGURATION.md`
- **Démarrage rapide** : `docs/QUICK_START_WEBHOOK.md`
- **Documentation Resend** : https://resend.com/docs/dashboard/receiving/introduction
- **Dashboard Resend** : https://resend.com/webhooks

---

## ✅ Résumé

Vous disposez maintenant d'un système complet de gestion bidirectionnelle des emails :

- ✅ Formulaire de contact fonctionnel
- ✅ Double envoi d'emails (notification + confirmation)
- ✅ Réception automatique des réponses
- ✅ Stockage de l'historique complet dans Supabase
- ✅ API pour consulter les conversations
- ✅ Documentation complète

**Le système est prêt à l'emploi !** 🎉
