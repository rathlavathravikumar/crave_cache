import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItemType, FoodItem } from '../types';
import api from '../api';

interface CartState {
  items: CartItemType[];
  restaurantId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  syncStatus: 'idle' | 'saving' | 'saved' | 'failed';
  error: string | null;
  lastSyncedAt: string | null;
}

interface RemoteCartResponse {
  cart?: {
    restaurant?: string;
    items?: Array<{
      foodItemId?: FoodItem;
      quantity: number;
    }>;
  } | null;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }

  return fallback;
};

const initialState: CartState = {
  items: [],
  restaurantId: null,
  status: 'idle',
  syncStatus: 'idle',
  error: null,
  lastSyncedAt: null,
};

export const fetchCart = createAsyncThunk<RemoteCartResponse, void, { rejectValue: string }>('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const response = await api.get('/cart');
    return response.data as RemoteCartResponse;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Unable to load cart'));
  }
});

export const syncCartItem = createAsyncThunk<RemoteCartResponse, { foodItemId: string; quantity: number; restaurantId: string }, { rejectValue: string }>('cart/syncCartItem', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/cart/add', payload);
    return response.data as RemoteCartResponse;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Unable to update cart'));
  }
});

export const removeCartItem = createAsyncThunk<RemoteCartResponse, string, { rejectValue: string }>('cart/removeCartItem', async (foodItemId, thunkAPI) => {
  try {
    const response = await api.delete(`/cart/remove/${foodItemId}`);
    return response.data as RemoteCartResponse;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Unable to remove cart item'));
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ foodItem: FoodItem; restaurantId: string; quantity?: number }>) => {
      const { foodItem, restaurantId, quantity = 1 } = action.payload;
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
      }
      state.restaurantId = restaurantId;
      const existing = state.items.find((item) => item.foodItem._id === foodItem._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ foodItem, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.foodItem._id !== action.payload);
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.syncStatus = 'saved';
        state.lastSyncedAt = new Date().toISOString();
        state.restaurantId = action.payload.cart?.restaurant || null;
        state.items = (action.payload.cart?.items || []).map((item) => ({
          foodItem: item.foodItemId as FoodItem,
          quantity: item.quantity,
        }));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Unable to load cart';
      })
      .addCase(syncCartItem.pending, (state) => {
        state.syncStatus = 'saving';
        state.error = null;
      })
      .addCase(syncCartItem.fulfilled, (state, action) => {
        state.syncStatus = 'saved';
        state.lastSyncedAt = new Date().toISOString();
        state.restaurantId = action.payload.cart?.restaurant || state.restaurantId;
      })
      .addCase(syncCartItem.rejected, (state, action) => {
        state.syncStatus = 'failed';
        state.error = action.payload || action.error.message || 'Unable to update cart';
      })
      .addCase(removeCartItem.pending, (state) => {
        state.syncStatus = 'saving';
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.syncStatus = 'saved';
        state.lastSyncedAt = new Date().toISOString();
        state.restaurantId = action.payload.cart?.restaurant || null;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.syncStatus = 'failed';
        state.error = action.payload || action.error.message || 'Unable to remove cart item';
      });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
