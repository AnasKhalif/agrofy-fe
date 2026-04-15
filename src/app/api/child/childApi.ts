import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";
import type { ChildItem, CreateChildRequest, UpdateChildRequest } from "./type";

export const childApi = {
  getAll: () => apiService.get<ResponseApi<ChildItem[]>>("/api/v1/children"),
  getByUuid: (uuid: string) => apiService.get<ResponseApi<ChildItem>>(`/api/v1/children/${uuid}`),
  create: (data: CreateChildRequest) => apiService.post<ResponseApi<ChildItem>>("/api/v1/children", data),
  update: (uuid: string, data: UpdateChildRequest) => apiService.put<ResponseApi<ChildItem>>(`/api/v1/children/${uuid}`, data),
  delete: (uuid: string) => apiService.delete<ResponseApi<void>>(`/api/v1/children/${uuid}`),
};
