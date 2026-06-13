import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { apiClient } from '../api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'customer' | 'admin';
  token?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  isVegetarian: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface DeliveryPartner {
  name: string;
  phone: string;
  vehicle: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'online' | 'cod';
  orderStatus: 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  date: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryInstructions?: string;
  deliveryPartner?: DeliveryPartner;
  estimatedDeliveryTime?: string;
  reviewed?: boolean;
}

export interface Review {
  id: string;
  orderId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

export const supportedCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
];

const mapFood = (food: any): FoodItem => ({
  id: food._id || food.id,
  name: food.name,
  price: food.price,
  category: food.categoryName || food.category,
  description: food.description,
  image: food.image,
  rating: food.rating || 0,
  reviews: food.reviews || 0,
  isVegetarian: !!food.isVegetarian,
});

const mapUser = (data: any): User => ({
  id: data.user?._id || data._id || data.id,
  name: data.user?.name || data.name,
  email: data.user?.email || data.email,
  phone: data.user?.phone || data.phone || '',
  address: data.user?.address || data.address || '',
  role: (data.user?.role || data.role) === 'admin'
    ? 'admin'
    : 'customer',
  token: data.token || data.user?.token || '',
});

const mapOrder = (order: any): Order => ({
  id: order._id || order.id,
  userId: typeof order.user === 'object' ? (order.user?._id || '') : (order.user || order.userId || ''),
  items: (order.items || []).map((item: any) => ({
    ...item,
    id: item.food?._id || item.food || item.id,
  })),
  totalAmount: order.totalAmount || 0,
  paymentStatus: order.paymentStatus || 'pending',
  paymentMethod: order.paymentMethod || 'cod',
  orderStatus: order.orderStatus || 'pending',
  date: order.createdAt || order.date || new Date().toISOString(),
  customerName: order.customerName || '',
  customerPhone: order.customerPhone || '',
  deliveryAddress: order.deliveryAddress || '',
  deliveryCity: order.deliveryCity || '',
  deliveryInstructions: order.deliveryInstructions,
  deliveryPartner: order.deliveryPartner
    ? {
      name: order.deliveryPartner.name,
      phone: order.deliveryPartner.phone,
      vehicle:
        order.deliveryPartner.vehicle ||
        order.deliveryPartner.vehicleNumber,
    }
    : undefined,
  estimatedDeliveryTime: order.estimatedDeliveryTime,
  reviewed: order.reviewed || false,
});

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: { name: string; email: string; phone: string; address: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  verifyPhone: (phone: string) => Promise<boolean>;
  verifyCity: (address: string) => { valid: boolean; city?: string; error?: string };
  cart: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'date'>) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  foodItems: FoodItem[];
  categories: string[];
  addFoodItem: (item: Omit<FoodItem, 'id'>) => Promise<void>;
  updateFoodItem: (id: string, item: Partial<FoodItem>) => Promise<void>;
  deleteFoodItem: (id: string) => Promise<void>;
  allOrders: Order[];
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => Promise<void>;
  customers: User[];
  supportedCities: string[];
  addReview: (orderId: string, rating: number, comment: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  const categories = useMemo(
    () => [...new Set(foodItems.map(f => f.category))].sort(),
    [foodItems]
  );

  const loadFoodItems = async () => {
    try {
      const data = await apiClient.get<any>('/foods');
      const arr: any[] = Array.isArray(data) ? data : (data?.data || []);
      setFoodItems(arr.map(mapFood));
    } catch (err) {
      console.error('Failed to load foods:', err);
    }
  };

  const loadCategoryMap = async () => {
    try {
      const data = await apiClient.get<any>('/categories');
      const arr: any[] = Array.isArray(data) ? data : (data?.data || []);
      const map: Record<string, string> = {};
      arr.forEach((cat: any) => {
        map[cat.name] = cat._id;
      });
      setCategoryMap(map);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadMyOrders = async () => {
    try {
      const data = await apiClient.get<any>('/orders/my-orders');
      const arr: any[] = Array.isArray(data) ? data : (data?.data || []);
      setOrders(arr.map(mapOrder));
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const loadAllOrders = async () => {
    try {
      const data = await apiClient.get<any>('/orders');
      const arr: any[] = Array.isArray(data) ? data : (data?.data || []);
      const mapped = arr.map(mapOrder);
      setAllOrders(mapped);

      // Derive customers from orders
      const custMap = new Map<string, User>();
      arr.forEach((order: any) => {
        const u = typeof order.user === 'object' ? order.user : null;
        if (u && u._id && !custMap.has(u._id)) {
          custMap.set(u._id, {
            id: u._id,
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            address: u.address || '',
            role: 'customer',
          });
        }
      });
      setCustomers(Array.from(custMap.values()));
    } catch (err) {
      console.error('Failed to load all orders:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadFoodItems(), loadCategoryMap()]);

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await apiClient.get<any>('/auth/me');
          const u = mapUser(data);
          setUser(u);
          if (u.role === 'admin') {
            await loadAllOrders();
          } else {
            await loadMyOrders();
          }
        } catch {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await apiClient.post<any>('/auth/login', {
        email,
        password,
      });

      const token = data.token;
      const userData = data.user || data;

      if (token) {
        localStorage.setItem('token', token);
      }

      const u = mapUser({ user: userData, token });

      console.log("LOGIN USER:", u); // IMPORTANT DEBUG

      setUser(u);

      if (u.role === 'admin') {
        await loadAllOrders();
      } else {
        await loadMyOrders();
      }

      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);
    setOrders([]);
    setAllOrders([]);
    setCustomers([]);
  };

  const verifyPhone = async (phone: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const clean = phone.replace(/\s/g, '');
    return /^(\+91)?[6-9]\d{9}$/.test(clean);
  };

  const verifyCity = (address: string): { valid: boolean; city?: string; error?: string } => {
    const lower = address.toLowerCase();
    for (const city of supportedCities) {
      if (lower.includes(city.toLowerCase())) {
        return { valid: true, city };
      }
    }
    return { valid: false, error: `We currently deliver only in: ${supportedCities.join(', ')}` };
  };

  const register = async (userData: { name: string; email: string; phone: string; address: string; password?: string }): Promise<{ success: boolean; error?: string }> => {
    const phoneValid = await verifyPhone(userData.phone);
    if (!phoneValid) return { success: false, error: 'Invalid phone number format' };

    const cityCheck = verifyCity(userData.address);
    if (!cityCheck.valid) return { success: false, error: cityCheck.error };

    try {
      const data = await apiClient.post<any>('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password || 'password123',
        phone: userData.phone,
        address: userData.address,
        city: cityCheck.city,
      });
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      setUser(mapUser(data));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(itemId); return; }
    setCart(prev => prev.map(c => c.id === itemId ? { ...c, quantity } : c));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (orderData: Omit<Order, 'id' | 'date'>): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    try {
      const cityCheck = verifyCity(orderData.deliveryAddress);
      if (!cityCheck.valid) return { success: false, error: cityCheck.error };

      if (orderData.paymentMethod === 'online') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const payload = {
        items: orderData.items.map(item => ({
          food: item.food || item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        totalAmount: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        deliveryAddress: orderData.deliveryAddress,
        deliveryCity: orderData.deliveryCity,
        deliveryInstructions: orderData.deliveryInstructions,
        razorpayPaymentId:
          orderData.paymentMethod === 'online'
            ? `pay_${Math.random().toString(36).slice(2, 15)}`
            : undefined,
      };

      const data = await apiClient.post<any>('/orders', payload);
      const newOrder = mapOrder(data);
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      return { success: true, orderId: newOrder.id };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to place order' };
    }
  };

  const addFoodItem = async (item: Omit<FoodItem, 'id'>) => {
    const categoryId = categoryMap[item.category];
    try {
      const data = await apiClient.post<any>('/foods', {
        name: item.name,
        description: item.description,
        price: item.price,
        category: categoryId,
        categoryName: item.category,
        image: item.image,
        isVegetarian: item.isVegetarian || false,
        isAvailable: true,
      });
      setFoodItems(prev => [mapFood(data), ...prev]);
    } catch {
      // Optimistic fallback
      const temp: FoodItem = { ...item, id: `temp_${Date.now()}` };
      setFoodItems(prev => [temp, ...prev]);
    }
  };

  const updateFoodItem = async (id: string, updates: Partial<FoodItem>) => {
    setFoodItems(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    try {
      const payload: any = { ...updates };
      if (updates.category) {
        payload.categoryId = categoryMap[updates.category];
        payload.categoryName = updates.category;
        delete payload.category;
      }
      await apiClient.put<any>(`/foods/${id}`, payload);
    } catch (err) {
      console.error('Failed to update food:', err);
    }
  };

  const deleteFoodItem = async (id: string) => {
    setFoodItems(prev => prev.filter(f => f.id !== id));
    try {
      await apiClient.delete(`/foods/${id}`);
    } catch (err) {
      console.error('Failed to delete food:', err);
      await loadFoodItems();
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order['orderStatus']
  ) => {
    try {
      const response = await apiClient.put(
        `/orders/${orderId}/status`,
        {
          orderStatus: status,
        }
      );

      const updatedOrder = mapOrder(response.data || response);

      setAllOrders(prev =>
        prev.map(o =>
          o.id === orderId ? updatedOrder : o
        )
      );

      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? updatedOrder : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const addReview = async (orderId: string, rating: number, comment: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, reviewed: true } : o));
    try {
      await apiClient.post('/reviews', { orderId, rating, comment });
    } catch (err) {
      console.error('Failed to add review:', err);
    }
  };

  const refreshOrders = async () => {
    if (user?.role === 'admin') {
      await loadAllOrders();
    } else if (user) {
      await loadMyOrders();
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        verifyPhone,
        verifyCity,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        orders,
        placeOrder,
        foodItems,
        categories,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        allOrders,
        updateOrderStatus,
        customers,
        supportedCities,
        addReview,
        refreshOrders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
