const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, '..', 'public', 'images', 'logos');
const files = fs.readdirSync(logosDir);

const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
const filesToConvert = files.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return imageExtensions.includes(ext) && !file.endsWith('.webp');
});

async function convertToWebp() {
  console.log(`Dossier logos: ${logosDir}`);
  console.log(`Fichiers à convertir: ${filesToConvert.length}`);
  console.log(`Liste: ${filesToConvert.join(', ')}\n`);
  
  if (filesToConvert.length === 0) {
    console.log('Aucun fichier à convertir.');
    return;
  }
  
  for (const file of filesToConvert) {
    const inputPath = path.join(logosDir, file);
    const baseName = path.basename(file, path.extname(file));
    // Nettoyer le nom de fichier (enlever les espaces, caractères spéciaux)
    const cleanName = baseName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    const outputPath = path.join(logosDir, `${cleanName}.webp`);

    try {
      console.log(`Conversion de ${file} vers ${cleanName}.webp...`);
      
      if (file.toLowerCase().endsWith('.svg')) {
        // Pour SVG, on doit d'abord le convertir en PNG puis en WebP
        const pngBuffer = await sharp(inputPath)
          .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
          .png()
          .toBuffer();
        await sharp(pngBuffer)
          .webp({ quality: 90 })
          .toFile(outputPath);
      } else {
        await sharp(inputPath)
          .webp({ quality: 90 })
          .toFile(outputPath);
      }
      
      console.log(`✓ ${cleanName}.webp créé`);
    } catch (error) {
      console.error(`✗ Erreur lors de la conversion de ${file}:`, error.message);
      console.error(error.stack);
    }
  }
  
  console.log('\nConversion terminée!');
}

convertToWebp().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
