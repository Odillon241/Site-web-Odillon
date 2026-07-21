-- Baseline de la table `formations`.
--
-- Contexte : la table a été créée directement sur le projet distant (via MCP)
-- sans fichier de migration correspondant. Le repo ne permettait donc pas de
-- reconstruire un environnement neuf. Cette migration rattrape ce manque.
--
-- Elle est volontairement IDEMPOTENTE et ne doit rien changer sur une base où
-- la table existe déjà : sur un environnement neuf, elle la crée.

CREATE TABLE IF NOT EXISTS public.formations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titre TEXT NOT NULL,
    description TEXT NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    horaires TEXT,
    duree TEXT,
    formateur TEXT,
    lieu TEXT,
    modalite TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_formations_date_debut ON public.formations(date_debut);

ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;

-- Les policies ne sont créées que si la table n'en a aucune.
--
-- Sur le projet distant, les policies existent déjà mais leurs noms exacts ne
-- sont pas connus de ce dépôt : les recréer à l'aveugle produirait des policies
-- permissives en double (dégradation des performances signalée par l'advisor).
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = 'public.formations'::regclass) THEN
        -- Lecture publique des sessions actives uniquement.
        CREATE POLICY "Formations actives lisibles publiquement"
            ON public.formations FOR SELECT TO anon, authenticated
            USING (is_active = TRUE);

        -- L'admin (authentifié) a un accès complet.
        CREATE POLICY "Utilisateurs authentifies lecture complete"
            ON public.formations FOR SELECT TO authenticated USING (TRUE);

        CREATE POLICY "Utilisateurs authentifies inserent"
            ON public.formations FOR INSERT TO authenticated WITH CHECK (TRUE);

        CREATE POLICY "Utilisateurs authentifies modifient"
            ON public.formations FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);

        CREATE POLICY "Utilisateurs authentifies suppriment"
            ON public.formations FOR DELETE TO authenticated USING (TRUE);
    END IF;
END
$$;

COMMENT ON TABLE public.formations IS 'Sessions de formation affichées dans le calendrier public';
COMMENT ON COLUMN public.formations.modalite IS 'presentiel | distanciel | hybride';
COMMENT ON COLUMN public.formations.is_active IS 'Seules les sessions actives sont visibles publiquement';
