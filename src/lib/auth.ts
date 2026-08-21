import { createServerClient } from '@/config/supabaseServerClient';
import type { CurrentUserProps, UserRole } from '@/types';
import { redirect } from 'next/navigation';

export type { UserRole };

/**
 * Get the current authenticated user from Supabase server session
 * This function should be called in Server Components, Server Actions, or API routes only
 * @returns Current user object or null if not authenticated
 */
export async function getCurrentUser(): Promise<CurrentUserProps['currentUser']> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const metadataRole = user.user_metadata?.role || user.app_metadata?.role;
    const isAdminUser = metadataRole === 'admin' || user.role === 'admin';

    return {
      id: user.id,
      email: user.email || null,
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        (user.email ? user.email.split('@')[0] : null),
      image: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      isAdmin: isAdminUser,
      createdAt: user.created_at,
      updatedAt: user.updated_at || user.created_at,
      emailVerified: user.email_confirmed_at || null,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get the current Supabase session
 * @returns Supabase session or null
 */
export async function getSession() {
  try {
    const supabase = await createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
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
 * Get Supabase user ID from session
 * @returns Supabase user ID or null
 */
export async function getAuthUserId(): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (error) {
    console.error('Error getting auth user id:', error);
    return null;
  }
}

// Backward-compatible alias
export const getSupabaseUserId = getAuthUserId;

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
 * @param redirectTo - Path to redirect if not authenticated (default: '/sign-in')
 * @returns User if authenticated, otherwise redirects
 */
export function requireAuth(
  user: CurrentUserProps['currentUser'] | null,
  redirectTo: string = '/sign-in'
): CurrentUserProps['currentUser'] {
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}
