# 🚀 Guide rapide - Configuration support@odillon.fr

Configuration en **3 étapes** pour activer le système bidirectionnel sans toucher à votre boîte Infomaniak.

---

## ⚡ Configuration rapide

### Étape 1 : Ajouter le sous-domaine dans Resend (2 min)

1. Allez sur https://resend.com/domains
2. Cliquez sur **"Add Domain"**
3. Entrez : **`support.odillon.fr`**
4. Cliquez sur **"Add"**

Resend va afficher les enregistrements DNS à configurer. **Gardez cette page ouverte.**

---

### Étape 2 : Configurer les DNS chez Infomaniak (5 min)

Allez dans **Manager Infomaniak → Domaines → odillon.fr → Zone DNS**

Ajoutez ces 3 enregistrements (**copiez les valeurs exactes depuis Resend**) :

#### Enregistrement MX
```
Type: MX
Nom: support
Valeur: inbound-smtp.us-east-1.amazonaws.com (vérifiez dans Resend)
Priorité: 10
```

#### Enregistrement TXT (DKIM)
```
Type: TXT
Nom: resend._domainkey.support
Valeur: p=MIGfMA0GCSqGSIb3DQEBAQUAA... (copiez depuis Resend)
```

#### Enregistrement TXT (SPF)
```
Type: TXT
Nom: support
Valeur: v=spf1 include:amazonses.com ~all
```

**⚠️ Important** : Copiez les valeurs EXACTES depuis Resend !

Sauvegardez et **attendez 5-10 minutes** pour la propagation DNS.

---

### Étape 3 : Vérifier et activer (2 min)

1. Retournez sur https://resend.com/domains
2. Cliquez sur **`support.odillon.fr`**
3. Attendez que tous les indicateurs soient **verts** ✅
   - DKIM ✅
   - SPF ✅
   - MX ✅

4. Une fois tout vert, activez **"Enable Receiving"** (toggle en haut à droite)

---

### Étape 4 : Mettre à jour vos variables d'environnement (1 min)

Éditez votre fichier `.env.local` :

```env
# Ajouter cette ligne
SUPPORT_EMAIL=support@odillon.fr

# Modifier cette ligne
FROM_EMAIL=Odillon <noreply@support.odillon.fr>
```

Gardez les autres variables inchangées.

---

### Étape 5 : Configurer le webhook Resend (2 min)

1. Allez sur https://resend.com/webhooks
2. **Supprimez l'ancien webhook** s'il existe
3. Cliquez sur **"Add Webhook"**
4. Configurez :
   ```
   URL: https://odillon.fr/api/webhooks/email-received
   Events: ✅ email.received
   Domain: support.odillon.fr
   ```
5. Cliquez sur **"Add"**
6. **Copiez le Signing Secret** et ajoutez-le dans `.env.local` :
   ```env
   RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

### Étape 6 : Redémarrer l'application (1 min)

```bash
# Si en développement
# Arrêtez npm run dev (Ctrl+C) et relancez
npm run dev

# Si en production avec PM2
pm2 restart odillon-site
```

---

## 🧪 Test rapide

### Test 1 : Vérifier les DNS

```bash
nslookup -type=MX support.odillon.fr
```

Vous devriez voir : `inbound-smtp.us-east-1.amazonaws.com`

### Test 2 : Envoyer un email de test

1. Depuis Gmail ou n'importe quelle boîte, envoyez un email à **`support@odillon.fr`**
2. Allez sur https://resend.com/webhooks
3. Cliquez sur votre webhook
4. **Delivery Logs** → Vous devriez voir une requête avec statut **200 OK**
5. Vérifiez dans **Supabase → contact_replies** : l'email doit apparaître !

### Test 3 : Formulaire complet

1. Remplissez le formulaire sur **odillon.fr/contact**
2. Vous devriez recevoir **2 emails** :
   - Sur `contact@odillon.fr` (Infomaniak) → Notification
   - Sur `support@odillon.fr` (Resend) → Copie pour le webhook
3. Le visiteur reçoit un email de confirmation
4. Vérifiez dans Supabase : message + réponse auto enregistrés

---

## 📊 Comment ça marche maintenant ?

```
┌─────────────────────┐
│  Formulaire rempli  │
└─────────────────────┘
          ↓
    ┌─────────────┐
    │ 3 emails    │
    │ envoyés :   │
    └─────────────┘
          ↓
    ┌──────────────────────────────────┐
    │                                  │
    ↓                ↓                 ↓
┌────────────┐  ┌────────────┐  ┌─────────────┐
│ contact@   │  │ support@   │  │ Visiteur    │
│ odillon.fr │  │ odillon.fr │  │ (confirmat.)│
│            │  │            │  │             │
│ Infomaniak │  │ Resend     │  │ Resend      │
│ (votre     │  │ (webhook   │  │             │
│  boîte)    │  │  activé)   │  │             │
└────────────┘  └────────────┘  └─────────────┘
                      ↓
                ┌──────────┐
                │ Webhook  │
                │ déclenché│
                └──────────┘
                      ↓
                ┌──────────┐
                │ Stockage │
                │ Supabase │
                └──────────┘
```

**Résultat** :
- ✅ Vous recevez toujours sur `contact@odillon.fr` (Infomaniak)
- ✅ Le système bidirectionnel fonctionne via `support@odillon.fr`
- ✅ Historique complet dans Supabase
- ✅ Aucun conflit MX

---

## ❓ FAQ

### Les emails arrivent-ils dans les deux boîtes ?

**Non.** Chaque email va à **une seule** adresse :
- `contact@odillon.fr` → Infomaniak (vous lisez ici)
- `support@odillon.fr` → Resend (webhook automatique)

### Dois-je consulter support@odillon.fr ?

**Non.** `support@odillon.fr` est une boîte technique. Vous n'y accédez pas directement. Le webhook capture automatiquement les emails et les stocke dans Supabase.

### Que se passe-t-il quand je réponds depuis contact@odillon.fr ?

Votre réponse part normalement depuis Infomaniak. Pour qu'elle soit trackée dans le système :
- **Option 1** : Transférez votre réponse à `support@odillon.fr` (le webhook la capturera)
- **Option 2** : Répondez normalement, mais elle ne sera pas dans l'historique automatique

### Puis-je désactiver le système ?

Oui ! Supprimez simplement `SUPPORT_EMAIL` de `.env.local`. Le formulaire continuera de fonctionner avec `contact@odillon.fr` uniquement.

---

## ✅ Checklist complète

- [ ] Sous-domaine `support.odillon.fr` ajouté dans Resend
- [ ] 3 enregistrements DNS configurés chez Infomaniak (MX, DKIM, SPF)
- [ ] Attente propagation DNS (5-10 min)
- [ ] Tous les indicateurs verts dans Resend
- [ ] "Enable Receiving" activé
- [ ] Webhook créé et configuré
- [ ] `SUPPORT_EMAIL` ajouté dans `.env.local`
- [ ] `FROM_EMAIL` mis à jour
- [ ] `RESEND_WEBHOOK_SECRET` configuré
- [ ] Application redémarrée
- [ ] Test DNS réussi (nslookup)
- [ ] Test email direct à support@odillon.fr réussi
- [ ] Test formulaire complet réussi

---

## 🎉 C'est terminé !

Votre système bidirectionnel est maintenant opérationnel :

- ✅ **contact@odillon.fr** : Votre boîte principale (Infomaniak)
- ✅ **support@odillon.fr** : Boîte automatisée (Resend + Webhook)
- ✅ Historique complet dans Supabase
- ✅ Aucune perte d'emails

**Documentation complète** : `docs/CONFIGURATION_SOUS_DOMAINE_SUPPORT.md`
