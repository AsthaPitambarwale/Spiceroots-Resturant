import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, MapPin, User, Phone, Check, FileText, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';
import { useEffect } from 'react';


export const Checkout = () => {
  const { cart, user, placeOrder, verifyCity, supportedCities } = useApp();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedOffer, setAppliedOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    deliveryInstructions: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% GST
  const deliveryFee = cart.length > 0 ? 40 : 0; // $40 delivery fee
  const totalBeforeDiscount = subtotal + tax + deliveryFee;

  const total = Math.max(
    totalBeforeDiscount - discount,
    0
  );

  const handleAddressChange = (address: string) => {
    setFormData({ ...formData, address });
    setAddressError('');

    if (address.length > 10) {
      const cityCheck = verifyCity(address);
      if (!cityCheck.valid) {
        setAddressError(cityCheck.error || 'Invalid city');
      }
    }
  };

  const handleOnlinePayment = async () => {
    try {
      setIsProcessing(true);

      // 1. Create Razorpay order
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: total,
          }),
        }
      );

      const order = await res.json();

      if (!order?.id) {
        toast.error("Failed to create order");
        return;
      }

      // 2. Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,

        handler: async (response: any) => {
          try {
            const cityCheck = verifyCity(formData.address);

            const verifyRes = await fetch(
              `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/payment/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,

                  user: user.id,
                  items: cart.map(item => ({
                    food: item.id, // MUST be MongoDB Food _id
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image,
                  })),
                  totalAmount: total,

                  customerName: formData.name,
                  customerPhone: formData.phone,
                  deliveryAddress: formData.address,
                  deliveryCity: cityCheck.city || "",
                }),
              }
            );

            const data = await verifyRes.json();

            if (!data.success) {
              toast.error(data.message || "Verification failed");
              return;
            }

            toast.success("Payment successful!");
            navigate("/orders");
          } catch (err) {
            console.error(err);
            toast.error("Verification failed");
          }
        },

        prefill: {
          name: formData.name,
          contact: formData.phone,
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();

    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login?redirect=checkout');
      return;
    }

    if (paymentMethod === 'online') {
      await handleOnlinePayment();
      return;
    }

    // Verify city one more time
    const cityCheck = verifyCity(formData.address);
    if (!cityCheck.valid) {
      setAddressError(cityCheck.error || 'Invalid delivery location');
      toast.error('Please enter a valid delivery address');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await placeOrder({
        userId: user.id,
        items: cart.map(item => ({
          food: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        totalAmount: total,
        // paymentStatus: paymentMethod === 'online' ? 'completed' : 'pending',
        paymentMethod,
        orderStatus: 'pending',
        customerName: formData.name,
        customerPhone: formData.phone,
        deliveryAddress: formData.address,
        deliveryCity: cityCheck.city || '',
        deliveryInstructions: formData.deliveryInstructions,
      });

      if (result.success) {
        toast.success('Order placed successfully!');
        navigate(`/orders`);
      } else {
        toast.error(result.error || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Enter coupon code');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/offers/code/${couponCode}`
      );

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      const offer = data.data;

      if (subtotal < offer.minOrderAmount) {
        toast.error(
          `Minimum order ₹${offer.minOrderAmount} required`
        );
        return;
      }

      let discountAmount = 0;

      if (offer.discountType === 'percentage') {
        discountAmount =
          (subtotal * offer.discountValue) / 100;

        if (
          offer.maxDiscount &&
          discountAmount > offer.maxDiscount
        ) {
          discountAmount = offer.maxDiscount;
        }
      }

      if (offer.discountType === 'flat') {
        discountAmount = offer.discountValue;
      }

      setDiscount(discountAmount);
      setAppliedOffer(offer);

      toast.success(
        `${offer.code} applied successfully`
      );
    } catch (err) {
      toast.error('Failed to apply coupon');
    }
  };

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-2">
                <User className="h-6 w-6 text-blue-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Phone Number * (Indian Mobile)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                Delivery Address
              </h2>
              <textarea
                required
                rows={4}
                value={formData.address}
                onChange={(e) => handleAddressChange(e.target.value)}
                className={`w-full px-4 py-3 border-2 ${addressError ? 'border-red-500' : 'border-gray-200'
                  } rounded-lg focus:border-blue-500 focus:outline-none transition-colors`}
                placeholder="Enter your complete delivery address with city name"
              />
              {addressError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{addressError}</p>
                  </div>
                </div>
              )}
              {!addressError && formData.address.length > 10 && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                  <Check className="h-5 w-5" />
                  <span>Delivery available at this location</span>
                </div>
              )}
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>We currently deliver in:</strong> {supportedCities.join(', ')}
                </p>
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Delivery Instructions (Optional)
              </h2>
              <textarea
                rows={3}
                value={formData.deliveryInstructions}
                onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="E.g., Ring the doorbell, Leave at the door, etc."
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-blue-600" />
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors group">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="w-5 h-5 text-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Pay Online (Razorpay)</span>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">UPI, Cards, NetBanking, Wallets</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-5 h-5 text-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-600 mt-1">Pay when you receive</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'online' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    🔒 <strong>Secure Payment:</strong> Your payment is processed through Razorpay's secure gateway. We never store your card details.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex gap-10">
                <h3 className="text-xl font-semibold mb-4">
                  Apply Coupon
                </h3>
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="bg-blue-600 text-white px-3 rounded-lg mb-4"
                >
                  Apply
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) =>
                    setCouponCode(e.target.value.toUpperCase())
                  }
                  placeholder="Enter coupon code"
                  className="flex-1 border rounded-lg px-3 py-2"
                />
              </div>

              {appliedOffer && (
                <p className="mt-3 text-green-600">
                  Coupon {appliedOffer.code} applied.
                  Discount ₹{discount}
                </p>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-medium mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm pb-3 border-b">
                    <span className="text-gray-700">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>GST (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-medium text-black pt-2 border-t">
                  <span>Total</span>
                  <span className="text-blue-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !!addressError}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    {paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
