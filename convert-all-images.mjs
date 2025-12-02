import sharp from 'sharp';
import { existsSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(import.meta.url).replace(/\\[^\\]+$/, '').replace(/\/[^\/]+$/, '');
const root = __dirname;

const images = [
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

const results = [];
let converted = 0;
let skipped = 0;
let errors = 0;

async function convert() {
  results.push('═══════════════════════════════════════════════════════════');
  results.push('     CONVERSION DE TOUTES LES IMAGES EN WEBP');
  results.push('═══════════════════════════════════════════════════════════\n');

  for (const imagePath of images) {
    const inputPath = join(root, imagePath);
    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const fileName = imagePath.split('/').pop();

    if (!existsSync(inputPath)) {
      results.push(`⚠  Fichier non trouvé: ${imagePath}`);
      continue;
    }

    if (existsSync(outputPath)) {
      results.push(`⏭  Déjà existant: ${fileName.replace(/\.(png|jpg|jpeg)$/i, '.webp')}`);
      skipped++;
      continue;
    }

    try {
      results.push(`🔄 Conversion: ${fileName}...`);
      
      await sharp(inputPath)
        .webp({ quality: 90, effort: 6, lossless: false })
        .toFile(outputPath);

      const inputSize = statSync(inputPath).size;
      const outputSize = statSync(outputPath).size;
      const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

      results.push(`✓ Créé: ${fileName.replace(/\.(png|jpg|jpeg)$/i, '.webp')} (${(outputSize / 1024).toFixed(2)} KB, -${reduction}%)`);
      converted++;
    } catch (error) {
      results.push(`✗ Erreur pour ${fileName}: ${error.message}`);
      errors++;
    }
  }

  results.push('\n═══════════════════════════════════════════════════════════');
  results.push('                    RÉSUMÉ');
  results.push('═══════════════════════════════════════════════════════════');
  results.push(`✓ Converties: ${converted}`);
  results.push(`⏭  Ignorées: ${skipped}`);
  results.push(`✗ Erreurs: ${errors}`);
  results.push('═══════════════════════════════════════════════════════════');

  const output = results.join('\n');
  console.log(output);
  writeFileSync(join(root, 'conversion-results.txt'), output, 'utf-8');
}

convert().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
