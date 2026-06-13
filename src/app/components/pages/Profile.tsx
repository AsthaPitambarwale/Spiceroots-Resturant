import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Phone, MapPin, Mail, Save, ShoppingBag, Package, TrendingUp, IndianRupeeIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const Profile = () => {
  const { user, logout, orders } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  // Calculate order statistics
  const userOrders = orders.filter(order => order.userId === user.id);
  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const deliveredOrders = userOrders.filter(order => order.orderStatus === 'delivered').length;
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif mb-8 dark:text-white">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-16 w-16 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-medium mb-1 dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 px-4 py-2 rounded-full inline-block text-sm font-medium mb-6">
                {user.role === 'customer' ? 'Customer' : 'Admin'}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg transition-all shadow-lg"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-500 dark:text-gray-300 py-3 rounded-lg transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-medium mb-6 dark:text-white">Personal Information</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2 dark:text-gray-300">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2 dark:text-gray-300">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2 dark:text-gray-300">
                    <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2 dark:text-gray-300">
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Delivery Address
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-2xl font-medium mb-6 dark:text-white">Order Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl text-center border-2 border-blue-200 dark:border-blue-700"
                >
                  <ShoppingBag className="h-8 w-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">{totalOrders}</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Total Orders</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-xl text-center border-2 border-green-200 dark:border-green-700"
                >
                  <IndianRupeeIcon className="h-8 w-8 mx-auto mb-3 text-green-600 dark:text-green-400" />
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">₹{totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Total Spent</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-xl text-center border-2 border-purple-200 dark:border-purple-700"
                >
                  <Package className="h-8 w-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">{deliveredOrders}</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Delivered</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 p-6 rounded-xl text-center border-2 border-indigo-200 dark:border-indigo-700"
                >
                  <TrendingUp className="h-8 w-8 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 mb-1">₹{avgOrderValue.toFixed(2)}</p>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">Avg Order</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
