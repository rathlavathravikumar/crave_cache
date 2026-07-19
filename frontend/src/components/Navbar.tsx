import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Menu, X, MoonStar, SunMedium, Settings, CircleUserRound } from 'lucide-react';
import type { RootState, AppDispatch } from '../redux/store';
import { logoutUser } from '../redux/userSlice';
import './Navbar.css';

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const cartCount = useSelector((state: RootState) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const storedTheme = window.localStorage.getItem('cravecache-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('cravecache-theme', theme);
  }, [theme]);

  React.useEffect(() => {
    document.body.style.overflow = isLogoutModalOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLogoutModalOpen]);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : 'U';

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
    closeMenus();
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const confirmLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch {
      // Keep the UI consistent even if the network request fails.
    } finally {
      closeLogoutModal();
      closeMenus();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">
          <Link to="/" className="navbar__logo" onClick={closeMenus}>
            <span className="navbar__logo-mark" aria-hidden="true">C</span>
            <span className="navbar__logo-text">CraveCache</span>
          </Link>
        </div>

        <div className={`navbar__links ${isMobileMenuOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/restaurants" className="navbar__link" onClick={closeMenus}>
            Restaurants
          </Link>
          <Link to="/cart" className="navbar__link navbar__link--cart" onClick={closeMenus}>
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </Link>
          <Link to="/orders" className="navbar__link" onClick={closeMenus}>
            Orders
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin-dashboard" className="navbar__link" onClick={closeMenus}>
              Admin Dashboard
            </Link>
          )}

          <div className="navbar__mobile-actions">
            <button type="button" className="navbar__action navbar__action--theme" onClick={toggleTheme}>
              {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </button>

            {user ? (
              <>
                <Link to="/profile" className="navbar__action navbar__action--profile" onClick={closeMenus}>
                  {user.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} className="navbar__avatar-image navbar__avatar-image--mobile" />
                  ) : (
                    <span className="navbar__avatar-fallback navbar__avatar-fallback--mobile">{userInitials}</span>
                  )}
                  <span>Profile</span>
                </Link>
                <Link to="/profile" className="navbar__action navbar__action--settings" onClick={closeMenus}>
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                <button type="button" className="navbar__action navbar__action--logout" onClick={openLogoutModal}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar__action navbar__action--login" onClick={closeMenus}>
                <CircleUserRound size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        <div className="navbar__desktop-actions">
          <button type="button" className="navbar__theme-toggle" onClick={toggleTheme} aria-label="Toggle color mode">
            {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>

          {user ? (
            <>
              <Link to="/profile" className="navbar__avatar-link" title={`Open profile for ${user.name}`}>
                {user.avatar?.url ? (
                  <img src={user.avatar.url} alt={user.name} className="navbar__avatar-image" />
                ) : (
                  <span className="navbar__avatar-fallback">{userInitials}</span>
                )}
              </Link>

              <div className="navbar__account">
                <span className="navbar__account-label">Welcome back</span>
                <span className="navbar__account-name">{user.name}</span>
              </div>

              {user.role === 'admin' && (
                <Link to="/admin-dashboard" className="navbar__icon-button" title="Admin Dashboard">
                  <Settings size={18} />
                </Link>
              )}

              <Link to="/profile" className="navbar__icon-button" title="Profile settings">
                <User size={18} />
              </Link>

              <Link to="/profile" className="navbar__icon-button" title="Settings">
                <Settings size={18} />
              </Link>

              <button type="button" className="navbar__icon-button navbar__icon-button--danger" onClick={openLogoutModal} title="Logout">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar__login-button" onClick={closeMenus}>
              Sign in
            </Link>
          )}
        </div>

        <button
          className="navbar__mobile-toggle"
          onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isLogoutModalOpen && (
        <div className="navbar__logout-modal" role="presentation" onClick={closeLogoutModal}>
          <div
            className="navbar__logout-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            aria-describedby="logout-dialog-description"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="navbar__logout-icon" aria-hidden="true">
              <LogOut size={20} />
            </div>
            <h3 id="logout-dialog-title" className="navbar__logout-title">Confirm logout</h3>
            <p id="logout-dialog-description" className="navbar__logout-text">
              Are you sure you want to logout from your account?
            </p>
            <div className="navbar__logout-actions">
              <button type="button" className="navbar__logout-cancel" onClick={closeLogoutModal}>
                Cancel
              </button>
              <button type="button" className="navbar__logout-confirm" onClick={confirmLogout}>
                Yes, logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
