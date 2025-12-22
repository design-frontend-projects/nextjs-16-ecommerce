import { auth, currentUser } from '@clerk/nextjs/server';
import { getCurrentUser } from '@/lib/auth';
import type { CurrentUserProps } from '@/types';
import { redirect } from 'next/navigation';

export type ServerUserRole = 'admin' | 'user' | 'moderator' | 'guest';

/**
 * Server-side role check - use in Server Components or API routes
 * @param allowedRoles - Array of allowed roles
 * @param redirectTo - Path to redirect if unauthorized (default: '/dashboard')
 * @returns Current user object if authorized
 */
export async function checkUserRole(
  allowedRoles: ServerUserRole[],
  redirectTo: string = '/dashboard'
): Promise<CurrentUserProps['currentUser']> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(redirectTo);
  }

  const userRole = getServerUserRole(currentUser);
  if (!allowedRoles.includes(userRole)) {
    redirect(redirectTo);
  }

  return currentUser;
}

/**
 * Get user role on server
 * @param currentUser - Current user object
 * @returns User role
 */
export function getServerUserRole(
  currentUser: CurrentUserProps['currentUser']
): ServerUserRole {
  if (!currentUser) return 'guest';

  if (currentUser.isAdmin) {
    return 'admin';
  }

  return 'user';
}

/**
 * Check if user is authenticated with Clerk
 * @returns Boolean indicating if user is authenticated with Clerk
 */
export async function isClerkAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId;
}

/**
 * Check if user is admin on server
 * @param currentUser - Current user object
 * @returns Boolean indicating if user is admin
 */
export function isUserAdmin(currentUser: CurrentUserProps['currentUser']): boolean {
  return currentUser?.isAdmin ?? false;
}

/**
 * Check if user has specific role on server
 * @param currentUser - Current user object
 * @param role - Role to check
 * @returns Boolean indicating if user has the role
 */
export function serverHasRole(
  currentUser: CurrentUserProps['currentUser'],
  role: ServerUserRole
): boolean {
  if (!currentUser) return false;

  const userRole = getServerUserRole(currentUser);
  return userRole === role;
}

/**
 * Check if user has any of the provided roles on server
 * @param currentUser - Current user object
 * @param roles - Array of roles to check
 * @returns Boolean indicating if user has any of the roles
 */
export function serverHasAnyRole(
  currentUser: CurrentUserProps['currentUser'],
  roles: ServerUserRole[]
): boolean {
  if (!currentUser || roles.length === 0) return false;

  const userRole = getServerUserRole(currentUser);
  return roles.includes(userRole);
}
