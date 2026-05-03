import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { vaccinationApi } from "./vaccinationApi";
import type {
  VaccineScheduleItem,
  VaccinationListResponse,
  RecordVaccinationRequest,
} from "./type";

export const vaccinationKeys = {
  all: ["vaccination"] as const,
  schedule: () => [...vaccinationKeys.all, "schedule"] as const,
  forChild: (id: number) => [...vaccinationKeys.all, "child", id] as const,
};

export const useGetVaccineSchedule = (
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<VaccineScheduleItem[]>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: vaccinationKeys.schedule(),
    queryFn: () => vaccinationApi.getSchedule(),
    staleTime: Infinity,
  });

export const useGetChildVaccinations = (
  childId: number | undefined,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<VaccinationListResponse>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: vaccinationKeys.forChild(childId ?? 0),
    queryFn: () => vaccinationApi.getForChild(childId as number),
    enabled: !!childId && (options?.enabled ?? true),
  });

export const useRecordVaccination = (
  childId: number,
  options?: UseMutationOptions<AxiosResponse<ResponseApi<unknown>>, AxiosError, RecordVaccinationRequest>,
) => {
  const qc = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data) => vaccinationApi.record(childId, data),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: vaccinationKeys.forChild(childId) });
      options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteVaccination = (
  childId: number,
  options?: UseMutationOptions<AxiosResponse<ResponseApi<unknown>>, AxiosError, number>,
) => {
  const qc = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (recordId) => vaccinationApi.delete(childId, recordId),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: vaccinationKeys.forChild(childId) });
      options?.onSuccess?.(...args);
    },
  });
};
