-- Création de la table company_logos pour gérer les logos du marquee
CREATE TABLE IF NOT EXISTS company_logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  logo_path TEXT NOT NULL,
  fallback TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#1A9B8E',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS company_logos_active_idx ON company_logos(is_active);
CREATE INDEX IF NOT EXISTS company_logos_order_idx ON company_logos(display_order);

-- Trigger pour updated_at
CREATE TRIGGER update_company_logos_updated_at BEFORE UPDATE ON company_logos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE company_logos ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire les logos actifs
CREATE POLICY "Lecture publique des logos actifs"
  ON company_logos FOR SELECT
  USING (is_active = true);

-- Politique : Seuls les utilisateurs authentifiés peuvent tout lire
CREATE POLICY "Lecture complète pour authentifiés"
  ON company_logos FOR SELECT
  TO authenticated
  USING (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent insérer
CREATE POLICY "Insertion pour authentifiés"
  ON company_logos FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent modifier
CREATE POLICY "Modification pour authentifiés"
  ON company_logos FOR UPDATE
  TO authenticated
  USING (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent supprimer
CREATE POLICY "Suppression pour authentifiés"
  ON company_logos FOR DELETE
  TO authenticated
  USING (true);

-- Insertion des logos par défaut
INSERT INTO company_logos (name, full_name, logo_path, fallback, color, display_order, is_active) VALUES
  ('CDC', 'Caisse des Dépôts et Consignations', '/images/logos/cdc.webp', 'CDC', '#1A9B8E', 1, true),
  ('CAISTAB', 'Caisse de Stabilisation', '/images/logos/caistab.webp', 'CAISTAB', '#C4D82E', 2, true),
  ('SEEG', 'Société d''Énergie et d''Eau du Gabon', '/images/logos/seeg.webp', 'SEEG', '#1A9B8E', 3, true),
  ('UBA', 'United Bank for Africa', '/images/logos/uba.webp', 'UBA', '#C4D82E', 4, true),
  ('SEM', 'Société d''Economie Mixte', '/images/logos/sem.webp', 'SEM', '#1A9B8E', 5, true),
  ('EDG', 'Energie du Gabon', '/images/logos/edg.webp', 'EDG', '#C4D82E', 6, true),
  ('ANAC', 'Agence Nationale de l''Aviation Civile', '/images/logos/anac.webp', 'ANAC', '#1A9B8E', 7, true),
  ('Gabon Télécom', 'Gabon Télécom', '/images/logos/gabon-telecom.webp', 'GT', '#C4D82E', 8, true),
  ('HPG', 'Hôpital Privé de Libreville', '/images/logos/hpg.webp', 'HPG', '#1A9B8E', 9, true),
  ('Trésor', 'Direction Générale du Trésor', '/images/logos/tresor.webp', 'TRÉSOR', '#C4D82E', 10, true),
  ('SGS', 'SGS Gabon', '/images/logos/sgs.webp', 'SGS', '#1A9B8E', 11, true)
ON CONFLICT DO NOTHING;
