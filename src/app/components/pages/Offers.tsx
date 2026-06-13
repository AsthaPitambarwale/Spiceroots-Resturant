import { useState, useEffect } from 'react';
import {
  Tag,
  Copy,
  CheckCircle,
  Gift,
  Percent,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface BackendOffer {
  _id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validUntil: string;
  isActive: boolean;
}

export const Offers = () => {
  const [copiedCode, setCopiedCode] = useState('');
  const [offers, setOffers] = useState<BackendOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/offers`,
      );

      const data = await res.json();

      if (data.success) {
        setOffers(data.data);
      } else {
        toast.error('Failed to load offers');
      }
    } catch (error) {
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);

    setCopiedCode(code);

    toast.success(`Code "${code}" copied!`);

    setTimeout(() => {
      setCopiedCode('');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg">Loading offers...</p>
      </div>
    );
  }

  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-violet-500',
    'from-rose-500 to-fuchsia-500',
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 dark:from-gray-900 via-white dark:via-gray-800 to-purple-50 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 dark:text-white">
            Exclusive Offers & Coupons
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
            Save more on your orders with our amazing deals
          </p>
        </motion.div>

        {offers.length === 0 ? (
          <div className="text-center text-gray-500">
            No active offers available
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {offers.map((offer, index) => {
              const gradient = gradients[index % gradients.length];
              const Icon =
                offer.discountType === 'percentage'
                  ? Percent
                  : Gift;

              const discountLabel =
                offer.discountType === 'percentage'
                  ? `${offer.discountValue}% OFF`
                  : `₹${offer.discountValue} OFF`;

              return (
                <motion.div
                  key={offer._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-10 w-10" />

                      <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold">
                        {discountLabel}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-2">
                      {offer.title}
                    </h3>

                    <p className="text-white/90 text-sm">
                      {offer.description}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="mb-4">
                      <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                        COUPON CODE
                      </label>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700">
                          <span className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">
                            {offer.code}
                          </span>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyCode(offer.code)}
                          className={`bg-gradient-to-r ${gradient} text-white p-3 rounded-lg`}
                        >
                          {copiedCode === offer.code ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <Copy className="h-6 w-6" />
                          )}
                        </motion.button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {offer.minOrderAmount > 0 && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <span>
                            Minimum Order: ₹
                            {offer.minOrderAmount}
                          </span>
                        </div>
                      )}

                      {offer.maxDiscount && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <span>
                            Maximum Discount: ₹
                            {offer.maxDiscount}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Valid Until:{' '}
                          {new Date(
                            offer.validUntil
                          ).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        🎉 Active Offer
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};