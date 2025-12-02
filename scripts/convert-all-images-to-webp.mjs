/**
 * Script de conversion de toutes les images du projet en WebP
 * Utilise Sharp pour convertir PNG, JPG, JPEG en WebP
 * Exclut les logos déjà convertis
 */

import sharp from 'sharp';
import { readdirSync, statSync, existsSync } from 'fs';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');

// Extensions d'images à convertir
const imageExtensions = ['.png', '.jpg', '.jpeg'];
const excludeDirs = ['logos']; // Dossier logos déjà converti

// Statistiques
const stats = {
  converted: 0,
  skipped: 0,
  errors: 0,
  total: 0
};

/**
 * Récupère récursivement tous les fichiers images
 */
function getAllImageFiles(dir, fileList = [], depth = 0) {
  try {
    const files = readdirSync(dir);

    files.forEach(file => {
      // Ignorer les fichiers cachés et spéciaux
      if (file.startsWith('.') || file === 'node_modules') {
        return;
      }

      const filePath = join(dir, file);
      
      try {
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
          // Ignorer les dossiers exclus
          const dirName = basename(filePath);
          if (!excludeDirs.includes(dirName)) {
            getAllImageFiles(filePath, fileList, depth + 1);
          }
        } else {
          const ext = extname(file).toLowerCase();
          if (imageExtensions.includes(ext)) {
            fileList.push(filePath);
          }
        }
      } catch (err) {
        // Ignorer les erreurs de permissions
        console.warn(`⚠  Impossible d'accéder à ${filePath}: ${err.message}`);
      }
    });
  } catch (err) {
    console.error(`❌ Erreur lors du scan de ${dir}:`, err.message);
  }

  return fileList;
}

/**
 * Convertit une image en WebP
 */
async function convertToWebp(inputPath) {
  const ext = extname(inputPath);
  const baseName = basename(inputPath, ext);
  const dir = dirname(inputPath);
  const outputPath = join(dir, `${baseName}.webp`);

  // Vérifier si le fichier WebP existe déjà
  if (existsSync(outputPath)) {
    console.log(`⏭  Déjà existant: ${basename(outputPath)}`);
    stats.skipped++;
    return { success: true, skipped: true };
  }

  try {
    console.log(`🔄 Conversion: ${basename(inputPath)} → ${basename(outputPath)}`);
    
    await sharp(inputPath)
      .webp({ 
        quality: 90,
        effort: 6,
        lossless: false
      })
      .toFile(outputPath);

    // Vérifier la taille des fichiers
    const inputStats = statSync(inputPath);
    const outputStats = statSync(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✓ Créé: ${basename(outputPath)} (${(outputStats.size / 1024).toFixed(2)} KB, -${reduction}%)`);
    stats.converted++;
    return { success: true, skipped: false, reduction };
  } catch (error) {
    console.error(`✗ Erreur pour ${basename(inputPath)}:`, error.message);
    stats.errors++;
    return { success: false, error: error.message };
  }
}

/**
 * Fonction principale
 */
async function convertAllImages() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('     CONVERSION DE TOUTES LES IMAGES EN WEBP');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Vérifier que Sharp est disponible
  try {
    const testFile = join(publicDir, 'favicon-odillon.png');
    if (existsSync(testFile)) {
      await sharp(testFile).metadata();
      console.log('✓ Sharp est correctement installé\n');
    } else {
      console.log('ℹ  Fichier de test non trouvé, mais Sharp semble installé\n');
    }
  } catch (error) {
    console.error('❌ Erreur: Sharp n\'est pas correctement installé');
    console.error('   Installez Sharp avec: npm install sharp --save-dev');
    process.exit(1);
  }

  // Vérifier que le dossier public existe
  if (!existsSync(publicDir)) {
    console.error(`❌ Le dossier public n'existe pas: ${publicDir}`);
    process.exit(1);
  }

  // Récupérer tous les fichiers images
  console.log(`📁 Scan du dossier public: ${publicDir}\n`);
  const imageFiles = getAllImageFiles(publicDir);
  stats.total = imageFiles.length;

  if (imageFiles.length === 0) {
    console.log('ℹ  Aucune image trouvée à convertir.');
    console.log(`   Dossier scanné: ${publicDir}`);
    return;
  }

  console.log(`📊 ${imageFiles.length} image(s) trouvée(s):`);
  imageFiles.forEach((file, index) => {
    const relPath = file.replace(projectRoot + '\\', '').replace(projectRoot + '/', '');
    console.log(`   ${index + 1}. ${relPath}`);
  });
  console.log('');

  // Convertir toutes les images
  for (const imagePath of imageFiles) {
    const relativePath = imagePath.replace(projectRoot + '\\', '').replace(projectRoot + '/', '');
    console.log(`\n📄 ${relativePath}`);
    await convertToWebp(imagePath);
  }

  // Résumé
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    RÉSUMÉ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 Total d'images trouvées: ${stats.total}`);
  console.log(`✓ Images converties: ${stats.converted}`);
  console.log(`⏭  Images ignorées (déjà en WebP): ${stats.skipped}`);
  console.log(`✗ Erreurs: ${stats.errors}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (stats.converted > 0) {
    console.log('✅ Conversion terminée avec succès !');
    console.log('\n💡 Note: Les fichiers originaux sont conservés.');
    console.log('   Vous pouvez les supprimer manuellement si vous le souhaitez.');
  }
}

// Exécuter la conversion
convertAllImages().catch(error => {
  console.error('\n❌ Erreur fatale:', error);
  process.exit(1);
});
