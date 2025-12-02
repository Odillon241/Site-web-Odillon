/**
 * Test simple de l'API des logos
 * Vérifie que les routes sont bien configurées
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('\n═══════════════════════════════════════════════════════════')
console.log('           VÉRIFICATION DE L\'API DES LOGOS')
console.log('═══════════════════════════════════════════════════════════\n')

// Vérifier que les fichiers API existent
const apiFiles = [
  'app/api/logos/route.ts',
  'app/api/logos/[id]/route.ts'
]

let allGood = true

apiFiles.forEach(file => {
  const fullPath = join(__dirname, '..', file)
  try {
    const content = readFileSync(fullPath, 'utf-8')
    
    // Vérifications basiques
    if (file.includes('route.ts') && file.includes('[id]')) {
      // Route dynamique [id]
      if (content.includes('PATCH') && content.includes('DELETE')) {
        console.log(`✓ ${file} - Routes PATCH et DELETE présentes`)
      } else {
        console.log(`✗ ${file} - Routes PATCH ou DELETE manquantes`)
        allGood = false
      }
      if (content.includes('createClient')) {
        console.log(`✓ ${file} - Client Supabase configuré`)
      } else {
        console.log(`✗ ${file} - Client Supabase manquant`)
        allGood = false
      }
    } else if (file.includes('route.ts')) {
      // Route principale
      if (content.includes('GET') && content.includes('POST')) {
        console.log(`✓ ${file} - Routes GET et POST présentes`)
      } else {
        console.log(`✗ ${file} - Routes GET ou POST manquantes`)
        allGood = false
      }
      if (content.includes('createClient')) {
        console.log(`✓ ${file} - Client Supabase configuré`)
      } else {
        console.log(`✗ ${file} - Client Supabase manquant`)
        allGood = false
      }
      if (content.includes('company_logos')) {
        console.log(`✓ ${file} - Table company_logos référencée`)
      } else {
        console.log(`✗ ${file} - Table company_logos non référencée`)
        allGood = false
      }
    }
  } catch (error) {
    console.log(`✗ ${file} - Fichier non trouvé: ${error.message}`)
    allGood = false
  }
})

// Vérifier la migration SQL
const migrationFile = join(__dirname, '..', 'supabase', 'migrations', '20241101000001_create_company_logos.sql')
try {
  const migration = readFileSync(migrationFile, 'utf-8')
  if (migration.includes('CREATE TABLE') && migration.includes('company_logos')) {
    console.log(`✓ Migration SQL présente et valide`)
  } else {
    console.log(`✗ Migration SQL invalide`)
    allGood = false
  }
} catch (error) {
  console.log(`✗ Migration SQL non trouvée: ${error.message}`)
  allGood = false
}

console.log('\n═══════════════════════════════════════════════════════════')
if (allGood) {
  console.log('✓ Tous les fichiers API sont correctement configurés')
  console.log('\nPour tester les routes API:')
  console.log('1. Démarrez le serveur: npm run dev')
  console.log('2. Testez GET: http://localhost:3000/api/logos')
  console.log('3. Testez GET actifs: http://localhost:3000/api/logos?active=true')
  console.log('4. Testez POST/PATCH/DELETE depuis l\'interface admin (nécessite auth)')
} else {
  console.log('✗ Certains fichiers ont des problèmes')
}
console.log('═══════════════════════════════════════════════════════════\n')

process.exit(allGood ? 0 : 1)
