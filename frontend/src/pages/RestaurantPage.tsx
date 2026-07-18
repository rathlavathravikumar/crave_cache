import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import type { Restaurant, FoodItem } from '../types';
import FoodCard from '../components/FoodCard';

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const restaurantResponse = await api.get(`/restaurants/${id}`);
        const foodItemsResponse = await api.get(`/fooditems`);
        const matchedItems = (foodItemsResponse.data.foodItems || []).filter((item: FoodItem) => item.restaurant?._id === id || item.restaurant === id);
        setRestaurant(restaurantResponse.data.restaurant);
        setFoodItems(matchedItems);
      } catch (err) {
        setError('We could not load this restaurant right now.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <div className="page"><div className="state-card">Loading restaurant details…</div></div>;
  }

  if (error || !restaurant) {
    return <div className="page"><div className="state-card error">{error || 'Restaurant not found.'}</div></div>;
  }

  return (
    <div className="page">
      <section className="hero-panel" style={{ marginBottom: '1.25rem' }}>
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
        <div className="hero-badges">
          <span>{restaurant.cuisine}</span>
          <span>{restaurant.location}</span>
          <span>★ {restaurant.rating}</span>
        </div>
      </section>

      {foodItems.length === 0 ? (
        <div className="state-card">This kitchen has no dishes listed yet. Check back soon.</div>
      ) : (
        <div className="grid">
          {foodItems.map((foodItem) => (
            <FoodCard key={foodItem._id} foodItem={foodItem} restaurantId={restaurant._id} />
          ))}
        </div>
      )}
    </div>
  );
}
