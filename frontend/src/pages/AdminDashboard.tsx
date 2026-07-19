import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { logoutUser } from '../redux/userSlice';
import api from '../api';
import '../styles/pages.css';

interface Statistics {
  totalOrders: number;
  totalRevenue: number;
  activeRestaurants: number;
  pendingOrders: number;
}

interface Restaurant {
  _id: string;
  name: string;
  images: Array<{ url: string }>;
  rating: number;
  location: string;
}

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  images: Array<{ url: string }>;
  restaurant: { name: string };
}

interface Order {
  _id: string;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
  user: { name: string };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'food-items' | 'orders'>('overview');
  const [statistics, setStatistics] = useState<Statistics>({
    totalOrders: 0,
    totalRevenue: 0,
    activeRestaurants: 0,
    pendingOrders: 0
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, restaurantsRes, foodItemsRes, ordersRes] = await Promise.all([
        api.get('/admin/statistics'),
        api.get('/restaurants'),
        api.get('/fooditems'),
        api.get('/admin/orders')
      ]);

      if (statsRes.data.success) setStatistics(statsRes.data.statistics);
      if (restaurantsRes.data.success) setRestaurants(restaurantsRes.data.restaurants);
      if (foodItemsRes.data.success) setFoodItems(foodItemsRes.data.foodItems);
      if (ordersRes.data.success) setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="page admin-dashboard">
        <div className="loading-state">
          <Loader2 className="animate-spin" size={48} />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <button
            className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={20} />
            Overview
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'restaurants' ? 'active' : ''}`}
            onClick={() => setActiveTab('restaurants')}
          >
            <ShoppingBag size={20} />
            Restaurants
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'food-items' ? 'active' : ''}`}
            onClick={() => setActiveTab('food-items')}
          >
            <TrendingUp size={20} />
            Food Items
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Users size={20} />
            Orders
          </button>
          <button
            className="sidebar-btn"
            onClick={() => navigate('/profile')}
          >
            <Settings size={20} />
            Settings
          </button>
        </aside>

        {/* Main Content */}
        <main className="admin-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2>Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon orders">
                    <ShoppingBag size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>{statistics.totalOrders}</h3>
                    <p>Total Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon revenue">
                    <TrendingUp size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>₹{statistics.totalRevenue.toLocaleString('en-IN')}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon restaurants">
                    <ShoppingBag size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>{statistics.activeRestaurants}</h3>
                    <p>Active Restaurants</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon pending">
                    <Users size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>{statistics.pendingOrders}</h3>
                    <p>Pending Orders</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'restaurants' && (
            <div className="restaurants-section">
              <div className="section-header">
                <h2>Restaurants</h2>
                <button className="primary-btn">
                  <Plus size={18} />
                  Add Restaurant
                </button>
              </div>
              <div className="items-grid">
                {restaurants.map(restaurant => (
                  <div key={restaurant._id} className="item-card">
                    {restaurant.images?.[0]?.url && (
                      <img src={restaurant.images[0].url} alt={restaurant.name} className="item-image" />
                    )}
                    <div className="item-info">
                      <h3>{restaurant.name}</h3>
                      <p>{restaurant.location}</p>
                      <p className="rating">⭐ {restaurant.rating}</p>
                    </div>
                    <div className="item-actions">
                      <button className="icon-btn edit">
                        <Edit size={18} />
                      </button>
                      <button className="icon-btn delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'food-items' && (
            <div className="food-items-section">
              <div className="section-header">
                <h2>Food Items</h2>
                <button className="primary-btn">
                  <Plus size={18} />
                  Add Food Item
                </button>
              </div>
              <div className="items-grid">
                {foodItems.map(item => (
                  <div key={item._id} className="item-card">
                    {item.images?.[0]?.url && (
                      <img src={item.images[0].url} alt={item.name} className="item-image" />
                    )}
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>{item.restaurant?.name}</p>
                      <p className="price">₹{item.price}</p>
                    </div>
                    <div className="item-actions">
                      <button className="icon-btn edit">
                        <Edit size={18} />
                      </button>
                      <button className="icon-btn delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <div className="section-header">
                <h2>Orders</h2>
              </div>
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-info">
                      <h3>Order #{order._id.slice(-8)}</h3>
                      <p>{order.user?.name}</p>
                      <p className="price">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="order-actions">
                      <button className="icon-btn edit">
                        <Edit size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
