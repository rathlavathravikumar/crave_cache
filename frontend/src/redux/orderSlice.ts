import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import type { Order } from '../types';

interface OrderState {
  orders: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  paymentInProgress: boolean;
  paymentError: string | null;
  lastPaymentStatus: 'pending' | 'success' | 'failed' | null;
  currentOrder: Order | null;
}

const initialState: OrderState = {
  orders: [],
  status: 'idle',
  error: null,
  paymentInProgress: false,
  paymentError: null,
  lastPaymentStatus: null,
  currentOrder: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await api.get('/orders/me');
  return response.data.orders as Order[];
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setPaymentInProgress: (state, action) => {
      state.paymentInProgress = action.payload;
    },
    setPaymentError: (state, action) => {
      state.paymentError = action.payload;
    },
    clearPaymentError: (state) => {
      state.paymentError = null;
    },
    setLastPaymentStatus: (state, action) => {
      state.lastPaymentStatus = action.payload;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unable to fetch orders';
      });
  },
});

export const {
  setPaymentInProgress,
  setPaymentError,
  clearPaymentError,
  setLastPaymentStatus,
  setCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
