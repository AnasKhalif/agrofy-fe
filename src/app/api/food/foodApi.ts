import { apiService } from "@/app/services/apiService";
import { ResponseApi } from "@/shared/types/api/type";

export interface FoodItem {
  id: number;
  name: string;
  category: string;
  nutritional_info: string;
  recipe: string | null;
  image: string | null;
}

export interface CreateFoodRequest {
  name: string;
  category: string;
  nutritional_info: string;
  recipe?: string | null;
  image?: File | null;
}

export type UpdateFoodRequest = Partial<CreateFoodRequest>;

const toFoodFormData = (data: CreateFoodRequest | UpdateFoodRequest, useMethodOverride = false): FormData => {
  const formData = new FormData();

  if (data.name !== undefined) formData.append("name", data.name);
  if (data.category !== undefined) formData.append("category", data.category);
  if (data.nutritional_info !== undefined) formData.append("nutritional_info", data.nutritional_info);
  if (data.recipe !== undefined && data.recipe !== null) formData.append("recipe", data.recipe);
  if (data.image instanceof File) formData.append("image", data.image);

  if (useMethodOverride) {
    formData.append("_method", "PUT");
  }

  return formData;
};

export const foodApi = {
  getAll:    (params?: { category?: string; search?: string }) => apiService.get<ResponseApi<FoodItem[]>>("/api/v1/foods", params),
  getById:   (id: number) => apiService.get<ResponseApi<FoodItem>>(`/api/v1/foods/${id}`),
  byStatus:  (status: string) => apiService.get<ResponseApi<FoodItem[]>>("/api/v1/foods/by-status", { status }),
  create:    (data: CreateFoodRequest) => apiService.post<ResponseApi<FoodItem>>("/api/v1/foods", toFoodFormData(data)),
  update:    (id: number, data: UpdateFoodRequest) => apiService.post<ResponseApi<FoodItem>>(`/api/v1/foods/${id}`, toFoodFormData(data, true)),
  delete:    (id: number) => apiService.delete<ResponseApi<void>>(`/api/v1/foods/${id}`),
};
