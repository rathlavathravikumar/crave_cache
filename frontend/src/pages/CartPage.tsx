import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { removeFromCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '../components/ui/index';

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.user);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const totalPrice = cart.items.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
  const tax = Math.round(totalPrice * 0.18); // 18% GST
  const deliveryFee = 50;

  return (
    <div className="page">
      <div className="section-header">
        <h2>Your cart</h2>
        <span className="cart-count">{cart.items.length} items</span>
      </div>
      
      {cart.items.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart size={48} />}
          title="Your cart is empty"
          description="Add some delicious items to get started!"
          action={{
            label: "Browse restaurants",
            onClick: () => navigate('/restaurants')
          }}
        />
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.foodItem._id} className="cart-item">
                <div className="cart-item__info">
                  <strong className="cart-item__name">{item.foodItem.name}</strong>
                  <span className="cart-item__price">₹{item.foodItem.price}</span>
                </div>
                <div className="cart-item__quantity">
                  <span className="cart-item__quantity-label">x{item.quantity}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => dispatch(removeFromCart(item.foodItem._id))}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary__row">
              <span>Tax (18% GST)</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary__row">
              <span>Delivery fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="cart-summary__row cart-summary__total">
              <span>Total</span>
              <span>₹{(totalPrice + tax + deliveryFee).toLocaleString('en-IN')}</span>
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth
              onClick={handleCheckout}
            >
              Proceed to checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
