# 📧 Configuration de l'envoi d'emails pour le formulaire de contact

Ce guide explique comment configurer l'envoi automatique d'emails de notification lorsqu'un message de contact est reçu.

## 🎯 Fonctionnement

Lorsqu'un visiteur envoie un message via le formulaire de contact :
1. Le message est sauvegardé dans la base de données Supabase (`contact_messages`)
2. Un email de notification est automatiquement envoyé à `contact@odillon.fr` (ou l'email configuré)
3. L'email contient toutes les informations du message (nom, email, téléphone, entreprise, sujet, message)

## 📦 Service utilisé : Resend

Le projet utilise [Resend](https://resend.com/) pour l'envoi d'emails. Resend est un service moderne et fiable pour l'envoi d'emails transactionnels.

### Avantages de Resend :
- ✅ API simple et moderne
- ✅ Bonne délivrabilité
- ✅ Plan gratuit généreux (100 emails/jour)
- ✅ Support des domaines personnalisés
- ✅ Intégration facile avec Next.js

## 🚀 Configuration

### Étape 1 : Créer un compte Resend

1. Allez sur https://resend.com
2. Créez un compte (gratuit)
3. Vérifiez votre email

### Étape 2 : Obtenir une clé API

1. Dans votre dashboard Resend, allez dans **API Keys**
2. Cliquez sur **"Create API Key"**
3. Donnez-lui un nom (ex: "Odillon Contact Form")
4. Sélectionnez les permissions : **"Sending access"**
5. Copiez la clé API générée (⚠️ vous ne pourrez plus la voir après)

### Étape 3 : Vérifier votre domaine (optionnel mais recommandé)

Pour utiliser votre propre domaine (ex: `noreply@odillon.fr`) :

1. Dans Resend, allez dans **Domains**
2. Cliquez sur **"Add Domain"**
3. Entrez votre domaine : `odillon.fr`
4. Suivez les instructions pour ajouter les enregistrements DNS :
   - Un enregistrement SPF
   - Un enregistrement DKIM
   - Un enregistrement DMARC (optionnel)
5. Attendez la vérification (quelques minutes)

**Note** : Si vous n'avez pas encore vérifié votre domaine, vous pouvez utiliser l'email de test de Resend : `onboarding@resend.dev` (limité à 100 emails/jour)

### Étape 4 : Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=contact@odillon.fr
FROM_EMAIL=Odillon <noreply@odillon.fr>
```

**Variables :**
- `RESEND_API_KEY` : Votre clé API Resend (obligatoire)
- `CONTACT_EMAIL` : L'email qui recevra les notifications (défaut: `contact@odillon.fr`)
- `FROM_EMAIL` : L'email expéditeur (défaut: `Odillon <noreply@odillon.fr>`)

**Important** :
- Si `RESEND_API_KEY` n'est pas configuré, les messages seront quand même sauvegardés en base de données, mais aucun email ne sera envoyé
- Si `CONTACT_EMAIL` n'est pas configuré, l'email sera envoyé à `contact@odillon.fr` par défaut

### Étape 5 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
```

## 📧 Format de l'email

L'email de notification contient :
- **En-tête** : Titre avec les couleurs de la marque Odillon
- **Informations de l'expéditeur** : Nom, email, téléphone (si fourni), entreprise (si fournie)
- **Sujet** : Le sujet du message
- **Message** : Le contenu du message
- **Métadonnées** : Date de réception et ID du message

L'email utilise le `replyTo` de l'expéditeur, donc vous pouvez répondre directement depuis votre client email.

## 🔒 Sécurité

- ✅ Toutes les données utilisateur sont échappées pour éviter les injections XSS
- ✅ La clé API Resend est stockée côté serveur uniquement (jamais exposée au client)
- ✅ Les emails sont envoyés de manière asynchrone (ne bloque pas la réponse)
- ✅ Si l'envoi d'email échoue, le message est quand même sauvegardé en base de données

## 🧪 Tester

1. Remplissez le formulaire de contact sur votre site
2. Envoyez le message
3. Vérifiez votre boîte email (`contact@odillon.fr` ou l'email configuré)
4. Vous devriez recevoir un email avec toutes les informations du message

## 🐛 Dépannage

### Aucun email reçu

1. **Vérifiez les variables d'environnement** :
   ```bash
   # Vérifiez que RESEND_API_KEY est bien défini
   echo $RESEND_API_KEY
   ```

2. **Vérifiez les logs du serveur** :
   - Ouvrez la console du terminal où tourne `npm run dev`
   - Cherchez les erreurs commençant par "Erreur lors de l'envoi de l'email"

3. **Vérifiez votre compte Resend** :
   - Allez dans **Logs** de votre dashboard Resend
   - Vérifiez si les emails sont envoyés et s'il y a des erreurs

4. **Vérifiez les spams** :
   - L'email peut être dans votre dossier spam
   - Vérifiez aussi les filtres de votre boîte email

### Erreur : "Invalid API key"

→ Votre clé API Resend est incorrecte. Vérifiez que vous avez copié la bonne clé.

### Erreur : "Domain not verified"

→ Si vous utilisez un domaine personnalisé (ex: `noreply@odillon.fr`), vous devez d'abord vérifier votre domaine dans Resend.

**Solution temporaire** : Utilisez `onboarding@resend.dev` comme `FROM_EMAIL` pour tester.

## 📝 Notes importantes

- **Plan gratuit Resend** : 100 emails/jour, 3000 emails/mois
- **Limite de débit** : 10 emails/seconde
- **Prix** : Gratuit jusqu'à 3000 emails/mois, puis $20/mois pour 50 000 emails

Pour un site professionnel, le plan gratuit devrait suffire largement pour les messages de contact.

## 🔗 Ressources

- [Documentation Resend](https://resend.com/docs)
- [Guide Supabase - Envoi d'emails](https://supabase.com/docs/guides/functions/examples/send-emails)
- [Dashboard Resend](https://resend.com/emails)
