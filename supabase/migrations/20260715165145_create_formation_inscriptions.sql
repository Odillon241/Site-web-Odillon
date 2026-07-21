-- Inscriptions aux sessions de formation.
--
-- SÉCURITÉ — à lire avant toute modification des policies ci-dessous.
--
-- Cette table contient des données personnelles (nom, téléphone, société) et
-- des informations de paiement. Contrairement à `newsletter_subscribers`, elle
-- n'a DÉLIBÉRÉMENT aucune policy pour `anon` :
--
--   * Pas de SELECT public  -> la liste des inscrits ne peut pas fuiter.
--   * Pas d'INSERT public   -> la clé anon étant exposée dans le bundle client,
--     une policy d'insertion publique permettrait d'écrire directement sur
--     l'API REST de Supabase, en contournant la validation, le rate-limiting
--     ET le contrôle de capacité.
--
-- Les insertions passent donc exclusivement par `public.inscrire_formation()`
-- (SECURITY DEFINER), appelée depuis la route API avec la clé service-role.

CREATE TABLE IF NOT EXISTS public.formation_inscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    formation_id UUID NOT NULL REFERENCES public.formations(id) ON DELETE CASCADE,

    -- Socle fixe du formulaire
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT,
    societe TEXT,
    fonction TEXT,

    -- Réponses aux champs personnalisés.
    -- Forme : { "<champ_id>": { "label": "...", "type": "...", "valeur": ... } }
    -- Le label est recopié (snapshot) : renommer un champ ne doit pas réécrire
    -- l'historique des inscriptions déjà enregistrées.
    reponses JSONB NOT NULL DEFAULT '{}'::jsonb,

    statut TEXT NOT NULL DEFAULT 'en_attente',
    paiement_statut TEXT NOT NULL DEFAULT 'en_attente',
    mode_paiement TEXT,

    -- Snapshot du tarif au moment de l'inscription : le prix de la session peut
    -- changer ensuite, ce qui ne doit pas altérer ce qui est dû par l'inscrit.
    montant_du NUMERIC(12, 2),
    montant_regle NUMERIC(12, 2) NOT NULL DEFAULT 0,
    devise TEXT NOT NULL DEFAULT 'XAF',
    reference_paiement TEXT,
    notes_admin TEXT,

    -- Traçabilité des e-mails : sert de clé d'idempotence (notamment au cron).
    confirmation_email_envoyee_at TIMESTAMPTZ,
    validation_email_envoyee_at TIMESTAMPTZ,
    rappel_email_envoye_at TIMESTAMPTZ,

    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT formation_inscriptions_statut_valide
        CHECK (statut IN ('en_attente', 'confirmee', 'annulee', 'liste_attente')),
    CONSTRAINT formation_inscriptions_paiement_statut_valide
        CHECK (paiement_statut IN ('en_attente', 'paye', 'partiel', 'rembourse', 'gratuit')),
    -- Ouvert à une intégration en ligne ultérieure : il suffira d'ajouter
    -- 'en_ligne' ici, plus les colonnes provider, sans refonte.
    CONSTRAINT formation_inscriptions_mode_paiement_valide
        CHECK (mode_paiement IS NULL OR mode_paiement IN ('virement', 'especes', 'mobile_money', 'cheque', 'autre')),
    CONSTRAINT formation_inscriptions_montants_positifs
        CHECK ((montant_du IS NULL OR montant_du >= 0) AND montant_regle >= 0),
    CONSTRAINT formation_inscriptions_reponses_objet
        CHECK (jsonb_typeof(reponses) = 'object')
);

-- Une même personne ne peut pas s'inscrire deux fois à la même session.
-- `lower(email)` : la casse ne doit pas permettre de contourner l'unicité.
-- Index partiel : une inscription annulée doit pouvoir être reprise plus tard.
CREATE UNIQUE INDEX IF NOT EXISTS uq_formation_inscriptions_formation_email
    ON public.formation_inscriptions (formation_id, lower(email))
    WHERE statut <> 'annulee';

CREATE INDEX IF NOT EXISTS idx_formation_inscriptions_formation
    ON public.formation_inscriptions(formation_id);
CREATE INDEX IF NOT EXISTS idx_formation_inscriptions_statut
    ON public.formation_inscriptions(statut);
CREATE INDEX IF NOT EXISTS idx_formation_inscriptions_created_at
    ON public.formation_inscriptions(created_at DESC);
-- Sert la requête de sélection du cron de rappel.
CREATE INDEX IF NOT EXISTS idx_formation_inscriptions_rappel
    ON public.formation_inscriptions(statut, rappel_email_envoye_at);

ALTER TABLE public.formation_inscriptions ENABLE ROW LEVEL SECURITY;

-- Seul l'admin authentifié accède aux inscriptions.
-- Aucune policy INSERT : les créations passent par inscrire_formation().
DROP POLICY IF EXISTS "Utilisateurs authentifies lisent les inscriptions" ON public.formation_inscriptions;
CREATE POLICY "Utilisateurs authentifies lisent les inscriptions"
    ON public.formation_inscriptions FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "Utilisateurs authentifies modifient les inscriptions" ON public.formation_inscriptions;
CREATE POLICY "Utilisateurs authentifies modifient les inscriptions"
    ON public.formation_inscriptions FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Utilisateurs authentifies suppriment les inscriptions" ON public.formation_inscriptions;
CREATE POLICY "Utilisateurs authentifies suppriment les inscriptions"
    ON public.formation_inscriptions FOR DELETE TO authenticated USING (TRUE);

-- updated_at
CREATE OR REPLACE FUNCTION public.update_formation_inscriptions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS formation_inscriptions_updated_at ON public.formation_inscriptions;
CREATE TRIGGER formation_inscriptions_updated_at
    BEFORE UPDATE ON public.formation_inscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_formation_inscriptions_updated_at();

COMMENT ON TABLE public.formation_inscriptions IS 'Inscriptions aux sessions de formation. Insertion via inscrire_formation() uniquement (aucune policy INSERT).';
COMMENT ON COLUMN public.formation_inscriptions.reponses IS 'Réponses aux champs personnalisés, label et type recopiés (snapshot)';
COMMENT ON COLUMN public.formation_inscriptions.montant_du IS 'Snapshot du prix de la formation au moment de l''inscription';
COMMENT ON COLUMN public.formation_inscriptions.rappel_email_envoye_at IS 'Clé d''idempotence du cron de rappel : NULL = rappel encore à envoyer';
