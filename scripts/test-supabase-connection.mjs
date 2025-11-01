import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Charger les variables d'environnement
const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = {}

envContent.split('\n').forEach(line => {
  line = line.trim()
  if (!line || line.startsWith('#')) return
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

console.log('🧪 Tests de connexion Supabase\n')
console.log('━'.repeat(60))

// Créer les clients
const anonClient = createClient(supabaseUrl, supabaseAnonKey)
const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

let allTestsPassed = true

// Test 1: Connexion de base
console.log('\n📡 Test 1: Connexion de base à Supabase')
try {
  console.log('   URL:', supabaseUrl)
  console.log('   ✅ Clients créés avec succès')
} catch (error) {
  console.log('   ❌ Erreur:', error.message)
  allTestsPassed = false
}

// Test 2: Authentification admin
console.log('\n🔐 Test 2: Authentification admin')
try {
  const { data, error } = await anonClient.auth.signInWithPassword({
    email: 'dereckdanel@odillon.fr',
    password: 'Reviti2025@'
  })

  if (error) {
    console.log('   ❌ Échec:', error.message)
    allTestsPassed = false
  } else {
    console.log('   ✅ Connexion réussie!')
    console.log('   - User ID:', data.user.id)
    console.log('   - Email:', data.user.email)
    console.log('   - Session:', data.session ? 'Créée' : 'Non créée')
    
    // Déconnexion
    await anonClient.auth.signOut()
    console.log('   ✅ Déconnexion réussie')
  }
} catch (error) {
  console.log('   ❌ Erreur:', error.message)
  allTestsPassed = false
}

// Test 3: Accès à la table photos
console.log('\n📊 Test 3: Accès à la table photos')
try {
  const { data, error, count } = await adminClient
    .from('photos')
    .select('*', { count: 'exact', head: false })

  if (error) {
    console.log('   ❌ Erreur:', error.message)
    allTestsPassed = false
  } else {
    console.log('   ✅ Accès réussi!')
    console.log('   - Nombre de photos:', count || 0)
    if (data && data.length > 0) {
      console.log('   - Première photo:', data[0].description)
    }
  }
} catch (error) {
  console.log('   ❌ Erreur:', error.message)
  allTestsPassed = false
}

// Test 4: Accès à la table photo_themes
console.log('\n🎨 Test 4: Accès à la table photo_themes')
try {
  const { data, error, count } = await adminClient
    .from('photo_themes')
    .select('*', { count: 'exact' })

  if (error) {
    console.log('   ❌ Erreur:', error.message)
    allTestsPassed = false
  } else {
    console.log('   ✅ Accès réussi!')
    console.log('   - Nombre de thématiques:', count || 0)
    if (data && data.length > 0) {
      console.log('   - Thématiques:', data.map(t => t.name).join(', '))
    }
  }
} catch (error) {
  console.log('   ❌ Erreur:', error.message)
  allTestsPassed = false
}

// Test 5: Accès au Storage
console.log('\n📦 Test 5: Accès au Storage bucket')
try {
  const { data, error } = await adminClient.storage.listBuckets()

  if (error) {
    console.log('   ❌ Erreur:', error.message)
    allTestsPassed = false
  } else {
    const heroPhotos = data.find(b => b.name === 'hero-photos')
    if (heroPhotos) {
      console.log('   ✅ Bucket hero-photos trouvé!')
      console.log('   - Public:', heroPhotos.public)
      console.log('   - Créé le:', new Date(heroPhotos.created_at).toLocaleDateString())
    } else {
      console.log('   ❌ Bucket hero-photos non trouvé')
      allTestsPassed = false
    }
  }
} catch (error) {
  console.log('   ❌ Erreur:', error.message)
  allTestsPassed = false
}

// Test 6: Liste des fichiers dans le bucket
console.log('\n📂 Test 6: Liste des fichiers dans hero-photos')
try {
  const { data, error } = await adminClient.storage
    .from('hero-photos')
    .list()

  if (error) {
    console.log('   ❌ Erreur:', error.message)
    allTestsPassed = false
  } else {
    console.log('   ✅ Accès réussi!')
    console.log('   - Nombre de fichiers:', data.length)
    if (data.length > 0) {
      console.log('   - Fichiers:')
      data.slice(0, 5).forEach(file => {
        console.log(`     • ${file.name} (${(file.metadata.size / 1024).toFixed(2)} KB)`)
      })
      if (data.length > 5) {
        console.log(`     ... et ${data.length - 5} autres`)
      }
    }
  }
} catch (error) {
  console.log('   ❌ Erreur:', error.message)
  allTestsPassed = false
}

// Test 7: Création d'une photo de test
console.log('\n✏️  Test 7: Création d\'une entrée de test')
try {
  const testPhoto = {
    url: 'https://example.com/test.jpg',
    description: 'Photo de test - À supprimer',
    month: new Date().getMonth() + 1,
    theme_id: null,
    is_active: false,
    display_order: 9999
  }

  const { data: insertData, error: insertError } = await adminClient
    .from('photos')
    .insert([testPhoto])
    .select()
    .single()

  if (insertError) {
    console.log('   ❌ Échec de création:', insertError.message)
    allTestsPassed = false
  } else {
    console.log('   ✅ Photo de test créée!')
    console.log('   - ID:', insertData.id)

    // Suppression immédiate
    const { error: deleteError } = await adminClient
      .from('photos')
      .delete()
      .eq('id', insertData.id)

    if (deleteError) {
      console.log('   ⚠️  Avertissement: Impossible de supprimer la photo de test')
    } else {
      console.log('   ✅ Photo de test supprimée')
    }
  }
} catch (error) {
  console.log('   ❌ Erreur:', error.message)
  allTestsPassed = false
}

// Test 8: RLS (Row Level Security)
console.log('\n🔒 Test 8: Vérification RLS')
try {
  // Test avec client anonyme
  const { data: anonData, error: anonError } = await anonClient
    .from('photos')
    .select('*')

  if (anonError) {
    console.log('   ❌ Erreur client anonyme:', anonError.message)
    allTestsPassed = false
  } else {
    console.log('   ✅ Client anonyme peut lire les photos')
    console.log('   - Photos visibles (anonyme):', anonData.length)
  }

  // Test insertion anonyme (devrait échouer)
  const { error: anonInsertError } = await anonClient
    .from('photos')
    .insert([{
      url: 'test',
      description: 'test',
      is_active: false,
      display_order: 1
    }])

  if (anonInsertError) {
    console.log('   ✅ RLS fonctionne: client anonyme ne peut pas insérer')
  } else {
    console.log('   ⚠️  Avertissement: RLS permet insertion anonyme')
  }
} catch (error) {
  console.log('   ❌ Erreur:', error.message)
  allTestsPassed = false
}

// Résultat final
console.log('\n' + '━'.repeat(60))
if (allTestsPassed) {
  console.log('\n✅ TOUS LES TESTS SONT PASSÉS!')
  console.log('\n🎉 Votre configuration Supabase est parfaite!')
  console.log('\nVous pouvez maintenant:')
  console.log('1. Vous connecter: http://localhost:3000/admin/login')
  console.log('2. Email: dereckdanel@odillon.fr')
  console.log('3. Mot de passe: Reviti2025@')
} else {
  console.log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ')
  console.log('\nVérifiez:')
  console.log('1. Que le schéma SQL est bien déployé')
  console.log('2. Que les variables .env.local sont correctes')
  console.log('3. Que les politiques RLS sont en place')
}
console.log('\n' + '━'.repeat(60) + '\n')

