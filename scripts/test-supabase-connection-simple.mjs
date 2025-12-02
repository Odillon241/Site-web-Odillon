import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Charger les variables d'environnement
const envPath = resolve(__dirname, '../.env.local')
let envContent
try {
  envContent = readFileSync(envPath, 'utf-8')
} catch (error) {
  console.error('❌ Impossible de lire .env.local:', error.message)
  process.exit(1)
}

const envVars = {}
envContent.split('\n').forEach(line => {
  line = line.trim()
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

console.log('🔍 Vérification de la configuration...')
console.log('URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante')
console.log('Service Key:', supabaseServiceKey ? '✅ Définie' : '❌ Manquante')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testAndUpdate() {
  try {
    console.log('\n🔍 Test de connexion à Supabase...')
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Erreur:', error.message)
      process.exit(1)
    }
    
    console.log(`✅ Connexion réussie! ${users.users.length} utilisateur(s) trouvé(s)`)
    
    const userEmail = 'dereckdanel@odillon.fr'
    const user = users.users.find(u => u.email === userEmail)
    
    if (!user) {
      console.error(`\n❌ Utilisateur ${userEmail} introuvable`)
      console.log('\nUtilisateurs disponibles:')
      users.users.forEach(u => console.log(`  - ${u.email}`))
      process.exit(1)
    }
    
    console.log(`\n✅ Utilisateur trouvé: ${user.email} (ID: ${user.id})`)
    console.log('\n🔄 Mise à jour du mot de passe...')
    
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: 'Reviti2025@' }
    )
    
    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour:', updateError.message)
      process.exit(1)
    }
    
    console.log('\n✅✅✅ MOT DE PASSE MIS À JOUR AVEC SUCCÈS! ✅✅✅')
    console.log(`📧 Email: ${data.user.email}`)
    console.log(`🔑 Nouveau mot de passe: Reviti2025@`)
    console.log('\n🎉 Vous pouvez maintenant vous connecter à http://localhost:3000/admin/login')
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    if (error.stack) console.error('Stack:', error.stack)
    process.exit(1)
  }
}

testAndUpdate()
