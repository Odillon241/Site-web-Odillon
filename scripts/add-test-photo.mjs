import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Charger les variables d'environnement
const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = {}

envContent.split('\n').forEach(line => {
  line = line.trim()
  if (!line || line.startsWith('#')) return
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function addTestPhotos() {
  console.log('📸 Ajout de photos de test pour Novembre Bleu...\n')

  const testPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&q=85',
      description: 'Équipe professionnelle africaine - Novembre Bleu 2024',
      month: 11,
      theme_id: 'novembre-bleu',
      is_active: true,
      display_order: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=85',
      description: 'Professionnels collaborant - Sensibilisation santé masculine',
      month: 11,
      theme_id: 'novembre-bleu',
      is_active: true,
      display_order: 2
    },
    {
      url: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1920&q=85',
      description: 'Leadership africain - Novembre Bleu',
      month: 11,
      theme_id: 'novembre-bleu',
      is_active: true,
      display_order: 3
    }
  ]

  try {
    const { data, error } = await supabase
      .from('photos')
      .insert(testPhotos)
      .select()

    if (error) {
      console.error('❌ Erreur:', error.message)
      return
    }

    console.log(`✅ ${data.length} photos de test ajoutées avec succès!\n`)
    
    data.forEach((photo, index) => {
      console.log(`📸 Photo ${index + 1}:`)
      console.log(`   - Description: ${photo.description}`)
      console.log(`   - Mois: ${photo.month}`)
      console.log(`   - Thématique: ${photo.theme_id}`)
      console.log(`   - Active: ${photo.is_active ? '✓' : '✗'}`)
      console.log(`   - ID: ${photo.id}\n`)
    })

    console.log('🎉 Rechargez la page d\'accueil pour voir les photos!')
    console.log('   URL: http://localhost:3000\n')

  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

addTestPhotos()

