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
import { Loader2, Plus, Trash2, Eye, EyeOff, Users, Upload, Linkedin, Mail, Pencil } from "lucide-react"
import { toast } from "sonner"

interface TeamMember {
    id: string
    name: string
    role: string
    bio?: string
    photo_url?: string
    linkedin_url?: string
    email?: string
    is_active: boolean
    display_order: number
}

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
function SortableTeamCard({ member, handleEdit, toggleMemberActive, deleteMember }: {
    member: TeamMember,
    handleEdit: (m: TeamMember) => void,
    toggleMemberActive: (id: string) => void,
    deleteMember: (id: string) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: member.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="group hover:shadow-md transition-shadow border-gray-100 overflow-hidden h-full cursor-grab active:cursor-grabbing">
                <CardContent className="p-0">
                    <div className="aspect-[4/5] relative bg-gray-100 pointer-events-none">
                        {member.photo_url ? (
                            <img
                                src={member.photo_url}
                                alt={member.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Users className="w-16 h-16" />
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            {member.is_active ? (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-sm backdrop-blur-sm">Actif</Badge>
                            ) : (
                                <Badge variant="secondary" className="backdrop-blur-sm">Inactif</Badge>
                            )}
                        </div>
                    </div>
                    <div className="p-4" onPointerDown={(e) => e.stopPropagation()}>
                        {/* Stop propagation so buttons work without dragging */}
                        <h3 className="font-bold text-gray-900 truncate">{member.name}</h3>
                        <p className="text-sm text-odillon-teal font-medium truncate mb-2">{member.role}</p>

                        <div className="flex gap-2 pt-2 border-t border-gray-50 mt-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(member)}
                                className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </Button>

                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleMemberActive(member.id)}
                                className="flex-1 h-8 text-xs"
                            >
                                {member.is_active ? (
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
                                        <AlertDialogTitle>Supprimer ce membre ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            <strong>{member.name}</strong> sera retiré définitivement de la liste.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteMember(member.id)} className="bg-red-600 hover:bg-red-700">
                                            Supprimer
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function TeamTab() {
    const [team, setTeam] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

    const [newMember, setNewMember] = useState({
        name: "",
        role: "",
        bio: "",
        photo_url: "",
        linkedin_url: "",
        email: ""
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadTeam()
    }, [])

    const loadTeam = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/team')
            if (!res.ok) throw new Error("Erreur lors du chargement")

            const data = await res.json()
            setTeam((data.team || []).sort((a: TeamMember, b: TeamMember) => a.display_order - b.display_order))
        } catch (error: unknown) {
            console.error("Erreur team:", error)
            toast.error("Impossible de charger l'équipe")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setNewMember({
            name: "",
            role: "",
            bio: "",
            photo_url: "",
            linkedin_url: "",
            email: ""
        })
        setEditingMember(null)
    }

    const handleSaveMember = async () => {
        if (!newMember.name.trim() || !newMember.role.trim()) {
            toast.error("Le nom et le rôle sont obligatoires")
            return
        }

        try {
            const isEditing = !!editingMember
            const url = isEditing ? `/api/team/${editingMember.id}` : '/api/team'
            const method = isEditing ? 'PATCH' : 'POST'

            // If creating new, append to end of list for order
            const body = {
                ...newMember,
                display_order: isEditing ? editingMember.display_order : team.length
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!res.ok) throw new Error("Erreur lors de l'enregistrement")

            toast.success(isEditing ? "Membre modifié avec succès" : "Membre ajouté avec succès")
            resetForm()
            setIsDialogOpen(false)
            loadTeam()
        } catch (error: unknown) {
            console.error("Erreur save membre:", error)
            toast.error("Erreur lors de l'enregistrement")
        }
    }

    const handleEdit = (member: TeamMember) => {
        setEditingMember(member)
        setNewMember({
            name: member.name,
            role: member.role,
            bio: member.bio || "",
            photo_url: member.photo_url || "",
            linkedin_url: member.linkedin_url || "",
            email: member.email || ""
        })
        setIsDialogOpen(true)
    }

    const toggleMemberActive = async (id: string) => {
        try {
            const member = team.find(m => m.id === id)
            if (!member) return

            const res = await fetch(`/api/team/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !member.is_active })
            })

            if (!res.ok) throw new Error("Erreur")

            // Optimistic update
            setTeam(team.map(m =>
                m.id === id ? { ...m, is_active: !m.is_active } : m
            ))
            toast.success(member.is_active ? "Membre masqué" : "Membre affiché")
        } catch (error: unknown) {
            console.error("Erreur maj membre:", error)
            toast.error("Impossible de modifier le statut")
        }
    }

    const deleteMember = async (id: string) => {
        try {
            const res = await fetch(`/api/team/${id}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error("Erreur lors de la suppression")

            toast.success("Membre supprimé")
            loadTeam() // Reload is safer here to reset orders if needed
        } catch (error: unknown) {
            console.error("Erreur suppression:", error)
            toast.error("Impossible de supprimer le membre")
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setTeam((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over?.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Prepare API update with new orders
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    display_order: index
                }));

                // Async update
                fetch('/api/team/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: updates })
                }).catch(err => {
                    console.error("Failed to save order", err);
                    toast.error("Erreur lors de la sauvegarde de l'ordre");
                    loadTeam(); // Revert on failure
                });

                return newItems;
            });
        }
    }

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-medium text-gray-700">Équipe & Direction</CardTitle>
                    <Badge variant="secondary" className="bg-white border shadow-sm text-xs font-normal">
                        {team.length} membres
                    </Badge>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    if (!open) resetForm()
                    setIsDialogOpen(open)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-odillon-teal hover:bg-odillon-teal/90 text-white shadow-sm gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter un membre
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingMember ? "Modifier le membre" : "Nouveau Membre"}</DialogTitle>
                            <DialogDescription>
                                {editingMember
                                    ? "Modifiez les informations du membre de l'équipe."
                                    : "Ajoutez un membre à l'équipe de direction affichée sur la page À propos."}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nom complet *</label>
                                    <Input
                                        value={newMember.name}
                                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                        placeholder="ex: Jean Dupont"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Rôle / Poste *</label>
                                    <Input
                                        value={newMember.role}
                                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                        placeholder="ex: Directeur Général"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bio (optionnel)</label>
                                <Textarea
                                    value={newMember.bio}
                                    onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                                    placeholder="Courte description..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Photo</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="URL de la photo (https://...)"
                                        value={newMember.photo_url}
                                        onChange={(e) => setNewMember({ ...newMember, photo_url: e.target.value })}
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
                                                    formData.append('bucket', 'photos') // Using generic bucket

                                                    toast.promise(
                                                        fetch('/api/upload', {
                                                            method: 'POST',
                                                            body: formData
                                                        }).then(async (res) => {
                                                            if (!res.ok) throw new Error("Upload failed")
                                                            const data = await res.json()
                                                            setNewMember(prev => ({ ...prev, photo_url: data.url }))
                                                            return data
                                                        }),
                                                        {
                                                            loading: 'Téléchargement...',
                                                            success: 'Photo téléchargée',
                                                            error: 'Erreur de téléchargement'
                                                        }
                                                    )
                                                } catch (error) {
                                                    console.error("Upload error:", error)
                                                }
                                            }}
                                            accept="image/png,image/jpeg,image/webp"
                                        />
                                        <Button variant="outline" size="icon" className="shrink-0 pointer-events-none">
                                            <Upload className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn
                                    </label>
                                    <Input
                                        value={newMember.linkedin_url}
                                        onChange={(e) => setNewMember({ ...newMember, linkedin_url: e.target.value })}
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-600" /> Email
                                    </label>
                                    <Input
                                        value={newMember.email}
                                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                        placeholder="contact@odillon.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button onClick={handleSaveMember} className="bg-odillon-teal hover:bg-odillon-teal/90 text-white">
                                {editingMember ? "Enregistrer" : "Créer"}
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
                ) : team.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Aucun membre dans l'équipe</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={team.map(m => m.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {team.map((member) => (
                                    <SortableTeamCard
                                        key={member.id}
                                        member={member}
                                        handleEdit={handleEdit}
                                        toggleMemberActive={toggleMemberActive}
                                        deleteMember={deleteMember}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </CardContent>
        </Card>
    )
}
