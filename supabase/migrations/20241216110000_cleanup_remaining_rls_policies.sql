-- Migration: Nettoyage final des politiques RLS redondantes
-- Date: 2024-12-16
-- Description: Supprime les politiques RLS multiples restantes pour optimiser les performances

-- ============================================
-- PARTIE 1: Nettoyage company_logos
-- ============================================

-- Supprimer toutes les politiques existantes pour company_logos
DROP POLICY IF EXISTS "Les logos actifs sont publics" ON public.company_logos;
DROP POLICY IF EXISTS "Les admins peuvent tout voir (logos)" ON public.company_logos;
DROP POLICY IF EXISTS "Les admins peuvent créer des logos" ON public.company_logos;
DROP POLICY IF EXISTS "Les admins peuvent modifier des logos" ON public.company_logos;
DROP POLICY IF EXISTS "Les admins peuvent supprimer des logos" ON public.company_logos;

-- Créer des politiques uniques et optimisées
CREATE POLICY "company_logos_select_policy"
  ON public.company_logos
  FOR SELECT
  TO public
  USING (is_active = true OR (SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "company_logos_insert_policy"
  ON public.company_logos
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "company_logos_update_policy"
  ON public.company_logos
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "company_logos_delete_policy"
  ON public.company_logos
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

-- ============================================
-- PARTIE 2: Nettoyage photo_sections
-- ============================================

-- Supprimer toutes les politiques existantes pour photo_sections
DROP POLICY IF EXISTS "Les sections actives sont publiques" ON public.photo_sections;
DROP POLICY IF EXISTS "Les admins peuvent tout voir (sections)" ON public.photo_sections;
DROP POLICY IF EXISTS "Les admins peuvent créer des sections" ON public.photo_sections;
DROP POLICY IF EXISTS "Les admins peuvent modifier des sections" ON public.photo_sections;
DROP POLICY IF EXISTS "Les admins peuvent supprimer des sections" ON public.photo_sections;
DROP POLICY IF EXISTS "Authenticated users can manage photo sections" ON public.photo_sections;

-- Créer des politiques uniques et optimisées
CREATE POLICY "photo_sections_select_policy"
  ON public.photo_sections
  FOR SELECT
  TO public
  USING (is_active = true OR (SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "photo_sections_insert_policy"
  ON public.photo_sections
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "photo_sections_update_policy"
  ON public.photo_sections
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "photo_sections_delete_policy"
  ON public.photo_sections
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

-- ============================================
-- PARTIE 3: Nettoyage testimonials
-- ============================================

-- Supprimer toutes les politiques existantes pour testimonials
DROP POLICY IF EXISTS "Les témoignages actifs sont publics" ON public.testimonials;
DROP POLICY IF EXISTS "Les admins peuvent tout voir (testimonials)" ON public.testimonials;
DROP POLICY IF EXISTS "Les admins peuvent créer des témoignages" ON public.testimonials;
DROP POLICY IF EXISTS "Les admins peuvent modifier des témoignages" ON public.testimonials;
DROP POLICY IF EXISTS "Les admins peuvent supprimer des témoignages" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON public.testimonials;

-- Créer des politiques uniques et optimisées
CREATE POLICY "testimonials_select_policy"
  ON public.testimonials
  FOR SELECT
  TO public
  USING (is_active = true OR (SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "testimonials_insert_policy"
  ON public.testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "testimonials_update_policy"
  ON public.testimonials
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "testimonials_delete_policy"
  ON public.testimonials
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

-- ============================================
-- PARTIE 4: Nettoyage videos
-- ============================================

-- Supprimer toutes les politiques existantes pour videos
DROP POLICY IF EXISTS "Les vidéos actives sont publiques" ON public.videos;
DROP POLICY IF EXISTS "Les admins peuvent tout voir (videos)" ON public.videos;
DROP POLICY IF EXISTS "Les admins peuvent créer des vidéos" ON public.videos;
DROP POLICY IF EXISTS "Les admins peuvent modifier des vidéos" ON public.videos;
DROP POLICY IF EXISTS "Les admins peuvent supprimer des vidéos" ON public.videos;

-- Créer des politiques uniques et optimisées
CREATE POLICY "videos_select_policy"
  ON public.videos
  FOR SELECT
  TO public
  USING (is_active = true OR (SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "videos_insert_policy"
  ON public.videos
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "videos_update_policy"
  ON public.videos
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "videos_delete_policy"
  ON public.videos
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

-- ============================================
-- COMMENTAIRES
-- ============================================
COMMENT ON POLICY "company_logos_select_policy" ON public.company_logos IS 'Lecture publique des logos actifs, lecture complète pour authentifiés';
COMMENT ON POLICY "photo_sections_select_policy" ON public.photo_sections IS 'Lecture publique des sections actives, lecture complète pour authentifiés';
COMMENT ON POLICY "testimonials_select_policy" ON public.testimonials IS 'Lecture publique des témoignages actifs, lecture complète pour authentifiés';
COMMENT ON POLICY "videos_select_policy" ON public.videos IS 'Lecture publique des vidéos actives, lecture complète pour authentifiés';

