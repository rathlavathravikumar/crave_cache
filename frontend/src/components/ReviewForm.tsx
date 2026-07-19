import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from './ui/index';
import api from '../api';

interface ReviewFormProps {
  orderId: string;
  restaurantId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ orderId, restaurantId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (review.trim().length < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/reviews', {
        order: orderId,
        restaurant: restaurantId,
        rating,
        review
      });

      setRating(0);
      setReview('');
      onReviewSubmitted?.();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form">
      <h3>Write a Review</h3>
      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="star-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star size={24} fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <span className="rating-text">
            {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
          </span>
        </div>

        {/* Review Text */}
        <div className="review-textarea">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this restaurant..."
            rows={4}
            maxLength={500}
          />
          <span className="char-count">{review.length}/500</span>
        </div>

        {error && <div className="error-message">{error}</div>}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner"></span>
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Review
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
