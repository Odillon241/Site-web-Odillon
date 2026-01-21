# Security Audit Report - Odillon Website

**Date**: January 21, 2026
**Severity**: HIGH
**Status**: Action Required

---

## 1. CRITICAL: API Keys Exposed in Git History

### Issue
The `.env` file containing production API keys was committed to the git repository in the following commits:
- `244d6ae` - Initial commit with secrets
- `0a2e8ff` - Updated secrets

### Exposed Credentials (MUST BE ROTATED IMMEDIATELY)

| Key | Type | Risk Level |
|-----|------|------------|
| `SUPABASE_SERVICE_ROLE_KEY` | JWT Service Role Token | **CRITICAL** - Full database access |
| `SUPABASE_ACCESS_TOKEN` | Management API Token | **CRITICAL** - Account management access |
| `RESEND_API_KEY` | Email API Key | **HIGH** - Can send emails as your domain |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon Key | MEDIUM - Limited by RLS |

### Required Actions

1. **Supabase Keys Rotation**
   ```bash
   # Login to Supabase Dashboard
   # Go to: Project Settings > API
   # Rotate both anon and service_role keys
   # Update .env with new keys
   ```

2. **Supabase Access Token Rotation**
   ```bash
   # Go to: https://supabase.com/dashboard/account/tokens
   # Revoke the exposed token: sbp_d7fc157412ebb45c8370ae42f59ca1c41a4ec58b
   # Generate a new token
   ```

3. **Resend API Key Rotation**
   ```bash
   # Go to: https://resend.com/api-keys
   # Revoke the exposed key: re_fGV8rTKP_...
   # Generate a new API key
   ```

4. **Review Database for Unauthorized Access**
   - Check Supabase logs for unusual activity
   - Review `auth.users` for new unauthorized accounts
   - Check `contact_messages` and `contact_replies` for spam/abuse

### Prevention Measures (Already Implemented)
- `.env` is now in `.gitignore`
- `.env.production` is also ignored
- Secrets template (`.env.example`) contains only placeholder values

---

## 2. Webhook Security Configuration

### Current Status
The `RESEND_WEBHOOK_SECRET` is optional, which is insecure for production.

### Location
`app/api/webhooks/email-received/route.ts:163-187`

### Recommendation
The webhook secret has been made **mandatory in production** (see changes below).

---

## 3. Security Logging

### Current Implementation
- In-memory logging via `logSecurityEvent()`
- Maximum 1000 entries (rotates)
- Event types: `sql_injection`, `email_header_injection`, `rate_limit`, `origin_blocked`, `webhook_invalid`

### Recommended Improvements
1. Persist security events to Supabase `security_logs` table
2. Set up real-time alerts for high-severity events
3. Integrate with monitoring service (Sentry, DataDog)

---

## 4. Rate Limiting

### Current Implementation
- In-memory Map-based store
- Per-IP tracking with automatic cleanup

### Limitations
- Not suitable for multi-instance deployments (Vercel, etc.)
- State lost on server restart

### Recommended Upgrade
Use Upstash Redis or Vercel KV for production:
```typescript
// Example with Upstash
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '60 s'),
})
```

---

## 5. Security Checklist

### Immediate Actions (Priority: HIGH)
- [ ] Rotate all exposed Supabase keys
- [ ] Rotate Resend API key
- [ ] Revoke Supabase access token
- [ ] Review database logs for unauthorized access
- [ ] Add `RESEND_WEBHOOK_SECRET` to production environment

### Short-term Actions (Priority: MEDIUM)
- [ ] Implement database-backed security logging
- [ ] Set up monitoring alerts for security events
- [ ] Upgrade rate limiting to Redis for production

### Long-term Actions (Priority: LOW)
- [ ] Schedule quarterly security audits
- [ ] Add automated security testing to CI/CD
- [ ] Implement OWASP ZAP scanning
- [ ] Create incident response documentation

---

## 6. Environment Variables Required

Ensure these variables are properly configured in production:

```env
# CRITICAL - Must be set
RESEND_WEBHOOK_SECRET=whsec_your_actual_secret

# Already configured
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key
RESEND_API_KEY=your-new-resend-key
```

---

## Contact

For security concerns, contact the development team immediately.
