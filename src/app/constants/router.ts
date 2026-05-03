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
    VACCINATION: "/vaccination",
    CONSULTATION: "/consultation",
    FOOD_RECOMMENDATIONS: "/food-recommendations",
    PROFILE: "/profile",
  },

  // Doctor Routes
  DOCTOR: {
    DASHBOARD: "/doctor/dashboard",
    CONSULTATION: "/doctor/consultation",
    PATIENTS: "/doctor/patients",
    MONITORING: "/doctor/monitoring",
    VACCINATION: "/doctor/vaccination",
    FOODS: "/doctor/foods",
    PROFILE: "/doctor/profile",
  },

  // Admin Routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    ARTICLES: "/articles",
    FAQS: "/faqs",
    FOODS: "/foods",
    USERS: "/users",
    CHILDREN: "/children",
    REPORTS: "/admin/reports",
  },

  // Super Admin Routes
  SUPER_ADMIN: {
    DASHBOARD: "/dashboard",
    USERS: "/super-admin/users",
    ROLES: "/super-admin/roles",
    CONFIGURATION: "/super-admin/configuration",
    LOG_SYSTEM: "/log-system",
  },

  // Error Routes
  ERROR: {
    FORBIDDEN: "/403",
    NOT_FOUND: "/404",
    NO_PERMISSION: "/no-permission",
  },
} as const;
