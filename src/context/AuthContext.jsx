/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from JWT → get fresh DB data
  useEffect(() => {
    const restore = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const data = await api.get('/auth/me');
          setUser(data.user);
        } catch {
          api.setToken(null);
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
    return data.user;
  };

  const register = async (userData) => {
    const data = await api.post('/auth/register', userData);
    api.setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  const googleLogin = async (googleData) => {
    const data = await api.post('/auth/google', googleData);
    api.setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  // ── Refresh user from DB ───────────────────────────────────────────────────
  const refreshUser = async () => {
    try {
      const data = await api.get('/auth/me');
      setUser(data.user);
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
        return data.user;
      } catch (err) {
        console.warn('updateUser failed:', err);
      }
    }
    const updated = { ...user, ...updates };
    setUser(updated);
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
    // Optimistic update
    setUser({ ...user, favorites: isFav ? current.filter(id => id !== productId) : [...current, productId] });
    try {
      await api.post(`/users/favourites/${productId}`, {});
    } catch (err) {
      console.warn('toggleFavorite failed:', err);
      setUser({ ...user, favorites: current });
    }
  };

  const value = {
    user, isAuthenticated: !!user, loading,
    login, register, logout, googleLogin, refreshUser, updateUser,
    addAddress, updateAddress, deleteAddress,
    saveDesign, deleteDesign,
    toggleFavorite,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};