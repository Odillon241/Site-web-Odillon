-- Migration pour corriger la structure de la table photos

-- Renommer les colonnes pour correspondre à l'application
ALTER TABLE photos RENAME COLUMN src TO url;
ALTER TABLE photos RENAME COLUMN alt TO description;
ALTER TABLE photos RENAME COLUMN active TO is_active;
ALTER TABLE photos RENAME COLUMN "order" TO display_order;

-- Modifier la colonne theme pour être une référence
ALTER TABLE photos RENAME COLUMN theme TO theme_id;

-- Mettre à jour les contraintes
ALTER TABLE photos DROP CONSTRAINT IF EXISTS photos_month_check;
ALTER TABLE photos ADD CONSTRAINT photos_month_check CHECK (month IS NULL OR (month >= 1 AND month <= 12));

-- Recréer les index avec les nouveaux noms
DROP INDEX IF EXISTS photos_theme_idx;
CREATE INDEX photos_theme_id_idx ON photos(theme_id);

DROP INDEX IF EXISTS photos_active_idx;
CREATE INDEX photos_is_active_idx ON photos(is_active);

DROP INDEX IF EXISTS photos_order_idx;
CREATE INDEX photos_display_order_idx ON photos(display_order);

-- Mettre à jour les politiques RLS
DROP POLICY IF EXISTS "Lecture publique des photos actives" ON photos;
CREATE POLICY "Lecture publique des photos actives"
  ON photos FOR SELECT
  USING (is_active = true);

