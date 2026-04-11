import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";
import type { UserItem, UserListParams, CreateUserRequest, UpdateUserRequest, RoleItem } from "./type";

export const userApi = {
  getAll: (params?: UserListParams) =>
    apiService.get<ResponseApi<UserItem[]>>("/api/v1/users", params),

  getById: (id: number) =>
    apiService.get<ResponseApi<UserItem>>(`/api/v1/users/${id}`),

  create: (data: CreateUserRequest) =>
    apiService.post<ResponseApi<UserItem>>("/api/v1/users", data),

  update: (id: number, data: UpdateUserRequest) =>
    apiService.put<ResponseApi<UserItem>>(`/api/v1/users/${id}`, data),

  delete: (id: number) =>
    apiService.delete<ResponseApi<void>>(`/api/v1/users/${id}`),

  getRoles: () =>
    apiService.get<ResponseApi<RoleItem[]>>("/api/v1/roles"),
};
