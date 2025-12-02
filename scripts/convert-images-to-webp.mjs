import sharp from 'sharp'
import { readdir, stat, readFile, writeFile, unlink } from 'fs/promises'
import { join, dirname, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')
const publicDir = join(projectRoot, 'public')

// Formats d'image à convertir
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg']
const WEBP_QUALITY = 85 // Qualité WebP (0-100)

// Statistiques
let stats = {
  converted: 0,
  skipped: 0,
  errors: 0,
  totalSizeBefore: 0,
  totalSizeAfter: 0
}

/**
 * Convertit une image en WebP
 */
async function convertToWebP(inputPath, outputPath) {
  try {
    const inputStats = await stat(inputPath)
    stats.totalSizeBefore += inputStats.size

    await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath)

    const outputStats = await stat(outputPath)
    stats.totalSizeAfter += outputStats.size

    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1)
    console.log(`✅ ${basename(inputPath)} → ${basename(outputPath)} (${reduction}% de réduction)`)

    return true
  } catch (error) {
    console.error(`❌ Erreur lors de la conversion de ${inputPath}:`, error.message)
    stats.errors++
    return false
  }
}

/**
 * Parcourt récursivement un dossier et convertit les images
 */
async function processDirectory(dir, relativePath = '') {
  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      const relativeFilePath = join(relativePath, entry.name)

      if (entry.isDirectory()) {
        // Ignorer node_modules et autres dossiers système
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await processDirectory(fullPath, relativeFilePath)
        }
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase()
        
        if (IMAGE_EXTENSIONS.includes(ext)) {
          const nameWithoutExt = basename(entry.name, ext)
          const webpPath = join(dir, `${nameWithoutExt}.webp`)

          // Vérifier si le fichier WebP existe déjà
          try {
            await stat(webpPath)
            console.log(`⏭️  ${relativeFilePath} → WebP existe déjà, ignoré`)
            stats.skipped++
          } catch {
            // Le fichier WebP n'existe pas, on convertit
            const success = await convertToWebP(fullPath, webpPath)
            if (success) {
              stats.converted++
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement du dossier ${dir}:`, error.message)
  }
}

/**
 * Met à jour les références dans les fichiers de code
 */
async function updateReferences() {
  console.log('\n📝 Mise à jour des références dans le code...')
  
  const filesToUpdate = [
    'app/admin/login/page.tsx',
    'app/layout.tsx',
    'components/layout/footer.tsx',
    'components/layout/header-pro.tsx',
    'components/layout/header.tsx',
    'components/sections/contact.tsx',
    'components/sections/trusted-by-home.tsx'
  ]

  for (const file of filesToUpdate) {
    try {
      const filePath = join(projectRoot, file)
      let content = await readFile(filePath, 'utf-8')
      let modified = false

      // Remplacer les extensions d'image par .webp
      const patterns = [
        { from: /\.png/g, to: '.webp' },
        { from: /\.jpg/g, to: '.webp' },
        { from: /\.jpeg/g, to: '.webp' }
      ]

      for (const pattern of patterns) {
        if (content.match(pattern.from)) {
          content = content.replace(pattern.from, pattern.to)
          modified = true
        }
      }

      if (modified) {
        await writeFile(filePath, content, 'utf-8')
        console.log(`✅ ${file} mis à jour`)
      }
    } catch (error) {
      console.error(`⚠️  Impossible de mettre à jour ${file}:`, error.message)
    }
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Conversion des images en WebP...\n')
  console.log(`📁 Dossier public: ${publicDir}\n`)

  // Convertir toutes les images dans le dossier public
  await processDirectory(publicDir)

  // Afficher les statistiques
  console.log('\n' + '='.repeat(60))
  console.log('📊 Statistiques de conversion')
  console.log('='.repeat(60))
  console.log(`✅ Images converties: ${stats.converted}`)
  console.log(`⏭️  Images ignorées (déjà en WebP): ${stats.skipped}`)
  console.log(`❌ Erreurs: ${stats.errors}`)
  console.log(`📦 Taille avant: ${(stats.totalSizeBefore / 1024).toFixed(2)} KB`)
  console.log(`📦 Taille après: ${(stats.totalSizeAfter / 1024).toFixed(2)} KB`)
  
  if (stats.totalSizeBefore > 0) {
    const reduction = ((1 - stats.totalSizeAfter / stats.totalSizeBefore) * 100).toFixed(1)
    console.log(`💾 Réduction totale: ${reduction}%`)
  }

  // Mettre à jour les références dans le code
  await updateReferences()

  console.log('\n✅ Conversion terminée !')
  console.log('\n💡 Note: Les images originales sont conservées.')
  console.log('   Vous pouvez les supprimer manuellement après vérification.')
}

main().catch(console.error)
