import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

export const sendOTP = createAsyncThunk('auth/sendOTP', async (mobileNumber, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/send-otp', { mobileNumber });
    return { ...data, mobileNumber };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ mobileNumber, otp }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/verify-otp', { mobileNumber, otp });
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
  }
});

export const adminLogin = createAsyncThunk('auth/adminLogin', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/admin/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/profile');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to get profile');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/profile', profileData);
    const stored = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const updated = { ...stored, ...data };
    localStorage.setItem('userInfo', JSON.stringify(updated));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
  }
});

const userInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo,
    loading: false,
    error: null,
    otpSent: false,
    mobileNumber: '',
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.otpSent = false;
      state.mobileNumber = '';
      localStorage.removeItem('userInfo');
      api.post('/auth/logout').catch(() => {});
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // sendOTP
      .addCase(sendOTP.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.mobileNumber = action.payload.mobileNumber;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // verifyOTP
      .addCase(verifyOTP.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.otpSent = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // adminLogin
      .addCase(adminLogin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getProfile
      .addCase(getProfile.fulfilled, (state, action) => {
        state.userInfo = { ...state.userInfo, ...action.payload };
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => { state.loading = true; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = { ...state.userInfo, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
