import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Heart, Loader2, ShoppingBag, MapPin, Star } from 'lucide-react';
import type { AppDispatch } from '../redux/store';
import { loadUser } from '../redux/userSlice';
import api from '../api';
import './FavoritesPage.css';

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  images: Array<{ url: string }>;
  restaurant: { name: string; _id: string };
  rating: number;
}

interface Restaurant {
  _id: string;
  name: string;
  images: Array<{ url: string }>;
  rating: number;
  location: string;
  cuisineType: string;
}

export default function FavoritesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<'food' | 'restaurants'>('food');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/me/favorites');
      if (response.data.success) {
        setFoodItems(response.data.favorites.foodItems || []);
        setRestaurants(response.data.favorites.restaurants || []);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (type: 'foodItem' | 'restaurant', itemId: string) => {
    try {
      await api.post('/me/favorites', { type, itemId });
      await dispatch(loadUser());
      await fetchFavorites();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="page favorites-page">
        <div className="favorites-page__loading">
          <Loader2 className="animate-spin" size={48} />
          <p>Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page favorites-page">
      <div className="favorites-page__header">
        <div>
          <h1>My Favorites</h1>
          <p>Your saved food items and restaurants</p>
        </div>
      </div>

      <div className="favorites-page__tabs">
        <button
          className={`favorites-tab ${activeTab === 'food' ? 'favorites-tab--active' : ''}`}
          onClick={() => setActiveTab('food')}
        >
          <ShoppingBag size={18} />
          Food Items ({foodItems.length})
        </button>
        <button
          className={`favorites-tab ${activeTab === 'restaurants' ? 'favorites-tab--active' : ''}`}
          onClick={() => setActiveTab('restaurants')}
        >
          <MapPin size={18} />
          Restaurants ({restaurants.length})
        </button>
      </div>

      {activeTab === 'food' && (
        <div className="favorites-page__content">
          {foodItems.length === 0 ? (
            <div className="favorites-page__empty">
              <Heart size={48} />
              <h3>No favorite food items yet</h3>
              <p>Start exploring and save your favorite dishes!</p>
              <button className="favorites-page__cta" onClick={() => navigate('/restaurants')}>
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="favorites-grid">
              {foodItems.map((item) => (
                <div key={item._id} className="favorite-card">
                  <button
                    className="favorite-card__heart-btn favorite-card__heart-btn--active"
                    onClick={() => toggleFavorite('foodItem', item._id)}
                  >
                    <Heart size={20} fill="currentColor" />
                  </button>
                  {item.images?.[0]?.url && (
                    <img src={item.images[0].url} alt={item.name} className="favorite-card__image" />
                  )}
                  <div className="favorite-card__content">
                    <h3>{item.name}</h3>
                    <p className="favorite-card__restaurant">{item.restaurant.name}</p>
                    <div className="favorite-card__footer">
                      <div className="favorite-card__rating">
                        <Star size={14} fill="#f59e0b" />
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                      <span className="favorite-card__price">₹{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div className="favorites-page__content">
          {restaurants.length === 0 ? (
            <div className="favorites-page__empty">
              <Heart size={48} />
              <h3>No favorite restaurants yet</h3>
              <p>Discover and save your favorite places to eat!</p>
              <button className="favorites-page__cta" onClick={() => navigate('/restaurants')}>
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="favorites-grid">
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="favorite-card">
                  <button
                    className="favorite-card__heart-btn favorite-card__heart-btn--active"
                    onClick={() => toggleFavorite('restaurant', restaurant._id)}
                  >
                    <Heart size={20} fill="currentColor" />
                  </button>
                  {restaurant.images?.[0]?.url && (
                    <img src={restaurant.images[0].url} alt={restaurant.name} className="favorite-card__image" />
                  )}
                  <div className="favorite-card__content">
                    <h3>{restaurant.name}</h3>
                    <p className="favorite-card__cuisine">{restaurant.cuisineType}</p>
                    <div className="favorite-card__footer">
                      <div className="favorite-card__rating">
                        <Star size={14} fill="#f59e0b" />
                        <span>{restaurant.rating.toFixed(1)}</span>
                      </div>
                      <span className="favorite-card__location">{restaurant.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
