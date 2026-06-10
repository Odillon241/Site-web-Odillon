# Calendrier de formations — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une page publique `/calendrier-formations` (calendrier mensuel + liste) affichant des sessions de formation gérées depuis le panneau d'administration.

**Architecture:** On suit le pattern CRUD existant du projet (table Supabase → routes API `/api/formations` → onglet admin `FormationsTab` → page publique). Aucune inscription en base : un bouton « S'inscrire » renvoie vers `/contact`.

**Tech Stack:** Next.js 16 (App Router), React 19/TypeScript, Supabase (server/client/MCP), shadcn/ui, `react-day-picker` (via `components/ui/calendar.tsx`), `sonner` (toasts), Tailwind.

> **Note sur les tests :** ce dépôt ne contient **aucun framework de test** (pas de Jest/Vitest/Playwright). Conformément aux conventions du projet, la vérification se fait par **`npm run build` + `npm run lint` + test manuel** (admin CRUD et page publique via `npm run dev`). N'introduisez pas de framework de test.

---

## Structure des fichiers

| Fichier | Rôle | Action |
|---|---|---|
| Migration Supabase `create_formations_table` | Table `formations` + RLS | Créer (MCP) |
| `app/api/formations/route.ts` | GET (liste / `?active=true`) + POST | Créer |
| `app/api/formations/[id]/route.ts` | PATCH + DELETE | Créer |
| `components/admin/tabs/FormationsTab.tsx` | UI admin CRUD | Créer |
| `app/admin/settings/page.tsx` | Monter l'onglet + label | Modifier |
| `components/admin/admin-sidebar.tsx` | Entrée de menu + icône | Modifier |
| `components/sections/formations-calendar.tsx` | Calendrier + liste (public) | Créer |
| `app/calendrier-formations/page.tsx` | Page publique (server) | Créer |
| `components/layout/header-pro.tsx` | Lien « Formations » | Modifier |
| `components/layout/footer.tsx` | Lien footer | Modifier |
| `app/offres/formations/page.tsx` | Bouton « Voir le calendrier » | Modifier |

---

## Task 1 : Table `formations` + RLS (MCP Supabase)

**Files:**
- Migration MCP : `create_formations_table` (project_id `xqkaraihiqqfcasmduuh`)

- [ ] **Step 1 : Appliquer la migration**

Utiliser l'outil MCP `mcp__supabase__apply_migration` (ou son équivalent disponible) avec :
- `project_id`: `xqkaraihiqqfcasmduuh`
- `name`: `create_formations_table`
- `query`:

```sql
CREATE TABLE IF NOT EXISTS public.formations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text NOT NULL,
  date_debut date NOT NULL,
  date_fin date,
  horaires text,
  duree text,
  formateur text,
  lieu text,
  modalite text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Formations actives lisibles publiquement"
  ON public.formations FOR SELECT
  USING (is_active = true);

CREATE POLICY "Utilisateurs authentifies lecture complete"
  ON public.formations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Utilisateurs authentifies inserent"
  ON public.formations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Utilisateurs authentifies modifient"
  ON public.formations FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Utilisateurs authentifies suppriment"
  ON public.formations FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS formations_date_debut_idx ON public.formations (date_debut);
```

- [ ] **Step 2 : Vérifier la création**

Utiliser `mcp__supabase__list_tables` (project_id `xqkaraihiqqfcasmduuh`) et confirmer que la table `formations` apparaît avec les colonnes ci-dessus et RLS activé.

- [ ] **Step 3 : Insérer une ligne de test (pour le développement)**

Via `mcp__supabase__execute_sql` :

```sql
INSERT INTO public.formations (titre, description, date_debut, horaires, duree, formateur, lieu, modalite)
VALUES (
  'Gouvernance d''entreprise : les fondamentaux',
  'Une formation pour maîtriser les principes de la gouvernance d''entreprise et leur application au Gabon.',
  CURRENT_DATE + INTERVAL '14 days',
  '9h00 – 17h00',
  '2 jours',
  'Cabinet Odillon',
  'Libreville',
  'presentiel'
);
```

(Ligne de test, supprimable plus tard depuis l'admin.)

---

## Task 2 : Route API liste + création — `app/api/formations/route.ts`

**Files:**
- Create: `app/api/formations/route.ts`

Réplique exacte du pattern de `app/api/team/route.ts`.

- [ ] **Step 1 : Créer le fichier**

```typescript
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const activeOnly = searchParams.get("active") === "true"

        const supabase = await createClient()
        let query = supabase
            .from("formations")
            .select("*")
            .order("date_debut", { ascending: true })

        if (activeOnly) {
            query = query.eq("is_active", true)
        }

        const { data: formations, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ formations })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { titre, description, date_debut, date_fin, horaires, duree, formateur, lieu, modalite, is_active } = body

        if (!titre || !description || !date_debut) {
            return NextResponse.json({ error: "Le titre, la description et la date de début sont obligatoires" }, { status: 400 })
        }

        const { data, error } = await supabase
            .from("formations")
            .insert({
                titre,
                description,
                date_debut,
                date_fin: date_fin || null,
                horaires: horaires || null,
                duree: duree || null,
                formateur: formateur || null,
                lieu: lieu || null,
                modalite: modalite || null,
                is_active: is_active ?? true,
                created_by: user.id
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ formation: data })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
```

- [ ] **Step 2 : Vérifier (GET public)**

Démarrer `npm run dev` puis :
Run: `curl "http://localhost:3000/api/formations?active=true"`
Expected: JSON `{"formations":[...]}` contenant la formation de test (Task 1, Step 3).

- [ ] **Step 3 : Commit**

```bash
git add app/api/formations/route.ts
git commit -m "feat(api): route formations GET/POST"
```

---

## Task 3 : Route API édition + suppression — `app/api/formations/[id]/route.ts`

**Files:**
- Create: `app/api/formations/[id]/route.ts`

Réplique exacte du pattern de `app/api/team/[id]/route.ts`.

- [ ] **Step 1 : Créer le fichier**

```typescript
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { data, error } = await supabase
            .from("formations")
            .update(body)
            .eq("id", id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ formation: data })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { error } = await supabase
            .from("formations")
            .delete()
            .eq("id", id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
```

- [ ] **Step 2 : Vérifier (auth requise)**

Run: `curl -X DELETE "http://localhost:3000/api/formations/00000000-0000-0000-0000-000000000000"`
Expected: `{"error":"Unauthorized"}` avec code HTTP 401 (pas de cookie de session → refusé).

- [ ] **Step 3 : Commit**

```bash
git add app/api/formations/[id]/route.ts
git commit -m "feat(api): route formations PATCH/DELETE"
```

---

## Task 4 : Onglet admin — `components/admin/tabs/FormationsTab.tsx`

**Files:**
- Create: `components/admin/tabs/FormationsTab.tsx`

Inspiré de `TeamTab.tsx` mais **sans drag-and-drop** (le tri se fait par date) et **sans upload d'image**.

- [ ] **Step 1 : Créer le fichier**

```tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus, Trash2, Eye, EyeOff, GraduationCap, Pencil, Clock, MapPin, User } from "lucide-react"
import { toast } from "sonner"

interface Formation {
    id: string
    titre: string
    description: string
    date_debut: string
    date_fin?: string | null
    horaires?: string | null
    duree?: string | null
    formateur?: string | null
    lieu?: string | null
    modalite?: string | null
    is_active: boolean
}

const MODALITE_OPTIONS = [
    { value: "presentiel", label: "Présentiel" },
    { value: "distanciel", label: "Distanciel" },
    { value: "hybride", label: "Hybride" },
]

const MODALITE_LABELS: Record<string, string> = {
    presentiel: "Présentiel",
    distanciel: "Distanciel",
    hybride: "Hybride",
}

const emptyForm = {
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    horaires: "",
    duree: "",
    formateur: "",
    lieu: "",
    modalite: "",
}

function formatDate(iso?: string | null) {
    if (!iso) return ""
    return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", {
        day: "numeric", month: "short", year: "numeric"
    })
}

export function FormationsTab() {
    const [formations, setFormations] = useState<Formation[]>([])
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Formation | null>(null)
    const [form, setForm] = useState({ ...emptyForm })

    useEffect(() => {
        loadFormations()
    }, [])

    const loadFormations = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/formations')
            if (!res.ok) throw new Error("Erreur lors du chargement")
            const data = await res.json()
            setFormations(data.formations || [])
        } catch (error) {
            console.error("Erreur formations:", error)
            toast.error("Impossible de charger les formations")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setForm({ ...emptyForm })
        setEditing(null)
    }

    const handleEdit = (f: Formation) => {
        setEditing(f)
        setForm({
            titre: f.titre,
            description: f.description,
            date_debut: f.date_debut || "",
            date_fin: f.date_fin || "",
            horaires: f.horaires || "",
            duree: f.duree || "",
            formateur: f.formateur || "",
            lieu: f.lieu || "",
            modalite: f.modalite || "",
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!form.titre.trim() || !form.description.trim() || !form.date_debut) {
            toast.error("Le titre, la description et la date de début sont obligatoires")
            return
        }

        try {
            const isEditing = !!editing
            const url = isEditing ? `/api/formations/${editing.id}` : '/api/formations'
            const method = isEditing ? 'PATCH' : 'POST'

            const body = {
                ...form,
                date_fin: form.date_fin || null,
                horaires: form.horaires || null,
                duree: form.duree || null,
                formateur: form.formateur || null,
                lieu: form.lieu || null,
                modalite: form.modalite || null,
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!res.ok) throw new Error("Erreur lors de l'enregistrement")

            toast.success(isEditing ? "Formation modifiée" : "Formation ajoutée")
            resetForm()
            setIsDialogOpen(false)
            loadFormations()
        } catch (error) {
            console.error("Erreur save formation:", error)
            toast.error("Erreur lors de l'enregistrement")
        }
    }

    const toggleActive = async (id: string) => {
        try {
            const f = formations.find(x => x.id === id)
            if (!f) return
            const res = await fetch(`/api/formations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !f.is_active })
            })
            if (!res.ok) throw new Error("Erreur")
            setFormations(formations.map(x => x.id === id ? { ...x, is_active: !x.is_active } : x))
            toast.success(f.is_active ? "Formation masquée" : "Formation affichée")
        } catch (error) {
            console.error("Erreur maj formation:", error)
            toast.error("Impossible de modifier le statut")
        }
    }

    const deleteFormation = async (id: string) => {
        try {
            const res = await fetch(`/api/formations/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error("Erreur lors de la suppression")
            toast.success("Formation supprimée")
            loadFormations()
        } catch (error) {
            console.error("Erreur suppression:", error)
            toast.error("Impossible de supprimer la formation")
        }
    }

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-medium text-gray-700">Calendrier des formations</CardTitle>
                    <Badge variant="secondary" className="bg-white border shadow-sm text-xs font-normal">
                        {formations.length} formation{formations.length > 1 ? "s" : ""}
                    </Badge>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    if (!open) resetForm()
                    setIsDialogOpen(open)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-odillon-teal hover:bg-odillon-teal/90 text-white shadow-sm gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter une formation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Modifier la formation" : "Nouvelle formation"}</DialogTitle>
                            <DialogDescription>
                                {editing
                                    ? "Modifiez les informations de la session de formation."
                                    : "Ajoutez une session au calendrier des formations affiché sur le site."}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Titre *</label>
                                <Input
                                    value={form.titre}
                                    onChange={(e) => setForm({ ...form, titre: e.target.value })}
                                    placeholder="ex: Gouvernance d'entreprise"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description *</label>
                                <Textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Objectifs et contenu de la formation..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date de début *</label>
                                    <Input
                                        type="date"
                                        value={form.date_debut}
                                        onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date de fin</label>
                                    <Input
                                        type="date"
                                        value={form.date_fin}
                                        onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Horaires</label>
                                    <Input
                                        value={form.horaires}
                                        onChange={(e) => setForm({ ...form, horaires: e.target.value })}
                                        placeholder="ex: 9h00 – 17h00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Durée</label>
                                    <Input
                                        value={form.duree}
                                        onChange={(e) => setForm({ ...form, duree: e.target.value })}
                                        placeholder="ex: 2 jours"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Formateur / intervenant</label>
                                <Input
                                    value={form.formateur}
                                    onChange={(e) => setForm({ ...form, formateur: e.target.value })}
                                    placeholder="ex: Cabinet Odillon"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Lieu</label>
                                    <Input
                                        value={form.lieu}
                                        onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                                        placeholder="ex: Libreville"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Modalité</label>
                                    <Select
                                        value={form.modalite || "none"}
                                        onValueChange={(value) => setForm({ ...form, modalite: value === "none" ? "" : value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Non précisée</SelectItem>
                                            {MODALITE_OPTIONS.map((m) => (
                                                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button onClick={handleSave} className="bg-odillon-teal hover:bg-odillon-teal/90 text-white">
                                {editing ? "Enregistrer" : "Créer"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent className="p-6 bg-gray-50/30 min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
                    </div>
                ) : formations.length === 0 ? (
                    <div className="text-center py-12">
                        <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Aucune formation programmée</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {formations.map((f) => (
                            <Card key={f.id} className="border-gray-100 hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900 truncate">{f.titre}</h3>
                                            {f.is_active ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none text-xs">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-xs">Inactive</Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDate(f.date_debut)}
                                                {f.date_fin ? ` → ${formatDate(f.date_fin)}` : ""}
                                                {f.horaires ? ` · ${f.horaires}` : ""}
                                            </span>
                                            {f.lieu && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {f.lieu}{f.modalite ? ` (${MODALITE_LABELS[f.modalite] || f.modalite})` : ""}
                                                </span>
                                            )}
                                            {f.formateur && (
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3.5 h-3.5" />
                                                    {f.formateur}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        <Button size="sm" variant="ghost" onClick={() => handleEdit(f)}
                                            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => toggleActive(f.id)} className="h-8 text-xs">
                                            {f.is_active ? (<><EyeOff className="w-3 h-3 mr-1" /> Masquer</>) : (<><Eye className="w-3 h-3 mr-1" /> Afficher</>)}
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Supprimer cette formation ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        <strong>{f.titre}</strong> sera retirée définitivement du calendrier.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteFormation(f.id)} className="bg-red-600 hover:bg-red-700">
                                                        Supprimer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
```

- [ ] **Step 2 : Vérifier le typage**

Run: `npm run lint`
Expected: aucune erreur sur `components/admin/tabs/FormationsTab.tsx`.

- [ ] **Step 3 : Commit**

```bash
git add components/admin/tabs/FormationsTab.tsx
git commit -m "feat(admin): onglet de gestion des formations"
```

---

## Task 5 : Brancher l'onglet dans le dashboard — `app/admin/settings/page.tsx`

**Files:**
- Modify: `app/admin/settings/page.tsx`

- [ ] **Step 1 : Ajouter l'import du composant**

Après la ligne `import { TeamTab } from "@/components/admin/tabs/TeamTab"` (ligne 50), ajouter :

```tsx
import { FormationsTab } from "@/components/admin/tabs/FormationsTab"
```

- [ ] **Step 2 : Ajouter le label**

Dans l'objet `labels` de `getTabLabel`, après la ligne `calendar: "Calendrier",`, ajouter :

```tsx
      formations: "Formations",
```

- [ ] **Step 3 : Monter l'onglet**

Dans le bloc de rendu conditionnel, après la ligne `{activeTab === 'calendar' && <CalendarTab />}`, ajouter :

```tsx
            {activeTab === 'formations' && <FormationsTab />}
```

- [ ] **Step 4 : Vérifier le build**

Run: `npm run lint`
Expected: aucune nouvelle erreur.

- [ ] **Step 5 : Commit**

```bash
git add app/admin/settings/page.tsx
git commit -m "feat(admin): monter l'onglet formations dans le dashboard"
```

---

## Task 6 : Entrée de menu admin — `components/admin/admin-sidebar.tsx`

**Files:**
- Modify: `components/admin/admin-sidebar.tsx`

- [ ] **Step 1 : Importer l'icône `GraduationCap`**

Dans le bloc d'import `lucide-react` (lignes 4-30), ajouter `GraduationCap,` à la liste (par exemple après `CalendarDays,`).

- [ ] **Step 2 : Ajouter l'entrée de navigation**

Dans le groupe `"Contenu"` du tableau `navItems`, après la ligne
`{ title: "Logos Partenaires", icon: Building2, value: "logos" },`, ajouter :

```tsx
                { title: "Formations", icon: GraduationCap, value: "formations" },
```

- [ ] **Step 3 : Vérifier manuellement**

Démarrer `npm run dev`, se connecter à `/admin/settings`, cliquer sur « Formations » dans la sidebar (groupe Contenu).
Expected: l'onglet `FormationsTab` s'affiche avec la formation de test ; on peut créer/éditer/masquer/supprimer une formation et voir un toast de confirmation.

- [ ] **Step 4 : Commit**

```bash
git add components/admin/admin-sidebar.tsx
git commit -m "feat(admin): lien Formations dans la sidebar"
```

---

## Task 7 : Composant public calendrier + liste — `components/sections/formations-calendar.tsx`

**Files:**
- Create: `components/sections/formations-calendar.tsx`

- [ ] **Step 1 : Créer le fichier**

```tsx
"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, MapPin, User, GraduationCap, ArrowRight } from "lucide-react"

export interface Formation {
    id: string
    titre: string
    description: string
    date_debut: string
    date_fin?: string | null
    horaires?: string | null
    duree?: string | null
    formateur?: string | null
    lieu?: string | null
    modalite?: string | null
}

const MODALITE_LABELS: Record<string, string> = {
    presentiel: "Présentiel",
    distanciel: "Distanciel",
    hybride: "Hybride",
}

function toDate(iso: string) {
    return new Date(iso + "T00:00:00")
}

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate()
}

function formatDateRange(debut: string, fin?: string | null) {
    const d = toDate(debut)
    const full: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
    if (!fin || fin === debut) {
        return d.toLocaleDateString("fr-FR", full)
    }
    const f = toDate(fin)
    return `${d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} – ${f.toLocaleDateString("fr-FR", full)}`
}

function FormationCard({ f }: { f: Formation }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-odillon-teal/10 text-odillon-teal hover:bg-odillon-teal/20 border-none">
                    <CalendarDays className="w-3.5 h-3.5 mr-1" />
                    {formatDateRange(f.date_debut, f.date_fin)}
                </Badge>
                {f.modalite && (
                    <Badge variant="outline" className="border-odillon-lime/40 text-odillon-dark bg-odillon-lime/10">
                        {MODALITE_LABELS[f.modalite] || f.modalite}
                    </Badge>
                )}
            </div>

            <h3 className="text-xl font-bold text-odillon-dark mb-2">{f.titre}</h3>
            <p className="text-gray-600 leading-relaxed mb-4">{f.description}</p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-5">
                {(f.horaires || f.duree) && (
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-odillon-teal" />
                        {[f.horaires, f.duree].filter(Boolean).join(" · ")}
                    </span>
                )}
                {f.lieu && (
                    <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-odillon-teal" />
                        {f.lieu}
                    </span>
                )}
                {f.formateur && (
                    <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-odillon-teal" />
                        {f.formateur}
                    </span>
                )}
            </div>

            <Button asChild className="bg-odillon-teal hover:bg-odillon-teal/90 text-white gap-2">
                <Link href={`/contact?formation=${encodeURIComponent(f.titre)}`}>
                    S'inscrire
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </Button>
        </div>
    )
}

export function FormationsCalendar({ formations }: { formations: Formation[] }) {
    const [month, setMonth] = useState<Date>(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

    const formationDays = useMemo(
        () => formations.map(f => toDate(f.date_debut)),
        [formations]
    )

    const visible = useMemo(() => {
        if (!selectedDate) return formations
        return formations.filter(f => isSameDay(toDate(f.date_debut), selectedDate))
    }, [formations, selectedDate])

    return (
        <section className="bg-gradient-to-b from-white to-gray-50/50 py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-odillon-teal/10 text-odillon-teal text-sm font-medium mb-4">
                        <GraduationCap className="w-4 h-4" />
                        Formations professionnelles
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-odillon-dark mb-4">
                        Calendrier des formations
                    </h1>
                    <p className="text-lg text-gray-600">
                        Découvrez nos prochaines sessions de formation et inscrivez-vous pour développer
                        les compétences de votre entreprise.
                    </p>
                </div>

                <div className="grid lg:grid-cols-[minmax(0,360px)_1fr] gap-8 lg:gap-12 items-start">
                    {/* Calendrier */}
                    <div className="lg:sticky lg:top-28">
                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex justify-center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                month={month}
                                onMonthChange={setMonth}
                                modifiers={{ hasFormation: formationDays }}
                                modifiersClassNames={{
                                    hasFormation: "bg-odillon-teal/15 text-odillon-teal font-bold rounded-full",
                                }}
                            />
                        </div>
                        {selectedDate && (
                            <Button
                                variant="ghost"
                                onClick={() => setSelectedDate(undefined)}
                                className="mt-3 w-full text-odillon-teal hover:text-odillon-teal/80"
                            >
                                Voir toutes les formations
                            </Button>
                        )}
                    </div>

                    {/* Liste */}
                    <div className="space-y-5">
                        {visible.length === 0 ? (
                            <div className="text-center py-16 rounded-2xl border border-dashed border-gray-200 bg-white">
                                <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">
                                    {selectedDate
                                        ? "Aucune formation programmée à cette date."
                                        : "Aucune formation programmée pour le moment."}
                                </p>
                            </div>
                        ) : (
                            visible.map(f => <FormationCard key={f.id} f={f} />)
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
```

- [ ] **Step 2 : Vérifier le typage**

Run: `npm run lint`
Expected: aucune erreur sur ce fichier (les props `modifiers`/`modifiersClassNames` sont supportées par `react-day-picker` via `components/ui/calendar.tsx`).

- [ ] **Step 3 : Commit**

```bash
git add components/sections/formations-calendar.tsx
git commit -m "feat(public): composant calendrier + liste des formations"
```

---

## Task 8 : Page publique — `app/calendrier-formations/page.tsx`

**Files:**
- Create: `app/calendrier-formations/page.tsx`

Structure calquée sur `app/offres/formations/page.tsx` (Header dynamique, Footer, ScrollToTop, padding header fixe).

- [ ] **Step 1 : Créer le fichier**

```tsx
import dynamic from "next/dynamic"
import { createClient } from "@/lib/supabase/server"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/magicui/scroll-to-top"
import { FormationsCalendar, type Formation } from "@/components/sections/formations-calendar"

const HeaderPro = dynamic(() => import("@/components/layout/header-pro").then(mod => mod.HeaderPro), { ssr: true })

export const metadata = {
    title: "Calendrier des Formations | Odillon - Ingénierie d'Entreprises",
    description: "Découvrez le calendrier des sessions de formation professionnelle proposées par le cabinet Odillon au Gabon et inscrivez-vous.",
}

export default async function CalendrierFormationsPage() {
    const supabase = await createClient()
    const { data: formations } = await supabase
        .from("formations")
        .select("*")
        .eq("is_active", true)
        .order("date_debut", { ascending: true })

    return (
        <>
            <ScrollToTop />
            <HeaderPro />
            <main className="min-h-screen pt-[88px] md:pt-[104px]">
                <FormationsCalendar formations={(formations as Formation[]) || []} />
            </main>
            <Footer />
        </>
    )
}
```

- [ ] **Step 2 : Vérifier la page**

Avec `npm run dev`, ouvrir `http://localhost:3000/calendrier-formations`.
Expected: la page affiche l'en-tête, le calendrier (le jour de la formation de test est surligné en teal) et la carte de formation avec un bouton « S'inscrire » pointant vers `/contact`. Cliquer sur le jour surligné filtre la liste ; « Voir toutes les formations » réinitialise.

- [ ] **Step 3 : Commit**

```bash
git add app/calendrier-formations/page.tsx
git commit -m "feat(public): page /calendrier-formations"
```

---

## Task 9 : Lien dans le header — `components/layout/header-pro.tsx`

**Files:**
- Modify: `components/layout/header-pro.tsx`

Le champ `icon` est une chaîne résolue par une fonction `getIcon` (un `switch`) présente **deux fois** : dans la vue desktop (vers la ligne 122) et la vue mobile (vers la ligne 232). Le `switch` renvoie `null` par défaut : il faut donc importer l'icône **et** ajouter un `case` dans les deux fonctions.

- [ ] **Step 1 : Importer l'icône `GraduationCap`**

En haut de `components/layout/header-pro.tsx`, dans l'import depuis `lucide-react` (qui contient déjà `Home`, `Briefcase`, `Users`, `Image as ImageIcon`, `Newspaper`…), ajouter `GraduationCap`.

- [ ] **Step 2 : Ajouter l'entrée de navigation**

Dans le tableau `navigation` (lignes 12-44), après le bloc « Nos offres » (qui se termine à la ligne `},` après le submenu, ligne 28), insérer :

```tsx
  {
    name: "Formations",
    href: "/calendrier-formations",
    icon: "GraduationCap"
  },
```

- [ ] **Step 3 : Ajouter le `case` dans les DEUX fonctions `getIcon`**

Dans chacune des deux fonctions `getIcon` (desktop ~ligne 122 et mobile ~ligne 232), ajouter avant la ligne `default: return null` :

```tsx
                  case 'GraduationCap': return GraduationCap
```

- [ ] **Step 4 : Vérifier le rendu (desktop + mobile)**

Avec `npm run dev`, recharger n'importe quelle page : « Formations » apparaît dans la barre de navigation (desktop) et dans le menu mobile, et pointe vers `/calendrier-formations`.
Expected: navigation fonctionnelle, lien actif correctement surligné sur la page cible, icône « chapeau de diplômé » visible.

- [ ] **Step 5 : Commit**

```bash
git add components/layout/header-pro.tsx
git commit -m "feat(nav): lien Formations dans le header"
```

---

## Task 10 : Lien dans le footer — `components/layout/footer.tsx`

**Files:**
- Modify: `components/layout/footer.tsx`

- [ ] **Step 1 : Ajouter le lien dans `quickLinks`**

Dans le tableau `quickLinks` (lignes 17-24), après la ligne `{ name: 'Blog', href: '/blog' },`, insérer :

```tsx
    { name: 'Formations', href: '/calendrier-formations' },
```

- [ ] **Step 2 : Vérifier**

Recharger une page, faire défiler jusqu'au footer : le lien « Formations » apparaît dans la colonne « Navigation » et pointe vers `/calendrier-formations`.

- [ ] **Step 3 : Commit**

```bash
git add components/layout/footer.tsx
git commit -m "feat(nav): lien Formations dans le footer"
```

---

## Task 11 : Bouton « Voir le calendrier » sur la page offre — `app/offres/formations/page.tsx`

**Files:**
- Modify: `app/offres/formations/page.tsx`

- [ ] **Step 1 : Ajouter un bandeau CTA**

Importer `Link` en haut du fichier (après les imports existants) :

```tsx
import Link from "next/link"
```

Puis, dans le JSX retourné, juste après `<ServiceSingle service={service} />` (toujours à l'intérieur de `<main>`), insérer le bandeau :

```tsx
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-2xl bg-gradient-to-r from-odillon-teal to-teal-700 text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Consultez nos prochaines sessions</h2>
              <p className="text-teal-100">Dates, lieux et modalités de nos formations professionnelles.</p>
            </div>
            <Link
              href="/calendrier-formations"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-odillon-teal font-medium px-6 py-3 rounded-full hover:bg-teal-50 transition-colors shadow-lg"
            >
              Voir le calendrier des formations
            </Link>
          </div>
        </div>
```

- [ ] **Step 2 : Vérifier**

Ouvrir `http://localhost:3000/offres/formations` : le bandeau apparaît sous le contenu du service avec un bouton qui mène à `/calendrier-formations`.

- [ ] **Step 3 : Commit**

```bash
git add app/offres/formations/page.tsx
git commit -m "feat(nav): bouton vers le calendrier depuis l'offre formations"
```

---

## Task 12 : Vérification finale

- [ ] **Step 1 : Build complet**

Run: `npm run build`
Expected: build réussi, aucune erreur de type ni de compilation. La route `/calendrier-formations` apparaît dans la sortie de build.

- [ ] **Step 2 : Lint**

Run: `npm run lint`
Expected: aucune nouvelle erreur introduite par les fichiers créés/modifiés.

- [ ] **Step 3 : Parcours manuel de bout en bout**

Avec `npm run dev` :
1. Admin (`/admin/settings` → onglet Formations) : créer une 2ᵉ formation à une date différente, l'éditer, la masquer puis l'afficher.
2. Page publique (`/calendrier-formations`) : vérifier que seule(s) la/les formation(s) active(s) s'affiche(nt), que les jours concernés sont surlignés, que le filtre par jour fonctionne, et que « S'inscrire » mène à `/contact`.
3. Vérifier les liens header + footer + bouton de la page offre formations.
Expected: tout fonctionne ; une formation masquée disparaît de la page publique.

- [ ] **Step 4 : Supprimer la formation de test (optionnel)**

Depuis l'admin, supprimer la formation de test créée en Task 1 si elle n'est plus utile.

---

## Couverture de la spec

- Table `formations` + RLS → Task 1
- API CRUD → Tasks 2-3
- Onglet admin (création/édition/activation/suppression) → Tasks 4-6
- Page publique calendrier + liste → Tasks 7-8
- Bouton « S'inscrire » → /contact → Task 7
- Lien header → Task 9 ; footer → Task 10 ; bouton offre → Task 11
- Champs (titre, dates, description, horaires, durée, formateur, lieu, modalité) → Tasks 1, 4, 7
- Hors périmètre (inscriptions en base, tarif/places/catégorie, paiement) → non implémentés (conforme spec)
