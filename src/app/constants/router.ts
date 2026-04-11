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
    REGISTER: "/auth/register",
    REGISTER_STEP_2: "/auth/register/step-2",
  },

  // Dashboard V1
  DASHBOARD_V1: {
    DASHBOARD_BUSINESS_PERFORMANCE: "/business-performance",
  },

  // Parent (Orang Tua) Routes
  PARENT: {
    DASHBOARD: "/dashboard",
    CHILDREN: "/children",
    DETECTION: "/stunting-detection",
    DETECTION_HISTORY: "/detection-history",
    MONITORING: "/monitoring",
    CONSULTATION: "/consultation",
    FOOD_RECOMMENDATIONS: "/food-recommendations",
    PROFILE: "/profile",
  },

  // Doctor Routes
  DOCTOR: {
    CONSULTATION: "/doctor/consultation",
    PATIENTS: "/doctor/patients",
    PROFILE: "/doctor/profile",
  },

  // Admin Routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    ARTICLES: "/admin/articles",
    USERS: "/admin/users",
    CHILDREN: "/admin/children",
    REPORTS: "/admin/reports",
  },

  // Super Admin Routes
  SUPER_ADMIN: {
    DASHBOARD: "/super-admin/dashboard",
    USERS: "/super-admin/users",
    ROLES: "/super-admin/roles",
    CONFIGURATION: "/super-admin/configuration",
  },

  // Error Routes
  ERROR: {
    FORBIDDEN: "/403",
    NOT_FOUND: "/404",
    NO_PERMISSION: "/no-permission",
  },
} as const;
