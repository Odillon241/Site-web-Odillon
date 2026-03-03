# 📧 Configuration des Templates d'E-mail Supabase

Ce guide explique comment configurer les templates d'e-mail personnalisés pour le cabinet Odillon.

## 🎯 Templates configurés

Les templates suivants ont été créés en français :

1. **Réinitialisation du mot de passe** (`recovery`)
   - Sujet : "Réinitialisation de votre mot de passe - Cabinet Odillon"
   - Contenu HTML personnalisé avec les couleurs du cabinet

2. **Réauthentification** (`reauthentication`)
   - Sujet : "Code de vérification - Cabinet Odillon"
   - Contenu HTML personnalisé avec code OTP

3. **Confirmation de changement de mot de passe** (`secure_change_password`)
   - Sujet : "Confirmation de changement de mot de passe - Cabinet Odillon"
   - Contenu HTML personnalisé avec message de confirmation et lien vers l'espace admin

## 🚀 Installation

### Étape 1 : Obtenir un Access Token

1. Connectez-vous à votre compte Supabase : https://supabase.com/dashboard
2. Allez dans **Account Settings** > **Access Tokens** : https://supabase.com/dashboard/account/tokens
3. Cliquez sur **"Generate new token"**
4. Donnez-lui un nom (ex: "Email Templates Updater")
5. Copiez le token généré (⚠️ vous ne pourrez plus le voir après)

### Étape 2 : Ajouter le token dans .env.local

Ouvrez votre fichier `.env.local` et ajoutez :

```env
SUPABASE_ACCESS_TOKEN=votre-token-ici
```

⚠️ **Important** : Ne commitez jamais ce fichier ! Il est déjà dans `.gitignore`.

### Étape 3 : Exécuter le script

```bash
npm run update-email-templates
```

Le script va :
- ✅ Charger automatiquement le PROJECT_REF depuis `NEXT_PUBLIC_SUPABASE_URL`
- ✅ Mettre à jour les templates via l'API Management de Supabase
- ✅ Afficher un message de confirmation

## 📝 Contenu des templates

### Template de réinitialisation de mot de passe

- **Couleurs** : Utilise les couleurs de la marque Odillon (#1A9B8E, #C4D82E, #0A1F2C)
- **Variables disponibles** :
  - `{{ .ConfirmationURL }}` : Lien de réinitialisation
  - `{{ .Token }}` : Code OTP à 6 chiffres (alternative)
  - `{{ .SiteURL }}` : URL du site

### Template de réauthentification

- **Design** : Code de vérification mis en évidence dans un bloc sombre
- **Variables disponibles** :
  - `{{ .Token }}` : Code OTP à 6 chiffres
  - `{{ .SiteURL }}` : URL du site

### Template de confirmation de changement de mot de passe

- **Couleurs** : Utilise les couleurs de la marque Odillon (#1A9B8E, #C4D82E, #0A1F2C)
- **Variables disponibles** :
  - `{{ .Email }}` : Adresse e-mail de l'utilisateur
  - `{{ .SiteURL }}` : URL du site
- **Contenu** : Message de confirmation avec avertissement de sécurité et lien vers l'espace administration

## 🔄 Mettre à jour les templates

Si vous souhaitez modifier les templates :

1. Éditez le fichier `scripts/update-email-templates.mjs`
2. Modifiez les objets `mailer_templates_*_content` et `mailer_subjects_*`
3. Réexécutez : `npm run update-email-templates`

## ✅ Vérification

Pour tester les templates :

1. **Réinitialisation de mot de passe** :
   - Allez sur `/admin/login`
   - Cliquez sur "Mot de passe oublié ?"
   - Vérifiez votre boîte e-mail

2. **Réauthentification** :
   - Effectuez une action sensible nécessitant une réauthentification
   - Vérifiez votre boîte e-mail pour le code OTP

## 🎨 Personnalisation

Les templates utilisent :
- **Couleur principale** : `#1A9B8E` (odillon-teal)
- **Couleur accent** : `#C4D82E` (odillon-lime)
- **Couleur sombre** : `#0A1F2C` (odillon-dark)
- **Police** : Arial, sans-serif (compatible e-mail)

Pour modifier les couleurs, éditez les valeurs hexadécimales dans le script.

## 📚 Documentation Supabase

- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Management API](https://supabase.com/docs/reference/api/introduction)

## ⚠️ Notes importantes

1. **Access Token** : Gardez votre token secret et ne le partagez jamais
2. **Variables** : Les variables comme `{{ .ConfirmationURL }}` sont remplacées automatiquement par Supabase
3. **HTML** : Les templates utilisent du HTML inline pour une meilleure compatibilité avec les clients e-mail
4. **SMTP** : Assurez-vous que votre configuration SMTP Infomaniak est active dans Supabase

## 🐛 Dépannage

### Erreur : "SUPABASE_ACCESS_TOKEN non trouvé"
→ Vérifiez que vous avez ajouté le token dans `.env.local`

### Erreur : "NEXT_PUBLIC_SUPABASE_URL non trouvé"
→ Vérifiez que votre `.env.local` contient bien cette variable

### Erreur : "401 Unauthorized"
→ Votre access token est invalide ou expiré. Générez-en un nouveau.

### Erreur : "404 Not Found"
→ Vérifiez que le PROJECT_REF est correct (extrait de l'URL Supabase)

## 🔗 Configuration de l'URL de redirection

Pour que les liens de réinitialisation fonctionnent correctement, vous devez configurer l'URL de redirection dans Supabase :

1. Allez dans votre dashboard Supabase : https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Authentication** > **URL Configuration**
4. Dans la section **Redirect URLs**, ajoutez :
   ```
   http://localhost:3000/admin/reset-callback
   https://www.odillon.fr/admin/reset-callback
   https://odillon.fr/admin/reset-callback
   ```
   
   ⚠️ **Important** : Utilisez `/admin/reset-callback` et non `/admin/update-password` directement. La route callback gère correctement la redirection depuis Supabase.
5. Cliquez sur **Save**

⚠️ **Important** : Ajoutez toutes les URLs où votre application est accessible (localhost pour le développement, et vos domaines de production).

## 🔄 Flux de réinitialisation de mot de passe

1. L'utilisateur clique sur "Mot de passe oublié ?" sur `/admin/login`
2. Il est redirigé vers `/admin/reset-password`
3. Il entre son adresse e-mail
4. Il reçoit un e-mail avec un lien de réinitialisation
5. Il clique sur le lien dans l'e-mail
6. Il est redirigé vers `/admin/update-password` avec les paramètres `token_hash` et `type=recovery`
7. Il définit son nouveau mot de passe
8. Il est automatiquement redirigé vers `/admin/login` pour se connecter
