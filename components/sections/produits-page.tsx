"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { m } from "framer-motion"
import { FadeIn } from "@/components/magicui/fade-in"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Button } from "@/components/ui/button"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { GridPattern } from "@/components/ui/grid-pattern"
import { CtaBanner } from "@/components/sections/cta-banner"
import { VideoSection } from "@/components/sections/video-section"
import { VideosSection } from "@/components/sections/videos-section"
import type { VideoItem } from "@/components/sections/videos-section"
import { Video } from "@/types/admin"
import { polesProduits, nombreProduits, type IconePole, type PoleProduits } from "@/lib/produits-data"
import { Landmark, Users, Scale, Rocket, GraduationCap, ChevronRight, Download } from "lucide-react"

const icones: Record<IconePole, React.ComponentType<{ className?: string }>> = {
  Landmark,
  Users,
  Scale,
  Rocket,
  GraduationCap,
}

function detecterTypeVideo(url: string, type: string): "youtube" | "vimeo" | "direct" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("vimeo.com")) return "vimeo"
  return type as "youtube" | "vimeo" | "direct"
}

function ListeProduits({
  produits,
  couleur,
  className,
}: {
  produits: string[]
  couleur: string
  className?: string
}) {
  return (
    <ul className={cn("grid gap-x-10 gap-y-3", className)}>
      {produits.map((produit) => (
        <li key={produit} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-gray-700">
          <span
            className="mt-[0.6rem] size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: couleur }}
            aria-hidden="true"
          />
          <span>{produit}</span>
        </li>
      ))}
    </ul>
  )
}

/* Programme en plusieurs phases : un sélecteur d'étapes, puis la phase choisie
   en détail (présentation, services, livrables, résultat attendu). Toutes les
   phases restent dans le HTML pour le référencement ; seule l'active est visible. */
function ProgrammePhases({ pole }: { pole: PoleProduits }) {
  const [active, setActive] = useState(0)
  const onglets = useRef<(HTMLButtonElement | null)[]>([])
  const phases = pole.groupes

  const choisir = (i: number) => {
    setActive(i)
    onglets.current[i]?.focus()
  }

  const auClavier = (e: React.KeyboardEvent, i: number) => {
    const n = phases.length
    if (e.key === "ArrowRight") choisir((i + 1) % n)
    else if (e.key === "ArrowLeft") choisir((i - 1 + n) % n)
    else if (e.key === "Home") choisir(0)
    else if (e.key === "End") choisir(n - 1)
    else return
    e.preventDefault()
  }

  return (
    <div>
      <div role="tablist" aria-label="Modules de l'accompagnement" className="relative grid grid-cols-3 gap-2 sm:gap-3">
        {/* Fil reliant les étapes, derrière les onglets. */}
        <span aria-hidden="true" className="absolute inset-x-[16%] top-1/2 hidden h-px bg-odillon-teal/20 sm:block" />
        {phases.map((phase, i) => {
          const choisie = i === active
          return (
            <button
              key={phase.titre}
              ref={(el) => { onglets.current[i] = el }}
              type="button"
              role="tab"
              id={`phase-onglet-${i}`}
              aria-selected={choisie}
              aria-controls={`phase-panneau-${i}`}
              tabIndex={choisie ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => auClavier(e, i)}
              className={cn(
                "relative flex flex-col items-center rounded-lg border px-2 py-3 text-center transition-colors duration-200 sm:px-4 sm:py-4",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odillon-teal",
                choisie
                  ? "border-odillon-teal bg-odillon-teal text-white shadow-md shadow-odillon-teal/20"
                  : "border-gray-200 bg-white text-gray-700 hover:border-odillon-teal/40 hover:text-odillon-teal"
              )}
            >
              <span className={cn("text-[10px] font-bold uppercase tracking-widest sm:text-[11px]", choisie ? "text-white/75" : "text-odillon-teal")}>
                {phase.etape}
              </span>
              <span className="mt-0.5 text-sm font-bold tracking-wide sm:text-lg">{phase.titre}</span>
              <span className={cn("font-baskvill text-sm italic sm:text-base", choisie ? "text-white/90" : "text-gray-500")}>
                {phase.verbe}
              </span>
            </button>
          )
        })}
      </div>

      {phases.map((phase, i) => (
        <div
          key={phase.titre}
          role="tabpanel"
          id={`phase-panneau-${i}`}
          aria-labelledby={`phase-onglet-${i}`}
          // Classe conditionnelle plutôt que l'attribut hidden, que `grid` écraserait.
          className={cn("mt-8", i === active ? "block" : "hidden")}
        >
          {/* Présentation */}
          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-8">
            {phase.illustration && (
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={phase.illustration.src}
                  alt={phase.illustration.alt}
                  fill
                  sizes="(min-width: 768px) 380px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-odillon-teal">
                {phase.etape} · {phase.verbe}
              </p>
              <h3 className="mt-1 font-baskvill text-2xl italic text-odillon-dark md:text-3xl">Offre {phase.titre}</h3>
              {phase.finalite && <p className="mt-1 text-sm font-medium text-gray-500">{phase.finalite}</p>}
              {phase.description?.map((paragraphe) => (
                <p key={paragraphe.slice(0, 40)} className="mt-3 text-[0.95rem] leading-relaxed text-gray-700">
                  {paragraphe}
                </p>
              ))}
            </div>
          </div>

          {/* Services */}
          <h4 className="mb-4 mt-10 text-[11px] font-bold uppercase tracking-widest text-odillon-dark/70">
            Services proposés
          </h4>
          {phase.sections ? (
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {phase.sections.map((section, s) => (
                <li key={section.titre} className="rounded-lg border border-gray-100 bg-[#f7fafc] p-5">
                  <p className="mb-3 flex items-baseline gap-2 font-semibold text-odillon-dark">
                    {phase.sections!.length > 2 && (
                      <span className="text-sm tabular-nums text-odillon-teal">{s + 1}.</span>
                    )}
                    {section.titre}
                  </p>
                  <ListeProduits produits={section.produits} couleur={pole.couleur} className="gap-y-2 [&_li]:text-sm" />
                </li>
              ))}
            </ol>
          ) : (
            <ListeProduits produits={phase.produits} couleur={pole.couleur} className="sm:grid-cols-2" />
          )}

          {/* Livrables */}
          {phase.livrables && (
            <>
              <h4 className="mb-4 mt-10 text-[11px] font-bold uppercase tracking-widest text-odillon-dark/70">
                Livrables · à l&apos;issue de ce module, le promoteur dispose de
              </h4>
              <ol className="grid gap-3 sm:grid-cols-2">
                {phase.livrables.map((livrable, l) => (
                  <li key={livrable} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-gray-700">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-odillon-teal/10 text-xs font-bold tabular-nums text-odillon-teal">
                      {l + 1}
                    </span>
                    {livrable}
                  </li>
                ))}
              </ol>
            </>
          )}

          {/* Résultat attendu */}
          {phase.resultat && (
            <div className="mt-10 rounded-lg border-l-4 border-odillon-lime bg-odillon-teal/[0.06] px-5 py-4 md:px-6 md:py-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-odillon-teal">Résultat attendu</p>
              <p className="mt-1.5 font-baskvill text-lg italic leading-snug text-odillon-dark md:text-xl">{phase.resultat}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Le catalogue du partenaire est montré tel quel : chaque page ouvre le PDF à cette page.
function ApercuCatalogue({ catalogue }: { catalogue: NonNullable<PoleProduits["catalogue"]> }) {
  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">Cliquez sur une page pour consulter le catalogue en plein écran.</p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {catalogue.pages.map((page, i) => (
          <li key={page.src}>
            <a
              href={`${catalogue.href}#page=${i + 1}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-md shadow-sm ring-1 ring-black/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odillon-teal"
            >
              <Image
                src={page.src}
                alt={page.alt}
                width={1241}
                height={1755}
                sizes="(min-width: 640px) 230px, 45vw"
                className="h-auto w-full"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

const idsPoles = polesProduits.map((p) => p.id)

export function ProduitsPage() {
  const [video, setVideo] = useState<Video | null>(null)
  const [videosTemoignages, setVideosTemoignages] = useState<VideoItem[]>([])
  const [ouverts, setOuverts] = useState<string[]>([])

  // Un lien /produits#gouvernance (menu, pied de page, accueil) ouvre la catégorie visée.
  useEffect(() => {
    const ouvrirDepuisHash = () => {
      const id = window.location.hash.slice(1)
      if (!idsPoles.includes(id)) return
      setOuverts((prev) => (prev.includes(id) ? prev : [...prev, id]))
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
      )
    }
    ouvrirDepuisHash()
    window.addEventListener("hashchange", ouvrirDepuisHash)
    return () => window.removeEventListener("hashchange", ouvrirDepuisHash)
  }, [])

  useEffect(() => {
    const chargerVideos = async () => {
      try {
        const res = await fetch("/api/videos?active=true")
        if (!res.ok) return
        const data = await res.json()
        const videos: Video[] = data.videos || []

        const videoPage = videos.find((v) => v.page === "Services" && v.section === "Contenu")
        if (videoPage) setVideo(videoPage)

        setVideosTemoignages(
          videos
            .filter((v) => v.category === "testimonial")
            .map((v) => ({
              id: v.id,
              title: v.title,
              description: v.description || undefined,
              url: v.url,
              type: detecterTypeVideo(v.url, v.type),
              thumbnail: v.thumbnail || undefined,
            }))
        )
      } catch (error) {
        console.error("Erreur lors du chargement des vidéos:", error)
      }
    }

    chargerVideos()
  }, [])

  return (
    <section className="od-page relative overflow-x-clip">
      {/* Hero */}
      <div className="od-section relative overflow-hidden bg-[#f7fafc] py-16 md:py-20 lg:py-24" role="banner" aria-label="Section héro des produits">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GridPattern
            width={64}
            height={64}
            x={-20}
            y={-20}
            className="absolute inset-0 fill-[#00a795]/[0.025] stroke-[#00a795]/[0.11] [mask-image:linear-gradient(to_bottom,black_5%,black_78%,transparent_100%)]"
          />
          <div className="absolute -right-36 -top-24 h-[32rem] w-[32rem] rounded-full border border-odillon-teal/10 bg-[radial-gradient(circle_at_center,rgba(0,167,149,0.10),rgba(0,167,149,0.025)_42%,transparent_68%)]" />
          <div className="absolute -right-4 top-10 h-[21rem] w-[21rem] rounded-full border border-odillon-lime/15" />
          <div className="absolute -left-28 -bottom-40 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(196,216,46,0.13),transparent_68%)] blur-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.34)_52%,transparent_78%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-odillon-teal/25 to-transparent" />
        </div>

        <div className="od-container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <h1 className="od-heading-display mb-6 text-4xl sm:text-5xl lg:text-6xl">
                Des produits qui transforment{" "}
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 bg-gradient-to-r from-odillon-teal to-odillon-lime bg-clip-text text-transparent">
                    votre entreprise
                  </span>
                  <m.span
                    className="absolute -bottom-2 left-0 w-full h-1.5 bg-odillon-lime/20 rounded-full -z-0"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-light">
                Pour structurer, développer et pérenniser votre organisation.
              </p>
            </FadeIn>

          </div>

          {/* Vue d'ensemble : chaque carte descend vers sa catégorie et l'ouvre
              (le lien #id est traité par l'écouteur hashchange). */}
          <FadeIn delay={0.6} className="mx-auto mt-10 max-w-5xl md:mt-12">
            <nav aria-label="Catégories de produits">
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {polesProduits.map((pole) => {
                  const Icone = icones[pole.icone]
                  return (
                    <li key={pole.id}>
                      <a
                        href={`#${pole.id}`}
                        // Le hash ne change pas si l'on reclique la même carte : on ouvre aussi ici.
                        onClick={() => setOuverts((prev) => (prev.includes(pole.id) ? prev : [...prev, pole.id]))}
                        className="group flex h-full flex-col items-center gap-3 rounded-xl border border-gray-200/80 bg-white/80 p-4 text-center shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-odillon-teal/30 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odillon-teal"
                      >
                        <span
                          className="flex size-11 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105"
                          style={{ backgroundColor: `${pole.couleur}18`, color: pole.couleur }}
                        >
                          <Icone className="size-5" aria-hidden="true" />
                        </span>
                        <span className="font-baskvill text-lg italic leading-tight text-gray-900">{pole.titre}</span>
                        <span className="text-xs text-gray-500">{pole.badge ?? `${nombreProduits(pole)} produits`}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </FadeIn>
        </div>
      </div>

      <VideoSection video={video} />

      <div id="catalogue" className="od-container relative z-10 scroll-mt-28 pt-8 md:pt-12">
        {/* Une ligne par catégorie : un clic déplie la liste de ses produits */}
        <Accordion
          type="multiple"
          value={ouverts}
          onValueChange={setOuverts}
          className="mx-auto flex max-w-5xl flex-col gap-4 mb-16 md:mb-24"
        >
          {polesProduits.map((pole, idx) => {
            const Icone = icones[pole.icone]
            const total = nombreProduits(pole)
            const avecGroupes = pole.groupes.some((g) => g.titre)
            const avecIllustrations = pole.groupes.some((g) => g.illustration)

            return (
              <BlurFade key={pole.id} delay={0.1 + idx * 0.05}>
                <AccordionItem
                  value={pole.id}
                  id={pole.id}
                  className="od-surface scroll-mt-28 overflow-hidden transition-shadow duration-300 hover:border-odillon-teal/25 data-[state=open]:border-odillon-teal/25 data-[state=open]:shadow-md data-[state=open]:shadow-[#0A1F2C]/[0.05]"
                >
                  <AccordionTrigger className="gap-4 px-5 py-5 text-left hover:no-underline md:px-7 md:py-6 [&>svg]:size-5 [&>svg]:text-gray-400">
                    <span className="flex min-w-0 flex-1 items-center gap-4">
                      <span
                        className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${pole.couleur}18`, color: pole.couleur }}
                      >
                        <Icone className="size-6" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-baskvill text-xl italic leading-tight text-gray-900 md:text-2xl">
                          {pole.titre}
                        </span>
                        <span className="mt-1 block text-sm font-normal text-gray-500">{pole.accroche}</span>
                      </span>
                    </span>
                    <span className="hidden shrink-0 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium tabular-nums text-gray-500 sm:inline-flex">
                      {pole.badge ?? `${total} produits`}
                    </span>
                  </AccordionTrigger>

                  {/* forceMount : les produits restent dans le HTML (référencement), masqués en CSS une fois fermés */}
                  <AccordionPrimitive.Content
                    forceMount
                    className="overflow-hidden data-[state=closed]:hidden data-[state=open]:animate-accordion-down"
                  >
                    <div className="mx-5 border-t border-gray-100 pb-6 pt-6 md:mx-7 md:pb-8">
                      {pole.catalogue ? (
                        <ApercuCatalogue catalogue={pole.catalogue} />
                      ) : avecIllustrations ? (
                        <ProgrammePhases pole={pole} />
                      ) : avecGroupes ? (
                        <div className="grid gap-8 md:grid-cols-3">
                          {pole.groupes.map((groupe) => (
                            <div key={groupe.titre}>
                              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-odillon-dark/70">
                                {groupe.titre}
                              </p>
                              <ListeProduits produits={groupe.produits} couleur={pole.couleur} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ListeProduits
                          produits={pole.groupes.flatMap((g) => g.produits)}
                          couleur={pole.couleur}
                          className="sm:grid-cols-2"
                        />
                      )}

                      {pole.mention && (
                        <p className="mt-6 text-sm text-gray-500">{pole.mention}</p>
                      )}

                      {pole.liens && (
                        <div className="mt-6 flex flex-wrap gap-3">
                          {pole.liens.map((lien, i) => (
                            <Button key={lien.href} asChild variant={i === 0 ? "default" : "outline"} size="sm" className="h-10 px-5">
                              <a href={lien.href} download={lien.telechargement ? "" : undefined}>
                                {lien.telechargement ? (
                                  <Download className="mr-2 size-4" aria-hidden="true" />
                                ) : null}
                                {lien.libelle}
                                {!lien.telechargement ? (
                                  <ChevronRight className="ml-1.5 size-4" aria-hidden="true" />
                                ) : null}
                              </a>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionItem>
              </BlurFade>
            )
          })}
        </Accordion>

        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <CtaBanner
            title="Un projet en tête ?"
            description="Un premier échange de 30 minutes pour vous orienter vers les produits adaptés à votre situation."
            buttonText="Prendre rendez-vous"
            buttonHref="/rendez-vous"
            badgeText="Rendez-vous"
          />
        </div>

        <VideosSection title="Témoignages Clients" badge="Témoignages" videos={videosTemoignages} />
      </div>
    </section>
  )
}
