import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Mail, Lock, Phone, MapPin, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';

export const Register = () => {
  const { register, verifyPhone, verifyCity, supportedCities } = useApp();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [cityVerified, setCityVerified] = useState(false);
  const [errors, setErrors] = useState({
    phone: '',
    city: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: u.address || '',
  });

  const handlePhoneChange = async (phone: string) => {
    setFormData({ ...formData, phone });
    setPhoneVerified(false);
    setErrors({ ...errors, phone: '' });

    if (phone.length >= 10) {
      const isValid = await verifyPhone(phone);
      if (isValid) {
        setPhoneVerified(true);
        setErrors({ ...errors, phone: '' });
      } else {
        setErrors({ ...errors, phone: 'Please enter a valid Indian mobile number (+91 or 10 digits)' });
      }
    }
  };

  const handleAddressChange = (address: string) => {
    setFormData({ ...formData, address });
    setCityVerified(false);
    setErrors({ ...errors, city: '' });

    if (address.length > 10) {
      const cityCheck = verifyCity(address);
      if (cityCheck.valid) {
        setCityVerified(true);
        setErrors({ ...errors, city: '' });
      } else {
        setErrors({ ...errors, city: cityCheck.error || 'Invalid city' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!phoneVerified) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!cityVerified) {
      toast.error('Please enter a valid delivery address');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      });

      if (result.success) {
        toast.success('Registration successful! Welcome to SpiceRoots');
        navigate('/');
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif mb-2">Join SpiceRoots</h1>
            <p className="text-gray-600 dark:text-gray-400">Create your account and start your culinary journey</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Rajesh Kumar"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    Email Address *
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
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Create a strong password"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  Phone Number * (Indian Mobile)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full px-4 py-3 border-2 ${
                      errors.phone ? 'border-red-500' : phoneVerified ? 'border-green-500' : 'border-gray-200'
                    } rounded-lg focus:border-blue-500 focus:outline-none transition-colors pr-12`}
                    placeholder="+91 98765 43210"
                  />
                  {phoneVerified && (
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                  {errors.phone && (
                    <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                  )}
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone}
                  </p>
                )}
                {phoneVerified && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Phone number verified
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Delivery Address * (Include City Name)
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={4}
                    value={formData.address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className={`w-full px-4 py-3 border-2 ${
                      errors.city ? 'border-red-500' : cityVerified ? 'border-green-500' : 'border-gray-200'
                    } rounded-lg focus:border-blue-500 focus:outline-none transition-colors`}
                    placeholder="Flat/House No., Street, Area, City"
                  />
                  {cityVerified && (
                    <CheckCircle className="absolute right-4 top-4 h-5 w-5 text-green-500" />
                  )}
                  {errors.city && (
                    <AlertCircle className="absolute right-4 top-4 h-5 w-5 text-red-500" />
                  )}
                </div>
                {errors.city && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {errors.city}
                    </p>
                  </div>
                )}
                {cityVerified && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Delivery available at this location
                  </p>
                )}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>We currently deliver in:</strong>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {supportedCities.join(', ')}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !phoneVerified || !cityVerified}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
