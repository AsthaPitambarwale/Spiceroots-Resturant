import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Package, Clock, CheckCircle, TruckIcon, XCircle, Phone, User, MapPin, Star } from 'lucide-react';
import { useApp, Order } from '../../context/AppContext';
import { toast } from 'sonner';
import reviewsApi from '../../api/reviews';

export const OrderTracking = () => {
  const { orders, user, addReview } = useApp();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'preparing':
        return <Package className="h-6 w-6 text-blue-500" />;
      case 'ready':
        return <Package className="h-6 w-6 text-purple-500" />;
      case 'out_for_delivery':
        return <TruckIcon className="h-6 w-6 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ready':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'out_for_delivery':
        return 'Out for Delivery';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleSubmitReview = async () => {
    try {
      await reviewsApi.createReview({
        order: selectedOrder.id,
        food: selectedOrder.items[0].id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });

      console.log('Review created:', response);

      toast.success('Review submitted');
      setShowReviewModal(false);
      setReviewData({
        rating: 5,
        comment: '',
      });
    } catch (error: any) {
      console.error('Review Error:', error);
      console.error('Response Data:', error?.data);
      console.error('Message:', error?.message);

      toast.error(error?.message || 'Failed to submit review');
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'preparing': return 50;
      case 'ready': return 65;
      case 'out_for_delivery': return 85;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif mb-8">Track Your Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-medium mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">Start ordering delicious Indian food</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all shadow-lg"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium text-black mb-1">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className={`px-5 py-2 rounded-full font-medium border-2 ${getStatusColor(order.orderStatus)}`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.orderStatus)}
                      <span>{getStatusText(order.orderStatus)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Order Progress</span>
                    <span className="text-sm font-medium text-blue-600">{getProgressPercentage(order.orderStatus)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(order.orderStatus)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Delivery Partner Info */}
                {order.deliveryPartner && (order.orderStatus === 'out_for_delivery' || order.orderStatus === 'delivered') && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <h4 className="font-medium mb-4 flex items-center gap-2 text-blue-900">
                      <TruckIcon className="h-5 w-5" />
                      Delivery Partner Details
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Name</p>
                          <p className="font-medium text-blue-900">{order.deliveryPartner.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Phone className="h-5 w-5 text-green-700" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Contact</p>
                          <a href={`tel:${order.deliveryPartner.phone}`} className="font-medium text-green-700 hover:text-green-800">
                            {order.deliveryPartner.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <TruckIcon className="h-5 w-5 text-purple-700" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Vehicle</p>
                          <p className="font-medium text-purple-900">{order.deliveryPartner.vehicle}</p>
                        </div>
                      </div>
                    </div>
                    {order.estimatedDeliveryTime && order.orderStatus === 'out_for_delivery' && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900">
                          <Clock className="inline h-4 w-4 mr-2" />
                          Estimated delivery: <strong>{order.estimatedDeliveryTime}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Order Items
                  </h4>
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-blue-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-900">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </h4>
                    <p className="text-gray-700">{order.deliveryAddress}</p>
                    <p className="text-sm text-gray-600 mt-1">{order.deliveryCity}</p>
                    {order.deliveryInstructions && (
                      <p className="text-sm text-gray-600 mt-2 italic">Note: {order.deliveryInstructions}</p>
                    )}
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-900">
                      <Phone className="h-5 w-5" />
                      Contact
                    </h4>
                    <p className="text-gray-700">{order.customerPhone}</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="flex flex-wrap justify-between items-center pt-4 border-t gap-4">
                  <div>
                    <div className="flex gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.paymentStatus === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        Payment: {order.paymentStatus}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {order.paymentMethod === 'online' ? 'Paid Online' : 'COD'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-medium text-blue-600">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    {['pending', 'preparing', 'out_for_delivery', 'delivered'].map((status, idx) => (
                      <div key={status} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getProgressPercentage(order.orderStatus) >= (idx + 1) * 25
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                            }`}>
                            {getProgressPercentage(order.orderStatus) >= (idx + 1) * 25 ? '✓' : idx + 1}
                          </div>
                          <span className="text-xs mt-2 font-medium text-center">
                            {status === 'out_for_delivery' ? 'Out for Delivery' : status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                        {idx < 3 && (
                          <div className={`h-1 flex-1 ${getProgressPercentage(order.orderStatus) > (idx + 1) * 25
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                            : 'bg-gray-200'
                            }`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Button */}
                {order.orderStatus === 'delivered' && !order.reviewed && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowReviewModal(true);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all inline-flex items-center gap-2"
                    >
                      <Star className="h-5 w-5" />
                      Rate Your Order
                    </button>
                  </div>
                )}

                {order.reviewed && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                    <p className="text-green-800 font-medium">
                      <CheckCircle className="inline h-5 w-5 mr-2" />
                      Thank you for your review!
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-medium mb-6">Rate Your Order</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">How was your food?</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${rating <= reviewData.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Share your experience</label>
              <textarea
                rows={4}
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Tell us what you loved about your order..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewData({ rating: 5, comment: '' });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitReview()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
