import sharp from 'sharp';
import { existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

// Liste explicite des fichiers à convertir
const imagesToConvert = [
  'public/favicon-odillon.png',
  'public/logo-odillon.png',
  'public/icons/3d/calendar.png',
  'public/icons/3d/chat.png',
  'public/icons/3d/checkmark.png',
  'public/icons/3d/document.png',
  'public/icons/3d/folder.png',
  'public/icons/3d/mail.png',
  'public/icons/3d/shield.png',
  'public/icons/3d/users.png'
];

console.log('═══════════════════════════════════════════════════════════');
console.log('     CONVERSION DES IMAGES EN WEBP');
console.log('═══════════════════════════════════════════════════════════\n');

let converted = 0;
let skipped = 0;
let errors = 0;

for (const imagePath of imagesToConvert) {
  const fullPath = join(root, imagePath);
  
  if (!existsSync(fullPath)) {
    console.log(`⚠  Fichier non trouvé: ${imagePath}`);
    continue;
  }

  const outputPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const fileName = imagePath.split('/').pop();

  if (existsSync(outputPath)) {
    console.log(`⏭  Déjà existant: ${fileName.replace(/\.(png|jpg|jpeg)$/i, '.webp')}`);
    skipped++;
    continue;
  }

  try {
    console.log(`🔄 Conversion: ${fileName}...`);
    
    await sharp(fullPath)
      .webp({ quality: 90, effort: 6, lossless: false })
      .toFile(outputPath);

    const inputSize = statSync(fullPath).size;
    const outputSize = statSync(outputPath).size;
    const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(`✓ Créé: ${fileName.replace(/\.(png|jpg|jpeg)$/i, '.webp')} (${(outputSize / 1024).toFixed(2)} KB, -${reduction}%)\n`);
    converted++;
  } catch (error) {
    console.error(`✗ Erreur pour ${fileName}: ${error.message}\n`);
    errors++;
  }
}

console.log('═══════════════════════════════════════════════════════════');
console.log('                    RÉSUMÉ');
console.log('═══════════════════════════════════════════════════════════');
console.log(`✓ Converties: ${converted}`);
console.log(`⏭  Ignorées: ${skipped}`);
console.log(`✗ Erreurs: ${errors}`);
console.log('═══════════════════════════════════════════════════════════\n');
