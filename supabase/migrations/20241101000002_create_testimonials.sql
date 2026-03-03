-- Création de la table testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS testimonials_active_idx ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS testimonials_order_idx ON testimonials(display_order);

-- Trigger pour updated_at
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Politique : Lecture publique des témoignages actifs
CREATE POLICY "Public can view active testimonials"
  ON testimonials
  FOR SELECT
  USING (is_active = true);

-- Politique : Les utilisateurs authentifiés peuvent tout faire
CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials
  FOR ALL
  USING (auth.role() = 'authenticated');

