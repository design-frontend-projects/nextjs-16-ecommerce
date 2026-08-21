import { createServerClient } from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

const protectedRoutes = ['/profile', '/orders', '/checkout'];
const authRoutes = ['/sign-in', '/sign-up'];

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

export default async function proxy(request: NextRequest) {
  // 1. Run next-intl middleware first to handle localization
  const response = intlMiddleware(request);

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    '';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    '';

  // 2. Initialize Supabase SSR client for middleware session refresh
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // 3. Refresh user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Extract locale from pathname (e.g. /en/profile -> locale: en, subpath: /profile)
  const segments = pathname.split('/').filter(Boolean);
  const locale = routing.locales.includes(segments[0] as 'en' | 'ar')
    ? segments[0]
    : routing.defaultLocale;
  const pathWithoutLocale = segments.length > 0 && routing.locales.includes(segments[0] as 'en' | 'ar')
    ? '/' + segments.slice(1).join('/')
    : pathname;

  const isProtected = protectedRoutes.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  const isAuth = authRoutes.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  // If unauthorized user visits a protected route -> redirect to sign-in
  if (isProtected && !user) {
    const redirectUrl = new URL(`/${locale}/sign-in`, request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If already authenticated user visits sign-in or sign-up -> redirect to profile/dashboard
  if (isAuth && user) {
    return NextResponse.redirect(new URL(`/${locale}/profile`, request.url));
  }

  return response;
}
