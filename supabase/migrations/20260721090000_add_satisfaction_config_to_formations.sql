-- Configuration d'envoi du questionnaire de satisfaction, au niveau de la session.
ALTER TABLE public.formations
    ADD COLUMN IF NOT EXISTS satisfaction_jours_apres INTEGER;

COMMENT ON COLUMN public.formations.satisfaction_jours_apres IS
    'Délai en jours après la fin de session pour l''envoi automatique du questionnaire de satisfaction. NULL = pas d''envoi automatique. Symétrique de rappel_jours_avant.';
