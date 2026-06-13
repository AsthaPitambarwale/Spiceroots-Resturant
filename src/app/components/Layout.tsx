import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { ShoppingCart, Home, Tag, UtensilsCrossed, User, Utensils, LogOut, Phone, Download, MapPin, Zap, Moon, Calendar, Sun, Package, Bell, Mail, ChevronRight, Facebook, Instagram, Twitter, Youtube, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

export const Layout = () => {
  const { user, logout, cart } = useApp();
  const { theme, toggleTheme, isDark } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-900 dark:via-purple-900 dark:to-blue-900 text-white shadow-xl sticky top-0 z-50 backdrop-blur-lg">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-2 sm:p-3 rounded-xl shadow-lg"
              >
                <Utensils className="h-7 w-7 text-blue-600" />
              </motion.div>
              <div>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Spiceroots
                </h1>
                <p className="text-xs text-blue-100 tracking-wider hidden md:block">
                  Authentic Indian Cuisine
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-white flex-1 justify-center mx-8">
              {[
                { to: '/', label: 'Home', icon: Home },
                { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
                { to: '/reservations', label: 'Reservations', icon: Calendar },
                { to: '/offers', label: 'Offers', icon: Tag },
                ...(user ? [{ to: '/orders', label: 'Orders', icon: Package }] : [])
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive(link.to)
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'hover:bg-white/10'
                    }`}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-all"
                title="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

              {/* Notifications */}
              <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-white/10 transition-all">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-white/10 transition-all">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2 sm:px-4 py-2 rounded-lg transition-all"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline font-medium">{user.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-3 sm:px-6 py-2 rounded-lg shadow-lg font-semibold ml-1 sm:ml-2 text-sm sm:text-base"
                >
                  Sign In
                </Link>
              )}
            </div>
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-white" />
                ) : (
                  <Menu className="h-6 w-6 text-white" />
                )}
              </button>
            </div>
            {mobileMenuOpen && (
              <div className="lg:hidden absolute top-full left-0 w-full z-50">
                <div className="bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-800">

                  <div className="flex flex-col items-center py-6 space-y-5">

                    {/* Navigation Links */}
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-800 dark:text-gray-200 text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <Home className="h-5 w-5" />
                      Home
                    </Link>

                    <Link
                      to="/menu"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-800 dark:text-gray-200 text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <UtensilsCrossed className="h-5 w-5" />
                      Menu
                    </Link>

                    <Link
                      to="/reservations"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-800 dark:text-gray-200 text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <Calendar className="h-5 w-5" />
                      Reservations
                    </Link>

                    <Link
                      to="/offers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-800 dark:text-gray-200 text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <Tag className="h-5 w-5" />
                      Offers
                    </Link>

                    {user && (
                      <Link
                        to="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-gray-800 dark:text-gray-200 text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                      >
                        <Package className="h-5 w-5" />
                        Orders
                      </Link>
                    )}

                    {/* Divider */}
                    <div className="w-3/4 border-t border-gray-200 dark:border-gray-700"></div>

                    {/* Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-3 text-gray-800 dark:text-gray-200 text-lg hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      {isDark ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                      Theme
                    </button>

                    {/* Notifications */}
                    <Link
                      to="/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-800 dark:text-gray-200 text-lg hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <Bell className="h-5 w-5" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </Link>

                    {/* Cart */}
                    <Link
                      to="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-800 dark:text-gray-200 text-lg hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Cart
                      {cartItemCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>

                    {/* Auth Section */}
                    {user ? (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 text-gray-800 dark:text-gray-200 text-lg hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                          <User className="h-5 w-5" />
                          Profile
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            navigate('/');
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 text-red-500 hover:text-red-600 text-lg transition"
                        >
                          <LogOut className="h-5 w-5" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-900 dark:via-purple-900 dark:to-blue-900 text-white py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-3 rounded-xl">
                  <Utensils className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Spiceroots</h3>
                  <p className="text-sm text-blue-100">Authentic Indian Cuisine</p>
                </div>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Experience authentic Indian flavors delivered to your doorstep across 10 major cities.
              </p>
              {/* Social Media */}
              <div className="flex gap-4">
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Instagram, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Youtube, href: '#' }
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm text-blue-100">
                {[
                  { label: 'Our Menu', to: '/menu' },
                  { label: 'Table Reservations', to: '/reservations' },
                  { label: 'Offers & Coupons', to: '/offers' },
                  { label: 'Track Order', to: '/orders' },
                  { label: 'About Us', to: '/' },
                  { label: 'Careers', to: '/' }
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Us
              </h4>
              <ul className="space-y-4 text-sm text-blue-100">
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Customer Care</p>
                    <p>+91 1800 123 4567</p>
                    <p className="text-xs">10:00 AM - 11:00 PM</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <p>order@spiceroots.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Head Office</p>
                    <p>Mumbai, Maharashtra, India</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Cities */}
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                We Deliver In
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'].map(city => (
                  <span key={city} className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium hover:bg-white/20 transition-colors cursor-pointer">
                    {city}
                  </span>
                ))}
              </div>
              {/* Download App */}
              <div className="mt-6">
                <p className="font-semibold mb-3">Download App</p>
                <div className="flex flex-col gap-2">
                  <a href="#" className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs hover:bg-gray-900 transition-colors">
                    <Download className="h-4 w-4" />
                    <div>
                      <p className="text-xs opacity-75">Download on</p>
                      <p className="font-semibold">App Store</p>
                    </div>
                  </a>
                  <a href="#" className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs hover:bg-gray-900 transition-colors">
                    <Download className="h-4 w-4" />
                    <div>
                      <p className="text-xs opacity-75">Get it on</p>
                      <p className="font-semibold">Google Play</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-400/30 pt-5 mt-4">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="text-sm text-blue-100">
                <p>&copy; 2026 Spiceroots. All rights reserved.</p>
                <p className="text-xs mt-1">FSSAI Lic. No. 12345678901234 | ISO 22000:2018 Certified</p>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-blue-100 md:justify-end">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
                <a href="#" className="hover:text-white transition-colors">FAQ</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
