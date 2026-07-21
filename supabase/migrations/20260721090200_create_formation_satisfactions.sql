-- Réponses au questionnaire de satisfaction des sessions de formation.
--
-- SÉCURITÉ — même modèle que formation_inscriptions :
--   * Aucune policy anon      -> ni lecture ni écriture publique directe.
--   * Insertion via RPC       -> public.soumettre_satisfaction() (SECURITY DEFINER),
--     appelée par la route API avec la clé service-role après validation du
--     jeton, du barème et du rate-limiting.
--   * Pas de policy UPDATE     -> une réponse est une déclaration du participant,
--     elle n'est jamais réécrite. Seule la suppression (spam/test) est permise.

CREATE TABLE IF NOT EXISTS public.formation_satisfactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    formation_id UUID NOT NULL REFERENCES public.formations(id) ON DELETE CASCADE,
    -- ON DELETE SET NULL : supprimer une inscription ne doit pas effacer le
    -- retour qualité déjà collecté (il reste rattaché à la session).
    inscription_id UUID REFERENCES public.formation_inscriptions(id) ON DELETE SET NULL,

    -- Note globale : seule obligatoire (1 à 5 étoiles).
    note_globale SMALLINT NOT NULL,
    -- Critères détaillés : facultatifs (1 à 5).
    note_contenu SMALLINT,
    note_formateur SMALLINT,
    note_organisation SMALLINT,
    note_objectifs SMALLINT,
    -- Recommandation NPS : 0 à 10.
    recommandation SMALLINT,

    -- Commentaires libres.
    points_forts TEXT,
    axes_amelioration TEXT,
    commentaire TEXT,

    -- Snapshot de l'identité de l'inscrit (au moment de la réponse), pour que
    -- l'admin sache qui a répondu sans re-joindre l'inscription (qui peut avoir
    -- été supprimée ensuite).
    nom TEXT,
    email TEXT,

    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fs_note_globale_valide CHECK (note_globale BETWEEN 1 AND 5),
    CONSTRAINT fs_note_contenu_valide CHECK (note_contenu IS NULL OR note_contenu BETWEEN 1 AND 5),
    CONSTRAINT fs_note_formateur_valide CHECK (note_formateur IS NULL OR note_formateur BETWEEN 1 AND 5),
    CONSTRAINT fs_note_organisation_valide CHECK (note_organisation IS NULL OR note_organisation BETWEEN 1 AND 5),
    CONSTRAINT fs_note_objectifs_valide CHECK (note_objectifs IS NULL OR note_objectifs BETWEEN 1 AND 5),
    CONSTRAINT fs_recommandation_valide CHECK (recommandation IS NULL OR recommandation BETWEEN 0 AND 10)
);

-- Une seule réponse par inscription (quand rattachée). Index partiel : les
-- éventuelles réponses détachées (inscription supprimée) ne se bloquent pas.
CREATE UNIQUE INDEX IF NOT EXISTS uq_formation_satisfactions_inscription
    ON public.formation_satisfactions (inscription_id)
    WHERE inscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_formation_satisfactions_formation
    ON public.formation_satisfactions (formation_id);
CREATE INDEX IF NOT EXISTS idx_formation_satisfactions_created_at
    ON public.formation_satisfactions (created_at DESC);

ALTER TABLE public.formation_satisfactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Utilisateurs authentifies lisent les satisfactions" ON public.formation_satisfactions;
CREATE POLICY "Utilisateurs authentifies lisent les satisfactions"
    ON public.formation_satisfactions FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "Utilisateurs authentifies suppriment les satisfactions" ON public.formation_satisfactions;
CREATE POLICY "Utilisateurs authentifies suppriment les satisfactions"
    ON public.formation_satisfactions FOR DELETE TO authenticated USING (TRUE);

COMMENT ON TABLE public.formation_satisfactions IS 'Réponses au questionnaire de satisfaction. Insertion via soumettre_satisfaction() uniquement (aucune policy INSERT).';
