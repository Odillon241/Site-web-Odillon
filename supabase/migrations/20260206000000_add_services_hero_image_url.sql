-- Add services_hero_image_url column to site_settings
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS services_hero_image_url TEXT DEFAULT NULL;

COMMENT ON COLUMN site_settings.services_hero_image_url IS 'URL de l''image de fond du héros de la page Services';
