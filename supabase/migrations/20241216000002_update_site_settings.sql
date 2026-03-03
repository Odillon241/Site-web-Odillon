-- Migration: Mise à jour de la table site_settings
-- Date: 2024-12-16
-- Description: Ajouter les colonnes manquantes à la table existante

-- Ajouter les colonnes si elles n'existent pas
DO $$
BEGIN
  -- Ajouter services_cta_image_url si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'site_settings'
    AND column_name = 'services_cta_image_url'
  ) THEN
    ALTER TABLE public.site_settings ADD COLUMN services_cta_image_url TEXT;
  END IF;

  -- Ajouter expertise_image_url si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'site_settings'
    AND column_name = 'expertise_image_url'
  ) THEN
    ALTER TABLE public.site_settings ADD COLUMN expertise_image_url TEXT;
  END IF;

  -- Ajouter created_at si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'site_settings'
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.site_settings ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Ajouter updated_at si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'site_settings'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.site_settings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Insérer les paramètres par défaut si la ligne n'existe pas
INSERT INTO public.site_settings (id, show_videos_section, show_photos_section)
VALUES ('main', true, true)
ON CONFLICT (id) DO NOTHING;

-- Activer Row Level Security (RLS) si ce n'est pas déjà fait
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Les paramètres du site sont publics" ON public.site_settings;
DROP POLICY IF EXISTS "Seuls les admins peuvent modifier les paramètres" ON public.site_settings;

-- Recréer les policies
CREATE POLICY "Les paramètres du site sont publics"
  ON public.site_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Seuls les admins peuvent modifier les paramètres"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Supprimer et recréer la fonction et le trigger
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
DROP FUNCTION IF EXISTS update_site_settings_updated_at();

CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- Ajouter les commentaires
COMMENT ON TABLE public.site_settings IS 'Paramètres de configuration du site web';
COMMENT ON COLUMN public.site_settings.id IS 'Identifiant unique (toujours "main")';
COMMENT ON COLUMN public.site_settings.show_videos_section IS 'Afficher ou masquer la section vidéos';
COMMENT ON COLUMN public.site_settings.show_photos_section IS 'Afficher ou masquer la section photos';
COMMENT ON COLUMN public.site_settings.services_cta_image_url IS 'URL de l''image pour le CTA des services';
COMMENT ON COLUMN public.site_settings.expertise_image_url IS 'URL de l''image pour la section expertise';
