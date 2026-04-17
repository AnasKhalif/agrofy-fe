import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { faqApi } from "./faqApi";
import type { FaqItem, FaqListParams, CreateFaqRequest, UpdateFaqRequest } from "./type";

export const faqKeys = {
  all: ["faqs"] as const,
  list: (params?: FaqListParams) => [...faqKeys.all, "list", params] as const,
  detail: (id: number) => [...faqKeys.all, "detail", id] as const,
};

export const useGetFaqs = (
  params?: FaqListParams,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<FaqItem[]>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: faqKeys.list(params),
    queryFn: () => faqApi.getAll(params),
  });

export const useCreateFaq = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<FaqItem>>, AxiosError, CreateFaqRequest>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data) => faqApi.create(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: faqKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateFaq = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<FaqItem>>, AxiosError, { id: number; data: UpdateFaqRequest }>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, data }) => faqApi.update(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: faqKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteFaq = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, number>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => faqApi.delete(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: faqKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};
