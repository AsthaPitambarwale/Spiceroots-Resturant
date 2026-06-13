import { apiClient } from './client';

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  foodCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export const categoriesApi = {
  getAllCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories');
  },

  getActiveCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories?isActive=true');
  },

  getCategoryById: async (id: string): Promise<Category> => {
    return apiClient.get<Category>(`/categories/${id}`);
  },

  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    return apiClient.post<Category>('/categories', data);
  },

  updateCategory: async (id: string, data: UpdateCategoryData): Promise<Category> => {
    return apiClient.put<Category>(`/categories/${id}`, data);
  },

  deleteCategory: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/categories/${id}`);
  },

  toggleActive: async (id: string): Promise<Category> => {
    return apiClient.patch<Category>(`/categories/${id}/toggle-active`);
  },
};

export default categoriesApi;
