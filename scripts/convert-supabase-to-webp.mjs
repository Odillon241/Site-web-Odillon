// Script pour convertir les images Supabase Storage en WebP
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
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

async function convertSupabaseImage(fileName) {
  try {
    console.log(`\n🔄 Conversion de ${fileName}...`)
    
    // 1. Télécharger l'image
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('hero-photos')
      .download(fileName)
    
    if (downloadError) {
      console.error(`❌ Erreur téléchargement: ${downloadError.message}`)
      return false
    }
    
    // 2. Convertir en WebP (nécessite sharp ou une API externe)
    // Pour l'instant, on va juste créer une nouvelle entrée avec l'URL WebP
    // L'utilisateur devra convertir manuellement ou utiliser un service
    
    const arrayBuffer = await downloadData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Utiliser sharp si disponible
    let sharp
    try {
      sharp = (await import('sharp')).default
    } catch {
      console.error('❌ Sharp n\'est pas installé')
      console.error('💡 Installez sharp: npm install sharp --save-dev')
      return false
    }
    
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85 })
      .toBuffer()
    
    // 3. Générer le nouveau nom
    const webpFileName = fileName.replace(/\.(png|jpg|jpeg)$/i, '.webp')
    
    // 4. Uploader la version WebP
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('hero-photos')
      .upload(webpFileName, webpBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: true
      })
    
    if (uploadError) {
      console.error(`❌ Erreur upload: ${uploadError.message}`)
      return false
    }
    
    // 5. Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('hero-photos')
      .getPublicUrl(webpFileName)
    
    console.log(`✅ ${fileName} → ${webpFileName}`)
    console.log(`   URL: ${publicUrl}`)
    
    // 6. Mettre à jour la base de données
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('id, url')
      .ilike('url', `%${fileName}%`)
    
    if (!photosError && photos && photos.length > 0) {
      for (const photo of photos) {
        const { error: updateError } = await supabase
          .from('photos')
          .update({ url: publicUrl })
          .eq('id', photo.id)
        
        if (updateError) {
          console.error(`⚠️  Erreur mise à jour DB: ${updateError.message}`)
        } else {
          console.log(`✅ Base de données mise à jour pour photo ${photo.id}`)
        }
      }
    }
    
    return true
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('🚀 Conversion des images Supabase Storage en WebP...\n')
  
  // Récupérer la liste des fichiers
  const { data: files, error } = await supabase.storage
    .from('hero-photos')
    .list()
  
  if (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
  
  // Filtrer les fichiers PNG/JPG
  const imagesToConvert = files.filter(file => 
    /\.(png|jpg|jpeg)$/i.test(file.name) && !file.name.endsWith('.webp')
  )
  
  console.log(`📋 ${imagesToConvert.length} image(s) à convertir\n`)
  
  let converted = 0
  for (const file of imagesToConvert) {
    const success = await convertSupabaseImage(file.name)
    if (success) converted++
  }
  
  console.log(`\n✅ Conversion terminée: ${converted}/${imagesToConvert.length} image(s) convertie(s)`)
}

main().catch(console.error)
