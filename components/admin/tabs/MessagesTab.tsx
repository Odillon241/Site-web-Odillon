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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Loader2,
    Trash2,
    Search,
    Mail,
    MailOpen,
    Eye,
    Building2,
    Phone,
    Calendar,
    Clock,
    Archive,
    CheckCircle2,
    MessageCircle,
    MessageSquare,
    ExternalLink,
    X
} from "lucide-react"
import { toast } from "sonner"

interface ContactMessage {
    id: string
    name: string
    email: string
    phone: string | null
    company: string | null
    subject: string
    message: string
    status: 'new' | 'read' | 'replied' | 'archived'
    created_at: string
    updated_at: string
}

const statusConfig = {
    new: { label: 'Nouveau', color: 'bg-blue-500', icon: Mail },
    read: { label: 'Lu', color: 'bg-yellow-500', icon: MailOpen },
    replied: { label: 'Répondu', color: 'bg-green-500', icon: CheckCircle2 },
    archived: { label: 'Archivé', color: 'bg-gray-400', icon: Archive },
}

interface MessagesTabProps {
    /** Appelé après toute mutation (lecture, changement de statut, suppression) pour
     *  resynchroniser le badge de messages non lus de la sidebar. */
    onMessagesChange?: () => void
}

export function MessagesTab({ onMessagesChange }: MessagesTabProps) {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [bulkLoading, setBulkLoading] = useState(false)
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

    useEffect(() => {
        fetchMessages()
    }, [])

    useEffect(() => {
        filterMessages()
    }, [searchQuery, messages, statusFilter])

    // Réinitialise la sélection quand le périmètre visible change, pour ne jamais
    // appliquer une action groupée à des messages masqués par le filtre/la recherche.
    useEffect(() => {
        setSelectedIds(new Set())
    }, [searchQuery, statusFilter])

    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/contact?limit=100')
            if (response.ok) {
                const data = await response.json()
                setMessages(data.messages || [])
            } else {
                toast.error("Erreur lors du chargement des messages")
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
            toast.error("Erreur lors du chargement des messages")
        } finally {
            setLoading(false)
        }
    }

    const filterMessages = () => {
        let filtered = messages

        if (statusFilter !== "all") {
            filtered = filtered.filter(msg => msg.status === statusFilter)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(msg =>
                msg.name.toLowerCase().includes(query) ||
                msg.email.toLowerCase().includes(query) ||
                msg.subject.toLowerCase().includes(query) ||
                msg.company?.toLowerCase().includes(query)
            )
        }

        setFilteredMessages(filtered)
    }

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setUpdatingStatus(id)
        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                toast.success(`Statut mis à jour: ${statusConfig[newStatus as keyof typeof statusConfig]?.label}`)
                fetchMessages()
                onMessagesChange?.()
            } else {
                toast.error("Erreur lors de la mise à jour du statut")
            }
        } catch (error) {
            console.error('Error updating status:', error)
            toast.error("Erreur lors de la mise à jour du statut")
        } finally {
            setUpdatingStatus(null)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            const response = await fetch(`/api/contact/${deleteId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success("Message supprimé définitivement")
                setSelectedMessage(null)
                fetchMessages()
                onMessagesChange?.()
            } else {
                toast.error("Erreur lors de la suppression")
            }
        } catch (error) {
            console.error('Error deleting message:', error)
            toast.error("Erreur lors de la suppression")
        } finally {
            setDeleteId(null)
        }
    }

    // --- Sélection multiple & actions groupées ---

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const allVisibleSelected =
        filteredMessages.length > 0 &&
        filteredMessages.every((msg) => selectedIds.has(msg.id))
    const someVisibleSelected =
        filteredMessages.some((msg) => selectedIds.has(msg.id)) && !allVisibleSelected

    const toggleSelectAll = () => {
        setSelectedIds((prev) => {
            if (allVisibleSelected) {
                // Tout est déjà coché → on désélectionne les messages visibles
                const next = new Set(prev)
                filteredMessages.forEach((msg) => next.delete(msg.id))
                return next
            }
            // On coche l'ensemble des messages visibles
            const next = new Set(prev)
            filteredMessages.forEach((msg) => next.add(msg.id))
            return next
        })
    }

    const clearSelection = () => setSelectedIds(new Set())

    const handleBulkStatus = async (newStatus: string) => {
        const ids = Array.from(selectedIds)
        if (ids.length === 0) return

        setBulkLoading(true)
        try {
            const response = await fetch('/api/contact/bulk', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids, status: newStatus }),
            })

            if (response.ok) {
                toast.success(
                    `${ids.length} message${ids.length > 1 ? 's' : ''} — ${statusConfig[newStatus as keyof typeof statusConfig]?.label}`
                )
                clearSelection()
                fetchMessages()
                onMessagesChange?.()
            } else {
                toast.error("Erreur lors de la mise à jour groupée")
            }
        } catch (error) {
            console.error('Error bulk updating status:', error)
            toast.error("Erreur lors de la mise à jour groupée")
        } finally {
            setBulkLoading(false)
        }
    }

    const handleBulkDelete = async () => {
        const ids = Array.from(selectedIds)
        if (ids.length === 0) return

        setBulkLoading(true)
        try {
            const response = await fetch('/api/contact/bulk', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids }),
            })

            if (response.ok) {
                toast.success(`${ids.length} message${ids.length > 1 ? 's' : ''} supprimé${ids.length > 1 ? 's' : ''}`)
                clearSelection()
                fetchMessages()
                onMessagesChange?.()
            } else {
                toast.error("Erreur lors de la suppression groupée")
            }
        } catch (error) {
            console.error('Error bulk deleting:', error)
            toast.error("Erreur lors de la suppression groupée")
        } finally {
            setBulkLoading(false)
            setBulkDeleteOpen(false)
        }
    }

    const handleViewMessage = async (message: ContactMessage) => {
        setSelectedMessage(message)

        // Marquer comme lu si nouveau
        if (message.status === 'new') {
            handleUpdateStatus(message.id, 'read')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatRelativeDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 60) return `Il y a ${diffMins} min`
        if (diffHours < 24) return `Il y a ${diffHours}h`
        if (diffDays < 7) return `Il y a ${diffDays}j`
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-odillon-teal" />
            </div>
        )
    }

    const newCount = messages.filter(m => m.status === 'new').length
    const readCount = messages.filter(m => m.status === 'read').length
    const repliedCount = messages.filter(m => m.status === 'replied').length
    const archivedCount = messages.filter(m => m.status === 'archived').length

    const stats = [
        { label: 'Nouveaux', count: newCount, icon: Mail, chipClass: 'border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal' },
        { label: 'Lus', count: readCount, icon: MailOpen, chipClass: 'border-amber-200 bg-amber-50 text-amber-600' },
        { label: 'Répondus', count: repliedCount, icon: CheckCircle2, chipClass: 'border-emerald-200 bg-emerald-50 text-emerald-600' },
        { label: 'Archivés', count: archivedCount, icon: Archive, chipClass: 'border-slate-200 bg-slate-100 text-slate-500' },
    ]

    return (
        <div className="space-y-6">
            {/* Header Stats : même modèle que les cartes du tableau de bord */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const StatIcon = stat.icon
                    return (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border ${stat.chipClass}`}>
                                    <StatIcon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-500">{stat.label}</p>
                                    <p className="text-2xl font-semibold tabular-nums tracking-tight text-slate-950">{stat.count}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Messages Card */}
            <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-col gap-3 border-b border-slate-200/80 bg-white py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight text-slate-950">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
                                <MessageSquare className="h-4 w-4" />
                            </span>
                            Messages
                        </CardTitle>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                            {filteredMessages.length}
                        </Badge>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full border-slate-200 sm:w-[180px]">
                            <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les messages</SelectItem>
                            <SelectItem value="new">Nouveaux</SelectItem>
                            <SelectItem value="read">Lus</SelectItem>
                            <SelectItem value="replied">Répondus</SelectItem>
                            <SelectItem value="archived">Archivés</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-b border-slate-200/80 bg-white p-4">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher par nom, email, sujet..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-slate-200 bg-slate-50"
                            />
                        </div>
                    </div>

                    {/* Barre d'actions groupées */}
                    {selectedIds.size > 0 && (
                        <div className="flex flex-wrap items-center gap-2 border-b border-odillon-teal/15 bg-odillon-teal/[0.05] px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-200">
                            <span className="mr-1 text-sm font-medium text-slate-700">
                                {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
                            </span>
                            {bulkLoading && <Loader2 className="h-4 w-4 animate-spin text-odillon-teal" />}
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={bulkLoading}
                                    onClick={() => handleBulkStatus('read')}
                                    className="border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:text-amber-600"
                                >
                                    <MailOpen className="mr-1.5 h-3.5 w-3.5" />
                                    Marquer lu
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={bulkLoading}
                                    onClick={() => handleBulkStatus('replied')}
                                    className="border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-600"
                                >
                                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                    Marquer répondu
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={bulkLoading}
                                    onClick={() => handleBulkStatus('archived')}
                                    className="border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-600"
                                >
                                    <Archive className="mr-1.5 h-3.5 w-3.5" />
                                    Archiver
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={bulkLoading}
                                    onClick={() => setBulkDeleteOpen(true)}
                                    className="border-red-200 bg-white text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                    Supprimer
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={bulkLoading}
                                onClick={clearSelection}
                                className="ml-auto text-slate-500 hover:text-slate-700"
                            >
                                <X className="mr-1.5 h-3.5 w-3.5" />
                                Annuler
                            </Button>
                        </div>
                    )}
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[44px]">
                                    <Checkbox
                                        checked={
                                            allVisibleSelected
                                                ? true
                                                : someVisibleSelected
                                                    ? "indeterminate"
                                                    : false
                                        }
                                        onCheckedChange={toggleSelectAll}
                                        disabled={filteredMessages.length === 0}
                                        aria-label="Tout sélectionner"
                                    />
                                </TableHead>
                                <TableHead className="w-[50px]">Statut</TableHead>
                                <TableHead>Expéditeur</TableHead>
                                <TableHead>Sujet</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMessages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                                        {searchQuery || statusFilter !== "all"
                                            ? "Aucun message trouvé"
                                            : "Aucun message pour le moment"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredMessages.map((message) => {
                                    const StatusIcon = statusConfig[message.status].icon
                                    return (
                                        <TableRow
                                            key={message.id}
                                            data-state={selectedIds.has(message.id) ? "selected" : undefined}
                                            className={`data-[state=selected]:bg-odillon-teal/[0.06] ${message.status === 'new' ? 'bg-odillon-teal/[0.035]' : ''}`}
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.has(message.id)}
                                                    onCheckedChange={() => toggleSelect(message.id)}
                                                    aria-label={`Sélectionner le message de ${message.name}`}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={`${statusConfig[message.status].color} text-white`}
                                                >
                                                    <StatusIcon className="w-3 h-3" />
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className={`font-medium ${message.status === 'new' ? 'text-slate-900' : 'text-slate-700'}`}>
                                                        {message.name}
                                                    </span>
                                                    <span className="text-sm text-slate-500">{message.email}</span>
                                                    {message.company && (
                                                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <Building2 className="w-3 h-3" />
                                                            {message.company}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`${message.status === 'new' ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                                                    {message.subject}
                                                </span>
                                                <p className="text-sm text-slate-500 truncate max-w-[300px]">
                                                    {message.message}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                                    <Clock className="w-3 h-3" />
                                                    {formatRelativeDate(message.created_at)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleViewMessage(message)}
                                                        title="Voir le message"
                                                        aria-label="Voir le message"
                                                        className="text-odillon-teal transition-[color,background-color,transform] hover:bg-odillon-teal/[0.08] hover:text-odillon-teal active:scale-[0.96]"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeleteId(message.id)}
                                                        title="Supprimer"
                                                        aria-label="Supprimer"
                                                        className="text-red-500 transition-[color,background-color,transform] hover:bg-red-50 hover:text-red-600 active:scale-[0.96]"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Message Detail Dialog */}
            <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedMessage && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start justify-between gap-4 pr-8">
                                    <div>
                                        <DialogTitle className="text-xl">{selectedMessage.subject}</DialogTitle>
                                        <DialogDescription className="mt-1">
                                            Reçu le {formatDate(selectedMessage.created_at)}
                                        </DialogDescription>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={`${statusConfig[selectedMessage.status].color} text-white shrink-0`}
                                    >
                                        {statusConfig[selectedMessage.status].label}
                                    </Badge>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6 mt-4">
                                {/* Contact Info */}
                                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-odillon-teal/10 rounded-full flex items-center justify-center">
                                            <span className="text-odillon-teal font-semibold">
                                                {selectedMessage.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{selectedMessage.name}</p>
                                            <a
                                                href={`mailto:${selectedMessage.email}`}
                                                className="text-sm text-odillon-teal hover:underline flex items-center gap-1"
                                            >
                                                {selectedMessage.email}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/80">
                                        {selectedMessage.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                <a
                                                    href={`tel:${selectedMessage.phone}`}
                                                    className="text-slate-700 hover:text-odillon-teal"
                                                >
                                                    {selectedMessage.phone}
                                                </a>
                                            </div>
                                        )}
                                        {selectedMessage.company && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="w-4 h-4 text-slate-400" />
                                                <span className="text-slate-700">{selectedMessage.company}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div>
                                    <h4 className="text-sm font-medium text-slate-500 mb-2">Message</h4>
                                    <div className="bg-white border border-slate-200/80 rounded-lg p-4">
                                        <p className="text-slate-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                    <Button
                                        variant="default"
                                        className="bg-odillon-teal hover:bg-odillon-teal/90 flex-1"
                                        onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`, '_blank')}
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Répondre par email
                                    </Button>

                                    <Select
                                        value={selectedMessage.status}
                                        onValueChange={(value) => {
                                            handleUpdateStatus(selectedMessage.id, value)
                                            setSelectedMessage({ ...selectedMessage, status: value as ContactMessage['status'] })
                                        }}
                                        disabled={updatingStatus === selectedMessage.id}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            {updatingStatus === selectedMessage.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <SelectValue placeholder="Changer le statut" />
                                            )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">
                                                <span className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-blue-500" />
                                                    Nouveau
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="read">
                                                <span className="flex items-center gap-2">
                                                    <MailOpen className="w-4 h-4 text-yellow-500" />
                                                    Lu
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="replied">
                                                <span className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    Répondu
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="archived">
                                                <span className="flex items-center gap-2">
                                                    <Archive className="w-4 h-4 text-gray-400" />
                                                    Archivé
                                                </span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        variant="outline"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => setDeleteId(selectedMessage.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Supprimer
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce message ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le message sera définitivement supprimé de la base de données.
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

            {/* Bulk Delete Confirmation Dialog */}
            <AlertDialog open={bulkDeleteOpen} onOpenChange={(open) => !bulkLoading && setBulkDeleteOpen(open)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Supprimer {selectedIds.size} message{selectedIds.size > 1 ? 's' : ''} ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. {selectedIds.size > 1 ? 'Les messages sélectionnés seront' : 'Le message sélectionné sera'} définitivement supprimé{selectedIds.size > 1 ? 's' : ''} de la base de données.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={bulkLoading}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleBulkDelete()
                            }}
                            disabled={bulkLoading}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {bulkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Supprimer'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
