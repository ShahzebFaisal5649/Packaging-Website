import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext();

const ADMIN_EMAIL = 'admin@novapack.com';
const ADMIN_PASSWORD = 'Admin@123';

function seedAdminUser() {
  const users = JSON.parse(localStorage.getItem('novapack_users') || '[]');
  if (!users.some(u => u.email === ADMIN_EMAIL)) {
    users.push({
      id: 'admin-001',
      email: ADMIN_EMAIL,
      name: 'NovaPack Admin',
      password: ADMIN_PASSWORD,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('novapack_users', JSON.stringify(users));
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    seedAdminUser();
    const storedUser = localStorage.getItem('novapack_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('novapack_user');
      }
    }
    setLoading(false);
  }, []);

  const register = useCallback((email, password, name) => {
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const existingUsers = JSON.parse(localStorage.getItem('novapack_users') || '[]');
    if (existingUsers.some(u => u.email === email)) {
      setError('Email already registered');
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    localStorage.setItem('novapack_users', JSON.stringify(existingUsers));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('novapack_user', JSON.stringify(userWithoutPassword));
    return true;
  }, []);

  const login = useCallback((email, password) => {
    setError(null);

    const users = JSON.parse(localStorage.getItem('novapack_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (!foundUser) {
      setError('Invalid email or password');
      return false;
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('novapack_user', JSON.stringify(userWithoutPassword));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('novapack_user');
    setError(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    if (!user) return false;
    const updatedUser = { ...user, ...updates };
    const users = JSON.parse(localStorage.getItem('novapack_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem('novapack_users', JSON.stringify(users));
    }
    setUser(updatedUser);
    localStorage.setItem('novapack_user', JSON.stringify(updatedUser));
    return true;
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    isLoading: loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
