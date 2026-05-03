// Central API service — all requests go through here
// VITE_API_URL = "/api" on Vercel (same domain), "http://localhost:5000/api" locally
const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const getHeaders = () => {
  const token = localStorage.getItem('designcustombox_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (method, endpoint, body) => {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  const options = { method, headers: getHeaders() };
  if (body !== undefined) options.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(url, options);
  } catch (networkErr) {
    throw new Error('Network error — please check your connection');
  }

  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || res.statusText || 'Unexpected response' };
  }

  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
};

const api = {
  get:    (endpoint)        => request('GET',    endpoint),
  post:   (endpoint, body)  => request('POST',   endpoint, body),
  put:    (endpoint, body)  => request('PUT',    endpoint, body),
  delete: (endpoint)        => request('DELETE', endpoint),
  setToken: (token) => {
    if (token) localStorage.setItem('designcustombox_token', token);
    else localStorage.removeItem('designcustombox_token');
  },
  getToken: () => localStorage.getItem('designcustombox_token'),
};

export default api;
