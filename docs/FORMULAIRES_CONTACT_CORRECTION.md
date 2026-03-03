# 🔧 Correction des formulaires de contact

## Problèmes identifiés

### 1. Table `contact_messages` inexistante dans Supabase ❌
L'API route `/api/contact` essayait d'insérer dans une table `contact_messages` qui n'avait jamais été créée dans la base de données Supabase.

**Solution** : ✅ Création de la migration `20260113000002_create_contact_messages_table.sql`

### 2. Formulaire `contact-home.tsx` non fonctionnel ❌
Le formulaire sur la page d'accueil n'avait aucun gestionnaire de soumission, juste du markup statique.

**Solution** : ✅ Ajout de la logique de soumission complète avec :
- Gestion des états (loading, success, error)
- Connexion à l'API `/api/contact`
- Messages de feedback utilisateur
- Réinitialisation du formulaire après succès

## Fichiers modifiés

1. **Migration Supabase créée** : `supabase/migrations/20260113000002_create_contact_messages_table.sql`
   - Création de la table `contact_messages` avec tous les champs requis
   - Policies RLS pour permettre l'insertion publique
   - Index pour optimiser les performances

2. **Composant corrigé** : `components/sections/contact-home.tsx`
   - Ajout des imports nécessaires (useState, useRef, Input, Textarea, Loader2, etc.)
   - Fonction `handleSubmit` pour gérer la soumission
   - Messages de succès/erreur avec icônes
   - État de chargement sur le bouton
   - Formulaire connecté avec attributs `name` corrects

3. **Composant déjà fonctionnel** : `components/sections/contact.tsx`
   - Aucune modification nécessaire, ce composant était déjà opérationnel

## Étapes pour finaliser la correction

### Étape 1 : Appliquer la migration Supabase

Vous avez **deux options** pour créer la table `contact_messages` :

#### Option A : Via l'interface web Supabase (Recommandé - Plus simple)

1. Connectez-vous à [https://supabase.com](https://supabase.com)
2. Sélectionnez votre projet (`xqkaraihiqqfcasmduuh`)
3. Allez dans **SQL Editor** (icône de database dans la sidebar)
4. Cliquez sur **"+ New query"**
5. Copiez-collez le contenu du fichier `supabase/migrations/20260113000002_create_contact_messages_table.sql`
6. Cliquez sur **"Run"** (bouton vert en bas à droite)
7. Vérifiez le message de succès

#### Option B : Via Supabase CLI

```bash
# 1. Démarrer Docker Desktop (si ce n'est pas déjà fait)

# 2. Appliquer la migration
supabase db push

# 3. Vérifier que la table a été créée
supabase db diff
```

### Étape 2 : Vérifier la création de la table

Depuis l'interface web Supabase :

1. Allez dans **Table Editor**
2. Cherchez la table `contact_messages`
3. Vérifiez que les colonnes suivantes existent :
   - `id` (UUID, PK)
   - `name` (TEXT)
   - `email` (TEXT)
   - `phone` (TEXT, nullable)
   - `company` (TEXT, nullable)
   - `subject` (TEXT)
   - `message` (TEXT)
   - `status` (TEXT, default: 'new')
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

### Étape 3 : Redémarrer le serveur de développement

```bash
# Arrêtez le serveur (Ctrl+C dans le terminal)

# Redémarrez
npm run dev
```

### Étape 4 : Tester les formulaires

#### Test 1 : Formulaire de la page d'accueil
1. Ouvrez [http://localhost:3000](http://localhost:3000)
2. Scrollez jusqu'à la section "Contact" (tout en bas)
3. Remplissez le formulaire :
   - **Nom** : Dupont
   - **Prénom** : Jean
   - **Email** : jean.dupont@example.com
   - **Message** : Test du formulaire de contact
4. Cliquez sur **"Envoyer le message"**
5. ✅ Vous devriez voir :
   - Un spinner pendant l'envoi
   - Un message de succès vert avec une icône de validation
   - Le formulaire réinitialisé

#### Test 2 : Formulaire de la page contact dédiée
1. Ouvrez [http://localhost:3000/contact](http://localhost:3000/contact)
2. Remplissez le formulaire complet :
   - **Nom complet** : Marie Dubois
   - **Email** : marie.dubois@example.com
   - **Téléphone** : +241 11 22 33 44 (optionnel)
   - **Entreprise** : Cabinet ACME (optionnel)
   - **Sujet** : Demande d'information
   - **Message** : Je souhaite obtenir plus d'informations sur vos services
3. Cliquez sur **"Envoyer le message"**
4. ✅ Vous devriez voir :
   - Un spinner pendant l'envoi
   - Un message de succès vert
   - Le formulaire réinitialisé

### Étape 5 : Vérifier dans Supabase

1. Retournez sur [https://supabase.com](https://supabase.com)
2. Allez dans **Table Editor** > `contact_messages`
3. ✅ Vous devriez voir vos deux messages de test avec :
   - Toutes les informations remplies
   - `status = 'new'`
   - `created_at` avec la date/heure actuelle

### Étape 6 : Tester l'envoi d'email (Optionnel)

Si vous avez configuré Resend (voir `docs/CONFIGURATION_EMAIL_CONTACT.md`) :

1. Envoyez un message via l'un des formulaires
2. Vérifiez votre boîte email `contact@odillon.fr`
3. ✅ Vous devriez recevoir un email formaté avec toutes les informations du message

**Note** : Si Resend n'est pas configuré, les messages sont quand même sauvegardés dans Supabase, mais aucun email n'est envoyé.

## Vérification des erreurs

### Erreur : "Table 'contact_messages' does not exist"

→ La migration n'a pas été appliquée. Retournez à l'**Étape 1**.

### Erreur : "Non authentifié" ou "Unauthorized"

→ Les RLS policies sont mal configurées. Vérifiez que la policy "Tout le monde peut envoyer un message de contact" existe et permet `INSERT TO public`.

### Erreur : "Email format invalide"

→ Validation côté serveur. Vérifiez que l'email est au bon format : `user@example.com`

### Formulaire ne répond pas

1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs JavaScript
3. Ouvrez l'onglet **Network** et observez la requête à `/api/contact`
4. Si erreur 500, vérifiez les logs du serveur Next.js dans le terminal

## Structure des données

### Format envoyé par le formulaire de la page d'accueil

```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "phone": "",
  "company": "",
  "subject": "Demande de contact via le formulaire d'accueil",
  "message": "Votre message ici..."
}
```

### Format envoyé par le formulaire de la page contact

```json
{
  "name": "Marie Dubois",
  "email": "marie.dubois@example.com",
  "phone": "+241 11 22 33 44",
  "company": "Cabinet ACME",
  "subject": "Demande d'information",
  "message": "Votre message ici..."
}
```

## Prochaines étapes

1. **Admin Dashboard** : Créer une interface admin pour visualiser et gérer les messages de contact (optionnel)
2. **Notifications** : Ajouter des notifications push ou Slack pour les nouveaux messages (optionnel)
3. **Auto-réponse** : Envoyer un email de confirmation automatique au client (optionnel)
4. **Spam protection** : Ajouter un CAPTCHA si nécessaire (optionnel)

## Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs du serveur Next.js (`npm run dev`)
2. Vérifiez les logs Supabase dans le dashboard
3. Vérifiez la console du navigateur (F12)
4. Consultez la documentation dans `docs/CONFIGURATION_EMAIL_CONTACT.md`
