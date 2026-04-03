import { useAuth } from "@/app/auth";
import { authService } from "@/app/services/authService";

/**
 * Custom hook to check if current user belongs to Nex company
 * Returns true if user.company.is_nex is true, false otherwise
 *
 * This hook provides a reactive way to check if the current user
 * belongs to Nex company. If user data is not available, it falls
 * back to checking localStorage via authService.
 *
 * @returns {boolean} - true if user belongs to Nex company, false otherwise
 */
export const useIsNexCompany = (): boolean => {
  const { user } = useAuth();

  // Prefer user from context (reactive), fallback to localStorage
  if (user?.company?.is_nex !== undefined) {
    return user.company.is_nex === true;
  }

  // Fallback: check localStorage via authService
  return authService.isNexCompany();
};
