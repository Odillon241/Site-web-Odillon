import sharp from 'sharp';
import { existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFile = join(__dirname, '..', 'public', 'favicon-odillon.png');

console.log('Test de conversion Sharp...\n');
console.log('Fichier test:', testFile);
console.log('Existe:', existsSync(testFile));

if (existsSync(testFile)) {
  const outputFile = testFile.replace('.png', '.webp');
  console.log('Fichier de sortie:', outputFile);
  
  try {
    console.log('\nConversion en cours...');
    await sharp(testFile)
      .webp({ quality: 90, effort: 6 })
      .toFile(outputFile);
    
    const inputSize = statSync(testFile).size;
    const outputSize = statSync(outputFile).size;
    const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);
    
    console.log('✓ Conversion réussie!');
    console.log(`  Taille originale: ${(inputSize / 1024).toFixed(2)} KB`);
    console.log(`  Taille WebP: ${(outputSize / 1024).toFixed(2)} KB`);
    console.log(`  Réduction: ${reduction}%`);
  } catch (error) {
    console.error('✗ Erreur:', error.message);
  }
} else {
  console.log('Fichier de test non trouvé');
}
