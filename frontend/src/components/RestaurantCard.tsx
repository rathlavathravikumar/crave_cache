import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import type { Restaurant } from '../types';
import { Card, CardImage, CardBody, RatingBadge, QuickActionButton } from './ui/index';
import { getRestaurantImage, placeholder } from '../utils/imageUtils';
import './RestaurantCard.css';

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  
  return (
    <Link to={`/restaurants/${restaurant._id}`} className="restaurant-card-link">
      <Card 
        variant="elevated" 
        hover={true} 
        clickable={true}
        padding="none"
        rounded="xl"
        className="restaurant-card"
      >
        <CardImage 
          src={
            restaurant.images?.[0]?.url
              ? (restaurant.images[0].url.startsWith('http') ? restaurant.images[0].url : getRestaurantImage(restaurant.images[0].url))
              : placeholder.restaurant
          }
          alt={restaurant.name}
          aspectRatio="16:9"
        />
        
        <button 
          className={`restaurant-card__favorite ${isFavorite ? 'restaurant-card__favorite--active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        
        <CardBody className="restaurant-card__body">
          <div className="restaurant-card__header">
            <h3 className="restaurant-card__name">{restaurant.name}</h3>
            <RatingBadge rating={restaurant.rating} />
          </div>
          
          <div className="restaurant-card__meta">
            <span className="restaurant-card__cuisine">{restaurant.cuisine}</span>
            <span className="restaurant-card__divider">•</span>
            <span className="restaurant-card__location">
              <MapPin size={14} />
              {restaurant.location}
            </span>
          </div>
          
          <p className="restaurant-card__description">
            {restaurant.description || 'Freshly prepared favorites delivered with care.'}
          </p>
          
          <div className="restaurant-card__footer">
            <div className="restaurant-card__delivery-info">
              <Clock size={14} />
              <span>25-35 min</span>
            </div>
            <QuickActionButton />
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
