/**
 * Script de conversion de toutes les images du projet en WebP
 * Version avec logging dans fichier
 */

import sharp from 'sharp';
import { readdirSync, statSync, existsSync, writeFileSync } from 'fs';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');
const logFile = join(projectRoot, 'conversion-all-images-log.txt');

const imageExtensions = ['.png', '.jpg', '.jpeg'];
const excludeDirs = ['logos'];

const stats = {
  converted: 0,
  skipped: 0,
  errors: 0,
  total: 0
};

const logMessages = [];

function log(message) {
  const msg = `${new Date().toISOString()} - ${message}`;
  console.log(message);
  logMessages.push(msg);
}

function getAllImageFiles(dir, fileList = []) {
  try {
    const files = readdirSync(dir);
    files.forEach(file => {
      if (file.startsWith('.') || file === 'node_modules') return;
      const filePath = join(dir, file);
      try {
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
          const dirName = basename(filePath);
          if (!excludeDirs.includes(dirName)) {
            getAllImageFiles(filePath, fileList);
          }
        } else {
          const ext = extname(file).toLowerCase();
          if (imageExtensions.includes(ext)) {
            fileList.push(filePath);
          }
        }
      } catch (err) {
        log(`⚠  Erreur d'accès: ${filePath}`);
      }
    });
  } catch (err) {
    log(`❌ Erreur scan ${dir}: ${err.message}`);
  }
  return fileList;
}

async function convertToWebp(inputPath) {
  const ext = extname(inputPath);
  const baseName = basename(inputPath, ext);
  const dir = dirname(inputPath);
  const outputPath = join(dir, `${baseName}.webp`);

  if (existsSync(outputPath)) {
    log(`⏭  Déjà existant: ${basename(outputPath)}`);
    stats.skipped++;
    return { success: true, skipped: true };
  }

  try {
    log(`🔄 Conversion: ${basename(inputPath)} → ${basename(outputPath)}`);
    
    await sharp(inputPath)
      .webp({ quality: 90, effort: 6, lossless: false })
      .toFile(outputPath);

    const inputStats = statSync(inputPath);
    const outputStats = statSync(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    log(`✓ Créé: ${basename(outputPath)} (${(outputStats.size / 1024).toFixed(2)} KB, -${reduction}%)`);
    stats.converted++;
    return { success: true, skipped: false, reduction };
  } catch (error) {
    log(`✗ Erreur pour ${basename(inputPath)}: ${error.message}`);
    stats.errors++;
    return { success: false, error: error.message };
  }
}

async function convertAllImages() {
  log('═══════════════════════════════════════════════════════════');
  log('     CONVERSION DE TOUTES LES IMAGES EN WEBP');
  log('═══════════════════════════════════════════════════════════\n');

  if (!existsSync(publicDir)) {
    log(`❌ Le dossier public n'existe pas: ${publicDir}`);
    process.exit(1);
  }

  log(`📁 Scan du dossier: ${publicDir}\n`);
  const imageFiles = getAllImageFiles(publicDir);
  stats.total = imageFiles.length;

  if (imageFiles.length === 0) {
    log('ℹ  Aucune image trouvée à convertir.');
    return;
  }

  log(`📊 ${imageFiles.length} image(s) trouvée(s):\n`);
  imageFiles.forEach((file, index) => {
    const relPath = file.replace(projectRoot + '\\', '').replace(projectRoot + '/', '');
    log(`   ${index + 1}. ${relPath}`);
  });
  log('');

  for (const imagePath of imageFiles) {
    const relativePath = imagePath.replace(projectRoot + '\\', '').replace(projectRoot + '/', '');
    log(`\n📄 ${relativePath}`);
    await convertToWebp(imagePath);
  }

  log('\n═══════════════════════════════════════════════════════════');
  log('                    RÉSUMÉ');
  log('═══════════════════════════════════════════════════════════');
  log(`📊 Total: ${stats.total}`);
  log(`✓ Converties: ${stats.converted}`);
  log(`⏭  Ignorées: ${stats.skipped}`);
  log(`✗ Erreurs: ${stats.errors}`);
  log('═══════════════════════════════════════════════════════════\n');

  // Écrire le log dans un fichier
  writeFileSync(logFile, logMessages.join('\n'), 'utf-8');
  log(`📝 Log sauvegardé dans: ${logFile}`);
}

convertAllImages().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}`);
  writeFileSync(logFile, logMessages.join('\n'), 'utf-8');
  process.exit(1);
});
