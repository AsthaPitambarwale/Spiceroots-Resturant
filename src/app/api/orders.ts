import { apiClient } from './client';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'online' | 'upi';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  foodId: string;
  food?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
  };
  deliveryPartnerId?: string;
  deliveryPartner?: {
    id: string;
    name: string;
    phone: string;
  };
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: {
    foodId: string;
    quantity: number;
    specialInstructions?: string;
  }[];
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
  };
  paymentMethod: PaymentMethod;
  notes?: string;
  offerCode?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  userId?: string;
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
}

export const ordersApi = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    return apiClient.post<Order>('/orders', data);
  },

  getMyOrders: async (filters?: Omit<OrderFilters, 'userId'>): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/orders/my-orders?${queryString}` : '/orders/my-orders';

    return apiClient.get<PaginatedResponse<Order>>(url);
  },

  getOrderById: async (id: string): Promise<Order> => {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  getAllOrders: async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/orders?${queryString}` : '/orders';

    return apiClient.get<PaginatedResponse<Order>>(url);
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    return apiClient.patch<Order>(`/orders/${id}/status`, { status });
  },

  assignDeliveryPartner: async (id: string, deliveryPartnerId: string): Promise<Order> => {
    return apiClient.patch<Order>(`/orders/${id}/assign-delivery`, { deliveryPartnerId });
  },

  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    return apiClient.patch<Order>(`/orders/${id}/cancel`, { reason });
  },

  trackOrder: async (id: string): Promise<{
    order: Order;
    statusHistory: Array<{
      status: OrderStatus;
      timestamp: string;
      notes?: string;
    }>;
    estimatedTime?: string;
  }> => {
    return apiClient.get(`/orders/${id}/track`);
  },

  updatePaymentStatus: async (id: string, paymentStatus: PaymentStatus): Promise<Order> => {
    return apiClient.patch<Order>(`/orders/${id}/payment-status`, { paymentStatus });
  },
};

export default ordersApi;
