import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ShoppingCart, PhoneCall } from 'lucide-react';
import { Button } from '../components/ui/index';
import '../styles/pages.css';

export default function PaymentFailurePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reason = searchParams.get('reason') || 'Your payment could not be processed';
  const orderId = searchParams.get('order_id');
  const errorCode = searchParams.get('error_code');

  const getErrorMessage = () => {
    switch (errorCode) {
      case 'card_declined':
        return 'Your card was declined. Please try a different card or payment method.';
      case 'insufficient_funds':
        return 'Insufficient funds in your account. Please check your balance.';
      case 'expired_card':
        return 'Your card has expired. Please use a valid card.';
      case 'invalid_card':
        return 'The card details provided are invalid. Please check and try again.';
      case 'network_error':
        return 'Network connection error. Please check your internet and try again.';
      case 'timeout':
        return 'Payment processing timed out. Please try again.';
      case 'cancelled':
        return 'Payment was cancelled. Your cart has been saved.';
      default:
        return reason;
    }
  };

  return (
    <div className="page payment-result-page">
      <div className="result-container error">
        {/* Error Icon */}
        <div className="result-icon error-icon">
          <AlertCircle size={80} />
        </div>

        {/* Main Message */}
        <h1 className="result-title error">Payment Failed</h1>
        <p className="result-subtitle">
          {getErrorMessage()}
        </p>

        {/* Error Details Card */}
        <div className="error-details-card">
          <div className="error-detail-row">
            <span className="label">Error Code:</span>
            <span className="code">{errorCode || 'PAYMENT_FAILED'}</span>
          </div>

          {orderId && (
            <div className="error-detail-row">
              <span className="label">Order ID:</span>
              <span className="value">{orderId}</span>
            </div>
          )}

          <div className="info-box warning">
            <p>
              ✓ Your cart has been saved. You can complete your payment anytime.
            </p>
          </div>
        </div>

        {/* Troubleshooting Tips */}
        <div className="troubleshooting-section">
          <h3>Troubleshooting Tips:</h3>
          <ul className="tips-list">
            <li>Check if your card is valid and not expired</li>
            <li>Ensure sufficient funds in your account</li>
            <li>Try using a different payment method or card</li>
            <li>Check your internet connection</li>
            <li>Contact your bank to verify the transaction</li>
            <li>Try again after some time</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="result-actions">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/checkout')}
          >
            Retry Payment
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate('/cart')}
            className="with-icon"
          >
            <ShoppingCart size={18} />
            Back to Cart
          </Button>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => navigate('/')}
            className="with-icon"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Button>
        </div>

        {/* Support Section */}
        <div className="support-section">
          <h3>Need Help?</h3>
          <p>
            If you continue to experience issues, our support team is here to help.
          </p>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            className="with-icon"
          >
            <PhoneCall size={18} />
            Contact Support
          </Button>
          <p className="support-info">
            Call us at: <a href="tel:+911234567890">+91-1234567890</a>
          </p>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h3>Common Questions</h3>
          <div className="faq-item">
            <p><strong>Q: Will I be charged twice?</strong></p>
            <p>A: No, you will not be charged. The failed transaction will not be processed.</p>
          </div>
          <div className="faq-item">
            <p><strong>Q: What payment methods are available?</strong></p>
            <p>A: We accept all major credit cards, debit cards, and UPI payments.</p>
          </div>
          <div className="faq-item">
            <p><strong>Q: How long will my cart be saved?</strong></p>
            <p>A: Your cart will be saved for 24 hours. After that, items may be removed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
