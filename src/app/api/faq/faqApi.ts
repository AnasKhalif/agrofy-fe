import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";
import type { FaqItem, FaqListParams, CreateFaqRequest, UpdateFaqRequest } from "./type";

export const faqApi = {
  getAll: (params?: FaqListParams) => apiService.get<ResponseApi<FaqItem[]>>("/api/v1/faqs", params),
  getById: (id: number) => apiService.get<ResponseApi<FaqItem>>(`/api/v1/faqs/${id}`),
  create: (data: CreateFaqRequest) => apiService.post<ResponseApi<FaqItem>>("/api/v1/faqs", data),
  update: (id: number, data: UpdateFaqRequest) => apiService.put<ResponseApi<FaqItem>>(`/api/v1/faqs/${id}`, data),
  delete: (id: number) => apiService.delete<ResponseApi<void>>(`/api/v1/faqs/${id}`),
};
