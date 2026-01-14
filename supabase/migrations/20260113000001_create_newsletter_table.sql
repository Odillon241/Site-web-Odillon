-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    unsubscribe_token TEXT DEFAULT gen_random_uuid()::TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);

-- Create index on is_active for filtering active subscribers
CREATE INDEX idx_newsletter_subscribers_active ON public.newsletter_subscribers(is_active);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
    ON public.newsletter_subscribers
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy: Only authenticated users can view all subscribers (admin)
CREATE POLICY "Authenticated users can view all subscribers"
    ON public.newsletter_subscribers
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Only authenticated users can update subscribers (admin)
CREATE POLICY "Authenticated users can update subscribers"
    ON public.newsletter_subscribers
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Only authenticated users can delete subscribers (admin)
CREATE POLICY "Authenticated users can delete subscribers"
    ON public.newsletter_subscribers
    FOR DELETE
    TO authenticated
    USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_newsletter_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER newsletter_subscribers_updated_at
    BEFORE UPDATE ON public.newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_newsletter_subscribers_updated_at();

-- Add comment to table
COMMENT ON TABLE public.newsletter_subscribers IS 'Stores newsletter subscription data';
COMMENT ON COLUMN public.newsletter_subscribers.email IS 'Subscriber email address (unique)';
COMMENT ON COLUMN public.newsletter_subscribers.is_active IS 'Whether the subscription is active';
COMMENT ON COLUMN public.newsletter_subscribers.unsubscribe_token IS 'Unique token for unsubscribe links';
