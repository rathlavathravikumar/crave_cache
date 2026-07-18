import React from 'react';
import { Loader2 } from 'lucide-react';
import './Loading.css';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'inherit';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = `loading--${size}`;
  const colorClasses = `loading--${color}`;
  
  const combinedClasses = [
    'loading',
    sizeClasses,
    colorClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses}>
      <Loader2 className="loading__spinner" />
    </div>
  );
};

// Full Page Loading
export interface FullPageLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'inherit';
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  message = 'Loading...',
  size = 'lg',
  color = 'primary'
}) => {
  return (
    <div className="full-page-loading">
      <Loading size={size} color={color} />
      {message && <p className="full-page-loading__message">{message}</p>}
    </div>
  );
};

// Skeleton Component
export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = ''
}) => {
  const variantClasses = `skeleton--${variant}`;
  const animationClasses = animation !== 'none' ? `skeleton--${animation}` : '';
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const combinedClasses = [
    'skeleton',
    variantClasses,
    animationClasses,
    className
  ].filter(Boolean).join(' ');

  return <div className={combinedClasses} style={style} />;
};

// Card Skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`card-skeleton ${className}`}>
      <Skeleton variant="rectangular" height={180} className="card-skeleton__image" />
      <div className="card-skeleton__content">
        <Skeleton variant="text" width="70%" height={24} className="card-skeleton__title" />
        <Skeleton variant="text" width="40%" height={20} className="card-skeleton__subtitle" />
        <Skeleton variant="text" width="100%" height={16} className="card-skeleton__text" />
        <Skeleton variant="text" width="80%" height={16} className="card-skeleton__text" />
      </div>
    </div>
  );
};

// List Skeleton
export const ListSkeleton: React.FC<{ 
  items?: number;
  className?: string 
}> = ({ 
  items = 3,
  className = '' 
}) => {
  return (
    <div className={`list-skeleton ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="list-skeleton__item">
          <Skeleton variant="circular" width={48} height={48} className="list-skeleton__avatar" />
          <div className="list-skeleton__content">
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={16} />
          </div>
        </div>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton: React.FC<{ 
  rows?: number;
  columns?: number;
  className?: string 
}> = ({ 
  rows = 5,
  columns = 4,
  className = '' 
}) => {
  return (
    <div className={`table-skeleton ${className}`}>
      <div className="table-skeleton__header">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" width="100%" height={20} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="table-skeleton__row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width="100%" height={16} />
          ))}
        </div>
      ))}
    </div>
  );
};

// Button Skeleton
export const ButtonSkeleton: React.FC<{ 
  width?: string | number;
  height?: string | number;
  className?: string 
}> = ({ 
  width = 120,
  height = 40,
  className = '' 
}) => {
  return (
    <Skeleton 
      variant="rounded" 
      width={width} 
      height={height}
      className={`button-skeleton ${className}`}
    />
  );
};

// Input Skeleton
export const InputSkeleton: React.FC<{ 
  width?: string | number;
  height?: string | number;
  className?: string 
}> = ({ 
  width = '100%',
  height = 48,
  className = '' 
}) => {
  return (
    <div className={`input-skeleton ${className}`}>
      <Skeleton 
        variant="rounded" 
        width={width} 
        height={height}
      />
    </div>
  );
};

// Progress Bar
export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'error';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = `progress-bar--${size}`;
  const colorClasses = `progress-bar--${color}`;
  
  const combinedClasses = [
    'progress-bar',
    sizeClasses,
    colorClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses}>
      <div 
        className="progress-bar__fill" 
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
      {showLabel && (
        <span className="progress-bar__label">{Math.round(percentage)}%</span>
      )}
    </div>
  );
};

// Loading Overlay
export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'inherit';
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  size = 'lg',
  color = 'primary',
  className = ''
}) => {
  if (!isLoading) return null;

  return (
    <div className={`loading-overlay ${className}`}>
      <div className="loading-overlay__content">
        <Loading size={size} color={color} />
        {message && <p className="loading-overlay__message">{message}</p>}
      </div>
    </div>
  );
};

// Inline Loading
export interface InlineLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'inherit';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = 'Loading...',
  size = 'sm',
  color = 'primary',
  className = ''
}) => {
  return (
    <div className={`inline-loading ${className}`}>
      <Loading size={size} color={color} />
      <span className="inline-loading__message">{message}</span>
    </div>
  );
};

export default Loading;