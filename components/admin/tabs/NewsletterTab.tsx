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
import { Loader2, Trash2, Download, Search, UserX, UserCheck } from "lucide-react"
import { toast } from "sonner"

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
        const csvData = filteredSubscribers.map(sub => ({
            Email: sub.email,
            "Date d'inscription": new Date(sub.subscribed_at).toLocaleDateString('fr-FR'),
            Statut: sub.is_active ? 'Actif' : 'Inactif',
        }))

        const headers = Object.keys(csvData[0] || {})
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => headers.map(header => row[header as keyof typeof row]).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Total des abonnés</div>
                    <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Abonnés actifs</div>
                    <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Désabonnés</div>
                    <div className="text-2xl font-bold text-gray-400">{totalCount - activeCount}</div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Rechercher un email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={showActiveOnly ? "default" : "outline"}
                        onClick={() => setShowActiveOnly(!showActiveOnly)}
                        size="sm"
                    >
                        {showActiveOnly ? "Tous" : "Actifs uniquement"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={exportToCSV}
                        disabled={filteredSubscribers.length === 0}
                        size="sm"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Exporter CSV
                    </Button>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Date d'inscription</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSubscribers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    {searchQuery ? "Aucun abonné trouvé" : "Aucun abonné pour le moment"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSubscribers.map((subscriber) => (
                                <TableRow key={subscriber.id}>
                                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                                    <TableCell>
                                        {new Date(subscriber.subscribed_at).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {subscriber.is_active ? (
                                            <Badge variant="default" className="bg-green-500">Actif</Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactif</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setToggleId(subscriber.id)
                                                    handleToggleStatus(subscriber.email, subscriber.is_active)
                                                }}
                                                disabled={toggleId === subscriber.id}
                                                title={subscriber.is_active ? "Désactiver" : "Réactiver"}
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
                                                size="sm"
                                                onClick={() => setDeleteId(subscriber.id)}
                                                title="Supprimer définitivement"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

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
