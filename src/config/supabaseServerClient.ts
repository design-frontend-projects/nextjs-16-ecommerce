import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

/**
 * Create a Supabase client for server-side operations
 * This should be used in Next.js Server Components, Server Actions, and Route Handlers
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: unknown }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as { httpOnly?: boolean; path?: string; maxAge?: number })
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware handling cookie updates.
          }
        },
      },
    }
  );
}
