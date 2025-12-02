// Script pour mettre à jour le mot de passe via l'API
const email = 'dereckdanel@odillon.fr'
const password = 'Reviti2025@'
const apiUrl = 'http://localhost:3000/api/admin/update-password'

async function updatePassword() {
  console.log('🔐 Mise à jour du mot de passe via API...\n')
  console.log(`📧 Email: ${email}`)
  console.log(`🔑 Nouveau mot de passe: ${password}\n`)

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Erreur:', data.error)
      process.exit(1)
    }

    console.log('✅ Mot de passe mis à jour avec succès!')
    console.log(`📧 Email: ${data.user.email}`)
    console.log(`🆔 User ID: ${data.user.id}`)
    console.log('\n🎉 Vous pouvez maintenant vous connecter avec ce mot de passe à : http://localhost:3000/admin/login')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.error('\n💡 Assurez-vous que le serveur de développement est démarré (npm run dev)')
    process.exit(1)
  }
}

updatePassword()
