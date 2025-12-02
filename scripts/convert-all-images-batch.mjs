/**
 * Script de conversion batch de toutes les images en WebP
 * Utilise Sharp avec gestion d'erreurs améliorée
 */

import sharp from 'sharp';
import { readdirSync, statSync, existsSync, writeFileSync } from 'fs';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

// Liste explicite de toutes les images à convertir
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

const stats = { converted: 0, skipped: 0, errors: 0 };
const log = [];

function addLog(msg) {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ${msg}`;
  console.log(msg);
  log.push(message);
}

async function convertImage(inputPath, outputPath, fileName) {
  if (!existsSync(inputPath)) {
    addLog(`⚠  ${fileName} - Fichier non trouvé`);
    return false;
  }

  if (existsSync(outputPath)) {
    addLog(`⏭  ${fileName.replace(/\.(png|jpg|jpeg)$/i, '.webp')} - Déjà existant`);
    stats.skipped++;
    return true;
  }

  try {
    addLog(`🔄 Conversion: ${fileName}...`);
    
    await sharp(inputPath)
      .webp({ quality: 90, effort: 6, lossless: false })
      .toFile(outputPath);

    if (existsSync(outputPath)) {
      const inputSize = statSync(inputPath).size;
      const outputSize = statSync(outputPath).size;
      const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);
      
      addLog(`✓ ${fileName.replace(/\.(png|jpg|jpeg)$/i, '.webp')} créé (${(outputSize / 1024).toFixed(2)} KB, -${reduction}%)`);
      stats.converted++;
      return true;
    } else {
      addLog(`✗ ${fileName} - Fichier non créé après conversion`);
      stats.errors++;
      return false;
    }
  } catch (error) {
    addLog(`✗ ${fileName} - Erreur: ${error.message}`);
    stats.errors++;
    return false;
  }
}

async function main() {
  addLog('═══════════════════════════════════════════════════════════');
  addLog('     CONVERSION DE TOUTES LES IMAGES EN WEBP');
  addLog('═══════════════════════════════════════════════════════════');
  addLog('');

  // Vérifier Sharp
  try {
    const testFile = join(root, 'public', 'favicon-odillon.png');
    if (existsSync(testFile)) {
      await sharp(testFile).metadata();
      addLog('✓ Sharp est correctement installé\n');
    }
  } catch (error) {
    addLog('❌ Erreur: Sharp n\'est pas correctement installé');
    addLog('   Installez avec: npm install sharp --save-dev');
    process.exit(1);
  }

  addLog(`📊 ${imagesToConvert.length} image(s) à convertir\n`);

  // Convertir toutes les images
  for (const imagePath of imagesToConvert) {
    const inputPath = join(root, imagePath);
    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const fileName = basename(imagePath);
    
    await convertImage(inputPath, outputPath, fileName);
  }

  // Résumé
  addLog('');
  addLog('═══════════════════════════════════════════════════════════');
  addLog('                    RÉSUMÉ');
  addLog('═══════════════════════════════════════════════════════════');
  addLog(`📊 Total: ${imagesToConvert.length}`);
  addLog(`✓ Converties: ${stats.converted}`);
  addLog(`⏭  Ignorées: ${stats.skipped}`);
  addLog(`✗ Erreurs: ${stats.errors}`);
  addLog('═══════════════════════════════════════════════════════════');

  // Sauvegarder le log
  const logFile = join(root, 'conversion-all-images-log.txt');
  writeFileSync(logFile, log.join('\n'), 'utf-8');
  addLog(`\n📝 Log sauvegardé: ${logFile}`);
}

main().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
