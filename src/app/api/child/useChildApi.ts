import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { childApi } from "./childApi";
import type { ChildItem, CreateChildRequest, UpdateChildRequest } from "./type";

export const childKeys = {
  all: ["children"] as const,
  list: () => [...childKeys.all, "list"] as const,
  detail: (uuid: string) => [...childKeys.all, "detail", uuid] as const,
};

export const useGetChildren = (options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<ChildItem[]>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: childKeys.list(), queryFn: () => childApi.getAll() });

export const useGetChild = (uuid: string, options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<ChildItem>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: childKeys.detail(uuid), queryFn: () => childApi.getByUuid(uuid), enabled: !!uuid && (options?.enabled ?? true) });

export const useCreateChild = (options?: UseMutationOptions<AxiosResponse<ResponseApi<ChildItem>>, AxiosError, CreateChildRequest>) => {
  const qc = useQueryClient();
  return useMutation({ ...options, mutationFn: (data) => childApi.create(data), onSuccess: (...args) => { qc.invalidateQueries({ queryKey: childKeys.all }); options?.onSuccess?.(...args); } });
};

export const useUpdateChild = (options?: UseMutationOptions<AxiosResponse<ResponseApi<ChildItem>>, AxiosError, { uuid: string; data: UpdateChildRequest }>) => {
  const qc = useQueryClient();
  return useMutation({ ...options, mutationFn: ({ uuid, data }) => childApi.update(uuid, data), onSuccess: (...args) => { qc.invalidateQueries({ queryKey: childKeys.all }); options?.onSuccess?.(...args); } });
};

export const useDeleteChild = (options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, string>) => {
  const qc = useQueryClient();
  return useMutation({ ...options, mutationFn: (uuid) => childApi.delete(uuid), onSuccess: (...args) => { qc.invalidateQueries({ queryKey: childKeys.all }); options?.onSuccess?.(...args); } });
};
