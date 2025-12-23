"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Loader2, Plus, RefreshCw, Trash2, Eye, EyeOff, Building2, Upload } from "lucide-react"
import { CompanyLogo } from "@/types/admin"
import { toast } from "sonner"

export function LogosTab() {
    const [logos, setLogos] = useState<CompanyLogo[]>([])
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [newLogo, setNewLogo] = useState({
        name: "",
        full_name: "",
        logo_path: "",
        fallback: "",
        color: "#39837a"
    })

    useEffect(() => {
        loadLogos()
    }, [])

    const loadLogos = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/logos')
            if (!res.ok) throw new Error("Erreur lors du chargement")

            const data = await res.json()
            setLogos((data.logos || []).sort((a: CompanyLogo, b: CompanyLogo) => a.display_order - b.display_order))
        } catch (error: unknown) {
            console.error("Erreur logos:", error)
            toast.error("Impossible de charger les logos")
        } finally {
            setLoading(false)
        }
    }

    const handleAddLogo = async () => {
        if (!newLogo.name.trim() || !newLogo.full_name.trim() || !newLogo.logo_path.trim()) {
            toast.error("Veuillez remplir les champs obligatoires")
            return
        }

        try {
            const res = await fetch('/api/logos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLogo)
            })

            if (!res.ok) throw new Error("Erreur lors de l'ajout")

            toast.success("Logo ajouté avec succès")
            setNewLogo({
                name: "",
                full_name: "",
                logo_path: "",
                fallback: "",
                color: "#39837a"
            })
            setIsDialogOpen(false)
            loadLogos()
        } catch (error: unknown) {
            console.error("Erreur ajout logo:", error)
            toast.error("Erreur lors de l'ajout du logo")
        }
    }

    const toggleLogoActive = async (logoId: string) => {
        try {
            const logo = logos.find(l => l.id === logoId)
            if (!logo) return

            const res = await fetch(`/api/logos/${logoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !logo.is_active })
            })

            if (!res.ok) throw new Error("Erreur")

            setLogos(logos.map(l =>
                l.id === logoId ? { ...l, is_active: !l.is_active } : l
            ))
            toast.success(logo.is_active ? "Logo désactivé" : "Logo activé")
        } catch (error: unknown) {
            console.error("Erreur maj logo:", error)
            toast.error("Impossible de modifier le statut")
        }
    }

    const deleteLogo = async (logoId: string) => {
        try {
            const res = await fetch(`/api/logos/${logoId}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error("Erreur lors de la suppression")

            toast.success("Logo supprimé")
            loadLogos()
        } catch (error: unknown) {
            console.error("Erreur suppression:", error)
            toast.error("Impossible de supprimer le logo")
        }
    }

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-medium text-gray-700">Partenaires & Clients</CardTitle>
                    <Badge variant="secondary" className="bg-white border shadow-sm text-xs font-normal">
                        {logos.length} logos
                    </Badge>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter un logo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Nouveau Partenaire</DialogTitle>
                            <DialogDescription>
                                Ajoutez les logos des entreprises partenaires qui défileront sur la page d'accueil.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nom Court (ex: ACME)</label>
                                    <Input
                                        value={newLogo.name}
                                        onChange={(e) => setNewLogo({ ...newLogo, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Initiales (ex: A)</label>
                                    <Input
                                        value={newLogo.fallback}
                                        placeholder="Pour le placeholder"
                                        onChange={(e) => setNewLogo({ ...newLogo, fallback: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom Complet</label>
                                <Input
                                    value={newLogo.full_name}
                                    onChange={(e) => setNewLogo({ ...newLogo, full_name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Logo</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://..."
                                        value={newLogo.logo_path}
                                        onChange={(e) => setNewLogo({ ...newLogo, logo_path: e.target.value })}
                                        className="flex-1"
                                    />
                                    <div className="relative">
                                        <Input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0]
                                                if (!file) return

                                                try {
                                                    const formData = new FormData()
                                                    formData.append('file', file)
                                                    formData.append('bucket', 'logos') // Using 'logos' bucket, fallback to 'hero-photos' if needed in future

                                                    toast.promise(
                                                        fetch('/api/upload', {
                                                            method: 'POST',
                                                            body: formData
                                                        }).then(async (res) => {
                                                            if (!res.ok) throw new Error("Upload failed")
                                                            const data = await res.json()
                                                            setNewLogo(prev => ({ ...prev, logo_path: data.url }))
                                                            return data
                                                        }),
                                                        {
                                                            loading: 'Téléchargement...',
                                                            success: 'Logo téléchargé',
                                                            error: 'Erreur de téléchargement'
                                                        }
                                                    )
                                                } catch (error) {
                                                    console.error("Upload error:", error)
                                                }
                                            }}
                                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                        />
                                        <Button variant="outline" size="icon" className="shrink-0 pointer-events-none">
                                            <Upload className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500">
                                    Formats acceptés: PNG, JPG, WEBP, SVG
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Couleur de fond (Placeholder)</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={newLogo.color}
                                        onChange={(e) => setNewLogo({ ...newLogo, color: e.target.value })}
                                        className="w-12 p-1 h-9 cursor-pointer"
                                    />
                                    <Input
                                        value={newLogo.color}
                                        onChange={(e) => setNewLogo({ ...newLogo, color: e.target.value })}
                                        className="font-mono uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button onClick={handleAddLogo} className="bg-green-600 hover:bg-green-700">Enregistrer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent className="p-6 bg-gray-50/30 min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    </div>
                ) : logos.length === 0 ? (
                    <div className="text-center py-12">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Aucun logo partenaire</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {logos.map((logo) => (
                            <Card key={logo.id} className="group hover:shadow-md transition-shadow border-gray-100">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm overflow-hidden bg-white border border-gray-100"
                                            style={{ backgroundColor: logo.logo_path ? 'white' : logo.color }}
                                        >
                                            {logo.logo_path ? (
                                                <img
                                                    src={logo.logo_path}
                                                    alt={logo.full_name}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            ) : (
                                                logo.fallback
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{logo.full_name}</p>
                                            <p className="text-xs text-gray-500">{logo.name}</p>
                                            <div className="mt-1">
                                                {logo.is_active ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-none text-[10px] px-2">Actif</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-[10px] px-2">Inactif</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2 border-t border-gray-50">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => toggleLogoActive(logo.id)}
                                            className="flex-1 h-8 text-xs"
                                        >
                                            {logo.is_active ? (
                                                <><EyeOff className="w-3 h-3 mr-2" /> Masquer</>
                                            ) : (
                                                <><Eye className="w-3 h-3 mr-2" /> Afficher</>
                                            )}
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Supprimer ce partenaire ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Le logo de <strong>{logo.full_name}</strong> sera retiré définitivement.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteLogo(logo.id)} className="bg-red-600 hover:bg-red-700">
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
