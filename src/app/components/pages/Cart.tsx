import { Link, useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart, user } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const deliveryFee = cart.length > 0 ? 5.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-16 w-16 text-blue-900" />
          </div>
          <h2 className="text-3xl font-serif mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Discover our exquisite menu and add items to your cart</p>
          <Link
            to="/menu"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg inline-block transition-all shadow-lg"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-serif mb-6 sm:mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium text-black mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1 w-fit">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="hover:bg-white p-2 rounded transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-10 text-center font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="hover:bg-white p-2 rounded transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xl sm:text-2xl font-medium text-blue-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-xl sm:text-2xl font-medium mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg sm:text-xl font-medium text-black">
                  <span>Total</span>
                  <span className="text-blue-900">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-4 rounded-lg font-medium shadow-lg transition-all"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/menu"
              className="block text-center text-blue-900 hover:text-blue-700 mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
