'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import type { CurrentUserProps } from '@/types';
import { getUserRole, hasRole, hasAnyRole, type UserRole } from '@/core/security/RoleCheck';

/**
 * Hook to check user role in client components
 * @param currentUser - Current user object
 * @returns Object with role checking utilities
 */
export function useRoleCheck(currentUser: CurrentUserProps['currentUser']) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (currentUser) {
      setUserRole(getUserRole(currentUser));
    }
    setIsLoading(false);
  }, [currentUser, isLoaded]);

  const checkRole = useCallback(
    (role: UserRole) => {
      return hasRole(currentUser, role);
    },
    [currentUser]
  );

  const checkAnyRole = useCallback(
    (roles: UserRole[]) => {
      return hasAnyRole(currentUser, roles);
    },
    [currentUser]
  );

  const requireRole = useCallback(
    (role: UserRole, redirectTo: string = '/dashboard') => {
      if (!hasRole(currentUser, role)) {
        router.push(redirectTo);
        return false;
      }
      return true;
    },
    [currentUser, router]
  );

  const requireAnyRole = useCallback(
    (roles: UserRole[], redirectTo: string = '/dashboard') => {
      if (!hasAnyRole(currentUser, roles)) {
        router.push(redirectTo);
        return false;
      }
      return true;
    },
    [currentUser, router]
  );

  return {
    userRole,
    isLoading,
    isAdmin: userRole === 'admin',
    isUser: userRole === 'user',
    isGuest: userRole === 'guest',
    checkRole,
    checkAnyRole,
    requireRole,
    requireAnyRole,
  };
}
