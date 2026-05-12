/**
 * Notifications context — single source of truth for bell badge + notification list.
 * Wrap <App> in <NotificationsProvider> in main.jsx.
 *
 * Usage:
 *   const { notifications, unreadCount, fetchNotifications, dismissOne, clearAll } = useNotifications();
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setNotifications([]); return; }
    try {
      const data = await api.get('/users/notifications');
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      /* silent — user may not be logged in */
    }
  }, []);

  // Fetch on mount (token may already exist from a previous session)
  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const dismissOne = useCallback(async (id) => {
    try {
      await api.delete(`/users/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch { /* silent */ }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await api.delete('/users/notifications/all');
      setNotifications([]);
    } catch { /* silent */ }
  }, []);

  const markRead = useCallback(async (id) => {
    try {
      await api.put(`/users/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch { /* silent */ }
  }, []);

  const unreadCount = notifications.filter(n => n && !n.isRead).length;

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      fetchNotifications,
      dismissOne,
      clearAll,
      markRead,
      setNotifications,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationsProvider');
  return ctx;
};
