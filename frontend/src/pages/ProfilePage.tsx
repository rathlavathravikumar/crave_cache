import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, User, Save, X, LogOut, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { logoutUser, updatePassword, updateProfile } from '../redux/userSlice';
import type { User as UserType } from '../types';
import api from '../api';
import './ProfilePage.css';

type ProfileFormState = {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  houseNo: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const toFormState = (user: UserType | null): ProfileFormState => {
  const address = user?.addresses?.[0] || {};

  return {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatarUrl: user?.avatar?.url || '',
    houseNo: address.houseNo || '',
    street: address.street || '',
    city: address.city || '',
    state: address.state || '',
    pincode: address.pincode || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
};

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, status } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = React.useState(false);
  const [form, setForm] = React.useState<ProfileFormState>(() => toFormState(user));
  const [avatarPreview, setAvatarPreview] = React.useState<string>(user?.avatar?.url || '');
  const [message, setMessage] = React.useState<string>('');
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setForm(toFormState(user));
    setAvatarPreview(user?.avatar?.url || '');
  }, [user]);

  if (!user) {
    return (
      <div className="page profile-page profile-page--empty">
        <div className="profile-page__empty-state">
          <h2>Profile</h2>
          <p>Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setForm(toFormState(user));
    setAvatarPreview(user.avatar?.url || '');
    setIsEditing(false);
    setMessage('');
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMessage('Only image files are allowed (jpeg, jpg, png, gif, webp)');
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatarToServer = async (): Promise<string | null> => {
    if (!avatarFile) return null;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const response = await api.post('/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.user.avatar?.url) {
        setAvatarFile(null);
        return response.data.user.avatar.url;
      }
      return null;
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Upload avatar first if there's a new file
      let avatarUrl = form.avatarUrl;
      if (avatarFile) {
        avatarUrl = await uploadAvatarToServer();
        if (!avatarUrl) {
          setMessage('Failed to upload avatar. Please try again.');
          return;
        }
      }

      const addresses = [{
        label: 'Home',
        houseNo: form.houseNo,
        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: 'India',
        isDefault: true,
      }];

      await dispatch(updateProfile({
        name: form.name,
        phone: form.phone,
        avatar: avatarUrl ? { public_id: 'profile-avatar', url: avatarUrl } : undefined,
        addresses,
      })).unwrap();

      const passwordFieldsFilled = form.currentPassword || form.newPassword || form.confirmPassword;
      if (passwordFieldsFilled) {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
          setMessage('Fill all password fields to change your password.');
          return;
        }

        await dispatch(updatePassword({
          oldPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        })).unwrap();
      }

      setMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      const fallbackMessage = error instanceof Error ? error.message : 'Unable to save profile changes.';
      setMessage(fallbackMessage);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="page profile-page">
      <div className="profile-page__header">
        <div>
          <p className="profile-page__eyebrow">Account</p>
          <h2 className="profile-page__title">Profile</h2>
          <p className="profile-page__subtitle">Manage your personal details, delivery address, and password.</p>
        </div>

        <div className="profile-page__header-actions">
          <button type="button" className="profile-page__ghost-btn" onClick={() => navigate('/orders')}>
            <ArrowRight size={16} />
            Order History
          </button>
          <button type="button" className="profile-page__ghost-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <form className="profile-page__layout" onSubmit={handleSave}>
        <aside className="profile-page__sidebar">
          <div className="profile-page__avatar-card">
            <div className="profile-page__avatar-wrap">
              {avatarPreview ? (
                <img src={avatarPreview} alt={user.name} className="profile-page__avatar" />
              ) : (
                <div className="profile-page__avatar-fallback">{user.name.slice(0, 1).toUpperCase()}</div>
              )}
              {isEditing && (
                <button
                  type="button"
                  className="profile-page__avatar-action"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Camera size={16} />
                  )}
                  {isUploadingAvatar ? 'Uploading...' : 'Change photo'}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="profile-page__file-input"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="profile-page__identity">
              <h3>{user.name}</h3>
              <p>{user.role}</p>
            </div>
          </div>

          <div className="profile-page__sidebar-actions">
            {!isEditing ? (
              <button type="button" className="profile-page__primary-btn" onClick={() => setIsEditing(true)}>
                <User size={16} />
                Edit Profile
              </button>
            ) : (
              <>
                <button type="submit" className="profile-page__primary-btn" disabled={status === 'loading'}>
                  <Save size={16} />
                  Save Changes
                </button>
                <button type="button" className="profile-page__secondary-btn" onClick={resetForm}>
                  <X size={16} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </aside>

        <section className="profile-page__content">
          {message && <div className="profile-page__message">{message}</div>}

          <div className="profile-page__section">
            <div className="profile-page__section-header">
              <h3>Personal Information</h3>
              <span>Profile Picture, Full Name, Email, Phone Number</span>
            </div>

            <div className="profile-page__grid">
              <label className="profile-field">
                <span className="profile-field__label">Full Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={!isEditing}
                />
              </label>

              <label className="profile-field">
                <span className="profile-field__label">Email (Read Only)</span>
                <input type="email" value={form.email} readOnly disabled />
              </label>

              <label className="profile-field">
                <span className="profile-field__label">Phone Number</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </label>
            </div>
          </div>

          <div className="profile-page__section">
            <div className="profile-page__section-header">
              <h3>Address</h3>
              <span>House No., Street, City, State, Pincode</span>
            </div>

            <div className="profile-page__grid profile-page__grid--address">
              <label className="profile-field">
                <span className="profile-field__label">House No.</span>
                <input
                  type="text"
                  value={form.houseNo}
                  onChange={(e) => setForm({ ...form, houseNo: e.target.value })}
                  disabled={!isEditing}
                />
              </label>

              <label className="profile-field profile-field--wide">
                <span className="profile-field__label">Street</span>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  disabled={!isEditing}
                />
              </label>

              <label className="profile-field">
                <span className="profile-field__label">City</span>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  disabled={!isEditing}
                />
              </label>

              <label className="profile-field">
                <span className="profile-field__label">State</span>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  disabled={!isEditing}
                />
              </label>

              <label className="profile-field">
                <span className="profile-field__label">Pincode</span>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  disabled={!isEditing}
                />
              </label>
            </div>
          </div>

          <div className="profile-page__section">
            <div className="profile-page__section-header">
              <h3>Security</h3>
              <span>Change Password</span>
            </div>

            <div className="profile-page__grid profile-page__grid--password">
              <label className="profile-field">
                <span className="profile-field__label">Current Password</span>
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  disabled={!isEditing}
                />
              </label>

              <label className="profile-field">
                <span className="profile-field__label">New Password</span>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  disabled={!isEditing}
                />
              </label>

              <label className="profile-field">
                <span className="profile-field__label">Confirm Password</span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  disabled={!isEditing}
                />
              </label>
            </div>
          </div>

          <div className="profile-page__section profile-page__section--orders">
            <div className="profile-page__section-header">
              <h3>Orders</h3>
              <span>Order History</span>
            </div>

            <div className="profile-page__orders-card">
              <div>
                <p className="profile-page__orders-title">View your past deliveries and payment history.</p>
                <p className="profile-page__orders-text">Track status, reorder favorites, and review order details.</p>
              </div>
              <button type="button" className="profile-page__outline-btn" onClick={() => navigate('/orders')}>
                <ShieldCheck size={16} />
                Open Order History
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
