import { useCallback } from 'react';
import { useAuth } from '@/app/auth';

/**
 * Permission Hook
 * Provides permission checking utilities for components
 */
export const usePermission = () => {
  const { user } = useAuth();

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user || !user.role || !user.role.permissions) return false;
      return user.role.permissions.includes(permission);
    },
    [user]
  );

  /**
   * Check if user has ALL specified permissions
   */
  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      if (!user || !user.role || !user.role.permissions) return false;
      const userPermissions = user.role.permissions;
      return permissions.every((permission) =>
        userPermissions.includes(permission)
      );
    },
    [user]
  );

  /**
   * Check if user has AT LEAST ONE of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!user || !user.role || !user.role.permissions) return false;
      const userPermissions = user.role.permissions;
      return permissions.some((permission) =>
        userPermissions.includes(permission)
      );
    },
    [user]
  );

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
  };
};
