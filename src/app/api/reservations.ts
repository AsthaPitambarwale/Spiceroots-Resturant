import { apiClient } from './client';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Reservation {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  date: string;
  time: string;
  guestCount: number;
  tableNumber?: string;
  status: ReservationStatus;
  specialRequests?: string;
  contactPhone: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationData {
  date: string;
  time: string;
  guestCount: number;
  specialRequests?: string;
  contactPhone: string;
  contactEmail?: string;
}

export interface UpdateReservationData extends Partial<CreateReservationData> {
  tableNumber?: string;
}

export interface ReservationFilters {
  status?: ReservationStatus;
  date?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
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

export const reservationsApi = {
  createReservation: async (data: CreateReservationData): Promise<Reservation> => {
    return apiClient.post<Reservation>('/reservations', data);
  },

  getMyReservations: async (filters?: Omit<ReservationFilters, 'userId'>): Promise<PaginatedResponse<Reservation>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/reservations/my-reservations?${queryString}` : '/reservations/my-reservations';

    return apiClient.get<PaginatedResponse<Reservation>>(url);
  },

  getReservationById: async (id: string): Promise<Reservation> => {
    return apiClient.get<Reservation>(`/reservations/${id}`);
  },

  getAllReservations: async (filters?: ReservationFilters): Promise<PaginatedResponse<Reservation>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/reservations?${queryString}` : '/reservations';

    return apiClient.get<PaginatedResponse<Reservation>>(url);
  },

  updateReservationStatus: async (id: string, status: ReservationStatus): Promise<Reservation> => {
    return apiClient.patch<Reservation>(`/reservations/${id}/status`, { status });
  },

  updateReservation: async (id: string, data: UpdateReservationData): Promise<Reservation> => {
    return apiClient.put<Reservation>(`/reservations/${id}`, data);
  },

  cancelReservation: async (id: string, reason?: string): Promise<Reservation> => {
    return apiClient.patch<Reservation>(`/reservations/${id}/cancel`, { reason });
  },

  checkAvailability: async (date: string, time: string, guestCount: number): Promise<{
    available: boolean;
    availableTables?: number;
    suggestedTimes?: string[];
  }> => {
    return apiClient.get(`/reservations/check-availability?date=${date}&time=${time}&guestCount=${guestCount}`);
  },

  assignTable: async (id: string, tableNumber: string): Promise<Reservation> => {
    return apiClient.patch<Reservation>(`/reservations/${id}/assign-table`, { tableNumber });
  },
};

export default reservationsApi;
