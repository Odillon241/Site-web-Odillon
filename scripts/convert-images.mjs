// Script de conversion des images en WebP
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

let sharp
try {
  sharp = require('sharp')
} catch (error) {
  console.error('❌ Erreur: sharp n\'est pas installé')
  console.error('   Exécutez: npm install sharp --save-dev')
  process.exit(1)
}

import { promises as fs } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const images = [
  'public/logo-odillon.png',
  'public/favicon-odillon.png',
  'public/icons/3d/calendar.png',
  'public/icons/3d/chat.png',
  'public/icons/3d/checkmark.png',
  'public/icons/3d/document.png',
  'public/icons/3d/folder.png',
  'public/icons/3d/mail.png',
  'public/icons/3d/shield.png',
  'public/icons/3d/users.png',
  'public/images/logos/caistab.png',
  'public/images/logos/cdc.png',
  'public/images/logos/edg.jpg',
  'public/images/logos/seeg.jpg',
  'public/images/logos/sem.png',
  'public/images/logos/uba.jpg'
]

let converted = 0
let errors = 0
let totalBefore = 0
let totalAfter = 0

async function convert(imgPath) {
  const fullPath = join(projectRoot, imgPath)
  const webpPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  
  try {
    // Vérifier si le fichier existe
    await fs.access(fullPath)
    
    // Vérifier si WebP existe déjà
    try {
      await fs.access(webpPath)
      console.log(`⏭️  ${imgPath} → WebP existe déjà`)
      return
    } catch {}
    
    // Stats avant
    const before = await fs.stat(fullPath)
    totalBefore += before.size
    
    // Convertir
    await sharp(fullPath)
      .webp({ quality: 85 })
      .toFile(webpPath)
    
    // Stats après
    const after = await fs.stat(webpPath)
    totalAfter += after.size
    
    const reduction = ((1 - after.size / before.size) * 100).toFixed(1)
    console.log(`✅ ${imgPath} → ${reduction}% de réduction`)
    converted++
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`⏭️  ${imgPath} → Fichier introuvable`)
    } else {
      console.error(`❌ ${imgPath}:`, error.message)
      errors++
    }
  }
}

async function main() {
  console.log('🚀 Conversion en WebP...\n')
  
  for (const img of images) {
    await convert(img)
  }
  
  console.log('\n📊 Résultats:')
  console.log(`✅ Converties: ${converted}`)
  console.log(`❌ Erreurs: ${errors}`)
  if (totalBefore > 0) {
    const reduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
    console.log(`💾 Réduction: ${reduction}%`)
  }
  console.log('\n✅ Terminé!')
}

main()
