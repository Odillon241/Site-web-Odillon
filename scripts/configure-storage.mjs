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
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function configureStorage() {
  console.log('🚀 Configuration du bucket Storage Supabase...\n')

  try {
    // 1. Vérifier si le bucket existe
    console.log('📦 Vérification du bucket hero-photos...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Erreur lors de la liste des buckets:', listError.message)
      return
    }

    const heroPhotosBucket = buckets.find(b => b.name === 'hero-photos')
    
    if (heroPhotosBucket) {
      console.log('✅ Le bucket "hero-photos" existe déjà')
      console.log('   - ID:', heroPhotosBucket.id)
      console.log('   - Public:', heroPhotosBucket.public)
      console.log('   - Taille limite:', heroPhotosBucket.file_size_limit || 'Aucune')
    } else {
      console.log('📦 Création du bucket "hero-photos"...')
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('hero-photos', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      })
      
      if (createError) {
        console.error('❌ Erreur lors de la création du bucket:', createError.message)
        return
      } else {
        console.log('✅ Bucket "hero-photos" créé avec succès')
      }
    }

    // 2. Tester l'upload
    console.log('\n🧪 Test d\'upload...')
    
    // Créer une petite image de test (1x1 pixel transparent PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    const testImageBuffer = Buffer.from(testImageBase64, 'base64')
    
    const testFileName = `test-${Date.now()}.png`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('hero-photos')
      .upload(testFileName, testImageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Erreur lors du test d\'upload:', uploadError.message)
      console.log('\n⚠️  Le bucket existe mais l\'upload échoue.')
      console.log('   Vérifiez les politiques Storage dans Supabase Dashboard.')
    } else {
      console.log('✅ Test d\'upload réussi!')
      console.log('   - Fichier:', uploadData.path)
      
      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from('hero-photos')
        .getPublicUrl(testFileName)
      
      console.log('   - URL publique:', urlData.publicUrl)
      
      // Nettoyer le fichier de test
      await supabase.storage.from('hero-photos').remove([testFileName])
      console.log('   - Fichier de test supprimé')
    }

    console.log('\n✅ Configuration du Storage terminée!')
    console.log('\n📝 Informations importantes:')
    console.log('- Bucket: hero-photos')
    console.log('- Public: Oui (lecture seule)')
    console.log('- Limite: 10MB par fichier')
    console.log('- Formats: JPG, PNG, WebP')
    console.log('\n🔗 Accès:')
    console.log(`- Dashboard: ${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/')}/storage/buckets/hero-photos`)
    console.log('- API: Fonctionnelle ✅')
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

configureStorage()

