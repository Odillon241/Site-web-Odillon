const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const testFile = path.join(__dirname, 'public', 'favicon-odillon.png');
const outputFile = path.join(__dirname, 'public', 'favicon-odillon.webp');

console.log('Test de conversion Sharp');
console.log('Fichier input:', testFile);
console.log('Existe:', fs.existsSync(testFile));
console.log('Fichier output:', outputFile);

if (fs.existsSync(testFile)) {
  console.log('\nDébut de la conversion...');
  sharp(testFile)
    .webp({ quality: 90 })
    .toFile(outputFile)
    .then(() => {
      console.log('✓ Conversion réussie!');
      if (fs.existsSync(outputFile)) {
        const size = fs.statSync(outputFile).size;
        console.log('Taille du fichier WebP:', size, 'bytes');
      }
    })
    .catch(err => {
      console.error('✗ Erreur:', err.message);
      console.error(err.stack);
    });
} else {
  console.log('Fichier input non trouvé');
}
