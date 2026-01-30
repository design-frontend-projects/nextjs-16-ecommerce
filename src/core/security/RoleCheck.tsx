import type { CurrentUserProps } from '@/types';

export type UserRole = 'admin' | 'user' | 'guest';

export function getUserRole(user: CurrentUserProps['currentUser']): UserRole {
  if (!user) return 'guest';
  // Check metadata or traits
  return ((user as any).publicMetadata?.role as UserRole) || 'user';
}

export function hasRole(
  user: CurrentUserProps['currentUser'],
  role: UserRole
): boolean {
  if (!user) return role === 'guest';
  const userRole = getUserRole(user);
  return userRole === role;
}

export function hasAnyRole(
  user: CurrentUserProps['currentUser'],
  roles: UserRole[]
): boolean {
  const userRole = getUserRole(user);
  return roles.includes(userRole);
}
