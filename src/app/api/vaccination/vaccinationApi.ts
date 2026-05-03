import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";
import type {
  VaccineScheduleItem,
  VaccinationListResponse,
  RecordVaccinationRequest,
} from "./type";

export const vaccinationApi = {
  getSchedule: () =>
    apiService.get<ResponseApi<VaccineScheduleItem[]>>("/api/v1/vaccinations/schedule"),

  getForChild: (childId: number) =>
    apiService.get<ResponseApi<VaccinationListResponse>>(`/api/v1/children/${childId}/vaccinations`),

  record: (childId: number, data: RecordVaccinationRequest) =>
    apiService.post<ResponseApi<unknown>>(`/api/v1/children/${childId}/vaccinations`, data),

  delete: (childId: number, recordId: number) =>
    apiService.delete<ResponseApi<unknown>>(`/api/v1/children/${childId}/vaccinations/${recordId}`),
};
