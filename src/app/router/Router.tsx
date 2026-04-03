import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { ROUTES } from "@/app/constants/router";

const LoginPage = lazy(() => import("@/features/auth/LoginPage"));
const HealthcareLayout = lazy(
  () => import("@/shared/components/layouts/full/HealthcareLayout"),
);
const BusinessPage = lazy(
  () => import("@/features/dashboard/business/BusinessPage"),
);

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <HealthcareLayout />,
    children: [
      {
        path: ROUTES.DASHBOARD_V1.DASHBOARD_BUSINESS_PERFORMANCE,
        element: <BusinessPage />,
      },
      {
        index: true,
        element: <BusinessPage />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
]);

export default router;
