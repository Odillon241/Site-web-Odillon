import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Charger les variables d'environnement depuis .env.local
const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = {}

envContent.split('\n').forEach(line => {
  line = line.trim()
  // Ignorer les lignes vides et les commentaires
  if (!line || line.startsWith('#')) return
  
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    const value = match[2].trim()
    envVars[key] = value
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Configuration
const userEmail = 'dereckdanel@odillon.fr'
const newPassword = 'Reviti2025@'

async function updateUserPassword() {
  console.log('🔐 Mise à jour du mot de passe utilisateur...\n')
  console.log(`📧 Email: ${userEmail}`)
  console.log(`🔑 Nouveau mot de passe: ${newPassword}\n`)

  try {
    // D'abord, récupérer l'utilisateur par email
    console.log('🔍 Recherche de l\'utilisateur...')
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', listError.message)
      console.error('Détails:', JSON.stringify(listError, null, 2))
      process.exit(1)
    }

    if (!users || !users.users) {
      console.error('❌ Aucun utilisateur trouvé dans la réponse')
      process.exit(1)
    }

    console.log(`📋 ${users.users.length} utilisateur(s) trouvé(s)\n`)

    const user = users.users.find(u => u.email === userEmail)
    
    if (!user) {
      console.error(`❌ Utilisateur avec l'email ${userEmail} introuvable`)
      console.log('\n📋 Utilisateurs disponibles:')
      users.users.forEach(u => {
        console.log(`  - ${u.email} (ID: ${u.id})`)
      })
      process.exit(1)
    }

    console.log(`✅ Utilisateur trouvé: ${user.email} (ID: ${user.id})\n`)

    // Mettre à jour le mot de passe
    console.log('🔄 Mise à jour du mot de passe...')
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        password: newPassword
      }
    )

    if (error) {
      console.error('❌ Erreur lors de la mise à jour du mot de passe:', error.message)
      console.error('Détails:', JSON.stringify(error, null, 2))
      process.exit(1)
    }

    if (!data || !data.user) {
      console.error('❌ Réponse invalide de Supabase')
      process.exit(1)
    }

    console.log('\n✅ Mot de passe mis à jour avec succès!')
    console.log(`📧 Email: ${data.user.email}`)
    console.log(`🆔 User ID: ${data.user.id}`)
    console.log('\n🎉 Vous pouvez maintenant vous connecter avec ce mot de passe à : http://localhost:3000/admin/login')
    
    // Écrire aussi dans un fichier de log
    const logMessage = `✅ Mot de passe mis à jour avec succès!\nEmail: ${data.user.email}\nUser ID: ${data.user.id}\nDate: ${new Date().toISOString()}\n`
    writeFileSync(resolve(__dirname, '../password-update-log.txt'), logMessage)
    console.log('\n📝 Log sauvegardé dans password-update-log.txt')
  } catch (error) {
    console.error('❌ Erreur inattendue:', error.message)
    console.error('Stack:', error.stack)
    
    // Écrire l'erreur dans le log
    const errorMessage = `❌ Erreur: ${error.message}\nStack: ${error.stack}\nDate: ${new Date().toISOString()}\n`
    writeFileSync(resolve(__dirname, '../password-update-log.txt'), errorMessage)
    
    process.exit(1)
  }
}

updateUserPassword()
