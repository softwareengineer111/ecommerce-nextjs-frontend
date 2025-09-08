export const API_URL = 'https://ecommerce-backend-hazel-alpha.vercel.app/api';

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  try {
    // Decode the token payload. The payload is the middle part of the token.
    // It's Base64-encoded JSON.
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload; // This should contain user info like id and role
  } catch (e) {
    console.error('Invalid token:', e);
    return null;
  }
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  return res.json();
};
