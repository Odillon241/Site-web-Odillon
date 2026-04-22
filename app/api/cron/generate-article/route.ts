import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// We use service role key to bypass RLS for background cron jobs
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TOPICS = [
  // Gouvernance & Stratégie
  "Gouvernance d'entreprise : les défis de demain",
  "Management des risques en entreprise",
  "Stratégie d'entreprise : piloter le changement",
  "Transformation digitale des entreprises",
  "Conformité et Audit : les nouvelles normes",
  "RSE et impact environnemental en entreprise",
  "Optimisation de la performance opérationnelle",

  // Ressources Humaines & Management
  "Ressources Humaines : fidéliser les talents",
  "Recrutement : attirer les meilleurs profils sur un marché tendu",
  "Onboarding : réussir l'intégration des nouveaux collaborateurs",
  "Marque employeur : bâtir une image attractive",
  "Gestion des carrières et mobilité interne",
  "Formation professionnelle et développement des compétences",
  "GPEC : anticiper les besoins en compétences",
  "Évaluation de la performance et entretiens annuels",
  "Rémunération et politique salariale : équité et attractivité",
  "Bien-être au travail et qualité de vie professionnelle (QVT)",
  "Prévention des risques psychosociaux (RPS) et burn-out",
  "Diversité, équité et inclusion en entreprise",
  "Télétravail et hybridation : cadre juridique et bonnes pratiques",
  "Management intergénérationnel en entreprise",
  "Dialogue social et relations avec les représentants du personnel",

  // Droit du travail
  "Code du travail au Gabon : comprendre les fondamentaux",
  "Contrats de travail : CDI, CDD, stage — quelles différences ?",
  "Période d'essai : règles, durée et rupture",
  "Licenciement pour motif personnel : procédure et motifs légaux",
  "Licenciement économique : obligations de l'employeur",
  "Rupture conventionnelle : mode d'emploi",
  "Démission : droits et obligations du salarié",
  "Durée du travail et heures supplémentaires : ce que dit la loi",
  "Congés payés : calcul, prise et report",
  "Congé maternité, paternité et parental : droits des salariés",
  "Maladie et arrêts de travail : obligations employeur et salarié",
  "Règlement intérieur : obligations et contenu",
  "Sanctions disciplinaires : quelles procédures respecter ?",
  "Harcèlement au travail : prévention et obligations légales",
  "Santé et sécurité au travail : responsabilités de l'employeur",
  "Représentants du personnel : rôle et prérogatives",
  "Conventions collectives : comment les appliquer",
  "Inspection du travail : contrôles et sanctions",
  "Contentieux prud'homal : anticiper et gérer les litiges",
  "Protection des données personnelles des salariés (RGPD/CNDP)",
]

// Pool de photos de couverture Unsplash par catégorie
const COVER_IMAGES: Record<string, string[]> = {
  "Gouvernance": [
    "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1600&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80",
  ],
  "Management des risques": [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80",
  ],
  "Ressources Humaines": [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80",
  ],
  "Droit du travail": [
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80",
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1600&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80",
  ],
  "Stratégie": [
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80",
  ],
  "Actualités": [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1600&q=80",
    "https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=1600&q=80",
  ],
}

function pickCoverImage(category: string): string {
  const pool = COVER_IMAGES[category] ?? COVER_IMAGES["Actualités"]
  return pool[Math.floor(Math.random() * pool.length)]
}

function generateSlug(title: string, index = 0) {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + (Date.now() + index).toString().slice(-6)
}

const MODEL_FALLBACKS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"]

async function generateArticleForTopic(topic: string) {
  const prompt = `En tant qu'expert en stratégie d'entreprise pour la société Odillon, rédigez un article de blog professionnel sur le thème : "${topic}".
L'article doit être au format JSON strict avec les champs suivants :
- title : Un titre accrocheur (chaine de caractères)
- excerpt : Un résumé pertinent de 2 ou 3 phrases (chaine de caractères)
- content : Le contenu de l'article formaté en HTML (balises <h2>, <p>, <ul>, <li>, <strong>, etc.). Au moins 4 paragraphes riches et bien structurés. Pas de balises <h1>.
- category : Une catégorie parmi (Gouvernance, Management des risques, Ressources Humaines, Droit du travail, Stratégie, Actualités). Pour tout sujet relatif au Code du travail, contrats, licenciement, congés, durée du travail, sanctions disciplinaires, harcèlement, santé & sécurité, représentants du personnel, conventions collectives, prud'hommes, inspection du travail → utiliser "Droit du travail"
- read_time : Temps de lecture estimé sous forme de chaine (ex: "4 min")

Renvoie uniquement le JSON valide, sans aucun texte autour ni bloc de code markdown.`

  let responseText = ""
  let lastError: unknown = null

  for (const modelName of MODEL_FALLBACKS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      responseText = result.response.text().trim()
      break
    } catch (err: unknown) {
      lastError = err
      const status = (err as { status?: number })?.status
      if (status !== 503 && status !== 429) throw err
      console.warn(`Modèle ${modelName} indisponible (${status}), fallback...`)
    }
  }

  if (!responseText) throw lastError ?? new Error("Tous les modèles Gemini sont indisponibles")

  let jsonStr = responseText
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.replace(/^```json\n/, '').replace(/\n```$/, '')
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```.*\n/, '').replace(/\n```$/, '')
  }

  return JSON.parse(jsonStr) as {
    title: string
    excerpt: string
    content: string
    category: string
    read_time: string
  }
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export async function GET(request: Request) {
  try {
    // Vérification de la sécurité (Vercel Cron Secret)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Paramètre optionnel ?count=N pour générer plusieurs articles (1-8, défaut 3)
    const { searchParams } = new URL(request.url)
    const rawCount = parseInt(searchParams.get('count') ?? '3', 10)
    const count = Math.max(1, Math.min(isNaN(rawCount) ? 3 : rawCount, TOPICS.length))

    // Pick N sujets distincts pour couvrir différents secteurs
    const selectedTopics = shuffle(TOPICS).slice(0, count)

    // Génération en parallèle
    const results = await Promise.allSettled(
      selectedTopics.map((topic) => generateArticleForTopic(topic))
    )

    const rowsToInsert: Array<Record<string, unknown>> = []
    const failures: Array<{ topic: string; error: string }> = []

    results.forEach((res, i) => {
      const topic = selectedTopics[i]
      if (res.status === 'fulfilled') {
        const data = res.value
        rowsToInsert.push({
          title: data.title,
          slug: generateSlug(data.title, i),
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          read_time: data.read_time,
          cover_image: pickCoverImage(data.category),
          is_published: false,
          author: 'Agent IA Odillon'
        })
      } else {
        failures.push({ topic, error: String(res.reason?.message ?? res.reason) })
      }
    })

    if (rowsToInsert.length === 0) {
      return NextResponse.json(
        { error: 'Aucun article n\'a pu être généré', failures },
        { status: 500 }
      )
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('articles')
      .insert(rowsToInsert)
      .select('id, title, category')

    if (error) {
      console.error('Erreur Supabase lors de l\'insertion:', error)
      return NextResponse.json({ error: 'Échec de l\'insertion en base de données' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `${inserted?.length ?? 0} article(s) généré(s) et enregistré(s) en brouillon`,
      generated: inserted,
      failures: failures.length ? failures : undefined
    })
  } catch (error) {
    console.error('Erreur lors de la génération de l\'article (Cron):', error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}
