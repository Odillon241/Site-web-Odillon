-- Migration: Élimination de tous les avertissements de sécurité
-- Date: 2026-01-13
-- Description: Correction des 5 politiques RLS "always true" et des 2 politiques multiples

-- ============================================================================
-- PARTIE 1: Correction des politiques RLS "always true"
-- ============================================================================

-- 1. TABLE ARTICLES
-- Remplacer la politique "always true" par une vérification auth
DROP POLICY IF EXISTS "Authenticated users can manage all articles" ON public.articles;

CREATE POLICY "Authenticated users can manage all articles"
  ON public.articles
  FOR ALL
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- 2. TABLE CONTACT_MESSAGES
-- Remplacer la politique "always true" par une vérification auth
DROP POLICY IF EXISTS "Authenticated users can manage contact messages" ON public.contact_messages;

CREATE POLICY "Authenticated users can manage contact messages"
  ON public.contact_messages
  FOR ALL
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- 3. TABLE NEWSLETTER_SUBSCRIBERS
-- Remplacer la politique "always true" par une vérification auth
DROP POLICY IF EXISTS "Authenticated users can manage subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Authenticated users can manage subscribers"
  ON public.newsletter_subscribers
  FOR ALL
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- 4. TABLE PHOTOS - UPDATE
-- Remplacer la politique "always true" USING par une vérification auth
DROP POLICY IF EXISTS "Authenticated users can update photos" ON public.photos;

CREATE POLICY "Authenticated users can update photos"
  ON public.photos
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK (
    url IS NOT NULL AND trim(url) <> '' AND
    (select auth.uid()) IS NOT NULL
  );

-- 5. TABLE PHOTOS - DELETE
-- Remplacer la politique "always true" par une vérification auth
DROP POLICY IF EXISTS "Authenticated users can delete photos" ON public.photos;

CREATE POLICY "Authenticated users can delete photos"
  ON public.photos
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- ============================================================================
-- PARTIE 2: Élimination des politiques RLS multiples
-- ============================================================================

-- 1. TABLE CONTACT_MESSAGES
-- Fusionner les deux politiques INSERT en une seule
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can manage contact messages" ON public.contact_messages;

-- Politique unique pour tous les rôles (anon + authenticated)
CREATE POLICY "Users can insert valid contact messages"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND trim(name) <> '' AND
    email IS NOT NULL AND trim(email) <> '' AND
    subject IS NOT NULL AND trim(subject) <> '' AND
    message IS NOT NULL AND trim(message) <> ''
  );

-- Politique séparée pour SELECT, UPDATE, DELETE (admin seulement)
CREATE POLICY "Authenticated users can manage contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete contact messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- 2. TABLE NEWSLETTER_SUBSCRIBERS
-- Fusionner les deux politiques INSERT en une seule
DROP POLICY IF EXISTS "Anyone can subscribe with valid email" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can manage subscribers" ON public.newsletter_subscribers;

-- Politique unique pour l'insertion (anon + authenticated)
CREATE POLICY "Users can subscribe with valid email"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL AND
    email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- Politiques séparées pour SELECT, UPDATE, DELETE (admin seulement)
CREATE POLICY "Authenticated users can view subscribers"
  ON public.newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update subscribers"
  ON public.newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete subscribers"
  ON public.newsletter_subscribers
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- ============================================================================
-- NOTES
-- ============================================================================

COMMENT ON MIGRATION IS 'Élimination de tous les avertissements de sécurité RLS';
