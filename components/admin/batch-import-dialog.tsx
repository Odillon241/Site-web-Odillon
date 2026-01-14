"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, FileType, Check, AlertTriangle, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { importDocument } from "@/lib/document-import"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ParsedArticle {
    title: string
    subtitle?: string
    content: string
    keywords: string[]
    coverImage?: string
    imageCredit?: string
}

interface BatchImportDialogProps {
    onArticlesCreated: () => void
}

export function BatchImportDialog({ onArticlesCreated }: BatchImportDialogProps) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState<"upload" | "processing" | "review">("upload")
    const [file, setFile] = useState<File | null>(null)
    const [parsedArticles, setParsedArticles] = useState<ParsedArticle[]>([])
    const [processingStatus, setProcessingStatus] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const processFile = async () => {
        if (!file) return

        try {
            setStep("processing")
            setProcessingStatus("Lecture du fichier...")

            // 1. Extract raw text/html
            const textContent = await importDocument(file)

            setProcessingStatus("Analyse IA en cours (Découpage & Images)...")

            // 2. Send to AI API
            const response = await fetch("/api/ai/parse-document", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textContent })
            })

            const data = await response.json()

            if (!response.ok) {
                // Check specifically for the missing key error (503)
                if (response.status === 503) {
                    toast.error("Configuration manquante", {
                        description: "Veuillez ajouter votre clé API Anthropic (Claude) dans les paramètres (.env)."
                    })
                    throw new Error(data.details || "Clé API manquante")
                }
                throw new Error(data.error || "Erreur d'analyse IA")
            }

            setParsedArticles(data.articles)
            setStep("review")

        } catch (error: any) {
            console.error(error)
            toast.error("Erreur", { description: error.message })
            setStep("upload")
        } finally {
            setProcessingStatus("")
        }
    }

    const handleCreateArticles = async () => {
        try {
            setProcessingStatus("Création des articles...")

            for (const article of parsedArticles) {
                const response = await fetch("/api/articles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: article.title,
                        excerpt: article.subtitle || "",
                        content: article.content, // HTML from AI
                        cover_image: article.coverImage || "",
                        is_published: false, // Draft by default
                        // Add image credit to content if available? Or separate field?
                        // For now, let's append credit to content if exists
                        image_credit: article.imageCredit
                    })
                })

                if (!response.ok) console.error("Failed to create", article.title)
            }

            toast.success("Succès", { description: `${parsedArticles.length} articles créés en brouillon.` })
            setOpen(false)
            setStep("upload")
            setFile(null)
            setParsedArticles([])
            onArticlesCreated() // Refresh list

        } catch (error) {
            toast.error("Erreur lors de la création")
        } finally {
            setProcessingStatus("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-odillon-teal/50 text-odillon-teal hover:bg-odillon-teal/5">
                    <FileType className="w-4 h-4" />
                    Import ID (IA)
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-white">
                <DialogHeader>
                    <DialogTitle>Import Intelligent d'Articles</DialogTitle>
                    <DialogDescription>
                        Importez un document (Word/PDF) contenant plusieurs articles. L'IA va les découper et trouver des images.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4">
                    {step === "upload" && (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 gap-4">
                            <Upload className="w-12 h-12 text-gray-400" />
                            <div className="text-center space-y-2">
                                <Label htmlFor="file-upload" className="cursor-pointer text-odillon-teal hover:underline font-medium text-lg">
                                    Cliquez pour choisir un fichier
                                </Label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    accept=".docx,.pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <p className="text-sm text-gray-500">.docx ou .pdf acceptés</p>
                            </div>
                            {file && (
                                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg mt-4">
                                    <FileType className="w-4 h-4" />
                                    <span className="font-medium">{file.name}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {step === "processing" && (
                        <div className="flex flex-col items-center justify-center p-12 gap-4">
                            <Loader2 className="w-12 h-12 animate-spin text-odillon-teal" />
                            <p className="text-lg font-medium animate-pulse">{processingStatus}</p>
                            <p className="text-sm text-gray-500">Cela peut prendre jusqu'à une minute selon la taille du document.</p>
                        </div>
                    )}

                    {step === "review" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {parsedArticles.map((article, idx) => (
                                <Card key={idx} className="relative overflow-hidden">
                                    {article.coverImage && (
                                        <div className="h-40 w-full overflow-hidden relative group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={article.coverImage} alt="Cover" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="secondary" size="sm" className="gap-2">
                                                    <ImageIcon className="w-4 h-4" /> Changer
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{article.subtitle}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-xs text-gray-500 mb-2">Mots-clés: {article.keywords.join(", ")}</div>
                                        <div className="prose prose-sm max-h-32 overflow-hidden relative">
                                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    {step === "upload" && (
                        <Button onClick={processFile} disabled={!file} className="w-full sm:w-auto">
                            Lancer l'Analyse
                        </Button>
                    )}
                    {step === "review" && (
                        <>
                            <Button variant="outline" onClick={() => setStep("upload")}>Annuler</Button>
                            <Button onClick={handleCreateArticles}>
                                Valider et Créer {parsedArticles.length} Brouillons
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
