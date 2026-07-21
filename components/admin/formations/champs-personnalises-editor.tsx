"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, ChevronUp, ChevronDown, ListPlus } from "lucide-react"
import type { ChampPersonnalise, ChampType } from "@/types/formation"

const TYPE_OPTIONS: { value: ChampType; label: string }[] = [
    { value: "texte", label: "Texte court" },
    { value: "texte_long", label: "Texte long" },
    { value: "liste", label: "Liste déroulante" },
    { value: "case", label: "Case à cocher" },
]

interface Props {
    value: ChampPersonnalise[]
    onChange: (champs: ChampPersonnalise[]) => void
    /** Affiche un avertissement si la session compte déjà des inscrits. */
    aDesInscrits?: boolean
}

export function ChampsPersonnalisesEditor({ value, onChange, aDesInscrits }: Props) {
    const champs = value || []

    const ajouter = () => {
        onChange([
            ...champs,
            {
                id: crypto.randomUUID(),
                label: "",
                type: "texte",
                obligatoire: false,
            },
        ])
    }

    const modifier = (index: number, patch: Partial<ChampPersonnalise>) => {
        onChange(champs.map((c, i) => (i === index ? { ...c, ...patch } : c)))
    }

    const supprimer = (index: number) => {
        onChange(champs.filter((_, i) => i !== index))
    }

    const deplacer = (index: number, direction: -1 | 1) => {
        const cible = index + direction
        if (cible < 0 || cible >= champs.length) return
        const copie = [...champs]
        ;[copie[index], copie[cible]] = [copie[cible], copie[index]]
        onChange(copie)
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <label className="text-sm font-medium">Champs du formulaire d'inscription</label>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Nom, e-mail, téléphone, société et fonction sont toujours demandés. Ajoutez ici vos questions
                        spécifiques à cette session.
                    </p>
                </div>
            </div>

            {aDesInscrits && champs.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs text-amber-900 leading-relaxed">
                        Cette session a déjà des inscrits. Modifier un champ n'altère pas leurs réponses déjà
                        enregistrées (elles conservent le libellé d'origine), mais les nouvelles inscriptions
                        utiliseront la version modifiée.
                    </p>
                </div>
            )}

            {champs.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 py-8 text-center">
                    <ListPlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucun champ supplémentaire</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {champs.map((champ, index) => (
                        <div key={champ.id} className="rounded-lg border border-gray-200 bg-white p-3 space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    value={champ.label}
                                    onChange={(e) => modifier(index, { label: e.target.value })}
                                    placeholder="Libellé du champ (ex : Régime alimentaire)"
                                    className="flex-1"
                                />

                                <Select
                                    value={champ.type}
                                    onValueChange={(v) =>
                                        modifier(index, {
                                            type: v as ChampType,
                                            // Les options n'ont de sens que pour une liste : on les
                                            // retire sinon, pour ne pas stocker de résidu en base.
                                            options: v === "liste" ? champ.options || [] : undefined,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-[150px] shrink-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TYPE_OPTIONS.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="flex shrink-0">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deplacer(index, -1)}
                                        disabled={index === 0}
                                        className="h-10 w-10 p-0"
                                        aria-label="Monter le champ"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deplacer(index, 1)}
                                        disabled={index === champs.length - 1}
                                        className="h-10 w-10 p-0"
                                        aria-label="Descendre le champ"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => supprimer(index)}
                                        className="h-10 w-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        aria-label="Supprimer le champ"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {champ.type === "liste" && (
                                <Textarea
                                    value={(champ.options || []).join("\n")}
                                    onChange={(e) =>
                                        modifier(index, {
                                            options: e.target.value
                                                .split("\n")
                                                .map((o) => o.trim())
                                                .filter(Boolean),
                                        })
                                    }
                                    placeholder="Une option par ligne"
                                    rows={3}
                                    className="text-sm"
                                />
                            )}

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id={`obligatoire-${champ.id}`}
                                    checked={champ.obligatoire}
                                    onCheckedChange={(c) => modifier(index, { obligatoire: c === true })}
                                />
                                <label htmlFor={`obligatoire-${champ.id}`} className="text-sm text-gray-600 cursor-pointer">
                                    Réponse obligatoire
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Button type="button" variant="outline" size="sm" onClick={ajouter} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Ajouter un champ
            </Button>
        </div>
    )
}
