-- Migration: Add blog banner settings to site_settings table
-- Execute this in Supabase SQL Editor

-- Add columns for blog banner configuration if they don't exist
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS blog_banner_image_url TEXT,
ADD COLUMN IF NOT EXISTS blog_banner_link TEXT,
ADD COLUMN IF NOT EXISTS show_blog_banner BOOLEAN DEFAULT false;

-- Update the main settings row (assuming id='main' exists) to ensure defaults
UPDATE site_settings 
SET show_blog_banner = false 
WHERE id = 'main' AND show_blog_banner IS NULL;
