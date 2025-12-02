#!/usr/bin/env node

/**
 * Script pour mettre à jour les templates d'e-mail Supabase
 * 
 * PRÉREQUIS :
 * 1. Obtenez un access token depuis https://supabase.com/dashboard/account/tokens
 * 2. Ajoutez-le dans .env.local : SUPABASE_ACCESS_TOKEN=votre-token
 * 3. Le PROJECT_REF est extrait automatiquement de NEXT_PUBLIC_SUPABASE_URL
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Fonction pour charger les variables d'environnement depuis .env.local
function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }
  
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    // Ignorer les commentaires et les lignes vides
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }
    
    // Parser KEY=VALUE
    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Supprimer les guillemets si présents
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Ne pas écraser les variables d'environnement existantes
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

// Charger les variables d'environnement depuis .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');
loadEnvFile(envPath);

const PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!PROJECT_REF) {
  console.error('❌ Erreur: NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env.local');
  console.error('   Assurez-vous que NEXT_PUBLIC_SUPABASE_URL est défini');
  process.exit(1);
}

if (!ACCESS_TOKEN) {
  console.error('❌ Erreur: SUPABASE_ACCESS_TOKEN non trouvé dans .env.local');
  console.error('');
  console.error('📝 Pour obtenir un access token:');
  console.error('   1. Allez sur https://supabase.com/dashboard/account/tokens');
  console.error('   2. Cliquez sur "Generate new token"');
  console.error('   3. Donnez-lui un nom (ex: "Email Templates Updater")');
  console.error('   4. Copiez le token généré');
  console.error('   5. Ajoutez-le dans .env.local : SUPABASE_ACCESS_TOKEN=votre-token');
  process.exit(1);
}

// Templates d'e-mail en français pour le cabinet Odillon
const templates = {
  // Réinitialisation du mot de passe
  mailer_subjects_recovery: 'Réinitialisation de votre mot de passe - Cabinet Odillon',
  mailer_templates_recovery_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de votre mot de passe</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #0A1F2C; background-color: #F9FAFB; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E5E7EB; max-width: 600px; width: 100%;">
          <!-- Header sobre -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #E5E7EB;">
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; color: #0A1F2C; margin: 0; letter-spacing: -0.02em;">Cabinet Odillon</h1>
            </td>
          </tr>
          
          <!-- Contenu principal -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #0A1F2C; margin: 0 0 24px; letter-spacing: -0.02em;">Réinitialisation de votre mot de passe</h2>
              
              <p style="font-size: 15px; color: #374151; margin: 0 0 16px; line-height: 1.6;">Bonjour,</p>
              
              <p style="font-size: 15px; color: #374151; margin: 0 0 24px; line-height: 1.6;">Vous avez demandé à réinitialiser votre mot de passe pour votre compte administrateur du site Odillon.</p>
              
              <p style="font-size: 15px; color: #374151; margin: 0 0 32px; line-height: 1.6;">Pour définir un nouveau mot de passe, veuillez cliquer sur le bouton ci-dessous :</p>
              
              <!-- Bouton sobre -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 0 0 32px;">
                    <a href="{{ .ConfirmationURL }}" 
                       style="display: inline-block; background-color: #1A9B8E; color: #FFFFFF; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-size: 15px; font-weight: 500; letter-spacing: -0.01em;">
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Code alternatif -->
              <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 4px; padding: 16px; margin: 0 0 32px;">
                <p style="font-size: 13px; color: #6B7280; margin: 0 0 8px;"><strong>Alternative :</strong> Si le bouton ne fonctionne pas, utilisez ce code :</p>
                <p style="font-family: 'Courier New', monospace; font-size: 18px; font-weight: 600; color: #0A1F2C; letter-spacing: 4px; margin: 0; text-align: center;">{{ .Token }}</p>
              </div>
              
              <!-- Avertissement -->
              <div style="border-top: 1px solid #E5E7EB; padding-top: 24px; margin-top: 24px;">
                <p style="font-size: 13px; color: #6B7280; margin: 0 0 16px; line-height: 1.5;">
                  <strong>Important :</strong> Ce lien est valide pendant une durée limitée. Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.
                </p>
              </div>
              
              <!-- Signature -->
              <p style="font-size: 15px; color: #374151; margin: 32px 0 0; line-height: 1.6;">
                Cordialement,<br>
                <strong style="color: #0A1F2C;">L'équipe du Cabinet Odillon</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
              <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 8px; text-align: center;">
                Cabinet Odillon - Ingénierie d'entreprise, Gouvernance, Juridique, Financier et RH
              </p>
              <p style="font-size: 12px; color: #9CA3AF; margin: 0; text-align: center;">
                <a href="{{ .SiteURL }}" style="color: #1A9B8E; text-decoration: none;">{{ .SiteURL }}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim(),

  // Réauthentification
  mailer_subjects_reauthentication: 'Code de vérification - Cabinet Odillon',
  mailer_templates_reauthentication_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code de vérification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #0A1F2C; background-color: #F9FAFB; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E5E7EB; max-width: 600px; width: 100%;">
          <!-- Header sobre -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #E5E7EB;">
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; color: #0A1F2C; margin: 0; letter-spacing: -0.02em;">Cabinet Odillon</h1>
            </td>
          </tr>
          
          <!-- Contenu principal -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #0A1F2C; margin: 0 0 24px; letter-spacing: -0.02em;">Confirmation de réauthentification</h2>
              
              <p style="font-size: 15px; color: #374151; margin: 0 0 16px; line-height: 1.6;">Bonjour,</p>
              
              <p style="font-size: 15px; color: #374151; margin: 0 0 24px; line-height: 1.6;">Vous avez demandé à effectuer une action sensible nécessitant une vérification supplémentaire de votre identité.</p>
              
              <p style="font-size: 15px; color: #374151; margin: 0 0 32px; line-height: 1.6;">Veuillez utiliser le code de vérification suivant pour confirmer votre identité :</p>
              
              <!-- Code de vérification sobre -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 0 0 32px;">
                    <div style="background-color: #0A1F2C; border: 1px solid #0A1F2C; border-radius: 4px; padding: 32px 40px; display: inline-block; min-width: 280px;">
                      <p style="font-size: 12px; color: #C4D82E; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Code de vérification</p>
                      <p style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 600; color: #FFFFFF; letter-spacing: 6px; margin: 0; text-align: center;">{{ .Token }}</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Avertissement sécurité -->
              <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 4px; padding: 16px; margin: 0 0 32px;">
                <p style="font-size: 13px; color: #92400E; margin: 0; line-height: 1.5;">
                  <strong>Sécurité :</strong> Ce code est valide pendant une durée limitée. Ne partagez jamais ce code avec quiconque. Si vous n'avez pas demandé cette vérification, veuillez ignorer cet e-mail et contacter l'administrateur.
                </p>
              </div>
              
              <!-- Signature -->
              <p style="font-size: 15px; color: #374151; margin: 32px 0 0; line-height: 1.6;">
                Cordialement,<br>
                <strong style="color: #0A1F2C;">L'équipe du Cabinet Odillon</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
              <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 8px; text-align: center;">
                Cabinet Odillon - Ingénierie d'entreprise, Gouvernance, Juridique, Financier et RH
              </p>
              <p style="font-size: 12px; color: #9CA3AF; margin: 0; text-align: center;">
                <a href="{{ .SiteURL }}" style="color: #1A9B8E; text-decoration: none;">{{ .SiteURL }}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim(),

  // Confirmation de changement de mot de passe
  mailer_subjects_secure_change_password: 'Confirmation de changement de mot de passe - Cabinet Odillon',
  mailer_templates_secure_change_password_content: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de changement de mot de passe</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #0A1F2C; background-color: #F9FAFB; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E5E7EB; max-width: 600px; width: 100%;">
          <!-- Header sobre -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #E5E7EB;">
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; color: #0A1F2C; margin: 0; letter-spacing: -0.02em;">Cabinet Odillon</h1>
            </td>
          </tr>
          
          <!-- Contenu principal -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #0A1F2C; margin: 0 0 24px; letter-spacing: -0.02em;">Confirmation de changement de mot de passe</h2>
              
              <p style="font-size: 15px; color: #374151; margin: 0 0 16px; line-height: 1.6;">Bonjour,</p>
              
              <p style="font-size: 15px; color: #374151; margin: 0 0 24px; line-height: 1.6;">Ceci est une confirmation que le mot de passe de votre compte <strong>{{ .Email }}</strong> vient d'être modifié avec succès.</p>
              
              <!-- Message de sécurité -->
              <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 4px; padding: 16px; margin: 0 0 32px;">
                <p style="font-size: 13px; color: #92400E; margin: 0; line-height: 1.5;">
                  <strong>Sécurité :</strong> Si vous n'avez pas effectué cette modification, veuillez contacter immédiatement le support technique pour sécuriser votre compte.
                </p>
              </div>
              
              <p style="font-size: 15px; color: #374151; margin: 0 0 24px; line-height: 1.6;">Votre compte est maintenant protégé par votre nouveau mot de passe. Vous pouvez vous connecter avec vos nouvelles identifiants.</p>
              
              <!-- Lien vers la connexion -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 0 0 32px;">
                    <a href="{{ .SiteURL }}/admin/login" 
                       style="display: inline-block; background-color: #1A9B8E; color: #FFFFFF; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-size: 15px; font-weight: 500; letter-spacing: -0.01em;">
                      Accéder à l'espace administration
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Signature -->
              <p style="font-size: 15px; color: #374151; margin: 32px 0 0; line-height: 1.6;">
                Cordialement,<br>
                <strong style="color: #0A1F2C;">L'équipe du Cabinet Odillon</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
              <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 8px; text-align: center;">
                Cabinet Odillon - Ingénierie d'entreprise, Gouvernance, Juridique, Financier et RH
              </p>
              <p style="font-size: 12px; color: #9CA3AF; margin: 0; text-align: center;">
                <a href="{{ .SiteURL }}" style="color: #1A9B8E; text-decoration: none;">{{ .SiteURL }}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim(),
};

async function updateEmailTemplates() {
  console.log('🚀 Mise à jour des templates d\'e-mail Supabase...\n');
  console.log(`📦 Project Ref: ${PROJECT_REF}\n`);

  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templates),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur lors de la mise à jour:');
      console.error(`   Status: ${response.status} ${response.statusText}`);
      console.error(`   Réponse: ${errorText}`);
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Templates d\'e-mail mis à jour avec succès !\n');
    console.log('📧 Templates configurés:');
    console.log('   ✓ Réinitialisation du mot de passe');
    console.log('   ✓ Réauthentification');
    console.log('   ✓ Confirmation de changement de mot de passe\n');
    console.log('💡 Vous pouvez maintenant tester en demandant une réinitialisation de mot de passe depuis votre interface admin.');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

updateEmailTemplates();
