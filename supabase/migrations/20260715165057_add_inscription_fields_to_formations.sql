-- Champs nécessaires aux inscriptions : tarif, capacité et paramétrage du
-- formulaire propre à chaque session.

ALTER TABLE public.formations
    -- NULL = tarif sur demande ; 0 = gratuit.
    ADD COLUMN IF NOT EXISTS prix NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS devise TEXT NOT NULL DEFAULT 'XAF',
    -- NULL = places illimitées.
    ADD COLUMN IF NOT EXISTS places_totales INTEGER,
    -- Compteur dénormalisé, maintenu EXCLUSIVEMENT par le trigger
    -- `trg_formation_inscriptions_places`. Il existe parce que la table des
    -- inscrits n'est pas lisible publiquement : la page publique ne peut donc
    -- pas compter les inscriptions pour afficher les places restantes.
    ADD COLUMN IF NOT EXISTS places_reservees INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS inscriptions_ouvertes BOOLEAN NOT NULL DEFAULT TRUE,
    -- [{ id, label, type, obligatoire, options? }]
    ADD COLUMN IF NOT EXISTS champs_personnalises JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- NULL = pas de rappel automatique avant la session.
    ADD COLUMN IF NOT EXISTS rappel_jours_avant INTEGER DEFAULT 3,
    ADD COLUMN IF NOT EXISTS instructions_paiement TEXT;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formations_places_totales_positif') THEN
        ALTER TABLE public.formations
            ADD CONSTRAINT formations_places_totales_positif
            CHECK (places_totales IS NULL OR places_totales > 0);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formations_places_reservees_positif') THEN
        ALTER TABLE public.formations
            ADD CONSTRAINT formations_places_reservees_positif
            CHECK (places_reservees >= 0);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formations_prix_positif') THEN
        ALTER TABLE public.formations
            ADD CONSTRAINT formations_prix_positif
            CHECK (prix IS NULL OR prix >= 0);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formations_champs_personnalises_array') THEN
        ALTER TABLE public.formations
            ADD CONSTRAINT formations_champs_personnalises_array
            CHECK (jsonb_typeof(champs_personnalises) = 'array');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formations_rappel_jours_avant_valide') THEN
        ALTER TABLE public.formations
            ADD CONSTRAINT formations_rappel_jours_avant_valide
            CHECK (rappel_jours_avant IS NULL OR (rappel_jours_avant >= 0 AND rappel_jours_avant <= 60));
    END IF;
END
$$;

COMMENT ON COLUMN public.formations.prix IS 'NULL = tarif sur demande, 0 = gratuit';
COMMENT ON COLUMN public.formations.places_totales IS 'NULL = places illimitées';
COMMENT ON COLUMN public.formations.places_reservees IS 'Compteur maintenu par trigger uniquement — ne jamais écrire via l''API';
COMMENT ON COLUMN public.formations.champs_personnalises IS 'Définition des champs additionnels du formulaire : [{ id, label, type, obligatoire, options? }]';
COMMENT ON COLUMN public.formations.rappel_jours_avant IS 'Nombre de jours avant date_debut pour l''e-mail de rappel. NULL = aucun rappel';
