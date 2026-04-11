import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";
import type {
  Consultation,
  ConsultationMessage,
  ConsultationListParams,
  CreateConsultationRequest,
  SendMessageRequest,
} from "./type";

export const consultationApi = {
  getAll: (params?: ConsultationListParams) =>
    apiService.get<ResponseApi<Consultation[]>>("/api/v1/consultations", params),

  getById: (id: number) =>
    apiService.get<ResponseApi<Consultation>>(`/api/v1/consultations/${id}`),

  create: (data: CreateConsultationRequest) =>
    apiService.post<ResponseApi<Consultation>>("/api/v1/consultations", data),

  updateStatus: (id: number, status: string) =>
    apiService.put<ResponseApi<Consultation>>(`/api/v1/consultations/${id}/status`, { status }),

  getMessages: (id: number) =>
    apiService.get<ResponseApi<ConsultationMessage[]>>(`/api/v1/consultations/${id}/messages`),

  sendMessage: (id: number, data: SendMessageRequest) =>
    apiService.post<ResponseApi<ConsultationMessage>>(`/api/v1/consultations/${id}/messages`, data),
};
