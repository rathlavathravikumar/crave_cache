import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Check, Loader2 } from 'lucide-react';
import api from '../api';
import './AddressSelector.css';

interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressSelectorProps {
  selectedAddressId?: string;
  onAddressSelect?: (address: Address) => void;
  showAddButton?: boolean;
  compact?: boolean;
}

export default function AddressSelector({ 
  selectedAddressId, 
  onAddressSelect, 
  showAddButton = true,
  compact = false 
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/me/addresses');
      if (response.data.success) {
        setAddresses(response.data.addresses || []);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/me/addresses', formData);
      if (response.data.success) {
        setAddresses([...addresses, response.data.address]);
        setIsAdding(false);
        resetForm();
        setMessage('Address added successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to add address');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    try {
      const response = await api.put(`/me/addresses/${isEditing}`, formData);
      if (response.data.success) {
        setAddresses(addresses.map(addr => 
          addr._id === isEditing ? response.data.address : addr
        ));
        setIsEditing(null);
        resetForm();
        setMessage('Address updated successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update address');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await api.delete(`/me/addresses/${id}`);
      if (response.data.success) {
        setAddresses(addresses.filter(addr => addr._id !== id));
        setMessage('Address deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await api.put(`/me/addresses/${id}/default`);
      if (response.data.success) {
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr._id === id
        })));
        setMessage('Default address updated');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to set default address');
    }
  };

  const resetForm = () => {
    setFormData({
      label: 'Home',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: false
    });
  };

  const startEdit = (address: Address) => {
    setFormData({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setIsEditing(address._id);
  };

  if (loading) {
    return (
      <div className="address-selector address-selector--loading">
        <Loader2 className="animate-spin" size={20} />
        <p>Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className={`address-selector ${compact ? 'address-selector--compact' : ''}`}>
      {message && <div className="address-selector__message">{message}</div>}

      <div className="address-selector__list">
        {addresses.map((address) => (
          <div
            key={address._id}
            className={`address-card ${selectedAddressId === address._id ? 'address-card--selected' : ''}`}
            onClick={() => onAddressSelect?.(address)}
          >
            <div className="address-card__content">
              <div className="address-card__header">
                <span className="address-card__label">{address.label}</span>
                {address.isDefault && <span className="address-card__default-badge">Default</span>}
              </div>
              <div className="address-card__details">
                <MapPin size={16} />
                <span>{address.street}, {address.city}, {address.state} - {address.postalCode}</span>
              </div>
            </div>
            <div className="address-card__actions">
              {!compact && (
                <>
                  <button
                    type="button"
                    className="address-card__action-btn"
                    onClick={(e) => { e.stopPropagation(); handleSetDefault(address._id); }}
                    title="Set as default"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    className="address-card__action-btn"
                    onClick={(e) => { e.stopPropagation(); startEdit(address); }}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    className="address-card__action-btn address-card__action-btn--danger"
                    onClick={(e) => { e.stopPropagation(); handleDelete(address._id); }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddButton && !isAdding && !isEditing && (
        <button
          type="button"
          className="address-selector__add-btn"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={18} />
          Add New Address
        </button>
      )}

      {(isAdding || isEditing) && (
        <form className="address-form" onSubmit={isAdding ? handleAdd : handleUpdate}>
          <h4>{isAdding ? 'Add New Address' : 'Edit Address'}</h4>
          
          <div className="address-form__row">
            <label className="address-form__field">
              <span>Label</span>
              <select
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>

          <div className="address-form__row">
            <label className="address-form__field address-form__field--wide">
              <span>Street Address *</span>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
                placeholder="123 Main Street"
              />
            </label>
          </div>

          <div className="address-form__row">
            <label className="address-form__field">
              <span>City *</span>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                placeholder="City"
              />
            </label>
            <label className="address-form__field">
              <span>State *</span>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                placeholder="State"
              />
            </label>
          </div>

          <div className="address-form__row">
            <label className="address-form__field">
              <span>Postal Code *</span>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                required
                placeholder="123456"
              />
            </label>
            <label className="address-form__field">
              <span>Country</span>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="India"
              />
            </label>
          </div>

          <label className="address-form__checkbox">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            />
            <span>Set as default address</span>
          </label>

          <div className="address-form__actions">
            <button type="submit" className="address-form__submit-btn">
              {isAdding ? 'Add Address' : 'Update Address'}
            </button>
            <button
              type="button"
              className="address-form__cancel-btn"
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
