const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

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

function log(msg) {
  console.log(msg);
  results.push(msg);
}

async function convert() {
  log('═══════════════════════════════════════════════════════════');
  log('     CONVERSION DE TOUTES LES IMAGES EN WEBP');
  log('═══════════════════════════════════════════════════════════\n');

  log(`📁 Dossier racine: ${root}`);
  log(`📊 ${images.length} image(s) à convertir\n`);

  for (const imagePath of images) {
    const inputPath = path.join(root, imagePath);
    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const fileName = path.basename(imagePath);

    log(`\n📄 ${imagePath}`);
    log(`   Input: ${inputPath}`);
    log(`   Existe: ${fs.existsSync(inputPath)}`);
    log(`   Output: ${outputPath}`);

    if (!fs.existsSync(inputPath)) {
      log(`   ⚠  Fichier non trouvé`);
      continue;
    }

    if (fs.existsSync(outputPath)) {
      log(`   ⏭  Déjà existant`);
      skipped++;
      continue;
    }

    try {
      log(`   🔄 Conversion en cours...`);
      
      await sharp(inputPath)
        .webp({ quality: 90, effort: 6, lossless: false })
        .toFile(outputPath);

      if (fs.existsSync(outputPath)) {
        const inputSize = fs.statSync(inputPath).size;
        const outputSize = fs.statSync(outputPath).size;
        const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

        log(`   ✓ Créé: ${(outputSize / 1024).toFixed(2)} KB (réduction: ${reduction}%)`);
        converted++;
      } else {
        log(`   ✗ Fichier non créé`);
        errors++;
      }
    } catch (error) {
      log(`   ✗ Erreur: ${error.message}`);
      if (error.stack) {
        log(`   Stack: ${error.stack.split('\n')[0]}`);
      }
      errors++;
    }
  }

  log('\n═══════════════════════════════════════════════════════════');
  log('                    RÉSUMÉ');
  log('═══════════════════════════════════════════════════════════');
  log(`📊 Total: ${images.length}`);
  log(`✓ Converties: ${converted}`);
  log(`⏭  Ignorées: ${skipped}`);
  log(`✗ Erreurs: ${errors}`);
  log('═══════════════════════════════════════════════════════════');

  const outputText = results.join('\n');
  fs.writeFileSync(path.join(root, 'conversion-results.txt'), outputText, 'utf-8');
  log(`\n📝 Résultats sauvegardés dans conversion-results.txt`);
  
  // Afficher aussi dans la console
  console.log('\n' + outputText);
}

convert().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
