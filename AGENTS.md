# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router site for Odillon. Route files live in `app/`, with public pages such as `app/page.tsx`, offer pages under `app/offres/`, admin screens under `app/admin/`, and API handlers under `app/api/**/route.ts`. Reusable UI and feature components live in `components/`, grouped by area (`components/admin`, `components/blog`, `components/layout`, `components/sections`, `components/ui`). Shared hooks, utilities, and types belong in `hooks/`, `lib/`, and `types/`. Static assets are served from `public/`. Supabase migrations and database assets live in `supabase/`; operational scripts live in `scripts/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the local Next.js dev server at `http://localhost:3000`.
- `npm run build`: create a production build and run Next.js compile checks.
- `npm start`: serve the built production app.
- `npm run lint`: run the configured Next.js ESLint rules.
- `npm run update-email-templates`: regenerate email templates via `scripts/update-email-templates.mjs`.

## Coding Style & Naming Conventions

Use TypeScript with strict mode enabled. Prefer functional React components, explicit props types, and the `@/*` import alias defined in `tsconfig.json`. Keep route folders lowercase and URL-oriented, for example `app/mentions-legales/page.tsx`; use PascalCase for exported React components and camelCase for variables, functions, and hooks. Styling is primarily Tailwind CSS; keep utility classes readable and extract repeated UI into `components/ui` or a feature-specific component folder.

## Testing Guidelines

No automated test framework is currently configured. Before submitting changes, run `npm run lint` and `npm run build`. For UI changes, manually verify affected pages in `npm run dev`, including desktop and mobile widths. For API or Supabase-related changes, document the scenario tested and any required environment variables.

## Commit & Pull Request Guidelines

Recent commits use concise conventional prefixes such as `feat:`, `style:`, `ui:`, and `chore:`. Keep commit subjects imperative and scoped, for example `feat: add newsletter reactivation route`. Pull requests should include a short summary, validation steps, linked issues when relevant, screenshots for visual changes, and notes for config, Supabase, or deployment impacts.

## Security & Configuration Tips

Use `.env.example` and `.env.production.example` as templates. Do not commit real secrets from `.env`. Treat Supabase keys, AI provider keys, Resend credentials, and webhook secrets as environment-only configuration.
