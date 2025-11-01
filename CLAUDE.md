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

### Routing Structure

- `/` - Homepage with Hero, Services, Expertise, About, Contact sections
- `/admin/login` - Admin authentication page
- `/admin/photos` - Photo management dashboard (protected route)
- `/api/photos` - CRUD operations for photos
- `/api/photos/[id]` - Individual photo operations
- `/api/upload` - File upload to Supabase Storage
- `/auth/callback` - OAuth callback handler

### Supabase Integration

The project uses Supabase for backend services. There are three client configurations:

1. **Browser Client** (`lib/supabase/client.ts`) - For client-side operations
2. **Server Client** (`lib/supabase/server.ts`) - For Server Components and API routes
3. **Middleware Client** (`lib/supabase/middleware.ts`) - For authentication in middleware

**Important**: Always use the appropriate client based on context:
- Use `lib/supabase/server.ts` in Server Components, API routes, and server actions
- Use `lib/supabase/client.ts` in Client Components
- Never mix them up as they handle cookies differently

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
3. On success, middleware (`middleware.ts`) manages session cookies
4. Protected routes check for valid session in layout or API route
5. Unauthorized users are redirected to login

## API Routes

All API routes verify authentication for mutations:

```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
```

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

## Known Issues & Patterns

- The middleware must run on every request except static files (see `middleware.ts` matcher config)
- Server Components that use `cookies()` must be async in Next.js 16+
- Photo themes in `lib/photo-themes.ts` include default Unsplash photos as fallbacks
- Multiple backup/temp component files exist in `components/sections/` (suffixed with `-backup`, `-temp`, etc.) - these are not used in production

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
