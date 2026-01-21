# Rate Limiting Production Upgrade Guide

This guide explains how to upgrade the rate limiting system from in-memory storage to a distributed solution suitable for production deployments.

## Current Implementation

The current rate limiting uses an in-memory Map store (`lib/security.ts`):
- **Pros**: Fast, no external dependencies, works well for single-instance deployments
- **Cons**: Not suitable for serverless/multi-instance deployments, state lost on restart

## Recommended Solutions

### Option 1: Upstash Redis (Recommended for Vercel)

Upstash provides a serverless Redis solution with a free tier.

#### Installation

```bash
npm install @upstash/ratelimit @upstash/redis
```

#### Environment Variables

Add to `.env`:

```env
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
```

#### Implementation

Create `lib/rate-limit-production.ts`:

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiters for different endpoints
export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  prefix: 'ratelimit:contact',
  analytics: true, // Track analytics in Upstash
})

export const newsletterRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '60 s'),
  prefix: 'ratelimit:newsletter',
})

export const webhookRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
  prefix: 'ratelimit:webhook',
})

// Usage example
export async function checkRateLimitProduction(
  identifier: string,
  limiter: Ratelimit
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const { success, remaining, reset } = await limiter.limit(identifier)

  return {
    allowed: success,
    remaining,
    resetIn: Math.ceil((reset - Date.now()) / 1000),
  }
}
```

#### Usage in API Routes

```typescript
import { contactRateLimit, checkRateLimitProduction } from '@/lib/rate-limit-production'
import { getClientIP } from '@/lib/security'

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)

  // Check rate limit
  const rateLimit = await checkRateLimitProduction(clientIP, contactRateLimit)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.resetIn),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimit.resetIn),
        },
      }
    )
  }

  // Continue with request...
}
```

### Option 2: Vercel KV

If you're already on Vercel, Vercel KV is a built-in Redis solution.

#### Setup

1. Go to Vercel Dashboard > Storage > Create > KV
2. Link to your project
3. Environment variables are automatically added

#### Implementation

```typescript
import { kv } from '@vercel/kv'
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
})
```

### Option 3: Self-Hosted Redis

For VPS/dedicated server deployments.

#### Docker Compose

```yaml
services:
  redis:
    image: redis:alpine
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes

volumes:
  redis-data:
```

#### Implementation

```typescript
import Redis from 'ioredis'
import { Ratelimit } from '@upstash/ratelimit'

const redis = new Redis(process.env.REDIS_URL!)

// Custom adapter for ioredis
const rateLimitRedis = {
  get: async (key: string) => redis.get(key),
  set: async (key: string, value: string, opts?: { ex?: number }) =>
    opts?.ex ? redis.setex(key, opts.ex, value) : redis.set(key, value),
  // ... other methods
}
```

## Migration Strategy

1. **Phase 1**: Add Redis dependency but keep in-memory fallback
2. **Phase 2**: Test in staging environment
3. **Phase 3**: Deploy to production with monitoring
4. **Phase 4**: Remove in-memory fallback after stability confirmed

### Fallback Implementation

```typescript
import { checkRateLimit as checkRateLimitMemory } from '@/lib/security'

export async function checkRateLimitWithFallback(
  key: string,
  maxRequests: number,
  windowMs: number
) {
  // Try Redis first
  if (process.env.UPSTASH_REDIS_REST_URL) {
    try {
      return await checkRateLimitProduction(key, contactRateLimit)
    } catch (error) {
      console.warn('Redis rate limit failed, falling back to memory:', error)
    }
  }

  // Fallback to in-memory
  return checkRateLimitMemory(key, maxRequests, windowMs)
}
```

## Monitoring

### Upstash Dashboard

Upstash provides built-in analytics for:
- Request counts per key
- Rate limit hits vs misses
- Latency metrics

### Custom Monitoring

Add metrics to your logging:

```typescript
import { logSecurityEvent } from '@/lib/security'

if (!rateLimit.allowed) {
  await logSecurityEvent('rate_limit', clientIP, `Rate limit exceeded: ${endpoint}`, {
    requestPath: endpoint,
    metadata: {
      remaining: rateLimit.remaining,
      resetIn: rateLimit.resetIn,
    },
  })
}
```

## Cost Considerations

| Provider | Free Tier | Paid |
|----------|-----------|------|
| Upstash | 10,000 requests/day | $0.2/100k requests |
| Vercel KV | 30,000 requests/month | $0.40/100k requests |
| Self-hosted | Server cost | N/A |

## Recommended Configuration

For Odillon website's expected traffic:

```typescript
// Contact form: 5 requests per minute per IP
const contactLimiter = Ratelimit.slidingWindow(5, '60 s')

// Newsletter: 3 requests per minute per IP
const newsletterLimiter = Ratelimit.slidingWindow(3, '60 s')

// Webhook: 100 requests per minute (Resend's rate)
const webhookLimiter = Ratelimit.slidingWindow(100, '60 s')

// Admin API: 30 requests per minute (authenticated)
const adminLimiter = Ratelimit.slidingWindow(30, '60 s')
```
