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
    ExternalLink
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

export function MessagesTab() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

    useEffect(() => {
        fetchMessages()
    }, [])

    useEffect(() => {
        filterMessages()
    }, [searchQuery, messages, statusFilter])

    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/contact')
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

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span>Nouveaux</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{newCount}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <MailOpen className="w-4 h-4 text-yellow-500" />
                        <span>Lus</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">{readCount}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Répondus</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{repliedCount}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Archive className="w-4 h-4 text-gray-400" />
                        <span>Archivés</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-500">{archivedCount}</div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Rechercher par nom, email, sujet..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
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
                </div>
            </div>

            {/* Messages Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
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
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
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
                                        className={message.status === 'new' ? 'bg-blue-50/50' : ''}
                                    >
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
                                                <span className={`font-medium ${message.status === 'new' ? 'text-gray-900' : 'text-gray-700'}`}>
                                                    {message.name}
                                                </span>
                                                <span className="text-sm text-gray-500">{message.email}</span>
                                                {message.company && (
                                                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                        <Building2 className="w-3 h-3" />
                                                        {message.company}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`${message.status === 'new' ? 'font-semibold' : ''}`}>
                                                {message.subject}
                                            </span>
                                            <p className="text-sm text-gray-500 truncate max-w-[300px]">
                                                {message.message}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {formatRelativeDate(message.created_at)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewMessage(message)}
                                                    title="Voir le message"
                                                >
                                                    <Eye className="w-4 h-4 text-odillon-teal" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeleteId(message.id)}
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Message Detail Dialog */}
            <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedMessage && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start justify-between gap-4">
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
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-odillon-teal/10 rounded-full flex items-center justify-center">
                                            <span className="text-odillon-teal font-semibold">
                                                {selectedMessage.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{selectedMessage.name}</p>
                                            <a
                                                href={`mailto:${selectedMessage.email}`}
                                                className="text-sm text-odillon-teal hover:underline flex items-center gap-1"
                                            >
                                                {selectedMessage.email}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                        {selectedMessage.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <a
                                                    href={`tel:${selectedMessage.phone}`}
                                                    className="text-gray-700 hover:text-odillon-teal"
                                                >
                                                    {selectedMessage.phone}
                                                </a>
                                            </div>
                                        )}
                                        {selectedMessage.company && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-700">{selectedMessage.company}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Message</h4>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
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
        </div>
    )
}
