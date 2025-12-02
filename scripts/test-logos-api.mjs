/**
 * Script de test pour l'API des logos
 * Teste toutes les routes CRUD
 */

const API_BASE = 'http://localhost:3000/api/logos'

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green')
}

function logError(message) {
  log(`✗ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan')
}

function logTest(message) {
  log(`\n🧪 ${message}`, 'blue')
}

// Test 1: GET /api/logos (tous les logos)
async function testGetAllLogos() {
  logTest('Test GET /api/logos (tous les logos)')
  try {
    const response = await fetch(API_BASE)
    const data = await response.json()
    
    if (response.ok && data.logos) {
      logSuccess(`Récupération réussie: ${data.logos.length} logos trouvés`)
      if (data.logos.length > 0) {
        logInfo(`Premier logo: ${data.logos[0].name} - ${data.logos[0].full_name}`)
      }
      return data.logos
    } else {
      logError(`Erreur: ${data.error || 'Réponse invalide'}`)
      return null
    }
  } catch (error) {
    logError(`Exception: ${error.message}`)
    return null
  }
}

// Test 2: GET /api/logos?active=true (logos actifs uniquement)
async function testGetActiveLogos() {
  logTest('Test GET /api/logos?active=true (logos actifs)')
  try {
    const response = await fetch(`${API_BASE}?active=true`)
    const data = await response.json()
    
    if (response.ok && data.logos) {
      const activeCount = data.logos.filter(l => l.is_active).length
      logSuccess(`Récupération réussie: ${activeCount} logos actifs sur ${data.logos.length} total`)
      return data.logos
    } else {
      logError(`Erreur: ${data.error || 'Réponse invalide'}`)
      return null
    }
  } catch (error) {
    logError(`Exception: ${error.message}`)
    return null
  }
}

// Test 3: POST /api/logos (création - nécessite auth)
async function testCreateLogo() {
  logTest('Test POST /api/logos (création - nécessite authentification)')
  try {
    const newLogo = {
      name: "TEST",
      full_name: "Entreprise de Test",
      logo_path: "/images/logos/test.webp",
      fallback: "TEST",
      color: "#FF0000"
    }

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLogo)
    })

    const data = await response.json()

    if (response.status === 401) {
      logInfo('Authentification requise (comportement attendu)')
      return null
    } else if (response.ok && data.logo) {
      logSuccess(`Logo créé avec succès: ${data.logo.name} (ID: ${data.logo.id})`)
      return data.logo
    } else {
      logError(`Erreur: ${data.error || 'Réponse invalide'}`)
      return null
    }
  } catch (error) {
    logError(`Exception: ${error.message}`)
    return null
  }
}

// Test 4: PATCH /api/logos/[id] (modification - nécessite auth)
async function testUpdateLogo(logoId) {
  if (!logoId) {
    logInfo('Test PATCH ignoré (pas de logo ID disponible)')
    return
  }

  logTest(`Test PATCH /api/logos/${logoId} (modification - nécessite authentification)`)
  try {
    const response = await fetch(`${API_BASE}/${logoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: false })
    })

    const data = await response.json()

    if (response.status === 401) {
      logInfo('Authentification requise (comportement attendu)')
    } else if (response.ok && data.logo) {
      logSuccess(`Logo modifié avec succès: ${data.logo.name} (is_active: ${data.logo.is_active})`)
      return data.logo
    } else {
      logError(`Erreur: ${data.error || 'Réponse invalide'}`)
    }
  } catch (error) {
    logError(`Exception: ${error.message}`)
  }
}

// Test 5: DELETE /api/logos/[id] (suppression - nécessite auth)
async function testDeleteLogo(logoId) {
  if (!logoId) {
    logInfo('Test DELETE ignoré (pas de logo ID disponible)')
    return
  }

  logTest(`Test DELETE /api/logos/${logoId} (suppression - nécessite authentification)`)
  try {
    const response = await fetch(`${API_BASE}/${logoId}`, {
      method: 'DELETE'
    })

    const data = await response.json()

    if (response.status === 401) {
      logInfo('Authentification requise (comportement attendu)')
    } else if (response.ok) {
      logSuccess(`Logo supprimé avec succès`)
    } else {
      logError(`Erreur: ${data.error || 'Réponse invalide'}`)
    }
  } catch (error) {
    logError(`Exception: ${error.message}`)
  }
}

// Test 6: Vérification de la structure des données
async function testDataStructure(logos) {
  logTest('Test de la structure des données')
  if (!logos || logos.length === 0) {
    logError('Aucun logo disponible pour tester la structure')
    return
  }

  const logo = logos[0]
  const requiredFields = ['id', 'name', 'full_name', 'logo_path', 'fallback', 'color', 'display_order', 'is_active']
  const missingFields = requiredFields.filter(field => !(field in logo))

  if (missingFields.length === 0) {
    logSuccess('Structure des données correcte')
    logInfo(`Champs présents: ${requiredFields.join(', ')}`)
  } else {
    logError(`Champs manquants: ${missingFields.join(', ')}`)
  }
}

// Fonction principale
async function runTests() {
  log('\n═══════════════════════════════════════════════════════════', 'cyan')
  log('           TEST DE L\'API DES LOGOS', 'cyan')
  log('═══════════════════════════════════════════════════════════\n', 'cyan')

  // Vérifier que le serveur est accessible
  try {
    const healthCheck = await fetch('http://localhost:3000')
    if (!healthCheck.ok && healthCheck.status !== 404) {
      logError('Le serveur Next.js ne semble pas être démarré sur http://localhost:3000')
      logInfo('Démarrez le serveur avec: npm run dev')
      process.exit(1)
    }
  } catch (error) {
    logError('Impossible de se connecter au serveur Next.js')
    logInfo('Assurez-vous que le serveur est démarré avec: npm run dev')
    process.exit(1)
  }

  // Tests
  const allLogos = await testGetAllLogos()
  await testGetActiveLogos()
  await testDataStructure(allLogos)
  
  // Tests nécessitant l'authentification (seront probablement en 401)
  const testLogo = await testCreateLogo()
  if (testLogo) {
    await testUpdateLogo(testLogo.id)
    await testDeleteLogo(testLogo.id)
  } else {
    // Utiliser un logo existant pour tester (sans le supprimer vraiment)
    if (allLogos && allLogos.length > 0) {
      await testUpdateLogo(allLogos[0].id)
      // Ne pas tester DELETE sur un vrai logo
    }
  }

  log('\n═══════════════════════════════════════════════════════════', 'cyan')
  log('           TESTS TERMINÉS', 'cyan')
  log('═══════════════════════════════════════════════════════════\n', 'cyan')
}

// Exécuter les tests
runTests().catch(error => {
  logError(`Erreur fatale: ${error.message}`)
  process.exit(1)
})
