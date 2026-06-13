import { DollarSign, Package, Users, TrendingUp, ShoppingBag, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

export const AdminDashboard = () => {
  const { allOrders, foodItems, customers } = useApp();

  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedOrders = allOrders.filter(o => o.orderStatus === 'delivered').length;
  const pendingOrders = allOrders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;

  const salesByCategory = foodItems.reduce((acc, item) => {
    const category = item.category;
    const orderItems = allOrders.flatMap(o => o.items).filter(i => i.id === item.id);
    const revenue = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += revenue;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(salesByCategory).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }));

  const monthlyData = [
    { month: 'Jan', revenue: 12450, orders: 45 },
    { month: 'Feb', revenue: 15680, orders: 58 },
    { month: 'Mar', revenue: 18920, orders: 67 },
    { month: 'Apr', revenue: 21340, orders: 79 },
    { month: 'May', revenue: totalRevenue, orders: allOrders.length },
  ];

  const COLORS = ['#2563eb', '#7c3aed', '#3b82f6', '#8b5cf6', '#60a5fa'];

  const stats = [
    {
      label: 'Total Revenue',
      value: `${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Orders',
      value: allOrders.length.toString(),
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders.toString(),
      icon: ShoppingBag,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Customers',
      value: customers.length.toString(),
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-2 text-black font-black">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your restaurant.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-medium text-black text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-medium text-black text-black mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Revenue ($)" />
              <Line type="monotone" dataKey="orders" stroke="#7c3aed" strokeWidth={2} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-medium text-black text-black mb-6">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-black">
        <h2 className="text-xl font-medium text-black mb-6">
          Recent Orders
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {allOrders.slice(0, 5).map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium">
                    {order.id}
                  </td>

                  <td className="py-3 px-4">
                    {order.customerName}
                  </td>

                  <td className="py-3 px-4">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${order.orderStatus === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {allOrders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500">
                    Order ID
                  </p>
                  <p className="font-semibold break-all">
                    {order.id}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${order.orderStatus === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.orderStatus === 'preparing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Customer
                  </span>
                  <span>{order.customerName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Amount
                  </span>
                  <span className="font-medium">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Date
                  </span>
                  <span>
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
