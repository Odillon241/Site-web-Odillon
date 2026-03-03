-- Migration: Ajout de la table site_settings
-- Date: 2024-12-16
-- Description: Table pour gérer les paramètres d'affichage du site

-- Créer la table site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  show_videos_section BOOLEAN NOT NULL DEFAULT true,
  show_photos_section BOOLEAN NOT NULL DEFAULT true,
  services_cta_image_url TEXT,
  expertise_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer les paramètres par défaut
INSERT INTO public.site_settings (id, show_videos_section, show_photos_section)
VALUES ('main', true, true)
ON CONFLICT (id) DO NOTHING;

-- Activer Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Politique: Tout le monde peut lire les paramètres
CREATE POLICY "Les paramètres du site sont publics"
  ON public.site_settings
  FOR SELECT
  TO public
  USING (true);

-- Politique: Seuls les utilisateurs authentifiés peuvent modifier
CREATE POLICY "Seuls les admins peuvent modifier les paramètres"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- Commentaires
COMMENT ON TABLE public.site_settings IS 'Paramètres de configuration du site web';
COMMENT ON COLUMN public.site_settings.id IS 'Identifiant unique (toujours "main")';
COMMENT ON COLUMN public.site_settings.show_videos_section IS 'Afficher ou masquer la section vidéos';
COMMENT ON COLUMN public.site_settings.show_photos_section IS 'Afficher ou masquer la section photos';
COMMENT ON COLUMN public.site_settings.services_cta_image_url IS 'URL de l''image pour le CTA des services';
COMMENT ON COLUMN public.site_settings.expertise_image_url IS 'URL de l''image pour la section expertise';
