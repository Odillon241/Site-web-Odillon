# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Odillon is a professional consulting firm website built for a cabinet specializing in corporate engineering, governance, legal, financial, and HR services in Gabon. The site features a modern, animated design with a dynamic photo management system supporting monthly awareness campaigns (e.g., "Octobre Rose", "Novembre Bleu").

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Supabase** for authentication, database, and storage
- **Tailwind CSS** with custom design tokens
- **shadcn/ui** components
- **Framer Motion** for animations
- **Custom Baskvill font** (loaded from `/public/fonts/BASKVILL.ttf`)

## Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
# Uses Turbopack by default in Next.js 16 (no --turbopack flag needed)
npm run dev

# Production build
# Uses Turbopack by default in Next.js 16
npm run build

# Start production server
npm start

# Lint code (Note: next lint removed in Next.js 16, use ESLint directly)
npm run lint
```

**Note**: Next.js 16 uses Turbopack by default. If you need Webpack, use `npm run build --webpack` or configure scripts accordingly.

## Architecture

### Multi-Domain Setup

The site supports subdomain routing via Next.js 16 proxy:
- **odillon.fr / www.odillon.fr** - Main public site
- **admin.odillon.fr** - Admin panel (automatically redirects /admin/* paths from main domain)

The proxy in `proxy.ts` handles domain-based routing and redirects using Next.js 16 conventions.

### Routing Structure

- `/` - Homepage with Hero, Services, Expertise, About, Contact sections
- `/admin/login` - Admin authentication page
- `/admin/photos` - Photo management dashboard (protected route)
- `/api/photos` - CRUD operations for photos (GET supports filtering: `?month=11&theme=novembre-bleu&active=true`)
- `/api/photos/[id]` - Individual photo operations (PATCH, DELETE)
- `/api/upload` - File upload to Supabase Storage
- `/auth/callback` - OAuth callback handler

### Supabase Integration

The project uses Supabase for backend services. There are **three separate client configurations**:

1. **Browser Client** (`lib/supabase/client.ts`) - For client-side operations
2. **Server Client** (`lib/supabase/server.ts`) - For Server Components and API routes
3. **Proxy Client** (`lib/supabase/middleware.ts`) - For authentication in proxy (formerly middleware)

**CRITICAL**: Always use the appropriate client based on context:
- Use `lib/supabase/server.ts` in Server Components, API routes, and server actions
- Use `lib/supabase/client.ts` in Client Components
- The proxy client is only used in `proxy.ts`
- Never mix them up as they handle cookies differently (Next.js 16+ requires async cookie handling)

### Database Schema

**photos** table:
- `id` (UUID) - Primary key
- `src` (TEXT) - Photo URL (from Supabase Storage or external)
- `alt` (TEXT) - Accessibility description
- `theme_id` (TEXT) - References `photo_themes.id` (e.g., "novembre-bleu")
- `month` (INTEGER) - 1-12 for monthly displays
- `year` (INTEGER)
- `is_active` (BOOLEAN) - Only active photos display on site
- `display_order` (INTEGER) - Controls slideshow order
- `created_by` (UUID) - References `auth.users`

**photo_themes** table:
- `id` (TEXT) - Slug identifier
- `name` (TEXT) - Display name
- `description` (TEXT)
- `color` (TEXT) - Hex color for theme
- `month` (INTEGER) - Associated month

### Row Level Security (RLS)

All tables have RLS enabled:
- Public users can read active photos and themes
- Authenticated users have full CRUD access
- All mutations verify authentication via `supabase.auth.getUser()`

### Photo Management System

Photos can be filtered by:
- **Month**: Automatic display based on current month (lib/photo-themes.ts has helper functions)
- **Theme**: Awareness campaigns like "Octobre Rose", "Novembre Bleu"
- **Active status**: Only active photos appear on the public site

The Hero section uses `components/ui/background-slideshow.tsx` for smooth photo transitions.

### Component Structure

```
components/
├── layout/              # Header and Footer
├── sections/           # Page sections (Hero, Services, etc.)
│   ├── hero.tsx       # Main hero with background slideshow
│   ├── *-home.tsx     # Homepage section variants
│   └── *-detailed.tsx # Detailed page variants (not currently used)
├── ui/                 # shadcn/ui components + custom components
│   ├── background-slideshow.tsx  # Photo slideshow logic
│   └── calendar.tsx              # Gabon holidays calendar
└── magicui/            # Animation components
```

### Styling

**Theme colors** (defined in `tailwind.config.ts`):
- `odillon-teal`: #1A9B8E (primary brand color)
- `odillon-lime`: #C4D82E (accent color)
- `odillon-dark`: #0A1F2C (dark backgrounds)

Uses CSS variables with HSL values for shadcn/ui theming. Custom animations include aurora, grid, shimmer, and orbit effects.

### Typography

- Base: Inter (Google Font)
- Display: Baskvill (custom font via `app/fonts.ts`)
- Access via `font-baskvill` Tailwind class

### Image Handling

Next.js Image component is configured to allow all remote hostnames (`next.config.js`). This is intentional to support Unsplash and Supabase Storage URLs.

## Authentication Flow

1. User navigates to `/admin/login`
2. Credentials are validated via Supabase Auth
3. On success, proxy (`proxy.ts`) manages session cookies
4. Protected routes check for valid session in layout or API route
5. Unauthorized users are redirected to login

**Note**: Next.js 16 uses `proxy.ts` instead of `middleware.ts` (though `middleware.ts` still works for edge runtime). This project uses `proxy.ts` for Node.js runtime.

## API Route Patterns

All API routes that mutate data follow this authentication pattern:

```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
```

GET requests are public but can be filtered (e.g., `?active=true` to show only active photos).

**GET /api/photos** - Supports query params: `?month=11&theme=novembre-bleu&active=true`

**POST /api/photos** - Requires auth, creates photo record

**PATCH /api/photos/[id]** - Requires auth, updates photo

**DELETE /api/photos/[id]** - Requires auth, deletes photo

**POST /api/upload** - Requires auth, uploads to Supabase Storage bucket `hero-photos`

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL=admin@odillon.com
```

## Supabase Setup

If Supabase is not yet configured:

1. Create project at https://supabase.com
2. Run `supabase/schema.sql` in SQL Editor
3. Create admin user in Authentication > Users
4. Verify `hero-photos` storage bucket is public
5. Add environment variables
6. Restart dev server

Full setup instructions: `INTEGRATION_SUPABASE_COMPLETE.md`

## Next.js 16 MCP DevTools Integration

**CRITICAL: Documentation-First Approach for Next.js**

This project uses **Next.js DevTools MCP** (Model Context Protocol) for enhanced development workflow. The MCP server is configured in `.mcp.json`.

### Mandatory Documentation Requirement

**For ANY Next.js concept, API, feature, or question - even if you believe you know the answer - you MUST:**

1. **Use `nextjs_docs` tool** to query official Next.js documentation
2. **NEVER** answer from memory or training data about Next.js
3. **ALWAYS** verify current Next.js patterns and APIs through documentation

This ensures 100% accuracy and prevents outdated information.

### Available MCP Tools

1. **`nextjs_docs`** - Query Next.js official documentation
   - Use `action: "search"` for keyword searches
   - Use `action: "get"` with path for specific documentation pages
   - **REQUIRED** for all Next.js-related questions

2. **`nextjs_index`** - Discover running Next.js dev servers
   - Lists all Next.js 16+ servers with MCP enabled
   - Shows available runtime tools for each server
   - Automatically discovers servers on port 3000 (or configured ports)

3. **`nextjs_call`** - Execute Next.js runtime tools
   - Get real-time errors, logs, routes, and diagnostics
   - Requires port and toolName (use `nextjs_index` first)
   - Example: Get compilation errors, list routes, check build status

4. **`browser_eval`** - Browser automation with Playwright
   - Test Next.js pages in real browser
   - Verify functionality and capture runtime errors
   - Use after implementing features to verify behavior

5. **`upgrade_nextjs_16`** - Automated upgrade guide
   - Complete upgrade workflow from Next.js 15 to 16
   - Handles breaking changes, codemods, and migration

6. **`enable_cache_components`** - Cache Components setup
   - Enable and configure Cache Components (Next.js 16+)
   - Error detection, fixing, and best practices

### Recommended Workflow

1. **Before implementing changes**: Use `nextjs_index` to check current server state and available tools
2. **For Next.js questions**: Always use `nextjs_docs` to get official documentation
3. **After implementing features**: Use `browser_eval` to verify in real browser
4. **For debugging**: Use `nextjs_call` to get runtime errors and diagnostics

### Next.js 16 Key Changes

- **Turbopack by default**: `next dev` and `next build` now use Turbopack automatically (no `--turbopack` flag needed)
- **Async Request APIs**: `cookies()`, `headers()`, `params`, `searchParams` are now async-only (breaking change from v15)
- **Proxy instead of middleware**: The `middleware.ts` file is deprecated, use `proxy.ts` instead (though `middleware.ts` still works for edge runtime)
- **Cache Components**: New `cacheComponents` config replaces `experimental.dynamicIO` and `experimental.ppr`
- **New Cache APIs**: `cacheLife`, `cacheTag`, `updateTag`, `refresh` are now stable (no `unstable_` prefix)
- **React 19.2**: Built-in support with View Transitions, `useEffectEvent`, Activity API
- **Image optimization changes**: Default `minimumCacheTTL` changed from 60s to 4 hours, `imageSizes` no longer includes 16px, `qualities` defaults to `[75]` only
- **Scroll behavior**: Next.js no longer overrides `scroll-behavior: smooth` during navigation by default (add `data-scroll-behavior="smooth"` to `<html>` if needed)
- **Parallel routes**: All parallel route slots now require explicit `default.js` files
- **ESLint Flat Config**: `@next/eslint-plugin-next` now defaults to ESLint Flat Config format

## Known Issues & Patterns

- **Proxy/Edge Runtime**: The project uses `proxy.ts` for Next.js 16 (not `middleware.ts`). The proxy runs on every request except static files (see `proxy.ts` matcher config)
- **Async APIs**: Server Components that use `cookies()`, `headers()`, `params`, or `searchParams` must be async in Next.js 16+
- **Photo themes**: `lib/photo-themes.ts` includes default Unsplash photos as fallbacks
- **Backup files**: Multiple backup/temp component files exist in `components/sections/` (suffixed with `-backup`, `-temp`, etc.) - these are not used in production
- **Turbopack**: The project uses Turbopack by default (Next.js 16). If you need Webpack, use `--webpack` flag

## Development Notes

- The site uses scroll-smooth behavior globally (set in `app/layout.tsx`)
- Fixed header has responsive padding: `pt-[88px] md:pt-[104px]`
- All animations use Framer Motion with reduced motion support
- French language throughout (including metadata)
- SEO metadata configured in `app/layout.tsx`

## Git Workflow

Current branch: `master` (also the main branch for PRs)

Recent work has focused on:
- Supabase integration for photo management
- Admin panel for content management
- Responsive improvements
- New sections (calendar, trusted-by, etc.)
