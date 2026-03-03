-- Migration: Ajout des tables manquantes
-- Date: 2024-12-16
-- Description: Créer les tables testimonials, company_logos, videos, et photo_sections

-- ============================================
-- TABLE: testimonials (Témoignages clients)
-- ============================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_company TEXT,
  author_avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index pour testimonials
CREATE INDEX IF NOT EXISTS testimonials_display_order_idx ON public.testimonials(display_order);
CREATE INDEX IF NOT EXISTS testimonials_is_active_idx ON public.testimonials(is_active);

-- ============================================
-- TABLE: company_logos (Logos partenaires/clients)
-- ============================================
CREATE TABLE IF NOT EXISTS public.company_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index pour company_logos
CREATE INDEX IF NOT EXISTS company_logos_display_order_idx ON public.company_logos(display_order);
CREATE INDEX IF NOT EXISTS company_logos_is_active_idx ON public.company_logos(is_active);

-- ============================================
-- TABLE: videos (Vidéos du site)
-- ============================================
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_id TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index pour videos
CREATE INDEX IF NOT EXISTS videos_display_order_idx ON public.videos(display_order);
CREATE INDEX IF NOT EXISTS videos_is_active_idx ON public.videos(is_active);
CREATE INDEX IF NOT EXISTS videos_category_idx ON public.videos(category);

-- ============================================
-- TABLE: photo_sections (Sections de photos)
-- ============================================
CREATE TABLE IF NOT EXISTS public.photo_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  section_key TEXT UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index pour photo_sections
CREATE INDEX IF NOT EXISTS photo_sections_display_order_idx ON public.photo_sections(display_order);
CREATE INDEX IF NOT EXISTS photo_sections_is_active_idx ON public.photo_sections(is_active);
CREATE INDEX IF NOT EXISTS photo_sections_section_key_idx ON public.photo_sections(section_key);

-- ============================================
-- TRIGGERS pour updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer les triggers existants s'ils existent
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
DROP TRIGGER IF EXISTS update_company_logos_updated_at ON public.company_logos;
DROP TRIGGER IF EXISTS update_videos_updated_at ON public.videos;
DROP TRIGGER IF EXISTS update_photo_sections_updated_at ON public.photo_sections;

-- Créer les triggers
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_logos_updated_at
  BEFORE UPDATE ON public.company_logos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photo_sections_updated_at
  BEFORE UPDATE ON public.photo_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_sections ENABLE ROW LEVEL SECURITY;

-- Policies pour testimonials
CREATE POLICY "Les témoignages actifs sont publics"
  ON public.testimonials
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Les admins peuvent tout voir (testimonials)"
  ON public.testimonials
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Les admins peuvent créer des témoignages"
  ON public.testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Les admins peuvent modifier des témoignages"
  ON public.testimonials
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Les admins peuvent supprimer des témoignages"
  ON public.testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies pour company_logos
CREATE POLICY "Les logos actifs sont publics"
  ON public.company_logos
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Les admins peuvent tout voir (logos)"
  ON public.company_logos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Les admins peuvent créer des logos"
  ON public.company_logos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Les admins peuvent modifier des logos"
  ON public.company_logos
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Les admins peuvent supprimer des logos"
  ON public.company_logos
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies pour videos
CREATE POLICY "Les vidéos actives sont publiques"
  ON public.videos
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Les admins peuvent tout voir (videos)"
  ON public.videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Les admins peuvent créer des vidéos"
  ON public.videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Les admins peuvent modifier des vidéos"
  ON public.videos
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Les admins peuvent supprimer des vidéos"
  ON public.videos
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies pour photo_sections
CREATE POLICY "Les sections actives sont publiques"
  ON public.photo_sections
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Les admins peuvent tout voir (sections)"
  ON public.photo_sections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Les admins peuvent créer des sections"
  ON public.photo_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Les admins peuvent modifier des sections"
  ON public.photo_sections
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Les admins peuvent supprimer des sections"
  ON public.photo_sections
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- COMMENTAIRES
-- ============================================
COMMENT ON TABLE public.testimonials IS 'Témoignages clients affichés sur le site';
COMMENT ON TABLE public.company_logos IS 'Logos des entreprises partenaires ou clientes';
COMMENT ON TABLE public.videos IS 'Vidéos YouTube affichées sur le site';
COMMENT ON TABLE public.photo_sections IS 'Sections organisées de photos pour le site';
