import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";

interface ProfileRoleObject {
  id?: string | number;
  name?: string;
  display_name?: string;
  permissions?: unknown[];
}

export interface ProfileData {
  id: number;
  uid: string;
  name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  date_of_birth: string | null;
  gender: string | null;
  role: string | ProfileRoleObject | null;
  created_at: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const profileApi = {
  get:            () => apiService.get<ResponseApi<ProfileData>>("/api/v1/profile"),
  update:         (data: UpdateProfileRequest) => apiService.put<ResponseApi<ProfileData>>("/api/v1/profile", data),
  changePassword: (data: ChangePasswordRequest) => apiService.put<ResponseApi<void>>("/api/v1/profile/change-password", data),
};
