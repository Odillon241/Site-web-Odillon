-- Migration: Create news_cache table for storing fetched news
-- Description: Caches news from RSS feeds to reduce API calls and improve performance

-- Create the news_cache table
CREATE TABLE IF NOT EXISTS public.news_cache (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('juridique', 'finance', 'rh', 'gouvernance', 'economie', 'afrique')),
    url TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    summary TEXT,
    cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_news_cache_cached_at ON public.news_cache(cached_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_cache_category ON public.news_cache(category);
CREATE INDEX IF NOT EXISTS idx_news_cache_published_at ON public.news_cache(published_at DESC);

-- Enable RLS
ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;

-- Public can read all cached news
CREATE POLICY "Anyone can view cached news"
    ON public.news_cache
    FOR SELECT
    TO public
    USING (true);

-- Service role can insert/update/delete (for API routes)
CREATE POLICY "Service role can manage news cache"
    ON public.news_cache
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Authenticated users (admin) can also manage news
CREATE POLICY "Authenticated users can manage news cache"
    ON public.news_cache
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.news_cache IS 'Cache for news items fetched from RSS feeds. Auto-expires after 15 minutes.';

-- Create function to clean old cache entries (older than 24 hours)
CREATE OR REPLACE FUNCTION clean_old_news_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.news_cache
    WHERE cached_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION clean_old_news_cache() TO service_role;
GRANT EXECUTE ON FUNCTION clean_old_news_cache() TO authenticated;

-- Add news ticker settings to site_settings table
DO $$
BEGIN
    -- Add show_news_ticker column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'site_settings'
        AND column_name = 'show_news_ticker'
    ) THEN
        ALTER TABLE public.site_settings ADD COLUMN show_news_ticker BOOLEAN DEFAULT true;
    END IF;

    -- Add news_ticker_speed column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'site_settings'
        AND column_name = 'news_ticker_speed'
    ) THEN
        ALTER TABLE public.site_settings ADD COLUMN news_ticker_speed INTEGER DEFAULT 50;
    END IF;

    -- Add news_auto_refresh column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'site_settings'
        AND column_name = 'news_auto_refresh'
    ) THEN
        ALTER TABLE public.site_settings ADD COLUMN news_auto_refresh BOOLEAN DEFAULT true;
    END IF;

    -- Add news_refresh_interval column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'site_settings'
        AND column_name = 'news_refresh_interval'
    ) THEN
        ALTER TABLE public.site_settings ADD COLUMN news_refresh_interval INTEGER DEFAULT 15;
    END IF;
END $$;
