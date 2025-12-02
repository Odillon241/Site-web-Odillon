import sharp from 'sharp'
import { promises as fs } from 'fs'
import { join, dirname, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Images à convertir avec leurs chemins
const images = [
  { path: 'public/logo-odillon.png', output: 'public/logo-odillon.webp' },
  { path: 'public/favicon-odillon.png', output: 'public/favicon-odillon.webp' },
  { path: 'public/icons/3d/calendar.png', output: 'public/icons/3d/calendar.webp' },
  { path: 'public/icons/3d/chat.png', output: 'public/icons/3d/chat.webp' },
  { path: 'public/icons/3d/checkmark.png', output: 'public/icons/3d/checkmark.webp' },
  { path: 'public/icons/3d/document.png', output: 'public/icons/3d/document.webp' },
  { path: 'public/icons/3d/folder.png', output: 'public/icons/3d/folder.webp' },
  { path: 'public/icons/3d/mail.png', output: 'public/icons/3d/mail.webp' },
  { path: 'public/icons/3d/shield.png', output: 'public/icons/3d/shield.webp' },
  { path: 'public/icons/3d/users.png', output: 'public/icons/3d/users.webp' },
  { path: 'public/images/logos/caistab.png', output: 'public/images/logos/caistab.webp' },
  { path: 'public/images/logos/cdc.png', output: 'public/images/logos/cdc.webp' },
  { path: 'public/images/logos/edg.jpg', output: 'public/images/logos/edg.webp' },
  { path: 'public/images/logos/seeg.jpg', output: 'public/images/logos/seeg.webp' },
  { path: 'public/images/logos/sem.png', output: 'public/images/logos/sem.webp' },
  { path: 'public/images/logos/uba.jpg', output: 'public/images/logos/uba.webp' }
]

let stats = {
  converted: 0,
  skipped: 0,
  errors: 0,
  totalSizeBefore: 0,
  totalSizeAfter: 0
}

async function convertImage(input, output) {
  const inputPath = join(projectRoot, input)
  const outputPath = join(projectRoot, output)

  try {
    // Vérifier si le fichier source existe
    try {
      await fs.access(inputPath)
    } catch {
      console.log(`⏭️  ${input} → Fichier introuvable, ignoré`)
      stats.skipped++
      return
    }

    // Vérifier si le WebP existe déjà
    try {
      await fs.access(outputPath)
      console.log(`⏭️  ${output} → Existe déjà, ignoré`)
      stats.skipped++
      return
    } catch {
      // Le fichier n'existe pas, on continue
    }

    // Lire les stats du fichier original
    const inputStats = await fs.stat(inputPath)
    stats.totalSizeBefore += inputStats.size

    // Convertir en WebP
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath)

    // Lire les stats du fichier WebP
    const outputStats = await fs.stat(outputPath)
    stats.totalSizeAfter += outputStats.size

    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1)
    const sizeBeforeKB = (inputStats.size / 1024).toFixed(2)
    const sizeAfterKB = (outputStats.size / 1024).toFixed(2)
    
    console.log(`✅ ${input}`)
    console.log(`   → ${output}`)
    console.log(`   ${sizeBeforeKB} KB → ${sizeAfterKB} KB (${reduction}% de réduction)`)
    console.log('')
    
    stats.converted++
  } catch (error) {
    console.error(`❌ Erreur avec ${input}:`, error.message)
    stats.errors++
  }
}

async function main() {
  console.log('🚀 Conversion de toutes les images en WebP\n')
  console.log('='.repeat(60))
  console.log('')

  for (const image of images) {
    await convertImage(image.path, image.output)
  }

  console.log('='.repeat(60))
  console.log('📊 Statistiques')
  console.log('='.repeat(60))
  console.log(`✅ Images converties: ${stats.converted}`)
  console.log(`⏭️  Images ignorées: ${stats.skipped}`)
  console.log(`❌ Erreurs: ${stats.errors}`)
  console.log(`📦 Taille totale avant: ${(stats.totalSizeBefore / 1024).toFixed(2)} KB`)
  console.log(`📦 Taille totale après: ${(stats.totalSizeAfter / 1024).toFixed(2)} KB`)
  
  if (stats.totalSizeBefore > 0) {
    const reduction = ((1 - stats.totalSizeAfter / stats.totalSizeBefore) * 100).toFixed(1)
    const saved = ((stats.totalSizeBefore - stats.totalSizeAfter) / 1024).toFixed(2)
    console.log(`💾 Réduction totale: ${reduction}% (${saved} KB économisés)`)
  }
  
  console.log('')
  console.log('✅ Conversion terminée !')
  console.log('')
  console.log('📝 Prochaine étape: Mise à jour des références dans le code...')
}

main().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
