export interface Photo {
  id: string;
  url: string;
  description: string;
  details: string | null;
  location: string | null;
  event_description?: string;

  theme_id: string | null;
  activity_type: string | null;

  day?: number | null;
  month: number | null;
  year: number | null;

  is_active: boolean;
  display_order: number;
  created_at?: string;
}

export interface Album {
  id: string;
  title: string;
  photos: Photo[];
  coverPhoto: Photo;

  date?: string;
  sortDate: number;

  location?: string | null;
  themeId?: string | null;
  activityType?: string | null;
}

export interface FilterState {
  search: string;
  category: string | null;
  year: number | null;
  month: number | null;
}

/**
 * Regroupe les photos ayant la même description
 * dans un même album.
 */
export function groupPhotosByEvent(photos: Photo[]): Album[] {
  const albumsMap = new Map<string, Photo[]>();

  photos.forEach((photo) => {
    const key = photo.description.trim();

    if (!key) return;

    if (!albumsMap.has(key)) {
      albumsMap.set(key, []);
    }

    albumsMap.get(key)!.push(photo);
  });

  return Array.from(albumsMap.entries()).map(
    ([title, eventPhotos]) => {
      const sortedPhotos = [...eventPhotos].sort(
        comparePhotosByDateDesc
      );

      const cover = sortedPhotos[0];
      const date = formatPhotoDate(cover);

      return {
        id: title,
        title,
        photos: sortedPhotos,
        coverPhoto: cover,
        date,
        sortDate: getPhotoSortDate(cover),
        location: cover.location,
        themeId: cover.theme_id,
        activityType: cover.activity_type,
      };
    }
  );
}

/**
 * Trie les albums du plus récent au plus ancien.
 */
export function compareAlbumsByDateDesc(
  a: Album,
  b: Album
): number {
  if (a.sortDate !== b.sortDate) {
    return b.sortDate - a.sortDate;
  }

  return a.title.localeCompare(
    b.title,
    'fr',
    { sensitivity: 'base' }
  );
}

/**
 * Trie les photos d'un album du plus récent au plus ancien.
 */
function comparePhotosByDateDesc(
  a: Photo,
  b: Photo
): number {
  const dateDiff =
    getPhotoSortDate(b) -
    getPhotoSortDate(a);

  if (dateDiff !== 0) {
    return dateDiff;
  }

  return (
    (a.display_order ?? 0) -
    (b.display_order ?? 0)
  );
}

/**
 * Date utilisée pour le classement.
 *
 * PRIORITÉ :
 * 1. année + mois + jour
 * 2. année + mois
 * 3. année
 * 4. created_at uniquement pour les anciennes photos
 *    qui n'ont pas encore de date événementielle.
 */
function getPhotoSortDate(photo: Photo): number {
  if (photo.year) {
    return new Date(
      photo.year,
      (photo.month ?? 1) - 1,
      photo.day ?? 1
    ).getTime();
  }

  // Compatibilité avec les anciennes photos
  // qui n'ont pas encore d'année renseignée.
  if (photo.created_at) {
    return new Date(photo.created_at).getTime();
  }

  return 0;
}

/**
 * Formate la date affichée sur un album.
 */
function formatPhotoDate(
  photo: Photo
): string | undefined {
  if (
    photo.year &&
    photo.month &&
    photo.day
  ) {
    const monthName =
      new Intl.DateTimeFormat('fr-FR', {
        month: 'long',
      }).format(
        new Date(
          photo.year,
          photo.month - 1,
          1
        )
      );

    return `${photo.day} ${monthName} ${photo.year}`;
  }

  if (
    photo.year &&
    photo.month
  ) {
    const monthName =
      new Intl.DateTimeFormat('fr-FR', {
        month: 'long',
      }).format(
        new Date(
          photo.year,
          photo.month - 1,
          1
        )
      );

    return `${monthName} ${photo.year}`;
  }

  if (photo.year) {
    return `${photo.year}`;
  }

  return undefined;
}