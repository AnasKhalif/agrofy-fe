import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { foodApi, FoodItem } from "./foodApi";

export const useGetFoods = (params?: { category?: string; search?: string }, options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<FoodItem[]>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: ["foods", params], queryFn: () => foodApi.getAll(params) });

export const useGetFoodsByStatus = (status: string, options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<FoodItem[]>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: ["foods", "by-status", status], queryFn: () => foodApi.byStatus(status), enabled: !!status && (options?.enabled ?? true) });
