import sharp from 'sharp';
import { readdirSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logosDir = join(__dirname, '..', 'public', 'images', 'logos');
const files = readdirSync(logosDir);

// Mapping des noms de fichiers originaux vers les noms webp souhaités
const fileMapping = {
  'anac logo.jpeg': 'anac.webp',
  'caistab.png': 'caistab.webp',
  'cdc.png': 'cdc.webp',
  'edg.jpg': 'edg.webp',
  'Logo Gabon télécom.png': 'gabon-telecom.webp',
  'LOGO_HPG.ai-221-x-61-mm-1.svg': 'hpg.webp',
  'LOGO-TRÉSOR-PNG.webp': 'tresor.webp', // Déjà en webp, juste renommer
  'seeg.jpg': 'seeg.webp',
  'sem.png': 'sem.webp',
  'sgs-logo.png': 'sgs.webp',
  'uba.jpg': 'uba.webp'
};

const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];
const filesToConvert = files.filter(file => {
  const ext = extname(file).toLowerCase();
  return imageExtensions.includes(ext) && !file.includes('.aspx') && fileMapping[file];
});

console.log('=== Conversion des logos en WebP ===\n');
console.log(`Fichiers à convertir: ${filesToConvert.length}\n`);

async function convertToWebp() {
  let converted = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of filesToConvert) {
    const inputPath = join(logosDir, file);
    const outputPath = join(logosDir, fileMapping[file]);

    // Vérifier si le fichier de sortie existe déjà
    if (existsSync(outputPath) && file.toLowerCase().endsWith('.webp') && file !== fileMapping[file]) {
      console.log(`⏭  ${file} → ${fileMapping[file]} (déjà en webp, renommage nécessaire)`);
      skipped++;
      continue;
    }

    try {
      console.log(`🔄 Conversion: ${file} → ${fileMapping[file]}`);
      
      if (file.toLowerCase().endsWith('.webp')) {
        // Si c'est déjà un webp, on le copie juste avec le nouveau nom
        const { copyFileSync } = await import('fs');
        copyFileSync(inputPath, outputPath);
        console.log(`✓ Créé: ${fileMapping[file]}\n`);
      } else if (file.toLowerCase().endsWith('.svg')) {
        // Pour SVG, convertir en PNG puis en WebP
        const pngBuffer = await sharp(inputPath)
          .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
          .png()
          .toBuffer();
        await sharp(pngBuffer)
          .webp({ quality: 90 })
          .toFile(outputPath);
        console.log(`✓ Créé: ${fileMapping[file]}\n`);
      } else {
        // Pour JPG/PNG, convertir directement en WebP
        await sharp(inputPath)
          .webp({ quality: 90 })
          .toFile(outputPath);
        console.log(`✓ Créé: ${fileMapping[file]}\n`);
      }
      
      converted++;
    } catch (error) {
      console.error(`✗ Erreur pour ${file}:`, error.message, '\n');
      errors++;
    }
  }
  
  console.log('\n=== Résumé ===');
  console.log(`✓ Convertis: ${converted}`);
  console.log(`⏭  Ignorés: ${skipped}`);
  console.log(`✗ Erreurs: ${errors}`);
  console.log('\nConversion terminée!');
}

convertToWebp().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
