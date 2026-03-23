import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/stats/admin');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
  }
});

export const fetchAdminOrders = createAsyncThunk('admin/fetchOrders', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/admin/all', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const updateOrderStatus = createAsyncThunk('admin/updateOrderStatus', async ({ id, ...body }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/orders/admin/${id}/status`, body);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

export const fetchAdminProducts = createAsyncThunk('admin/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params: { limit: 100 } });
    return data.products;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const createProduct = createAsyncThunk('admin/createProduct', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/products/${id}`, updates);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
  }
});

export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/users');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

export const fetchAdminReviews = createAsyncThunk('admin/fetchReviews', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/reviews/all');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch reviews');
  }
});

export const deleteReview = createAsyncThunk('admin/deleteReview', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/reviews/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete review');
  }
});

export const fetchNotifications = createAsyncThunk('admin/fetchNotifications', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/notifications');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications');
  }
});

export const markAllNotificationsRead = createAsyncThunk('admin/markAllRead', async (_, { rejectWithValue }) => {
  try {
    await api.put('/notifications/read-all');
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    orders: [],
    products: [],
    users: [],
    reviews: [],
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    orderPages: 1,
    orderTotal: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
      .addCase(fetchAdminStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchAdminOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.orderPages = action.payload.pages;
        state.orderTotal = action.payload.total;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      })

      .addCase(fetchAdminProducts.fulfilled, (state, action) => { state.products = action.payload; })
      .addCase(createProduct.fulfilled, (state, action) => { state.products.unshift(action.payload); })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })

      .addCase(fetchAdminUsers.fulfilled, (state, action) => { state.users = action.payload; })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => { state.reviews = action.payload; })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  },
});

export default adminSlice.reducer;
