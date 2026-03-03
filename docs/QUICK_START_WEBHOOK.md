# 🚀 Guide de démarrage rapide - Webhook Resend

Configuration en **5 minutes** du système de réception d'emails bidirectionnel.

---

## ✅ Checklist de configuration

### 1. Vérifier la base de données

La migration a déjà été appliquée. Vérifiez que la table existe :

```bash
# Via l'outil Supabase MCP ou dans le dashboard Supabase
# Table : contact_replies
```

✅ **Fait** : La table `contact_replies` a été créée avec succès.

---

### 2. Configurer le webhook dans Resend

**URL du webhook** (production) :
```
https://odillon.fr/api/webhooks/email-received
```

**Étapes** :

1. Allez sur https://resend.com/webhooks
2. Cliquez sur **"Add Webhook"**
3. Collez l'URL ci-dessus
4. Cochez uniquement : **`email.received`**
5. Cliquez sur **"Add Webhook"**

✅ **Optionnel** : Copiez le **Signing Secret** et ajoutez-le dans `.env.local` :
```env
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

---

### 3. Vérifier les DNS (MX records)

Dans votre dashboard Resend, sous **Domains** → `odillon.fr`, vérifiez que :

- ✅ **DKIM** : Vérifié (vert)
- ✅ **SPF** : Vérifié (vert)
- ✅ **MX** : Vérifié (vert) ← **Important pour recevoir les emails !**

Si MX n'est pas configuré, ajoutez l'enregistrement MX dans vos DNS Infomaniak :

```
Type: MX
Name: @
Value: inbound-smtp.us-east-1... (voir dans Resend)
Priority: 10
```

---

### 4. Tester le système

#### Test 1 : Envoi depuis le formulaire

1. Allez sur `https://odillon.fr/contact`
2. Remplissez et envoyez le formulaire
3. Vérifiez dans Supabase → `contact_messages` : le message apparaît
4. Vérifiez dans Supabase → `contact_replies` : l'email de confirmation apparaît avec `direction='outbound'`

#### Test 2 : Réception d'une réponse

1. Depuis votre boîte `contact@odillon.fr`, répondez à l'email
2. Attendez quelques secondes
3. Vérifiez dans Supabase → `contact_replies` : la réponse apparaît avec `direction='inbound'`
4. Vérifiez dans `contact_messages` : le statut est passé à `replied`

---

## 🔍 Vérification rapide

### Logs Resend

https://resend.com/webhooks → Cliquez sur votre webhook → **Delivery Logs**

Vous devriez voir les requêtes POST avec statut `200 OK`.

### Logs serveur

```bash
# En production (PM2)
pm2 logs odillon-site

# En développement
# Regardez la console où tourne `npm run dev`
```

Recherchez les messages :
- `📧 Email reçu:` (quand un email arrive)
- `✅ Réponse stockée avec succès:` (quand c'est stocké en base)

---

## 📊 Récapitulatif de l'architecture

### Flux complet

```
1. Visiteur remplit le formulaire
   ↓
2. POST /api/contact
   ↓
3. Stockage dans contact_messages
   ↓
4. Envoi de 2 emails :
   - Notification → contact@odillon.fr
   - Confirmation → visiteur
   ↓
5. Stockage de la confirmation dans contact_replies (direction='outbound')
   ↓
6. Équipe répond à l'email
   ↓
7. Resend reçoit l'email et appelle le webhook
   ↓
8. POST /api/webhooks/email-received
   ↓
9. Recherche du message original
   ↓
10. Stockage dans contact_replies (direction='inbound')
    ↓
11. Mise à jour du statut du message → 'replied'
```

### Tables créées

- **`contact_messages`** : Messages initiaux du formulaire
- **`contact_replies`** : Toutes les réponses (emails entrants et sortants)

### Routes API créées

- **`POST /api/contact`** : Formulaire de contact
- **`POST /api/webhooks/email-received`** : Webhook Resend
- **`GET /api/conversations`** : Récupérer les conversations (admin)

### Fichiers créés

- **Migration** : `supabase/migrations/20260114000000_create_contact_replies_table.sql`
- **Webhook** : `app/api/webhooks/email-received/route.ts`
- **Helpers** : `lib/email-helpers.ts`
- **API** : `app/api/conversations/route.ts`
- **Docs** : `docs/RESEND_WEBHOOK_CONFIGURATION.md` (guide complet)

---

## 🎯 Utilisation

### Récupérer toutes les conversations (API)

```bash
curl https://odillon.fr/api/conversations \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

### Récupérer une conversation spécifique

```bash
curl "https://odillon.fr/api/conversations?messageId=UUID" \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

### Filtrer par statut

```bash
curl "https://odillon.fr/api/conversations?status=new&limit=10" \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

---

## 🐛 Problèmes courants

### Le webhook ne reçoit rien

1. ✅ Vérifiez que **Enable Receiving** est activé dans Resend
2. ✅ Vérifiez les enregistrements MX dans vos DNS
3. ✅ Testez avec un email à `contact@odillon.fr` (pas une autre adresse)

### Erreur 500 sur le webhook

1. ✅ Vérifiez les logs du serveur
2. ✅ Vérifiez que la table `contact_replies` existe
3. ✅ Vérifiez les variables d'environnement

### Les emails ne s'associent pas

Le système recherche par email et sujet. Si aucune correspondance :
- Un **nouveau message** est créé automatiquement
- C'est normal si c'est un premier contact par email direct

---

## 📚 Documentation complète

Pour plus de détails, consultez :
- **`docs/RESEND_WEBHOOK_CONFIGURATION.md`** : Guide complet avec architecture détaillée

---

## ✅ C'est terminé !

Votre système de réception d'emails bidirectionnel est maintenant opérationnel. 🎉

**Prochaines étapes suggérées** :
1. Créer une interface admin pour visualiser les conversations
2. Ajouter des notifications quand une réponse arrive
3. Implémenter des réponses automatiques conditionnelles
