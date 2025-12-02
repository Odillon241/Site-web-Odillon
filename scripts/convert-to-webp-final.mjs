import sharp from 'sharp'
import { readFile, writeFile, stat } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = join(__dirname, '..')

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
let converted = 0
let errors = 0
let totalBefore = 0
let totalAfter = 0

function logMsg(msg) {
  console.log(msg)
  log.push(msg)
}

async function convert(img) {
  const input = join(root, img)
  const output = input.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  
  try {
    await stat(input)
    
    try {
      await stat(output)
      logMsg(`⏭️  ${img} → WebP existe déjà`)
      return
    } catch {}
    
    const before = await stat(input)
    totalBefore += before.size
    
    await sharp(input).webp({ quality: 85 }).toFile(output)
    
    const after = await stat(output)
    totalAfter += after.size
    
    const reduction = ((1 - after.size / before.size) * 100).toFixed(1)
    logMsg(`✅ ${img} → ${reduction}% de réduction`)
    converted++
  } catch (error) {
    if (error.code === 'ENOENT') {
      logMsg(`⏭️  ${img} → Introuvable`)
    } else {
      logMsg(`❌ ${img}: ${error.message}`)
      errors++
    }
  }
}

async function main() {
  logMsg('🚀 Conversion en WebP...\n')
  
  for (const img of images) {
    await convert(img)
  }
  
  logMsg('\n📊 Résultats:')
  logMsg(`✅ Converties: ${converted}`)
  logMsg(`❌ Erreurs: ${errors}`)
  if (totalBefore > 0) {
    const reduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
    logMsg(`💾 Réduction: ${reduction}%`)
  }
  logMsg('\n✅ Terminé!')
  
  await writeFile(join(root, 'conversion-log.txt'), log.join('\n'), 'utf-8')
  logMsg('\n📝 Log sauvegardé dans conversion-log.txt')
}

main().catch(console.error)
