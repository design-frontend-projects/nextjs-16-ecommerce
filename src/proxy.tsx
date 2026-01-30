import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/:locale/profile(.*)',
  '/:locale/orders(.*)',
  '/:locale/checkout(.*)',
]);

// Auth-specific routes
const isAuthRoute = createRouteMatcher([
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
]);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

export default clerkMiddleware(async (auth, req) => {
  // Handle i18n routing first
  const response = intlMiddleware(req);

  // Protect authenticated routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return response;
});
