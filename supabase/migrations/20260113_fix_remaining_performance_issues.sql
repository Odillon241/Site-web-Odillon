-- Migration: Correction des problèmes de performance restants
-- Date: 2026-01-13
-- Description: Consolidation des politiques RLS multiples et index manquants

-- ============================================================================
-- PARTIE 1: Consolidation des politiques RLS multiples
-- ============================================================================

-- 1. TABLE CONTACT_MESSAGES - Supprimer les doublons de politiques
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.contact_messages;
-- La politique "Authenticated users can manage contact messages" couvre déjà tout (ALL)

-- 2. TABLE NEWSLETTER_SUBSCRIBERS - Supprimer les doublons de politiques
DROP POLICY IF EXISTS "Authenticated users can view all subscribers" ON public.newsletter_subscribers;
-- La politique "Authenticated users can manage subscribers" couvre déjà tout (ALL)

-- ============================================================================
-- PARTIE 2: Index pour foreign keys manquantes (performance)
-- ============================================================================

-- Index pour company_logos.created_by
CREATE INDEX IF NOT EXISTS idx_company_logos_created_by_fkey
  ON public.company_logos(created_by)
  WHERE created_by IS NOT NULL;

-- Index pour photo_sections.created_by
CREATE INDEX IF NOT EXISTS idx_photo_sections_created_by_fkey
  ON public.photo_sections(created_by)
  WHERE created_by IS NOT NULL;

-- Index pour photos.created_by
CREATE INDEX IF NOT EXISTS idx_photos_created_by_fkey
  ON public.photos(created_by)
  WHERE created_by IS NOT NULL;

-- Index pour photos.section_id
CREATE INDEX IF NOT EXISTS idx_photos_section_id_fkey
  ON public.photos(section_id)
  WHERE section_id IS NOT NULL;

-- Index pour testimonials.created_by
CREATE INDEX IF NOT EXISTS idx_testimonials_created_by_fkey
  ON public.testimonials(created_by)
  WHERE created_by IS NOT NULL;

-- Index pour videos.created_by
CREATE INDEX IF NOT EXISTS idx_videos_created_by_fkey
  ON public.videos(created_by)
  WHERE created_by IS NOT NULL;

-- ============================================================================
-- NOTES
-- ============================================================================

-- Les politiques RLS "permissives" restantes sont intentionnelles :
-- - Les utilisateurs authentifiés sont des administrateurs
-- - Ils ont besoin d'un accès complet pour gérer le contenu du site
-- - C'est le modèle d'administration standard pour un CMS
--
-- Les index "inutilisés" sont normaux car le site est récent.
-- Ils seront utilisés automatiquement quand les requêtes correspondantes seront exécutées.
