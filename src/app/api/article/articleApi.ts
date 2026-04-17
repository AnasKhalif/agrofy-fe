import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";
import type { Article, ArticleListParams, CreateArticleRequest, UpdateArticleRequest } from "./type";

export const articleApi = {
  getAll: (params?: ArticleListParams) =>
    apiService.get<ResponseApi<Article[]>>("/api/v1/articles", params),

  getById: (id: number) =>
    apiService.get<ResponseApi<Article>>(`/api/v1/articles/${id}`),

  create: (data: CreateArticleRequest) =>
    apiService.post<ResponseApi<Article>>("/api/v1/articles", data),

  update: (id: number, data: UpdateArticleRequest) =>
    apiService.put<ResponseApi<Article>>(`/api/v1/articles/${id}`, data),

  delete: (id: number) =>
    apiService.delete<ResponseApi<void>>(`/api/v1/articles/${id}`),

  uploadImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return apiService.post<ResponseApi<Article>>(`/api/v1/articles/${id}/image`, formData);
  },
};
