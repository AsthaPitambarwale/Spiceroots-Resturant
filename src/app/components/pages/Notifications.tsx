import { Bell, ShoppingBag, Calendar, Tag, Info, Trash2, Check } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return ShoppingBag;
      case 'reservation':
        return Calendar;
      case 'promotion':
        return Tag;
      default:
        return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'from-blue-500 to-cyan-500';
      case 'reservation':
        return 'from-green-500 to-emerald-500';
      case 'promotion':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-blue-500 to-red-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 dark:from-gray-900 via-white dark:via-gray-800 to-purple-50 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 dark:text-white">
            Notifications
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
            Stay updated with your orders and offers
            {unreadCount > 0 && (
              <span className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm">
                {unreadCount} new
              </span>
            )}
          </p>
        </motion.div>

        {notifications.length > 0 && (
          <motion.div
            className="flex justify-end gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                <Check className="h-4 w-4" />
                Mark all as read
              </button>
            )}
            <button
              onClick={clearAll}
              className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-all"
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </button>
          </motion.div>
        )}

        <div className="space-y-4">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center"
              >
                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 dark:text-white">No notifications</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You're all caught up! Check back later for updates.
                </p>
              </motion.div>
            ) : (
              notifications.map((notification, index) => {
                const Icon = getIcon(notification.type);
                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                    className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                      !notification.read ? 'border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${getColor(notification.type)} flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-semibold dark:text-white">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                            )}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
