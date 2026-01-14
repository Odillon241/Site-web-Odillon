-- ============================================
-- Migration: Création de la table contact_messages
-- Date: 2026-01-13
-- Description: Table pour stocker les messages de contact du site
-- ============================================

-- Créer la table contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_email_idx ON public.contact_messages(email);

-- Trigger pour updated_at
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Permettre l'insertion publique (formulaire de contact)
CREATE POLICY "Tout le monde peut envoyer un message de contact"
  ON public.contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Les admins authentifiés peuvent tout voir
CREATE POLICY "Les admins peuvent voir tous les messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Les admins peuvent mettre à jour les messages (changer le statut, etc.)
CREATE POLICY "Les admins peuvent mettre à jour les messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Les admins peuvent supprimer les messages
CREATE POLICY "Les admins peuvent supprimer les messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- COMMENTAIRES
-- ============================================
COMMENT ON TABLE public.contact_messages IS 'Messages de contact envoyés via le formulaire du site';
COMMENT ON COLUMN public.contact_messages.status IS 'Statut du message: new, read, replied, archived';
