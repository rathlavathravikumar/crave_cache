import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Truck, Tag, AlertCircle } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { clearCart } from '../redux/cartSlice';
import { setPaymentInProgress, setPaymentError } from '../redux/orderSlice';
import api from '../api';
import { Button, Error as ErrorCard } from '../components/ui/index';
import AddressSelector from '../components/AddressSelector';
import '../styles/pages.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.user);
  const { paymentInProgress, paymentError } = useSelector((state: RootState) => state.orders);

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountType: string; discountValue?: number; maxDiscountAmount?: number } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(user?.addresses?.[0] ? {
    ...user.addresses[0],
    pincode: user.addresses[0].pincode || user.addresses[0].postalCode || '',
  } : null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Return to cart if no items
  if (!cart.items.length) {
    return (
      <div className="page">
        <div className="section-header">
          <h2>Checkout</h2>
        </div>
        <ErrorCard
          message="Cart is empty"
          description="Please add items to your cart before checking out"
        />
        <div className="result-actions">
          <Button variant="primary" size="lg" onClick={() => navigate('/restaurants')}>
            Back to shopping
          </Button>
        </div>
      </div>
    );
  }

  // Check if user has addresses
  if (!selectedAddress && (!user?.addresses || user.addresses.length === 0)) {
    return (
      <div className="page">
        <div className="section-header">
          <h2>Checkout</h2>
        </div>
        <ErrorCard
          message="No delivery address"
          description="Please add a delivery address to your profile before proceeding"
        />
        <div className="result-actions">
          <Button variant="primary" size="lg" onClick={() => navigate('/profile')}>
            Go to profile
          </Button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const deliveryFee = 50; // ₹50 delivery fee
  const discount = couponDiscount;
  const total = subtotal + tax + deliveryFee - discount;

  // Validate coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError('');

    try {
      const response = await api.post('/coupons/validate', {
        code: couponCode,
        cartTotal: subtotal
      });

      if (response.data.success) {
        setCouponDiscount(response.data.discountAmount);
        setAppliedCoupon(response.data.coupon || { code: couponCode.trim().toUpperCase() });
        setCouponCode('');
      }
    } catch (error: any) {
      setCouponError(error.response?.data?.message || 'Invalid coupon code');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!selectedAddress) {
      return;
    }

    try {
      dispatch(setPaymentInProgress(true));
      dispatch(setPaymentError(null));

      // Create order first
      const orderResponse = await api.post('/order/new', {
        restaurant: cart.restaurantId,
        orderItems: cart.items.map(item => ({
          foodItem: item.foodItem._id,
          name: item.foodItem.name,
          price: item.foodItem.price,
          quantity: item.quantity,
          image: item.foodItem.images?.[0]?.url || ''
        })),
        deliveryInfo: {
          address: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          phoneNo: user?.phone || '',
          postalCode: selectedAddress.pincode || selectedAddress.postalCode || '',
          country: selectedAddress.country,
          coordinates: {
            latitude: 0,
            longitude: 0
          }
        },
        itemsPrice: subtotal,
        taxPrice: tax,
        deliveryPrice: deliveryFee,
        discountAmount: discount,
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discountType: appliedCoupon.discountType,
          discountValue: appliedCoupon.discountValue || 0,
          maxDiscountAmount: appliedCoupon.maxDiscountAmount
        } : undefined,
        totalPrice: total,
        paymentInfo: {
          status: 'pending'
        }
      });

      if (!orderResponse.data.success) {
        throw new Error('Failed to create order');
      }

      const orderId = orderResponse.data.order._id;

      // Create Stripe session with order ID in metadata
      const paymentResponse = await api.post('/payment/process', {
        items: cart.items,
        restaurantId: cart.restaurantId,
        orderId: orderId,
        totalAmount: total
      });

      if (paymentResponse.data.url) {
        dispatch(clearCart());
        // Redirect to Stripe checkout
        window.location.href = paymentResponse.data.url;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Payment failed. Please try again.';
      dispatch(setPaymentError(errorMessage));
    } finally {
      dispatch(setPaymentInProgress(false));
    }
  };

  return (
    <div className="page checkout-page">
      <div className="section-header">
        <h2>Order Summary</h2>
        <p className="subtitle">Review your order before payment</p>
      </div>

      <div className="checkout-container">
        {/* Order Items */}
        <div className="checkout-section">
          <h3 className="section-title">Order Items</h3>
          <div className="checkout-items">
            {cart.items.map((item) => (
              <div key={item.foodItem._id} className="checkout-item">
                <div className="checkout-item__info">
                  <strong>{item.foodItem.name}</strong>
                  <span className="checkout-item__qty">x{item.quantity}</span>
                </div>
                <span className="checkout-item__price">₹{(item.foodItem.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="checkout-section">
          <div className="section-title-with-icon">
            <MapPin size={20} />
            <h3>Delivery Address</h3>
          </div>
          <AddressSelector
            selectedAddressId={selectedAddress?._id}
            onAddressSelect={setSelectedAddress}
            compact={true}
          />
        </div>

        {/* Coupon Code */}
        <div className="checkout-section">
          <div className="section-title-with-icon">
            <Tag size={20} />
            <h3>Apply Coupon</h3>
          </div>
          <div className="coupon-input-group">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setCouponError('');
              }}
              className="coupon-input"
              disabled={isValidatingCoupon || discount > 0}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={applyCoupon}
              disabled={isValidatingCoupon || discount > 0}
              className="coupon-button"
            >
              {isValidatingCoupon ? 'Applying...' : 'Apply'}
            </Button>
          </div>
          {couponError && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{couponError}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="success-message">
              ✓ Coupon applied! Discount: ₹{discount.toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="checkout-section">
          <h3 className="section-title">Price Breakdown</h3>
          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="price-row">
              <span>Tax (18% GST)</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="price-row">
              <span className="delivery-label">
                <Truck size={16} />
                Delivery Fee
              </span>
              <span>₹{deliveryFee.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="price-row discount">
                <span>Discount</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="price-row total">
              <span>Total Amount</span>
              <span className="total-amount">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{paymentError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="checkout-actions">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => navigate('/cart')}
            disabled={paymentInProgress}
          >
            Back to Cart
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handlePayment}
            disabled={paymentInProgress || !selectedAddress}
          >
            {paymentInProgress ? (
              <>
                <span className="loading-spinner"></span>
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
