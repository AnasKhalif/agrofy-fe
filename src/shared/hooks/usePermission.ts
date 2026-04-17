import { useCallback, useMemo } from 'react';
import { useAuth } from '@/app/auth';

/**
 * Permission Hook
 * Provides permission checking utilities for components
 */
export const usePermission = () => {
  const { user } = useAuth();

  const userPermissions = useMemo(() => {
    if (!user?.role || typeof user.role === 'string') return [] as string[];
    return (user.role.permissions ?? []).map((permission) => permission.toLowerCase());
  }, [user?.role]);

  const hasWildcardPermission = userPermissions.includes('*');

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (hasWildcardPermission) return true;
      return userPermissions.includes(permission.toLowerCase());
    },
    [hasWildcardPermission, userPermissions]
  );

  /**
   * Check if user has ALL specified permissions
   */
  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      if (hasWildcardPermission) return true;
      if (!permissions.length) return true;
      return permissions.every((permission) =>
        userPermissions.includes(permission.toLowerCase())
      );
    },
    [hasWildcardPermission, userPermissions]
  );

  /**
   * Check if user has AT LEAST ONE of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (hasWildcardPermission) return true;
      if (!permissions.length) return true;
      return permissions.some((permission) =>
        userPermissions.includes(permission.toLowerCase())
      );
    },
    [hasWildcardPermission, userPermissions]
  );

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
  };
};
