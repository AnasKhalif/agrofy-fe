import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { stuntingApi } from "./stuntingApi";
import type { DetectRequest, DetectResponse, StuntingResult, WfaCurveResponse } from "./type";

export const stuntingKeys = {
  all: ["stunting"] as const,
  history: (params?: { child_id?: number }) => [...stuntingKeys.all, "history", params] as const,
  detail: (id: number) => [...stuntingKeys.all, "detail", id] as const,
  wfaCurve: (gender: 'laki-laki' | 'perempuan') => [...stuntingKeys.all, "wfa-curve", gender] as const,
};

export const useDetectStunting = (options?: UseMutationOptions<AxiosResponse<ResponseApi<DetectResponse>>, AxiosError, DetectRequest>) => {
  const qc = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data) => stuntingApi.detect(data),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: stuntingKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useGetStuntingHistory = (params?: { child_id?: number }, options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<StuntingResult[]>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: stuntingKeys.history(params), queryFn: () => stuntingApi.getHistory(params) });

export const useGetStuntingDetail = (id: number, options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<StuntingResult>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: stuntingKeys.detail(id), queryFn: () => stuntingApi.getById(id), enabled: !!id && (options?.enabled ?? true) });

export const useGetWfaCurve = (gender?: 'laki-laki' | 'perempuan', options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<WfaCurveResponse>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({
    ...options,
    queryKey: stuntingKeys.wfaCurve(gender ?? 'laki-laki'),
    queryFn: () => stuntingApi.getWfaCurve(gender as 'laki-laki' | 'perempuan'),
    enabled: !!gender && (options?.enabled ?? true),
    staleTime: Infinity,
  });
