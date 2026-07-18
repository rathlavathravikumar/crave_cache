import React, { useState, useId } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Search, X } from 'lucide-react';
import './Input.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showPasswordToggle?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  loading?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  showPasswordToggle = false,
  clearable = false,
  onClear,
  loading = false,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  className = '',
  disabled,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));
  const inputId = useId();

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const isFloating = variant === 'outlined' || variant === 'filled';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(Boolean(e.target.value));
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const handleClear = () => {
    onClear?.();
    setHasValue(false);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const baseClasses = 'input';
  const variantClasses = `input--${variant}`;
  const sizeClasses = `input--${size}`;
  const widthClass = fullWidth ? 'input--full-width' : '';
  const stateClass = hasError ? 'input--error' : hasSuccess ? 'input--success' : '';
  const focusedClass = focused ? 'input--focused' : '';
  const disabledClass = disabled ? 'input--disabled' : '';
  
  const combinedClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClass,
    stateClass,
    focusedClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-wrapper">
      {label && (
        <label 
          htmlFor={inputId} 
          className={`input-label ${isFloating ? 'input-label--floating' : ''} ${
            focused || hasValue ? 'input-label--active' : ''
          }`}
        >
          {label}
        </label>
      )}
      
      <div className={`input-container ${combinedClasses}`}>
        {icon && iconPosition === 'left' && (
          <div className="input-icon input-icon--left">{icon}</div>
        )}
        
        {type === 'search' && !icon && (
          <div className="input-icon input-icon--left">
            <Search size={18} />
          </div>
        )}
        
        <input
          id={inputId}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled || loading}
          className="input-field"
          {...props}
        />
        
        {loading && (
          <div className="input-spinner">
            <div className="spinner"></div>
          </div>
        )}
        
        {clearable && hasValue && !disabled && !loading && (
          <button
            type="button"
            className="input-clear"
            onClick={handleClear}
            aria-label="Clear input"
          >
            <X size={16} />
          </button>
        )}
        
        {showPasswordToggle && type === 'password' && !disabled && !loading && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={togglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        
        {hasError && !loading && (
          <div className="input-status input-status--error">
            <AlertCircle size={18} />
          </div>
        )}
        
        {hasSuccess && !loading && !hasError && (
          <div className="input-status input-status--success">
            <CheckCircle size={18} />
          </div>
        )}
        
        {icon && iconPosition === 'right' && !hasError && !hasSuccess && (
          <div className="input-icon input-icon--right">{icon}</div>
        )}
      </div>
      
      {(error || success || helperText) && (
        <div className="input-helper">
          {error && (
            <span className="input-helper-text input-helper-text--error">
              {error}
            </span>
          )}
          {success && !error && (
            <span className="input-helper-text input-helper-text--success">
              {success}
            </span>
          )}
          {helperText && !error && !success && (
            <span className="input-helper-text input-helper-text--default">
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  success,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  showCount = false,
  maxLength,
  value,
  onChange,
  onFocus,
  onBlur,
  className = '',
  disabled,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));
  const textareaId = useId();
  const currentLength = String(value || '').length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(Boolean(e.target.value));
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const isFloating = variant === 'outlined' || variant === 'filled';

  const baseClasses = 'input input--textarea';
  const variantClasses = `input--${variant}`;
  const sizeClasses = `input--${size}`;
  const widthClass = fullWidth ? 'input--full-width' : '';
  const stateClass = hasError ? 'input--error' : hasSuccess ? 'input--success' : '';
  const focusedClass = focused ? 'input--focused' : '';
  const disabledClass = disabled ? 'input--disabled' : '';
  
  const combinedClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClass,
    stateClass,
    focusedClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-wrapper">
      {label && (
        <label 
          htmlFor={textareaId} 
          className={`input-label ${isFloating ? 'input-label--floating' : ''} ${
            focused || hasValue ? 'input-label--active' : ''
          }`}
        >
          {label}
        </label>
      )}
      
      <div className={`input-container ${combinedClasses}`}>
        <textarea
          id={textareaId}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          maxLength={maxLength}
          className="input-field"
          {...props}
        />
        
        {showCount && maxLength && (
          <div className="input-count">
            {currentLength}/{maxLength}
          </div>
        )}
      </div>
      
      {(error || success || helperText) && (
        <div className="input-helper">
          {error && (
            <span className="input-helper-text input-helper-text--error">
              {error}
            </span>
          )}
          {success && !error && (
            <span className="input-helper-text input-helper-text--success">
              {success}
            </span>
          )}
          {helperText && !error && !success && (
            <span className="input-helper-text input-helper-text--default">
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;