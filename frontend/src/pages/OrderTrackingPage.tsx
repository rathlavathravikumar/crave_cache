import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Package, 
  Truck, 
  Home,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/index';
import api from '../api';
import '../styles/pages.css';

interface StatusHistory {
  status: string;
  timestamp: string;
  notes?: string;
}

interface OrderDetails {
  _id: string;
  orderStatus: string;
  totalPrice: number;
  estimatedDeliveryTime?: number;
  deliveryInfo?: {
    address: string;
    city: string;
    phoneNo: string;
  };
  statusHistory: StatusHistory[];
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

const statusConfig: Record<string, { icon: any; label: string; color: string }> = {
  Pending: { icon: Clock, label: 'Pending', color: '#f59e0b' },
  Confirmed: { icon: CheckCircle, label: 'Confirmed', color: '#10b981' },
  Preparing: { icon: Package, label: 'Preparing', color: '#3b82f6' },
  Ready: { icon: Package, label: 'Ready', color: '#8b5cf6' },
  OutForDelivery: { icon: Truck, label: 'Out for Delivery', color: '#f97316' },
  Delivered: { icon: Home, label: 'Delivered', color: '#10b981' },
  Cancelled: { icon: AlertCircle, label: 'Cancelled', color: '#ef4444' },
  Failed: { icon: AlertCircle, label: 'Failed', color: '#ef4444' }
};

const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'OutForDelivery', 'Delivered'];

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page order-tracking-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page order-tracking-page">
        <div className="error-state">
          <AlertCircle size={48} />
          <h2>Unable to Load Order</h2>
          <p>{error || 'Order not found'}</p>
          <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusOrder.indexOf(order.orderStatus);
  const currentConfig = statusConfig[order.orderStatus] || statusConfig.Pending;
  const CurrentIcon = currentConfig.icon;

  const estimatedDelivery = order.estimatedDeliveryTime 
    ? new Date(Date.now() + order.estimatedDeliveryTime * 60000).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Not available';

  return (
    <div className="page order-tracking-page">
      <div className="tracking-header">
        <button className="back-btn" onClick={() => navigate('/orders')}>
          <ArrowLeft size={20} />
          Back to Orders
        </button>
        <h1>Order Tracking</h1>
        <p className="order-id">Order #{order._id.slice(-8)}</p>
      </div>

      <div className="tracking-content">
        {/* Current Status Card */}
        <div className="status-card current">
          <div className="status-icon" style={{ backgroundColor: currentConfig.color }}>
            <CurrentIcon size={32} />
          </div>
          <div className="status-info">
            <h2>{currentConfig.label}</h2>
            <p>Estimated delivery: {estimatedDelivery}</p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="timeline-section">
          <h3>Order Timeline</h3>
          <div className="timeline">
            {statusOrder.slice(0, currentStatusIndex + 1).map((status) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              const statusHistory = order.statusHistory.find(h => h.status === status);
              
              return (
                <div key={status} className="timeline-item">
                  <div className="timeline-marker" style={{ backgroundColor: config.color }}>
                    <Icon size={16} />
                  </div>
                  <div className="timeline-content">
                    <h4>{config.label}</h4>
                    {statusHistory && (
                      <p className="timeline-time">
                        {new Date(statusHistory.timestamp).toLocaleString('en-IN')}
                      </p>
                    )}
                    {statusHistory?.notes && (
                      <p className="timeline-notes">{statusHistory.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Information */}
        {order.deliveryInfo && (
          <div className="delivery-info">
            <h3>Delivery Information</h3>
            <div className="info-row">
              <MapPin size={20} />
              <div>
                <p className="label">Delivery Address</p>
                <p>{order.deliveryInfo.address}, {order.deliveryInfo.city}</p>
              </div>
            </div>
            {order.deliveryInfo.phoneNo && (
              <div className="info-row">
                <Phone size={20} />
                <div>
                  <p className="label">Contact Number</p>
                  <p>{order.deliveryInfo.phoneNo}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="order-items">
          <h3>Order Items</h3>
          {order.orderItems.map((item, index) => (
            <div key={index} className="order-item">
              <span>{item.name} x{item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="order-total">
            <span>Total</span>
            <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Support */}
        <div className="support-section">
          <h3>Need Help?</h3>
          <p>If you have any issues with your order, please contact our support team.</p>
          <Button variant="outline" size="lg" fullWidth>
            <Phone size={18} />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
