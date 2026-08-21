# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (pnpm-lock.yaml, pnpm-workspace.yaml). Node >= 22 required.

```bash
pnpm dev                # Dev server with Turbopack on http://localhost:5901 (NOT 3000)
pnpm build              # Production build (postbuild runs prisma generate)
pnpm lint               # ESLint via next lint
pnpm format             # Prettier on all files
pnpm prisma:generate    # Regenerate Prisma client into src/generated/prisma
pnpm prisma:push        # Push schema changes to the database
pnpm seed               # Seed database (prisma/seed.ts via ts-node)
npx tsx scripts/test-db-connection.ts   # Verify DATABASE_URL connectivity
```

There is no test framework configured (no vitest/jest/playwright). Do not invent test commands.

Git hooks: husky + lint-staged (ESLint --fix + Prettier on staged files) and commitlint enforcing conventional commits (`type(scope): subject`).

## Architecture

Next.js 16 App Router e-commerce marketplace. React 19 with React Compiler enabled (`reactCompiler: true` in [next.config.ts](next.config.ts)) — do not hand-memoize with useMemo/useCallback unless necessary.

### Routing & i18n

- All pages live under [src/app/[locale]/](src/app/%5Blocale%5D/) — locales are `en` and `ar` (RTL), default `en`, locale prefix always in URL. Config in [src/i18n/routing.ts](src/i18n/routing.ts); translations in [src/messages/](src/messages/).
- Use the locale-aware navigation helpers from [src/i18n/navigation.ts](src/i18n/navigation.ts) (not `next/link`/`next/navigation` directly) for internal links and redirects.
- [src/proxy.tsx](src/proxy.tsx) is the middleware (Next.js 16 "proxy" convention): it chains Clerk's `clerkMiddleware` with the next-intl middleware. Protected routes: `/:locale/profile`, `/:locale/orders`, `/:locale/checkout`.

### Database (Prisma 7 + Supabase PostgreSQL)

- Prisma 7 with the **driver adapter** pattern: `PrismaPg` over a `pg` Pool, configured in [src/lib/prisma.ts](src/lib/prisma.ts) (global singleton — always import `prisma` from `@/lib/prisma`). A second, older client exists at [src/config/prismaConnection.ts](src/config/prismaConnection.ts); prefer `@/lib/prisma`.
- Generated client is output to `src/generated/prisma` (new `prisma-client` generator) and imported as `@/generated/prisma/client` — regenerate after any schema change.
- [prisma/schema.prisma](prisma/schema.prisma) (~1900 lines) is introspected from a Supabase database: models are snake_case, many have RLS and `auth.uid()` column defaults, check constraints, partial indexes (`partialIndexes` preview feature), and a pgvector `Unsupported("vector")` column on `products`. Schema changes must respect these — use `db push` workflow, not migrations.
- Domains in the schema: retail/marketplace (products, product_variants, inventory, price_list, promotions, pos_sales), invoicing (sales/purchase invoices + returns), multi-tenant org structure (countries/cities/branches/stores, profiles, roles/permissions), and a restaurant POS subsystem (`res_*` tables: floors, tables, orders, menu, shifts, reservations).
- `prisma.config.ts` reads `DATABASE_URL` and `SHADOW_DATABASE_URL` from `.env` (loaded via dotenv). Env access helper with fail-fast validation lives in [src/env/](src/env/).

### Auth

Clerk (`@clerk/nextjs`). Role-check helpers and setup guides live in [src/core/security/](src/core/security/) — see `PRISMA_7_GUIDE.md`, `CLERK_SETUP_GUIDE.md`, `RoleCheck.tsx` (client) and `RoleCheckServer.ts` (server). Supabase JS clients also exist in [src/config/](src/config/) (`supabaseClientInit.ts`, `supabaseServerClient.ts`) for storage/RLS-backed access.

### State & data fetching

- Client state: Zustand stores in [src/store/](src/store/) (cart, favorites, search, settings).
- Server state: TanStack Query; API routes under [src/app/api/](src/app/api/) return `NextResponse.json` and query Prisma directly (see [src/app/api/products/route.ts](src/app/api/products/route.ts) for the filtering/pagination pattern).
- Forms: react-hook-form + zod resolvers (zod v4).

### UI

- shadcn/ui components (Radix primitives) in [src/components/ui/](src/components/ui/), configured via [components.json](components.json). Feature components in [src/components/features/](src/components/features/).
- Tailwind CSS **v4** with the canonical CSS-variable syntax: `bg-(--primary)` not `bg-[var(--primary)]`. Theming via CSS variables with light/dark mode (next-themes).
- [design-md/](design-md/) holds reference design systems from well-known brands; [DESIGN.md](DESIGN.md) is the active design spec (Vercel-style monochrome, Geist font).
- Absolute imports use `@/` mapped to `src/`.

## Gotchas

- README.md is partially stale: it says MongoDB and port 3000, but the actual database is Supabase PostgreSQL and dev runs on port 5901. docker-compose.yml also still references MongoDB.
- `removeConsole` is enabled in production builds; use the winston logger in [src/lib/logger.ts](src/lib/logger.ts) for server-side logging.
- CSP and security headers are set in [next.config.ts](next.config.ts) (Clerk domains are allow-listed); an nginx reverse-proxy config with rate limiting lives in [nginx/nginx.conf](nginx/nginx.conf).
