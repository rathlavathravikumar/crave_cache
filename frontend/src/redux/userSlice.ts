import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import type { User } from '../types';

interface AuthResponse {
  user: User;
  token?: string;
}

interface SaveProfilePayload {
  name: string;
  phone: string;
  avatar?: { public_id?: string; url: string };
  addresses?: Array<{
    label?: string;
    houseNo?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    isDefault?: boolean;
  }>;
}

interface PasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  authStatus: 'idle' | 'loading' | 'authenticated' | 'anonymous';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  status: 'idle',
  authStatus: 'idle',
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }

  return fallback;
};

const getRejectedMessage = (payload: unknown, fallback: string) => {
  return typeof payload === 'string' && payload ? payload : fallback;
};

export const loadUser = createAsyncThunk<AuthResponse, void, { rejectValue: string }>('user/loadUser', async (_, thunkAPI) => {
  try {
    const response = await api.get('/auth/me');
    return {
      user: response.data.user as User,
      token: response.data.token as string | undefined,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Unable to load user'));
  }
});

export const loginUser = createAsyncThunk<AuthResponse, { email: string; password: string }, { rejectValue: string }>('user/loginUser', async (form, thunkAPI) => {
  try {
    const response = await api.post('/auth/login', form);
    return {
      user: response.data.user as User,
      token: response.data.token as string,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Login failed'));
  }
});

export const registerUser = createAsyncThunk<AuthResponse, Record<string, string>, { rejectValue: string }>('user/registerUser', async (form, thunkAPI) => {
  try {
    const response = await api.post('/auth/register', form);
    return {
      user: response.data.user as User,
      token: response.data.token as string,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Registration failed'));
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>('user/logoutUser', async (_, thunkAPI) => {
  try {
    await api.get('/auth/logout');
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Logout failed'));
  }
});

export const updateProfile = createAsyncThunk<User, SaveProfilePayload, { rejectValue: string }>('user/updateProfile', async (payload, thunkAPI) => {
  try {
    const response = await api.put('/auth/me/update', payload);
    return response.data.user as User;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Unable to update profile'));
  }
});

export const updatePassword = createAsyncThunk<User, PasswordPayload, { rejectValue: string }>('user/updatePassword', async (payload, thunkAPI) => {
  try {
    const response = await api.put('/auth/password/update', payload);
    return response.data.user as User;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Unable to update password'));
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.status = 'loading';
        state.authStatus = 'loading';
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.authStatus = 'authenticated';
        state.user = action.payload.user;
        state.token = action.payload.token ?? state.token;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.status = 'failed';
        state.authStatus = 'anonymous';
        state.error = getRejectedMessage(action.payload, action.error.message || 'Unable to load user');
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.authStatus = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.authStatus = 'authenticated';
        state.user = action.payload.user;
        state.token = action.payload.token ?? null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.authStatus = 'anonymous';
        state.error = getRejectedMessage(action.payload, action.error.message || 'Login failed');
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.authStatus = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.authStatus = 'authenticated';
        state.user = action.payload.user;
        state.token = action.payload.token ?? null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.authStatus = 'anonymous';
        state.error = getRejectedMessage(action.payload, action.error.message || 'Registration failed');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
        state.authStatus = 'anonymous';
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
        state.authStatus = 'anonymous';
        state.error = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = getRejectedMessage(action.payload, action.error.message || 'Unable to update profile');
      })
      .addCase(updatePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = getRejectedMessage(action.payload, action.error.message || 'Unable to update password');
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
