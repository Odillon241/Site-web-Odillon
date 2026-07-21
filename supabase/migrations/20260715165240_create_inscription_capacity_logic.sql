-- Logique de capacité : compteur de places et inscription sérialisée.

-- ---------------------------------------------------------------------------
-- Quels statuts consomment une place
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.formation_place_consommee(p_statut TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
SET search_path = public, pg_temp
AS $$
    SELECT p_statut IN ('en_attente', 'confirmee');
$$;

COMMENT ON FUNCTION public.formation_place_consommee(TEXT) IS
    'Une inscription annulée ou en liste d''attente ne consomme pas de place';

-- ---------------------------------------------------------------------------
-- Le trigger est le SEUL propriétaire de formations.places_reservees
-- ---------------------------------------------------------------------------
--
-- Il ne lève jamais d'exception : un admin qui repasse une inscription de
-- 'annulee' à 'confirmee' sur une session pleine dépasse volontairement la
-- capacité, et ce cas doit rester possible. Le refus de dépassement est du
-- ressort de inscrire_formation(), qui ne concerne que le public.

CREATE OR REPLACE FUNCTION public.maj_places_reservees()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF public.formation_place_consommee(NEW.statut) THEN
            UPDATE public.formations
               SET places_reservees = places_reservees + 1
             WHERE id = NEW.formation_id;
        END IF;
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        IF public.formation_place_consommee(OLD.statut) THEN
            UPDATE public.formations
               SET places_reservees = GREATEST(0, places_reservees - 1)
             WHERE id = OLD.formation_id;
        END IF;
        RETURN OLD;

    ELSIF TG_OP = 'UPDATE' THEN
        IF public.formation_place_consommee(OLD.statut)
           AND NOT public.formation_place_consommee(NEW.statut) THEN
            UPDATE public.formations
               SET places_reservees = GREATEST(0, places_reservees - 1)
             WHERE id = NEW.formation_id;

        ELSIF NOT public.formation_place_consommee(OLD.statut)
              AND public.formation_place_consommee(NEW.statut) THEN
            UPDATE public.formations
               SET places_reservees = places_reservees + 1
             WHERE id = NEW.formation_id;
        END IF;
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_formation_inscriptions_places ON public.formation_inscriptions;
CREATE TRIGGER trg_formation_inscriptions_places
    AFTER INSERT OR DELETE OR UPDATE OF statut ON public.formation_inscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.maj_places_reservees();

-- ---------------------------------------------------------------------------
-- Inscription publique : vérification de capacité et insertion, atomiques
-- ---------------------------------------------------------------------------
--
-- Le SELECT ... FOR UPDATE est le cœur du mécanisme. Sans lui, deux visiteurs
-- qui s'inscrivent en même temps sur la dernière place liraient tous les deux
-- « il reste 1 place » avant d'insérer : la session finirait en surbooking.
-- Le verrou sérialise les inscriptions D'UNE MÊME session ; deux sessions
-- différentes ne se bloquent pas l'une l'autre.

CREATE OR REPLACE FUNCTION public.inscrire_formation(
    p_formation_id UUID,
    p_nom TEXT,
    p_email TEXT,
    p_telephone TEXT DEFAULT NULL,
    p_societe TEXT DEFAULT NULL,
    p_fonction TEXT DEFAULT NULL,
    p_mode_paiement TEXT DEFAULT NULL,
    p_reponses JSONB DEFAULT '{}'::jsonb,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS public.formation_inscriptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_formation public.formations%ROWTYPE;
    v_inscription public.formation_inscriptions%ROWTYPE;
    v_paiement_statut TEXT;
BEGIN
    SELECT * INTO v_formation
      FROM public.formations
     WHERE id = p_formation_id
       FOR UPDATE;

    IF NOT FOUND OR NOT v_formation.is_active THEN
        RAISE EXCEPTION 'FORMATION_INTROUVABLE' USING ERRCODE = 'P0002';
    END IF;

    IF NOT v_formation.inscriptions_ouvertes THEN
        RAISE EXCEPTION 'INSCRIPTIONS_FERMEES' USING ERRCODE = 'P0003';
    END IF;

    IF v_formation.date_debut < CURRENT_DATE THEN
        RAISE EXCEPTION 'SESSION_PASSEE' USING ERRCODE = 'P0004';
    END IF;

    IF v_formation.places_totales IS NOT NULL
       AND v_formation.places_reservees >= v_formation.places_totales THEN
        RAISE EXCEPTION 'COMPLET' USING ERRCODE = 'P0001';
    END IF;

    -- prix NULL (tarif sur demande) reste 'en_attente' : seul un prix
    -- explicitement nul rend l'inscription gratuite.
    v_paiement_statut := CASE WHEN v_formation.prix = 0 THEN 'gratuit' ELSE 'en_attente' END;

    INSERT INTO public.formation_inscriptions (
        formation_id, nom, email, telephone, societe, fonction,
        reponses, mode_paiement, montant_du, devise, paiement_statut,
        ip_address, user_agent
    ) VALUES (
        p_formation_id, p_nom, p_email, p_telephone, p_societe, p_fonction,
        COALESCE(p_reponses, '{}'::jsonb), p_mode_paiement, v_formation.prix,
        COALESCE(v_formation.devise, 'XAF'), v_paiement_statut,
        p_ip_address, p_user_agent
    )
    RETURNING * INTO v_inscription;

    RETURN v_inscription;
END;
$$;

-- La fonction est SECURITY DEFINER : elle ne doit être appelable que par la
-- route API (service-role), jamais depuis le client avec la clé anon.
REVOKE ALL ON FUNCTION public.inscrire_formation(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.inscrire_formation(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.inscrire_formation(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.inscrire_formation(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT) TO service_role;

COMMENT ON FUNCTION public.inscrire_formation IS
    'Inscription publique atomique : verrouille la session, vérifie la capacité, insère. Erreurs : P0001 COMPLET, P0002 FORMATION_INTROUVABLE, P0003 INSCRIPTIONS_FERMEES, P0004 SESSION_PASSEE.';

-- ---------------------------------------------------------------------------
-- Réconciliation du compteur (maintenance)
-- ---------------------------------------------------------------------------
-- Le trigger couvre les écritures via l'application, mais pas un UPDATE
-- manuel de places_reservees dans Supabase Studio. Cette fonction recale.

CREATE OR REPLACE FUNCTION public.recalculer_places_reservees()
RETURNS TABLE (formation_id UUID, ancien INTEGER, nouveau INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH reel AS (
        SELECT f.id,
               f.places_reservees AS ancien,
               COUNT(i.id)::INTEGER AS nouveau
          FROM public.formations f
          LEFT JOIN public.formation_inscriptions i
                 ON i.formation_id = f.id
                AND public.formation_place_consommee(i.statut)
         GROUP BY f.id, f.places_reservees
    ),
    maj AS (
        UPDATE public.formations f
           SET places_reservees = r.nouveau
          FROM reel r
         WHERE f.id = r.id AND f.places_reservees <> r.nouveau
        RETURNING f.id
    )
    SELECT r.id, r.ancien, r.nouveau FROM reel r WHERE r.id IN (SELECT id FROM maj);
END;
$$;

REVOKE ALL ON FUNCTION public.recalculer_places_reservees() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.recalculer_places_reservees() FROM anon;
GRANT EXECUTE ON FUNCTION public.recalculer_places_reservees() TO service_role;
