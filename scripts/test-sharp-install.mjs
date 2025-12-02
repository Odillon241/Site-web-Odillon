// Test d'installation de sharp
try {
  const sharp = require('sharp')
  console.log('✅ Sharp est installé')
  console.log('Version:', sharp.versions)
  
  // Test de conversion simple
  const fs = require('fs')
  const path = require('path')
  
  const testImage = path.join(__dirname, '..', 'public', 'logo-odillon.png')
  const testOutput = path.join(__dirname, '..', 'public', 'logo-odillon-test.webp')
  
  if (fs.existsSync(testImage)) {
    console.log('\n🔄 Test de conversion...')
    sharp(testImage)
      .webp({ quality: 85 })
      .toFile(testOutput)
      .then(() => {
        console.log('✅ Conversion test réussie !')
        console.log('Fichier créé:', testOutput)
        // Supprimer le fichier de test
        fs.unlinkSync(testOutput)
        console.log('✅ Fichier de test supprimé')
      })
      .catch(err => {
        console.error('❌ Erreur de conversion:', err.message)
      })
  } else {
    console.log('⚠️  Fichier test introuvable:', testImage)
  }
} catch (error) {
  console.error('❌ Sharp n\'est pas installé:', error.message)
  console.error('\n💡 Exécutez: npm install sharp --save-dev')
}
