/**
 * Médias de la photothèque : un album mêle photos et vidéos dans la même
 * table `photos`. Le type se déduit de l'adresse du fichier, sans colonne
 * dédiée : les vidéos sont rangées dans le bucket `videos` et gardent leur
 * extension.
 */

export const TYPES_VIDEO = ["video/mp4", "video/webm", "video/quicktime"]
export const TAILLE_MAX_VIDEO = 50 * 1024 * 1024
export const TAILLE_MAX_IMAGE = 20 * 1024 * 1024

const EXTENSION_VIDEO = /\.(mp4|m4v|webm|mov)(?:[?#]|$)/i
const BUCKET_VIDEO = /\/storage\/v1\/object\/public\/videos\//

export function estVideo(url: string | null | undefined): boolean {
    if (!url) return false
    return EXTENSION_VIDEO.test(url) || BUCKET_VIDEO.test(url)
}

/** Type MIME d'une vidéo d'après son adresse, pour la balise <source>. */
export function typeVideo(url: string): string {
    if (/\.webm(?:[?#]|$)/i.test(url)) return "video/webm"
    if (/\.mov(?:[?#]|$)/i.test(url)) return "video/quicktime"
    return "video/mp4"
}

/** « 12 photos et 2 vidéos », « 1 vidéo »… */
export function compterMedias(urls: string[]): string {
    const videos = urls.filter(estVideo).length
    const photos = urls.length - videos
    const parties = [
        photos > 0 ? `${photos} photo${photos > 1 ? "s" : ""}` : null,
        videos > 0 ? `${videos} vidéo${videos > 1 ? "s" : ""}` : null,
    ].filter(Boolean)
    return parties.join(" et ") || "0 photo"
}
