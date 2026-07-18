import React from 'react';
import { AlertCircle, AlertTriangle, Info, XCircle, X, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import './Error.css';

export interface ErrorProps {
  message?: string;
  description?: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const Error: React.FC<ErrorProps> = ({
  message = 'An error occurred',
  description,
  variant = 'error',
  size = 'md',
  dismissible = false,
  onDismiss,
  className = ''
}) => {
  const variantClasses = `error--${variant}`;
  const sizeClasses = `error--${size}`;
  
  const combinedClasses = [
    'error',
    variantClasses,
    sizeClasses,
    className
  ].filter(Boolean).join(' ');

  const icons = {
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
    success: <XCircle size={20} />
  };

  return (
    <div className={combinedClasses} role="alert">
      <div className="error__icon">
        {icons[variant]}
      </div>
      <div className="error__content">
        {message && <p className="error__message">{message}</p>}
        {description && <p className="error__description">{description}</p>}
      </div>
      {dismissible && (
        <button 
          className="error__dismiss" 
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

// Error Banner
export interface ErrorBannerProps {
  message: string;
  description?: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  description,
  variant = 'error',
  dismissible = false,
  onDismiss,
  action,
  className = ''
}) => {
  const variantClasses = `error-banner--${variant}`;
  
  const combinedClasses = [
    'error-banner',
    variantClasses,
    className
  ].filter(Boolean).join(' ');

  const icons = {
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
    success: <XCircle size={20} />
  };

  return (
    <div className={combinedClasses} role="alert">
      <div className="error-banner__icon">
        {icons[variant]}
      </div>
      <div className="error-banner__content">
        <p className="error-banner__message">{message}</p>
        {description && <p className="error-banner__description">{description}</p>}
      </div>
      {action && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={action.onClick}
          className="error-banner__action"
        >
          {action.label}
        </Button>
      )}
      {dismissible && (
        <button 
          className="error-banner__dismiss" 
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

// Error Page
export interface ErrorPageProps {
  code?: number;
  title?: string;
  message?: string;
  description?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  showHome?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  illustration?: React.ReactNode;
  className?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code = 500,
  title = 'Something went wrong',
  message = 'An unexpected error occurred',
  description = 'We apologize for the inconvenience. Please try again later.',
  showRetry = true,
  onRetry,
  showHome = true,
  showBack = false,
  onBack,
  illustration,
  className = ''
}) => {
  const handleRetry = () => {
    onRetry?.();
    window.location.reload();
  };

  const handleBack = () => {
    onBack?.();
    window.history.back();
  };

  return (
    <div className={`error-page ${className}`}>
      <div className="error-page__container">
        {illustration || (
          <div className="error-page__illustration">
            <AlertCircle size={64} />
          </div>
        )}
        
        <div className="error-page__content">
          {code && (
            <div className="error-page__code">{code}</div>
          )}
          
          <h1 className="error-page__title">{title}</h1>
          
          <p className="error-page__message">{message}</p>
          
          <p className="error-page__description">{description}</p>
          
          <div className="error-page__actions">
            {showRetry && (
              <Button 
                variant="primary" 
                onClick={handleRetry}
                icon={<RefreshCw size={18} />}
              >
                Try Again
              </Button>
            )}
            
            {showBack && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                icon={<ArrowLeft size={18} />}
                iconPosition="left"
              >
                Go Back
              </Button>
            )}
            
            {showHome && (
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/'}
                icon={<Home size={18} />}
              >
                Go Home
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action,
  className = ''
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state__icon">
        {icon || <AlertCircle size={48} />}
      </div>
      
      <h3 className="empty-state__title">{title}</h3>
      
      <p className="empty-state__description">{description}</p>
      
      {action && (
        <Button 
          variant="primary" 
          onClick={action.onClick}
          className="empty-state__action"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Inline Error
export interface InlineErrorProps {
  message: string;
  className?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  message,
  className = ''
}) => {
  return (
    <div className={`inline-error ${className}`}>
      <AlertCircle size={14} />
      <span>{message}</span>
    </div>
  );
};

// Form Error
export interface FormErrorProps {
  errors: Record<string, string>;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  errors,
  className = ''
}) => {
  const errorEntries = Object.entries(errors);
  
  if (errorEntries.length === 0) return null;

  return (
    <div className={`form-error ${className}`}>
      <div className="form-error__header">
        <AlertCircle size={18} />
        <span>Please fix the following errors:</span>
      </div>
      <ul className="form-error__list">
        {errorEntries.map(([field, message]) => (
          <li key={field} className="form-error__item">
            <span className="form-error__field">{field}:</span>
            <span className="form-error__message">{message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Toast/Notification
export interface ToastProps {
  message: string;
  description?: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  description,
  variant = 'info',
  duration = 5000,
  onClose,
  className = ''
}) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const variantClasses = `toast--${variant}`;
  
  const combinedClasses = [
    'toast',
    variantClasses,
    className
  ].filter(Boolean).join(' ');

  const icons = {
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
    success: <XCircle size={20} />
  };

  return (
    <div className={combinedClasses} role="alert">
      <div className="toast__icon">
        {icons[variant]}
      </div>
      <div className="toast__content">
        <p className="toast__message">{message}</p>
        {description && <p className="toast__description">{description}</p>}
      </div>
      {onClose && (
        <button 
          className="toast__close" 
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Error;