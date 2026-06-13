import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import notificationsApi from '../api/notifications';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'reservation' | 'promotion' | 'system';
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const notificationsData = await notificationsApi.getMyNotifications();

      setNotifications(
        notificationsData.map((n: any) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          type:
            n.type === 'order'
              ? 'order'
              : n.type === 'reservation'
                ? 'reservation'
                : n.type === 'promotion'
                  ? 'offer'
                  : 'update',
          timestamp: new Date(n.createdAt),
          read: n.isRead,
        }))
      );
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    toast.info(notification.title, {
      description: notification.message,
    });
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const clearAll = async () => {
    try {
      await notificationsApi.deleteAllRead();
      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
