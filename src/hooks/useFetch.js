import { useState, useEffect, useCallback } from 'react';

/**
 * Safe data-fetching hook with timeout + abort support.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFetch('/api/content/products');
 */
export function useFetch(url, options = {}) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 10000);

    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      setData(await res.json());
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message || 'Something went wrong.');
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
