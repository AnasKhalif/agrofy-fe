import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { articleApi } from "./articleApi";
import type { Article, ArticleListParams, CreateArticleRequest, UpdateArticleRequest } from "./type";

export const articleKeys = {
  all: ["articles"] as const,
  list: (params?: ArticleListParams) => [...articleKeys.all, "list", params] as const,
  detail: (id: number) => [...articleKeys.all, "detail", id] as const,
};

export const useGetArticles = (
  params?: ArticleListParams,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<Article[]>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: articleKeys.list(params),
    queryFn: () => articleApi.getAll(params),
  });

export const useGetArticle = (
  id: number,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<Article>>, AxiosError>, "queryKey" | "queryFn">,
) =>
  useQuery({
    ...options,
    queryKey: articleKeys.detail(id),
    queryFn: () => articleApi.getById(id),
    enabled: !!id && (options?.enabled ?? true),
  });

export const useCreateArticle = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<Article>>, AxiosError, CreateArticleRequest>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data) => articleApi.create(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateArticle = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<Article>>, AxiosError, { id: number; data: UpdateArticleRequest }>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, data }) => articleApi.update(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteArticle = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, number>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => articleApi.delete(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};
