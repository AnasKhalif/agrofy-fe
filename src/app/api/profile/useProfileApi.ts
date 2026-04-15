import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { profileApi, ProfileData, UpdateProfileRequest, ChangePasswordRequest } from "./profileApi";

export const useGetProfile = (options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<ProfileData>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: ["profile"], queryFn: () => profileApi.get() });

export const useUpdateProfile = (options?: UseMutationOptions<AxiosResponse<ResponseApi<ProfileData>>, AxiosError, UpdateProfileRequest>) => {
  const qc = useQueryClient();
  return useMutation({ ...options, mutationFn: (data) => profileApi.update(data), onSuccess: (...args) => { qc.invalidateQueries({ queryKey: ["profile"] }); options?.onSuccess?.(...args); } });
};

export const useChangePassword = (options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, ChangePasswordRequest>) =>
  useMutation({ ...options, mutationFn: (data) => profileApi.changePassword(data) });
