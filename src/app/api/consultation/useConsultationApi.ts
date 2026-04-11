import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { consultationApi } from "./consultationApi";
import type {
  Consultation,
  ConsultationMessage,
  ConsultationListParams,
  CreateConsultationRequest,
  SendMessageRequest,
} from "./type";

export const consultationKeys = {
  all: ["consultations"] as const,
  list: (params?: ConsultationListParams) => [...consultationKeys.all, "list", params] as const,
  detail: (id: number) => [...consultationKeys.all, "detail", id] as const,
  messages: (id: number) => [...consultationKeys.all, "messages", id] as const,
};

export const useGetConsultations = (
  params?: ConsultationListParams,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<Consultation[]>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: consultationKeys.list(params),
    queryFn: () => consultationApi.getAll(params),
  });

export const useGetConsultation = (
  id: number,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<Consultation>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: consultationKeys.detail(id),
    queryFn: () => consultationApi.getById(id),
    enabled: !!id && (options?.enabled ?? true),
  });

export const useGetMessages = (
  id: number,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<ConsultationMessage[]>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: consultationKeys.messages(id),
    queryFn: () => consultationApi.getMessages(id),
    enabled: !!id && (options?.enabled ?? true),
    refetchInterval: 5000,
  });

export const useCreateConsultation = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<Consultation>>, AxiosError, CreateConsultationRequest>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data) => consultationApi.create(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateConsultationStatus = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<Consultation>>, AxiosError, { id: number; status: string }>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, status }) => consultationApi.updateStatus(id, status),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useSendMessage = (
  consultationId: number,
  options?: UseMutationOptions<AxiosResponse<ResponseApi<ConsultationMessage>>, AxiosError, SendMessageRequest>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data) => consultationApi.sendMessage(consultationId, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.messages(consultationId) });
      queryClient.invalidateQueries({ queryKey: consultationKeys.list() });
      options?.onSuccess?.(...args);
    },
  });
};
