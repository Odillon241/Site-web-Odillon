"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, Download, Search, UserX, UserCheck, Users, Mail } from "lucide-react"
import { toast } from "sonner"
import { toCsv, telechargerCsv } from "@/lib/csv"

interface Subscriber {
    id: string
    email: string
    subscribed_at: string
    is_active: boolean
    created_at: string
}

export function NewsletterTab() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [toggleId, setToggleId] = useState<string | null>(null)
    const [showActiveOnly, setShowActiveOnly] = useState(false)

    useEffect(() => {
        fetchSubscribers()
    }, [])

    useEffect(() => {
        filterSubscribers()
    }, [searchQuery, subscribers, showActiveOnly])

    const fetchSubscribers = async () => {
        try {
            const response = await fetch('/api/newsletter')
            if (response.ok) {
                const data = await response.json()
                setSubscribers(data)
            } else {
                toast.error("Erreur lors du chargement des abonnés")
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error)
            toast.error("Erreur lors du chargement des abonnés")
        } finally {
            setLoading(false)
        }
    }

    const filterSubscribers = () => {
        let filtered = subscribers

        if (showActiveOnly) {
            filtered = filtered.filter(sub => sub.is_active)
        }

        if (searchQuery) {
            filtered = filtered.filter(sub =>
                sub.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredSubscribers(filtered)
    }

    const handleToggleStatus = async (email: string, currentStatus: boolean) => {
        try {
            const endpoint = currentStatus
                ? `/api/newsletter?email=${encodeURIComponent(email)}`
                : `/api/newsletter/reactivate`

            const response = await fetch(endpoint, {
                method: currentStatus ? 'DELETE' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: !currentStatus ? JSON.stringify({ email }) : undefined,
            })

            if (response.ok) {
                toast.success(currentStatus ? "Abonné désactivé" : "Abonné réactivé")
                fetchSubscribers()
            } else {
                toast.error("Erreur lors de la modification du statut")
            }
        } catch (error) {
            console.error('Error toggling status:', error)
            toast.error("Erreur lors de la modification du statut")
        } finally {
            setToggleId(null)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            const response = await fetch(`/api/newsletter/${deleteId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success("Abonné supprimé définitivement")
                fetchSubscribers()
            } else {
                toast.error("Erreur lors de la suppression")
            }
        } catch (error) {
            console.error('Error deleting subscriber:', error)
            toast.error("Erreur lors de la suppression")
        } finally {
            setDeleteId(null)
        }
    }

    const exportToCSV = () => {
        const entetes = ["Email", "Date d'inscription", "Statut"]
        const lignes = filteredSubscribers.map(sub => ({
            Email: sub.email,
            "Date d'inscription": new Date(sub.subscribed_at).toLocaleDateString('fr-FR'),
            Statut: sub.is_active ? 'Actif' : 'Inactif',
        }))

        telechargerCsv(
            `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`,
            toCsv(entetes, lignes)
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
            </div>
        )
    }

    const activeCount = subscribers.filter(s => s.is_active).length
    const totalCount = subscribers.length

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
                        <Users className="h-5 w-5" />
                    </span>
                    <div>
                        <div className="text-sm text-slate-500">Total des abonnés</div>
                        <div className="text-2xl font-semibold tabular-nums tracking-tight text-slate-950">{totalCount}</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-green-500/15 bg-green-500/[0.08] text-green-600">
                        <UserCheck className="h-5 w-5" />
                    </span>
                    <div>
                        <div className="text-sm text-slate-500">Abonnés actifs</div>
                        <div className="text-2xl font-semibold tabular-nums tracking-tight text-green-600">{activeCount}</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-400">
                        <UserX className="h-5 w-5" />
                    </span>
                    <div>
                        <div className="text-sm text-slate-500">Désabonnés</div>
                        <div className="text-2xl font-semibold tabular-nums tracking-tight text-slate-400">{totalCount - activeCount}</div>
                    </div>
                </div>
            </div>

            {/* Subscribers Card */}
            <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-col gap-3 border-b border-slate-200/80 bg-white py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight text-slate-950">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
                                <Mail className="h-4 w-4" />
                            </span>
                            Abonnés
                        </CardTitle>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                            {filteredSubscribers.length}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={showActiveOnly ? "default" : "outline"}
                            onClick={() => setShowActiveOnly(!showActiveOnly)}
                            size="sm"
                            className={showActiveOnly
                                ? "bg-odillon-teal text-white shadow-sm hover:bg-odillon-teal/90"
                                : "border-slate-200 text-slate-700 hover:border-odillon-teal/30 hover:text-odillon-teal"}
                        >
                            {showActiveOnly ? "Tous" : "Actifs uniquement"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={exportToCSV}
                            disabled={filteredSubscribers.length === 0}
                            size="sm"
                            className="border-slate-200 text-slate-700 hover:border-odillon-teal/30 hover:text-odillon-teal"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exporter CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-b border-slate-200/80 bg-white p-4">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher un email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-slate-200 bg-slate-50"
                            />
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Email</TableHead>
                                <TableHead>Date d'inscription</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubscribers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-10 text-center text-slate-500">
                                        {searchQuery ? "Aucun abonné trouvé" : "Aucun abonné pour le moment"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredSubscribers.map((subscriber) => (
                                    <TableRow key={subscriber.id}>
                                        <TableCell className="font-medium text-slate-900">{subscriber.email}</TableCell>
                                        <TableCell className="text-slate-600">
                                            {new Date(subscriber.subscribed_at).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {subscriber.is_active ? (
                                                <Badge className="border-green-200 bg-green-100 text-green-700 hover:bg-green-100">Actif</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-500">Inactif</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setToggleId(subscriber.id)
                                                        handleToggleStatus(subscriber.email, subscriber.is_active)
                                                    }}
                                                    disabled={toggleId === subscriber.id}
                                                    title={subscriber.is_active ? "Désactiver" : "Réactiver"}
                                                    className="text-slate-500 hover:bg-slate-100"
                                                >
                                                    {toggleId === subscriber.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : subscriber.is_active ? (
                                                        <UserX className="w-4 h-4 text-orange-500" />
                                                    ) : (
                                                        <UserCheck className="w-4 h-4 text-green-500" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteId(subscriber.id)}
                                                    title="Supprimer définitivement"
                                                    aria-label="Supprimer définitivement"
                                                    className="text-red-500 transition-[color,background-color,transform] hover:bg-red-50 hover:text-red-600 active:scale-[0.96]"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer l'abonné ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. L'abonné sera définitivement supprimé de la base de données.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
