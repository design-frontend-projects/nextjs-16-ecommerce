import type { CurrentUserProps, UserRole } from '@/types';

export type { UserRole };

export function getUserRole(user: CurrentUserProps['currentUser']): UserRole {
  if (!user) return 'guest';
  if (user.isAdmin) return 'admin';
  return 'user';
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
  if (!user) return roles.includes('guest');
  const userRole = getUserRole(user);
  return roles.includes(userRole);
}
