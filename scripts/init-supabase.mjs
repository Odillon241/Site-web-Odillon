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

console.log('Variables trouvées:', Object.keys(envVars))

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

async function initSupabase() {
  console.log('🚀 Initialisation de Supabase...\n')

  // 1. Vérifier/Créer le bucket hero-photos
  console.log('📦 Vérification du bucket Storage...')
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Erreur lors de la liste des buckets:', listError.message)
    } else {
      const heroPhotosBucket = buckets.find(b => b.name === 'hero-photos')
      
      if (heroPhotosBucket) {
        console.log('✅ Le bucket "hero-photos" existe déjà')
      } else {
        console.log('📦 Création du bucket "hero-photos"...')
        const { error: createError } = await supabase.storage.createBucket('hero-photos', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        })
        
        if (createError) {
          console.error('❌ Erreur lors de la création du bucket:', createError.message)
        } else {
          console.log('✅ Bucket "hero-photos" créé avec succès')
        }
      }
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }

  // 2. Créer l'utilisateur admin
  console.log('\n👤 Création de l\'utilisateur admin...')
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@odillon.com',
      password: 'Admin@Odillon2024',
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        full_name: 'Administrateur Odillon'
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('⚠️  L\'utilisateur admin existe déjà')
        console.log('📧 Email: admin@odillon.com')
        console.log('🔑 Mot de passe: Admin@Odillon2024')
      } else {
        console.error('❌ Erreur lors de la création de l\'utilisateur:', error.message)
      }
    } else {
      console.log('✅ Utilisateur admin créé avec succès!')
      console.log('📧 Email: admin@odillon.com')
      console.log('🔑 Mot de passe: Admin@Odillon2024')
      console.log('🆔 User ID:', data.user.id)
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }

  // 3. Vérifier les tables
  console.log('\n📊 Vérification des tables...')
  try {
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('count')
      .limit(1)
    
    if (photosError) {
      console.error('❌ Table photos:', photosError.message)
    } else {
      console.log('✅ Table photos: OK')
    }

    const { data: themes, error: themesError } = await supabase
      .from('photo_themes')
      .select('count')
      .limit(1)
    
    if (themesError) {
      console.error('❌ Table photo_themes:', themesError.message)
    } else {
      console.log('✅ Table photo_themes: OK')
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }

  console.log('\n✨ Initialisation terminée!\n')
  console.log('📝 Prochaines étapes:')
  console.log('1. Connectez-vous à l\'interface admin: http://localhost:3000/admin/login')
  console.log('2. Créez votre utilisateur admin avec: node scripts/create-admin-user.mjs')
  console.log('3. Commencez à ajouter des photos pour le Hero!\n')
}

initSupabase()

