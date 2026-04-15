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

export const foodApi = {
  getAll:    (params?: { category?: string; search?: string }) => apiService.get<ResponseApi<FoodItem[]>>("/api/v1/foods", params),
  getById:   (id: number) => apiService.get<ResponseApi<FoodItem>>(`/api/v1/foods/${id}`),
  byStatus:  (status: string) => apiService.get<ResponseApi<FoodItem[]>>("/api/v1/foods/by-status", { status }),
};
