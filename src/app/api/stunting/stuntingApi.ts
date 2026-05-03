import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";
import type { DetectRequest, DetectResponse, StuntingResult, WfaCurveResponse } from "./type";

export const stuntingApi = {
  detect: (data: DetectRequest) =>
    apiService.post<ResponseApi<DetectResponse>>("/api/v1/stunting/detect", data),

  getHistory: (params?: { child_id?: number }) =>
    apiService.get<ResponseApi<StuntingResult[]>>("/api/v1/stunting/history", params),

  getById: (id: number) =>
    apiService.get<ResponseApi<StuntingResult>>(`/api/v1/stunting/history/${id}`),

  getWfaCurve: (gender: 'laki-laki' | 'perempuan') =>
    apiService.get<ResponseApi<WfaCurveResponse>>("/api/v1/stunting/wfa-curve", { gender }),
};
