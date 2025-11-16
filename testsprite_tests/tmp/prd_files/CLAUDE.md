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
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture

### Multi-Domain Setup

The site supports subdomain routing via middleware:
- **odillon.fr / www.odillon.fr** - Main public site
- **admin.odillon.fr** - Admin panel (automatically redirects /admin/* paths from main domain)

The middleware in `middleware.ts:5-29` handles domain-based routing and redirects.

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
3. **Middleware Client** (`lib/supabase/middleware.ts`) - For authentication in middleware

**CRITICAL**: Always use the appropriate client based on context:
- Use `lib/supabase/server.ts` in Server Components, API routes, and server actions
- Use `lib/supabase/client.ts` in Client Components
- The middleware client is only used in `middleware.ts`
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
- All mutations in API routes verify authentication via `supabase.auth.getUser()` (see `app/api/photos/route.ts:46-50`)

### Photo Management System

Photos can be filtered by:
- **Month**: Automatic display based on current month (`lib/photo-themes.ts` has helper functions)
- **Theme**: Awareness campaigns like "Octobre Rose", "Novembre Bleu"
- **Active status**: Only active photos appear on the public site

The Hero section uses `components/ui/background-slideshow.tsx` for smooth photo transitions with fade effects.

### Component Structure

```
components/
├── layout/              # Header and Footer
│   ├── header-pro.tsx  # Main navigation with dropdown menus
│   └── footer.tsx      # Footer with contact info
├── sections/           # Page sections (Hero, Services, etc.)
│   ├── hero.tsx       # Main hero with background slideshow
│   ├── *-home.tsx     # Homepage section variants
│   └── *-detailed.tsx # Detailed page variants (not currently used)
├── ui/                 # shadcn/ui components + custom components
│   ├── background-slideshow.tsx  # Photo slideshow logic
│   └── calendar.tsx              # Gabon holidays calendar
└── magicui/            # Animation components (scroll effects, etc.)
```

### Styling

**Theme colors** (defined in `tailwind.config.ts`):
- `odillon-teal`: #1A9B8E (primary brand color)
- `odillon-lime`: #C4D82E (accent color)
- `odillon-dark`: #0A1F2C (dark backgrounds)

Uses CSS variables with HSL values for shadcn/ui theming. Custom animations include aurora, grid, shimmer, and orbit effects defined in `tailwind.config.ts`.

### Typography

- Base: Inter (Google Font)
- Display: Baskvill (custom font via `app/fonts.ts`)
- Access Baskvill via `font-baskvill` Tailwind class

### Image Handling

Next.js Image component is configured to allow all remote hostnames (`next.config.js:3-9`). This is intentional to support Unsplash and Supabase Storage URLs.

## Authentication Flow

1. User navigates to `/admin/login`
2. Credentials are validated via Supabase Auth
3. On success, middleware (`middleware.ts`) manages session cookies via `updateSession`
4. Protected routes check for valid session in layout or API route
5. Unauthorized users are redirected to login

## API Route Patterns

All API routes that mutate data follow this authentication pattern:

```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
```

GET requests are public but can be filtered (e.g., `?active=true` to show only active photos).

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
2. Run SQL schema (check docs for `schema.sql` location)
3. Create admin user in Authentication > Users
4. Create `hero-photos` storage bucket and make it public
5. Add environment variables to `.env.local`
6. Restart dev server

Detailed setup instructions available in project documentation.

## Deployment

### PM2 Configuration

The project includes `ecosystem.config.js` for PM2 deployment on VPS or Infomaniak:

```bash
pm2 start ecosystem.config.js
```

Configured for single instance, auto-restart, and 500MB memory limit.

### Vercel/Netlify

Standard Next.js deployment works out of the box. Ensure environment variables are configured in the hosting platform dashboard.

## Known Issues & Patterns

- **Middleware Matcher**: The middleware must run on every request except static files (see `middleware.ts:35-39` config)
- **Async Cookies**: Server Components that use `cookies()` must be async in Next.js 16+ (see `lib/supabase/server.ts:5`)
- **Photo Fallbacks**: `lib/photo-themes.ts` includes default Unsplash photos as fallbacks
- **Backup Files**: Multiple backup/temp component files exist in `components/sections/` (suffixed with `-backup`, `-temp`, etc.) - these are not used in production
- **Fixed Header**: The site has a fixed header requiring content padding: `pt-[88px] md:pt-[104px]` (see `app/page.tsx:18`)

## Development Notes

- The site uses scroll-smooth behavior globally (set in `app/layout.tsx:51`)
- All animations use Framer Motion with reduced motion support
- Site is entirely in French (including metadata and content)
- SEO metadata configured in `app/layout.tsx:9-43`
- Comprehensive documentation available in `docs/` directory (start with `docs/INDEX_DOCUMENTATION.md`)

## Git Workflow

Current branch: `master` (also the main branch for PRs)

Recent work has focused on:
- Supabase integration for photo management
- Admin panel for content management
- Multi-domain subdomain routing
- Responsive improvements
- New sections (calendar, trusted-by, etc.)
