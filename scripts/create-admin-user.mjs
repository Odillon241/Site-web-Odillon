import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
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

async function createAdminUser() {
  console.log('🚀 Création de l\'utilisateur admin...\n')

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'dereckdanel@odillon.fr',
      password: 'Reviti2025@',
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        full_name: 'Dereck Danel'
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('⚠️  L\'utilisateur existe déjà')
        console.log('📧 Email: dereckdanel@odillon.fr')
        console.log('🔑 Mot de passe: Reviti2025@')
        console.log('\n💡 Si vous avez oublié le mot de passe, vous pouvez le réinitialiser via Supabase Dashboard.')
      } else {
        console.error('❌ Erreur lors de la création de l\'utilisateur:', error.message)
      }
    } else {
      console.log('✅ Utilisateur admin créé avec succès!')
      console.log('📧 Email: dereckdanel@odillon.fr')
      console.log('🔑 Mot de passe: Reviti2025@')
      console.log('🆔 User ID:', data.user.id)
      console.log('\n🎉 Vous pouvez maintenant vous connecter à : http://localhost:3000/admin/login')
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

createAdminUser()

