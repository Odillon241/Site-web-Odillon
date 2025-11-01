-- Création de la table photos
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  theme TEXT,
  month INTEGER CHECK (month >= 1 AND month <= 12),
  year INTEGER,
  active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS photos_month_idx ON photos(month);
CREATE INDEX IF NOT EXISTS photos_theme_idx ON photos(theme);
CREATE INDEX IF NOT EXISTS photos_active_idx ON photos(active);
CREATE INDEX IF NOT EXISTS photos_order_idx ON photos("order");

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Création de la table themes
CREATE TABLE IF NOT EXISTS photo_themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  month INTEGER CHECK (month >= 1 AND month <= 12),
  start_date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertion des thématiques par défaut
INSERT INTO photo_themes (id, name, description, color, month, active) VALUES
  ('octobre-rose', 'Octobre Rose', 'Sensibilisation au cancer du sein', '#FF69B4', 10, true),
  ('novembre-bleu', 'Novembre Bleu', 'Sensibilisation au cancer de la prostate et santé masculine', '#4169E1', 11, true),
  ('decembre-solidarite', 'Décembre Solidaire', 'Solidarité et partage', '#C4D82E', 12, true)
ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_themes ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire les photos actives
CREATE POLICY "Lecture publique des photos actives"
  ON photos FOR SELECT
  USING (active = true);

-- Politique : Seuls les utilisateurs authentifiés peuvent tout lire
CREATE POLICY "Lecture complète pour authentifiés"
  ON photos FOR SELECT
  TO authenticated
  USING (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent insérer
CREATE POLICY "Insertion pour authentifiés"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent modifier
CREATE POLICY "Modification pour authentifiés"
  ON photos FOR UPDATE
  TO authenticated
  USING (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent supprimer
CREATE POLICY "Suppression pour authentifiés"
  ON photos FOR DELETE
  TO authenticated
  USING (true);

-- Politique : Tout le monde peut lire les thématiques actives
CREATE POLICY "Lecture publique des thématiques"
  ON photo_themes FOR SELECT
  USING (active = true);

-- Storage bucket pour les photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-photos', 'hero-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Lecture publique des photos du bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hero-photos');

CREATE POLICY "Upload pour authentifiés"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'hero-photos');

CREATE POLICY "Suppression pour authentifiés"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'hero-photos');

