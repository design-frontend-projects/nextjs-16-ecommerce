import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import type { CurrentUserProps } from '@/types';
import { redirect } from 'next/navigation';
import { supabase } from '@/config';

export type UserRole = 'admin' | 'user' | 'moderator' | 'guest';

/**
 * Get the current authenticated user from Clerk and database
 * This function should be called in Server Components or API routes only
 * @returns Current user object or null if not authenticated
 */
export async function getCurrentUser(): Promise<CurrentUserProps['currentUser']> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    // Fetch user data from your database
    const dbUser = await supabase.auth.getUser();

    if (!dbUser) {
      return null;
    }

    return {
      id: dbUser.data.user?.id as string,
      email: dbUser.data.user?.email as string,
      name: dbUser.data.user?.user_metadata.name as string,
      isAdmin: dbUser.data.user?.role === 'admin',
      createdAt: dbUser.data.user?.created_at as string,
      updatedAt: dbUser.data.user?.updated_at as string,
      emailVerified: dbUser.data.user?.email_confirmed_at as string,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get the current Clerk session
 * @returns Clerk session or null
 */
export async function getSession() {
  return await auth();
}

/**
 * Check if user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Check if user is admin
 * @returns Boolean indicating if user is admin
 */
export async function isUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isAdmin ?? false;
}

/**
 * Get Clerk user ID from session
 * @returns Clerk user ID or null
 */
export async function getClerkUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId || null;
}

// ==================== ROLE CHECK FUNCTIONS ====================

/**
 * Get user role based on user object
 * @param user - Current user object
 * @returns User role
 */
export function getUserRole(user: CurrentUserProps['currentUser'] | null): UserRole {
  if (!user) return 'guest';
  if (user.isAdmin) return 'admin';
  return 'user';
}

/**
 * Check if user has a specific role
 * @param user - Current user object
 * @param role - Role to check
 * @returns Boolean indicating if user has the role
 */
export function hasRole(
  user: CurrentUserProps['currentUser'] | null,
  role: UserRole
): boolean {
  if (!user) return role === 'guest';
  return getUserRole(user) === role;
}

/**
 * Check if user has any of the provided roles
 * @param user - Current user object
 * @param roles - Array of roles to check
 * @returns Boolean indicating if user has any of the roles
 */
export function hasAnyRole(
  user: CurrentUserProps['currentUser'] | null,
  roles: UserRole[]
): boolean {
  if (!user) return roles.includes('guest');
  if (roles.length === 0) return false;
  return roles.includes(getUserRole(user));
}

/**
 * Check if user is an admin
 * @param user - Current user object
 * @returns Boolean indicating if user is admin
 */
export function isAdmin(user: CurrentUserProps['currentUser'] | null): boolean {
  return user?.isAdmin ?? false;
}

/**
 * Check user role and redirect if unauthorized
 * Useful for Server Components
 * @param user - Current user object
 * @param allowedRoles - Array of allowed roles
 * @param redirectTo - Path to redirect if unauthorized (default: '/dashboard')
 * @returns User if authorized, otherwise redirects
 */
export function requireRole(
  user: CurrentUserProps['currentUser'] | null,
  allowedRoles: UserRole[],
  redirectTo: string = '/dashboard'
): CurrentUserProps['currentUser'] {
  if (!user || !hasAnyRole(user, allowedRoles)) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Check if user is authenticated and has admin role
 * Redirects if not authorized
 * @param user - Current user object
 * @param redirectTo - Path to redirect if not admin (default: '/dashboard')
 * @returns User if admin, otherwise redirects
 */
export function requireAdmin(
  user: CurrentUserProps['currentUser'] | null,
  redirectTo: string = '/dashboard'
): CurrentUserProps['currentUser'] {
  if (!user || !isAdmin(user)) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Check if user is authenticated
 * Redirects if not authenticated
 * @param user - Current user object
 * @param redirectTo - Path to redirect if not authenticated (default: '/auth/signin')
 * @returns User if authenticated, otherwise redirects
 */
export function requireAuth(
  user: CurrentUserProps['currentUser'] | null,
  redirectTo: string = '/auth/signin'
): CurrentUserProps['currentUser'] {
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}
