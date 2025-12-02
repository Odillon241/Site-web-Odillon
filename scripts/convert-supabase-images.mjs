// Script pour convertir les images dans Supabase Storage en WebP
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import fetch from 'node-fetch'

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
    
    // 1. Télécharger l'image depuis Supabase Storage
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('hero-photos')
      .download(fileName)
    
    if (downloadError) {
      console.error(`❌ Erreur lors du téléchargement: ${downloadError.message}`)
      return false
    }
    
    // 2. Convertir en WebP
    const arrayBuffer = await downloadData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85 })
      .toBuffer()
    
    // 3. Générer le nouveau nom de fichier
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
      console.error(`❌ Erreur lors de l'upload: ${uploadError.message}`)
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
      .eq('url', `https://${supabaseUrl.split('//')[1]}/storage/v1/object/public/hero-photos/${fileName}`)
    
    if (!photosError && photos && photos.length > 0) {
      for (const photo of photos) {
        const { error: updateError } = await supabase
          .from('photos')
          .update({ url: publicUrl })
          .eq('id', photo.id)
        
        if (updateError) {
          console.error(`⚠️  Erreur lors de la mise à jour de la base: ${updateError.message}`)
        } else {
          console.log(`✅ Base de données mise à jour pour la photo ${photo.id}`)
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
    console.error('❌ Erreur lors de la récupération des fichiers:', error.message)
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
