/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Fallback: seed admin in localStorage so the site works even when server is offline
const seedLocalAdmin = () => {
  const list = JSON.parse(localStorage.getItem('packagingUsersList')) || [];
  if (!list.find(u => u.email === 'admin@packaging.com')) {
    list.push({
      id: 'admin_1', name: 'Admin', email: 'admin@packaging.com',
      password: 'Admin@123', role: 'admin', createdAt: new Date().toISOString(),
      orders: [], addresses: [], savedDesigns: [], loyaltyPoints: 0, favorites: [],
    });
    localStorage.setItem('packagingUsersList', JSON.stringify(list));
  }
};

const localLogin = (email, password) => {
  const list = JSON.parse(localStorage.getItem('packagingUsersList')) || [];
  const u = list.find(u => u.email === email && u.password === password);
  if (!u) throw new Error('Invalid email or password');
  return u;
};

const localRegister = (userData) => {
  const list = JSON.parse(localStorage.getItem('packagingUsersList')) || [];
  if (list.find(u => u.email === userData.email)) throw new Error('Email already in use');
  const newUser = {
    id: `user_${Date.now()}`, ...userData, role: 'user',
    createdAt: new Date().toISOString(),
    orders: [
      { id: 'NP-20241201', date: '2024-12-01', product: 'Custom Mailer Boxes', qty: 250, total: 312.50, status: 'Delivered', tracking: 'UPS1234567890', address: '123 Main St, New York, NY 10001' },
      { id: 'NP-20250115', date: '2025-01-15', product: 'Rigid Setup Boxes', qty: 100, total: 385.00, status: 'Processing', tracking: null, address: '123 Main St' },
    ],
    quotes: [
      { id: 'Q-001', boxType: 'Mailer Box', qty: 500, dims: '12×8×4 in', material: 'Corrugated', date: '2025-01-20', status: 'Quoted', quotedPrice: '$1.24/unit' },
    ],
    addresses: [], savedDesigns: [], loyaltyPoints: 150, favorites: [],
  };
  list.push(newUser);
  localStorage.setItem('packagingUsersList', JSON.stringify(list));
  return newUser;
};

const isDbOffline = (err) =>
  err.offline === true ||
  err.status === 503 ||
  (err.status === 500 && /buffering|not connected|ECONNREFUSED|topology|MongoNetwork|timed out/i.test(err.message)) ||
  /Failed to fetch|NetworkError|fetch/i.test(err.message);

const persistLocal = (userData) => {
  localStorage.setItem('packagingUser', JSON.stringify(userData));
  const list = JSON.parse(localStorage.getItem('packagingUsersList')) || [];
  const idx = list.findIndex(u => u.id === userData.id || u._id === userData._id);
  if (idx > -1) list[idx] = userData; else list.push(userData);
  localStorage.setItem('packagingUsersList', JSON.stringify(list));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    seedLocalAdmin();
    // Try to restore session from token first, then localStorage
    const restore = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const data = await api.get('/auth/me');
          setUser(data.user);
          setServerOnline(true);
          setLoading(false);
          return;
        } catch {
          api.setToken(null);
        }
      }
      // Fallback to localStorage session
      const stored = localStorage.getItem('packagingUser');
      if (stored) setUser(JSON.parse(stored));
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      api.setToken(data.token);
      setUser(data.user);
      persistLocal(data.user);
      setServerOnline(true);
      return data.user;
    } catch (serverErr) {
      const isOffline = isDbOffline(serverErr);
      if (isOffline) {
        const u = localLogin(email, password);
        setUser(u);
        return u;
      }
      throw serverErr;
    }
  };

  const googleLogin = async (profile) => {
    const mockUser = {
      id: profile?.id || `google_${Date.now()}`,
      name: profile?.name || 'Google User',
      email: profile?.email || 'user@gmail.com',
      avatar: profile?.avatar || null,
      role: 'user',
      createdAt: new Date().toISOString(),
      orders: [], addresses: [], savedDesigns: [], loyaltyPoints: 100, favorites: [],
    };
    setUser(mockUser);
    persistLocal(mockUser);
    return mockUser;
  };

  const register = async (userData) => {
    try {
      const data = await api.post('/auth/register', userData);
      api.setToken(data.token);
      setUser(data.user);
      persistLocal(data.user);
      setServerOnline(true);
      return data.user;
    } catch (serverErr) {
      const isOffline = isDbOffline(serverErr);
      if (isOffline) {
        const u = localRegister(userData);
        setUser(u);
        return u;
      }
      throw serverErr;
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    localStorage.removeItem('packagingUser');
    localStorage.removeItem('novapack_token');
    localStorage.removeItem('novapack_user');
  };

  const updateUser = async (updates) => {
    try {
      if (serverOnline && api.getToken()) {
        const data = await api.put('/users/profile', updates);
        setUser(data.user);
        persistLocal(data.user);
        return data.user;
      }
    } catch { /* fall through to local */ }
    const updated = { ...user, ...updates };
    setUser(updated);
    persistLocal(updated);
    return updated;
  };

  const toggleFavorite = (productId) => {
    if (!user) return;
    const favorites = user.favorites || [];
    const isFav = favorites.includes(productId);
    const newFavs = isFav ? favorites.filter(id => id !== productId) : [...favorites, productId];
    updateUser({ favorites: newFavs });
  };

  const value = {
    user, isAuthenticated: !!user, loading, serverOnline,
    login, googleLogin, register, logout, updateUser, toggleFavorite,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
