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
    console.log('payload:', payload); // e.g., { user: { id, role, name }, iat, exp }

    // If the payload has a nested 'user' object, return that.
    // This makes the rest of the app simpler, allowing `user.role`, `user.id`, etc.
    if (payload.user) {
      return payload.user;
    }
    return payload; // Fallback for tokens with flat structure
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
