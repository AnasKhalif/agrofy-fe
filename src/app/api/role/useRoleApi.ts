import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { roleApi } from "./roleApi";
import type { RoleItem, CreateRoleRequest, UpdateRoleRequest, PermissionItem } from "./type";

export const roleKeys = {
  all: ["roles"] as const,
  list: () => [...roleKeys.all, "list"] as const,
  detail: (id: number) => [...roleKeys.all, "detail", id] as const,
  permissions: () => ["permissions"] as const,
};

export const useGetRoles = (
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<RoleItem[]>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: roleKeys.list(),
    queryFn: () => roleApi.getAll(),
  });

export const useGetRole = (
  id: number,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<RoleItem>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: roleKeys.detail(id),
    queryFn: () => roleApi.getById(id),
    enabled: !!id && (options?.enabled ?? true),
  });

export const useGetPermissions = (
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<PermissionItem[]>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: roleKeys.permissions(),
    queryFn: () => roleApi.getPermissions(),
  });

export const useCreateRole = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<RoleItem>>, AxiosError, CreateRoleRequest>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data) => roleApi.create(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateRole = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<RoleItem>>, AxiosError, { id: number; data: UpdateRoleRequest }>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, data }) => roleApi.update(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteRole = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, number>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => roleApi.delete(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};
