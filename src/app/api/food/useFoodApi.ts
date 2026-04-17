import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { foodApi, FoodItem, CreateFoodRequest, UpdateFoodRequest } from "./foodApi";

export const useGetFoods = (params?: { category?: string; search?: string }, options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<FoodItem[]>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: ["foods", params], queryFn: () => foodApi.getAll(params) });

export const useGetFoodsByStatus = (status: string, options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<FoodItem[]>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: ["foods", "by-status", status], queryFn: () => foodApi.byStatus(status), enabled: !!status && (options?.enabled ?? true) });

export const useCreateFood = (options?: UseMutationOptions<AxiosResponse<ResponseApi<FoodItem>>, AxiosError, CreateFoodRequest>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data) => foodApi.create(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateFood = (options?: UseMutationOptions<AxiosResponse<ResponseApi<FoodItem>>, AxiosError, { id: number; data: UpdateFoodRequest }>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, data }) => foodApi.update(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteFood = (options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, number>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => foodApi.delete(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      options?.onSuccess?.(...args);
    },
  });
};
