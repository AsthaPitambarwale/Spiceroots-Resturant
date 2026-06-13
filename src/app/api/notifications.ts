import { apiClient } from "./client";

export type NotificationType =
  | "order_update"
  | "reservation_update"
  | "promotion"
  | "system"
  | "review_response"
  | "delivery_update";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: {
    orderId?: string;
    reservationId?: string;
    offerId?: string;
    url?: string;
    [key: string]: any;
  };
  createdAt: string;
  readAt?: string;
}

export interface CreateNotificationData {
  userId?: string;
  userIds?: string[];
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  sendToAll?: boolean;
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount?: number;
}

export const notificationsApi = {
  getMyNotifications: async (
    filters?: NotificationFilters,
  ): Promise<Notification[]> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString
      ? `/notifications?${queryString}`
      : "/notifications";

    return apiClient.get<PaginatedResponse<Notification>>(url);
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    return apiClient.get<{ count: number }>("/notifications/unread-count");
  },

  markAsRead: async (id: string): Promise<Notification> => {
    return apiClient.put<Notification>(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<{ success: boolean; count: number }> => {
    return apiClient.patch<{ success: boolean; count: number }>(
      "/notifications/mark-all-read",
    );
  },

  deleteNotification: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/notifications/${id}`);
  },

  deleteAllRead: async (): Promise<{ success: boolean; count: number }> => {
    return apiClient.delete<{ success: boolean; count: number }>(
      "/notifications/delete-all-read",
    );
  },

  createNotification: async (
    data: CreateNotificationData,
  ): Promise<Notification | { success: boolean; count: number }> => {
    return apiClient.post("/notifications", data);
  },

  getNotificationById: async (id: string): Promise<Notification> => {
    return apiClient.get<Notification>(`/notifications/${id}`);
  },
};

export default notificationsApi;
