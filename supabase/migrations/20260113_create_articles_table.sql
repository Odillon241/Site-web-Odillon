-- Migration: Create articles table for blog system
-- Execute this in Supabase SQL Editor

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'Actualités',
  author TEXT DEFAULT 'Odillon',
  read_time TEXT DEFAULT '5 min',
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER update_articles_updated_at 
  BEFORE UPDATE ON articles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Public read published articles"
  ON articles FOR SELECT
  USING (is_published = true);

-- Policy: Authenticated users can read all articles
CREATE POLICY "Authenticated read all articles"
  ON articles FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert
CREATE POLICY "Authenticated insert articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update
CREATE POLICY "Authenticated update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Authenticated users can delete
CREATE POLICY "Authenticated delete articles"
  ON articles FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample articles
INSERT INTO articles (title, slug, excerpt, content, category, author, read_time, is_published, published_at) VALUES
(
  'Les clés d''une gouvernance d''entreprise efficace',
  'cles-gouvernance-entreprise-efficace',
  'Découvrez les principes fondamentaux pour établir une gouvernance solide et pérenne au sein de votre organisation.',
  '<p>La gouvernance d''entreprise est un pilier fondamental de la réussite organisationnelle...</p>',
  'Gouvernance',
  'Odillon',
  '5 min',
  true,
  NOW() - INTERVAL '3 days'
),
(
  'Optimiser la gestion des risques en 2026',
  'optimiser-gestion-risques-2026',
  'Les nouvelles approches du management des risques pour anticiper les défis de demain.',
  '<p>Le management des risques évolue constamment...</p>',
  'Risques',
  'Odillon',
  '7 min',
  true,
  NOW() - INTERVAL '8 days'
),
(
  'Capital humain : attirer et fidéliser les talents',
  'capital-humain-attirer-fideliser-talents',
  'Stratégies RH innovantes pour construire des équipes performantes et engagées.',
  '<p>Dans un marché du travail de plus en plus compétitif...</p>',
  'RH',
  'Odillon',
  '6 min',
  true,
  NOW() - INTERVAL '16 days'
);
