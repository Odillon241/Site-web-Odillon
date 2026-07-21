-- Soumission publique d'une réponse de satisfaction : résolution du jeton et
-- insertion, atomiques.
--
-- Le SELECT ... FOR UPDATE verrouille l'inscription le temps de vérifier
-- qu'aucune réponse n'a déjà été enregistrée, puis d'insérer et de marquer la
-- ligne comme répondue. Deux soumissions concurrentes avec le même jeton ne
-- peuvent donc pas créer deux réponses.

CREATE OR REPLACE FUNCTION public.soumettre_satisfaction(
    p_token UUID,
    p_note_globale INTEGER,
    p_note_contenu INTEGER DEFAULT NULL,
    p_note_formateur INTEGER DEFAULT NULL,
    p_note_organisation INTEGER DEFAULT NULL,
    p_note_objectifs INTEGER DEFAULT NULL,
    p_recommandation INTEGER DEFAULT NULL,
    p_points_forts TEXT DEFAULT NULL,
    p_axes_amelioration TEXT DEFAULT NULL,
    p_commentaire TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS public.formation_satisfactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_inscription public.formation_inscriptions%ROWTYPE;
    v_satisfaction public.formation_satisfactions%ROWTYPE;
BEGIN
    SELECT * INTO v_inscription
      FROM public.formation_inscriptions
     WHERE satisfaction_token = p_token
       FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'TOKEN_INVALIDE' USING ERRCODE = 'P0002';
    END IF;

    IF v_inscription.satisfaction_repondu_at IS NOT NULL THEN
        RAISE EXCEPTION 'DEJA_REPONDU' USING ERRCODE = 'P0001';
    END IF;

    INSERT INTO public.formation_satisfactions (
        formation_id, inscription_id,
        note_globale, note_contenu, note_formateur, note_organisation, note_objectifs,
        recommandation, points_forts, axes_amelioration, commentaire,
        nom, email, ip_address, user_agent
    ) VALUES (
        v_inscription.formation_id, v_inscription.id,
        p_note_globale, p_note_contenu, p_note_formateur, p_note_organisation, p_note_objectifs,
        p_recommandation, p_points_forts, p_axes_amelioration, p_commentaire,
        v_inscription.nom, v_inscription.email, p_ip_address, p_user_agent
    )
    RETURNING * INTO v_satisfaction;

    UPDATE public.formation_inscriptions
       SET satisfaction_repondu_at = NOW()
     WHERE id = v_inscription.id;

    RETURN v_satisfaction;
END;
$$;

-- SECURITY DEFINER : appelable uniquement par la route API (service-role).
-- Supabase accorde EXECUTE à anon/authenticated par défaut : révocation
-- explicite de chaque rôle, sans quoi la fonction serait appelable via
-- /rest/v1/rpc/soumettre_satisfaction avec la clé anon.
REVOKE ALL ON FUNCTION public.soumettre_satisfaction(UUID, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.soumettre_satisfaction(UUID, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;

COMMENT ON FUNCTION public.soumettre_satisfaction IS
    'Soumission publique atomique d''une réponse de satisfaction via le jeton d''inscription. Erreurs : P0001 DEJA_REPONDU, P0002 TOKEN_INVALIDE.';
