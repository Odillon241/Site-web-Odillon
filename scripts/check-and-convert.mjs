// Script qui vérifie sharp et convertit
console.log('🔍 Vérification de Sharp...\n')

let sharp
try {
  sharp = require('sharp')
  console.log('✅ Sharp est installé')
  console.log('Version:', JSON.stringify(sharp.versions, null, 2))
} catch (error) {
  console.error('❌ Sharp n\'est pas installé ou ne fonctionne pas')
  console.error('Erreur:', error.message)
  console.error('\n💡 Solutions:')
  console.error('1. Exécutez: npm install sharp --save-dev')
  console.error('2. Ou utilisez un outil en ligne: https://squoosh.app/')
  process.exit(1)
}

const fs = require('fs').promises
const path = require('path')
const { fileURLToPath } = require('url')

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

async function convert(img) {
  const input = path.join(root, img)
  const output = input.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  
  try {
    await fs.access(input)
    
    try {
      await fs.access(output)
      console.log(`⏭️  ${img} → WebP existe déjà`)
      return { skipped: true }
    } catch {}
    
    const before = await fs.stat(input)
    
    console.log(`🔄 Conversion de ${img}...`)
    
    await sharp(input)
      .webp({ quality: 85 })
      .toFile(output)
    
    const after = await fs.stat(output)
    const reduction = ((1 - after.size / before.size) * 100).toFixed(1)
    
    console.log(`✅ ${img}`)
    console.log(`   ${(before.size / 1024).toFixed(2)} KB → ${(after.size / 1024).toFixed(2)} KB (${reduction}% réduction)`)
    
    return { converted: true, before: before.size, after: after.size }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`⏭️  ${img} → Introuvable`)
      return { skipped: true }
    } else {
      console.error(`❌ ${img}:`, error.message)
      return { error: true }
    }
  }
}

async function main() {
  console.log('\n🚀 Conversion des images en WebP\n')
  console.log('='.repeat(60))
  console.log('')
  
  let stats = { converted: 0, skipped: 0, errors: 0, totalBefore: 0, totalAfter: 0 }
  
  for (const img of images) {
    const result = await convert(img)
    if (result.converted) {
      stats.converted++
      stats.totalBefore += result.before
      stats.totalAfter += result.after
    } else if (result.skipped) {
      stats.skipped++
    } else if (result.error) {
      stats.errors++
    }
    console.log('')
  }
  
  console.log('='.repeat(60))
  console.log('📊 Résultats')
  console.log('='.repeat(60))
  console.log(`✅ Converties: ${stats.converted}`)
  console.log(`⏭️  Ignorées: ${stats.skipped}`)
  console.log(`❌ Erreurs: ${stats.errors}`)
  
  if (stats.totalBefore > 0) {
    const reduction = ((1 - stats.totalAfter / stats.totalBefore) * 100).toFixed(1)
    const saved = ((stats.totalBefore - stats.totalAfter) / 1024).toFixed(2)
    console.log(`💾 Réduction totale: ${reduction}% (${saved} KB économisés)`)
  }
  
  console.log('\n✅ Conversion terminée !')
}

main().catch(console.error)
