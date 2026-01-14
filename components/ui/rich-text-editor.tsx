"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
    Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, Link as LinkIcon,
    Undo, Redo, FileUp, Loader2, Image as ImageIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { importDocument } from '@/lib/document-import'
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { useState } from 'react'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const [uploadingImage, setUploadingImage] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-odillon-teal hover:underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto shadow-sm my-4',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none min-h-[300px] p-4 bg-white rounded-b-md border border-t-0 border-gray-200',
            },
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !editor) return

        try {
            const html = await importDocument(file)
            editor.commands.setContent(html) // Replace content or use insertContent
            toast.success("Document importé", { description: "Le contenu a été ajouté à l'éditeur. (Import Simple sans IA)" })
        } catch (error) {
            console.error("Import error:", error)
            toast.error("Erreur d'import", { description: "Impossible de lire le fichier." })
        } finally {
            // Reset input value to allow re-uploading the same file if needed
            e.target.value = ''
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !editor) return

        try {
            setUploadingImage(true)
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Erreur upload")

            const { url } = await response.json()
            editor.chain().focus().setImage({ src: url }).run()
            toast.success("Image ajoutée")

        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Erreur d'upload", { description: "Impossible d'uploader l'image" })
        } finally {
            setUploadingImage(false)
            e.target.value = ''
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col border border-gray-200 rounded-md overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    aria-label="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    aria-label="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    aria-label="H2"
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    aria-label="H3"
                >
                    <Heading3 className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    aria-label="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    aria-label="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    aria-label="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive('link')}
                    onPressedChange={() => {
                        const previousUrl = editor.getAttributes('link').href
                        const url = window.prompt('URL', previousUrl)

                        if (url === null) {
                            return
                        }

                        if (url === '') {
                            editor.chain().focus().extendMarkRange('link').unsetLink().run()
                            return
                        }

                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                    }}
                    aria-label="Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Toggle>

                {/* IMAGE UPLOAD */}
                <div className="relative">
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Insérer une image"
                        disabled={uploadingImage}
                    />
                    <Toggle size="sm" aria-label="Insert Image" asChild>
                        <button className={`pointer-events-none ${uploadingImage ? 'opacity-50' : ''}`}>
                            {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                        </button>
                    </Toggle>
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <div className="relative">
                    <input
                        type="file"
                        accept=".docx, .pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Importer un fichier (.docx, .pdf)"
                    />
                    <Toggle size="sm" aria-label="Import Document" asChild>
                        <button className="pointer-events-none flex items-center gap-1 text-xs px-2">
                            <FileUp className="h-4 w-4" /> Import Simple
                        </button>
                    </Toggle>
                </div>

                <div className="flex-grow" />

                <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    aria-label="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    aria-label="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Toggle>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}
