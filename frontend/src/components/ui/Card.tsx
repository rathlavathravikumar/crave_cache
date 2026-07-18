import React from 'react';
import { ChevronRight, Heart, Star } from 'lucide-react';
import './Card.css';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  hover?: boolean;
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  hover = false,
  clickable = false,
  className = '',
  onClick,
}) => {
  const baseClasses = 'card';
  const variantClasses = `card--${variant}`;
  const paddingClasses = `card--padding-${padding}`;
  const roundedClasses = `card--rounded-${rounded}`;
  const hoverClass = hover ? 'card--hover' : '';
  const clickableClass = clickable ? 'card--clickable' : '';
  
  const combinedClasses = [
    baseClasses,
    variantClasses,
    paddingClasses,
    roundedClasses,
    hoverClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
};

// Card Header Component
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`card__header ${className}`}>{children}</div>;
};

// Card Body Component
export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`card__body ${className}`}>{children}</div>;
};

// Card Footer Component
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`card__footer ${className}`}>{children}</div>;
};

// Card Image Component
export interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2';
  className?: string;
}

export const CardImage: React.FC<CardImageProps> = ({ 
  src, 
  alt, 
  aspectRatio = '16:9',
  className = '' 
}) => {
  const aspectRatioClasses = `card__image--aspect-${aspectRatio.replace(':', '-')}`;
  
  return (
    <div className={`card__image ${aspectRatioClasses} ${className}`}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
};

// Card Actions Component
export interface CardActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const CardActions: React.FC<CardActionsProps> = ({ children, className = '' }) => {
  return <div className={`card__actions ${className}`}>{children}</div>;
};

// Favorite Button Component
export interface FavoriteButtonProps {
  isFavorite?: boolean;
  onClick?: () => void;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  isFavorite = false, 
  onClick,
  className = '' 
}) => {
  return (
    <button 
      className={`card__favorite ${isFavorite ? 'card__favorite--active' : ''} ${className}`}
      onClick={onClick}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        size={20} 
        fill={isFavorite ? 'currentColor' : 'none'} 
        strokeWidth={isFavorite ? 0 : 2}
      />
    </button>
  );
};

// Rating Badge Component
export interface RatingBadgeProps {
  rating: number;
  maxRating?: number;
  showCount?: boolean;
  reviewCount?: number;
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({ 
  rating, 
  maxRating: _maxRating = 5,
  showCount = false,
  reviewCount,
  className = '' 
}) => {
  return (
    <div className={`card__rating ${className}`}>
      <Star size={16} fill="currentColor" strokeWidth={0} />
      <span className="card__rating-value">{rating.toFixed(1)}</span>
      {showCount && reviewCount && (
        <span className="card__rating-count">({reviewCount})</span>
      )}
    </div>
  );
};

// Price Badge Component
export interface PriceBadgeProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  className?: string;
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({ 
  price, 
  originalPrice,
  discount,
  currency = '₹',
  className = '' 
}) => {
  return (
    <div className={`card__price ${className}`}>
      <span className="card__price-current">{currency}{price}</span>
      {originalPrice && (
        <span className="card__price-original">{currency}{originalPrice}</span>
      )}
      {discount && (
        <span className="card__price-discount">{discount}% OFF</span>
      )}
    </div>
  );
};

// Quick Action Button Component
export interface QuickActionButtonProps {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  icon = <ChevronRight size={20} />,
  label,
  onClick,
  className = '' 
}) => {
  return (
    <button className={`card__quick-action ${className}`} onClick={onClick}>
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Card;