const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  { input: 'public/favicon-odillon.png', output: 'public/favicon-odillon.webp' },
  { input: 'public/logo-odillon.png', output: 'public/logo-odillon.webp' },
  { input: 'public/icons/3d/calendar.png', output: 'public/icons/3d/calendar.webp' },
  { input: 'public/icons/3d/chat.png', output: 'public/icons/3d/chat.webp' },
  { input: 'public/icons/3d/checkmark.png', output: 'public/icons/3d/checkmark.webp' },
  { input: 'public/icons/3d/document.png', output: 'public/icons/3d/document.webp' },
  { input: 'public/icons/3d/folder.png', output: 'public/icons/3d/folder.webp' },
  { input: 'public/icons/3d/mail.png', output: 'public/icons/3d/mail.webp' },
  { input: 'public/icons/3d/shield.png', output: 'public/icons/3d/shield.webp' },
  { input: 'public/icons/3d/users.png', output: 'public/icons/3d/users.webp' }
];

async function convert() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('     CONVERSION DE TOUTES LES IMAGES EN WEBP');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  let converted = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const { input, output } of images) {
    const inputPath = path.join(__dirname, input);
    const outputPath = path.join(__dirname, output);
    const fileName = path.basename(input);
    
    process.stdout.write(`[${converted + skipped + errors + 1}/${images.length}] ${fileName}... `);
    
    if (!fs.existsSync(inputPath)) {
      console.log('⚠ Non trouvé');
      continue;
    }
    
    if (fs.existsSync(outputPath)) {
      console.log('⏭ Déjà existant');
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
        console.log(`✓ Créé (${(outputSize / 1024).toFixed(2)} KB, -${reduction}%)`);
        converted++;
      } else {
        console.log('✗ Échec');
        errors++;
      }
    } catch (error) {
      console.log(`✗ Erreur: ${error.message}`);
      errors++;
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    RÉSUMÉ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 Total: ${images.length}`);
  console.log(`✓ Converties: ${converted}`);
  console.log(`⏭  Ignorées: ${skipped}`);
  console.log(`✗ Erreurs: ${errors}`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

convert().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
