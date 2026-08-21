import { createBrowserClient } from '@supabase/ssr';

// Get Supabase credentials from environment variables (supporting Next.js and Vite conventions)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

// Validate that required environment variables are set
if (!supabaseUrl && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_SUPABASE_URL is not set');
}

if (!supabaseAnonKey && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
}

/**
 * Supabase client instance for client-side operations
 * Uses @supabase/ssr createBrowserClient for automatic cookie-sync with Next.js server
 */
export const supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default supabaseClient;
