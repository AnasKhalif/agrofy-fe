import { useAuth } from "@/app/auth";
import ParentDashboardPage from "@/features/dashboard/ParentDashboardPage";
import AdminDashboardPage from "@/features/dashboard/AdminDashboardPage";
import SuperAdminDashboardPage from "@/features/dashboard/SuperAdminDashboardPage";
import DoctorDashboardPage from "@/features/dashboard/DoctorDashboardPage";

const DashboardHomePage = () => {
  const { user } = useAuth();

  const roleName = user?.role
    ? (typeof user.role === "string" ? user.role : user.role.name).toLowerCase()
    : "";

  if (roleName === "superadmin") {
    return <SuperAdminDashboardPage />;
  }

  if (roleName === "admin") {
    return <AdminDashboardPage />;
  }

  if (roleName === "dokter" || roleName === "health_worker" || roleName === "doctor") {
    return <DoctorDashboardPage />;
  }

  return <ParentDashboardPage />;
};

export default DashboardHomePage;
