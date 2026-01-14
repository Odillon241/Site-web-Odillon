-- Migration: Add activity_type to photos and videos
-- Date: 2026-01-13

-- Add activity_type to photos
ALTER TABLE public.photos ADD COLUMN IF NOT EXISTS activity_type TEXT;

-- Add activity_type to videos
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS activity_type TEXT;

-- Index for better filtering
CREATE INDEX IF NOT EXISTS photos_activity_type_idx ON public.photos(activity_type);
CREATE INDEX IF NOT EXISTS videos_activity_type_idx ON public.videos(activity_type);

-- Update existing photos/videos if they contain keywords in description/title (optional but helpful)
UPDATE public.photos SET activity_type = 'Formation' WHERE description ILIKE '%Formation%' OR details ILIKE '%Formation%';
UPDATE public.photos SET activity_type = 'Séminaire' WHERE description ILIKE '%Séminaire%' OR details ILIKE '%Séminaire%';
UPDATE public.photos SET activity_type = 'Team Building' WHERE description ILIKE '%Team Building%' OR details ILIKE '%Team Building%';
UPDATE public.photos SET activity_type = 'Ateliers' WHERE description ILIKE '%Atelier%' OR details ILIKE '%Atelier%';
UPDATE public.photos SET activity_type = 'Événements' WHERE description ILIKE '%Événement%' OR details ILIKE '%Événement%';

UPDATE public.videos SET activity_type = 'Formation' WHERE title ILIKE '%Formation%' OR description ILIKE '%Formation%';
UPDATE public.videos SET activity_type = 'Séminaire' WHERE title ILIKE '%Séminaire%' OR description ILIKE '%Séminaire%';
UPDATE public.videos SET activity_type = 'Team Building' WHERE title ILIKE '%Team Building%' OR description ILIKE '%Team Building%';
UPDATE public.videos SET activity_type = 'Ateliers' WHERE title ILIKE '%Atelier%' OR description ILIKE '%Atelier%';
UPDATE public.videos SET activity_type = 'Événements' WHERE title ILIKE '%Événement%' OR description ILIKE '%Événement%';
