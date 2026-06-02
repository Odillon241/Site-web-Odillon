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
}

export function groupPhotosByEvent(photos: Photo[]): Album[] {
  const albumsMap = new Map<string, Photo[]>();

  photos.forEach(photo => {
    const key = photo.description.trim();
    if (!albumsMap.has(key)) {
      albumsMap.set(key, []);
    }
    albumsMap.get(key)!.push(photo);
  });

  return Array.from(albumsMap.entries()).map(([title, eventPhotos]) => {
    const sortedPhotos = [...eventPhotos].sort(comparePhotosByDateDesc);
    const cover = sortedPhotos[0];
    const date = formatPhotoDate(cover);

    return {
      id: title,
      title: title,
      photos: sortedPhotos,
      coverPhoto: cover,
      date,
      sortDate: getPhotoSortDate(cover),
      location: cover.location,
      themeId: cover.theme_id,
      activityType: cover.activity_type
    };
  });
}

export function compareAlbumsByDateDesc(a: Album, b: Album): number {
  if (a.sortDate !== b.sortDate) {
    return b.sortDate - a.sortDate;
  }

  return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' });
}

function comparePhotosByDateDesc(a: Photo, b: Photo): number {
  const dateDiff = getPhotoSortDate(b) - getPhotoSortDate(a);
  if (dateDiff !== 0) return dateDiff;

  return (a.display_order ?? 0) - (b.display_order ?? 0);
}

function getPhotoSortDate(photo: Photo): number {
  if (photo.year || photo.month || photo.day) {
    return new Date(
      photo.year ?? 0,
      (photo.month ?? 1) - 1,
      photo.day ?? 1
    ).getTime();
  }

  return photo.created_at ? new Date(photo.created_at).getTime() : 0;
}

function formatPhotoDate(photo: Photo): string | undefined {
  if (photo.year && photo.month && photo.day) {
    return `${photo.year} - ${new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(photo.year, photo.month - 1))} - ${photo.day}`;
  }

  if (photo.year && photo.month) {
    return `${photo.year} - ${new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(photo.year, photo.month - 1))}`;
  }

  if (photo.year) return `${photo.year}`;

  if (photo.month) {
    return new Date(2024, photo.month - 1).toLocaleDateString('fr-FR', { month: 'long' });
  }

  return undefined;
}
