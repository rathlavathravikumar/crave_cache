import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, PhoneCall } from 'lucide-react';
import { Button, Loading } from '../components/ui/index';
import api from '../api';
import '../styles/pages.css';

interface OrderDetails {
  _id: string;
  totalPrice: number;
  orderStatus: string;
  estimatedDeliveryTime?: number;
  deliveryInfo?: {
    address: string;
    city: string;
    phoneNo: string;
  };
  orderItems?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        if (!orderId) {
          setError('Order ID not found');
          return;
        }

        const response = await api.get(`/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError('Failed to load order details');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <Loading message="Loading your order confirmation..." />;
  }

  if (error || !order) {
    return (
      <div className="page payment-result-page">
        <div className="result-container error">
          <h2>Unable to Load Order</h2>
          <p>{error || 'Your order could not be loaded'}</p>
          <div className="result-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/orders')}
            >
              View All Orders
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/')}
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const estimatedMinutes = order.estimatedDeliveryTime || 30;
  const deliveryTime = new Date(Date.now() + estimatedMinutes * 60000).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="page payment-result-page">
      <div className="result-container success">
        {/* Success Icon */}
        <div className="result-icon">
          <CheckCircle size={80} />
        </div>

        {/* Main Message */}
        <h1 className="result-title">Order Confirmed!</h1>
        <p className="result-subtitle">
          Thank you for your order. Your payment has been successfully processed.
        </p>

        {/* Order Details Card */}
        <div className="order-details-card">
          {/* Order Number */}
          <div className="details-row">
            <span className="label">Order ID:</span>
            <span className="value">{order._id}</span>
          </div>

          {/* Order Amount */}
          <div className="details-row highlight">
            <span className="label">Total Amount:</span>
            <span className="amount">₹{order.totalPrice.toLocaleString('en-IN')}</span>
          </div>

          {/* Status */}
          <div className="details-row">
            <span className="label">Status:</span>
            <span className="status-badge confirmed">{order.orderStatus}</span>
          </div>

          {/* Estimated Delivery */}
          <div className="details-row">
            <div className="icon-label">
              <Clock size={18} />
              <span>Estimated Delivery</span>
            </div>
            <span className="value">{deliveryTime} (~ {estimatedMinutes} mins)</span>
          </div>

          {/* Delivery Address */}
          {order.deliveryInfo && (
            <div className="details-row">
              <div className="icon-label">
                <MapPin size={18} />
                <span>Delivery Address</span>
              </div>
              <div className="address-info">
                <p>{order.deliveryInfo.address}</p>
                <p>{order.deliveryInfo.city}</p>
              </div>
            </div>
          )}

          {/* Contact */}
          {order.deliveryInfo?.phoneNo && (
            <div className="details-row">
              <div className="icon-label">
                <PhoneCall size={18} />
                <span>Contact Number</span>
              </div>
              <span className="value">{order.deliveryInfo.phoneNo}</span>
            </div>
          )}
        </div>

        {/* Order Items Summary */}
        {order.orderItems && order.orderItems.length > 0 && (
          <div className="order-items-summary">
            <h3>Order Items</h3>
            {order.orderItems.map((item, index) => (
              <div key={index} className="item-row">
                <span>{item.name} (x{item.quantity})</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}

        {/* Info Message */}
        <div className="info-box">
          <p>
            📍 <strong>Live tracking coming soon!</strong> You'll be able to track your delivery in real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="result-actions">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/orders')}
          >
            Track Your Order
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate('/')}
          >
            Order Again
          </Button>
        </div>

        {/* Support */}
        <div className="support-info">
          <p>
            Questions? <a href="#support">Contact support</a> or call us at +91-1234567890
          </p>
        </div>
      </div>
    </div>
  );
}
