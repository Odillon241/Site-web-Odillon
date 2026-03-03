-- Migration: Correction des problèmes de sécurité et de performance
-- Date: 2024-12-16
-- Description: Résout les alertes du linter Supabase (sécurité + performance)

-- ============================================
-- PARTIE 1: SÉCURITÉ - Function Search Path
-- ============================================
-- Correction de la fonction update_updated_at_column avec search_path sécurisé

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
-- Set a secure search_path: trusted schema(s), then 'pg_temp'
SET search_path = public, pg_catalog, pg_temp;

-- Correction de la fonction update_photo_sections_updated_at avec search_path sécurisé

CREATE OR REPLACE FUNCTION update_photo_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp;

-- Correction de la fonction update_site_settings_updated_at avec search_path sécurisé

CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp;

-- ============================================
-- PARTIE 2: PERFORMANCE - Index manquants sur clés étrangères
-- ============================================

-- Index pour company_logos.created_by (foreign key vers auth.users)
CREATE INDEX IF NOT EXISTS idx_company_logos_created_by ON public.company_logos(created_by);

-- Index pour photo_sections.created_by (foreign key vers auth.users)
CREATE INDEX IF NOT EXISTS idx_photo_sections_created_by ON public.photo_sections(created_by);

-- Index pour photos.created_by (foreign key vers auth.users)
CREATE INDEX IF NOT EXISTS idx_photos_created_by ON public.photos(created_by);

-- Index pour photos.section_id (foreign key vers photo_sections)
CREATE INDEX IF NOT EXISTS idx_photos_section_id ON public.photos(section_id);

-- Index pour testimonials.created_by (foreign key vers auth.users)
CREATE INDEX IF NOT EXISTS idx_testimonials_created_by ON public.testimonials(created_by);

-- Index pour videos.created_by (foreign key vers auth.users)
CREATE INDEX IF NOT EXISTS idx_videos_created_by ON public.videos(created_by);

-- ============================================
-- PARTIE 3: PERFORMANCE - Suppression des index dupliqués
-- ============================================

-- Supprimer les index dupliqués de company_logos
DROP INDEX IF EXISTS public.company_logos_display_order_idx; -- Garder company_logos_order_idx
DROP INDEX IF EXISTS public.company_logos_active_idx; -- Garder company_logos_is_active_idx

-- Supprimer les index dupliqués de testimonials
DROP INDEX IF EXISTS public.testimonials_display_order_idx; -- Garder testimonials_order_idx
DROP INDEX IF EXISTS public.testimonials_active_idx; -- Garder testimonials_is_active_idx

-- ============================================
-- PARTIE 4: PERFORMANCE - Suppression des index inutilisés
-- ============================================

-- Supprimer les index inutilisés de company_logos
DROP INDEX IF EXISTS public.company_logos_is_active_idx;

-- Supprimer les index inutilisés de videos
DROP INDEX IF EXISTS public.videos_is_active_idx;
DROP INDEX IF EXISTS public.videos_type_idx;

-- Supprimer les index inutilisés de photo_sections
DROP INDEX IF EXISTS public.idx_photo_sections_position;
DROP INDEX IF EXISTS public.photo_sections_display_order_idx;
DROP INDEX IF EXISTS public.photo_sections_is_active_idx;
DROP INDEX IF EXISTS public.photo_sections_section_key_idx;

-- Supprimer les index inutilisés de testimonials
DROP INDEX IF EXISTS public.testimonials_display_order_idx;
DROP INDEX IF EXISTS public.testimonials_is_active_idx;

-- Supprimer les index inutilisés de contact_messages
DROP INDEX IF EXISTS public.contact_messages_status_idx;
DROP INDEX IF EXISTS public.contact_messages_created_at_idx;
DROP INDEX IF EXISTS public.contact_messages_email_idx;

-- Supprimer les index inutilisés de photos
DROP INDEX IF EXISTS public.photos_theme_id_idx;

-- ============================================
-- PARTIE 5: PERFORMANCE - Optimisation des politiques RLS
-- ============================================

-- Optimiser site_settings: remplacer auth.uid() par (SELECT auth.uid())
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON public.site_settings;
CREATE POLICY "Authenticated users can update site settings"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

-- Optimiser photo_sections: remplacer auth.uid() par (SELECT auth.uid())
DROP POLICY IF EXISTS "Authenticated users can manage photo sections" ON public.photo_sections;
CREATE POLICY "Authenticated users can manage photo sections"
  ON public.photo_sections
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Optimiser testimonials: remplacer auth.uid() par (SELECT auth.uid())
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON public.testimonials;
CREATE POLICY "Authenticated users can manage testimonials"
  ON public.testimonials
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- ============================================
-- PARTIE 6: PERFORMANCE - Suppression des politiques RLS redondantes
-- ============================================

-- Nettoyage company_logos: supprimer les anciennes politiques redondantes
DROP POLICY IF EXISTS "Lecture publique des logos actifs" ON public.company_logos;
DROP POLICY IF EXISTS "Lecture complète pour authentifiés" ON public.company_logos;
DROP POLICY IF EXISTS "Insertion pour authentifiés" ON public.company_logos;
DROP POLICY IF EXISTS "Modification pour authentifiés" ON public.company_logos;
DROP POLICY IF EXISTS "Suppression pour authentifiés" ON public.company_logos;

-- Garder uniquement les politiques optimisées
-- Les logos actifs sont publics (déjà existante)
-- Les admins peuvent tout voir (logos) (déjà existante)
-- Les admins peuvent créer des logos (déjà existante)
-- Les admins peuvent modifier des logos (déjà existante)
-- Les admins peuvent supprimer des logos (déjà existante)

-- Nettoyage photo_sections: supprimer les anciennes politiques redondantes
DROP POLICY IF EXISTS "Public can read active photo sections" ON public.photo_sections;

-- Nettoyage site_settings: supprimer les anciennes politiques redondantes
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Seuls les admins peuvent modifier les paramètres" ON public.site_settings;

-- Nettoyage testimonials: supprimer les anciennes politiques redondantes
DROP POLICY IF EXISTS "Public can view active testimonials" ON public.testimonials;

-- Nettoyage videos: supprimer les anciennes politiques redondantes
DROP POLICY IF EXISTS "Lecture publique des vidéos actives" ON public.videos;
DROP POLICY IF EXISTS "Admin peut tout modifier videos" ON public.videos;

-- Nettoyage photos: fusionner les politiques SELECT
DROP POLICY IF EXISTS "Lecture complète pour authentifiés" ON public.photos;
-- Garder uniquement "Lecture publique des photos actives"

-- ============================================
-- COMMENTAIRES
-- ============================================
COMMENT ON FUNCTION update_updated_at_column() IS 'Fonction sécurisée pour mettre à jour automatiquement le champ updated_at avec search_path protégé';
COMMENT ON FUNCTION update_photo_sections_updated_at() IS 'Fonction sécurisée pour mettre à jour automatiquement le champ updated_at de photo_sections avec search_path protégé';
COMMENT ON FUNCTION update_site_settings_updated_at() IS 'Fonction sécurisée pour mettre à jour automatiquement le champ updated_at de site_settings avec search_path protégé';

