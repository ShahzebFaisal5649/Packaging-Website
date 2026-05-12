/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const CACHE_KEY = 'dcb_user_cache';

export const AuthProvider = ({ children }) => {
  const normalizeUser = (u) => {
    if (!u) return null;
    return {
      ...u,
      notifications: Array.isArray(u.notifications) ? u.notifications : [],
      orders: Array.isArray(u.orders) ? u.orders : [],
      quotes: Array.isArray(u.quotes) ? u.quotes : [],
      savedDesigns: Array.isArray(u.savedDesigns) ? u.savedDesigns : [],
      addresses: Array.isArray(u.addresses) ? u.addresses : [],
    };
  };

  const [user, _setUser] = useState(null);
  const setUser = (u) => {
    if (typeof u === 'function') {
      _setUser(prev => normalizeUser(u(prev)));
    } else {
      _setUser(normalizeUser(u));
    }
  };
  const [loading, setLoading] = useState(true);

  // On mount: restore session from JWT → get fresh DB data
  // Falls back to cached user if DB is unavailable (503)
  useEffect(() => {
    const restore = async () => {
      const token = api.getToken();
      if (token) {
        // Try to decode expiry without a library
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            // Token expired — clear it
            api.setToken(null);
            localStorage.removeItem(CACHE_KEY);
            setLoading(false);
            return;
          }
        } catch { /* ignore decode errors */ }

        try {
          const data = await api.get('/auth/me');
          setUser(data.user);
          localStorage.setItem(CACHE_KEY, JSON.stringify(data.user));
        } catch (err) {
          // Only clear session if it's explicitly UNAUTHORIZED (401)
          // Otherwise, try to use cached user to maintain session during temporary blips
          if (err.status === 401) {
            api.setToken(null);
            localStorage.removeItem(CACHE_KEY);
            setUser(null);
          } else {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
              try { setUser(JSON.parse(cached)); } catch { /* ignore */ }
            }
          }
        }
      }
      setLoading(false);
    };
    restore();
  }, []);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    api.setToken(data.token);
    setUser(data.user);
    localStorage.setItem(CACHE_KEY, JSON.stringify(data.user));
    return data.user;
  };

  const register = async (userData) => {
    const data = await api.post('/auth/register', userData);
    api.setToken(data.token);
    setUser(data.user);
    localStorage.setItem(CACHE_KEY, JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    api.setToken(null);
    localStorage.removeItem(CACHE_KEY);
    setUser(null);
  };

  const googleLogin = async (googleData) => {
    const data = await api.post('/auth/google', googleData);
    api.setToken(data.token);
    setUser(data.user);
    localStorage.setItem(CACHE_KEY, JSON.stringify(data.user));
    return data.user;
  };

  // ── Refresh user from DB ───────────────────────────────────────────────────
  const refreshUser = async () => {
    try {
      const data = await api.get('/auth/me');
      setUser(data.user);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      console.warn('refreshUser failed:', err);
      return user;
    }
  };

  // ── Profile update ─────────────────────────────────────────────────────────
  const updateUser = async (updates) => {
    const profileFields = {};
    ['name', 'phone', 'avatar', 'notifications'].forEach(k => {
      if (k in updates) profileFields[k] = updates[k];
    });
    if (Object.keys(profileFields).length > 0 && api.getToken()) {
      try {
        const data = await api.put('/users/profile', profileFields);
        setUser(data.user);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data.user));
        return data.user;
      } catch (err) {
        console.warn('updateUser failed:', err);
      }
    }
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    return updated;
  };

  // ── Addresses ─────────────────────────────────────────────────────────────
  const addAddress = async (addressData) => {
    const data = await api.post('/users/addresses', addressData);
    setUser(data.user);
    return data.user;
  };

  const updateAddress = async (addressId, addressData) => {
    const data = await api.put(`/users/addresses/${addressId}`, addressData);
    setUser(data.user);
    return data.user;
  };

  const deleteAddress = async (addressId) => {
    const data = await api.delete(`/users/addresses/${addressId}`);
    setUser(data.user);
    return data.user;
  };

  // ── Saved Designs ──────────────────────────────────────────────────────────
  const saveDesign = async (designData) => {
    const data = await api.post('/users/designs', designData);
    setUser(data.user);
    return data.user;
  };

  const deleteDesign = async (designId) => {
    const data = await api.delete(`/users/designs/${designId}`);
    setUser(data.user);
    return data.user;
  };

  // ── Favourites ─────────────────────────────────────────────────────────────
  const toggleFavorite = async (productId) => {
    if (!user) return;
    const current = user.favorites || [];
    const isFav = current.includes(productId);
    setUser({ ...user, favorites: isFav ? current.filter(id => id !== productId) : [...current, productId] });
    try {
      await api.post(`/users/favourites/${productId}`, {});
    } catch (err) {
      console.warn('toggleFavorite failed:', err);
      setUser({ ...user, favorites: current });
    }
  };

  const clearNotifications = async () => {
    try {
      await api.delete('/users/notifications/all');
      setUser(prev => {
        const notifs = Array.isArray(prev?.notifications) ? prev.notifications : [];
        return {
          ...prev,
          notifications: []
        };
      });
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ...user, notifications: [] }));
    } catch (err) {
      console.warn('clearNotifications failed:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.put('/users/notifications/read-all');
      setUser(prev => {
        const notifs = Array.isArray(prev?.notifications) ? prev.notifications : [];
        const updated = notifs.map(n => ({ ...n, isRead: true }));
        return { ...prev, notifications: updated };
      });
      // Update cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        data.notifications = (Array.isArray(data.notifications) ? data.notifications : []).map(n => ({ ...n, isRead: true }));
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      }
    } catch (err) {
      console.warn('markAllNotificationsRead failed:', err);
    }
  };

  const value = {
    user, isAuthenticated: !!user, loading,
    login, register, logout, googleLogin, refreshUser, updateUser,
    addAddress, updateAddress, deleteAddress,
    saveDesign, deleteDesign,
    toggleFavorite, clearNotifications, markAllNotificationsRead,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};