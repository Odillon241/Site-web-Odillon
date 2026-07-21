-- Durcissement des fonctions du domaine inscriptions, suite aux
-- avertissements de l'advisor Supabase.
--
-- Leçon à retenir pour toute nouvelle fonction : Supabase accorde EXECUTE à
-- `anon` et `authenticated` par défaut sur les fonctions du schéma public.
-- Un `REVOKE ... FROM PUBLIC` seul NE SUFFIT PAS — il faut révoquer
-- explicitement chaque rôle. Sans cela, une fonction SECURITY DEFINER devient
-- appelable par tout visiteur via /rest/v1/rpc/<nom>.

-- search_path figé : un search_path modifiable permettrait à un rôle appelant
-- de détourner la résolution des noms de tables.
CREATE OR REPLACE FUNCTION public.formation_place_consommee(p_statut TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
SET search_path = public, pg_temp
AS $$
    SELECT p_statut IN ('en_attente', 'confirmee');
$$;

-- Les fonctions de trigger n'ont aucune raison d'être appelables via l'API.
-- Révoquer EXECUTE ne les empêche pas de se déclencher : un trigger s'exécute
-- avec les droits du propriétaire de la table, pas ceux de l'appelant.
REVOKE ALL ON FUNCTION public.maj_places_reservees() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_formation_inscriptions_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.formation_place_consommee(TEXT) FROM PUBLIC, anon;

-- Fonction de maintenance : réservée au service-role.
REVOKE ALL ON FUNCTION public.recalculer_places_reservees() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recalculer_places_reservees() TO service_role;

-- formation_place_consommee reste accessible à authenticated : la requête de
-- réconciliation des compteurs côté admin s'en sert.
GRANT EXECUTE ON FUNCTION public.formation_place_consommee(TEXT) TO authenticated, service_role;
