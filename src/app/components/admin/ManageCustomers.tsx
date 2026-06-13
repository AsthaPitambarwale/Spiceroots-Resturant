import { Users, Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ManageCustomers = () => {
  const { customers, allOrders } = useApp();

  const getCustomerStats = (userId: string) => {
    const customerOrders = allOrders.filter(order => order.userId === userId);
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      totalOrders: customerOrders.length,
      totalSpent,
    };
  };

  return (
    <div className="px-3 sm:px-0">
      {/* HEADER */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif mb-1 sm:mb-2 text-black">
          Manage Customers
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          View and manage customer information
        </p>
      </div>

      {/* CUSTOMER LIST */}
      <div className="grid gap-4 sm:gap-6">
        {customers.map((customer) => {
          const stats = getCustomerStats(customer.id);

          return (
            <div
              key={customer.id}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                {/* ICON */}
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 sm:p-4 rounded-full">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-900" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg sm:text-2xl font-medium text-black">
                      {customer.name}
                    </h3>
                  </div>
                </div>

                {/* CONTACT INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 sm:mt-4">

                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-900" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Email</p>
                      <p className="text-sm sm:text-base font-medium break-all">
                        {customer.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-900" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                      <p className="text-sm sm:text-base font-medium">
                        {customer.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-gray-700 md:col-span-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-900 mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Address</p>
                      <p className="text-sm sm:text-base font-medium">
                        {customer.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t mt-4">

                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-3 sm:px-6 sm:py-4 rounded-lg text-center">
                    <p className="text-xl sm:text-2xl font-medium text-blue-900">
                      {stats.totalOrders}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Total Orders
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-3 sm:px-6 sm:py-4 rounded-lg text-center">
                    <p className="text-xl sm:text-2xl font-medium text-blue-900">
                      ₹{stats.totalSpent.toFixed(2)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Total Spent
                    </p>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {customers.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
          <Users className="h-14 w-14 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-medium mb-2">
            No Customers Yet
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Customers will appear here once they register
          </p>
        </div>
      )}
    </div>
  );
};
