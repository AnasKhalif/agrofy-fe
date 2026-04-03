/**
 * Auth Service
 * Application-level authentication utilities
 */

import type { User, Branch, Company } from "../api/auth/type";

export const authService = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  /**
   * Store authentication token
   * Called by auth feature after successful login
   */
  setToken: (token: string): void => {
    localStorage.setItem("token", token);
  },

  /**
   * Get authentication token
   */
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  /**
   * Store user data
   * Called by auth feature after successful login
   */
  setUser: (user: User): void => {
    localStorage.setItem("user", JSON.stringify(user));
    // Set current company ID
    if (user.company) {
      authService.setCompany(user.company);
    }

    // Smart branch selection logic:
    // 1. Check if current branch in localStorage still exists in user's branches
    // 2. If yes, keep it (don't override)
    // 3. If no, set to first branch as fallback
    const currentBranch = authService.getCurrentBranch();
    const branchExists = user.profile?.branches?.some(
      (branch) => branch.id === currentBranch?.id,
    );

    if (!currentBranch || !branchExists) {
      // Only set first branch if current branch is not set or no longer valid
      if (user.profile?.branches && user.profile.branches.length > 0) {
        authService.setCurrentBranch(user.profile.branches[0]);
      }
    }
    // If current branch exists in user's branches, keep it as-is (no action needed)
  },

  /**
   * Clear all authentication data
   * Called by auth feature after logout
   */
  clearAuth: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("company_id");
    localStorage.removeItem("current_branch");
    localStorage.removeItem("current_branch_id");
  },

  /**
   * Check if user has specific permission
   */
  hasPermission: (): boolean => {
    // Note: User type from API doesn't include permissions directly
    // This would need to be extended if permission checking is needed
    return false;
  },

  /**
   * Store current active branch
   */
  setCurrentBranch: (branch: Branch): void => {
    localStorage.setItem("current_branch", JSON.stringify(branch));
    localStorage.setItem("current_branch_id", branch.id);
  },

  /**
   * Store current company ID
   */
  setCompany: (company: Company): void => {
    localStorage.setItem("company", JSON.stringify(company));
    localStorage.setItem("company_id", company.id);
  },

  /**
   * Get current active branch
   */
  getCurrentBranch: (): Branch | null => {
    const branchStr = localStorage.getItem("current_branch");
    return branchStr ? JSON.parse(branchStr) : null;
  },

  // Get current company ID
  getCompany: (): Company | null => {
    const companyStr = localStorage.getItem("company");
    return companyStr ? JSON.parse(companyStr) : null;
  },

  /**
   * Check if user has specific role
   * Note: Reads from localStorage for convenience
   */
  hasRole: (roleName: string): boolean => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    const user = JSON.parse(userStr) as User;
    if (!user?.role) return false;
    return typeof user.role === "string"
      ? user.role === roleName
      : user.role.name === roleName;
  },

  /**
   * Check if user belongs to Nex company
   */
  isNexCompany: (): boolean => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    const user = JSON.parse(userStr) as User;
    return user?.company?.is_nex === true;
  },
};
