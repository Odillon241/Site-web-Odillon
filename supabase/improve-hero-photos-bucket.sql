-- Script d'amélioration du bucket hero-photos
-- À exécuter dans le SQL Editor de Supabase

-- 1. Ajouter une limite de taille de fichier (10 MB)
UPDATE storage.buckets 
SET file_size_limit = 10485760  -- 10 MB en bytes
WHERE id = 'hero-photos';

-- 2. Restreindre les types MIME aux formats d'image uniquement
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE id = 'hero-photos';

-- 3. Vérifier la configuration mise à jour
SELECT 
  id,
  name,
  public,
  file_size_limit,
  ROUND(file_size_limit / 1048576.0, 2) as file_size_limit_mb,
  allowed_mime_types,
  created_at,
  updated_at
FROM storage.buckets 
WHERE id = 'hero-photos';

-- Résultat attendu :
-- - file_size_limit: 10485760 (10 MB)
-- - allowed_mime_types: {image/jpeg,image/png,image/webp}
