import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  Package,
  Users,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLayout = () => {
  const { user, logout } = useApp();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      path: '/admin/dashboard/foods',
      icon: UtensilsCrossed,
      label: 'Manage Foods',
    },
    {
      path: '/admin/dashboard/categories',
      icon: Layers,
      label: 'Categories',
    },
    {
      path: '/admin/dashboard/orders',
      icon: Package,
      label: 'Orders',
    },
    {
      path: '/admin/dashboard/customers',
      icon: Users,
      label: 'Customers',
    },
    {
      path: '/admin/dashboard/reports',
      icon: TrendingUp,
      label: 'Sales Reports',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-gradient-to-r from-blue-900 to-purple-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-serif">SpiceRoots</h1>

        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          w-72 h-screen
          bg-gradient-to-b from-blue-900 to-purple-900
          text-white shadow-2xl
          transform transition-transform duration-300

          ${sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
          }

          lg:translate-x-0 lg:w-64
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-700 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif">
              SpiceRoots
            </h1>
            <p className="text-xs text-blue-300 mt-1">
              Admin Panel
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                  ? 'bg-blue-700 shadow-lg'
                  : 'hover:bg-blue-800/50'
                }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-blue-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-700 p-2 rounded-full">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium">
                {user.name}
              </p>
              <p className="text-xs text-blue-300">
                Administrator
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 py-3 rounded-lg transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};