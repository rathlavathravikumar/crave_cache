import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, CheckCircle, XCircle, AlertCircle, Zap, Star, Utensils } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { clearUserError, loginUser, registerUser } from '../redux/userSlice';
import './LoginPage.css';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.user);
  const loading = status === 'loading';
  
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  // Calculate password strength
  useEffect(() => {
    if (isRegister && form.password) {
      let strength = 0;
      if (form.password.length >= 8) strength += 25;
      if (form.password.length >= 12) strength += 25;
      if (/[A-Z]/.test(form.password)) strength += 25;
      if (/[0-9]/.test(form.password)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [form.password, isRegister]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const resetAuthForm = () => {
    setForm({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordStrength(0);
    dispatch(clearUserError());
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (isRegister) {
      if (form.password !== form.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }

      if (passwordStrength < 50) {
        showToast('Password is too weak', 'error');
        return;
      }
    }

    try {
      dispatch(clearUserError());
      const action = isRegister 
        ? registerUser(form) 
        : loginUser({ email: form.email, password: form.password });
      await dispatch(action).unwrap();
      showToast(isRegister ? 'Account created successfully!' : 'Login successful!', 'success');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      const fallbackMessage = isRegister ? 'Failed to create account' : 'Login failed';
      const message = typeof err === 'string'
        ? err
        : err instanceof Error
          ? err.message
          : error || fallbackMessage;
      showToast(message || fallbackMessage, 'error');
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return '#ef4444';
    if (passwordStrength < 75) return '#f59e0b';
    return '#10b981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="auth-page">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast toast--${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Left Side - Brand/Info */}
      <div className="auth-page__left-side">
        <div className="auth-page__brand-section">
          <h1 className="auth-page__brand">CraveCache</h1>
          <p className="auth-page__tagline">Your favorite food, delivered to your door.</p>
          <div className="auth-page__features">
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">
                <Zap size={14} />
              </div>
              <span>Fast delivery to your doorstep</span>
            </div>
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">
                <Star size={14} />
              </div>
              <span>Premium quality from top restaurants</span>
            </div>
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">
                <Utensils size={14} />
              </div>
              <span>Fresh meals prepared daily</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-page__right-side">
        <div className="auth-page__form-container">
          <div className="auth-page__form-header">
            <h2 className="auth-page__title">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="auth-page__subtitle">
              {isRegister 
                ? 'Join thousands of food lovers today' 
                : 'Enter your credentials to access your account'}
            </p>
          </div>

          <form onSubmit={submit} className="auth-page__form">
            {isRegister && (
              <div className="auth-page__input-group">
                <label className="auth-page__label">Full Name <span className="auth-page__required">*</span></label>
                <div className="auth-page__input-wrapper">
                  <User size={18} className="auth-page__input-icon" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="auth-page__input"
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-page__input-group">
              <label className="auth-page__label">Email Address <span className="auth-page__required">*</span></label>
              <div className="auth-page__input-wrapper">
                <Mail size={18} className="auth-page__input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="auth-page__input"
                  required
                />
              </div>
            </div>

            {isRegister ? (
              <>
                <div className="auth-page__password-row">
                  <div className="auth-page__input-group">
                    <label className="auth-page__label">Password <span className="auth-page__required">*</span></label>
                    <div className="auth-page__input-wrapper">
                      <Lock size={18} className="auth-page__input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="auth-page__input"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="auth-page__toggle-password"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {form.password && (
                      <div className="auth-page__password-strength">
                        <div className="auth-page__strength-bar">
                          <div
                            className="auth-page__strength-fill"
                            style={{
                              width: `${passwordStrength}%`,
                              backgroundColor: getPasswordStrengthColor()
                            }}
                          />
                        </div>
                        <span
                          className="auth-page__strength-text"
                          style={{ color: getPasswordStrengthColor() }}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="auth-page__input-group">
                    <label className="auth-page__label">Confirm Password <span className="auth-page__required">*</span></label>
                    <div className="auth-page__input-wrapper">
                      <Lock size={18} className="auth-page__input-icon" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        className="auth-page__input"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="auth-page__toggle-password"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="auth-page__input-group">
                  <label className="auth-page__label">Phone Number <span className="auth-page__required">*</span></label>
                  <div className="auth-page__input-wrapper">
                    <Phone size={18} className="auth-page__input-icon" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="auth-page__input"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-page__input-group">
                <label className="auth-page__label">Password <span className="auth-page__required">*</span></label>
                <div className="auth-page__input-wrapper">
                  <Lock size={18} className="auth-page__input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="auth-page__input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-page__toggle-password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {!isRegister && (
              <div className="auth-page__form-options">
                <label className="auth-page__checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button type="button" className="auth-page__forgot-password">
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="auth-page__submit-btn"
            >
              {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="auth-page__form-footer">
            <p className="auth-page__footer-text">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                resetAuthForm();
              }}
              className="auth-page__toggle-btn"
            >
              {isRegister ? 'Sign in' : 'Create account'}
            </button>
          </div>

          {error && (
            <div className="auth-page__error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
