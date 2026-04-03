/**
 * Route Constants
 * Centralized route path definitions
 */

export const ROUTES = {
  // Root
  ROOT: "/",

  // Auth Routes
  AUTH: {
    LOGIN: "/auth/login",
  },

  // Dashboard V1
  DASHBOARD_V1: {
    DASHBOARD_BUSINESS_PERFORMANCE: "/business-performance",
  },

  // Error Routes
  ERROR: {
    FORBIDDEN: "/403",
    NOT_FOUND: "/404",
    NO_PERMISSION: "/no-permission",
  },
} as const;
