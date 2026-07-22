"use client"

import { Pencil, Trash2, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/**
 * Conteneur standard d'un onglet d'administration.
 * En-tête : pastille d'icône teal, titre, description, zone d'actions.
 * Contenu : fond neutre teinté (même teinte que le fond du site public).
 */
export function AdminPanel({
    icon: Icon,
    title,
    description,
    actions,
    children,
    contentClassName,
}: {
    icon: LucideIcon
    title: string
    description?: string
    actions?: React.ReactNode
    children: React.ReactNode
    contentClassName?: string
}) {
    return (
        <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-slate-200/80 bg-white px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
                        <Icon className="h-4 w-4" />
                    </span>
                    <div>
                        <h2 className="text-base font-semibold tracking-tight text-slate-950">{title}</h2>
                        {description && (
                            <p className="text-[13px] text-slate-500">{description}</p>
                        )}
                    </div>
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </header>
            <div className={cn("bg-[#f7f9f8] p-5 sm:p-6", contentClassName)}>{children}</div>
        </section>
    )
}

/**
 * Rangée d'actions standard d'une carte ou ligne d'élément.
 * L'interrupteur porte l'état de visibilité (remplace badge « Actif » +
 * bouton « Masquer/Afficher ») ; Modifier en icône ; la suppression est
 * passée en enfant (chaque onglet garde son AlertDialog et son libellé).
 */
export function AdminItemActions({
    visible,
    onToggleVisible,
    onEdit,
    children,
    className,
}: {
    visible: boolean
    onToggleVisible: () => void
    onEdit?: () => void
    children?: React.ReactNode
    className?: string
}) {
    return (
        <div
            className={cn("flex items-center justify-between gap-2 border-t border-slate-100 pt-2", className)}
            onPointerDown={(e) => e.stopPropagation()}
        >
            <label className="flex cursor-pointer items-center gap-2">
                <Switch
                    checked={visible}
                    onCheckedChange={onToggleVisible}
                    aria-label={visible ? "Masquer sur le site" : "Afficher sur le site"}
                    className="data-[state=checked]:bg-odillon-teal"
                />
                <span className="text-xs font-medium text-slate-600">
                    {visible ? "Visible" : "Masqué"}
                </span>
            </label>
            <div className="flex items-center">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        aria-label="Modifier"
                        className="text-odillon-teal transition-[color,background-color,transform] hover:bg-odillon-teal/[0.08] hover:text-odillon-teal active:scale-[0.96]"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
                {children}
            </div>
        </div>
    )
}

/**
 * Bouton de suppression standard (icône corbeille) : à utiliser comme
 * déclencheur d'AlertDialog dans AdminItemActions.
 */
export function AdminDeleteButton(props: React.ComponentProps<typeof Button>) {
    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Supprimer"
            {...props}
            className={cn(
                "text-red-500 transition-[color,background-color,transform] hover:bg-red-50 hover:text-red-600 active:scale-[0.96]",
                props.className
            )}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}

/**
 * État vide pédagogique : explique quoi faire, propose l'action.
 */
export function AdminEmptyState({
    icon: Icon,
    title,
    hint,
    action,
    className,
}: {
    icon: LucideIcon
    title: string
    hint?: string
    action?: React.ReactNode
    className?: string
}) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center",
                className
            )}
        >
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-md border border-odillon-teal/15 bg-odillon-teal/[0.07] text-odillon-teal">
                <Icon className="h-5 w-5" />
            </span>
            <p className="font-medium text-slate-900">{title}</p>
            {hint && <p className="mt-1 max-w-sm text-sm text-slate-600">{hint}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    )
}
