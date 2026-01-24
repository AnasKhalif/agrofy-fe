import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";
import type {
  RegisterData,
  RegisterEmployeeRequest,
  RegisterEmployeeResponse,
  LoginCredentials,
  LoginData,
  ResendVerificationData,
  UpdateAccountData,
  ChangeBranchRequest,
  User,
} from "./type";

/** Auth API endpoints */
export const authApi = {
  // Public endpoints
  register: (data: RegisterData) =>
    apiService.post<ResponseApi<void>>("/api/v1/auth/register", data),

  registerEmployee: (data: RegisterEmployeeRequest) =>
    apiService.post<ResponseApi<RegisterEmployeeResponse>>(
      "/api/v1/auth/register-employee",
      data,
    ),

  login: (credentials: LoginCredentials) =>
    apiService.post<ResponseApi<LoginData>>("/api/v1/auth/login", credentials),

  verifyEmail: (token: string) =>
    apiService.get<ResponseApi<void>>("/api/v1/auth/verify-email", { token }),

  resendVerification: (data: ResendVerificationData) =>
    apiService.post<ResponseApi<void>>(
      "/api/v1/auth/resend-verification",
      data,
    ),

  getInvitation: (token: string) =>
    apiService.get<ResponseApi<Record<string, unknown>>>(
      `/api/v1/auth/invitation/${token}`,
    ),

  checkNpwp: (npwp: string) =>
    apiService.get<ResponseApi<{ available: boolean }>>(
      "/api/v1/auth/check-npwp",
      { npwp },
    ),

  // Protected endpoints
  getProfile: () => apiService.get<ResponseApi<User>>("/api/v1/auth/profile"),

  updateAccount: (data: UpdateAccountData) =>
    apiService.put<ResponseApi<User>>("/api/v1/auth/account", data),

  changeBranch: (data: ChangeBranchRequest) =>
    apiService.post<ResponseApi<LoginData>>("/api/v1/auth/change-branch", data),

  refreshToken: () =>
    apiService.post<ResponseApi<LoginData>>("/api/v1/auth/refresh"),

  logout: () => apiService.post<ResponseApi<void>>("/api/v1/auth/logout"),
};
