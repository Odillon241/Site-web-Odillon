import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createApi } from 'unsplash-js'
import { z } from 'zod'

// Schema for the AI response
const ArticleSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    content: z.string(), // HTML content
    keywords: z.array(z.string()).max(3),
})

const ArticlesResponseSchema = z.object({
    articles: z.array(ArticleSchema),
})

export async function POST(req: Request) {
    try {
        const { text } = await req.json()

        if (!text) {
            return NextResponse.json({ error: "Text content is required" }, { status: 400 })
        }

        const anthropicKey = process.env.ANTHROPIC_API_KEY
        if (!anthropicKey) {
            return NextResponse.json({
                error: "Configuration manquante",
                details: "Clé API Anthropic non trouvée. Veuillez l'ajouter dans les paramètres (.env)."
            }, { status: 503 })
        }

        const anthropic = new Anthropic({ apiKey: anthropicKey })

        const systemPrompt = `
        Tu es un assistant éditorial expert. Ta tâche est d'analyser un texte brut (issu d'un document Word/PDF) et de le découper en articles distincts.
        
        Pour chaque article détecté, retourne un objet JSON avec cette structure précise :
        {
          "title": "Titre percutant",
          "subtitle": "Court extrait ou sous-titre",
          "content": "Contenu formaté en HTML propre (avec <h2>, <h3>, <p>, <ul> mais SANS <h1>, <html> ou <body>)",
          "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3"] (en anglais pour recherche image)
        }

        Le format de réponse DOIT être un JSON valide contenant une liste d'articles sous la clé "articles".
        Exemple de réponse attendue : { "articles": [...] }
        `

        // 1. Analyze text with Claude
        const message = await anthropic.messages.create({
            model: "claude-haiku-4-5",
            max_tokens: 8192,
            system: systemPrompt,
            messages: [
                { role: "user", content: text }
            ]
        })

        // Extract JSON content from Claude's response
        const rawContent = message.content[0].type === 'text' ? message.content[0].text : ''

        if (!rawContent) throw new Error("No content from Claude")

        // Find the JSON object in the response (Claude might add conversational text)
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
        const cleanedContent = jsonMatch ? jsonMatch[0] : rawContent

        // Clean up markdown code blocks if present
        const finalContent = cleanedContent.replace(/```json/g, '').replace(/```/g, '').trim()

        let parsedAI;
        try {
            parsedAI = JSON.parse(finalContent)
        } catch (e) {
            console.error("JSON Parse Error. Content end:", finalContent.slice(-500));
            throw e;
        }
        // Validate with Zod (loose validation)
        const articles = parsedAI.articles || [parsedAI]

        // 2. Fetch Images from Unsplash (if key exists)
        const unsplashKey = process.env.UNSPLASH_ACCESS_KEY
        let articlesWithImages = articles

        if (unsplashKey) {
            const unsplash = createApi({ accessKey: unsplashKey })

            articlesWithImages = await Promise.all(articles.map(async (article: any) => {
                try {
                    const query = article.keywords?.[0] || "business"
                    const result = await unsplash.search.getPhotos({
                        query: query,
                        page: 1,
                        perPage: 1,
                        orientation: 'landscape'
                    })

                    if (result.response?.results?.[0]) {
                        return {
                            ...article,
                            coverImage: result.response.results[0].urls.regular,
                            imageCredit: `Photo by ${result.response.results[0].user.name} on Unsplash`
                        }
                    }
                    return article
                } catch (err) {
                    console.error("Unsplash error for", article.title, err)
                    return article
                }
            }))
        }

        return NextResponse.json({ articles: articlesWithImages })

    } catch (error: any) {
        console.error("AI Parse Error:", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}
