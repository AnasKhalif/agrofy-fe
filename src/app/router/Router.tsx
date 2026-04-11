import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { ROUTES } from "@/app/constants/router";

const LoginPage = lazy(() => import("@/features/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/RegisterPage"));
const RegisterStep2Page = lazy(() => import("@/features/auth/RegisterStep2Page"));
const HealthcareLayout = lazy(() => import("@/shared/components/layouts/full/HealthcareLayout"));

// Dashboard
const BusinessPage = lazy(() => import("@/features/dashboard/business/BusinessPage"));

// Article
const ArticlesPage = lazy(() => import("@/features/article/ArticlesPage"));

// Consultation
const ConsultationPage = lazy(() => import("@/features/consultation/ConsultationPage"));
const DoctorConsultationPage = lazy(() => import("@/features/consultation/DoctorConsultationPage"));

// User Management
const UserManagementPage = lazy(() => import("@/features/user-management/UserManagementPage"));
const UserFormPage = lazy(() => import("@/features/user-management/UserFormPage"));

// Role Management
const RoleManagementPage = lazy(() => import("@/features/role-management/RoleManagementPage"));
const RoleEditPage = lazy(() => import("@/features/role-management/RoleEditPage"));

const router = createBrowserRouter([
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.AUTH.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.AUTH.REGISTER_STEP_2,
    element: <RegisterStep2Page />,
  },
  {
    path: "/",
    element: <HealthcareLayout />,
    children: [
      // Default
      { index: true, element: <BusinessPage /> },
      { path: ROUTES.DASHBOARD_V1.DASHBOARD_BUSINESS_PERFORMANCE, element: <BusinessPage /> },

      // Parent routes
      { path: ROUTES.PARENT.CONSULTATION, element: <ConsultationPage /> },

      // Doctor routes
      { path: ROUTES.DOCTOR.CONSULTATION, element: <DoctorConsultationPage /> },

      // Admin routes
      { path: ROUTES.ADMIN.ARTICLES, element: <ArticlesPage /> },
      { path: ROUTES.ADMIN.USERS, element: <UserManagementPage /> },

      // Super Admin routes
      { path: "/roles", element: <RoleManagementPage /> },
      { path: "/roles/create", element: <RoleEditPage /> },
      { path: "/roles/edit/:id", element: <RoleEditPage /> },
      { path: "/users", element: <UserManagementPage /> },
      { path: "/users/create", element: <UserFormPage /> },
      { path: "/users/edit/:id", element: <UserFormPage /> },
    ],
  },
  {
    path: "*",
    element: <div className="flex items-center justify-center h-screen text-gray-400">404 - Halaman tidak ditemukan</div>,
  },
]);

export default router;
