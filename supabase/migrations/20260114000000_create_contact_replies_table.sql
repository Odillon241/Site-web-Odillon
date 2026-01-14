-- ============================================
-- Migration: Création de la table contact_replies
-- Date: 2026-01-14
-- Description: Table pour stocker les réponses aux messages de contact (via webhook Resend)
-- ============================================

-- Créer la table contact_replies
CREATE TABLE IF NOT EXISTS public.contact_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_message_id UUID NOT NULL REFERENCES public.contact_messages(id) ON DELETE CASCADE,

  -- Métadonnées de l'email
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,

  -- Contenu de l'email
  body_text TEXT,
  body_html TEXT,

  -- Pièces jointes (métadonnées)
  attachments JSONB DEFAULT '[]'::jsonb,

  -- IDs de référence
  resend_email_id TEXT UNIQUE,
  message_id TEXT, -- Message-ID de l'email (pour le threading)
  in_reply_to TEXT, -- In-Reply-To header

  -- Direction de l'email
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS contact_replies_message_id_idx ON public.contact_replies(contact_message_id);
CREATE INDEX IF NOT EXISTS contact_replies_created_at_idx ON public.contact_replies(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_replies_direction_idx ON public.contact_replies(direction);
CREATE INDEX IF NOT EXISTS contact_replies_resend_id_idx ON public.contact_replies(resend_email_id);
CREATE INDEX IF NOT EXISTS contact_replies_from_email_idx ON public.contact_replies(from_email);

-- Trigger pour updated_at
CREATE TRIGGER update_contact_replies_updated_at
  BEFORE UPDATE ON public.contact_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS
ALTER TABLE public.contact_replies ENABLE ROW LEVEL SECURITY;

-- Policy: Permettre l'insertion depuis l'API (webhook)
-- Note: L'insertion se fera via service role depuis le webhook
CREATE POLICY "Service role peut tout faire sur contact_replies"
  ON public.contact_replies
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Les admins authentifiés peuvent tout voir
CREATE POLICY "Les admins peuvent voir toutes les réponses"
  ON public.contact_replies
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Les admins peuvent mettre à jour les réponses
CREATE POLICY "Les admins peuvent mettre à jour les réponses"
  ON public.contact_replies
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Les admins peuvent supprimer les réponses
CREATE POLICY "Les admins peuvent supprimer les réponses"
  ON public.contact_replies
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour obtenir le nombre de réponses d'un message
CREATE OR REPLACE FUNCTION get_contact_message_reply_count(message_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.contact_replies
    WHERE contact_message_id = message_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir la dernière réponse d'un message
CREATE OR REPLACE FUNCTION get_contact_message_last_reply(message_id UUID)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  RETURN (
    SELECT created_at
    FROM public.contact_replies
    WHERE contact_message_id = message_id
    ORDER BY created_at DESC
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMMENTAIRES
-- ============================================
COMMENT ON TABLE public.contact_replies IS 'Réponses et échanges liés aux messages de contact (via webhook Resend)';
COMMENT ON COLUMN public.contact_replies.direction IS 'Direction de l''email: inbound (reçu) ou outbound (envoyé)';
COMMENT ON COLUMN public.contact_replies.attachments IS 'Métadonnées des pièces jointes au format JSON';
COMMENT ON COLUMN public.contact_replies.resend_email_id IS 'ID de l''email dans Resend pour récupération du contenu complet';
