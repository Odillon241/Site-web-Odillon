import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logosDir = join(__dirname, '..', 'public', 'images', 'logos');
const files = readdirSync(logosDir);

const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
const filesToConvert = files.filter(file => {
  const ext = extname(file).toLowerCase();
  return imageExtensions.includes(ext) && !file.endsWith('.webp') && !file.includes('.aspx');
});

console.log(`Fichiers trouvés: ${filesToConvert.length}`);
console.log(`Liste: ${filesToConvert.join(', ')}\n`);

async function convertToWebp() {
  for (const file of filesToConvert) {
    const inputPath = join(logosDir, file);
    const baseName = basename(file, extname(file));
    // Nettoyer le nom de fichier
    const cleanName = baseName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/logo-/g, '')
      .replace(/^logo/g, '');
    const outputPath = join(logosDir, `${cleanName}.webp`);

    try {
      console.log(`Conversion: ${file} → ${cleanName}.webp`);
      
      if (file.toLowerCase().endsWith('.svg')) {
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
      
      console.log(`✓ Créé: ${cleanName}.webp\n`);
    } catch (error) {
      console.error(`✗ Erreur pour ${file}:`, error.message, '\n');
    }
  }
  
  console.log('Conversion terminée!');
}

convertToWebp().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
