import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Star, ChevronRight, TrendingUp } from 'lucide-react';
import { fetchRestaurants, fetchFoodItems } from '../redux/restaurantSlice';
import type { AppDispatch, RootState } from '../redux/store';
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';
import { FullPageLoading, ErrorBanner } from '../components/ui/index';
import '../styles/pages.css';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { restaurants, foodItems, status, error } = useSelector((state: RootState) => state.restaurants);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchFoodItems());
  }, [dispatch]);

  const filteredFoodItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return foodItems.filter((item) => {
      const searchableText = [
        item.name,
        item.description,
        item.menu?.name,
        item.restaurant?.name,
        item.restaurant?.cuisine,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesQuery = query ? searchableText.includes(query) : true;
      const matchesCategory = selectedCategory === 'all' ? true : (item.menu?.category === selectedCategory || item.name.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

      return matchesQuery && matchesCategory && matchesPrice;
    });
  }, [foodItems, searchQuery, selectedCategory, priceRange]);

  const isLoading = status === 'loading' && restaurants.length === 0;
  const cuisineTypes = [...new Set(restaurants.flatMap(r => r.cuisine || []))];
  const categories = ['all', 'Meals', 'Snacks', 'Beverages', 'Desserts'];

  return (
    <div className="page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">CraveCache</h1>
            <p className="hero-subtitle">
              Discover standout restaurants, chef-crafted meals, and seamless ordering
            </p>

            {/* SMART SEARCH BAR */}
            <div className="hero-search-container">
              <div className="search-bar">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for restaurants or food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="search-shortcuts">
                <button className="shortcut-button">
                  <MapPin size={16} />
                  Location
                </button>
                <button className="shortcut-button">
                  <Clock size={16} />
                  Quick Delivery
                </button>
                <button className="shortcut-button">
                  <TrendingUp size={16} />
                  Trending
                </button>
              </div>
            </div>

            {/* HERO BADGES */}
            <div className="hero-badges">
              <span>⚡ 30-minute delivery</span>
              <span>⭐ Verified restaurants</span>
              <span>🔒 Secure payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      {isLoading ? (
        <FullPageLoading message="Loading delicious options..." />
      ) : (
        <div className="container main-content">
          {error && (
            <ErrorBanner
              message="We hit a snag while loading the menu."
              description={error}
              variant="error"
              dismissible={true}
            />
          )}

          {/* FILTERS & SORT */}
          <div className="filters-section">
            <div className="category-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="price-filter">
              <label>Price Range</label>
              <div className="price-range-input">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>
              <span className="price-display">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </span>
            </div>
          </div>

          {/* RESTAURANTS SECTION */}
          <section className="page-section">
            <div className="section-header">
              <h2>Popular Restaurants</h2>
              <p>Explore top-rated restaurants in your area</p>
            </div>

            {restaurants.length === 0 ? (
              <div className="empty-state">
                <p>No restaurants available</p>
              </div>
            ) : (
              <div className="restaurants-grid">
                {restaurants.map(restaurant => (
                  <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                ))}
              </div>
            )}

            {restaurants.length > 6 && (
              <Link to="/restaurants" className="view-all-link">
                View all restaurants <ChevronRight size={20} />
              </Link>
            )}
          </section>

          {/* CUISINES SECTION */}
          <section className="page-section">
            <div className="section-header">
              <h2>Browse by Cuisine</h2>
              <p>Find your favorite type of food</p>
            </div>

            <div className="cuisines-grid">
              {cuisineTypes.map((cuisine) => (
                <button key={cuisine} className="cuisine-card">
                  <span className="cuisine-emoji">🍽️</span>
                  <span className="cuisine-name">{cuisine}</span>
                </button>
              ))}
            </div>
          </section>

          {/* FEATURED FOOD ITEMS SECTION */}
          <section className="page-section">
            <div className="section-header">
              <h2>Featured Dishes</h2>
              <p>{filteredFoodItems.length} items found</p>
            </div>

            {filteredFoodItems.length === 0 ? (
              <div className="empty-state">
                <p>No dishes match your search or filters</p>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setPriceRange([0, 1000]); }} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="food-grid">
                {filteredFoodItems.slice(0, 12).map(item => (
                  <FoodCard key={item._id} foodItem={item} restaurantId={item.restaurant?._id || ''} />
                ))}
              </div>
            )}
          </section>

          {/* TESTIMONIALS SECTION */}
          <section className="page-section testimonials-section">
            <div className="section-header">
              <h2>What Our Customers Say</h2>
            </div>

            <div className="testimonials-grid">
              {[
                { name: 'Sarah Johnson', rating: 5, text: 'Amazing app! Food arrived faster than expected.', avatar: '👩‍🍳' },
                { name: 'Alex Kumar', rating: 5, text: 'Best selection of restaurants and super easy to order.', avatar: '👨‍💼' },
                { name: 'Emma Wilson', rating: 5, text: 'Love the AI recommendations, always spot on!', avatar: '👩‍🎓' }
              ].map((testimonial, idx) => (
                <div key={idx} className="testimonial-card">
                  <div className="testimonial-header">
                    <span className="testimonial-avatar">{testimonial.avatar}</span>
                    <div className="testimonial-info">
                      <h4>{testimonial.name}</h4>
                      <div className="stars">
                        {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                    </div>
                  </div>
                  <p>{testimonial.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA SECTION */}
          <section className="cta-section">
            <div className="cta-content">
              <h2>Ready to satisfy your cravings?</h2>
              <p>Order from your favorite restaurants and get fresh food delivered to your doorstep</p>
              <Link to="/restaurants" className="btn btn-primary btn-lg">
                Explore All Restaurants
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
