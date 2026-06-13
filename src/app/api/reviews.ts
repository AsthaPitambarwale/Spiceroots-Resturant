import { apiClient } from './client';

export interface Review {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  foodId: string;
  food?: {
    id: string;
    name: string;
    image: string;
  };
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  adminResponse?: {
    message: string;
    respondedAt: string;
    respondedBy: string;
  };
  likes: number;
  dislikes: number;
  isHelpful?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  food?: string;
  order: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface AdminResponseData {
  message: string;
}

export interface ReviewFilters {
  foodId?: string;
  userId?: string;
  rating?: number;
  minRating?: number;
  maxRating?: number;
  isVerifiedPurchase?: boolean;
  sortBy?: 'rating' | 'helpful' | 'recent';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating?: number;
  ratingDistribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export const reviewsApi = {
  createReview: async (data: CreateReviewData): Promise<Review> => {
    return apiClient.post<Review>('/reviews', data);
  },

  getMyReviews: async (filters?: Omit<ReviewFilters, 'userId'>): Promise<PaginatedResponse<Review>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/reviews/my-reviews?${queryString}` : '/reviews/my-reviews';

    return apiClient.get<PaginatedResponse<Review>>(url);
  },

  getFoodReviews: async (foodId: string, filters?: Omit<ReviewFilters, 'foodId'>): Promise<PaginatedResponse<Review>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/reviews/food/${foodId}?${queryString}` : `/reviews/food/${foodId}`;

    return apiClient.get<PaginatedResponse<Review>>(url);
  },

  getReviewById: async (id: string): Promise<Review> => {
    return apiClient.get<Review>(`/reviews/${id}`);
  },

  updateReview: async (id: string, data: UpdateReviewData): Promise<Review> => {
    return apiClient.put<Review>(`/reviews/${id}`, data);
  },

  deleteReview: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/reviews/${id}`);
  },

  addAdminResponse: async (id: string, data: AdminResponseData): Promise<Review> => {
    return apiClient.post<Review>(`/reviews/${id}/admin-response`, data);
  },

  markHelpful: async (id: string, helpful: boolean): Promise<Review> => {
    return apiClient.post<Review>(`/reviews/${id}/helpful`, { helpful });
  },

  canReviewFood: async (foodId: string): Promise<{
    canReview: boolean;
    reason?: string;
    orderId?: string;
  }> => {
    return apiClient.get(`/reviews/can-review/${foodId}`);
  },

  getAllReviews: async (filters?: ReviewFilters): Promise<PaginatedResponse<Review>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/reviews?${queryString}` : '/reviews';

    return apiClient.get<PaginatedResponse<Review>>(url);
  },
};

export default reviewsApi;
