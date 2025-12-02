import sharp from 'sharp'
import { readFile, writeFile, readdir } from 'fs/promises'
import { join, dirname, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')
const publicDir = join(projectRoot, 'public')

// Liste des images à convertir
const imagesToConvert = [
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
let totalSizeBefore = 0
let totalSizeAfter = 0

async function convertImage(imagePath) {
  try {
    const fullPath = join(projectRoot, imagePath)
    const ext = extname(imagePath)
    const nameWithoutExt = basename(imagePath, ext)
    const dir = dirname(fullPath)
    const webpPath = join(dir, `${nameWithoutExt}.webp`)

    // Lire les stats du fichier original
    const { stat } = await import('fs/promises')
    const stats = await stat(fullPath)
    totalSizeBefore += stats.size

    // Convertir en WebP
    await sharp(fullPath)
      .webp({ quality: 85 })
      .toFile(webpPath)

    // Lire les stats du fichier WebP
    const webpStats = await stat(webpPath)
    totalSizeAfter += webpStats.size

    const reduction = ((1 - webpStats.size / stats.size) * 100).toFixed(1)
    console.log(`✅ ${imagePath} → ${nameWithoutExt}.webp (${reduction}% de réduction)`)
    converted++
  } catch (error) {
    console.error(`❌ Erreur avec ${imagePath}:`, error.message)
    errors++
  }
}

async function main() {
  console.log('🚀 Conversion des images en WebP...\n')
  
  for (const image of imagesToConvert) {
    await convertImage(image)
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Résultats')
  console.log('='.repeat(60))
  console.log(`✅ Converties: ${converted}`)
  console.log(`❌ Erreurs: ${errors}`)
  console.log(`📦 Taille avant: ${(totalSizeBefore / 1024).toFixed(2)} KB`)
  console.log(`📦 Taille après: ${(totalSizeAfter / 1024).toFixed(2)} KB`)
  
  if (totalSizeBefore > 0) {
    const reduction = ((1 - totalSizeAfter / totalSizeBefore) * 100).toFixed(1)
    console.log(`💾 Réduction totale: ${reduction}%`)
  }
  
  console.log('\n✅ Conversion terminée !')
}

main().catch(console.error)
