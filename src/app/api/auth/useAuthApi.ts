import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { storageService } from "@/app/services/storageService";
import { authApi } from "./authApi";
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

/** Auth API React Query hooks */

export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  verifyEmail: (token: string) =>
    [...authKeys.all, "verify-email", token] as const,
  invitation: (token: string) =>
    [...authKeys.all, "invitation", token] as const,
  checkNpwp: (npwp: string) => [...authKeys.all, "check-npwp", npwp] as const,
};

export const usePostRegister = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<void>>,
    AxiosError,
    RegisterData
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: (data: RegisterData) => authApi.register(data),
  });
};

export const useRegisterEmployee = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<RegisterEmployeeResponse>>,
    AxiosError,
    RegisterEmployeeRequest
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: (data: RegisterEmployeeRequest) =>
      authApi.registerEmployee(data),
  });
};

export const usePostLogin = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<LoginData>>,
    AxiosError,
    LoginCredentials
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response, ...args) => {
      const { token } = response.data.data;
      storageService.set("token", token);
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      options?.onSuccess?.(response, ...args);
    },
  });
};

export const useGetVerifyEmail = (
  token: string,
  options?: Omit<
    UseQueryOptions<AxiosResponse<ResponseApi<void>>, AxiosError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: authKeys.verifyEmail(token),
    queryFn: () => authApi.verifyEmail(token),
    enabled: !!token && (options?.enabled ?? true),
  });
};

export const useGetInvitation = (
  token: string,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ResponseApi<Record<string, unknown>>>,
      AxiosError
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: authKeys.invitation(token),
    queryFn: () => authApi.getInvitation(token),
    enabled: !!token && (options?.enabled ?? true),
  });
};

export const useCheckNpwp = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<{ available: boolean }>>,
    AxiosError,
    string
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: (npwp: string) => authApi.checkNpwp(npwp),
  });
};

export const usePostResendVerification = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<void>>,
    AxiosError,
    ResendVerificationData
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: (data: ResendVerificationData) =>
      authApi.resendVerification(data),
  });
};

export const useGetProfile = (
  options?: Omit<
    UseQueryOptions<AxiosResponse<ResponseApi<User>>, AxiosError>,
    "queryKey" | "queryFn"
  >,
) => {
  const token = storageService.get<string>("token");

  return useQuery({
    ...options,
    queryKey: authKeys.profile(),
    queryFn: () => authApi.getProfile(),
    enabled: !!token && (options?.enabled ?? true),
  });
};

export const usePutAccount = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<User>>,
    AxiosError,
    UpdateAccountData
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: UpdateAccountData) => authApi.updateAccount(data),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      options?.onSuccess?.(response, ...args);
    },
  });
};

export const useChangeBranch = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<LoginData>>,
    AxiosError,
    ChangeBranchRequest
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: ChangeBranchRequest) => authApi.changeBranch(data),
    onSuccess: (response, ...args) => {
      // Update token in storage with new token that has updated branch_id
      const { token } = response.data.data;
      storageService.set("token", token);

      // Invalidate profile to refetch with new branch context
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });

      // Call user's onSuccess callback first if provided
      options?.onSuccess?.(response, ...args);
    },
  });
};

export const useRefreshToken = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<LoginData>>,
    AxiosError,
    void
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => authApi.refreshToken(),
    onSuccess: (response, ...args) => {
      // Update token in storage with new refreshed token
      const { token } = response.data.data;
      storageService.set("token", token);

      // Invalidate profile to ensure fresh data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });

      options?.onSuccess?.(response, ...args);
    },
  });
};
