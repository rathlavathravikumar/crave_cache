import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchOrders } from '../redux/orderSlice';

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="page">
      <h2>Orders</h2>
      {orders.length === 0 ? <p>No orders yet.</p> : orders.map((order) => (
        <div key={order._id} className="card">
          <h3>Order #{order._id.slice(-4)}</h3>
          <p>Status: {order.orderStatus}</p>
          <p>Total: ₹{order.totalPrice}</p>
        </div>
      ))}
    </div>
  );
}
