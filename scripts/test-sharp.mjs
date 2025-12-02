import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')
const testImage = join(projectRoot, 'public', 'logo-odillon.png')

console.log('Test de sharp...')
console.log('Image test:', testImage)

try {
  const info = await sharp(testImage).metadata()
  console.log('✅ Sharp fonctionne !')
  console.log('Infos image:', info)
} catch (error) {
  console.error('❌ Erreur:', error.message)
}
