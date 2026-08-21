# Supabase Auth Integration Guide

This guide describes the unified authentication and role-checking architecture using Supabase Auth with Next.js App Router and Prisma 7.

## Architecture

1. **Client-side Auth**:
   - `src/config/supabaseClientInit.ts`: Uses `@supabase/ssr` `createBrowserClient` with automatic cookie synchronization.
   - `src/context/AuthContext.tsx`: `useAuth()` hook for state (`user`, `session`, `isLoading`, `isAdmin`, `role`, `signOut`).
   - `src/hooks/useRoleCheck.ts`: Role-based checks and redirects in Client Components.

2. **Server-side Auth**:
   - `src/config/supabaseServerClient.ts`: Uses `@supabase/ssr` `createServerClient` with Next.js `cookies()`.
   - `src/lib/auth.ts`: Helper functions (`getCurrentUser()`, `getSession()`, `requireAuth()`, `requireAdmin()`, `requireRole()`).
   - `src/core/security/RoleCheckServer.ts`: Server-side role assertions and redirects.

3. **Edge / Middleware Guard**:
   - `src/proxy.tsx`: Chains `@supabase/ssr` session cookie refresh with `next-intl` localization, automatically protecting `/:locale/profile`, `/:locale/orders`, and `/:locale/checkout`.

4. **Database Alignment**:
   - Prisma schema models feature `auth_user_id String? @default(dbgenerated("auth.uid()")) @db.Uuid`, tying database rows directly to Supabase authenticated users for seamless Row Level Security (RLS).
