import { useState, useEffect, ReactNode } from "react";
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

  /**
   * Login user
   */
  const login = async (email: string, password: string) => {
    const [response, error] = await tryCatch(
      authApi.login({ email, password }),
    );
    if (error) {
      console.error("Login error:", error);
      throw error;
    }

    const { token } = response.data.data;

    // Store auth data
    authService.setToken(token);
    await refetchProfile();
  };

  /**
   * Logout user
   * Always clears local auth data even if API call fails
   */
  const logout = async () => {
    try {
      // Call logout API (but don't wait for it to succeed)
      await authApi.logout();
    } catch (error) {
      // Log API error but continue with local cleanup
      console.error("Logout API error (continuing with local cleanup):", error);
    } finally {
      // Always clear auth data locally, regardless of API success/failure
      authService.clearAuth();
      setUser(null);
    }
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
    // Check token first to prevent redirect loop during initial load
    isAuthenticated: !!authService.getToken(),
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
