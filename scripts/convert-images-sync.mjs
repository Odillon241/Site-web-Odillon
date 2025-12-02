// Script de conversion synchrone
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const stat = promisify(fs.stat)
const access = promisify(fs.access)

const root = path.join(__dirname, '..')

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

async function convertImage(img) {
  const input = path.join(root, img)
  const output = input.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  
  try {
    // Vérifier si le fichier source existe
    await access(input)
    
    // Vérifier si WebP existe déjà
    try {
      await access(output)
      return { status: 'skipped', reason: 'WebP existe déjà' }
    } catch {}
    
    // Lire les stats avant
    const before = await stat(input)
    const beforeSize = before.size
    
    // Lire l'image
    const imageBuffer = await readFile(input)
    
    // Convertir en WebP
    const webpBuffer = await sharp(imageBuffer)
      .webp({ quality: 85 })
      .toBuffer()
    
    // Écrire le fichier WebP
    await writeFile(output, webpBuffer)
    
    // Lire les stats après
    const after = await stat(output)
    const afterSize = after.size
    
    const reduction = ((1 - afterSize / beforeSize) * 100).toFixed(1)
    
    console.log(`✅ ${img}`)
    console.log(`   ${(beforeSize / 1024).toFixed(2)} KB → ${(afterSize / 1024).toFixed(2)} KB (${reduction}% réduction)`)
    
    return { 
      status: 'converted', 
      before: beforeSize, 
      after: afterSize,
      reduction: parseFloat(reduction)
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { status: 'skipped', reason: 'Fichier introuvable' }
    } else {
      console.error(`❌ ${img}:`, error.message)
      return { status: 'error', error: error.message }
    }
  }
}

async function main() {
  console.log('🚀 Conversion des images en WebP\n')
  console.log('='.repeat(60))
  console.log('')
  
  const results = {
    converted: 0,
    skipped: 0,
    errors: 0,
    totalBefore: 0,
    totalAfter: 0
  }
  
  for (const img of images) {
    const result = await convertImage(img)
    
    if (result.status === 'converted') {
      results.converted++
      results.totalBefore += result.before
      results.totalAfter += result.after
    } else if (result.status === 'skipped') {
      results.skipped++
      console.log(`⏭️  ${img} → ${result.reason}`)
    } else {
      results.errors++
    }
    console.log('')
  }
  
  console.log('='.repeat(60))
  console.log('📊 Statistiques Finales')
  console.log('='.repeat(60))
  console.log(`✅ Images converties: ${results.converted}`)
  console.log(`⏭️  Images ignorées: ${results.skipped}`)
  console.log(`❌ Erreurs: ${results.errors}`)
  
  if (results.totalBefore > 0) {
    const reduction = ((1 - results.totalAfter / results.totalBefore) * 100).toFixed(1)
    const saved = ((results.totalBefore - results.totalAfter) / 1024).toFixed(2)
    const totalBeforeKB = (results.totalBefore / 1024).toFixed(2)
    const totalAfterKB = (results.totalAfter / 1024).toFixed(2)
    
    console.log(`📦 Taille totale avant: ${totalBeforeKB} KB`)
    console.log(`📦 Taille totale après: ${totalAfterKB} KB`)
    console.log(`💾 Réduction totale: ${reduction}% (${saved} KB économisés)`)
  }
  
  console.log('\n✅ Conversion terminée !')
}

main().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
