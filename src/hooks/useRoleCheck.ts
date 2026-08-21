'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { CurrentUserProps } from '@/types';
import { getUserRole, hasRole, hasAnyRole, type UserRole } from '@/core/security/RoleCheck';

/**
 * Hook to check user role in client components
 * @param currentUser - Current user object (optional, falls back to context)
 * @returns Object with role checking utilities
 */
export function useRoleCheck(currentUser?: CurrentUserProps['currentUser']) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();
  const { user, isLoading: isAuthLoading, role: contextRole } = useAuth();

  const activeUser = currentUser ?? (user ? {
    id: user.id,
    email: user.email || null,
    name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    image: user.user_metadata?.avatar_url || null,
    isAdmin: contextRole === 'admin',
    createdAt: user.created_at,
    updatedAt: user.updated_at || user.created_at,
    emailVerified: user.email_confirmed_at || null,
  } : null);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (activeUser) {
      setUserRole(getUserRole(activeUser));
    } else {
      setUserRole('guest');
    }
  }, [activeUser, isAuthLoading]);

  const checkRole = useCallback(
    (role: UserRole) => {
      return hasRole(activeUser, role);
    },
    [activeUser]
  );

  const checkAnyRole = useCallback(
    (roles: UserRole[]) => {
      return hasAnyRole(activeUser, roles);
    },
    [activeUser]
  );

  const requireRole = useCallback(
    (role: UserRole, redirectTo: string = '/dashboard') => {
      if (!hasRole(activeUser, role)) {
        router.push(redirectTo);
        return false;
      }
      return true;
    },
    [activeUser, router]
  );

  const requireAnyRole = useCallback(
    (roles: UserRole[], redirectTo: string = '/dashboard') => {
      if (!hasAnyRole(activeUser, roles)) {
        router.push(redirectTo);
        return false;
      }
      return true;
    },
    [activeUser, router]
  );

  return {
    userRole: userRole ?? contextRole,
    isLoading: isAuthLoading,
    isAdmin: (userRole ?? contextRole) === 'admin',
    isUser: (userRole ?? contextRole) === 'user',
    isGuest: (userRole ?? contextRole) === 'guest',
    checkRole,
    checkAnyRole,
    requireRole,
    requireAnyRole,
  };
}
