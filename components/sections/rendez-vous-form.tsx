"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { polesProduits } from "@/lib/produits-data"
import { AlertCircle, CalendarCheck, CheckCircle2, Clock, Loader2, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const CRENEAUX = ["Matin (8h – 12h)", "Après-midi (13h – 16h30)"]
// Odillon se déplace chez le client : pas de rendez-vous au cabinet.
const FORMATS = ["Dans vos locaux (nous nous déplaçons)", "En visioconférence"]
const SUJETS = [...polesProduits.map((p) => p.titre), "Autre"]

// Le premier jour réservable est demain ; samedi et dimanche sont refusés.
function demainIso(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function estWeekEnd(iso: string): boolean {
  const jour = new Date(iso + "T00:00:00").getDay()
  return jour === 0 || jour === 6
}

function dateLisible(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const libelle = "mb-2 block text-sm font-semibold text-gray-700"
const champ = "h-11 bg-gray-50/50 border-gray-200 focus-visible:ring-odillon-teal"

function Choix({
  nom,
  options,
  valeur,
  onChange,
  legende,
}: {
  nom: string
  options: string[]
  valeur: string
  onChange: (v: string) => void
  legende: string
}) {
  return (
    <fieldset>
      <legend className={libelle}>{legende} *</legend>
      <div className="grid gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-odillon-teal",
              valeur === option
                ? "border-odillon-teal bg-odillon-teal/5 font-semibold text-odillon-dark"
                : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300"
            )}
          >
            <input
              type="radio"
              name={nom}
              value={option}
              checked={valeur === option}
              onChange={() => onChange(option)}
              className="size-4 accent-[#00a795]"
              required
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function RendezVousForm() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    entreprise: "",
    sujet: "",
    date: "",
    creneau: "",
    format: "",
    message: "",
  })
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [succes, setSucces] = useState(false)

  const maj = (cle: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [cle]: v }))

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault()
    setErreur(null)

    if (!form.date || estWeekEnd(form.date)) {
      setErreur("Choisissez un jour ouvré, du lundi au vendredi.")
      return
    }
    if (!form.sujet || !form.creneau || !form.format) {
      setErreur("Indiquez le sujet, le créneau et le format du rendez-vous.")
      return
    }

    const lignes = [
      "Demande de rendez-vous",
      `Date souhaitée : ${dateLisible(form.date)}`,
      `Créneau : ${form.creneau}`,
      `Format : ${form.format}`,
      `Sujet : ${form.sujet}`,
    ]
    if (form.message.trim()) lignes.push("", form.message.trim())

    setEnvoi(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.nom,
          email: form.email,
          phone: form.telephone,
          company: form.entreprise,
          subject: `Demande de rendez-vous : ${form.sujet}`,
          message: lignes.join("\n"),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErreur(data.error || "La demande n'a pas pu être envoyée. Réessayez dans un instant.")
        return
      }
      setSucces(true)
    } catch {
      setErreur("Erreur réseau. Vérifiez votre connexion et réessayez.")
    } finally {
      setEnvoi(false)
    }
  }

  if (succes) {
    return (
      <div className="od-surface p-8 text-center md:p-10" role="status">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="size-8 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="mb-3 font-baskvill text-2xl font-bold italic text-odillon-dark">Demande envoyée</h2>
        <p className="mx-auto mb-2 max-w-md text-gray-600 text-pretty">
          Rendez-vous souhaité le <strong>{dateLisible(form.date)}</strong>, {form.creneau.toLowerCase()}.
        </p>
        <p className="mx-auto mb-8 max-w-md text-gray-600 text-pretty">
          Nous vous confirmons le créneau par email ou par téléphone sous 24h ouvrées.
        </p>
        <Button asChild variant="outline">
          <Link href="/produits">Découvrir nos produits</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <ul className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
        {[
          { icone: Clock, texte: "Un premier échange de 30 minutes" },
          { icone: MapPin, texte: "Dans vos locaux ou en visio" },
          { icone: CalendarCheck, texte: "Confirmation sous 24h ouvrées" },
        ].map(({ icone: Icone, texte }) => (
          <li key={texte} className="flex items-center gap-2">
            <Icone className="size-4 text-odillon-teal" aria-hidden="true" />
            {texte}
          </li>
        ))}
      </ul>

      <form onSubmit={envoyer} className="od-surface space-y-5 p-5 md:p-7" noValidate={false}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="rdv-nom" className={libelle}>Nom complet *</label>
            <Input id="rdv-nom" required autoComplete="name" value={form.nom} onChange={(e) => maj("nom")(e.target.value)} className={champ} />
          </div>
          <div>
            <label htmlFor="rdv-entreprise" className={libelle}>Entreprise</label>
            <Input id="rdv-entreprise" autoComplete="organization" value={form.entreprise} onChange={(e) => maj("entreprise")(e.target.value)} className={champ} />
          </div>
          <div>
            <label htmlFor="rdv-email" className={libelle}>Email *</label>
            <Input id="rdv-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => maj("email")(e.target.value)} className={champ} />
          </div>
          <div>
            <label htmlFor="rdv-telephone" className={libelle}>Téléphone *</label>
            <Input id="rdv-telephone" type="tel" required autoComplete="tel" placeholder="+241 ..." value={form.telephone} onChange={(e) => maj("telephone")(e.target.value)} className={champ} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="rdv-sujet" className={libelle}>Sujet *</label>
          <select
            id="rdv-sujet"
            required
            value={form.sujet}
            onChange={(e) => maj("sujet")(e.target.value)}
            className="h-11 w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-odillon-teal"
          >
            <option value="" disabled>Choisir un sujet</option>
            {SUJETS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rdv-date" className={libelle}>Date souhaitée *</label>
          <Input
            id="rdv-date"
            type="date"
            required
            min={demainIso()}
            value={form.date}
            onChange={(e) => maj("date")(e.target.value)}
            className={champ}
            aria-describedby="rdv-date-aide"
          />
          <p id="rdv-date-aide" className="mt-1.5 text-xs text-gray-500">Du lundi au vendredi.</p>
        </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Choix nom="creneau" legende="Créneau" options={CRENEAUX} valeur={form.creneau} onChange={maj("creneau")} />
          <Choix nom="format" legende="Format" options={FORMATS} valeur={form.format} onChange={maj("format")} />
        </div>

        <div>
          <label htmlFor="rdv-message" className={libelle}>Votre besoin en quelques mots</label>
          <Textarea id="rdv-message" rows={3} value={form.message} onChange={(e) => maj("message")(e.target.value)} className="resize-none bg-gray-50/50 border-gray-200" />
        </div>

        {erreur && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
            <p className="text-sm text-red-800">{erreur}</p>
          </div>
        )}

        <Button type="submit" disabled={envoi} className="h-11 w-full text-base font-semibold">
          {envoi ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
              Envoi en cours...
            </>
          ) : (
            "Demander ce rendez-vous"
          )}
        </Button>
        <p className="text-center text-xs text-gray-500">
          Vos données sont traitées conformément à notre{" "}
          <Link href="/politique-confidentialite" className="underline hover:text-odillon-teal">politique de confidentialité</Link>.
        </p>
      </form>
    </div>
  )
}
