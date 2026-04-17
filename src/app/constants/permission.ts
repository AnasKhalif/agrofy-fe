/**
 * Permission Constants
 * Centralized permission definitions
 */

export const PERMISSIONS = {
  DASHBOARD_READ: "dashboard-read",

  USERS_READ: "users-read",
  USERS_CREATE: "users-create",
  USERS_UPDATE: "users-update",
  USERS_DELETE: "users-delete",

  ROLES_READ: "roles-read",
  ROLES_CREATE: "roles-create",
  ROLES_UPDATE: "roles-update",
  ROLES_DELETE: "roles-delete",

  ARTICLES_READ: "articles-read",
  ARTICLES_CREATE: "articles-create",
  ARTICLES_UPDATE: "articles-update",
  ARTICLES_DELETE: "articles-delete",

  FAQS_READ: "faqs-read",
  FAQS_CREATE: "faqs-create",
  FAQS_UPDATE: "faqs-update",
  FAQS_DELETE: "faqs-delete",

  FOODS_READ: "foods-read",
  FOODS_CREATE: "foods-create",
  FOODS_UPDATE: "foods-update",
  FOODS_DELETE: "foods-delete",

  CHILDREN_READ: "children-read",
  CHILDREN_CREATE: "children-create",
  CHILDREN_UPDATE: "children-update",
  CHILDREN_DELETE: "children-delete",

  STUNTING_READ: "stunting-read",
  STUNTING_CREATE: "stunting-create",
  MONITORING_READ: "monitoring-read",

  CONSULTATIONS_READ: "consultations-read",
  CONSULTATIONS_CREATE: "consultations-create",
  CONSULTATIONS_UPDATE: "consultations-update",
  CONSULTATIONS_DELETE: "consultations-delete",

  REPORTS_READ: "reports-read",
  LOG_SYSTEM_READ: "log-system-read",

  PROFILE_READ: "profile-read",
  PROFILE_UPDATE: "profile-update",
} as const;
