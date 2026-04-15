import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";
import type { AdminDashboard, DoctorDashboard, ParentDashboard } from "./type";

export const dashboardApi = {
  getParent: () => apiService.get<ResponseApi<ParentDashboard>>("/api/v1/dashboard/parent"),
  getDoctor: () => apiService.get<ResponseApi<DoctorDashboard>>("/api/v1/dashboard/doctor"),
  getAdmin:  () => apiService.get<ResponseApi<AdminDashboard>>("/api/v1/dashboard/admin"),
};
