import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";
import { ROUTES } from "@/app/constants/router";
import { useAuth } from "@/app/auth";
import { usePermission } from "@/shared/hooks/usePermission";
import { PERMISSIONS } from "@/app/constants/permission";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  return <>{children}</>;
};

const PermissionRoute = ({
  children,
  permissions,
}: {
  children: React.ReactNode;
  permissions?: string[];
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasAnyPermission } = usePermission();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />;

  if (permissions?.length && !hasAnyPermission(permissions)) {
    return <Navigate to={ROUTES.ERROR.FORBIDDEN} replace />;
  }

  return <>{children}</>;
};

const LoginPage = lazy(() => import("@/features/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/RegisterPage"));
const RegisterStep2Page = lazy(() => import("@/features/auth/RegisterStep2Page"));
const ForbiddenPage = lazy(() => import("@/features/error/ForbiddenPage"));
const HealthcareLayout = lazy(() => import("@/shared/components/layouts/full/HealthcareLayout"));

// Dashboard
const BusinessPage = lazy(() => import("@/features/dashboard/business/BusinessPage"));
const DashboardHomePage = lazy(() => import("@/features/dashboard/DashboardHomePage"));
const DoctorPatientsPage = lazy(() => import("../../features/children/DoctorPatientsPage"));

// Article
const ArticlesPage = lazy(() => import("@/features/article/ArticlesPage"));
const FaqManagementPage = lazy(() => import("@/features/faq/FaqManagementPage"));

// Consultation
const ConsultationPage = lazy(() => import("@/features/consultation/ConsultationPage"));
const DoctorConsultationPage = lazy(() => import("@/features/consultation/DoctorConsultationPage"));

// User Management
const UserManagementPage = lazy(() => import("@/features/user-management/UserManagementPage"));
const UserFormPage = lazy(() => import("@/features/user-management/UserFormPage"));

// Role Management
const RoleManagementPage = lazy(() => import("@/features/role-management/RoleManagementPage"));
const RoleEditPage = lazy(() => import("@/features/role-management/RoleEditPage"));

// Children
const ChildrenPage = lazy(() => import("@/features/children/ChildrenPage"));
const ChildFormPage = lazy(() => import("@/features/children/ChildFormPage"));

// Stunting
const StuntingDetectionPage = lazy(() => import("@/features/stunting/StuntingDetectionPage"));
const DetectionHistoryPage = lazy(() => import("@/features/stunting/DetectionHistoryPage"));
const MonitoringPage = lazy(() => import("@/features/stunting/MonitoringPage"));
const VaccinationPage = lazy(() => import("@/features/vaccination/VaccinationPage"));
const GrowthReportPage = lazy(() => import("@/features/reports/GrowthReportPage"));

// Profile
const ProfilePage = lazy(() => import("@/features/profile/ProfilePage"));

// Food
const FoodRecommendationPage = lazy(() => import("@/features/food/FoodRecommendationPage"));
const SystemLogPage = lazy(() => Promise.resolve({ default: () => null }));

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
    element: <ProtectedRoute><HealthcareLayout /></ProtectedRoute>,
    children: [
      // Default (admin/superadmin)
      { index: true, element: <Navigate to={ROUTES.PARENT.DASHBOARD} replace /> },
      {
        path: ROUTES.DASHBOARD_V1.DASHBOARD_BUSINESS_PERFORMANCE,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.DASHBOARD_READ]}>
            <BusinessPage />
          </PermissionRoute>
        ),
      },

      // Parent routes
      {
        path: ROUTES.PARENT.DASHBOARD,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.DASHBOARD_READ]}>
            <DashboardHomePage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.PARENT.CHILDREN,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.CHILDREN_READ]}>
            <ChildrenPage />
          </PermissionRoute>
        ),
      },
      {
        path: "/children/create",
        element: (
          <PermissionRoute permissions={[PERMISSIONS.CHILDREN_CREATE]}>
            <ChildFormPage />
          </PermissionRoute>
        ),
      },
      {
        path: "/children/:id/edit",
        element: (
          <PermissionRoute permissions={[PERMISSIONS.CHILDREN_UPDATE]}>
            <ChildFormPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.PARENT.DETECTION,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.STUNTING_CREATE]}>
            <StuntingDetectionPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.PARENT.DETECTION_HISTORY,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.STUNTING_READ]}>
            <DetectionHistoryPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.PARENT.MONITORING,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.MONITORING_READ]}>
            <MonitoringPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.PARENT.VACCINATION,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.VACCINATIONS_READ]}>
            <VaccinationPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.DOCTOR.VACCINATION,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.VACCINATIONS_READ]}>
            <VaccinationPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.PARENT.FOOD_RECOMMENDATIONS,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.FOODS_READ]}>
            <FoodRecommendationPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.PARENT.CONSULTATION,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.CONSULTATIONS_READ]}>
            <ConsultationPage />
          </PermissionRoute>
        ),
      },

      // Doctor routes
      { path: ROUTES.DOCTOR.DASHBOARD, element: <Navigate to={ROUTES.PARENT.DASHBOARD} replace /> },
      {
        path: ROUTES.DOCTOR.CONSULTATION,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.CONSULTATIONS_READ]}>
            <DoctorConsultationPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.DOCTOR.PATIENTS,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.CHILDREN_READ]}>
            <DoctorPatientsPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.DOCTOR.MONITORING,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.MONITORING_READ]}>
            <MonitoringPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.DOCTOR.FOODS,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.FOODS_READ]}>
            <FoodRecommendationPage />
          </PermissionRoute>
        ),
      },

      // Profile (all roles)
      {
        path: ROUTES.PARENT.PROFILE,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.PROFILE_READ]}>
            <ProfilePage />
          </PermissionRoute>
        ),
      },

      // Admin routes
      { path: ROUTES.ADMIN.DASHBOARD, element: <Navigate to={ROUTES.PARENT.DASHBOARD} replace /> },
      {
        path: ROUTES.ADMIN.ARTICLES,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.ARTICLES_READ]}>
            <ArticlesPage />
          </PermissionRoute>
        ),
      },
      { path: "/admin/articles", element: <Navigate to={ROUTES.ADMIN.ARTICLES} replace /> },
      {
        path: ROUTES.ADMIN.FAQS,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.FAQS_READ]}>
            <FaqManagementPage />
          </PermissionRoute>
        ),
      },
      { path: "/admin/faqs", element: <Navigate to={ROUTES.ADMIN.FAQS} replace /> },
      {
        path: ROUTES.ADMIN.FOODS,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.FOODS_READ]}>
            <FoodRecommendationPage />
          </PermissionRoute>
        ),
      },
      { path: "/admin/foods", element: <Navigate to={ROUTES.ADMIN.FOODS} replace /> },
      { path: "/admin/food", element: <Navigate to={ROUTES.ADMIN.FOODS} replace /> },
      {
        path: ROUTES.ADMIN.CHILDREN,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.CHILDREN_READ]}>
            <ChildrenPage />
          </PermissionRoute>
        ),
      },
      { path: "/admin/children", element: <Navigate to={ROUTES.ADMIN.CHILDREN} replace /> },
      {
        path: ROUTES.ADMIN.REPORTS,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.REPORTS_READ]}>
            <GrowthReportPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.ADMIN.USERS,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.USERS_READ]}>
            <UserManagementPage />
          </PermissionRoute>
        ),
      },
      { path: "/admin/users", element: <Navigate to={ROUTES.ADMIN.USERS} replace /> },

      // Super Admin routes
      {
        path: ROUTES.SUPER_ADMIN.LOG_SYSTEM,
        element: (
          <PermissionRoute permissions={[PERMISSIONS.LOG_SYSTEM_READ]}>
            <SystemLogPage />
          </PermissionRoute>
        ),
      },
      { path: "/super-admin/dashboard", element: <Navigate to={ROUTES.PARENT.DASHBOARD} replace /> },
      { path: "/super-admin/log-system", element: <Navigate to={ROUTES.SUPER_ADMIN.LOG_SYSTEM} replace /> },
      {
        path: "/roles",
        element: (
          <PermissionRoute permissions={[PERMISSIONS.ROLES_READ]}>
            <RoleManagementPage />
          </PermissionRoute>
        ),
      },
      {
        path: "/roles/create",
        element: (
          <PermissionRoute permissions={[PERMISSIONS.ROLES_CREATE]}>
            <RoleEditPage />
          </PermissionRoute>
        ),
      },
      {
        path: "/roles/edit/:id",
        element: (
          <PermissionRoute permissions={[PERMISSIONS.ROLES_UPDATE]}>
            <RoleEditPage />
          </PermissionRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <PermissionRoute permissions={[PERMISSIONS.USERS_READ]}>
            <UserManagementPage />
          </PermissionRoute>
        ),
      },
      {
        path: "/users/create",
        element: (
          <PermissionRoute permissions={[PERMISSIONS.USERS_CREATE]}>
            <UserFormPage />
          </PermissionRoute>
        ),
      },
      {
        path: "/users/edit/:id",
        element: (
          <PermissionRoute permissions={[PERMISSIONS.USERS_UPDATE]}>
            <UserFormPage />
          </PermissionRoute>
        ),
      },
      {
        path: ROUTES.ERROR.FORBIDDEN,
        element: <ForbiddenPage />,
      },
    ],
  },
  {
    path: "*",
    element: <div className="flex items-center justify-center h-screen text-gray-400">404 - Halaman tidak ditemukan</div>,
  },
], { basename: "/app" });

export default router;
