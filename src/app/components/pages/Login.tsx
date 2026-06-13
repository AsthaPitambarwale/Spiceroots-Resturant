import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Mail, Lock, LogIn, Utensils } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';

export const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(formData.email, formData.password);

    if (success) {
      toast.success('Welcome back to SpiceRoots!');
      const redirect = searchParams.get('redirect');
      navigate(redirect === 'checkout' ? '/checkout' : '/');
    } else {
      toast.error('Invalid credentials. Try demo accounts below.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-xl">
              <Utensils className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-serif mb-2 text-gray-900 dark:text-white">
              Welcome Back
            </h1>

            <p className="text-gray-600 dark:text-gray-400">
              Sign in to continue your culinary journey
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm mb-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link to="/admin" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Admin Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
