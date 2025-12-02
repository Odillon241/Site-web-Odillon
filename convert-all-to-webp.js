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

let converted = 0;
let skipped = 0;
let errors = 0;

async function convertAll() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('     CONVERSION DE TOUTES LES IMAGES EN WEBP');
  console.log('═══════════════════════════════════════════════════════════\n');

  for (let i = 0; i < images.length; i++) {
    const imagePath = images[i];
    const inputPath = path.join(root, imagePath);
    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const fileName = path.basename(imagePath);

    console.log(`[${i + 1}/${images.length}] ${fileName}`);

    if (!fs.existsSync(inputPath)) {
      console.log('  ⚠  Fichier non trouvé\n');
      continue;
    }

    if (fs.existsSync(outputPath)) {
      console.log('  ⏭  Déjà existant\n');
      skipped++;
      continue;
    }

    try {
      await sharp(inputPath)
        .webp({ quality: 90, effort: 6, lossless: false })
        .toFile(outputPath);

      if (fs.existsSync(outputPath)) {
        const inputSize = fs.statSync(inputPath).size;
        const outputSize = fs.statSync(outputPath).size;
        const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);
        console.log(`  ✓ Créé: ${(outputSize / 1024).toFixed(2)} KB (-${reduction}%)\n`);
        converted++;
      } else {
        console.log('  ✗ Fichier non créé\n');
        errors++;
      }
    } catch (error) {
      console.log(`  ✗ Erreur: ${error.message}\n`);
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
}

convertAll().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
