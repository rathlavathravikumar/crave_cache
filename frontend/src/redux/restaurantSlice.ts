import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import type { Restaurant, FoodItem } from '../types';

interface RestaurantState {
  restaurants: Restaurant[];
  foodItems: FoodItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  sortBy: 'rating' | 'name';
  vegOnly: boolean;
  searchQuery: string;
}

const initialState: RestaurantState = {
  restaurants: [],
  foodItems: [],
  status: 'idle',
  error: null,
  sortBy: 'rating',
  vegOnly: false,
  searchQuery: '',
};

export const fetchRestaurants = createAsyncThunk('restaurants/fetchRestaurants', async () => {
  const response = await api.get('/restaurants');
  return response.data.restaurants as Restaurant[];
});

export const fetchFoodItems = createAsyncThunk('restaurants/fetchFoodItems', async () => {
  const response = await api.get('/fooditems');
  return response.data.foodItems as FoodItem[];
});

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    toggleVegOnly: (state) => {
      state.vegOnly = !state.vegOnly;
    },
    searchFoodItems: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unable to fetch restaurants';
      })
      .addCase(fetchFoodItems.fulfilled, (state, action) => {
        state.foodItems = action.payload;
      });
  },
});

export const { setSortBy, toggleVegOnly, searchFoodItems } = restaurantSlice.actions;
export default restaurantSlice.reducer;
