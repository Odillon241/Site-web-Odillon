-- Traçabilité du questionnaire de satisfaction, côté inscription.
--
-- satisfaction_token : lien nominatif porté dans l'e-mail de sollicitation.
-- C'est LUI qui autorise la soumission publique (sans authentification) et qui
-- rattache la réponse à un participant précis, sans jamais exposer la liste des
-- inscrits. Il ne doit apparaître que dans l'URL envoyée à l'intéressé.
ALTER TABLE public.formation_inscriptions
    ADD COLUMN IF NOT EXISTS satisfaction_token UUID NOT NULL DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS satisfaction_email_envoye_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS satisfaction_repondu_at TIMESTAMPTZ;

-- Le token sert de clé de résolution publique : il doit être unique.
CREATE UNIQUE INDEX IF NOT EXISTS uq_formation_inscriptions_satisfaction_token
    ON public.formation_inscriptions (satisfaction_token);

-- Sert la requête de sélection du cron de satisfaction.
CREATE INDEX IF NOT EXISTS idx_formation_inscriptions_satisfaction
    ON public.formation_inscriptions (statut, satisfaction_email_envoye_at);

COMMENT ON COLUMN public.formation_inscriptions.satisfaction_token IS
    'Jeton nominatif porté dans l''e-mail de satisfaction ; autorise la soumission publique de la réponse. Ne jamais exposer hors de l''URL envoyée à l''inscrit.';
COMMENT ON COLUMN public.formation_inscriptions.satisfaction_email_envoye_at IS
    'Clé d''idempotence du cron de satisfaction : NULL = sollicitation encore à envoyer.';
COMMENT ON COLUMN public.formation_inscriptions.satisfaction_repondu_at IS
    'Horodatage de la réponse au questionnaire ; NON NULL = déjà répondu (anti-double soumission).';
