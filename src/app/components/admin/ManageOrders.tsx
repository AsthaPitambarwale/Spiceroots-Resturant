import { useState } from 'react';
import { Package, Eye, X } from 'lucide-react';
import { useApp, Order } from '../../context/AppContext';
import { toast } from 'sonner';

export const ManageOrders = () => {
  const { allOrders, updateOrderStatus } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = filterStatus === 'all'
    ? allOrders
    : allOrders.filter(order => order.orderStatus === filterStatus);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['orderStatus']) => {
    await updateOrderStatus(orderId, newStatus);
    toast.success('Order status updated successfully!');
    if (selectedOrder?.id === orderId) {
      const updated = allOrders.find(o => o.id === orderId);
      if (updated) {
        setSelectedOrder({ ...updated, orderStatus: newStatus });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-3 sm:px-0">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif mb-1 sm:mb-2 text-black">
            Manage Orders
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Track and update order statuses
          </p>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm sm:text-base"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden text-black">

        {/* DESKTOP TABLE */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
              <tr>
                <th className="text-left py-4 px-6">Order ID</th>
                <th className="text-left py-4 px-6">Customer</th>
                <th className="text-left py-4 px-6">Items</th>
                <th className="text-left py-4 px-6">Total</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6">Date</th>
                <th className="text-left py-4 px-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{order.id}</td>

                  <td className="py-4 px-6">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                  </td>

                  <td className="py-4 px-6">{order.items.length} items</td>

                  <td className="py-4 px-6 font-medium">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>

                  <td className="py-4 px-6">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value as OrderStatus)
                      }
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </td>

                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS (NO SCROLL) */}
        <div className="md:hidden space-y-4 p-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 shadow-sm bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-sm">#{order.id}</p>
              </div>

              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
              <p className="text-sm font-medium">{order.customerName}</p>
              <p className="text-xs text-gray-600">{order.customerPhone}</p>

              <div className="flex justify-between mt-3 text-sm">
                <span>{order.items.length} items</span>
                <span className="font-semibold">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(order.date).toLocaleDateString()}
              </p>

              <button
                onClick={() => setSelectedOrder(order)}
                className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="p-4 sm:p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg sm:text-2xl font-medium">
                Order Details - {selectedOrder.id}
              </h2>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-4 sm:p-6 space-y-6">

              {/* INFO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2 text-sm">
                    <p><span className="text-gray-600">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="text-gray-600">Phone:</span> {selectedOrder.customerPhone}</p>
                    <p><span className="text-gray-600">Address:</span> {selectedOrder.deliveryAddress}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">
                    Order Information
                  </h3>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2 text-sm">
                    <p>Order ID: {selectedOrder.id}</p>
                    <p>Date: {new Date(selectedOrder.date).toLocaleString()}</p>
                    <p>
                      Status:
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.orderStatus)}`}>
                        {selectedOrder.orderStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* ITEMS */}
              <div>
                <h3 className="font-medium mb-4 text-sm sm:text-base">
                  Order Items
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-3 sm:items-center bg-gray-50 p-3 sm:p-4 rounded-lg"
                    >
                      <img
                        src={item.image}
                        className="w-full sm:w-16 h-32 sm:h-16 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">
                          {item.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {item.category}
                        </p>
                      </div>

                      <div className="text-left sm:text-right text-sm">
                        ₹{item.price} × {item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTAL */}
              <div className="border-t pt-4 flex justify-between font-medium text-base sm:text-xl">
                <span>Total</span>
                <span className="text-blue-600">
                  ₹{selectedOrder.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
