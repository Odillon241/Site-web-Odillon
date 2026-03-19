import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import 'dotenv/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET = 'logos'
const LOGOS_DIR = resolve('public/images/logos')

// Mapping: logo name in DB -> local file to upload
const logoFiles = {
  'CDC': { file: 'cdc.webp', mime: 'image/webp' },
  'CAISTAB': { file: 'caistab.webp', mime: 'image/webp' },
  'UBA': { file: 'uba.webp', mime: 'image/webp' },
  'SEM': { file: 'sem.webp', mime: 'image/webp' },
  'EDG': { file: 'edg.webp', mime: 'image/webp' },
  'ANAC': { file: 'anac.webp', mime: 'image/webp' },
  'HPG': { file: 'hpg.webp', mime: 'image/webp' },
  'Trésor': { file: 'tresor.webp', mime: 'image/webp' },
  'SGS': { file: 'sgs.webp', mime: 'image/webp' },
  'SEEG': { file: 'seeg.webp', mime: 'image/webp' },
  'Pharmacie des Facultés': { file: 'logo_pharmacie_des_facultes.png', mime: 'image/png' },
}

async function migrate() {
  console.log('=== Migration des logos vers le bucket Supabase ===\n')

  // 1. Fetch all logos from DB
  const { data: logos, error: fetchError } = await supabase
    .from('company_logos')
    .select('*')
    .order('display_order')

  if (fetchError) {
    console.error('Erreur fetch logos:', fetchError)
    process.exit(1)
  }

  console.log(`${logos.length} logos trouvés en BDD\n`)

  for (const logo of logos) {
    const mapping = logoFiles[logo.name]

    if (!mapping) {
      console.log(`⏭️  ${logo.name} - pas de fichier local mappé, ignoré`)
      continue
    }

    // Check if already on Supabase
    if (logo.logo_path.includes('supabase.co')) {
      console.log(`✅ ${logo.name} - déjà sur Supabase, ignoré`)
      continue
    }

    const filePath = resolve(LOGOS_DIR, mapping.file)

    try {
      const fileBuffer = readFileSync(filePath)
      const storagePath = `${logo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${mapping.file.split('.').pop()}`

      console.log(`📤 ${logo.name} - upload de ${mapping.file}...`)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, fileBuffer, {
          contentType: mapping.mime,
          upsert: true
        })

      if (uploadError) {
        console.error(`   ❌ Erreur upload ${logo.name}:`, uploadError.message)
        continue
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(uploadData.path)

      // Update DB record
      const { error: updateError } = await supabase
        .from('company_logos')
        .update({ logo_path: publicUrl })
        .eq('id', logo.id)

      if (updateError) {
        console.error(`   ❌ Erreur update BDD ${logo.name}:`, updateError.message)
        continue
      }

      console.log(`   ✅ ${logo.name} -> ${publicUrl}`)
    } catch (err) {
      console.error(`   ❌ Erreur lecture fichier ${filePath}:`, err.message)
    }
  }

  // Handle GTV (base64 logo) - skip if no local file
  const gtvLogo = logos.find(l => l.name === 'GTV')
  if (gtvLogo && gtvLogo.logo_path.startsWith('data:')) {
    console.log(`\n📤 GTV - conversion base64 vers fichier...`)
    try {
      const base64Data = gtvLogo.logo_path.split(',')[1]
      const buffer = Buffer.from(base64Data, 'base64')

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload('gtv.jpg', buffer, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (uploadError) {
        console.error(`   ❌ Erreur upload GTV:`, uploadError.message)
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(uploadData.path)

        const { error: updateError } = await supabase
          .from('company_logos')
          .update({ logo_path: publicUrl })
          .eq('id', gtvLogo.id)

        if (updateError) {
          console.error(`   ❌ Erreur update BDD GTV:`, updateError.message)
        } else {
          console.log(`   ✅ GTV -> ${publicUrl}`)
        }
      }
    } catch (err) {
      console.error(`   ❌ Erreur GTV:`, err.message)
    }
  }

  // Handle FINAM GROUPE (external URL) - download and re-upload
  const finamLogo = logos.find(l => l.name === 'FINAM GROUPE')
  if (finamLogo && !finamLogo.logo_path.includes('supabase.co')) {
    console.log(`\n📤 FINAM GROUPE - téléchargement depuis URL externe...`)
    try {
      const response = await fetch(finamLogo.logo_path)
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload('finam-groupe.png', buffer, {
            contentType: 'image/png',
            upsert: true
          })

        if (uploadError) {
          console.error(`   ❌ Erreur upload FINAM:`, uploadError.message)
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(uploadData.path)

          await supabase
            .from('company_logos')
            .update({ logo_path: publicUrl })
            .eq('id', finamLogo.id)

          console.log(`   ✅ FINAM GROUPE -> ${publicUrl}`)
        }
      } else {
        console.error(`   ❌ Erreur téléchargement FINAM: HTTP ${response.status}`)
      }
    } catch (err) {
      console.error(`   ❌ Erreur FINAM:`, err.message)
    }
  }

  console.log('\n=== Migration terminée ===')
}

migrate().catch(console.error)
