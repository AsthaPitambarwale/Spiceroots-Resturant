import { apiClient } from './client';

export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  isAvailable: boolean;
  preparationTime?: number;
  ingredients?: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FoodFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  sortBy?: 'price' | 'rating' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateFoodData {
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  isAvailable?: boolean;
  preparationTime?: number;
  ingredients?: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface UpdateFoodData extends Partial<CreateFoodData> {}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const foodsApi = {
  getAllFoods: async (filters?: FoodFilters): Promise<PaginatedResponse<Food>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/foods?${queryString}` : '/foods';

    return apiClient.get<PaginatedResponse<Food>>(url);
  },

  getFoodById: async (id: string): Promise<Food> => {
    return apiClient.get<Food>(`/foods/${id}`);
  },

  createFood: async (data: CreateFoodData): Promise<Food> => {
    return apiClient.post<Food>('/foods', data);
  },

  updateFood: async (id: string, data: UpdateFoodData): Promise<Food> => {
    return apiClient.put<Food>(`/foods/${id}`, data);
  },

  deleteFood: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/foods/${id}`);
  },

  toggleAvailability: async (id: string): Promise<Food> => {
    return apiClient.patch<Food>(`/foods/${id}/availability`);
  },

  getFeaturedFoods: async (): Promise<Food[]> => {
    return apiClient.get<Food[]>('/foods/featured');
  },

  getPopularFoods: async (limit: number = 10): Promise<Food[]> => {
    return apiClient.get<Food[]>(`/foods/popular?limit=${limit}`);
  },
};

export default foodsApi;
