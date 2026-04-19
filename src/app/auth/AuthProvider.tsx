import { useState, useEffect, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext, AuthContextType } from "./authContext";
import { authApi } from "../api/auth/authApi";
import { useGetProfile } from "../api/auth/useAuthApi";
import { authService } from "../services/authService";
import type { User } from "../api/auth/type";
import { tryCatch } from "@/shared/utils/tryCatch";

/**
 * Auth Provider
 * Manages authentication state and provides auth methods
 */

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();

  // Initialize user from localStorage to prevent redirect loop
  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Fetch user profile from API if token exists
  const {
    data: profileData,
    isLoading,
    refetch: refetchProfile,
  } = useGetProfile();

  // Sync user state with profile query data
  useEffect(() => {
    if (profileData?.data?.data) {
      const userData = profileData.data.data;
      setUser(userData);
      // Keep localStorage in sync for offline access
      authService.setUser(userData);
    } else if (!authService.getToken()) {
      // Clear user if no token
      setUser(null);
    }
  }, [profileData]);

  useEffect(() => {
    if (!authService.getToken()) {
      queryClient.clear();
    }
  }, [queryClient]);

  /**
   * Login user
   */
  const login = async (email: string, password: string) => {
    await queryClient.cancelQueries();
    queryClient.clear();

    const [response, error] = await tryCatch(
      authApi.login({ email, password }),
    );
    if (error) {
      console.error("Login error:", error);
      throw error;
    }

    const { token, user: loginUser } = response.data.data;

    // Store auth data
    authService.setToken(token);
    if (loginUser) {
      setUser(loginUser);
      authService.setUser(loginUser);
    }
    await refetchProfile();

    return loginUser ?? null;
  };

  /**
   * Logout user
   * Always clears local auth data even if API call fails
   */
  const logout = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();

    // Clear local state immediately — don't wait for API
    authService.clearAuth();
    setUser(null);
    // Fire API in background, ignore result
    authApi.logout().catch(() => {});
  };

  /**
   * Refresh user data
   * Uses React Query refetch for automatic cache update
   */
  const refreshUser = async () => {
    const [, error] = await tryCatch(refetchProfile());

    if (error) {
      console.error("Refresh user error:", error);
      // If refresh fails, clear auth
      authService.clearAuth();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
