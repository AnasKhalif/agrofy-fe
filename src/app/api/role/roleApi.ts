import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";
import type { RoleItem, CreateRoleRequest, UpdateRoleRequest, PermissionItem } from "./type";

export const roleApi = {
  getAll: () =>
    apiService.get<ResponseApi<RoleItem[]>>("/api/v1/roles"),

  getById: (id: number) =>
    apiService.get<ResponseApi<RoleItem>>(`/api/v1/roles/${id}`),

  create: (data: CreateRoleRequest) =>
    apiService.post<ResponseApi<RoleItem>>("/api/v1/roles", data),

  update: (id: number, data: UpdateRoleRequest) =>
    apiService.put<ResponseApi<RoleItem>>(`/api/v1/roles/${id}`, data),

  delete: (id: number) =>
    apiService.delete<ResponseApi<void>>(`/api/v1/roles/${id}`),

  getPermissions: () =>
    apiService.get<ResponseApi<PermissionItem[]>>("/api/v1/permissions"),
};
