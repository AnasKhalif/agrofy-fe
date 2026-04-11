import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { userApi } from "./userApi";
import type { UserItem, UserListParams, CreateUserRequest, UpdateUserRequest, RoleItem } from "./type";

export const userKeys = {
  all: ["users"] as const,
  list: (params?: UserListParams) => [...userKeys.all, "list", params] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
  roles: () => ["roles"] as const,
};

export const useGetUsers = (
  params?: UserListParams,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<UserItem[]>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: userKeys.list(params),
    queryFn: () => userApi.getAll(params),
  });

export const useGetUser = (
  id: number,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<UserItem>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getById(id),
    enabled: !!id && (options?.enabled ?? true),
  });

export const useGetRoles = (
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<RoleItem[]>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: userKeys.roles(),
    queryFn: () => userApi.getRoles(),
  });

export const useCreateUser = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<UserItem>>, AxiosError, CreateUserRequest>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data) => userApi.create(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateUser = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<UserItem>>, AxiosError, { id: number; data: UpdateUserRequest }>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, data }) => userApi.update(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteUser = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, number>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => userApi.delete(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};
