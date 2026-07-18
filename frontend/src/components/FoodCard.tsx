import React from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Minus, Heart, Clock, Star } from 'lucide-react';
import type { AppDispatch } from '../redux/store';
import { addToCart } from '../redux/cartSlice';
import type { FoodItem } from '../types';
import { Card, CardImage, CardBody, PriceBadge, Button } from './ui/index';
import { getFoodItemImage, placeholder } from '../utils/imageUtils';
import './FoodCard.css';

export default function FoodCard({ foodItem, restaurantId }: { foodItem: FoodItem; restaurantId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = React.useState(1);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart({ foodItem, restaurantId, quantity }));
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  return (
    <Card 
      variant="elevated" 
      hover={true} 
      padding="none"
      rounded="xl"
      className="food-card"
    >
      <CardImage 
        src={
          foodItem.images?.[0]?.url
            ? (foodItem.images[0].url.startsWith('http') ? foodItem.images[0].url : getFoodItemImage(foodItem.images[0].url))
            : placeholder.food
        }
        alt={foodItem.name}
        aspectRatio="1:1"
      />
      
      <button 
        className={`food-card__favorite ${isFavorite ? 'food-card__favorite--active' : ''}`}
        onClick={() => setIsFavorite(!isFavorite)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart 
          size={18} 
          fill={isFavorite ? 'currentColor' : 'none'} 
          strokeWidth={isFavorite ? 0 : 2}
        />
      </button>
      
      <CardBody className="food-card__body">
        <div className="food-card__header">
          <h3 className="food-card__name">{foodItem.name}</h3>
          <div className="food-card__rating">
            <Star size={14} fill="currentColor" strokeWidth={0} />
            <span>4.5</span>
          </div>
        </div>
        
        <p className="food-card__description">{foodItem.description}</p>
        
        <div className="food-card__meta">
          <div className="food-card__prep-time">
            <Clock size={14} />
            <span>20-25 min</span>
          </div>
          <span className="food-card__divider">•</span>
          <span className="food-card__stock">{foodItem.stock} available</span>
        </div>
        
        <div className="food-card__footer">
          <PriceBadge 
            price={foodItem.price} 
            originalPrice={Math.round(foodItem.price * 1.2)}
            discount={20}
          />
          
          <div className="food-card__actions">
            <div className="food-card__quantity">
              <button 
                className="food-card__quantity-btn"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="food-card__quantity-value">{quantity}</span>
              <button 
                className="food-card__quantity-btn"
                onClick={incrementQuantity}
                disabled={quantity >= 10}
              >
                <Plus size={16} />
              </button>
            </div>
            
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleAddToCart}
              className="food-card__add-btn"
            >
              Add
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
