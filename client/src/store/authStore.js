import { create } from 'zustand';
import apiClient from '../api/apiClient';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('skillorbit_token') || null,
  loading: true,
  error: null,

  // Initialize and check current logged-in user
  fetchUser: async () => {
    const token = localStorage.getItem('skillorbit_token');
    if (!token) {
      set({ user: null, loading: false });
      return;
    }

    try {
      set({ loading: true });
      const res = await apiClient.get('/auth/me');
      set({ user: res.data.user, loading: false });
    } catch (err) {
      localStorage.removeItem('skillorbit_token');
      set({ user: null, token: null, loading: false });
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('skillorbit_token', token);
      set({ token, user, loading: false, error: null });
      return { success: true, user };
    } catch (err) {
      set({ loading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Register
  register: async (name, email, password, role = 'student') => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.post('/auth/register', {
        name,
        email,
        password,
        role,
      });
      const { token, user } = res.data;
      localStorage.setItem('skillorbit_token', token);
      set({ token, user, loading: false, error: null });
      return { success: true, user };
    } catch (err) {
      set({ loading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('skillorbit_token');
    set({ user: null, token: null, error: null });
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const res = await apiClient.put('/auth/profile', profileData);
      set({ user: res.data.user });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
}));
