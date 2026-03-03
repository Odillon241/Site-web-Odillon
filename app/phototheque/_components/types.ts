export interface Photo {
  id: string;
  url: string;
  description: string;
  details: string | null;
  location: string | null;
  event_description?: string;
  theme_id: string | null;
  activity_type: string | null;
  month: number | null;
  year: number | null;
  is_active: boolean;
  display_order: number;
}

export interface Album {
  id: string;
  title: string;
  photos: Photo[];
  coverPhoto: Photo;
  date?: string;
  location?: string | null;
  themeId?: string | null;
  activityType?: string | null;
}

export interface FilterState {
  search: string;
  category: string | null;
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
    const cover = eventPhotos[0];
    const date = cover.month && cover.year
      ? new Date(cover.year, cover.month - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      : cover.month
        ? new Date(2024, cover.month - 1).toLocaleDateString('fr-FR', { month: 'long' })
        : undefined;

    return {
      id: title,
      title: title,
      photos: eventPhotos,
      coverPhoto: cover,
      date,
      location: cover.location,
      themeId: cover.theme_id,
      activityType: cover.activity_type
    };
  });
}
