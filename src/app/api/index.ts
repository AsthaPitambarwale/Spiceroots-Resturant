export { apiClient, ApiError } from './client';
export type { ApiResponse } from './client';

export { authApi } from './auth';
export type {
  RegisterData,
  LoginCredentials,
  User,
  AuthResponse,
} from './auth';

export { foodsApi } from './foods';
export type {
  Food,
  FoodFilters,
  CreateFoodData,
  UpdateFoodData,
} from './foods';

export { categoriesApi } from './categories';
export type {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from './categories';

export { ordersApi } from './orders';
export type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  CreateOrderData,
  OrderFilters,
} from './orders';

export { reservationsApi } from './reservations';
export type {
  Reservation,
  ReservationStatus,
  CreateReservationData,
  UpdateReservationData,
  ReservationFilters,
} from './reservations';

export { notificationsApi } from './notifications';
export type {
  Notification,
  NotificationType,
  CreateNotificationData,
  NotificationFilters,
} from './notifications';

export { reviewsApi } from './reviews';
export type {
  Review,
  CreateReviewData,
  UpdateReviewData,
  AdminResponseData,
  ReviewFilters,
} from './reviews';

export type { PaginatedResponse } from './foods';

const api = {
  auth: authApi,
  foods: foodsApi,
  categories: categoriesApi,
  orders: ordersApi,
  reservations: reservationsApi,
  notifications: notificationsApi,
  reviews: reviewsApi,
};

export default api;
