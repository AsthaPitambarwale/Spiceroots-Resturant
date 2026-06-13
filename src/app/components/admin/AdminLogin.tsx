import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Shield, Mail, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';

export const AdminLogin = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(formData.email, formData.password);

    if (success) {
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid admin credentials. Try: admin@spiceroots.com');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center p-6 transition-colors">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 text-gray-900 dark:text-white">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Shield className="h-10 w-10 text-blue-700 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-serif mb-2">Admin Portal</h1>
          <p className="text-gray-600 dark:text-gray-400">
            SpiceRoots Management
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mail className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                Admin Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="admin@spiceroots.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Lock className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-lg font-medium shadow-lg transition-all"
            >
              Admin Sign In
            </button>
          </form>

        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-white hover:text-blue-200 text-sm">
            ← Back to Customer Site
          </Link>
        </div>
      </div>
    </div>
  );
};
