-- Migration: Create security_logs table for persistent security event logging
-- Date: 2026-01-21
-- Purpose: Store security events in database for monitoring and analysis

-- ============================================================================
-- SECURITY LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    event_type TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    details TEXT,
    user_agent TEXT,
    request_path TEXT,
    request_method TEXT,
    severity TEXT DEFAULT 'medium' NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.security_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON public.security_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON public.security_logs (ip_address);
CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON public.security_logs (severity);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_security_logs_type_date
    ON public.security_logs (event_type, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read security logs
CREATE POLICY "Admins can view security logs"
    ON public.security_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = current_setting('app.admin_email', true)
        )
        OR
        is_admin()
    );

-- Service role can insert (for API routes)
CREATE POLICY "Service role can insert security logs"
    ON public.security_logs
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Allow authenticated users to insert (fallback)
CREATE POLICY "Authenticated can insert security logs"
    ON public.security_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to log security events (can be called from API routes)
CREATE OR REPLACE FUNCTION public.log_security_event(
    p_event_type TEXT,
    p_ip_address TEXT,
    p_details TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_request_path TEXT DEFAULT NULL,
    p_request_method TEXT DEFAULT NULL,
    p_severity TEXT DEFAULT 'medium',
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.security_logs (
        event_type,
        ip_address,
        details,
        user_agent,
        request_path,
        request_method,
        severity,
        metadata
    ) VALUES (
        p_event_type,
        p_ip_address,
        LEFT(p_details, 1000), -- Limit details to 1000 chars
        LEFT(p_user_agent, 500),
        LEFT(p_request_path, 500),
        p_request_method,
        p_severity,
        p_metadata
    )
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.log_security_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_security_event TO service_role;

-- Function to get recent security events (for admin dashboard)
CREATE OR REPLACE FUNCTION public.get_security_logs(
    p_limit INTEGER DEFAULT 100,
    p_event_type TEXT DEFAULT NULL,
    p_severity TEXT DEFAULT NULL,
    p_since TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    created_at TIMESTAMPTZ,
    event_type TEXT,
    ip_address TEXT,
    details TEXT,
    severity TEXT,
    metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        sl.id,
        sl.created_at,
        sl.event_type,
        sl.ip_address,
        sl.details,
        sl.severity,
        sl.metadata
    FROM public.security_logs sl
    WHERE
        (p_event_type IS NULL OR sl.event_type = p_event_type)
        AND (p_severity IS NULL OR sl.severity = p_severity)
        AND (p_since IS NULL OR sl.created_at >= p_since)
    ORDER BY sl.created_at DESC
    LIMIT p_limit;
END;
$$;

-- Grant execute permission to admin functions
GRANT EXECUTE ON FUNCTION public.get_security_logs TO authenticated;

-- ============================================================================
-- CLEANUP OLD LOGS (optional - run periodically)
-- ============================================================================

-- Function to clean up old security logs (keep last 30 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_security_logs(
    p_retention_days INTEGER DEFAULT 30
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM public.security_logs
    WHERE created_at < now() - (p_retention_days || ' days')::interval;

    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$;

-- Grant execute to service role only
GRANT EXECUTE ON FUNCTION public.cleanup_old_security_logs TO service_role;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.security_logs IS 'Stores security events for monitoring and analysis';
COMMENT ON COLUMN public.security_logs.event_type IS 'Type of security event: sql_injection, email_header_injection, rate_limit, origin_blocked, webhook_invalid, auth_failure';
COMMENT ON COLUMN public.security_logs.severity IS 'Event severity: low, medium, high, critical';
COMMENT ON COLUMN public.security_logs.metadata IS 'Additional JSON metadata for the event';
