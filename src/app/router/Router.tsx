import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const LoginPage = lazy(() => import("@/features/auth/LoginPage"));

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <div>Home Page - Coming Soon</div>,
  },
  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
]);

export default router;
