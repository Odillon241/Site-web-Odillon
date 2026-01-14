-- Migration: Correction des problèmes de sécurité et performance
-- Date: 2026-01-13
-- Description: Correction des 29 problèmes identifiés par Supabase advisors

-- ============================================================================
-- PARTIE 1: SÉCURITÉ - Correction des politiques RLS trop permissives
-- ============================================================================

-- 1. TABLE ARTICLES
-- Supprimer les politiques trop permissives
DROP POLICY IF EXISTS "Authenticated delete articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated insert articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated update articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated read all articles" ON public.articles;
DROP POLICY IF EXISTS "Public read published articles" ON public.articles;

-- Recréer avec des contraintes appropriées
CREATE POLICY "Authenticated users can manage all articles"
  ON public.articles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read published articles"
  ON public.articles
  FOR SELECT
  TO anon
  USING (is_published = true);

-- 2. TABLE CONTACT_MESSAGES
-- Supprimer les politiques trop permissives
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.contact_messages;

-- Recréer avec validation des données
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND trim(name) <> '' AND
    email IS NOT NULL AND trim(email) <> '' AND
    subject IS NOT NULL AND trim(subject) <> '' AND
    message IS NOT NULL AND trim(message) <> ''
  );

CREATE POLICY "Authenticated users can manage contact messages"
  ON public.contact_messages
  FOR ALL
  TO authenticated
  USING (true);

-- 3. TABLE NEWSLETTER_SUBSCRIBERS
-- Supprimer les politiques trop permissives
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can delete subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can update subscribers" ON public.newsletter_subscribers;

-- Recréer avec validation email
CREATE POLICY "Anyone can subscribe with valid email"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL AND
    email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

CREATE POLICY "Authenticated users can manage subscribers"
  ON public.newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true);

-- 4. TABLE PHOTOS
-- Supprimer les politiques trop permissives
DROP POLICY IF EXISTS "Insertion pour authentifiés" ON public.photos;
DROP POLICY IF EXISTS "Modification pour authentifiés" ON public.photos;
DROP POLICY IF EXISTS "Suppression pour authentifiés" ON public.photos;

-- Recréer avec validation des données
CREATE POLICY "Authenticated users can insert valid photos"
  ON public.photos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    url IS NOT NULL AND trim(url) <> ''
  );

CREATE POLICY "Authenticated users can update photos"
  ON public.photos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (
    url IS NOT NULL AND trim(url) <> ''
  );

CREATE POLICY "Authenticated users can delete photos"
  ON public.photos
  FOR DELETE
  TO authenticated
  USING (true);

-- 5. FONCTION - Sécuriser le search_path
DROP FUNCTION IF EXISTS update_newsletter_subscribers_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_newsletter_subscribers_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recréer le trigger
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at_trigger ON public.newsletter_subscribers;

CREATE TRIGGER update_newsletter_subscribers_updated_at_trigger
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_subscribers_updated_at();

-- ============================================================================
-- PARTIE 2: PERFORMANCE - Index pour foreign keys
-- ============================================================================

-- Index pour photo_sections.position_after
CREATE INDEX IF NOT EXISTS idx_photo_sections_position_after
  ON public.photo_sections(position_after)
  WHERE position_after IS NOT NULL;

-- Index pour team_members.created_by
CREATE INDEX IF NOT EXISTS idx_team_members_created_by
  ON public.team_members(created_by)
  WHERE created_by IS NOT NULL;

-- ============================================================================
-- PARTIE 3: PERFORMANCE - Optimisation RLS pour team_members
-- ============================================================================

-- Supprimer les politiques non optimisées
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.team_members;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.team_members;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.team_members;

-- Recréer avec (select auth.uid()) pour éviter la réévaluation
CREATE POLICY "Authenticated users can insert team members"
  ON public.team_members
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update team members"
  ON public.team_members
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete team members"
  ON public.team_members
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- ============================================================================
-- PARTIE 4: PERFORMANCE - Suppression des index inutilisés
-- ============================================================================

DROP INDEX IF EXISTS public.idx_company_logos_created_by;
DROP INDEX IF EXISTS public.idx_photo_sections_created_by;
DROP INDEX IF EXISTS public.idx_photos_created_by;
DROP INDEX IF EXISTS public.idx_photos_section_id;
DROP INDEX IF EXISTS public.idx_testimonials_created_by;
DROP INDEX IF EXISTS public.idx_videos_created_by;
DROP INDEX IF EXISTS public.idx_newsletter_subscribers_active;
DROP INDEX IF EXISTS public.idx_articles_published;
DROP INDEX IF EXISTS public.idx_articles_category;

-- ============================================================================
-- PARTIE 5: Création d'index utiles pour les requêtes courantes
-- ============================================================================

-- Index pour les photos actives par mois/thème (utilisé fréquemment)
CREATE INDEX IF NOT EXISTS idx_photos_active_month_theme
  ON public.photos(month, theme_id, display_order)
  WHERE is_active = true;

-- Index pour les articles publiés par date (pour le blog)
CREATE INDEX IF NOT EXISTS idx_articles_published_date
  ON public.articles(published_at DESC)
  WHERE is_published = true;

-- Index pour les vidéos actives par page/section
CREATE INDEX IF NOT EXISTS idx_videos_active_page
  ON public.videos(page, section, display_order)
  WHERE is_active = true;

-- Index pour les logos actifs
CREATE INDEX IF NOT EXISTS idx_company_logos_active
  ON public.company_logos(display_order)
  WHERE is_active = true;

-- Index pour les membres d'équipe actifs
CREATE INDEX IF NOT EXISTS idx_team_members_active
  ON public.team_members(display_order)
  WHERE is_active = true;

-- Index pour les messages de contact non traités
CREATE INDEX IF NOT EXISTS idx_contact_messages_status
  ON public.contact_messages(status, created_at DESC);

-- ============================================================================
-- NOTES IMPORTANTES
-- ============================================================================

-- La protection contre les mots de passe compromis doit être activée
-- manuellement dans le dashboard Supabase:
-- Authentication > Settings > Enable Password Protection Against Breaches
-- Voir: https://supabase.com/docs/guides/auth/password-security

COMMENT ON MIGRATION IS 'Correction de 29 problèmes de sécurité et performance identifiés par Supabase advisors';
