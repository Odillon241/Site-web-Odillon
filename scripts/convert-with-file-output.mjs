// Script qui écrit les résultats dans un fichier
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const stat = promisify(fs.stat)
const access = promisify(fs.access)

const root = path.join(__dirname, '..')
const logFile = path.join(root, 'webp-conversion-log.txt')

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

const log = []

function addLog(msg) {
  const timestamp = new Date().toLocaleTimeString('fr-FR')
  const logMsg = `[${timestamp}] ${msg}`
  console.log(msg)
  log.push(logMsg)
}

async function convertImage(img) {
  const input = path.join(root, img)
  const output = input.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  
  try {
    await access(input)
    
    try {
      await access(output)
      addLog(`⏭️  ${img} → WebP existe déjà`)
      return { skipped: true }
    } catch {}
    
    const before = await stat(input)
    addLog(`🔄 Conversion de ${img}...`)
    
    const imageBuffer = await readFile(input)
    const webpBuffer = await sharp(imageBuffer)
      .webp({ quality: 85 })
      .toBuffer()
    
    await writeFile(output, webpBuffer)
    
    const after = await stat(output)
    const reduction = ((1 - after.size / before.size) * 100).toFixed(1)
    
    addLog(`✅ ${img}`)
    addLog(`   ${(before.size / 1024).toFixed(2)} KB → ${(after.size / 1024).toFixed(2)} KB (${reduction}% réduction)`)
    
    return { converted: true, before: before.size, after: after.size }
  } catch (error) {
    if (error.code === 'ENOENT') {
      addLog(`⏭️  ${img} → Introuvable`)
      return { skipped: true }
    } else {
      addLog(`❌ ${img}: ${error.message}`)
      return { error: true }
    }
  }
}

async function main() {
  addLog('🚀 Début de la conversion en WebP')
  addLog('='.repeat(60))
  addLog('')
  
  let stats = { converted: 0, skipped: 0, errors: 0, totalBefore: 0, totalAfter: 0 }
  
  for (const img of images) {
    const result = await convertImage(img)
    if (result.converted) {
      stats.converted++
      stats.totalBefore += result.before
      stats.totalAfter += result.after
    } else if (result.skipped) {
      stats.skipped++
    } else if (result.error) {
      stats.errors++
    }
    addLog('')
  }
  
  addLog('='.repeat(60))
  addLog('📊 Statistiques Finales')
  addLog('='.repeat(60))
  addLog(`✅ Images converties: ${stats.converted}`)
  addLog(`⏭️  Images ignorées: ${stats.skipped}`)
  addLog(`❌ Erreurs: ${stats.errors}`)
  
  if (stats.totalBefore > 0) {
    const reduction = ((1 - stats.totalAfter / stats.totalBefore) * 100).toFixed(1)
    const saved = ((stats.totalBefore - stats.totalAfter) / 1024).toFixed(2)
    addLog(`💾 Réduction totale: ${reduction}% (${saved} KB économisés)`)
  }
  
  addLog('')
  addLog('✅ Conversion terminée !')
  
  await writeFile(logFile, log.join('\n'), 'utf-8')
  addLog(`📝 Log sauvegardé dans: webp-conversion-log.txt`)
}

main().catch(async (error) => {
  log.push(`❌ Erreur fatale: ${error.message}`)
  if (error.stack) log.push(`Stack: ${error.stack}`)
  await writeFile(logFile, log.join('\n'), 'utf-8').catch(() => {})
  console.error('❌ Erreur:', error)
  process.exit(1)
})
