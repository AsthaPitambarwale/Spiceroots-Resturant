import { DollarSign, TrendingUp, ShoppingBag, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const SalesReports = () => {
  const { allOrders, foodItems } = useApp();

  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedOrders = allOrders.filter(o => o.orderStatus === 'delivered');
  const completedRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingRevenue = totalRevenue - completedRevenue;

  const topSellingItems = foodItems
    .map(item => {
      const orderItems = allOrders.flatMap(o => o.items).filter(i => i.id === item.id);
      const totalQuantity = orderItems.reduce((sum, i) => sum + i.quantity, 0);
      const revenue = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return {
        name: item.name,
        quantity: totalQuantity,
        revenue: Number(revenue.toFixed(2)),
      };
    })
    .filter(item => item.quantity > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const dailyData = [
    { date: '05/25', revenue: 2340, orders: 12 },
    { date: '05/26', revenue: 3120, orders: 18 },
    { date: '05/27', revenue: 2890, orders: 15 },
    { date: '05/28', revenue: 3450, orders: 21 },
    { date: '05/29', revenue: totalRevenue, orders: allOrders.length },
  ];

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Completed Revenue',
      value: `₹${completedRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Pending Revenue',
      value: `₹${pendingRevenue.toFixed(2)}`,
      icon: ShoppingBag,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Avg. Order Value',
      value: `₹${(totalRevenue / (allOrders.length || 1)).toFixed(2)}`,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-2 text-black">Sales Reports</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`₹{stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ₹{stat.iconColor}`} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-medium text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-medium text-black mb-6">Daily Revenue & Orders</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
            <YAxis yAxisId="right" orientation="right" stroke="#7c3aed" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#2563eb" name="Revenue (₹)" />
            <Bar yAxisId="right" dataKey="orders" fill="#7c3aed" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">

        {/* TITLE */}
        <h2 className="text-lg sm:text-xl font-medium text-black mb-4 sm:mb-6">
          Top Selling Items
        </h2>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
              <tr>
                <th className="text-left py-4 px-6">Rank</th>
                <th className="text-left py-4 px-6">Item Name</th>
                <th className="text-left py-4 px-6">Quantity Sold</th>
                <th className="text-left py-4 px-6">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {topSellingItems.map((item, index) => (
                <tr key={item.name} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${index === 0
                          ? 'bg-blue-500 text-white'
                          : index === 1
                            ? 'bg-gray-400 text-white'
                            : index === 2
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200'
                        }`}
                    >
                      {index + 1}
                    </div>
                  </td>

                  <td className="py-4 px-6 font-medium">{item.name}</td>
                  <td className="py-4 px-6">{item.quantity} units</td>
                  <td className="py-4 px-6 font-medium text-blue-900">
                    ₹{item.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-3">
          {topSellingItems.map((item, index) => (
            <div
              key={item.name}
              className="border rounded-xl p-4 flex justify-between items-center"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${index === 0
                      ? 'bg-blue-500 text-white'
                      : index === 1
                        ? 'bg-gray-400 text-white'
                        : index === 2
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200'
                    }`}
                >
                  {index + 1}
                </div>

                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} units sold
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="font-medium text-blue-900 text-sm">
                  ₹{item.revenue.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {topSellingItems.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No sales data available yet
          </div>
        )}
      </div>
    </div>
  );
};
